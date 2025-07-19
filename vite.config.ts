import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
// vite.config.js
import PurgeIcons from "vite-plugin-purge-icons";

export default defineConfig({
  base: "/themes/howiehz-higan/assets/dist/",
  plugins: [
    PurgeIcons({
      content: ["./templates/*.html"],
    }),
  ],
  build: {
    outDir: fileURLToPath(new URL("./templates/assets/dist", import.meta.url)),
    assetsDir: "",
    emptyOutDir: true,

    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "src/main.ts"),
        index: path.resolve(__dirname, "src/pages/index.ts"),
        post: path.resolve(__dirname, "src/pages/post.ts"),
        page: path.resolve(__dirname, "src/pages/page.ts"),
        moment: path.resolve(__dirname, "src/pages/moment.ts"),
        archives: path.resolve(__dirname, "src/pages/archives.ts"),
        photos: path.resolve(__dirname, "src/pages/photos.ts"),
        links: path.resolve(__dirname, "src/pages/links.ts"),
        author: path.resolve(__dirname, "src/pages/author.ts"),
      },
      output: {
        entryFileNames: "[name].js",
        assetFileNames: () => {
          return "[name][extname]";
        },
      },
    },
  },
});
