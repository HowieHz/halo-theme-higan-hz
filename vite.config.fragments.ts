import path from "path";
import { fileURLToPath } from "url";
import utwm from "unplugin-tailwindcss-mangle/vite";
import { defineConfig } from "vite";

import moveHtmlPlugin from "./plugins/vite-plugin-move-html";
import thymeleafMinify from "./plugins/vite-plugin-thymeleaf-minify";

export default defineConfig({
  base: "/themes/howiehz-higan/",
  plugins: [
    utwm(), // obfuscate tailwindcss class
    thymeleafMinify(),
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
        "fragments-page-footer-nav": path.resolve(__dirname, "src/templates/fragments/page-footer-nav.html"),
        "fragments-page-nav": path.resolve(__dirname, "src/templates/fragments/page-nav.html"),
        "fragments-post-footer-nav": path.resolve(__dirname, "src/templates/fragments/post-footer-nav.html"),
        "fragments-post-nav": path.resolve(__dirname, "src/templates/fragments/post-nav.html"),
        "fragments-pagination": path.resolve(__dirname, "src/templates/fragments/pagination.html"),
        "fragments-list-post-simple": path.resolve(__dirname, "src/templates/fragments/list/post/simple.html"),
        "fragments-list-post-summary": path.resolve(__dirname, "src/templates/fragments/list/post/summary.html"),
        "fragments-list-moment-summary": path.resolve(__dirname, "src/templates/fragments/list/moment/summary.html"),
      },
    },
  },
});
