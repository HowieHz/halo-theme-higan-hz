import type { Plugin } from "vite";

// remove /* empty css */ comments from generated JS files
// https://github.com/vitejs/vite/issues/1794#issuecomment-769819851

export default function removeEmptyCssComments(): Plugin {
  return {
    name: "remove-empty-css-comments",
    enforce: "post", // 在其他插件之后执行
    generateBundle(options, bundle) {
      for (const fileName in bundle) {
        const chunk = bundle[fileName];
        if (chunk.type === "chunk" && /\.js$/.test(fileName)) {
          // 移除 /* empty css */ 及其各种变体
          chunk.code = chunk.code.replace(/\/\*\s*empty css\s*\*\//g, "");
        }
      }
    },
  };
}
