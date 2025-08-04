import path from "path";
import { fileURLToPath } from "url";
import legacy from "@vitejs/plugin-legacy";
import { defineConfig } from "vite";
import PurgeIcons from "vite-plugin-purge-icons";

import copyFilePlugin from "./plugins/vite-copy-file";
import moveHtmlPlugin from "./plugins/vite-move-html";
import headInject from "./plugins/vite-plugin-head-inject";

export default defineConfig({
  base: "/themes/howiehz-higan/",
  plugins: [
    PurgeIcons({
      content: ["./templates/*.html"],
    }),
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
    moveHtmlPlugin({ dest: "templates", flatten: 2 }),
    copyFilePlugin({
      targets: [
        { src: "src/templates/error", dest: "templates/error" },
        { src: "src/templates/fragments", dest: "templates/fragments" },
      ],
    }),
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
        photos: path.resolve(__dirname, "src/templates/photos.html"),
        post: path.resolve(__dirname, "src/templates/post.html"),
        tag: path.resolve(__dirname, "src/templates/tag.html"),
        tags: path.resolve(__dirname, "src/templates/tags.html"),
      },
      output: {
        assetFileNames: (assetInfo) => {
          const fontExtensions = [".woff2", ".woff", ".ttf"];
          const name = assetInfo.names[0] ?? "";
          if (fontExtensions.some((ext) => name.endsWith(ext)) && name.startsWith("MesloLGS-Regular")) {
            return "assets/dist/[name][extname]";
          }
          return "assets/dist/[name]-[hash][extname]";
        },
      },
    },
  },
});
