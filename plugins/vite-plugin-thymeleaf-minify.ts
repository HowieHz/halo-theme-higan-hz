import type { Plugin } from "vite";

export default function thymeleafMinify(): Plugin {
  return {
    name: "vite-plugin-thymeleaf-minify",
    enforce: "post",
    transformIndexHtml: {
      order: "post", // 在所有转换之后执行
      handler(html) {
        // 删除 // <!--/* 到 */--> 的注释 (但不删除 // <!--/*/ 到 /*/-->)
        // 使用负向前瞻确保 <!--/* 后面不是 /
        html = html.replace(/\/\/\s*<!--\/\*(?!\/)([\s\S]*?)\*\/-->/g, "");

        // 删除 <!--/* 到 */--> 的注释 (但不删除 <!--/*/ 到 /*/-->)
        // 使用负向前瞻确保 <!--/* 后面不是 /
        html = html.replace(/<!--\/\*(?!\/)([\s\S]*?)\*\/-->/g, "");

        // 清除连续的空行
        html = html.replace(/\n\s*\n/g, "\n");

        return html;
      },
    },
  };
}
