import path from "path";
import { fileURLToPath } from "url";
import utwm from "unplugin-tailwindcss-mangle/vite";
import { defineConfig } from "vite";

import headInject from "./plugins/vite-plugin-head-inject";
import moveHtmlPlugin from "./plugins/vite-plugin-move-html";
import thymeleafMinify from "./plugins/vite-plugin-thymeleaf-minify";

export default defineConfig({
  base: "/themes/howiehz-higan/",
  plugins: [
    utwm(), // obfuscate tailwindcss class
    headInject({
      // 在 <head> 标签前插入
      beforeHeadOpen: `<th:block th:fragment="headContent">\n  <!--/*-->\n  `,
      // 在 <head> 标签后插入
      afterHeadOpen: `\n  <!--*/-->`,
      // 在 </head> 标签前插入
      beforeHeadClose: `<!--/*-->\n  `,
      // 在 </head> 标签后插入
      afterHeadClose: `\n  <!--*/-->\n</th:block>`,
      exclude: ["/src/templates/fragments/layout.html"],
    }),
    thymeleafMinify(),
    moveHtmlPlugin({ dest: "templates", flatten: 2 }),
  ],
  build: {
    outDir: fileURLToPath(new URL("./templates/", import.meta.url)),
    assetsDir: "assets/dist/",
    emptyOutDir: false,
    modulePreload: {
      // https://cn.vite.dev/config/build-options#build-modulepreload
      // 开启这个后仅 fragments/layout.html 会注入此 polyfill，其他 fragment 无 js。
      // polyfill 是为不支持 link[rel="modulepreload"] 的旧浏览器加的。
      // 实际页面模板带 polyfill，因此无需在通用模板重复注入。
      polyfill: false,
    },
    rollupOptions: {
      input: {
        "category-tree": path.resolve(__dirname, "src/templates/fragments/category-tree.html"),
        common: path.resolve(__dirname, "src/templates/fragments/common.html"),
        header: path.resolve(__dirname, "src/templates/fragments/header.html"),
        "fragments-layout": path.resolve(__dirname, "src/templates/fragments/layout.html"),
        "fragments-moment-video-modal": path.resolve(__dirname, "src/templates/fragments/moment-video-modal.html"),
        "fragments-page-footer-nav": path.resolve(__dirname, "src/templates/fragments/page-footer-nav.html"),
        "fragments-page-nav": path.resolve(__dirname, "src/templates/fragments/page-nav.html"),
        "fragments-post-footer-nav": path.resolve(__dirname, "src/templates/fragments/post-footer-nav.html"),
        "fragments-post-nav": path.resolve(__dirname, "src/templates/fragments/post-nav.html"),
        "components-pagination": path.resolve(__dirname, "src/templates/components/pagination/template.html"),
        "fragments-list-post-simple": path.resolve(__dirname, "src/templates/fragments/list/post/simple.html"),
        "fragments-list-post-summary": path.resolve(__dirname, "src/templates/fragments/list/post/summary.html"),
        "fragments-list-moment-summary": path.resolve(__dirname, "src/templates/fragments/list/moment/summary.html"),
      },
    },
  },
});
