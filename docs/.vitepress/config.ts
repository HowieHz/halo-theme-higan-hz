import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Halo Higan Haozi 主题文档",
  titleTemplate: ":title - Higan Haozi 主题文档",
  description: "Halo Higan Haozi 主题文档与指南，涵盖特色功能、配置说明、插件支持及示例演示。",

  lastUpdated: true,
  cleanUrls: true,

  head: [
    ["link", { rel: "icon", type: "image/x-icon", href: "/ico.ico" }],
    ["meta", { name: "theme-color", content: "#5f67ee" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:site_name", content: "Higan Haozi" }],
    [
      "meta",
      {
        property: "og:image",
        content: "https://higan-haozi.docs.howiehz.top/ico.ico",
      },
    ],
    ["meta", { property: "og:url", content: "https://higan-haozi.docs.howiehz.top" }],
    // <script defer src="https://umami.howiehz.top/script.js" data-website-id="d717a747-91d2-4be4-a5e7-5cc32ff14f4a" data-domains="howiehz.top"></script>
    [
      "script",
      {
        defer: "",
        src: "https://umami.howiehz.top/script.js",
        "data-website-id": "d717a747-91d2-4be4-a5e7-5cc32ff14f4a",
        "data-domains": "higan-haozi.docs.howiehz.top",
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
    hostname: "https://higan-haozi.docs.howiehz.top",
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "快速开始", link: "/guide/getting-started/" },
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
    ],

    docFooter: {
      prev: "上一页",
      next: "下一页",
    },

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
    footer: {
      message: "基于 MIT 许可发布",
      copyright: "版权所有 © 2024-至今 HowieHz",
    },
    editLink: {
      pattern: "https://github.com/HowieHz/halo-theme-higan-hz/edit/new-docs/docs/:path",
      text: "在 GitHub 上编辑此页面",
    },
    outline: {
      label: "本页大纲",
    },
  },
});
