/**
 * 基于 entry 可达范围分桶的 Tailwind 类名混淆插件。
 *
 * 1. 先收集候选 class
 *
 * - `tw-patch extract` 会先产出一份标准 utility 列表。
 * - 本插件只会处理这份列表里的 class，避免误伤普通业务 class。
 *
 * 2. 再计算每个文件最终被哪些 entry 可达
 *
 * - 每个 Vite input 都直接视为一个独立 entry 起点。
 * - 再通过 bundler graph 的 `imports` / `importedCss` / `importedAssets` 沿最终产物关系继续传播归属。
 * - 对 HTML 产物，还会额外读取最终 `href` / `src` 里引用到的 `assets/*`，把页面模板和最终 CSS / JS 资产重新连起来。
 * - 这里刻意看“最终产物可达关系”，而不是只看源码目录归属。
 *
 * 3. 按 entry 可达集合分 bucket
 *
 * - Bucket 的含义是：“最终产物里，哪些 entry 能访问到这份文件”。
 * - 如果两个文件最终都只被 `post` 访问，它们就在同一个 `post` bucket。
 * - 如果一个文件会同时被 `post` 和 `page-like-post-style` 访问，它就进入 `post|page-like-post-style` bucket。
 *
 * 4. 每个 utility 只生成一份最终短类名映射
 *
 * - 这里的 canonical bucket 不是新入口，也不是新文件。
 * - 它只是“同一个 utility 命中了哪些文件桶”之后，把这些桶做并集得到的唯一 key。
 * - 这样 HTML / CSS / JS 看到的就会是同一份映射，不会出现同一个 utility 在不同产物里名字不一致。
 * - 全局共享桶保留最短前缀 `_`，其他 bucket 稳定分配 `a_`、`b_`、`c_`……
 *
 * 为什么先合并 bucket 再生成映射：
 *
 * - 先按文件算“文件桶”：这个 HTML / CSS / JS 文件最终能被哪些 entry 访问到。
 * - 再按 utility 回看：这个 utility 出现在哪些文件里，这些文件又分别属于哪些文件桶。
 * - 最后把这些文件桶合成一个 canonical bucket，给这个 utility 只分配一次短名。
 * - 例如 `mdi--eye-outline` 同时出现在 `post.html`、`post` 对应的 CSS、以及 `page-like-post-style` 共享 CSS 里：
 *
 *   - `post.html` 只属于 `post`
 *   - `post` 对应的 CSS 可能属于 `page-like-post-style|post`
 *   - `page-like-post-style` 的共享 CSS 也属于 `page-like-post-style|post`
 *   - 所以这个 utility 的 canonical bucket 最后就是 `page-like-post-style|post`
 * - 这样 HTML 和 CSS 才会拿到同一个短名，不会一个是 `ac_m`，另一个是 `aa_o`。
 * - 如果不做这一步，HTML 和 CSS 可能会各自生成不同短名，结果就会对不齐。
 *
 * 这套方案的取舍：
 *
 * - 优点：同一个 utility 在 HTML / CSS / JS 里始终一致。
 * - 缺点：共享范围越大，能省下来的前缀就越少。
 *
 * 额外的作用域取舍：
 *
 * - 现在除了短类名映射，还会给非全局 bucket 分配一个 Vue scoped CSS 风格的裸属性作用域，比如 `_a`、`_b`。
 * - 这里故意不只给“组件根节点”打作用域，而是按元素当前实际命中的 utility，给它补上对应 bucket 的裸属性作用域。
 * - 原因是主题模板经常出现多根节点，或者用 `th:block` 这种不会真正输出到最终 DOM 的假根节点。
 * - 如果只依赖单根容器，scope 很容易在模板层失效；把作用域属性直接打到每个实际元素上，才能稳定对齐最终渲染结果。
 * - 一个元素如果同时命中了多个非全局 utility bucket，就会同时带上多个裸属性；这是预期行为，因为前缀表达的是“最终可达范围”，不是“源码文件归属”。
 * - 同时刻意跳过 `head` 子树，因为那里只承载资源声明，不参与组件 DOM 作用域。
 *
 * 5. 最后按 bucket 改写 bundle 并输出映射
 *
 * - 扫描阶段和改写阶段都尽量复用官方 handler，而不是手写正则替换。
 * - 插件会后挂到 Vite 内部 `vite:build-import-analysis` 的 `generateBundle`，这样既能拿到最终 HTML，又早于 `vite-plugin-sri3` 计算 `integrity`。
 * - 最后把 mapping/debug 产物写到 `.tw-patch/`，用于排查 bucket 和类名归属。
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, extname, relative, resolve } from "node:path";

import { Context, cssHandler, htmlHandler, jsHandler } from "@tailwindcss-mangle/core";
import { defaultMangleClassFilter } from "@tailwindcss-mangle/shared";
import type { Plugin } from "vite";

interface TailwindcssMangleSignaturesPluginOptions {
  base: string;
  classListFile?: string;
  input: Record<string, string>;
  mappingFile?: string;
  projectRoot: string;
  templateRoot: string;
}

interface MappingEntry {
  bucket: string;
  entries: string[];
  files: string[];
  mangled: string;
  original: string;
  prefix: string;
  scope: string | null;
}

interface DebugSummary {
  bucketKeys: string[];
  classFiles: string[];
  entriesByFile: Record<string, string[]>;
  filesByBucket: Record<string, string[]>;
  entryOutputFiles: Record<string, string>;
  bucketSummary: Record<string, { classCount: number; fileCount: number; prefix: string; scope: string | null }>;
}

interface BundleMetadataLike {
  importedAssets?: ReadonlySet<string>;
  importedCss?: ReadonlySet<string>;
}

interface BundleChunkLike {
  code: string;
  dynamicImports?: readonly string[];
  fileName: string;
  implicitlyLoadedBefore?: readonly string[];
  imports?: readonly string[];
  type: "chunk";
  viteMetadata?: BundleMetadataLike;
}

interface BundleAssetLike {
  fileName: string;
  source: string | Uint8Array;
  type: "asset";
  viteMetadata?: BundleMetadataLike;
}

type BundleFileLike = BundleAssetLike | BundleChunkLike;

const DEFAULT_CLASS_LIST_FILE = ".tw-patch/tw-class-list.json";
const DEFAULT_MAPPING_FILE = ".tw-patch/tw-mangle-mapping.json";
const CSS_FILE_EXTENSION = ".css";
const HTML_FILE_EXTENSION = ".html";
const JS_FILE_EXTENSIONS = new Set([".js"]);
const VITE_INTERNAL_ANALYSIS_PLUGIN = "vite:build-import-analysis";
const UTF8_TEXT_DECODER = new TextDecoder("utf8");
const requireFromCurrentModule = createRequire(import.meta.url);
const requireFromUtwmCore = createRequire(requireFromCurrentModule.resolve("@tailwindcss-mangle/core"));

interface HtmlParserLike {
  end(): void;
  endIndex: number;
  startIndex: number;
  write(sourceText: string): void;
}

type HtmlParserConstructor = new (callbacks: {
  onopentag?: (tagName: string, attributes: Record<string, string>) => void;
}) => HtmlParserLike;

interface SelectorClassNodeLike {
  parent?: {
    insertAfter(referenceNode: SelectorClassNodeLike, nextNode: unknown): void;
  };
  value: string;
}

interface SelectorRootLike {
  walkClasses(callback: (classNode: SelectorClassNodeLike) => void): void;
}

interface SelectorParserProcessorLike {
  processSync(selectorText: string): string;
}

type SelectorParserFactory = ((transformer: (root: SelectorRootLike) => void) => SelectorParserProcessorLike) & {
  attribute(options: { attribute: string }): unknown;
};

interface PostcssRuleLike {
  selector: string;
}

interface PostcssProcessResultLike {
  css: string;
}

interface PostcssProcessorLike {
  process(
    sourceText: string,
    options: {
      from?: string;
      to?: string;
    },
  ): Promise<PostcssProcessResultLike>;
}

type PostcssFactory = (plugins: readonly unknown[]) => PostcssProcessorLike;

const { Parser: HtmlParser } = requireFromUtwmCore("htmlparser2") as { Parser: HtmlParserConstructor };
const selectorParserModule = requireFromUtwmCore("postcss-selector-parser") as {
  default?: SelectorParserFactory;
};
const selectorParser = (selectorParserModule.default ?? selectorParserModule) as SelectorParserFactory;
const postcssModule = requireFromUtwmCore("postcss") as {
  default?: PostcssFactory;
};
const createPostcssProcessor = (postcssModule.default ?? postcssModule) as PostcssFactory;

/** 统一路径分隔符，避免 Windows 路径影响后续匹配。 */
function normalizePathSeparators(value: string): string {
  return value.replaceAll("\\", "/");
}

/** 将源码 HTML 输入路径映射成最终输出目录中的 HTML 相对路径。 */
function toOutputHtmlFileName(templateRoot: string, inputFile: string): string | null {
  // 这里故意只把 HTML input 当作页面 entry 起点。
  // 纯 TS / CSS input 当前不参与 bucket 传播，这是插件的预期语义，
  // 因为它服务的是模板页面可达范围，而不是任意资源入口。
  if (extname(inputFile) !== HTML_FILE_EXTENSION) {
    return null;
  }

  return normalizePathSeparators(relative(templateRoot, inputFile));
}

/** 生成 a, b, ... z, aa, ab ... 这种稳定短序列。 */
function getSequenceLabel(index: number): string {
  let remaining = index;
  let result = "";

  while (remaining >= 0) {
    result = String.fromCharCode(97 + (remaining % 26)) + result;
    remaining = Math.floor(remaining / 26) - 1;
  }

  return result;
}

/** 生成 `_a`、`_b`、`_c` 这种稳定裸属性作用域名。 */
function getScopeAttributeName(index: number): string {
  return `_${getSequenceLabel(index)}`;
}

/** 把多个 file bucket 合并成一个 canonical bucket。 */
function mergeBucketKeys(bucketKeys: readonly string[]): string {
  const entryNames = new Set<string>();

  for (const bucketKey of bucketKeys) {
    if (bucketKey === "") {
      continue;
    }

    for (const entryName of bucketKey.split("|")) {
      if (entryName !== "") {
        entryNames.add(entryName);
      }
    }
  }

  return [...entryNames].sort().join("|");
}

/** 判断 bundle 条目是否至少像个输出文件节点。 */
function isBundleFileLike(value: unknown): value is BundleFileLike {
  return typeof value === "object" && value !== null && "fileName" in value && "type" in value;
}

/** 转义普通字符串，供动态正则拼接使用。 */
function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** 统一并校验外部传入的 base，保证后续匹配总是以 `/` 结尾。 */
function normalizeBasePath(base: string): string {
  const normalizedBase = normalizePathSeparators(base).trim();

  if (normalizedBase === "") {
    throw new TypeError("tailwindcss-mangle-signatures requires a non-empty base");
  }

  return normalizedBase.endsWith("/") ? normalizedBase : `${normalizedBase}/`;
}

/** 根据主题 base 生成 HTML 中 `href` / `src` 的资源回连正则。 */
function createHtmlAssetReferenceRegex(base: string): RegExp {
  const escapedBase = escapeRegExp(base);
  const bareUrlPattern = `${escapedBase}([^\\s"'=<>]+)`;

  return new RegExp(
    String.raw`(?:href|src)\s*=\s*(?:"${escapedBase}([^"]+)"|'${escapedBase}([^']+)'|${bareUrlPattern})`,
    "gmu",
  );
}

/** 当前这套改写只接受文本资源。 */
function isTextOutputFile(fileName: string): boolean {
  const extension = extname(fileName);

  return (
    fileName.endsWith(HTML_FILE_EXTENSION) || fileName.endsWith(CSS_FILE_EXTENSION) || JS_FILE_EXTENSIONS.has(extension)
  );
}

/** 把 bundle 里的资源内容统一成可供 handler 处理的文本。 */
function toTextBundleFileContent(fileName: string, sourceContent: BundleFileContent | undefined): string | null {
  if (sourceContent === undefined || !isTextOutputFile(fileName)) {
    return null;
  }

  if (typeof sourceContent === "string") {
    return sourceContent;
  }

  return UTF8_TEXT_DECODER.decode(sourceContent);
}

/** 去掉 query/hash，便于把 HTML 里的资源引用映射回 bundle 文件名。 */
function normalizeReferencedBundleFileName(reference: string): string {
  return reference.split(/[?#]/u, 1)[0] ?? reference;
}

/**
 * 基于 bundler metadata 构建最终资源图。
 *
 * 除了 chunk / asset metadata 里的静态引用外，还会把最终 HTML 中显式写出的 base 下资源链接补回图里。
 *
 * 这是因为 Vite 输出的 HTML 资产本身不带 `viteMetadata`，如果不补这条边，页面 HTML 虽然能拿到 entry 归属，但它引用到的最终 CSS / JS 资产会丢失归属，进而导致 HTML 已改名而 CSS
 * / JS 仍停留在原始 utility。
 */
function buildAssetGraph(
  bundle: Record<string, unknown>,
  bundleFileContents: ReadonlyMap<string, BundleFileContent>,
  htmlAssetReferenceRegex: RegExp,
): Map<string, Set<string>> {
  const graph = new Map<string, Set<string>>();
  const availableFiles = new Set(
    Object.values(bundle)
      .filter(isBundleFileLike)
      .map((bundleFile) => bundleFile.fileName),
  );

  for (const bundleValue of Object.values(bundle)) {
    if (!isBundleFileLike(bundleValue)) {
      continue;
    }

    const references = new Set<string>();

    if (bundleValue.type === "chunk") {
      for (const reference of bundleValue.imports ?? []) {
        if (availableFiles.has(reference)) {
          references.add(reference);
        }
      }

      for (const reference of bundleValue.dynamicImports ?? []) {
        if (availableFiles.has(reference)) {
          references.add(reference);
        }
      }

      for (const reference of bundleValue.implicitlyLoadedBefore ?? []) {
        if (availableFiles.has(reference)) {
          references.add(reference);
        }
      }
    }

    for (const reference of bundleValue.viteMetadata?.importedAssets ?? []) {
      if (availableFiles.has(reference)) {
        references.add(reference);
      }
    }

    for (const reference of bundleValue.viteMetadata?.importedCss ?? []) {
      if (availableFiles.has(reference)) {
        references.add(reference);
      }
    }

    graph.set(bundleValue.fileName, references);
  }

  for (const [fileName, sourceContent] of bundleFileContents.entries()) {
    if (!fileName.endsWith(HTML_FILE_EXTENSION)) {
      continue;
    }

    const sourceText = toTextBundleFileContent(fileName, sourceContent);

    if (sourceText === null) {
      continue;
    }

    const references = graph.get(fileName) ?? new Set<string>();

    for (const match of sourceText.matchAll(htmlAssetReferenceRegex)) {
      // `match[0]` 是整段 `href=` / `src=` 命中的原始文本，这里不需要；
      // 只关心三个互斥捕获组里真正命中的那个路径：
      // 1. 双引号 2. 单引号 3. 无引号。
      const [, doubleQuotedPath, singleQuotedPath, barePath] = match;
      const referencedPath = doubleQuotedPath ?? singleQuotedPath ?? barePath ?? "";
      const referencedFileName = normalizeReferencedBundleFileName(referencedPath);

      if (referencedFileName !== "" && availableFiles.has(referencedFileName)) {
        references.add(referencedFileName);
      }
    }

    graph.set(fileName, references);
  }

  return graph;
}

/**
 * 从若干起点出发，收集图中所有可达文件。
 *
 * 这里同时用于：
 *
 * - HTML 页面入口 -> 最终 CSS / JS / asset 产物可达性传播
 * - 任意已知产物节点 -> bundler 资源图继续扩散
 */
function collectReachableFiles(
  graph: ReadonlyMap<string, ReadonlySet<string>>,
  entryFileNames: readonly string[],
): Set<string> {
  const visitedFiles = new Set<string>();
  const pendingFiles = [...entryFileNames];

  while (pendingFiles.length > 0) {
    const currentFile = pendingFiles.pop();

    if (currentFile === undefined || visitedFiles.has(currentFile)) {
      continue;
    }

    visitedFiles.add(currentFile);

    const references = graph.get(currentFile);

    if (references === undefined) {
      continue;
    }

    for (const reference of references) {
      if (!visitedFiles.has(reference)) {
        pendingFiles.push(reference);
      }
    }
  }

  return visitedFiles;
}

/** 将 `Map<string, Set<string>>` 转成稳定排序后的普通对象，便于输出调试文件。 */
function toSortedRecord(map: ReadonlyMap<string, ReadonlySet<string>>): Record<string, string[]> {
  return Object.fromEntries(
    [...map.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, values]) => [key, [...values].sort()]),
  );
}

/** 计算 HTML 起始标签里插入作用域属性的准确位置，兼容普通标签和自闭合标签。 */
function getHtmlScopeInsertionIndex(sourceText: string, tagEndIndex: number): number {
  let insertionIndex = tagEndIndex;

  while (insertionIndex > 0 && /\s/u.test(sourceText[insertionIndex - 1] ?? "")) {
    insertionIndex--;
  }

  if (sourceText[insertionIndex - 1] === "/") {
    return insertionIndex - 1;
  }

  return tagEndIndex;
}

/**
 * 给 HTML 文件 `body` 相关部分里的每个实际元素按需补上裸属性作用域。
 *
 * 这里刻意不依赖“单根组件”假设，而是学习 Vue scoped CSS 的思路，直接给每个实际元素打点。 这样即使模板是多根节点，或者根本没有真实根、只是 `th:block` 假根，也不会丢掉作用域边界。
 *
 * 同时也不是“整文件统一打一坨 scope”，而是按元素自身最终命中的 mangled class 反推：
 *
 * - 只有真正带了 bucket utility 的元素才会拿到 scope
 * - 拿多少 scope，就取决于这个元素当前 class 里实际命中了哪些 utility bucket
 * - 没有 utility class 的元素不用带 scope，避免无意义污染模板
 *
 * 同时刻意跳过 `head` 子树：
 *
 * - 这些标签不会参与最终页面里的组件 DOM 匹配
 * - 继续给 `<link>` / `<meta>` 之类资源声明打 scope 只会让模板更脏，没有收益
 */
function injectScopeAttributeIntoHtml(
  sourceText: string,
  scopeAttributesByMangledClassName: ReadonlyMap<string, ReadonlySet<string>>,
): string {
  const scopedInsertions: Array<{ index: number; scopeAttributes: string[] }> = [];
  let headDepth = 0;
  const parser = new HtmlParser({
    onopentag(tagName, attributes) {
      const normalizedTagName = tagName.toLowerCase();

      if (normalizedTagName === "head") {
        headDepth++;
        return;
      }

      if (headDepth > 0 || normalizedTagName === "th:block") {
        return;
      }

      const classAttributeValue = attributes.class;

      if (typeof classAttributeValue !== "string" || classAttributeValue.trim() === "") {
        return;
      }

      const scopeAttributes = new Set<string>();

      for (const className of classAttributeValue.split(/\s+/u)) {
        const classScopeAttributes = scopeAttributesByMangledClassName.get(className);

        if (classScopeAttributes === undefined) {
          continue;
        }

        for (const scopeAttribute of classScopeAttributes) {
          scopeAttributes.add(scopeAttribute);
        }
      }

      if (scopeAttributes.size === 0) {
        return;
      }

      scopedInsertions.push({
        index: getHtmlScopeInsertionIndex(sourceText, parser.endIndex),
        scopeAttributes: [...scopeAttributes].sort(),
      });
    },
    onclosetag(tagName) {
      if (tagName.toLowerCase() === "head" && headDepth > 0) {
        headDepth--;
      }
    },
  });

  parser.write(sourceText);
  parser.end();

  let scopedHtml = sourceText;

  for (const { index, scopeAttributes } of scopedInsertions.toReversed()) {
    scopedHtml = `${scopedHtml.slice(0, index)} ${scopeAttributes.join(" ")}${scopedHtml.slice(index)}`;
  }

  return scopedHtml;
}

/**
 * 给 bucket 内的 utility 选择器按 class 自己的 bucket 补上 Vue 风格的作用域属性。
 *
 * 这里故意只处理当前文件实际命中的 mangled utility class，不碰自定义业务选择器。 这样既能隔离不同 bucket 的同名 utility，又不会误伤像 `#header-post a` 这种手写规则。
 */
async function injectScopeAttributeIntoCss(
  sourceText: string,
  scopeAttributesByMangledClassName: ReadonlyMap<string, ReadonlySet<string>>,
  fileName: string,
): Promise<string> {
  if (scopeAttributesByMangledClassName.size === 0) {
    return sourceText;
  }

  const plugin = {
    postcssPlugin: "tailwindcss-mangle-signatures-scope-attribute",
    Rule(rule: PostcssRuleLike) {
      rule.selector = selectorParser((selectors) => {
        selectors.walkClasses((classNode) => {
          const scopeAttributes = scopeAttributesByMangledClassName.get(classNode.value);

          if (scopeAttributes === undefined || scopeAttributes.size === 0) {
            return;
          }

          for (const scopeAttribute of [...scopeAttributes].sort().toReversed()) {
            classNode.parent?.insertAfter(classNode, selectorParser.attribute({ attribute: scopeAttribute }));
          }
        });
      }).processSync(rule.selector);
    },
  } satisfies {
    Rule(rule: PostcssRuleLike): void;
    postcssPlugin: string;
  };

  const { css } = await createPostcssProcessor([plugin]).process(sourceText, {
    from: fileName,
    to: fileName,
  });

  return css;
}

const SCAN_MARKER_PREFIX = "__tw_scan_";
const SCAN_MARKER_REGEX = /__tw_scan_(\d+)__/gmu;

/** 为扫描阶段生成稳定且可回收的占位类名。 */
function toScanMarker(index: number): string {
  return `${SCAN_MARKER_PREFIX}${index}__`;
}

/**
 * 为单个 bucket 构造局部 UTWM 上下文。
 *
 * 这里不复用官方 `initConfig()` 的整套初始化流程，因为：
 *
 * - 当前插件的 bucket 逻辑已经先算出了最终 `original -> mangled`
 * - 我们只需要复用官方 handler 的 AST / 解析器改写能力
 * - 不希望再回退到“全局一张映射表”的语义
 *
 * 所以这里只手动注入最小必需状态：
 *
 * - `replaceMap`：供 handler 判断哪些类需要替换
 * - `classGenerator.newClassMap`：供 handler 在改写时读取既定短名
 */
function createBucketContext(mapping: ReadonlyMap<string, string>): Context {
  const ctx = new Context();

  for (const [originalClassName, mangledClassName] of mapping.entries()) {
    ctx.replaceMap.set(originalClassName, mangledClassName);
    ctx.classSet.add(originalClassName);
    ctx.classGenerator.newClassMap[originalClassName] = {
      name: mangledClassName,
      usedBy: new Set<string>(),
    };
  }

  return ctx;
}

/**
 * 用官方 UTWM handler 改写最终产物。
 *
 * 这样做的意义不是改变 bucket 语义，而是把“怎么安全地改 HTML/CSS/JS”这件事重新交给官方实现：
 *
 * - HTML：`htmlparser2`
 * - CSS：`postcss` + `postcss-selector-parser`
 * - JS：Babel AST + `MagicString`
 */
async function rewriteWithUtwmHandler(
  sourceText: string,
  fileName: string,
  mapping: ReadonlyMap<string, string>,
  scopeAttributesByMangledClassName?: ReadonlyMap<string, ReadonlySet<string>>,
): Promise<string> {
  const ctx = createBucketContext(mapping);
  const extension = extname(fileName);

  if (fileName.endsWith(HTML_FILE_EXTENSION)) {
    const rewrittenHtml = htmlHandler(sourceText, { ctx, id: fileName }).code;

    if (scopeAttributesByMangledClassName === undefined) {
      return rewrittenHtml;
    }

    return injectScopeAttributeIntoHtml(rewrittenHtml, scopeAttributesByMangledClassName);
  }

  if (fileName.endsWith(CSS_FILE_EXTENSION)) {
    const rewrittenCss = (await cssHandler(sourceText, { ctx, id: fileName })).code;

    if (scopeAttributesByMangledClassName === undefined) {
      return rewrittenCss;
    }

    return injectScopeAttributeIntoCss(rewrittenCss, scopeAttributesByMangledClassName, fileName);
  }

  if (JS_FILE_EXTENSIONS.has(extension)) {
    return jsHandler(sourceText, { ctx, id: fileName }).code;
  }

  return sourceText;
}

/**
 * 用官方 handler 做“只扫描不落盘”的类名提取。
 *
 * 做法不是手写 HTML/CSS/JS regex，而是：
 *
 * 1. 给每个已知 class 临时分配唯一 marker
 * 2. 跑一遍 UTWM 官方 handler
 * 3. 再从改写结果里回收 marker，反推出本文件实际命中的 class
 *
 * 这样扫描和真正改写共用同一套解析路径：
 *
 * - HTML：`htmlHandler`
 * - CSS：`cssHandler`
 * - JS：`jsHandler`
 */
async function collectClassesWithUtwmHandler(
  sourceText: string,
  fileName: string,
  knownClasses: readonly string[],
): Promise<Set<string>> {
  const markerToClassName = new Map<string, string>();
  const classNameToMarker = new Map<string, string>();

  for (const [classIndex, className] of knownClasses.entries()) {
    const marker = toScanMarker(classIndex);
    classNameToMarker.set(className, marker);
    markerToClassName.set(marker, className);
  }

  const rewrittenText = await rewriteWithUtwmHandler(sourceText, fileName, classNameToMarker);
  const classes = new Set<string>();

  for (const match of rewrittenText.matchAll(SCAN_MARKER_REGEX)) {
    const [marker = ""] = match;
    const className = markerToClassName.get(marker);

    if (className !== undefined) {
      classes.add(className);
    }
  }

  return classes;
}

type GenerateBundleHook = NonNullable<Plugin["generateBundle"]>;
type GenerateBundleHandler = (...args: unknown[]) => Promise<void> | void;

/**
 * 像 `vite-plugin-sri3` 一样，把逻辑后挂到 Vite 内部的 `generateBundle`。
 *
 * 这么做是为了同时满足两个条件：
 *
 * - 能看到 `vite:build-html` 已经产出的最终 HTML 资产
 * - 又必须早于 `vite-plugin-sri3` 的哈希计算
 */
function hijackGenerateBundle(plugin: Plugin, afterHook: GenerateBundleHandler): void {
  const hook = plugin.generateBundle;

  if (typeof hook === "object" && hook.handler !== undefined) {
    const originalHandler = hook.handler;
    hook.handler = async function (...args) {
      await originalHandler.apply(this, args);
      await afterHook.apply(this, args);
    };
    return;
  }

  if (typeof hook === "function") {
    plugin.generateBundle = async function (...args) {
      await hook.apply(this, args);
      await afterHook.apply(this, args);
    } satisfies GenerateBundleHook;
  }
}

type BundleFileContent = string | Uint8Array;

/** 收集 bundle 里所有可改写文件，保留文本和二进制原始类型。 */
function collectBundleFileContents(bundle: Record<string, unknown>): Map<string, BundleFileContent> {
  const bundleFileContents = new Map<string, BundleFileContent>();

  for (const bundleValue of Object.values(bundle)) {
    if (!isBundleFileLike(bundleValue)) {
      continue;
    }

    if (bundleValue.type === "asset") {
      bundleFileContents.set(bundleValue.fileName, bundleValue.source);
      continue;
    }

    bundleFileContents.set(bundleValue.fileName, bundleValue.code);
  }

  return bundleFileContents;
}

/** 把改写后的内容写回 bundle，二进制保持原样，文本按字符串回填。 */
function applyBundleFileContents(
  bundle: Record<string, unknown>,
  bundleFileContents: ReadonlyMap<string, BundleFileContent>,
): void {
  for (const [fileName, sourceContent] of bundleFileContents.entries()) {
    const bundleValue = bundle[fileName];

    if (!isBundleFileLike(bundleValue)) {
      continue;
    }

    if (bundleValue.type === "asset") {
      bundleValue.source = sourceContent;
      continue;
    }

    if (typeof sourceContent !== "string") {
      throw new TypeError(`Chunk output must remain text: ${fileName}`);
    }

    bundleValue.code = sourceContent;
  }
}

export default function tailwindcssMangleSignaturesPlugin(options: TailwindcssMangleSignaturesPluginOptions): Plugin {
  const normalizedBase = normalizeBasePath(options.base);
  const classListFile = resolve(options.projectRoot, options.classListFile ?? DEFAULT_CLASS_LIST_FILE);
  const htmlAssetReferenceRegex = createHtmlAssetReferenceRegex(normalizedBase);
  const mappingFile = resolve(options.projectRoot, options.mappingFile ?? DEFAULT_MAPPING_FILE);
  const entryOutputFiles = new Map<string, string>();
  let knownClasses: string[] = [];

  for (const [entryKey, inputFile] of Object.entries(options.input)) {
    const outputHtmlFileName = toOutputHtmlFileName(options.templateRoot, inputFile);

    if (outputHtmlFileName === null) {
      continue;
    }

    entryOutputFiles.set(entryKey, outputHtmlFileName);
  }

  const rewriteBundle = async (bundle: Record<string, unknown>): Promise<void> => {
    const entriesByFile = new Map<string, Set<string>>();
    const classesByFile = new Map<string, Set<string>>();
    const filesByClass = new Map<string, Set<string>>();
    const bucketKeysByClass = new Map<string, Set<string>>();
    const filesByBucket = new Map<string, Set<string>>();
    const classNameMapByBucket = new Map<string, Map<string, string>>();
    const entryKeys = [...entryOutputFiles.keys()].sort();
    const globalBucketKey = entryKeys.join("|");
    const bundleFileContents = collectBundleFileContents(bundle);
    const assetGraph = buildAssetGraph(bundle, bundleFileContents, htmlAssetReferenceRegex);
    const fileNamesToRewrite = new Set(bundleFileContents.keys());

    for (const [entryKey, outputHtmlFileName] of entryOutputFiles.entries()) {
      if (!bundleFileContents.has(outputHtmlFileName)) {
        continue;
      }

      const entryFileEntries = entriesByFile.get(outputHtmlFileName) ?? new Set<string>();
      entryFileEntries.add(entryKey);
      entriesByFile.set(outputHtmlFileName, entryFileEntries);

      // 每个 input 自己就是一个 entry 起点，后续只沿 bundler 资源图继续传播。
      const reachableAssetFiles = collectReachableFiles(assetGraph, [outputHtmlFileName]);

      for (const fileName of reachableAssetFiles) {
        const entries = entriesByFile.get(fileName) ?? new Set<string>();
        entries.add(entryKey);
        entriesByFile.set(fileName, entries);
      }
    }

    for (const fileName of fileNamesToRewrite) {
      const sourceText = toTextBundleFileContent(fileName, bundleFileContents.get(fileName));

      if (sourceText === null) {
        continue;
      }

      const classes = await collectClassesWithUtwmHandler(sourceText, fileName, knownClasses);

      if (classes.size === 0) {
        continue;
      }

      classesByFile.set(fileName, classes);

      const entries = [...(entriesByFile.get(fileName) ?? new Set<string>())].sort();

      if (entries.length === 0) {
        continue;
      }

      const bucketKey = entries.join("|");
      const bucketFiles = filesByBucket.get(bucketKey) ?? new Set<string>();
      bucketFiles.add(fileName);
      filesByBucket.set(bucketKey, bucketFiles);

      for (const className of classes) {
        const bucketKeys = bucketKeysByClass.get(className) ?? new Set<string>();
        bucketKeys.add(bucketKey);
        bucketKeysByClass.set(className, bucketKeys);

        const classFiles = filesByClass.get(className) ?? new Set<string>();
        classFiles.add(fileName);
        filesByClass.set(className, classFiles);
      }
    }

    for (const [className, bucketKeys] of bucketKeysByClass.entries()) {
      const canonicalBucketKey = mergeBucketKeys([...bucketKeys]);
      const bucketClassNames = classNameMapByBucket.get(canonicalBucketKey) ?? new Map<string, string>();

      bucketClassNames.set(className, "");
      classNameMapByBucket.set(canonicalBucketKey, bucketClassNames);
    }

    const sortedBucketKeys = [...classNameMapByBucket.keys()].sort((left, right) => {
      if (left === globalBucketKey) {
        return -1;
      }

      if (right === globalBucketKey) {
        return 1;
      }

      return left.localeCompare(right);
    });
    const bucketPrefixMap = new Map<string, string>();
    const bucketScopeAttributeMap = new Map<string, string>();
    let nextBucketIndex = 0;

    for (const bucketKey of sortedBucketKeys) {
      // 所有页面都能访问到的那个 bucket 被视为“全局共享桶”，
      // 故意保留最短前缀 `_`。
      if (bucketKey === globalBucketKey && entryKeys.length > 0) {
        bucketPrefixMap.set(bucketKey, "_");
        continue;
      }

      // 其他 bucket 按排序后的稳定顺序分配前缀。
      bucketPrefixMap.set(bucketKey, `${getSequenceLabel(nextBucketIndex)}_`);
      bucketScopeAttributeMap.set(bucketKey, getScopeAttributeName(nextBucketIndex));
      nextBucketIndex++;
    }

    const mappingEntries: MappingEntry[] = [];
    const classNameToMangledName = new Map<string, string>();
    const classNameToScopeAttribute = new Map<string, string>();

    for (const bucketKey of sortedBucketKeys) {
      const bucketClassNames = classNameMapByBucket.get(bucketKey);
      const prefix = bucketPrefixMap.get(bucketKey);
      const scopeAttribute = bucketScopeAttributeMap.get(bucketKey) ?? null;

      if (bucketClassNames === undefined || prefix === undefined) {
        continue;
      }

      const sortedClassNames = [...bucketClassNames.keys()].sort();

      for (const [classIndex, className] of sortedClassNames.entries()) {
        const mangledName = `${prefix}${getSequenceLabel(classIndex)}`;
        bucketClassNames.set(className, mangledName);
        classNameToMangledName.set(className, mangledName);
        if (scopeAttribute !== null) {
          classNameToScopeAttribute.set(className, scopeAttribute);
        }
        mappingEntries.push({
          bucket: bucketKey,
          entries: bucketKey === "" ? [] : bucketKey.split("|"),
          files: [...(filesByClass.get(className) ?? new Set<string>())].sort(),
          mangled: mangledName,
          original: className,
          prefix,
          scope: scopeAttribute,
        });
      }
    }

    for (const [fileName, sourceText] of bundleFileContents.entries()) {
      const classes = classesByFile.get(fileName);

      if (classes === undefined) {
        continue;
      }

      const textSource = toTextBundleFileContent(fileName, sourceText);

      if (textSource === null) {
        continue;
      }

      const entries = [...(entriesByFile.get(fileName) ?? new Set<string>())].sort();

      if (entries.length === 0) {
        continue;
      }

      const localMapping = new Map<string, string>();
      const scopeAttributesByMangledClassName = new Map<string, Set<string>>();

      for (const className of classes) {
        const mangledName = classNameToMangledName.get(className);

        if (mangledName !== undefined && mangledName !== "") {
          localMapping.set(className, mangledName);
        }

        const scopeAttribute = classNameToScopeAttribute.get(className);

        if (mangledName === undefined || scopeAttribute === undefined) {
          continue;
        }

        const scopeAttributes = scopeAttributesByMangledClassName.get(mangledName) ?? new Set<string>();
        scopeAttributes.add(scopeAttribute);
        scopeAttributesByMangledClassName.set(mangledName, scopeAttributes);
      }

      if (localMapping.size === 0) {
        continue;
      }

      // 改写时不再按“当前文件桶”单独选映射，
      // 而是直接使用同一个 utility 的 canonical 映射，确保 HTML / CSS / JS 对齐。
      const rewrittenText = await rewriteWithUtwmHandler(
        textSource,
        fileName,
        localMapping,
        scopeAttributesByMangledClassName,
      );
      bundleFileContents.set(fileName, rewrittenText);
    }

    const debugSummary = {
      bucketKeys: [...classNameMapByBucket.keys()].sort(),
      bucketSummary: Object.fromEntries(
        [...classNameMapByBucket.entries()]
          .map(
            ([bucketKey, bucketClassNames]) =>
              [
                bucketKey,
                {
                  classCount: bucketClassNames.size,
                  fileCount: filesByBucket.get(bucketKey)?.size ?? 0,
                  prefix: bucketPrefixMap.get(bucketKey) ?? "",
                  scope: bucketScopeAttributeMap.get(bucketKey) ?? null,
                },
              ] as const,
          )
          .sort(([left], [right]) => left.localeCompare(right)),
      ),
      classFiles: [...classesByFile.keys()].sort(),
      entriesByFile: toSortedRecord(entriesByFile),
      filesByBucket: toSortedRecord(filesByBucket),
      entryOutputFiles: Object.fromEntries(
        [...entryOutputFiles.entries()].sort(([left], [right]) => left.localeCompare(right)),
      ),
    } satisfies DebugSummary;

    // mapping / debug 文件故意放在主题产物之外，
    // 这样排查分桶结果时不用反查压缩后的最终资源。
    writeFileSync(
      resolve(options.projectRoot, ".tw-patch/tw-mangle-debug.json"),
      JSON.stringify(debugSummary, null, 2),
    );

    mappingEntries.sort((left, right) => {
      if (left.bucket !== right.bucket) {
        return left.bucket.localeCompare(right.bucket);
      }

      return left.original.localeCompare(right.original);
    });

    mkdirSync(dirname(mappingFile), { recursive: true });
    writeFileSync(mappingFile, JSON.stringify(mappingEntries, null, 2));

    applyBundleFileContents(bundle, bundleFileContents);
  };

  return {
    name: "tailwindcss-mangle-signatures",
    buildStart() {
      // tw-patch 会先抽出一份标准 utility 列表，这里只重写明确来自
      // Tailwind 输出的类，避免误伤普通业务 class。
      const rawClassList = readFileSync(classListFile, "utf8");
      const parsedClassList: unknown = JSON.parse(rawClassList);

      if (!Array.isArray(parsedClassList) || parsedClassList.some((value) => typeof value !== "string")) {
        throw new TypeError(`Tailwind class list must be a string array: ${classListFile}`);
      }

      // 先套官方默认过滤器，再进入扫描/映射链路。
      // 这样 `hidden` / `block` 这类普通单词不会被放进 replaceMap。
      knownClasses = [...new Set(parsedClassList)].filter(defaultMangleClassFilter).sort();
    },
    configResolved(config) {
      const internalAnalysisPlugin = config.plugins.find((plugin) => plugin.name === VITE_INTERNAL_ANALYSIS_PLUGIN);

      if (internalAnalysisPlugin === undefined) {
        throw new Error("tailwindcss-mangle-signatures requires Vite's build import analysis plugin");
      }

      hijackGenerateBundle(internalAnalysisPlugin, async (_outputOptions, bundle) => {
        await rewriteBundle(bundle as Record<string, unknown>);
      });
    },
  };
}
