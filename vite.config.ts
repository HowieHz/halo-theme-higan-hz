import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
// vite.config.js
import PurgeIcons from "vite-plugin-purge-icons";

export default defineConfig({
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
      },
      output: {
        entryFileNames: "main.js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.names && assetInfo.names.includes("main.css")) {
            return "style.css";
          }
          return "[name][extname]";
        },
      },
    },
  },
});
