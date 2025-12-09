import { promises as fs } from "node:fs";
import { dirname, resolve } from "node:path";
import picomatch from "picomatch";
import type { Plugin } from "vite";

/**
 * Plugin options interface
 */
interface RemoveLegacyGuardJsOptions {
  /** File path patterns to check (glob format) */
  include?: string | string[];
  /** Vite base path */
  base?: string;
}

/**
 * Check if content contains only legacy guard only function
 */
function isLegacyGuardOnly(content: string): boolean {
  const normalizedContent = content.replace(/\s+/g, "");
  const legacyGuardPattern =
    /^exportfunction__vite_legacy_guard\(\)\{import\.meta\.url[,;]import\(`_`\)\.catch\(\(\)=>1\)[,;]\(asyncfunction\*\(\)\{\}\)\(\)\.next\(\)\}$/;
  return legacyGuardPattern.test(normalizedContent);
}

/**
 * Vite plugin that detects and removes emitted "legacy guard" JS files and their corresponding
 * <script type="module" crossorigin src="..."> tags from HTML files during the build.
 *
 * Behavior
 * - Phase 1 (transformIndexHtml - order: "post"):
 *   - Scans included HTML files for <script type="module" crossorigin src="..."></script> tags and
 *     records which HTML files reference each script src.
 *   - Uses picomatch to test whether the current HTML path should be processed (based on `include`).
 *   - If any script src has previously been marked for removal, will remove matching script tags
 *     from the HTML being transformed.
 *
 * - Phase 2 (writeBundle):
 *   - Resolves the output directory from the bundle options (dir, file, or cwd).
 *   - For each recorded script src, resolves the corresponding emitted JS file and reads it.
 *   - If the file is detected as an "legacy guard only" (via isLegacyGuardOnly), the plugin:
 *     - Deletes the emitted JS file from the output.
 *     - Removes the matching <script ... src="..."> tags from the recorded HTML files on disk.
 *   - Logs successes and non-fatal errors; failures to update individual files do not throw the build.
 *
 * @param options Plugin configuration options
 * @returns Vite plugin
 */
export default function removeLegacyGuardJsPlugin(options: RemoveLegacyGuardJsOptions = {}): Plugin {
  const {
    // Default: check HTML files in fragments and components directories
    include = ["/src/templates/fragments/**/*.html", "/src/templates/components/**/*.html"],
    // Default: root path, corresponding to Vite's base configuration
    base = "/",
  } = options;

  // Convert include rules to array
  const includePatterns = Array.isArray(include) ? include : [include];
  const isIncludeMatch = picomatch(includePatterns);

  // Store information to process: map script src to corresponding HTML file paths
  const scriptsToCheck = new Map<string, Set<string>>();
  // Store scripts to remove after detection
  const scriptsToRemove = new Set<string>();

  return {
    name: "vite-plugin-remove-legacy-guard",
    apply: "build",

    // Phase 1: Collect information during HTML transformation
    transformIndexHtml: {
      order: "post",
      async handler(html, ctx) {
        // Check if file is in include list
        if (!isIncludeMatch(ctx.path)) {
          return html;
        }

        // Match all script tags and collect src
        const scriptRegex = /<script\s+type="module"\s+crossorigin\s+src="([^"]+)"[^>]*><\/script>/g;
        let match;

        while ((match = scriptRegex.exec(html)) !== null) {
          const scriptSrc = match[1];

          if (!scriptsToCheck.has(scriptSrc)) {
            scriptsToCheck.set(scriptSrc, new Set());
          }
          scriptsToCheck.get(scriptSrc)?.add(ctx.path);
        }

        // If any scripts marked for removal, remove them from HTML
        if (scriptsToRemove.size > 0) {
          let modifiedHtml = html;
          for (const scriptSrc of scriptsToRemove) {
            // Create regex to match the script tag with this src
            const scriptTagPattern = new RegExp(
              `<script\\s+type="module"\\s+crossorigin\\s+src="${scriptSrc.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*><\\/script>\\s*`,
              "g",
            );
            modifiedHtml = modifiedHtml.replace(scriptTagPattern, "");
          }
          return modifiedHtml;
        }
      },
    },

    // Note: generateBundle was avoided because its emitted output can include
    // "export function __vite_legacy_guard(){...}" plus extra imports like import "./SqU5D8O.js",
    // which would interfere with detecting files that contain only the legacy guard,
    // so the check is performed in writeBundle against the final written files.

    // Phase 2: Process files during writeBundle
    async writeBundle(bundleOptions) {
      // Get output directory: prioritize bundleOptions.dir, then bundleOptions.file directory, finally fallback to current working directory
      const outDir_ = bundleOptions.dir
        ? resolve(bundleOptions.dir)
        : bundleOptions.file
          ? dirname(resolve(bundleOptions.file))
          : process.cwd();

      for (const [scriptSrc, htmlPaths] of scriptsToCheck.entries()) {
        // Remove base path prefix
        let relativePath = scriptSrc;
        if (scriptSrc.startsWith(base)) {
          relativePath = scriptSrc.slice(base.length);
        }

        // Build full path
        const filePath = resolve(outDir_, relativePath);

        try {
          // Read file content
          const fileContent = await fs.readFile(filePath, "utf-8");

          // Check if it's an legacy guard only file
          if (isLegacyGuardOnly(fileContent)) {
            // Delete JS file
            await fs.unlink(filePath);
            console.log(`✓ Deleted legacy guard only file: ${filePath}`);

            // Remove script tags from related HTML files
            scriptsToRemove.add(scriptSrc);
            for (const htmlPath of htmlPaths) {
              const htmlFilePath = resolve(outDir_, htmlPath.replace(/^\//, ""));
              try {
                // Read HTML file
                let htmlContent = await fs.readFile(htmlFilePath, "utf-8");

                // Remove the script tag
                const scriptTagPattern = new RegExp(
                  `<script\\s+type="module"\\s+crossorigin\\s+src="${scriptSrc.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*><\\/script>\\s*`,
                  "g",
                );
                htmlContent = htmlContent.replace(scriptTagPattern, "");

                // Write back the modified HTML
                await fs.writeFile(htmlFilePath, htmlContent, "utf-8");
                console.log(`✓ Removed script from HTML ${htmlFilePath}`);
              } catch (htmlErr) {
                console.error(`✗ Failed to update HTML: ${htmlErr}`);
              }
            }
          }
        } catch (err) {
          console.error(`✗ Processing failed: ${err}`);
        }
      }
    },
  };
}
