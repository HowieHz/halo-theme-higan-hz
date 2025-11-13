import path from "path";
import { fileURLToPath } from "url";
import utwm from "unplugin-tailwindcss-mangle/vite";
import { defineConfig } from "vite";
import PurgeIcons from "vite-plugin-purge-icons";

export default defineConfig({
  base: "/halo-theme-higan-hz/",
  plugins: [
    PurgeIcons({
      content: ["./templates/post.html"],
    }),
    utwm(), // obfuscate tailwindcss class
  ],
  css: {
    devSourcemap: false,
  },
  build: {
    outDir: fileURLToPath(new URL("./tmp/docs/styles/", import.meta.url)),
    emptyOutDir: true,
    cssCodeSplit: false, // 不拆分 CSS，合并成一个文件
    rollupOptions: {
      input: {
        post: path.resolve(__dirname, "src/templates/post.html"),
      },
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith(".css")) {
            return "post-[hash].css";
          }
          return "assets/[name]-[hash][extname]";
        },
        entryFileNames: "[name]-[hash].js",
        chunkFileNames: "[name]-[hash].js",
      },
    },
  },
});
