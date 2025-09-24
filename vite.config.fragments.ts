import path from "path";
import { fileURLToPath } from "url";
import utwm from "unplugin-tailwindcss-mangle/vite";
import { defineConfig } from "vite";

import moveHtmlPlugin from "./plugins/vite-move-html";
import replaceHtmlPlugin from "./plugins/vite-plugin-replace-html";

export default defineConfig({
  base: "/themes/howiehz-higan/",
  plugins: [
    utwm(), // obfuscate tailwindcss class
    replaceHtmlPlugin({
      rules: [
        {
          from: /<script type="module" crossorigin src="\/themes\/howiehz-higan\/assets\/dist\/fragments-layout-[^"]*\.js"><\/script>/,
          to: (match) => {
            // 保留原有的 script 标签，但添加 data-swup-ignore-script 属性，防止 swup 重复加载
            return match.replace("<script ", "<script data-swup-ignore-script ");
          },
        },
      ],
    }),
    moveHtmlPlugin({ dest: "templates", flatten: 2 }),
  ],
  build: {
    outDir: fileURLToPath(new URL("./templates/", import.meta.url)),
    assetsDir: "assets/dist/",
    emptyOutDir: false,
    modulePreload: {
      polyfill: false, // 仅 fragments/layout.html 会注入此 polyfill，其他 fragment 无 js，但其他页面 js 包括此 polyfill，因此无需重复注入
    },
    rollupOptions: {
      input: {
        "category-tree": path.resolve(__dirname, "src/templates/fragments/category-tree.html"),
        common: path.resolve(__dirname, "src/templates/fragments/common.html"),
        header: path.resolve(__dirname, "src/templates/fragments/header.html"),
        "fragments-layout": path.resolve(__dirname, "src/templates/fragments/layout.html"),
        "fragments-moment": path.resolve(__dirname, "src/templates/fragments/moment.html"),
        "fragments-moments": path.resolve(__dirname, "src/templates/fragments/moments.html"),
        "fragments-page-footer-nav": path.resolve(__dirname, "src/templates/fragments/page-footer-nav.html"),
        "fragments-page-nav": path.resolve(__dirname, "src/templates/fragments/page-nav.html"),
        "fragments-post-footer-nav": path.resolve(__dirname, "src/templates/fragments/post-footer-nav.html"),
        "fragments-post-nav": path.resolve(__dirname, "src/templates/fragments/post-nav.html"),
        "fragments-posts": path.resolve(__dirname, "src/templates/fragments/posts.html"),
      },
    },
  },
});
