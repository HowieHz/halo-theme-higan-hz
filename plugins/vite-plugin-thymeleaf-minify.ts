// import { Buffer } from "node:buffer";
import { promises as fs } from "node:fs";
import { dirname, resolve } from "node:path";
import { styleText } from "node:util";

// import minifyHtml from "@minify-html/node";
import type { Plugin } from "vite";

const LOG_PREFIX = styleText("cyan", "[thymeleaf-minify]");

/**
 * Plugin options interface
 */
interface ThymeleafMinifyOptions {
  /** Vite base path */
  base?: string;
}

/**
 * Vite plugin that removes Thymeleaf prototype-only comments from HTML files and cleans up orphaned script files.
 *
 * Behavior:
 * - Phase 1 (transformIndexHtml - order: "post"):
 *   - Tracks all script tags (checking both src and data-src attributes) before transformation.
 *   - Removes Thymeleaf prototype comments (<!--/* ... *\/-->) while preserving parser-level comments (<!--/*\/ ... /*\/-->).
 *   - Compares script tags before and after to identify scripts removed during comment removal.
 *   - Records which HTML files had which scripts removed.
 *
 * - Phase 2 (writeBundle):
 *   - For each script that was removed from HTML files, checks if the corresponding JS file is still referenced elsewhere.
 *   - Recursively scans all HTML files in the output directory.
 *   - If a JS file is no longer referenced by any HTML file, deletes it as an orphaned file.
 *   - Logs all actions for transparency.
 *
 * Supported script formats:
 * - <script type="module" crossorigin src="..."> (modern modules)
 * - <script nomodule crossorigin src="..."> (legacy scripts)
 * - <script nomodule crossorigin data-src="..."> (Vite legacy plugin format)
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

/**
 * Recursively find all HTML files inside a directory.
 */
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
 * Remove nested Thymeleaf prototype-only comments using a stack-based
 * algorithm.
 *
 * Supported formats:
 * - <!--/* ... *\/--> (no prefix)
 * - //<!--/* ... *\/--> (JS comment prefix, no space)
 * - // <!--/* ... *\/--> (JS comment prefix, with space)
 * Parser-level comments such as <!--/*\/ ... /*\/--> are preserved.
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

  while (i < html.length) {
    let matched = false;

    // 1. Check for parser-level comment start, including supported prefixes.
    for (const prefix of PREFIXES) {
      const fullExcludeStart = prefix + EXCLUDE_START;
      if (html.slice(i, i + fullExcludeStart.length) === fullExcludeStart) {
        if (depth === 0) {
          result.push(fullExcludeStart);
        }
        i += fullExcludeStart.length;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    // Parser-level comment start without prefix.
    if (html.slice(i, i + EXCLUDE_START.length) === EXCLUDE_START) {
      if (depth === 0) {
        result.push(EXCLUDE_START);
      }
      i += EXCLUDE_START.length;
      continue;
    }

    // 2. Check for parser-level comment end.
    if (html.slice(i, i + EXCLUDE_END.length) === EXCLUDE_END) {
      if (depth === 0) {
        result.push(EXCLUDE_END);
      }
      i += EXCLUDE_END.length;
      continue;
    }

    // 3. Check for prototype-only comment start, including supported prefixes.
    for (const prefix of PREFIXES) {
      const fullStartMarker = prefix + START_MARKER;
      if (html.slice(i, i + fullStartMarker.length) === fullStartMarker) {
        depth++;
        i += fullStartMarker.length;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    // Prototype-only comment start without prefix.
    if (html.slice(i, i + START_MARKER.length) === START_MARKER) {
      depth++;
      i += START_MARKER.length;
      continue;
    }

    // 4. Check for prototype-only comment end.
    if (html.slice(i, i + END_MARKER.length) === END_MARKER) {
      if (depth > 0) {
        depth--;
      }
      i += END_MARKER.length;
      continue;
    }

    // 5. If not inside a removable comment, preserve the character.
    if (depth === 0) {
      result.push(html[i]);
    }
    i++;
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
