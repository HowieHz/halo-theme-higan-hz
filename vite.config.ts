import path from "path";
import { fileURLToPath } from "url";
import legacy from "@vitejs/plugin-legacy";
import utwm from "unplugin-tailwindcss-mangle/vite";
import { defineConfig } from "vite";
// @ts-expect-error old version without types
import PurgeIcons from "vite-plugin-purge-icons";

import bodyInject from "./plugins/vite-plugin-body-inject";
import headInject from "./plugins/vite-plugin-head-inject";
import moveHtmlPlugin from "./plugins/vite-plugin-move-html";
import replaceHtmlPlugin from "./plugins/vite-plugin-replace-html";
import thymeleafMinify from "./plugins/vite-plugin-thymeleaf-minify";

export default defineConfig({
  base: "/themes/howiehz-higan/",
  plugins: [
    PurgeIcons({
      content: ["./templates/**/*.html"],
    }),
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
      afterHeadClose: `\n  <!--*/-->\n  </th:block>`,
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
    replaceHtmlPlugin({
      rules: [
        // 清理模板，匹配四种注释包裹的 head/body 标签
        {
          from: /^\s*<!--\/\*-->\s*<head>\s*<!--\*\/-->\s*$/gm,
          to: "",
        },
        {
          from: /^\s*<!--\/\*-->\s*<\/head>\s*<!--\*\/-->\s*$/gm,
          to: "",
        },
        {
          from: /^\s*<!--\/\*-->\s*<body>\s*<!--\*\/-->\s*$/gm,
          to: "",
        },
        {
          from: /^\s*<!--\/\*-->\s*<\/body>\s*<!--\*\/-->\s*$/gm,
          to: "",
        },
      ],
    }),
    thymeleafMinify(),
    moveHtmlPlugin({ dest: "templates", flatten: 2 }),
  ],
  build: {
    outDir: fileURLToPath(new URL("./templates/", import.meta.url)),
    assetsDir: "assets/dist/",
    emptyOutDir: true,
    rollupOptions: {
      input: {
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
        "5xx": path.resolve(__dirname, "src/templates/error/5xx.html"),
        "404": path.resolve(__dirname, "src/templates/error/404.html"),
      },
      output: {
        assetFileNames: (assetInfo) => {
          const fontExtensions = [".woff2", ".woff", ".ttf"];
          const name = assetInfo.names[0] ?? "";
          if (fontExtensions.some((ext) => name.endsWith(ext))) {
            return "assets/dist/[hash][extname]";
          }
          return "assets/dist/[name]-[hash][extname]";
        },
      },
    },
  },
});
