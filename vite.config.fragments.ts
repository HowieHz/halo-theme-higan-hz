import path from "path";
import { fileURLToPath } from "url";
import utwm from "unplugin-tailwindcss-mangle/vite";
import { defineConfig } from "vite";

import moveHtmlPlugin from "./plugins/vite-move-html";

export default defineConfig({
  base: "/themes/howiehz-higan/",
  plugins: [
    utwm(), // obfuscate tailwindcss class
    moveHtmlPlugin({ dest: "templates", flatten: 2 }),
  ],
  build: {
    outDir: fileURLToPath(new URL("./templates/", import.meta.url)),
    assetsDir: "assets/dist/",
    emptyOutDir: false,
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
