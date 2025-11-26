import type { Plugin } from "vite";

/**
 * Removes specific copyright comments from JavaScript bundle files.
 *
 * This plugin targets multi-line copyright comments that match a specific pattern,
 * such as the Iconify copyright notice format.
 *
 * Example of removed comment:
 * ```
 * /**
 *  * (c) Iconify
 *  *
 *  * For the full copyright and license information, please view the license.txt or license.gpl.txt
 *  * files at https://github.com/iconify/iconify
 *  *
 *  * Licensed under MIT.
 *  *
 *  * @license MIT
 *  * @version 3.1.1
 *  *\/
 * ```
 *
 * @returns Vite plugin
 */
export default function removeCopyrightCommentsPlugin(): Plugin {
  return {
    name: "vite-plugin-remove-copyright-comments",
    apply: "build",

    generateBundle(_outputOptions, bundle) {
      // Iterate through all generated files in the bundle
      for (const fileName in bundle) {
        const file = bundle[fileName];

        // Only process JavaScript files (both .js and .mjs)
        if (file.type === "chunk" && /\.[cm]?js$/.test(fileName)) {
          // Pattern to match the Iconify-style copyright comment
          // This pattern matches:
          // - /** followed by
          // - Any lines starting with * containing copyright-related content
          // - Closing */
          const copyrightPattern =
            /\/\*\*\s*\n\s*\*\s*\(c\)\s+[^\n]*\n(?:\s*\*[^\n]*\n)*?\s*\*\s*@license[^\n]*\n(?:\s*\*[^\n]*\n)*?\s*\*\/\s*\n?/g;

          // Remove the copyright comments
          const originalCode = file.code;
          const modifiedCode = originalCode.replace(copyrightPattern, "");

          // Only update if changes were made
          if (originalCode !== modifiedCode) {
            file.code = modifiedCode;
            console.log(`✓ Removed copyright comments from: ${fileName}`);
          }
        }
      }
    },
  };
}
