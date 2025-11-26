import { promises as fs } from "fs";
import { dirname, resolve } from "path";
import type { Plugin } from "vite";

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

  // Track script tags that were removed from HTML during transformation
  const removedScripts = new Map<string, Set<string>>(); // scriptSrc -> Set of HTML file paths

  return {
    name: "vite-plugin-thymeleaf-minify",
    enforce: "post",
    transformIndexHtml: {
      order: "post", // Execute after all transformations
      handler(html, ctx) {
        // First, find all script tags in the original HTML (checking both src and data-src)
        const originalScripts = new Set<string>();

        // Extract all script src and data-src attributes
        const scriptRegex = /<script\s[^>]*>/g;
        let match;
        while ((match = scriptRegex.exec(html)) !== null) {
          const scriptTag = match[0];

          // Check for src attribute
          const srcMatch = /\ssrc="([^"]+)"/.exec(scriptTag);
          if (srcMatch) {
            originalScripts.add(srcMatch[1]);
          }

          // Check for data-src attribute
          const dataSrcMatch = /\sdata-src="([^"]+)"/.exec(scriptTag);
          if (dataSrcMatch) {
            originalScripts.add(dataSrcMatch[1]);
          }
        }

        // Remove Thymeleaf prototype comments (supports multiple prefix formats)
        // But preserve parser-level comments <!--/*/ ... /*/-->
        html = removeNestedThymeleafComments(html);

        // Remove consecutive empty lines
        html = html.replace(/\n\s*\n/g, "\n");

        // Now, find which script tags remain after transformation
        const remainingScripts = new Set<string>();
        scriptRegex.lastIndex = 0; // Reset regex
        while ((match = scriptRegex.exec(html)) !== null) {
          const scriptTag = match[0];

          // Check for src attribute
          const srcMatch = /\ssrc="([^"]+)"/.exec(scriptTag);
          if (srcMatch) {
            remainingScripts.add(srcMatch[1]);
          }

          // Check for data-src attribute
          const dataSrcMatch = /\sdata-src="([^"]+)"/.exec(scriptTag);
          if (dataSrcMatch) {
            remainingScripts.add(dataSrcMatch[1]);
          }
        }

        // Track scripts that were removed
        for (const scriptSrc of originalScripts) {
          if (!remainingScripts.has(scriptSrc)) {
            if (!removedScripts.has(scriptSrc)) {
              removedScripts.set(scriptSrc, new Set());
            }
            removedScripts.get(scriptSrc)?.add(ctx.path);
          }
        }

        return html;
      },
    },

    // Check and remove orphaned JS files after bundle is written
    async writeBundle(bundleOptions) {
      if (removedScripts.size === 0) {
        console.log("\n[thymeleaf-minify] No scripts were removed, skipping orphan check.");
        return;
      }

      // Get output directory
      const outDir = bundleOptions.dir
        ? resolve(bundleOptions.dir)
        : bundleOptions.file
          ? dirname(resolve(bundleOptions.file))
          : process.cwd();

      console.log(`\n[thymeleaf-minify] Checking ${removedScripts.size} script(s) removed by Thymeleaf minification`);

      for (const [scriptSrc, htmlPaths] of removedScripts.entries()) {
        console.log(`\n[thymeleaf-minify] Checking: ${scriptSrc}`);

        // Remove base path prefix
        let relativePath = scriptSrc;
        if (scriptSrc.startsWith(base)) {
          relativePath = scriptSrc.slice(base.length);
        } else {
          relativePath = scriptSrc.replace(/^\//, "");
        }

        // Build full path
        const filePath = resolve(outDir, relativePath);
        console.log(`[thymeleaf-minify]   File path: ${filePath}`);

        try {
          // Check if the file exists
          await fs.access(filePath);
          console.log(`[thymeleaf-minify]   ✓ File exists`);

          // Check if this script is referenced by any other HTML files
          // by checking if it exists in the final bundle output
          const allHtmlFiles = await findHtmlFiles(outDir);
          let isReferencedElsewhere = false;

          for (const htmlFile of allHtmlFiles) {
            // Skip the HTML files that removed this script
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

          // If not referenced anywhere, delete the JS file
          if (!isReferencedElsewhere) {
            await fs.unlink(filePath);
            console.log(`[thymeleaf-minify]   ✓ Deleted orphaned script: ${relativePath}`);
          } else {
            console.log(`[thymeleaf-minify]   ℹ Keeping script (still referenced): ${relativePath}`);
          }
        } catch (err) {
          // File doesn't exist or can't be accessed
          if ((err as NodeJS.ErrnoException).code === "ENOENT") {
            console.log(`[thymeleaf-minify]   ℹ File not found (already removed or doesn't exist): ${relativePath}`);
          } else {
            console.log(`[thymeleaf-minify]   ⚠️ Error processing ${relativePath}: ${err}`);
          }
        }
      }
    },
  };
}

/**
 * Recursively find all HTML files in a directory
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
    // Ignore errors (e.g., permission denied)
  }

  return results;
}

/**
 * Remove nested Thymeleaf prototype comments using a stack-based algorithm
 * Supported formats:
 * - <!--/* ... *\/--> (no prefix)
 * - //<!--/* ... *\/--> (JS comment prefix, no space)
 * - // <!--/* ... *\/--> (JS comment prefix, with space)
 * Preserves parser-level comments: <!--/*\/ ... /*\/-->
 */
function removeNestedThymeleafComments(html: string): string {
  const result: string[] = [];
  let depth = 0;
  let i = 0;

  const START_MARKER = "<!--/*";
  const END_MARKER = "*/-->";
  const EXCLUDE_START = "<!--/*/"; // Parser-level comment start
  const EXCLUDE_END = "/*/-->"; // Parser-level comment end
  const PREFIXES = ["// ", "//"]; // Possible prefixes (in descending order of length)

  while (i < html.length) {
    let matched = false;

    // 1. Check for parser-level comment start (supports all prefixes)
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

    // Parser-level comment start without prefix
    if (html.slice(i, i + EXCLUDE_START.length) === EXCLUDE_START) {
      if (depth === 0) {
        result.push(EXCLUDE_START);
      }
      i += EXCLUDE_START.length;
      continue;
    }

    // 2. Check for parser-level comment end
    if (html.slice(i, i + EXCLUDE_END.length) === EXCLUDE_END) {
      if (depth === 0) {
        result.push(EXCLUDE_END);
      }
      i += EXCLUDE_END.length;
      continue;
    }

    // 3. Check for prototype comment start (supports all prefixes)
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

    // Prototype comment start without prefix
    if (html.slice(i, i + START_MARKER.length) === START_MARKER) {
      depth++;
      i += START_MARKER.length;
      continue;
    }

    // 4. Check for prototype comment end
    if (html.slice(i, i + END_MARKER.length) === END_MARKER) {
      if (depth > 0) {
        depth--;
      }
      i += END_MARKER.length;
      continue;
    }

    // 5. If not inside a comment, preserve the character
    if (depth === 0) {
      result.push(html[i]);
    }
    i++;
  }

  return result.join("");
}
