import { whyframe } from "@whyframe/core";
import { whyframeVue } from "@whyframe/vue";
import * as cheerio from "cheerio";
import { defineConfig, type DefaultTheme } from "vitepress";
import { chineseSearchOptimize, pagefindPlugin } from "vitepress-plugin-pagefind";

import pkg from "../../package.json";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: {
    plugins: [
      // Initialize whyframe core plugin
      whyframe({
        components: [{ name: "DefaultRender" }],
        defaultSrc: "/halo-theme-higan-haozi/frames/default", // provide our own html
      }),

      // Initialize whyframe Vue integration plugin
      whyframeVue({
        include: /\.(?:vue|md)$/, // also scan in markdown files
      }),

      // Pagefind search plugin
      pagefindPlugin({
        customSearchQuery: chineseSearchOptimize,
        showDate: (date: number, lang: string) => {
          const now = Date.now();
          const diff = date - now; // 正值表示未来，负值表示过去
          const sign = Math.sign(diff);
          const absDiff = Math.abs(diff);

          const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });

          // 时间单位及其对应的毫秒数
          if (absDiff < 60000) {
            // 小于 1 分钟
            const timeDiff = sign * Math.floor(absDiff / 1000);
            return rtf.format(timeDiff, "second");
          } else if (absDiff < 3600000) {
            // 小于 1 小时
            const timeDiff = sign * Math.floor(absDiff / 60000);
            return rtf.format(timeDiff, "minute");
          } else if (absDiff < 86400000) {
            // 小于 1 天
            const timeDiff = sign * Math.floor(absDiff / 3600000);
            return rtf.format(timeDiff, "hour");
          } else if (absDiff < 604800000) {
            // 小于 1 周
            const timeDiff = sign * Math.floor(absDiff / 86400000);
            return rtf.format(timeDiff, "day");
          } else if (absDiff < 2592000000) {
            // 小于 30 天
            const timeDiff = sign * Math.floor(absDiff / 604800000);
            return rtf.format(timeDiff, "week");
          } else if (absDiff < 31536000000) {
            // 小于 365 天
            const timeDiff = sign * Math.floor(absDiff / 2592000000);
            return rtf.format(timeDiff, "month");
          } else {
            // 默认按年为单位
            const timeDiff = sign * Math.floor(absDiff / 31536000000);
            return rtf.format(timeDiff, "year");
          }
        },
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
    optimizeDeps: {
      exclude: ["@nolebase/vitepress-plugin-enhanced-readabilities/client", "vitepress", "@nolebase/ui"],
    },
    ssr: {
      noExternal: ["@nolebase/vitepress-plugin-enhanced-readabilities", "@nolebase/ui"],
    },
  },

  async transformHtml(code, id) {
    if (id.includes("frames/") || id.includes("frames\\")) {
      // code 是准备写入硬盘的 HTML 内容，可以在这里进行修改后返回
      // 用 cheerio 解析后删除相应标签
      const $ = cheerio.load(code);
      // script type="module" 不能移除，所以 <link rel="modulepreload"> 标签也不能移除，移除了反而减慢加载速度

      // 移除无用的 meta 标签和 ttile, 控制 HTML 大小
      $('head meta[name="viewport"], head meta[name="generator"], head meta[name="description"], head title').remove();

      // 移除 <link rel="preload"> 标签，避免重复加载默认字体资源
      $('head link[rel="preload"]').remove();
      // 不能移除全部 <link rel="preload stylesheet"> 标签，会导致 iframe 内样式丢失
      // 可以移除，因为 vp-icons.css 用不到
      $('head link[rel="preload stylesheet"][href="/halo-theme-higan-haozi/vp-icons.css"][as="style"]').remove();

      // 移除 script id="check-dark-mode" 和 script id="check-mac-os"
      $("head script#check-dark-mode, head script#check-mac-os").remove();

      // 移除 <script>import("/halo-theme-higan-haozi/pagefind/pagefind.js").then(i=>{window.__pagefind__=i,i.init()}).catch(()=>{});</script>
      $("head script").each((_, elem) => {
        const scriptContent = $(elem).html();
        if (scriptContent && scriptContent.includes('import("/halo-theme-higan-haozi/pagefind/pagefind.js")')) {
          $(elem).remove();
        }
      });

      // 移除多余的空行并返回修改后的 HTML
      return $.html().replace(/^\s*[\r\n]/gm, "");
    }
  },

  async transformPageData(pageData) {
    // 如果不是 frames/ 路径下的页面，则添加 head
    if (!pageData.relativePath.includes("frames/")) {
      pageData.frontmatter.head ??= [];
      pageData.frontmatter.head.push(
        ["link", { rel: "icon", type: "image/x-icon", href: "/halo-theme-higan-haozi/ico.ico" }],
        ["meta", { name: "theme-color", content: "#5f67ee" }],
        ["meta", { property: "og:type", content: "website" }],
        ["meta", { property: "og:site_name", content: "Higan Haozi" }],
        [
          "meta",
          {
            property: "og:image",
            content: "https://howiehz.top/halo-theme-higan-haozi/ico.ico",
          },
        ],
        ["meta", { property: "og:url", content: "https://howiehz.top/halo-theme-higan-haozi/" }],
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
      );
    }
  },

  title: "Higan Haozi",
  // 首页只显示 title，其他页面才用模板
  titleTemplate: ":title | Higan Haozi",
  description:
    "Higan Haozi 是一款响应式、简洁清爽的个人网站 Halo CMS 主题。此处是 Higan Haozi 文档站，包括特色功能、配置说明、插件支持及示例演示。",

  lastUpdated: true,
  cleanUrls: true,
  metaChunk: true,

  base: "/halo-theme-higan-haozi/",
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
    hostname: "https://howiehz.top/halo-theme-higan-haozi/",
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
      return items.filter((item) => !item.url.includes("frames/")); // 排除 frames/ 路径下的页面
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
    nav: nav(),
    sidebar: sidebar(),

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

function nav(): DefaultTheme.NavItem[] {
  return [
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
          items: [{ text: "样式参考", link: "/guide/style-reference" }],
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
        { text: "自定义图标", link: "/tutorial/custom-svg" },
      ],
    },
    {
      text: "参考",
      items: [
        { text: "常见问题", link: "/reference/faq" },
        { text: "性能参考", link: "/reference/performance" },
        { text: "模板文件与访问路径映射", link: "/reference/template-map" },
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
  ];
}

function sidebar(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: "简介",
      items: [
        { text: "Higan Haozi 是什么？", link: "/guide/what-is-higan-haozi" },
        { text: "快速开始", link: "/guide/getting-started" },
      ],
    },
    {
      text: "写作",
      items: [{ text: "样式参考", link: "/guide/style-reference" }],
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
        { text: "自定义图标", link: "/tutorial/custom-svg" },
      ],
    },
    {
      text: "参考",
      items: [
        { text: "常见问题", link: "/reference/faq" },
        { text: "性能参考", link: "/reference/performance" },
        { text: "模板文件与访问路径映射", link: "/reference/template-map" },
      ],
    },
  ];
}
