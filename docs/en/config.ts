import { defineConfig, type DefaultTheme } from "vitepress";

import pkg from "../../package.json";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Higan Haozi",
  // 首页只显示 title，其他页面才用模板
  titleTemplate: ":title | Higan Haozi",
  description:
    "Higan Haozi is a responsive, clean, and refreshing personal website theme for Halo CMS. This is the Higan Haozi documentation site, covering key features, configuration instructions, plugin compatibility, and example demonstrations.",

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: { src: "/ico.ico", width: 24, height: 24 },
    nav: nav(),
    sidebar: sidebar(),

    socialLinks: [{ icon: "github", link: "https://github.com/HowieHz/halo-theme-higan-hz" }],

    docFooter: {
      prev: "Previous Page",
      next: "Next Page",
    },

    footer: {
      message: "Released under MIT License",
      copyright: "Copyright © 2024-present HowieHz",
    },

    editLink: {
      pattern: "https://github.com/HowieHz/halo-theme-higan-hz/edit/main/docs/:path",
      text: "Edit this page on GitHub",
    },

    outline: {
      label: "On this page",
    },

    lastUpdated: {
      text: "Last updated",
    },

    notFound: {
      title: "Page Not Found",
      quote: "But if you don't change direction, and you keep going, you may end up where you were heading.",
      linkLabel: "Go to Home",
      linkText: "Take me home",
    },

    langMenuLabel: "Languages",
    returnToTopLabel: "Return to top",
    sidebarMenuLabel: "Menu",
    darkModeSwitchLabel: "Theme",
    lightModeSwitchTitle: "Switch to light mode",
    darkModeSwitchTitle: "Switch to dark mode",
    skipToContentLabel: "Skip to content",
  },
});

function nav(): DefaultTheme.NavItem[] {
  return [
    {
      text: "Guide",
      items: [
        {
          text: "Introduction",
          items: [
            { text: "What is Higan Haozi?", link: "/en/guide/what-is-higan-haozi" },
            { text: "Getting Started", link: "/en/guide/getting-started" },
          ],
        },
        {
          text: "Writing",
          items: [{ text: "Style Reference", link: "/en/guide/style-reference" }],
        },
        {
          text: "Configuration & Extensions",
          items: [
            { text: "Installation & Upgrade", link: "/en/guide/getting-started/" },
            { text: "Theme Configuration", link: "/en/guide/theme-configuration" },
            { text: "Metadata Configuration", link: "/en/guide/metadata-configuration" },
            { text: "Plugin Compatibility", link: "/en/guide/plugin-compatibility" },
          ],
        },
      ],
    },
    {
      text: "Tutorials",
      items: [
        { text: "Internationalization", link: "/en/tutorial/i18n" },
        { text: "Performance Optimization", link: "/en/tutorial/performance" },
        { text: "Security Practices", link: "/en/tutorial/security" },
        { text: "Custom Theme", link: "/en/tutorial/custom-theme" },
      ],
    },
    {
      text: "Reference",
      items: [
        { text: "FAQ", link: "/en/reference/faq" },
        { text: "Performance Reference", link: "/en/reference/performance" },
        { text: "Browser Compatibility", link: "/en/reference/browser-compatibility" },
        { text: "Template Map", link: "/en/reference/template-map" },
      ],
    },
    { text: "Demo Site", link: "https://howiehz.top/?lang=en" },
    {
      text: pkg.version,
      items: [
        {
          text: `Release Notes v${pkg.version}`,
          link: `https://github.com/HowieHz/halo-theme-higan-hz/releases/tag/v${pkg.version}`,
        },
        { text: `Changelog`, link: "https://github.com/HowieHz/halo-theme-higan-hz/blob/main/CHANGELOG.md" },
        { text: "Contributing", link: "https://github.com/HowieHz/halo-theme-higan-hz/blob/main/CONTRIBUTING.md" },
      ],
    },
  ];
}

function sidebar(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: "Introduction",
      items: [
        { text: "What is Higan Haozi?", link: "/en/guide/what-is-higan-haozi" },
        { text: "Getting Started", link: "/en/guide/getting-started" },
      ],
    },
    {
      text: "Writing",
      items: [{ text: "Style Reference", link: "/en/guide/style-reference" }],
    },
    {
      text: "Configuration & Extensions",
      items: [
        { text: "Installation & Upgrade", link: "/en/guide/installation-and-upgrade" },
        { text: "Theme Configuration", link: "/en/guide/theme-configuration" },
        { text: "Metadata Configuration", link: "/en/guide/metadata-configuration" },
        { text: "Plugin Compatibility", link: "/en/guide/plugin-compatibility" },
      ],
    },
    {
      text: "Tutorials",
      items: [
        { text: "Internationalization", link: "/en/tutorial/i18n" },
        { text: "Performance Optimization", link: "/en/tutorial/performance" },
        { text: "Security Practices", link: "/en/tutorial/security" },
        { text: "Custom Theme", link: "/en/tutorial/custom-theme" },
      ],
    },
    {
      text: "Reference",
      items: [
        { text: "FAQ", link: "/en/reference/faq" },
        { text: "Performance Reference", link: "/en/reference/performance" },
        { text: "Browser Compatibility", link: "/en/reference/browser-compatibility" },
        { text: "Template Map", link: "/en/reference/template-map" },
      ],
    },
  ];
}
