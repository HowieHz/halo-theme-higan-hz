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
}

const CSS_FILE_EXTENSION = ".css";
const DEFAULT_CLASS_LIST_FILE = ".tw-patch/tw-class-list.json";
const DEFAULT_MAPPING_FILE = ".tw-patch/tw-mangle-mapping.json";
const HTML_FILE_EXTENSION = ".html";
const JS_FILE_EXTENSIONS = new Set([".js", ".mjs"]);
const THYMELEAF_COMPONENT_REFERENCE_REGEX =
  /~\{([^}]+?)\s*::\s*(?:head|body|html|inlineInit|menu|fragment(?:\([^)]*\))?)\}/gmu;
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

/**
 * 基于最终产物构建引用图。
 *
 * 节点是最终输出文件，边表示一个文件在最终文本里引用到了另一个文件。
 * 这个图后面用于从页面入口反推每个文件属于哪些 entry bucket。
 */
function buildOutputGraph(
  fileContents: ReadonlyMap<string, string>,
  base: string,
  componentHtmlFiles: ReadonlySet<string>,
): Map<string, Set<string>> {
  // 图是基于最终产物文件构建的，不是基于源码模块图。
  // 这样 bucket 才能和真实发布出去的输出拓扑保持一致。
  const graph = new Map<string, Set<string>>();
  const availableFiles = new Set(fileContents.keys());

  for (const [fileName, sourceText] of fileContents.entries()) {
    const references = new Set<string>();

    if (fileName.endsWith(HTML_FILE_EXTENSION)) {
      for (const reference of collectComponentReferences(sourceText, componentHtmlFiles)) {
        references.add(reference);
      }

      for (const reference of collectAssetReferences(sourceText, base, availableFiles)) {
        references.add(reference);
      }
    } else if (JS_FILE_EXTENSIONS.has(extname(fileName))) {
      const importReferenceRegex = /(?:import|from)\s*(?:\(|)\s*["']([^"']+)["']/gmu;

      for (const match of sourceText.matchAll(importReferenceRegex)) {
        const normalizedReference = normalizeBundleReference(match[1], base);

        if (normalizedReference !== null && availableFiles.has(normalizedReference)) {
          references.add(normalizedReference);
        }
      }
    }

    graph.set(fileName, references);
  }

  return graph;
}

/**
 * 从指定页面入口 HTML 出发，收集它在最终产物树中能访问到的所有文件。
 */
function collectReachableFiles(graph: ReadonlyMap<string, ReadonlySet<string>>, entryHtmlFileName: string): Set<string> {
  const visitedFiles = new Set<string>();
  const pendingFiles = [entryHtmlFileName];

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

/** 创建 HTML class 属性值的局部重写函数。 */
function createHtmlClassValueRewriter(
  mapping: ReadonlyMap<string, string>,
): (fullMatch: string, quote: string, classValue: string) => string {
  return (_fullMatch, quote, classValue) => {
    const rewrittenClassValue = classValue.replace(/\S+/gu, (className) => mapping.get(className) ?? className);
    return `class=${quote}${rewrittenClassValue}${quote}`;
  };
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
    writeBundle(outputOptions) {
      // 第一阶段：扫描最终输出的 HTML / CSS / JS。
      // 这样后面的替换才能基于真实 bundle，而不是基于源码时的假设，
      // 包括共享 chunk 和改写后的资源路径。
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

      const bundleGraph = buildOutputGraph(fileContents, normalizedBase, componentHtmlFiles);
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

        // 从每个页面入口出发做可达分析，得到每个最终文件属于哪些 entry。
        // 这个“entry 集合”就是后面分桶的依据。
        const reachableFiles = collectReachableFiles(bundleGraph, outputHtmlFileName);

        for (const fileName of reachableFiles) {
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

        if (fileName.endsWith(HTML_FILE_EXTENSION)) {
          // HTML 只按当前文件所属 bucket 做局部替换，
          // 不会套用其他 bucket 的映射。
          const rewrittenText = sourceText.replace(
            /\bclass\s*=\s*(["'])([\s\S]*?)\1/gmu,
            createHtmlClassValueRewriter(localMapping),
          );
          writeFileSync(outputFilePath, rewrittenText);
          continue;
        }

        if (fileName.endsWith(CSS_FILE_EXTENSION)) {
          let rewrittenText = sourceText;

          // CSS 也按 bucket 重写，这正是同一个原始 utility
          // 能在整体产物中拥有多个混淆名的原因。
          for (const [className, mangledName] of localMapping.entries()) {
            rewrittenText = rewrittenText.replaceAll(createCssClassRegex(className), (_match, prefix: string) => `${prefix}.${mangledName}`);
          }

          writeFileSync(outputFilePath, rewrittenText);
          continue;
        }

        if (JS_FILE_EXTENSIONS.has(extname(fileName))) {
          let rewrittenText = sourceText;

          // JS 这里只处理字符串级别的 class 引用。
          // 这和当前仓库的运行时用法一致，也能避免为了这件事
          // 再引入完整 JS AST 重写。
          for (const [className, mangledName] of localMapping.entries()) {
            rewrittenText = rewrittenText.replaceAll(createJsClassRegex(className), (_match, prefix: string) => `${prefix}${mangledName}`);
          }

          writeFileSync(outputFilePath, rewrittenText);
        }
      }

      const debugSummary = {
        bucketKeys: [...classNameMapByBucket.keys()].sort(),
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
