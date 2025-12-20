import path from "path";
import { fileURLToPath } from "url";
import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";
import utwm from "unplugin-tailwindcss-mangle/vite";
import { defineConfig } from "vite";

import pkg from "./package.json";
import { rollupOutput } from "./plugins/vite-config-build-rollupOptions-output";
import moveHtmlPlugin from "./plugins/vite-plugin-move-html";
import thymeleafMinify from "./plugins/vite-plugin-thymeleaf-minify";

const lightningcssBrowserTargets = browserslistToTargets(browserslist(pkg.browserslist));

export default defineConfig({
  base: "/themes/howiehz-higan/",
  plugins: [
    utwm(), // obfuscate tailwindcss class
    thymeleafMinify({
      base: "/themes/howiehz-higan/",
    }),
    moveHtmlPlugin({ dest: "templates", flatten: 2 }),
  ],
  esbuild: {
    legalComments: "none", // 移除所有法律注释 https://esbuild.github.io/api/#legal-comments
  },
  css: {
    transformer: "lightningcss",
    lightningcss: {
      // https://cn.vitejs.dev/guide/features#lightning-css
      targets: lightningcssBrowserTargets,
    },
  },
  build: {
    outDir: fileURLToPath(new URL("./templates/", import.meta.url)),
    assetsDir: "assets/dist/",
    emptyOutDir: false,
    modulePreload: {
      // https://cn.vite.dev/config/build-options#build-modulepreload
      // 开启这个后会注入此 polyfill https://github.com/vitejs/vite/blob/main/packages/vite/src/node/plugins/modulePreloadPolyfill.ts
      // polyfill 是为不支持 link[rel="modulepreload"] 的旧浏览器加的。
      // 只需要在通用模板 fragments/layout.html 注入一次即可。
      polyfill: true,
    },
    cssMinify: "lightningcss",
    rollupOptions: {
      input: {
        "fragments-layout": path.resolve(__dirname, "src/templates/fragments/layout.html"),
      },
      output: rollupOutput,
    },
  },
});
