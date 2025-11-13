import fs from "fs";
import path from "path";
import { whyframe } from "@whyframe/core";
import { whyframeVue } from "@whyframe/vue";
import { defineConfig } from "vitepress";
import { chineseSearchOptimize, pagefindPlugin } from "vitepress-plugin-pagefind";

import pkg from "../../package.json";
import { docsCssPlugin } from "../../plugins/vite-plugin-docs-css";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: {
    plugins: [
      // Initialize whyframe core plugin
      whyframe({
        defaultSrc: "/halo-theme-higan-hz/frames/default", // provide our own html
      }),

      // Initialize whyframe Vue integration plugin
      whyframeVue({
        include: /\.(?:vue|md)$/, // also scan in markdown files
      }),

      docsCssPlugin(),

      // 开发模式 CSS 服务
      {
        name: "dev-post-css",
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url === "/__vite_post_css__") {
              const cssPath = path.resolve(__dirname, "../../tmp/docs/styles");
              fs.readdir(cssPath, (err, files) => {
                if (err) {
                  next();
                  return;
                }
                const cssFile = files.find((f) => f.startsWith("post-") && f.endsWith(".css"));
                if (cssFile) {
                  const content = fs.readFileSync(path.join(cssPath, cssFile), "utf-8");
                  res.setHeader("Content-Type", "text/css");
                  res.end(content);
                } else {
                  next();
                }
              });
            } else {
              next();
            }
          });
        },
      },

      pagefindPlugin({
        customSearchQuery: chineseSearchOptimize,
        locales: {
          root: {
            btnPlaceholder: "搜索",
            placeholder: "搜索文档",
            emptyText: "空空如也",
            heading: "共 {{searchResult}} 条结果",
            toSelect: "选择",
            toNavigate: "切换",
            toClose: "关闭",
            searchBy: "搜索提供者",
          },
          en: {
            btnPlaceholder: "Search",
            placeholder: "Search Docs...",
            emptyText: "No results",
            heading: "Total {{searchResult}} results",
          },
        },
      }),
    ],
  },

  title: "Higan Haozi",
  // 首页只显示 title，其他页面才用模板
  titleTemplate: ":title | Higan Haozi",
  description:
    "Higan Haozi 是一款响应式、简洁清爽的个人网站 Halo CMS 主题。此处是 Higan Haozi 文档站，包括特色功能、配置说明、插件支持及示例演示。",

  lastUpdated: true,
  cleanUrls: true,

  base: "/halo-theme-higan-hz/",

  head: [
    ["link", { rel: "icon", type: "image/x-icon", href: "/halo-theme-higan-hz/ico.ico" }],
    ["meta", { name: "theme-color", content: "#5f67ee" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:site_name", content: "Higan Haozi" }],
    [
      "meta",
      {
        property: "og:image",
        content: "https://howiehz.top/halo-theme-higan-hz/ico.ico",
      },
    ],
    ["meta", { property: "og:url", content: "https://howiehz.top/halo-theme-higan-hz/" }],
    // <script defer src="https://umami.howiehz.top/script.js" data-website-id="7b461ac5-155d-45a8-a118-178d0a2936e4" data-domains="howiehz.top"></script>
    [
      "script",
      {
        defer: "",
        src: "https://umami.howiehz.top/script.js",
        "data-website-id": "7b461ac5-155d-45a8-a118-178d0a2936e4",
        "data-domains": "howiehz.top",
      },
    ],
  ],
  locales: {
    root: {
      label: "简体中文",
      lang: "zh-Hans",
      dir: "ltr",
    },
    en: {
      label: "English",
      lang: "en-US",
      dir: "ltr",
    },
  },

  sitemap: {
    hostname: "https://howiehz.top/halo-theme-higan-hz/",
    xmlns: {
      // trim the xml namespace
      news: true, // flip to false to omit the xml namespace for news
      xhtml: true,
      image: true,
      video: true,
      custom: [
        'xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"',
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
      ],
    },
    transformItems(items) {
      return items.filter((item) => !item.url.includes("frames/default"));
    },
  },

  markdown: {
    container: {
      tipLabel: "提示",
      warningLabel: "警告",
      dangerLabel: "危险",
      infoLabel: "信息",
      detailsLabel: "详细信息",
    },
    image: {
      lazyLoading: true,
    },
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: { src: "/ico.ico", width: 24, height: 24 },
    nav: [
      {
        text: "指南",
        items: [
          {
            text: "简介",
            items: [
              { text: "Higan Haozi 是什么？", link: "/guide/what-is-higan-haozi" },
              { text: "快速开始", link: "/guide/getting-started" },
            ],
          },
          {
            text: "写作",
            items: [{ text: "组件样式扩展", link: "/guide/content-extensions" }],
          },
          {
            text: "配置与扩展",
            items: [
              { text: "安装与升级", link: "/guide/getting-started/" },
              { text: "主题配置项", link: "/guide/theme-configuration" },
              { text: "元数据配置项", link: "/guide/metadata-configuration" },
              { text: "插件兼容性", link: "/guide/plugin-compatibility" },
            ],
          },
        ],
      },
      {
        text: "教程",
        items: [
          { text: "多语言支持", link: "/tutorial/i18n" },
          { text: "性能优化", link: "/tutorial/performance" },
          { text: "安全实践", link: "/tutorial/security" },
        ],
      },
      {
        text: "参考",
        items: [
          { text: "常见问题", link: "/reference/faq" },
          { text: "模板文件与访问路径映射", link: "/reference/template-map" },
          { text: "与上游主题的差异", link: "/reference/upstream-diff" },
        ],
      },
      { text: "示例站点", link: "https://howiehz.top" },
      {
        text: pkg.version,
        items: [
          {
            text: `发布说明 v${pkg.version}`,
            link: `https://github.com/HowieHz/halo-theme-higan-hz/releases/tag/v${pkg.version}`,
          },
          { text: `更新日志`, link: "https://github.com/HowieHz/halo-theme-higan-hz/blob/main/CHANGELOG.md" },
          { text: "贡献指南", link: "https://github.com/HowieHz/halo-theme-higan-hz/blob/main/CONTRIBUTING.md" },
        ],
      },
    ],

    sidebar: [
      {
        text: "简介",
        items: [
          { text: "Higan Haozi 是什么？", link: "/guide/what-is-higan-haozi" },
          { text: "快速开始", link: "/guide/getting-started" },
        ],
      },
      {
        text: "写作",
        items: [{ text: "组件样式扩展", link: "/guide/content-extensions" }],
      },
      {
        text: "配置与扩展",
        items: [
          { text: "安装与升级", link: "/guide/installation-and-upgrade" },
          { text: "主题配置项", link: "/guide/theme-configuration" },
          { text: "元数据配置项", link: "/guide/metadata-configuration" },
          { text: "插件兼容性", link: "/guide/plugin-compatibility" },
        ],
      },
      {
        text: "教程",
        items: [
          { text: "多语言支持", link: "/tutorial/i18n" },
          { text: "性能优化", link: "/tutorial/performance" },
          { text: "安全防护", link: "/tutorial/security" },
        ],
      },
      {
        text: "参考",
        items: [
          { text: "常见问题", link: "/reference/faq" },
          { text: "模板文件与访问路径映射", link: "/reference/template-map" },
          { text: "与上游主题的差异", link: "/reference/upstream-diff" },
        ],
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/HowieHz/halo-theme-higan-hz" }],

    docFooter: {
      prev: "上一页",
      next: "下一页",
    },

    footer: {
      message: "基于 MIT 许可发布",
      copyright: "版权所有 © 2024-至今 HowieHz",
    },

    editLink: {
      pattern: "https://github.com/HowieHz/halo-theme-higan-hz/edit/main/docs/:path",
      text: "在 GitHub 上编辑此页面",
    },

    outline: {
      label: "本页大纲",
    },

    lastUpdated: {
      text: "最后更新于",
    },

    notFound: {
      title: "页面未找到",
      quote: "但如果你不改变方向，并且继续寻找，你可能最终会到达你所前往的地方。",
      linkLabel: "前往首页",
      linkText: "带我回首页",
    },

    langMenuLabel: "多语言",
    returnToTopLabel: "回到顶部",
    sidebarMenuLabel: "菜单",
    darkModeSwitchLabel: "主题",
    lightModeSwitchTitle: "切换到浅色模式",
    darkModeSwitchTitle: "切换到深色模式",
    skipToContentLabel: "跳转到内容",
  },
});
