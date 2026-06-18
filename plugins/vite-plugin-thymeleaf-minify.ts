// import { Buffer } from "node:buffer";
import { promises as fs } from "node:fs";
import { dirname, resolve } from "node:path";
import { styleText } from "node:util";

// import minifyHtml from "@minify-html/node";
import { minifySync, type MinifyOptions } from "oxc-minify";
import type { Plugin } from "vite";

const LOG_PREFIX = styleText("cyan", "[thymeleaf-minify]");
const HTML_ATTRIBUTE_REGEX = /([^\s"'=<>`/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/gmu;
const JAVASCRIPT_MIME_TYPES = new Set([
  "",
  "application/ecmascript",
  "application/javascript",
  "application/x-ecmascript",
  "application/x-javascript",
  "text/ecmascript",
  "text/javascript",
  "text/javascript1.0",
  "text/javascript1.1",
  "text/javascript1.2",
  "text/javascript1.3",
  "text/javascript1.4",
  "text/javascript1.5",
  "text/jscript",
  "text/livescript",
  "text/x-ecmascript",
  "text/x-javascript",
]);
const INLINE_CLASSIC_SCRIPT_MINIFY_OPTIONS = {
  module: false,
  compress: {
    target: "esnext",
  },
  mangle: {
    toplevel: false,
  },
  codegen: {
    removeWhitespace: true,
    legalComments: "none",
  },
  sourcemap: false,
} satisfies MinifyOptions;
const THYMELEAF_COMMENT_WRAPPED_SCRIPT_MARKERS = [
  "/*[[", // 注释包裹的转义内联输出表达式：/*[[...]]*/
  "/*[(", // 注释包裹的非转义内联输出表达式：/*[(...)]*/
  "/*[#", // 注释包裹的文本模板元素：/*[# ...]*/
  "/*[/", // 注释包裹的文本模板闭合元素：/*[/]*/ 或 /*[/name]*/
  "/*[+", // Thymeleaf 会解除注释的文本原型专用注释块。
  "/*[-", // Thymeleaf 会移除的文本解析级注释块。
];

/** Plugin options interface */
interface ThymeleafMinifyOptions {
  /** Vite base path */
  base?: string;
}

/**
 * Vite plugin that removes Thymeleaf prototype-only comments from HTML files and cleans up orphaned script files.
 *
 * Behavior:
 *
 * - Phase 1 (transformIndexHtml - order: "post"):
 *
 *   - Tracks all script tags (checking both src and data-src attributes) before transformation.
 *   - Removes Thymeleaf prototype comments (`<!--/* ... *\/-->`) while preserving parser-level comments (`<!--/*\/ ...
 *     /*\/-->`).
 *   - Compares script tags before and after to identify scripts removed during comment removal.
 *   - Records which HTML files had which scripts removed.
 * - Phase 2 (writeBundle):
 *
 *   - For each script that was removed from HTML files, checks if the corresponding JS file is still referenced elsewhere.
 *   - Recursively scans all HTML files in the output directory.
 *   - If a JS file is no longer referenced by any HTML file, deletes it as an orphaned file.
 *   - Logs all actions for transparency.
 *
 * Supported script formats:
 *
 * - `<script type="module" crossorigin src="...">` (modern modules)
 * - `<script nomodule crossorigin src="...">` (legacy scripts)
 * - `<script nomodule crossorigin data-src="...">` (Vite legacy plugin format)
 *
 * @param options Plugin configuration options
 * @returns Vite plugin
 */
export default function thymeleafMinify(options: ThymeleafMinifyOptions = {}): Plugin {
  const {
    // Default: root path, corresponding to Vite's base configuration
    base = "/",
  } = options;

  // Track script references that disappear after Thymeleaf prototype-only
  // comments are stripped during HTML transformation.
  //
  // This plugin performs orphan script cleanup in two phases:
  // 1. In transformIndexHtml, compare script references before and after
  //    Thymeleaf prototype-only comments are removed, and record the scripts
  //    that disappear during that step.
  // 2. In writeBundle, check whether the built assets for those removed
  //    scripts are still referenced by any remaining HTML files. If not, treat
  //    them as orphaned and delete them.
  //
  // If no scripts are removed in phase 1, the orphan-check phase is skipped.
  const removedScripts = new Map<string, Set<string>>(); // scriptSrc -> HTML paths that removed it

  return {
    name: "vite-plugin-thymeleaf-minify",
    apply: "build",
    enforce: "post",

    transformIndexHtml: {
      order: "post", // Execute after all transformations
      handler(html, ctx) {
        // Collect script references from the original HTML before any
        // Thymeleaf-specific cleanup runs. Check both src and data-src because
        // Vite's legacy output may use either form.
        const originalScripts = new Set<string>();

        // Extract all script src and data-src attributes.
        const scriptRegex = /<script\s[^>]*>/g;
        let match;
        while ((match = scriptRegex.exec(html)) !== null) {
          const scriptTag = match[0];

          // Check for src attribute.
          const srcMatch = /\ssrc="([^"]+)"/.exec(scriptTag);
          if (srcMatch) {
            originalScripts.add(srcMatch[1]);
          }

          // Check for data-src attribute.
          const dataSrcMatch = /\sdata-src="([^"]+)"/.exec(scriptTag);
          if (dataSrcMatch) {
            originalScripts.add(dataSrcMatch[1]);
          }
        }

        // Remove Thymeleaf prototype-only comments while preserving parser-level
        // comments such as <!--/*/ ... /*/-->.
        html = removeNestedThymeleafComments(html);

        // Remove inline ESLint suppression comments that are only needed in
        // source templates and should not appear in the final HTML output.
        html = removeInlineEslintDisableNextLineComments(html);

        // Remove consecutive empty lines after comment stripping.
        html = html.replace(/\n\s*\n/g, "\n");

        // Collect the script references that remain after transformation.
        const remainingScripts = new Set<string>();
        scriptRegex.lastIndex = 0; // Reset regex state before reusing it.
        while ((match = scriptRegex.exec(html)) !== null) {
          const scriptTag = match[0];

          // Check for src attribute.
          const srcMatch = /\ssrc="([^"]+)"/.exec(scriptTag);
          if (srcMatch) {
            remainingScripts.add(srcMatch[1]);
          }

          // Check for data-src attribute.
          const dataSrcMatch = /\sdata-src="([^"]+)"/.exec(scriptTag);
          if (dataSrcMatch) {
            remainingScripts.add(dataSrcMatch[1]);
          }
        }

        // Record any script references that disappeared because the associated
        // Thymeleaf prototype-only block was removed.
        for (const scriptSrc of originalScripts) {
          if (!remainingScripts.has(scriptSrc)) {
            if (!removedScripts.has(scriptSrc)) {
              removedScripts.set(scriptSrc, new Set());
            }
            removedScripts.get(scriptSrc)?.add(ctx.path);
          }
        }

        // Minify executable classic inline scripts after all Thymeleaf-specific
        // cleanup. Module scripts are handled by Vite; JSON/importmap-like
        // script data and Thymeleaf inline expressions must stay untouched.
        html = minifyClassicInlineScripts(html, ctx.path);

        // const minifySensitiveMarkers = getMinifySensitiveThymeleafMarkers(html);

        // if (minifySensitiveMarkers.length > 0) {
        //   console.log(
        //     `${LOG_PREFIX} ${styleText("yellow", "skip")} ${ctx.path}: ${styleText("dim", "minify-sensitive syntax unsafe for aggressive minify")} (${styleText("magenta", minifySensitiveMarkers.join(", "))})`,
        //   );
        // }

        // Temporarily disable minify-html for all Thymeleaf templates.
        // Reason: attribute unquoting can break th:* expressions whose runtime
        // output may contain spaces or other characters that require quoting.
        // Tracking: https://github.com/wilsonzlin/minify-html/issues/274#issuecomment-4092947391
        //
        // // - always behave like a fully standards-compliant HTML parser, so preserving tag
        // // - boundaries avoids unnecessary integration errors.
        // //
        // // keep_html_and_head_opening_tags: true
        // // - Prevent duplicate plugin content injection.
        // //
        // // minify_css: false
        // // - Not needed here because CSS is already processed elsewhere.
        // //
        // // minify_js: true
        // // - Enable handling for inline blocks skipped by Vite.
        // if (minifySensitiveMarkers.length === 0) {
        //   html = minifyHtml
        //     .minify(Buffer.from(html), {
        //       keep_closing_tags: true,
        //       keep_html_and_head_opening_tags: true,
        //       minify_js: true,
        //     })
        //     .toString();
        // }

        return html;
      },
    },

    // After bundling finishes, delete any generated script files that became
    // orphaned when their last HTML reference was removed during phase 1.
    async writeBundle(bundleOptions) {
      if (removedScripts.size === 0) {
        console.log(`\n${LOG_PREFIX} ${styleText("dim", "No scripts were removed, skipping orphan check.")}`);
        return;
      }

      // Resolve the output directory.
      const outDir = bundleOptions.dir
        ? resolve(bundleOptions.dir)
        : bundleOptions.file
          ? dirname(resolve(bundleOptions.file))
          : process.cwd();

      // Track scripts that were successfully processed in this cleanup phase.
      const processedScripts = new Set<string>();
      let deletedCount = 0;
      let keptCount = 0;

      for (const [scriptSrc, htmlPaths] of removedScripts.entries()) {
        // Remove the configured base path prefix to get the output-relative
        // script path.
        const relativePath = scriptSrc.startsWith(base) ? scriptSrc.slice(base.length) : scriptSrc.replace(/^\//, "");

        // Build the absolute output path for the generated asset.
        const filePath = resolve(outDir, relativePath);

        try {
          // Skip missing files gracefully.
          await fs.access(filePath);

          // Check whether any final HTML file still references this script.
          const allHtmlFiles = await findHtmlFiles(outDir);
          let isReferencedElsewhere = false;

          for (const htmlFile of allHtmlFiles) {
            // Skip HTML files that originally removed this script during phase 1.
            const htmlRelativePath = htmlFile.replace(outDir, "").replace(/\\/g, "/").replace(/^\//, "");
            if (Array.from(htmlPaths).some((p) => p.includes(htmlRelativePath))) {
              continue;
            }

            const htmlContent = await fs.readFile(htmlFile, "utf-8");
            if (htmlContent.includes(scriptSrc)) {
              isReferencedElsewhere = true;
              break;
            }
          }

          // If the script is no longer referenced anywhere, delete the built
          // asset as an orphan.
          if (!isReferencedElsewhere) {
            await fs.unlink(filePath);
            console.log(`${LOG_PREFIX} ${styleText("green", "delete")} orphaned script: ${filePath}`);
            deletedCount++;
          } else {
            keptCount++;
          }
          processedScripts.add(scriptSrc);
        } catch (err) {
          // Missing files or unreadable files should not block cleanup of other
          // entries.
          if ((err as NodeJS.ErrnoException).code === "ENOENT") {
            console.log(`${LOG_PREFIX} ${styleText("yellow", "skip")} file not found: ${relativePath}`);
          } else {
            console.error(`${LOG_PREFIX} ${styleText("red", "error")} processing ${relativePath}: ${err}`);
          }
          processedScripts.add(scriptSrc);
        }
      }

      // Remove processed entries from the tracking map.
      for (const scriptSrc of processedScripts) {
        removedScripts.delete(scriptSrc);
      }

      if (deletedCount > 0 || keptCount > 0) {
        console.log(
          `${LOG_PREFIX} ${styleText("green", "cleanup")} deleted ${deletedCount} orphaned, kept ${keptCount} referenced`,
        );
      }
    },
  };
}

/** Recursively find all HTML files inside a directory. */
async function findHtmlFiles(dir: string): Promise<string[]> {
  const results: string[] = [];

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = resolve(dir, entry.name);

      if (entry.isDirectory()) {
        const subResults = await findHtmlFiles(fullPath);
        results.push(...subResults);
      } else if (entry.isFile() && entry.name.endsWith(".html")) {
        results.push(fullPath);
      }
    }
  } catch {
    // Ignore directory read errors such as permission issues.
  }

  return results;
}

/**
 * Remove nested Thymeleaf prototype-only comments using a stack-based algorithm.
 *
 * Supported formats:
 *
 * - <!--/* ... *\/--> (no prefix)
 * - //<!--/* ... *\/--> (JS comment prefix, no space)
 * - // <!--/* ... *\/--> (JS comment prefix, with space) Parser-level comments such as <!--/*\/ ... /*\/--> are
 *   preserved.
 */
function removeNestedThymeleafComments(html: string): string {
  const result: string[] = [];
  let depth = 0;
  let i = 0;

  const START_MARKER = "<!--/*";
  const END_MARKER = "*/-->";
  const EXCLUDE_START = "<!--/*/"; // Parser-level comment start.
  const EXCLUDE_END = "/*/-->"; // Parser-level comment end.
  const PREFIXES = ["// ", "//"]; // Possible prefixes, longest first.
  const scanner = {
    consume(marker: string): boolean {
      if (!html.startsWith(marker, i)) {
        return false;
      }

      i += marker.length;
      return true;
    },
    consumeWithPrefixes(marker: string): string | null {
      for (const prefix of PREFIXES) {
        const candidate = prefix + marker;
        if (html.startsWith(candidate, i)) {
          i += candidate.length;
          return candidate;
        }
      }

      return null;
    },
    appendIfVisible(text: string): void {
      if (depth === 0) {
        result.push(text);
      }
    },
    incrementDepth(): void {
      depth++;
    },
    enterPrototypeComment(marker: string): boolean {
      if (!this.consume(marker)) {
        return false;
      }

      this.incrementDepth();
      return true;
    },
    enterPrototypeCommentWithPrefixes(marker: string): boolean {
      if (this.consumeWithPrefixes(marker) === null) {
        return false;
      }

      this.incrementDepth();
      return true;
    },
    leavePrototypeComment(marker: string): boolean {
      if (!this.consume(marker)) {
        return false;
      }

      if (depth > 0) {
        depth--;
      }

      return true;
    },
    appendCurrentChar(): void {
      this.appendIfVisible(html[i]);
      i++;
    },
  };

  while (i < html.length) {
    // 1. Check for parser-level comment start, including supported prefixes.
    const prefixedExcludeStart = scanner.consumeWithPrefixes(EXCLUDE_START);
    if (prefixedExcludeStart) {
      scanner.appendIfVisible(prefixedExcludeStart);
      continue;
    }

    // Parser-level comment start without prefix.
    if (scanner.consume(EXCLUDE_START)) {
      scanner.appendIfVisible(EXCLUDE_START);
      continue;
    }

    // 2. Check for parser-level comment end.
    if (scanner.consume(EXCLUDE_END)) {
      scanner.appendIfVisible(EXCLUDE_END);
      continue;
    }

    // 3. Check for prototype-only comment start, including supported prefixes.
    if (scanner.enterPrototypeCommentWithPrefixes(START_MARKER)) {
      continue;
    }

    // Prototype-only comment start without prefix.
    if (scanner.enterPrototypeComment(START_MARKER)) {
      continue;
    }

    // 4. Check for prototype-only comment end.
    if (scanner.leavePrototypeComment(END_MARKER)) {
      continue;
    }

    // 5. If not inside a removable comment, preserve the character.
    scanner.appendCurrentChar();
  }

  return result.join("");
}

// function getMinifySensitiveThymeleafMarkers(html: string): string[] {
//   return ["th:inline", "/*[[", "/*[(", "/*[#", "/*[/]", "<!--/*/", "/*/-->", "[[", "[("].filter((marker) =>
//     html.includes(marker),
//   );
// }

function removeInlineEslintDisableNextLineComments(html: string): string {
  return html.replace(/\/\*\s*eslint-disable-next-line\b[\s\S]*?\*\//g, "");
}

interface InlineScriptTagMatch {
  attributesText: string;
  closeTagEndIndex: number;
  contentText: string;
  endIndex: number;
  openTagEndIndex: number;
}

function minifyClassicInlineScripts(html: string, htmlPath: string): string {
  let minifiedHtml = "";
  let currentIndex = 0;
  let inlineScriptIndex = 0;

  while (true) {
    const inlineScriptMatch = findNextInlineScriptTag(html, currentIndex);

    if (inlineScriptMatch === null) {
      return minifiedHtml + html.slice(currentIndex);
    }

    minifiedHtml += html.slice(currentIndex, inlineScriptMatch.openTagEndIndex + 1);
    const minifiedScript = minifyClassicInlineScript(
      inlineScriptMatch.contentText,
      inlineScriptMatch.attributesText,
      `${htmlPath}#inline-script-${inlineScriptIndex}.js`,
    );

    minifiedHtml += minifiedScript ?? inlineScriptMatch.contentText;
    minifiedHtml += html.slice(
      inlineScriptMatch.closeTagEndIndex - "</script>".length,
      inlineScriptMatch.closeTagEndIndex,
    );

    currentIndex = inlineScriptMatch.endIndex;
    inlineScriptIndex++;
  }
}

function minifyClassicInlineScript(scriptText: string, attributesText: string, filename: string): string | null {
  if (!isMinifiableClassicInlineScript(attributesText, scriptText)) {
    return null;
  }

  const leadingWhitespace = scriptText.match(/^\s*/u)?.[0] ?? "";
  const trailingWhitespace = scriptText.match(/\s*$/u)?.[0] ?? "";
  const scriptSource = scriptText.trim();

  try {
    const result = minifySync(filename, scriptSource, INLINE_CLASSIC_SCRIPT_MINIFY_OPTIONS);

    if (result.errors.length > 0) {
      console.warn(
        `${LOG_PREFIX} ${styleText("yellow", "skip")} inline script minify failed: ${filename}: ${result.errors
          .map((error) => error.message)
          .join("; ")}`,
      );
      return null;
    }

    return `${leadingWhitespace}${result.code}${trailingWhitespace}`;
  } catch (error) {
    console.warn(`${LOG_PREFIX} ${styleText("yellow", "skip")} inline script minify failed: ${filename}: ${error}`);
    return null;
  }
}

function isMinifiableClassicInlineScript(attributesText: string, scriptText: string): boolean {
  // 空脚本没有可压缩内容，直接跳过。
  if (scriptText.trim() === "") {
    return false;
  }

  const attributeNames = collectHtmlAttributeNames(attributesText);

  // src/data-src 表示外部脚本或延迟加载脚本，不属于内联脚本压缩范围。
  if (attributeNames.has("src") || attributeNames.has("data-src")) {
    return false;
  }

  // th:inline="javascript" 会启用 JavaScript 模板模式，脚本整体都不能交给 Oxc 压缩。
  if (hasThymeleafInlineJavaScript(attributesText, scriptText)) {
    return false;
  }

  // type 为空时按 HTML 规范视为 classic JavaScript；只有 JS MIME 才继续压缩。
  // module、JSON、importmap 等非 classic JavaScript 类型不会命中这个白名单。
  const type = getHtmlAttributeValue(attributesText, "type")?.trim().toLowerCase() ?? "";
  return JAVASCRIPT_MIME_TYPES.has(type);
}

function hasThymeleafInlineJavaScript(attributesText: string, scriptText: string): boolean {
  // th:inline="javascript" 会让 Thymeleaf 按 JavaScript 模板模式处理脚本内容。
  if (/\bth:inline\s*=\s*(?:"javascript"|'javascript'|javascript)\b/imu.test(attributesText)) {
    return true;
  }

  // 没写 th:inline 时，裸的 [[...]]、[(...)] 可能只是普通 JS 字符串或数组形态，
  // 直接匹配会误跳过；这里只拦截 Oxc 会当成普通 JS 注释删除的 Thymeleaf 标记。
  return THYMELEAF_COMMENT_WRAPPED_SCRIPT_MARKERS.some((marker) => scriptText.includes(marker));
}

function collectHtmlAttributeNames(attributesText: string): Set<string> {
  const attributeNames = new Set<string>();
  for (const match of attributesText.matchAll(HTML_ATTRIBUTE_REGEX)) {
    const [, attributeName = ""] = match;

    if (attributeName !== "") {
      attributeNames.add(attributeName.toLowerCase());
    }
  }

  return attributeNames;
}

function getHtmlAttributeValue(attributesText: string, targetAttributeName: string): string | null {
  for (const match of attributesText.matchAll(HTML_ATTRIBUTE_REGEX)) {
    const [, attributeName = "", doubleQuotedValue, singleQuotedValue, unquotedValue] = match;

    if (attributeName.toLowerCase() === targetAttributeName.toLowerCase()) {
      return doubleQuotedValue ?? singleQuotedValue ?? unquotedValue ?? "";
    }
  }

  return null;
}

function findNextInlineScriptTag(sourceText: string, fromIndex: number): InlineScriptTagMatch | null {
  let searchIndex = fromIndex;

  while (true) {
    const openTagStartIndex = sourceText.toLowerCase().indexOf("<script", searchIndex);

    if (openTagStartIndex === -1) {
      return null;
    }

    const openTagNameEndIndex = openTagStartIndex + "<script".length;
    const nextChar = sourceText[openTagNameEndIndex];
    if (nextChar !== undefined && !/[\s>/]/u.test(nextChar)) {
      searchIndex = openTagNameEndIndex;
      continue;
    }

    const openTagEndIndex = findTagEnd(sourceText, openTagNameEndIndex);

    if (openTagEndIndex === -1) {
      return null;
    }

    const closeTagStartIndex = sourceText.toLowerCase().indexOf("</script>", openTagEndIndex + 1);

    if (closeTagStartIndex === -1) {
      return null;
    }

    return {
      attributesText: sourceText.slice(openTagNameEndIndex, openTagEndIndex),
      closeTagEndIndex: closeTagStartIndex + "</script>".length,
      contentText: sourceText.slice(openTagEndIndex + 1, closeTagStartIndex),
      endIndex: closeTagStartIndex + "</script>".length,
      openTagEndIndex,
    };
  }
}

function findTagEnd(sourceText: string, startIndex: number): number {
  let quote: string | null = null;

  for (let index = startIndex; index < sourceText.length; index++) {
    const currentChar = sourceText[index];

    if (quote !== null) {
      if (currentChar === quote) {
        quote = null;
      }
      continue;
    }

    if (currentChar === "'" || currentChar === '"') {
      quote = currentChar;
      continue;
    }

    if (currentChar === ">") {
      return index;
    }
  }

  return -1;
}
