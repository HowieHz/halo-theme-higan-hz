/**
 * 基于 entry 可达范围分桶的 Tailwind 类名混淆插件。
 *
 * 为什么不使用“全局唯一一张映射表”：
 * - 如果全局只保留一份映射，不同 entry 图里的共享 utility 会被压成同一个短类名，
 *   语义上就会退化成“到处都一样”。
 * - 这里改成“每个 bucket 一张映射表”，bucket 的含义是：
 *   “最终产物里，哪些 entry 能访问到这份文件”。
 * - 这样同一个 utility，例如 `hidden`，就可以同时在全局共享桶里变成 `_h`，
 *   又在 `post` 桶里变成 `m_p`。
 *
 * 为什么选 `writeBundle`，而不是 `generateBundle`：
 * - 这个项目需要基于最终输出的 HTML，以及后处理后的资源引用关系，
 *   才能算出真实可达图。
 * - 实际上对这里最稳定的事实来源，是磁盘上的最终产物树，
 *   不是更早阶段的内存 bundle。
 *
 * 这套方案的取舍：
 * - 优点：共享产物和入口独享产物可以拿到不同的短类名。
 * - 缺点：同一个 utility 可能会在多个 bucket 里重复生成。
 * - 注意：前缀表达的是“最终可达范围”，不是“原始源码归属”。
 * - 如果需要追源码归属，要看 mapping/debug 产物，不能只看前缀。
 */
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, relative, resolve } from "node:path";

import { Context, cssHandler, htmlHandler, jsHandler } from "@tailwindcss-mangle/core";
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
}

interface DebugSummary {
  bucketKeys: string[];
  classFiles: string[];
  entriesByFile: Record<string, string[]>;
  filesByBucket: Record<string, string[]>;
  pageEntryOutputFiles: Record<string, string>;
  bucketSummary: Record<string, { classCount: number; fileCount: number; prefix: string }>;
}

interface BundleMetadataLike {
  importedAssets?: ReadonlySet<string>;
  importedCss?: ReadonlySet<string>;
}

interface BundleChunkLike {
  dynamicImports?: readonly string[];
  fileName: string;
  implicitlyLoadedBefore?: readonly string[];
  imports?: readonly string[];
  type: "chunk";
  viteMetadata?: BundleMetadataLike;
}

interface BundleAssetLike {
  fileName: string;
  type: "asset";
  viteMetadata?: BundleMetadataLike;
}

type BundleFileLike = BundleAssetLike | BundleChunkLike;

const CSS_FILE_EXTENSION = ".css";
const DEFAULT_CLASS_LIST_FILE = ".tw-patch/tw-class-list.json";
const DEFAULT_MAPPING_FILE = ".tw-patch/tw-mangle-mapping.json";
const HTML_FILE_EXTENSION = ".html";
const JS_FILE_EXTENSIONS = new Set([".js", ".mjs"]);
const THYMELEAF_COMPONENT_REFERENCE_REGEX =
  /~\{([A-Za-z0-9/_-]+)\s*::\s*(?:head|body|html|inlineInit|menu|fragment)\b/gmu;
const THYMELEAF_REPLACE_REFERENCE_REGEX = /th:(?:insert|replace)="([^"]+)"/gmu;

/** 统一路径分隔符，避免 Windows 路径影响后续匹配。 */
function normalizePathSeparators(value: string): string {
  return value.replaceAll("\\", "/");
}

/** 规范化公开访问 base，保证后续资源引用裁剪逻辑稳定。 */
function normalizePublicBase(value: string): string {
  const normalizedValue = normalizePathSeparators(value).trim();

  if (normalizedValue === "" || normalizedValue === ".") {
    return "/";
  }

  return normalizedValue.startsWith("/") ? normalizedValue : `/${normalizedValue}`;
}

/**
 * 将最终产物中的资源引用转换成相对输出目录的文件名。
 *
 * 只处理当前插件关心的几类引用：
 * - 带 base 的最终资源路径
 * - 不带前导 `/` 但仍然以 base 开头的路径
 * - 已经是 `assets/...` 形式的路径
 */
function normalizeBundleReference(value: string, base: string): string | null {
  const normalizedValue = normalizePathSeparators(value.trim());
  const normalizedBase = normalizePublicBase(base);

  if (normalizedValue === "") {
    return null;
  }

  if (normalizedValue.startsWith(normalizedBase)) {
    return normalizedValue.slice(normalizedBase.length);
  }

  const baseWithoutLeadingSlash = normalizedBase.replace(/^\//u, "");

  if (normalizedValue.startsWith(baseWithoutLeadingSlash)) {
    return normalizedValue.slice(baseWithoutLeadingSlash.length);
  }

  if (normalizedValue.startsWith("assets/")) {
    return normalizedValue;
  }

  return null;
}

/** 判断输入 entry 是否属于页面入口，而不是组件模板入口。 */
function isPageEntry(entryKey: string): boolean {
  return !entryKey.startsWith("components-");
}

/** 将源码 HTML 输入路径映射成最终输出目录中的 HTML 相对路径。 */
function toOutputHtmlFileName(templateRoot: string, inputFile: string): string | null {
  if (extname(inputFile) !== HTML_FILE_EXTENSION) {
    return null;
  }

  return normalizePathSeparators(relative(templateRoot, inputFile));
}

/** 转义正则特殊字符，供动态构造匹配表达式使用。 */
function escapeRegExp(value: string): string {
  return value.replaceAll(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** 转义 CSS 类名里需要额外转义的字符。 */
function escapeCssClassName(value: string): string {
  return value.replaceAll(/[^A-Za-z0-9_-]/g, (character) => `\\${character}`);
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

/** 递归收集输出目录下的所有文件路径。 */
function collectOutputFiles(rootDir: string): string[] {
  const outputFiles: string[] = [];
  const pendingDirs = [rootDir];

  while (pendingDirs.length > 0) {
    const currentDir = pendingDirs.pop();

    if (currentDir === undefined) {
      continue;
    }

    for (const entry of readdirSync(currentDir)) {
      const entryPath = resolve(currentDir, entry);
      const entryStat = statSync(entryPath);

      if (entryStat.isDirectory()) {
        pendingDirs.push(entryPath);
      } else {
        outputFiles.push(entryPath);
      }
    }
  }

  return outputFiles;
}

/** 从 HTML 的 class 属性中提取当前已知 Tailwind utility。 */
function collectClassesFromHtml(source: string, knownClassSet: ReadonlySet<string>): Set<string> {
  const classes = new Set<string>();
  const classAttributeRegex = /\bclass\s*=\s*(["'])([\s\S]*?)\1/gmu;

  for (const match of source.matchAll(classAttributeRegex)) {
    const classValue = match[2];

    for (const className of classValue.split(/\s+/u)) {
      if (className !== "" && knownClassSet.has(className)) {
        classes.add(className);
      }
    }
  }

  return classes;
}

/**
 * 从普通文本中按规则提取类名。
 *
 * 这里用于 CSS / JS 文本扫描，具体匹配方式由调用方提供。
 */
function collectClassesFromText(
  source: string,
  knownClasses: readonly string[],
  regexFactory: (className: string) => RegExp,
): Set<string> {
  const classes = new Set<string>();

  for (const className of knownClasses) {
    if (regexFactory(className).test(source)) {
      classes.add(className);
    }
  }

  return classes;
}

/** 从 Thymeleaf `th:insert` / `th:replace` 中提取组件模板引用。 */
function collectComponentReferences(source: string, componentHtmlFiles: ReadonlySet<string>): Set<string> {
  const references = new Set<string>();

  for (const match of source.matchAll(THYMELEAF_REPLACE_REFERENCE_REGEX)) {
    const expression = match[1];

    for (const componentMatch of expression.matchAll(THYMELEAF_COMPONENT_REFERENCE_REGEX)) {
      const normalizedReference = `${componentMatch[1].trim()}.html`;

      if (componentHtmlFiles.has(normalizedReference)) {
        references.add(normalizedReference);
      }
    }
  }

  return references;
}

/** 从 HTML 的 `href` / `src` 中提取可落到最终输出目录的资源引用。 */
function collectAssetReferences(source: string, base: string, availableFiles: ReadonlySet<string>): Set<string> {
  const references = new Set<string>();
  const assetReferenceRegex = /\b(?:href|src)\s*=\s*(["'])([^"']+)\1/gmu;

  for (const match of source.matchAll(assetReferenceRegex)) {
    const normalizedReference = normalizeBundleReference(match[2], base);

    if (normalizedReference !== null && availableFiles.has(normalizedReference)) {
      references.add(normalizedReference);
    }
  }

  return references;
}

/** 只为 HTML 模板构建组件引用图，用于入口归属向模板传播。 */
function buildTemplateGraph(
  fileContents: ReadonlyMap<string, string>,
  componentHtmlFiles: ReadonlySet<string>,
): Map<string, Set<string>> {
  const graph = new Map<string, Set<string>>();

  for (const [fileName, sourceText] of fileContents.entries()) {
    if (!fileName.endsWith(HTML_FILE_EXTENSION)) {
      continue;
    }

    graph.set(fileName, collectComponentReferences(sourceText, componentHtmlFiles));
  }

  return graph;
}

/**
 * 记录每个 HTML 模板直接引用了哪些最终 JS/CSS/asset 文件。
 *
 * 注意这里只记“直接引用”，不做 JS/CSS 之间的传递展开。
 * 资源间的真正依赖关系交给 bundler graph 处理。
 */
function collectTemplateAssetReferences(
  fileContents: ReadonlyMap<string, string>,
  base: string,
  availableAssetFiles: ReadonlySet<string>,
): Map<string, Set<string>> {
  const referencesByTemplate = new Map<string, Set<string>>();

  for (const [fileName, sourceText] of fileContents.entries()) {
    if (!fileName.endsWith(HTML_FILE_EXTENSION)) {
      continue;
    }

    referencesByTemplate.set(fileName, collectAssetReferences(sourceText, base, availableAssetFiles));
  }

  return referencesByTemplate;
}

/** 判断 bundle 条目是否至少像个输出文件节点。 */
function isBundleFileLike(value: unknown): value is BundleFileLike {
  return typeof value === "object" && value !== null && "fileName" in value && "type" in value;
}

/** 基于 bundler metadata 构建最终资源图。 */
function buildAssetGraph(bundle: Record<string, unknown>): Map<string, Set<string>> {
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

  return graph;
}

/**
 * 从若干起点出发，收集图中所有可达文件。
 *
 * 这里同时用于：
 * - 页面入口 -> 组件模板传播
 * - 模板直接引用的资源入口 -> bundler 资源图传播
 */
function collectReachableFiles(graph: ReadonlyMap<string, ReadonlySet<string>>, entryFileNames: readonly string[]): Set<string> {
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

/** 生成 CSS 选择器里的类名匹配正则。 */
function createCssClassRegex(className: string): RegExp {
  return new RegExp(`(^|[^A-Za-z0-9_-])\\.${escapeRegExp(escapeCssClassName(className))}(?=$|[^A-Za-z0-9_-])`, "gmu");
}

/** 生成 JS 字符串上下文中的类名匹配正则。 */
function createJsClassRegex(className: string): RegExp {
  return new RegExp(`(^|[\\s"'\\x60])${escapeRegExp(className)}(?=$|[\\s"'\\x60])`, "gmu");
}

/** 将 `Map<string, Set<string>>` 转成稳定排序后的普通对象，便于输出调试文件。 */
function toSortedRecord(map: ReadonlyMap<string, ReadonlySet<string>>): Record<string, string[]> {
  return Object.fromEntries(
    [...map.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, values]) => [key, [...values].sort()]),
  );
}

/**
 * 为单个 bucket 构造局部 UTWM 上下文。
 *
 * 这里不复用官方 `initConfig()` 的整套初始化流程，因为：
 * - 当前插件的 bucket 逻辑已经先算出了最终 `original -> mangled`
 * - 我们只需要复用官方 handler 的 AST / 解析器改写能力
 * - 不希望再回退到“全局一张映射表”的语义
 *
 * 所以这里只手动注入最小必需状态：
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
 * 这样做的意义不是改变 bucket 语义，而是把“怎么安全地改 HTML/CSS/JS”
 * 这件事重新交给官方实现：
 * - HTML：`htmlparser2`
 * - CSS：`postcss` + `postcss-selector-parser`
 * - JS：Babel AST + `MagicString`
 */
async function rewriteWithUtwmHandler(sourceText: string, fileName: string, mapping: ReadonlyMap<string, string>): Promise<string> {
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

export default function tailwindcssMangleSignaturesPlugin(
  options: TailwindcssMangleSignaturesPluginOptions,
): Plugin {
  const classListFile = resolve(options.projectRoot, options.classListFile ?? DEFAULT_CLASS_LIST_FILE);
  const mappingFile = resolve(options.projectRoot, options.mappingFile ?? DEFAULT_MAPPING_FILE);
  const normalizedBase = normalizePublicBase(options.base);
  const componentHtmlFiles = new Set<string>();
  const pageEntryOutputFiles = new Map<string, string>();
  let knownClasses: string[] = [];
  let knownClassSet = new Set<string>();

  for (const [entryKey, inputFile] of Object.entries(options.input)) {
    const outputHtmlFileName = toOutputHtmlFileName(options.templateRoot, inputFile);

    if (outputHtmlFileName === null) {
      continue;
    }

    if (isPageEntry(entryKey)) {
      pageEntryOutputFiles.set(entryKey, outputHtmlFileName);
    } else {
      componentHtmlFiles.add(outputHtmlFileName);
    }
  }

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

      knownClasses = [...new Set(parsedClassList)].sort();
      knownClassSet = new Set(knownClasses);
    },
    async writeBundle(outputOptions, bundle) {
      // 最终改写仍然发生在 writeBundle：
      // - 这里已经有真实 bundle metadata
      // - 磁盘上也已经有最终 HTML 模板，便于把改写结果直接写回
      const outputDir =
        typeof outputOptions.dir === "string"
          ? resolve(outputOptions.dir)
          : resolve(options.projectRoot, "templates");
      const fileContents = new Map<string, string>();
      const outputFiles = collectOutputFiles(outputDir);

      for (const outputFile of outputFiles) {
        const relativeFileName = normalizePathSeparators(relative(outputDir, outputFile));
        const extension = extname(relativeFileName);

        if (extension === HTML_FILE_EXTENSION || extension === CSS_FILE_EXTENSION || JS_FILE_EXTENSIONS.has(extension)) {
          fileContents.set(relativeFileName, readFileSync(outputFile, "utf8"));
        }
      }

      const bundleFileNames = new Set(
        Object.values(bundle)
          .filter(isBundleFileLike)
          .map((bundleFile) => bundleFile.fileName),
      );
      const templateGraph = buildTemplateGraph(fileContents, componentHtmlFiles);
      const templateAssetReferences = collectTemplateAssetReferences(fileContents, normalizedBase, bundleFileNames);
      const assetGraph = buildAssetGraph(bundle);
      const entriesByFile = new Map<string, Set<string>>();
      const classesByFile = new Map<string, Set<string>>();
      const filesByBucket = new Map<string, Set<string>>();
      const classNameMapByBucket = new Map<string, Map<string, string>>();
      const pageEntryKeys = [...pageEntryOutputFiles.keys()].sort();
      const globalBucketKey = pageEntryKeys.join("|");

      for (const [entryKey, outputHtmlFileName] of pageEntryOutputFiles.entries()) {
        if (!fileContents.has(outputHtmlFileName)) {
          continue;
        }

        // 第一步：只在 HTML 模板层传播入口归属。
        // 页面模板能触达哪些组件模板，由 Thymeleaf 引用关系决定。
        const reachableTemplateFiles = collectReachableFiles(templateGraph, [outputHtmlFileName]);
        const assetSeedFiles = new Set<string>();

        for (const fileName of reachableTemplateFiles) {
          const entries = entriesByFile.get(fileName) ?? new Set<string>();
          entries.add(entryKey);
          entriesByFile.set(fileName, entries);

          for (const assetFileName of templateAssetReferences.get(fileName) ?? new Set<string>()) {
            assetSeedFiles.add(assetFileName);
          }
        }

        // 第二步：资源层归属交给 bundler graph。
        // 从页面及其组件模板直接引用到的最终 JS/CSS/asset 出发，
        // 按 chunk/importedCss/importedAssets 做可达传播。
        const reachableAssetFiles = collectReachableFiles(assetGraph, [...assetSeedFiles]);

        for (const fileName of reachableAssetFiles) {
          const entries = entriesByFile.get(fileName) ?? new Set<string>();
          entries.add(entryKey);
          entriesByFile.set(fileName, entries);
        }
      }

      for (const [fileName, sourceText] of fileContents.entries()) {
        let classes = new Set<string>();
        const extension = extname(fileName);

        if (fileName.endsWith(HTML_FILE_EXTENSION)) {
          classes = collectClassesFromHtml(sourceText, knownClassSet);
        } else if (fileName.endsWith(CSS_FILE_EXTENSION)) {
          classes = collectClassesFromText(sourceText, knownClasses, createCssClassRegex);
        } else if (JS_FILE_EXTENSIONS.has(extension)) {
          classes = collectClassesFromText(sourceText, knownClasses, createJsClassRegex);
        }

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

        // 映射表是“每个 bucket 一份”，不是全局唯一一份。
        // 所以同一个 utility 可以在不同可达组里拿到不同短名。
        const bucketClassNames = classNameMapByBucket.get(bucketKey) ?? new Map<string, string>();

        for (const className of classes) {
          if (!bucketClassNames.has(className)) {
            bucketClassNames.set(className, "");
          }
        }

        classNameMapByBucket.set(bucketKey, bucketClassNames);
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
      let nextBucketIndex = 0;

      for (const bucketKey of sortedBucketKeys) {
        // 所有页面都能访问到的那个 bucket 被视为“全局共享桶”，
        // 故意保留最短前缀 `_`。
        if (bucketKey === globalBucketKey && pageEntryKeys.length > 0) {
          bucketPrefixMap.set(bucketKey, "_");
          continue;
        }

        // 其他 bucket 按排序后的稳定顺序分配前缀。
        bucketPrefixMap.set(bucketKey, `${getSequenceLabel(nextBucketIndex)}_`);
        nextBucketIndex++;
      }

      const mappingEntries: MappingEntry[] = [];

      for (const bucketKey of sortedBucketKeys) {
        const bucketClassNames = classNameMapByBucket.get(bucketKey);
        const prefix = bucketPrefixMap.get(bucketKey);

        if (bucketClassNames === undefined || prefix === undefined) {
          continue;
        }

        const sortedClassNames = [...bucketClassNames.keys()].sort();

        for (const [classIndex, className] of sortedClassNames.entries()) {
          const mangledName = `${prefix}${getSequenceLabel(classIndex)}`;
          bucketClassNames.set(className, mangledName);
          mappingEntries.push({
            bucket: bucketKey,
            entries: bucketKey === "" ? [] : bucketKey.split("|"),
            files: [...(filesByBucket.get(bucketKey) ?? new Set<string>())].sort(),
            mangled: mangledName,
            original: className,
            prefix,
          });
        }
      }

      for (const [fileName, sourceText] of fileContents.entries()) {
        const classes = classesByFile.get(fileName);

        if (classes === undefined) {
          continue;
        }

        const entries = [...(entriesByFile.get(fileName) ?? new Set<string>())].sort();

        if (entries.length === 0) {
          continue;
        }

        const bucketKey = entries.join("|");
        const bucketClassNames = classNameMapByBucket.get(bucketKey);

        if (bucketClassNames === undefined) {
          continue;
        }

        const localMapping = new Map<string, string>();

        for (const className of classes) {
          const mangledName = bucketClassNames.get(className);

          if (mangledName !== undefined && mangledName !== "") {
            localMapping.set(className, mangledName);
          }
        }

        if (localMapping.size === 0) {
          continue;
        }

        const outputFilePath = resolve(outputDir, fileName);
        // 改写仍然严格限定在“当前文件所属 bucket 的局部映射”内，
        // 只是执行层从手写字符串替换切到了官方 handler。
        const rewrittenText = await rewriteWithUtwmHandler(sourceText, outputFilePath, localMapping);
        writeFileSync(outputFilePath, rewrittenText);
      }

      const debugSummary = {
        bucketKeys: [...classNameMapByBucket.keys()].sort(),
        bucketSummary: Object.fromEntries(
          [...classNameMapByBucket.entries()]
            .map(([bucketKey, bucketClassNames]) => [
              bucketKey,
              {
                classCount: bucketClassNames.size,
                fileCount: filesByBucket.get(bucketKey)?.size ?? 0,
                prefix: bucketPrefixMap.get(bucketKey) ?? "",
              },
            ] as const)
            .sort(([left], [right]) => left.localeCompare(right)),
        ),
        classFiles: [...classesByFile.keys()].sort(),
        entriesByFile: toSortedRecord(entriesByFile),
        filesByBucket: toSortedRecord(filesByBucket),
        pageEntryOutputFiles: Object.fromEntries([...pageEntryOutputFiles.entries()].sort(([left], [right]) => left.localeCompare(right))),
      } satisfies DebugSummary;

      // mapping / debug 文件故意放在主题产物之外，
      // 这样排查分桶结果时不用反查压缩后的最终资源。
      writeFileSync(resolve(options.projectRoot, ".tw-patch/tw-mangle-debug.json"), JSON.stringify(debugSummary, null, 2));

      mappingEntries.sort((left, right) => {
        if (left.bucket !== right.bucket) {
          return left.bucket.localeCompare(right.bucket);
        }

        return left.original.localeCompare(right.original);
      });

      mkdirSync(dirname(mappingFile), { recursive: true });
      writeFileSync(mappingFile, JSON.stringify(mappingEntries, null, 2));
    },
  };
}
