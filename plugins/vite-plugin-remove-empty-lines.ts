import type { Plugin } from "vite";

export default function removeEmptyLines(): Plugin {
  return {
    name: "vite-plugin-remove-empty-lines",
    enforce: "post",
    transformIndexHtml: {
      order: "post", // 在所有转换之后执行
      handler(html) {
        // 清除连续的空行
        return html.replace(/\n\s*\n/g, "\n");
      },
    },
  };
}
