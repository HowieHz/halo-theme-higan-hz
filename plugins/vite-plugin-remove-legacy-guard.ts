import { promises as fs } from "fs";
import { dirname, resolve } from "path";
import picomatch from "picomatch";
import type { Plugin } from "vite";

/**
 * Plugin options interface
 */
interface RemoveLegacyGuardOptions {
  /** File path patterns to check (glob format) */
  include?: string | string[];
  /** Vite base path */
  base?: string;
}

/**
 * Check if content contains only empty legacy guard function
 */
function isLegacyGuardOnly(content: string): boolean {
  const normalizedContent = content.replace(/\s+/g, "");
  const legacyGuardPattern =
    /^exportfunction__vite_legacy_guard\(\)\{import\.meta\.url[,;]import\(`_`\)\.catch\(\(\)=>1\)[,;]\(asyncfunction\*\(\)\{\}\)\(\)\.next\(\)\}$/;
  return legacyGuardPattern.test(normalizedContent);
}

/**
 * Plugin to remove empty JS files containing only legacy guard function and their script tags
 * @param options Plugin configuration options
 * @returns Vite plugin
 */
export default function removeLegacyGuardPlugin(options: RemoveLegacyGuardOptions = {}): Plugin {
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

        console.log(`Checking file: ${ctx.path}`);

        // Match all script tags and collect src
        const scriptRegex = /<script\s+type="module"\s+crossorigin\s+src="([^"]+)"[^>]*><\/script>/g;
        let match;

        while ((match = scriptRegex.exec(html)) !== null) {
          const scriptSrc = match[1];
          console.log(`Found script tag: src="${scriptSrc}"`);

          if (!scriptsToCheck.has(scriptSrc)) {
            scriptsToCheck.set(scriptSrc, new Set());
          }
          scriptsToCheck.get(scriptSrc)?.add(ctx.path);
        }
      },
    },

    // Phase 2: Process files during writeBundle
    async writeBundle(bundleOptions) {
      // Get output directory: prioritize bundleOptions.dir, then bundleOptions.file directory, finally fallback to current working directory
      const outDir_ = bundleOptions.dir
        ? resolve(bundleOptions.dir)
        : bundleOptions.file
          ? dirname(resolve(bundleOptions.file))
          : process.cwd();

      console.log(`\nProcessing legacy guard files`);

      for (const [scriptSrc, htmlPaths] of scriptsToCheck.entries()) {
        console.log(`\nChecking: ${scriptSrc}`);

        // Remove base path prefix
        let relativePath = scriptSrc;
        if (scriptSrc.startsWith(base)) {
          relativePath = scriptSrc.slice(base.length);
        }

        // Build full path
        const filePath = resolve(outDir_, relativePath);
        console.log(`File path: ${filePath}`);

        try {
          // Read file content
          const fileContent = await fs.readFile(filePath, "utf-8");

          // Check if it's an empty legacy guard file
          if (isLegacyGuardOnly(fileContent)) {
            console.log(`✓ Detected empty legacy guard file`);

            // Delete JS file
            await fs.unlink(filePath);
            console.log(`✓ Deleted: ${filePath}`);

            // Remove script tags from related HTML files
            for (const htmlPath of htmlPaths) {
              console.log(`→ Remove script from HTML: ${htmlPath}`);
              // Mark for subsequent processing
            }
          } else {
            console.log(`✗ File contains other content, keep it`);
          }
        } catch (err) {
          console.log(`⚠️ Processing failed: ${err}`);
        }
      }
    },
  };
}
