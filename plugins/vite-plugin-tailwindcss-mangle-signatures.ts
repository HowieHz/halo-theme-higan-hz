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
 * 4. 每个 bucket 内的 utility 单独生成一份短类名映射
 *
 * - 这里不会再把“同名 utility”跨 bucket 合并。
 * - 映射主键是 `(bucketKey, className)`，不是单独的 `className`。
 * - 也就是说，`a` 里的 `tw:hidden`、`b` 里的 `tw:hidden`、`a|b` 里的 `tw:hidden` 会是三份独立实例。
 * - 但最终类名不会再编码 bucket 前缀语义，而是统一走一张全局唯一的 `_a`、`_b`、`_c`…… 短名表。
 *
 * 为什么要按 bucket 实例化：
 *
 * - 先按文件算“文件桶”：这个 HTML / CSS / JS 文件最终能被哪些 entry 访问到。
 * - 再在当前文件桶内部，给该文件实际命中的 utility 独立分配短名。
 * - 例如 `tw:hidden` 同时出现在 `nav-post`、`nav-page-like-post-style`、以及 `post` 页面自己的共享 CSS 里：
 *
 *   - `components-nav-post` 里的 `tw:hidden` 只属于 `components-nav-post`
 *   - `components-nav-page-like-post-style` 里的 `tw:hidden` 只属于 `components-nav-page-like-post-style`
 *   - `page-like-post-style|post` 共享 CSS 里的 `tw:hidden` 属于 `page-like-post-style|post`
 * - 所以这三处虽然原始 utility 同名，但最后会拿到三份不同短名。
 * - 同一个 bucket 里的 HTML / CSS / JS 仍然共用同一份映射，所以局部产物内部依然能严格对齐。
 * - 短名分配时不会简单按 bucket 顺序发号，而是优先把更高频的实例分到更短的名字。
 *
 * 这套方案的取舍：
 *
 * - 优点：更符合“组件私有化 utility”的直觉，不会因为别的 bucket 也用了同名 utility，就和当前组件共用同一个 mangled class。
 * - 优点：高频实例会优先拿到更短的类名，整体压缩收益更高。
 * - 缺点：共享能力更弱，同一个 utility 在不同 bucket 会重复生成。
 *
 * 5. 最后按 bucket 改写 bundle 并输出映射
 *
 * - 扫描阶段和改写阶段都尽量复用官方 handler，而不是手写正则替换。
 * - 插件会后挂到 Vite 内部 `vite:build-import-analysis` 的 `generateBundle`，这样既能拿到最终 HTML，又早于 `vite-plugin-sri3` 计算 `integrity`。
 * - 最后把 mapping/debug 产物写到 `.tw-patch/`，用于排查 bucket 和类名归属。
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
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
}

interface DebugSummary {
  bucketKeys: string[];
  classFiles: string[];
  entriesByFile: Record<string, string[]>;
  filesByBucket: Record<string, string[]>;
  entryOutputFiles: Record<string, string>;
  bucketSummary: Record<string, { classCount: number; fileCount: number }>;
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

/** 生成 `_a`、`_b`、`_c` 这种稳定短类名。 */
function getMangledClassName(index: number): string {
  return `_${getSequenceLabel(index)}`;
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

/** 统计某个 class 在当前文本里实际命中了多少次。 */
function countClassOccurrencesInText(sourceText: string, fileName: string, className: string): Promise<number> {
  const marker = toScanMarker(0);
  const classNameToMarker = new Map([[className, marker]]);

  return rewriteWithUtwmHandler(sourceText, fileName, classNameToMarker).then((rewrittenText) => {
    let count = 0;

    for (const _match of rewrittenText.matchAll(SCAN_MARKER_REGEX)) {
      count++;
    }

    return count;
  });
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
 * - CSS：UTWM 官方 CSS handler
 * - JS：Babel AST + `MagicString`
 */
async function rewriteWithUtwmHandler(
  sourceText: string,
  fileName: string,
  mapping: ReadonlyMap<string, string>,
): Promise<string> {
  const ctx = createBucketContext(mapping);
  const extension = extname(fileName);

  if (fileName.endsWith(HTML_FILE_EXTENSION)) {
    return htmlHandler(sourceText, { ctx, id: fileName }).code;
  }

  if (fileName.endsWith(CSS_FILE_EXTENSION)) {
    return (await cssHandler(sourceText, { ctx, id: fileName })).code;
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
    const classOccurrenceCountByFile = new Map<string, Map<string, number>>();
    const filesByClassByBucket = new Map<string, Map<string, Set<string>>>();
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
      const classOccurrenceCounts = new Map<string, number>();

      for (const className of classes) {
        classOccurrenceCounts.set(className, await countClassOccurrencesInText(sourceText, fileName, className));
      }

      classOccurrenceCountByFile.set(fileName, classOccurrenceCounts);

      const entries = [...(entriesByFile.get(fileName) ?? new Set<string>())].sort();

      if (entries.length === 0) {
        continue;
      }

      const bucketKey = entries.join("|");
      const bucketFiles = filesByBucket.get(bucketKey) ?? new Set<string>();
      bucketFiles.add(fileName);
      filesByBucket.set(bucketKey, bucketFiles);
      const bucketClassNames = classNameMapByBucket.get(bucketKey) ?? new Map<string, string>();
      const bucketClassFiles = filesByClassByBucket.get(bucketKey) ?? new Map<string, Set<string>>();

      for (const className of classes) {
        bucketClassNames.set(className, "");
        const classFiles = bucketClassFiles.get(className) ?? new Set<string>();
        classFiles.add(fileName);
        bucketClassFiles.set(className, classFiles);
      }

      classNameMapByBucket.set(bucketKey, bucketClassNames);
      filesByClassByBucket.set(bucketKey, bucketClassFiles);
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
    const mappingEntries: MappingEntry[] = [];
    let nextClassIndex = 0;
    const weightedBucketClasses = sortedBucketKeys.flatMap((bucketKey) => {
      const bucketClassNames = classNameMapByBucket.get(bucketKey);
      const bucketClassFiles = filesByClassByBucket.get(bucketKey);

      if (bucketClassNames === undefined || bucketClassFiles === undefined) {
        return [];
      }

      return [...bucketClassNames.keys()].map((className) => {
        const files = [...(bucketClassFiles.get(className) ?? new Set<string>())];
        let occurrenceCount = 0;

        for (const fileName of files) {
          occurrenceCount += classOccurrenceCountByFile.get(fileName)?.get(className) ?? 0;
        }

        return {
          bucketKey,
          className,
          files,
          occurrenceCount,
        };
      });
    });

    weightedBucketClasses.sort((left, right) => {
      if (left.occurrenceCount !== right.occurrenceCount) {
        return right.occurrenceCount - left.occurrenceCount;
      }

      if (left.bucketKey !== right.bucketKey) {
        if (left.bucketKey === globalBucketKey) {
          return -1;
        }

        if (right.bucketKey === globalBucketKey) {
          return 1;
        }

        return left.bucketKey.localeCompare(right.bucketKey);
      }

      return left.className.localeCompare(right.className);
    });

    for (const { bucketKey, className, files } of weightedBucketClasses) {
      const bucketClassNames = classNameMapByBucket.get(bucketKey);

      if (bucketClassNames === undefined) {
        continue;
      }

      const mangledName = getMangledClassName(nextClassIndex);
      nextClassIndex++;
      bucketClassNames.set(className, mangledName);
      mappingEntries.push({
        bucket: bucketKey,
        entries: bucketKey === "" ? [] : bucketKey.split("|"),
        files: files.sort(),
        mangled: mangledName,
        original: className,
      });
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

      const bucketKey = entries.join("|");
      const bucketClassNames = classNameMapByBucket.get(bucketKey);
      const localMapping = new Map<string, string>();

      if (bucketClassNames === undefined) {
        continue;
      }

      for (const className of classes) {
        const mangledName = bucketClassNames.get(className);

        if (mangledName !== undefined && mangledName !== "") {
          localMapping.set(className, mangledName);
        }
      }

      if (localMapping.size === 0) {
        continue;
      }

      // 改写时直接使用“当前文件桶”自己的局部映射，
      // 保证同一个 bucket 内的 HTML / CSS / JS 对齐，同时不跨 bucket 共享同名 utility。
      const rewrittenText = await rewriteWithUtwmHandler(textSource, fileName, localMapping);
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
