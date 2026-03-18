import path from "node:path";
import { fileURLToPath } from "node:url";
import { constants } from "node:zlib";

import tailwindcss from "@tailwindcss/vite";
import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";
import utwm from "unplugin-tailwindcss-mangle/vite";
import { defineConfig, type UserConfig } from "vite";
import { compression, defineAlgorithm } from "vite-plugin-compression2";
import { sri } from "vite-plugin-sri3";

import pkg from "./package.json";
import removeEmptyCssComments from "./plugins/vite-plugin-remove-empty-css-comments";
import thymeleafMinify from "./plugins/vite-plugin-thymeleaf-minify";

export default defineConfig((): UserConfig => {
  const isWatchMode = ["--watch", "-w"].some((arg) => process.argv.includes(arg));

  const plugins = [
    // Tailwind CSS with Vite integration
    tailwindcss(),
    // Unplugin Tailwind CSS Mangle to obfuscate Tailwind CSS class names
    utwm(),
    // remove /* empty css */ comments from generated JS files
    // https://github.com/vitejs/vite/issues/1794#issuecomment-769819851
    removeEmptyCssComments(),
    // Minify HTML while preserving Thymeleaf syntax
    thymeleafMinify({
      base: "/themes/howiehz-higan/",
    }),
    // Generate Subresource Integrity (SRI) hashes for all output files
    sri(),
  ];

  if (!isWatchMode) {
    plugins.push(
      // Precompress output files using gzip, brotli, and zstandard algorithms
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
              [constants.ZSTD_c_compressionLevel]: 19,
            },
          }),
        ],
        include: [
          /\.(atom|rss|xml|xhtml|js|mjs|ts|html|json|css|eot|otf|ttf|svg|ico|bmp|dib|txt|text|log|md|conf|ini|cfg)$/,
        ],
        // Root *.html, error/**/*.html and */ components/**/*.html are template files and should not be compressed
        exclude: [/^[^/]*\.html$/, /^error\/.*\.html$/, /^components\/.*\.html$/],
      }),
    );
  }

  return {
    root: path.resolve(__dirname, "src/templates/"),
    base: "/themes/howiehz-higan/",
    plugins,
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
      emptyOutDir: true,
      modulePreload: {
        // https://vite.dev/config/build-options#build-modulepreload
        // Only manually injected in src/templates/components/base-layout/template.html
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
          "components-category-tree": path.resolve(__dirname, "src/templates/components/category-tree/template.html"),
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
          "components-mermaid-injection": path.resolve(
            __dirname,
            "src/templates/components/mermaid-injection/template.html",
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
          "components-text-size-small": path.resolve(
            __dirname,
            "src/templates/components/text-size-small/template.html",
          ),
          "components-text-size-normal": path.resolve(
            __dirname,
            "src/templates/components/text-size-normal/template.html",
          ),
          "components-text-size-large": path.resolve(
            __dirname,
            "src/templates/components/text-size-large/template.html",
          ),
          "components-theme-dark": path.resolve(__dirname, "src/templates/components/theme-dark/template.html"),
          "components-theme-light": path.resolve(__dirname, "src/templates/components/theme-light/template.html"),
          "components-theme-dark-blue": path.resolve(
            __dirname,
            "src/templates/components/theme-dark-blue/template.html",
          ),
          "components-theme-light-blue": path.resolve(
            __dirname,
            "src/templates/components/theme-light-blue/template.html",
          ),
          "components-theme-gray": path.resolve(__dirname, "src/templates/components/theme-gray/template.html"),
          "components-theme-auto": path.resolve(__dirname, "src/templates/components/theme-auto/template.html"),
          "components-theme-auto-blue": path.resolve(
            __dirname,
            "src/templates/components/theme-auto-blue/template.html",
          ),
          "components-common": path.resolve(__dirname, "src/templates/components/common/template.html"),
          "components-base-layout": path.resolve(__dirname, "src/templates/components/base-layout/template.html"),
          "components-footer-nav-page-like-post-style": path.resolve(
            __dirname,
            "src/templates/components/footer-nav-page-like-post-style/template.html",
          ),
          "components-nav-page-like-post-style": path.resolve(
            __dirname,
            "src/templates/components/nav-page-like-post-style/template.html",
          ),
          "components-footer-nav-post": path.resolve(
            __dirname,
            "src/templates/components/footer-nav-post/template.html",
          ),
          "components-nav-post": path.resolve(__dirname, "src/templates/components/nav-post/template.html"),
        },
        output: {
          assetFileNames: () => {
            return `assets/[hash:7][extname]`;
          },
          // JS entry files
          // https://cn.rollupjs.org/configuration-options/#output-chunkfilenames
          entryFileNames: `assets/${pkg.version}[hash:7].js`,
          // Dynamic chunks
          // https://cn.rollupjs.org/configuration-options/#output-chunkfilenames
          chunkFileNames: `assets/${pkg.version}[hash:7].js`,
        },
      },
    },
  };
});
