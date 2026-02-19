import path from "node:path";
import { fileURLToPath } from "node:url";
import { constants } from "node:zlib";
import tailwindcss from "@tailwindcss/vite";
import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";
import utwm from "unplugin-tailwindcss-mangle/vite";
import { defineConfig } from "vite";
import { compression, defineAlgorithm } from "vite-plugin-compression2";
import { sri } from "vite-plugin-sri3";

import pkg from "./package.json";
import { rollupOutput } from "./plugins/vite-config-build-rollupOptions-output";
import bodyInject from "./plugins/vite-plugin-body-inject";
import headInject from "./plugins/vite-plugin-head-inject";
import moveHtmlPlugin from "./plugins/vite-plugin-move-html";
import removeEmptyCssComments from "./plugins/vite-plugin-remove-empty-css-comments";
import thymeleafMinify from "./plugins/vite-plugin-thymeleaf-minify";

export default defineConfig({
  base: "/themes/howiehz-higan/",
  plugins: [
    tailwindcss(),
    utwm(), // obfuscate tailwindcss class
    headInject({
      // 在 <head> 标签前插入
      beforeHeadOpen: `<th:block th:fragment="headContent">\n  <!--/*-->\n  `,
      // 在 <head> 标签后插入
      afterHeadOpen: `\n  <!--*/-->`,
      // 在 </head> 标签前插入
      beforeHeadClose: `<!--/*-->\n  `,
      // 在 </head> 标签后插入
      afterHeadClose: `\n  <!--*/-->\n  </th:block>`,
      exclude: ["/src/templates/fragments/layout.html"],
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
      exclude: ["/src/templates/fragments/layout.html"],
    }),
    removeEmptyCssComments(),
    thymeleafMinify({
      base: "/themes/howiehz-higan/",
    }),
    sri(),
    compression({
      algorithms: [
        defineAlgorithm("gzip", { level: 9 }),
        defineAlgorithm("brotliCompress", {
          params: {
            [constants.BROTLI_PARAM_QUALITY]: 11,
          },
        }),
        defineAlgorithm("zstandard", {
          params: {
            // The maximum compression level is 22, but memory consumption becomes very large and can cause build failures
            [constants.ZSTD_c_compressionLevel]: 21,
          },
        }),
      ],
      include: [
        /\.(atom|rss|xml|xhtml|js|mjs|ts|html|json|css|eot|otf|ttf|svg|ico|bmp|dib|txt|text|log|md|conf|ini|cfg)$/,
      ],
      // src/templates/**/*.html are template files and should not be compressed
      exclude: [/^src\/templates\/.*\.html$/],
    }),
    moveHtmlPlugin({ dest: "templates", flatten: 2 }),
  ],
  css: {
    transformer: "lightningcss",
    lightningcss: {
      // https://cn.vitejs.dev/guide/features#lightning-css
      targets: browserslistToTargets(browserslist(pkg.browserslist)),
    },
  },
  build: {
    target: ["chrome111", "edge111", "firefox114", "safari16.4"],
    outDir: fileURLToPath(new URL("./templates/", import.meta.url)),
    assetsDir: "assets/dist/",
    emptyOutDir: true,
    modulePreload: {
      // https://cn.vite.dev/config/build-options#build-modulepreload
      // polyfill 是为不支持 link[rel="modulepreload"] 的旧浏览器加的。
      // 仅在 src/templates/fragments/layout.html 手动注入 polyfill
      polyfill: false,
    },
    cssMinify: "lightningcss",
    rollupOptions: {
      input: {
        // pages
        archives: path.resolve(__dirname, "src/templates/archives.html"),
        author: path.resolve(__dirname, "src/templates/author.html"),
        categories: path.resolve(__dirname, "src/templates/categories.html"),
        category: path.resolve(__dirname, "src/templates/category.html"),
        index: path.resolve(__dirname, "src/templates/index.html"),
        links: path.resolve(__dirname, "src/templates/links.html"),
        moment: path.resolve(__dirname, "src/templates/moment.html"),
        moments: path.resolve(__dirname, "src/templates/moments.html"),
        page: path.resolve(__dirname, "src/templates/page.html"),
        "page-like-post-style": path.resolve(__dirname, "src/templates/page-like-post-style.html"),
        photos: path.resolve(__dirname, "src/templates/photos.html"),
        post: path.resolve(__dirname, "src/templates/post.html"),
        tag: path.resolve(__dirname, "src/templates/tag.html"),
        tags: path.resolve(__dirname, "src/templates/tags.html"),
        friends: path.resolve(__dirname, "src/templates/friends.html"),
        error: path.resolve(__dirname, "src/templates/error/error.html"),
        // components
        "components-moment-video-modal": path.resolve(
          __dirname,
          "src/templates/components/moment-video-modal/template.html",
        ),
        "components-pagination": path.resolve(__dirname, "src/templates/components/pagination/template.html"),
        "components-list-post-simple": path.resolve(
          __dirname,
          "src/templates/components/list-post-simple/template.html",
        ),
        "components-list-post-summary": path.resolve(
          __dirname,
          "src/templates/components/list-post-summary/template.html",
        ),
        "components-list-friends-summary": path.resolve(
          __dirname,
          "src/templates/components/list-friends-summary/template.html",
        ),
        "components-list-moment-summary": path.resolve(
          __dirname,
          "src/templates/components/list-moment-summary/template.html",
        ),
        "components-header": path.resolve(__dirname, "src/templates/components/header/template.html"),
        "components-halo-comment-widget": path.resolve(
          __dirname,
          "src/templates/components/halo-comment-widget/template.html",
        ),
        "components-color-scheme-light": path.resolve(
          __dirname,
          "src/templates/components/color-scheme-light/template.html",
        ),
        "components-color-scheme-dark": path.resolve(
          __dirname,
          "src/templates/components/color-scheme-dark/template.html",
        ),
        "components-color-scheme-auto": path.resolve(
          __dirname,
          "src/templates/components/color-scheme-auto/template.html",
        ),
        "components-text-size-small": path.resolve(__dirname, "src/templates/components/text-size-small/template.html"),
        "components-text-size-normal": path.resolve(
          __dirname,
          "src/templates/components/text-size-normal/template.html",
        ),
        "components-text-size-large": path.resolve(__dirname, "src/templates/components/text-size-large/template.html"),
        "components-theme-dark": path.resolve(__dirname, "src/templates/components/theme-dark/template.html"),
        "components-theme-light": path.resolve(__dirname, "src/templates/components/theme-light/template.html"),
        "components-theme-dark-blue": path.resolve(__dirname, "src/templates/components/theme-dark-blue/template.html"),
        "components-theme-light-blue": path.resolve(
          __dirname,
          "src/templates/components/theme-light-blue/template.html",
        ),
        "components-theme-gray": path.resolve(__dirname, "src/templates/components/theme-gray/template.html"),
        "components-theme-auto": path.resolve(__dirname, "src/templates/components/theme-auto/template.html"),
        "components-theme-auto-blue": path.resolve(__dirname, "src/templates/components/theme-auto-blue/template.html"),
        // fragments
        "fragments-layout": path.resolve(__dirname, "src/templates/fragments/layout.html"),
        "fragments-category-tree": path.resolve(__dirname, "src/templates/fragments/category-tree.html"),
        "fragments-common": path.resolve(__dirname, "src/templates/fragments/common.html"),
        "fragments-page-like-post-style-footer-nav": path.resolve(
          __dirname,
          "src/templates/fragments/page-like-post-style-footer-nav.html",
        ),
        "fragments-page-like-post-style-nav": path.resolve(
          __dirname,
          "src/templates/fragments/page-like-post-style-nav.html",
        ),
        "fragments-post-footer-nav": path.resolve(__dirname, "src/templates/fragments/post-footer-nav.html"),
        "fragments-post-nav": path.resolve(__dirname, "src/templates/fragments/post-nav.html"),
      },
      output: rollupOutput,
    },
  },
});
