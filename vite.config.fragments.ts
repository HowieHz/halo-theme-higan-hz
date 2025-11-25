import path from "path";
import { fileURLToPath } from "url";
import legacy from "@vitejs/plugin-legacy";
import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";
import utwm from "unplugin-tailwindcss-mangle/vite";
import { defineConfig } from "vite";

import pkg from "./package.json";
import { rollupOutput } from "./plugins/vite-config-build-rollupOptions-output";
import bodyInject from "./plugins/vite-plugin-body-inject";
import headInject from "./plugins/vite-plugin-head-inject";
import moveHtmlPlugin from "./plugins/vite-plugin-move-html";
import thymeleafMinify from "./plugins/vite-plugin-thymeleaf-minify";

export default defineConfig({
  base: "/themes/howiehz-higan/",
  plugins: [
    utwm(), // obfuscate tailwindcss class
    legacy(),
    headInject({
      // 在 <head> 标签前插入
      beforeHeadOpen: `<th:block th:fragment="headContent">\n  <!--/*-->\n  `,
      // 在 <head> 标签后插入
      afterHeadOpen: `\n  <!--*/-->`,
      // 在 </head> 标签前插入
      beforeHeadClose: `<!--/*-->\n  `,
      // 在 </head> 标签后插入
      afterHeadClose: `\n  <!--*/-->\n</th:block>`,
    }),
    bodyInject({
      // 在 <body> 标签前插入
      beforeBodyOpen: `<th:block th:fragment="content">\n  <!--/*-->\n  `,
      // 在 <body> 标签后插入
      afterBodyOpen: `\n  <!--*/-->`,
      // 在 </body> 标签前插入
      beforeBodyClose: `<!--/*-->\n  `,
      // 在 </body> 标签后插入
      afterBodyClose: `\n  <!--*/-->\n  </th:block>`,
    }),
    thymeleafMinify(),
    moveHtmlPlugin({ dest: "templates", flatten: 2 }),
  ],
  esbuild: {
    legalComments: "none", // 移除所有法律注释 https://esbuild.github.io/api/#legal-comments
  },
  css: {
    lightningcss: {
      // https://cn.vitejs.dev/guide/features#lightning-css
      targets: browserslistToTargets(browserslist(pkg.browserslist)),
      minify: true,
    },
  },
  build: {
    outDir: fileURLToPath(new URL("./templates/", import.meta.url)),
    assetsDir: "assets/dist/",
    emptyOutDir: false,
    modulePreload: {
      // https://cn.vite.dev/config/build-options#build-modulepreload
      // 开启这个后会注入此 polyfill。
      // polyfill 是为不支持 link[rel="modulepreload"] 的旧浏览器加的。
      // 只需要在通用模板 fragments/layout.html 注入一次即可。
      polyfill: false,
    },
    cssMinify: "lightningcss",
    rollupOptions: {
      input: {
        "category-tree": path.resolve(__dirname, "src/templates/fragments/category-tree.html"),
        common: path.resolve(__dirname, "src/templates/fragments/common.html"),
        header: path.resolve(__dirname, "src/templates/fragments/header.html"),
        "components-moment-video-modal": path.resolve(
          __dirname,
          "src/templates/components/moment-video-modal/template.html",
        ),
        "fragments-page-footer-nav": path.resolve(__dirname, "src/templates/fragments/page-footer-nav.html"),
        "fragments-page-nav": path.resolve(__dirname, "src/templates/fragments/page-nav.html"),
        "fragments-post-footer-nav": path.resolve(__dirname, "src/templates/fragments/post-footer-nav.html"),
        "fragments-post-nav": path.resolve(__dirname, "src/templates/fragments/post-nav.html"),
        "components-pagination": path.resolve(__dirname, "src/templates/components/pagination/template.html"),
        "components-list-post-simple": path.resolve(
          __dirname,
          "src/templates/components/list-post-simple/template.html",
        ),
        "components-list-post-summary": path.resolve(
          __dirname,
          "src/templates/components/list-post-summary/template.html",
        ),
        "components-list-moment-summary": path.resolve(
          __dirname,
          "src/templates/components/list-moment-summary/template.html",
        ),
      },
      output: rollupOutput,
    },
  },
});
