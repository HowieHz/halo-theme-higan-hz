import { resolve } from "node:path";
import { constants } from "node:zlib";

import tailwindcss from "@tailwindcss/vite";
import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";
import utwm from "unplugin-tailwindcss-mangle/vite";
import { defineConfig, type UserConfig } from "vite";
import { compression, defineAlgorithm } from "vite-plugin-compression2";
import { sri } from "vite-plugin-sri3";

import pkg from "./package.json" with { type: "json" };
import removeEmptyCssComments from "./plugins/vite-plugin-remove-empty-css-comments.ts";
import thymeleafMinify from "./plugins/vite-plugin-thymeleaf-minify.ts";

const BUILD_PROFILES = ["default", "tiny"] as const;
type BuildProfile = (typeof BUILD_PROFILES)[number];
const BUILD_PRECOMPRESS_PROFILES = ["br-only", "full", "none"] as const;
type BuildPrecompressProfile = (typeof BUILD_PRECOMPRESS_PROFILES)[number];

function pickEnvValue<T extends string>(value: string | undefined, allowedValues: readonly T[], fallback: T): T {
  return allowedValues.includes(value as T) ? (value as T) : fallback;
}

export default defineConfig((): UserConfig => {
  const buildProfile = pickEnvValue<BuildProfile>(process.env.BUILD_PROFILE, BUILD_PROFILES, "default");
  const precompressProfile = pickEnvValue<BuildPrecompressProfile>(
    process.env.BUILD_PRECOMPRESS_PROFILE,
    BUILD_PRECOMPRESS_PROFILES,
    "br-only",
  );

  const precompressAlgorithms =
    precompressProfile === "none"
      ? []
      : [
          defineAlgorithm("brotliCompress", {
            params: {
              [constants.BROTLI_PARAM_QUALITY]: 11,
            },
          }),
          ...(precompressProfile === "full"
            ? [
                defineAlgorithm("gzip", { level: 9 }),
                defineAlgorithm("zstandard", {
                  params: {
                    [constants.ZSTD_c_compressionLevel]: 19,
                  },
                }),
              ]
            : []),
        ];
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

  if (precompressAlgorithms.length > 0) {
    plugins.push(
      // precompress assets using specified algorithms for optimal delivery
      compression({
        algorithms: precompressAlgorithms,
        include: [
          /\.(atom|rss|xml|xhtml|js|mjs|ts|json|css|eot|otf|ttf|svg|ico|bmp|dib|txt|text|log|md|conf|ini|cfg)$/,
        ],
        // Root *.html, error/**/*.html and */ components/**/*.html are template files and should not be compressed
        // exclude: [/^[^/]*\.html$/, /^error\/.*\.html$/, /^components\/.*\.html$/],
      }),
    );
  }

  return {
    root: resolve(import.meta.dirname, "src/templates/"),
    base: "/themes/howiehz-higan/",
    resolve: {
      alias: {
        "@higan-font-styles": resolve(
          import.meta.dirname,
          buildProfile === "tiny"
            ? "src/templates/components/fonts/styles.tiny.css"
            : "src/templates/components/fonts/styles.css",
        ),
      },
    },
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
      outDir: resolve(import.meta.dirname, "templates"),
      emptyOutDir: true,
      modulePreload: {
        // https://vite.dev/config/build-options#build-modulepreload
        // Only manually injected in src/templates/components/base-layout/template.html
        polyfill: false,
      },
      cssMinify: "lightningcss",
      rolldownOptions: {
        input: {
          // pages
          archives: resolve(import.meta.dirname, "src/templates/archives.html"),
          author: resolve(import.meta.dirname, "src/templates/author.html"),
          categories: resolve(import.meta.dirname, "src/templates/categories.html"),
          category: resolve(import.meta.dirname, "src/templates/category.html"),
          index: resolve(import.meta.dirname, "src/templates/index.html"),
          links: resolve(import.meta.dirname, "src/templates/links.html"),
          moment: resolve(import.meta.dirname, "src/templates/moment.html"),
          moments: resolve(import.meta.dirname, "src/templates/moments.html"),
          page: resolve(import.meta.dirname, "src/templates/page.html"),
          "page-like-post-style": resolve(import.meta.dirname, "src/templates/page-like-post-style.html"),
          photos: resolve(import.meta.dirname, "src/templates/photos.html"),
          post: resolve(import.meta.dirname, "src/templates/post.html"),
          tag: resolve(import.meta.dirname, "src/templates/tag.html"),
          tags: resolve(import.meta.dirname, "src/templates/tags.html"),
          friends: resolve(import.meta.dirname, "src/templates/friends.html"),
          error: resolve(import.meta.dirname, "src/templates/error/error.html"),
          // components
          "components-category-tree": resolve(
            import.meta.dirname,
            "src/templates/components/category-tree/template.html",
          ),
          "components-moment-video-modal": resolve(
            import.meta.dirname,
            "src/templates/components/moment-video-modal/template.html",
          ),
          "components-pagination": resolve(import.meta.dirname, "src/templates/components/pagination/template.html"),
          "components-list-post-simple": resolve(
            import.meta.dirname,
            "src/templates/components/list-post-simple/template.html",
          ),
          "components-list-post-summary": resolve(
            import.meta.dirname,
            "src/templates/components/list-post-summary/template.html",
          ),
          "components-list-friends-summary": resolve(
            import.meta.dirname,
            "src/templates/components/list-friends-summary/template.html",
          ),
          "components-list-moment-summary": resolve(
            import.meta.dirname,
            "src/templates/components/list-moment-summary/template.html",
          ),
          "components-mermaid-injection": resolve(
            import.meta.dirname,
            "src/templates/components/mermaid-injection/template.html",
          ),
          "components-instantpage-injection": resolve(
            import.meta.dirname,
            "src/templates/components/instantpage-injection/template.html",
          ),
          "components-custom-font-face-style": resolve(
            import.meta.dirname,
            "src/templates/components/custom-font-face-style/template.html",
          ),
          "components-custom-color-schema-style": resolve(
            import.meta.dirname,
            "src/templates/components/custom-color-schema-style/template.html",
          ),
          "components-custom-color-schema-config": resolve(
            import.meta.dirname,
            "src/templates/components/custom-color-schema-config/template.html",
          ),
          "components-custom-cursor-style": resolve(
            import.meta.dirname,
            "src/templates/components/custom-cursor-style/template.html",
          ),
          "components-header-logo-style": resolve(
            import.meta.dirname,
            "src/templates/components/header-logo-style/template.html",
          ),
          "components-header": resolve(import.meta.dirname, "src/templates/components/header/template.html"),
          "components-halo-comment-widget": resolve(
            import.meta.dirname,
            "src/templates/components/halo-comment-widget/template.html",
          ),
          "components-color-scheme-light": resolve(
            import.meta.dirname,
            "src/templates/components/color-scheme-light/template.html",
          ),
          "components-color-scheme-dark": resolve(
            import.meta.dirname,
            "src/templates/components/color-scheme-dark/template.html",
          ),
          "components-color-scheme-auto": resolve(
            import.meta.dirname,
            "src/templates/components/color-scheme-auto/template.html",
          ),
          "components-style-footer-sidebar": resolve(
            import.meta.dirname,
            "src/templates/components/style-footer-sidebar/template.html",
          ),
          "components-text-size-small": resolve(
            import.meta.dirname,
            "src/templates/components/text-size-small/template.html",
          ),
          "components-text-size-normal": resolve(
            import.meta.dirname,
            "src/templates/components/text-size-normal/template.html",
          ),
          "components-text-size-large": resolve(
            import.meta.dirname,
            "src/templates/components/text-size-large/template.html",
          ),
          "components-toc-max-width-style": resolve(
            import.meta.dirname,
            "src/templates/components/toc-max-width-style/template.html",
          ),
          "components-inline-code-style": resolve(
            import.meta.dirname,
            "src/templates/components/inline-code-style/template.html",
          ),
          "components-dark-content-text-style": resolve(
            import.meta.dirname,
            "src/templates/components/dark-content-text-style/template.html",
          ),
          "components-upvote-runtime": resolve(
            import.meta.dirname,
            "src/templates/components/upvote-runtime/template.html",
          ),
          "components-paragraph-first-line-indent-style": resolve(
            import.meta.dirname,
            "src/templates/components/paragraph-first-line-indent-style/template.html",
          ),
          "components-performance-monitor": resolve(
            import.meta.dirname,
            "src/templates/components/performance-monitor/template.html",
          ),
          "components-quote-fetcher": resolve(
            import.meta.dirname,
            "src/templates/components/quote-fetcher/template.html",
          ),
          "components-layout-max-width-style": resolve(
            import.meta.dirname,
            "src/templates/components/layout-max-width-style/template.html",
          ),
          "components-layout-min-width-style": resolve(
            import.meta.dirname,
            "src/templates/components/layout-min-width-style/template.html",
          ),
          "components-layout-content-width-style": resolve(
            import.meta.dirname,
            "src/templates/components/layout-content-width-style/template.html",
          ),
          "components-layout-table-bottom-border-style": resolve(
            import.meta.dirname,
            "src/templates/components/layout-table-bottom-border-style/template.html",
          ),
          "components-layout-heading-paragraph-margin-style": resolve(
            import.meta.dirname,
            "src/templates/components/layout-heading-paragraph-margin-style/template.html",
          ),
          "components-heading-anchor-symbol-style": resolve(
            import.meta.dirname,
            "src/templates/components/heading-anchor-symbol-style/template.html",
          ),
          "components-heading-anchor-svg": resolve(
            import.meta.dirname,
            "src/templates/components/heading-anchor-svg/template.html",
          ),
          "components-meta-theme-color": resolve(
            import.meta.dirname,
            "src/templates/components/meta-theme-color/template.html",
          ),
          "components-theme-dark": resolve(import.meta.dirname, "src/templates/components/theme-dark/template.html"),
          "components-theme-light": resolve(import.meta.dirname, "src/templates/components/theme-light/template.html"),
          "components-theme-dark-blue": resolve(
            import.meta.dirname,
            "src/templates/components/theme-dark-blue/template.html",
          ),
          "components-theme-light-blue": resolve(
            import.meta.dirname,
            "src/templates/components/theme-light-blue/template.html",
          ),
          "components-theme-gray": resolve(import.meta.dirname, "src/templates/components/theme-gray/template.html"),
          "components-theme-auto": resolve(import.meta.dirname, "src/templates/components/theme-auto/template.html"),
          "components-theme-auto-blue": resolve(
            import.meta.dirname,
            "src/templates/components/theme-auto-blue/template.html",
          ),
          "components-common": resolve(import.meta.dirname, "src/templates/components/common/template.html"),
          "components-share": resolve(import.meta.dirname, "src/templates/components/share/template.html"),
          "components-base-layout": resolve(import.meta.dirname, "src/templates/components/base-layout/template.html"),
          "components-footer-sidebar": resolve(
            import.meta.dirname,
            "src/templates/components/footer-sidebar/template.html",
          ),
          "components-footer-bottom-content": resolve(
            import.meta.dirname,
            "src/templates/components/footer-bottom-content/template.html",
          ),
          "components-footer-nav-page-like-post-style": resolve(
            import.meta.dirname,
            "src/templates/components/footer-nav-page-like-post-style/template.html",
          ),
          "components-nav-page-like-post-style": resolve(
            import.meta.dirname,
            "src/templates/components/nav-page-like-post-style/template.html",
          ),
          "components-footer-nav-post": resolve(
            import.meta.dirname,
            "src/templates/components/footer-nav-post/template.html",
          ),
          "components-nav-post": resolve(import.meta.dirname, "src/templates/components/nav-post/template.html"),
          ...(buildProfile === "tiny"
            ? {
                "components-mermaid-injection": resolve(
                  import.meta.dirname,
                  "src/templates/components/mermaid-injection/template.tiny.html",
                ),
                "components-instantpage-injection": resolve(
                  import.meta.dirname,
                  "src/templates/components/instantpage-injection/template.tiny.html",
                ),
              }
            : {}),
        },
        output: {
          assetFileNames: () => {
            return `assets/${pkg.version}[hash:7][extname]`;
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
