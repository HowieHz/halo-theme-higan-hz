import type { Plugin } from "vite";

export default function cleanupGeneratedCssComments(): Plugin {
  return {
    name: "cleanup-generated-css-comments",
    enforce: "post", // Execute after other plugins
    generateBundle(_options, bundle) {
      for (const fileName of Object.keys(bundle)) {
        const chunk = bundle[fileName];
        if (chunk.type === "chunk" && /\.js$/.test(fileName)) {
          // Remove /* empty css */ comments and its various variants from generated JS files
          // https://github.com/vitejs/vite/issues/1794#issuecomment-769819851
          chunk.code = chunk.code.replace(/\/\*\s*empty css\s*\*\//g, "");
        }

        if (chunk.type === "asset" && /\.css$/.test(fileName) && typeof chunk.source === "string") {
          // Remove the leading /*! ... */ license banner.
          chunk.source = chunk.source.replace(/^\/\*![\s\S]*?\*\/\s*/, "");
        }
      }
    },
  };
}
