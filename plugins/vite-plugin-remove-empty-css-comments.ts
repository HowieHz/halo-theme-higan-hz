import type { Plugin } from "vite";

// remove /* empty css */ comments from generated JS files
// https://github.com/vitejs/vite/issues/1794#issuecomment-769819851

export default function removeEmptyCssComments(): Plugin {
  return {
    name: "remove-empty-css-comments",
    enforce: "post", // Execute after other plugins
    generateBundle(_options, bundle) {
      for (const fileName in bundle) {
        const chunk = bundle[fileName];
        if (chunk.type === "chunk" && /\.js$/.test(fileName)) {
          // Remove /* empty css */ and its various variants
          chunk.code = chunk.code.replace(/\/\*\s*empty css\s*\*\//g, "");
        }
      }
    },
  };
}
