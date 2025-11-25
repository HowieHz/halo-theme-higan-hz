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
      // https://cn.vite.dev/config/build-options#build-modulepreload
      // 开启这个后会注入此 polyfill。
      // polyfill 是为不支持 link[rel="modulepreload"] 的旧浏览器加的。
      // 只需要在通用模板 fragments/layout.html 注入一次即可。
      polyfill: true,
    },
    rollupOptions: {
      input: {
        "fragments-layout": path.resolve(__dirname, "src/templates/fragments/layout.html"),
      },
    },
  },
});
