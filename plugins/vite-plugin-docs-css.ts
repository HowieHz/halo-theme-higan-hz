import fs from "fs/promises";
import path from "path";
import type { Plugin } from "vite";

export function docsCssPlugin(): Plugin {
  return {
    name: "docs-css-plugin",

    async closeBundle() {
      const stylesDir = path.resolve(__dirname, "../tmp/docs/styles");
      try {
        const files = await fs.readdir(stylesDir);
        const cssFile = files.find((f) => f.startsWith("post-") && f.endsWith(".css"));

        if (cssFile) {
          await fs.writeFile(path.join(stylesDir, "manifest.json"), JSON.stringify({ postCss: cssFile }, null, 2));
          console.log(`✓ Generated CSS: ${cssFile}`);
        }
      } catch (err) {
        console.warn("Could not generate CSS manifest:", err);
      }
    },
  };
}
