import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'Halo higan-hz 主题文档',
  description: 'Halo higan-hz 主题文档与指南，涵盖特色功能、配置说明、插件支持及示例演示。',
  lastUpdated: true,
  cleanUrls: true,
  themeConfig: {
    nav: [
      {
        text: '指南',
        items: [
          { text: '主题概览', link: '/guide/overview' },
          { text: '快速开始', link: '/guide/getting-started' },
          { text: '配置总览', link: '/guide/configuration-overview' },
          { text: 'i18n 支持指南', link: '/guide/i18n' },
          { text: '内容增强', link: '/guide/content-components' },
          { text: '进阶功能', link: '/guide/advanced' }
        ]
      },
      {
        text: '参考',
        items: [
          { text: '模板映射', link: '/reference/template-map' },
          { text: '常见问题', link: '/reference/faq' },
          { text: '与上游主题的差异', link: '/reference/upstream-diff' }
        ]
      },
      { text: 'GitHub', link: 'https://github.com/HowieHz/halo-theme-higan-hz' }
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '主题概览', link: '/guide/overview' },
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '配置总览', link: '/guide/configuration-overview' },
            { text: 'i18n 支持指南', link: '/guide/i18n' },
            { text: '内容增强与多语言', link: '/guide/content-components' },
            { text: '进阶功能', link: '/guide/advanced' }
          ]
        }
      ],
      '/reference/': [
        {
          text: '参考',
          items: [
            { text: '模板映射与页面路径', link: '/reference/template-map' },
            { text: '常见问题', link: '/reference/faq' },
            { text: '与上游主题的差异', link: '/reference/upstream-diff' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/HowieHz/halo-theme-higan-hz' }
    ],
    footer: {
      message: 'MIT Licensed',
      copyright: 'Copyright © 2024-2025 HowieHz'
    },
    editLink: {
      pattern: 'https://github.com/HowieHz/halo-theme-higan-hz/edit/new-docs/docs/:path',
      text: '在 GitHub 上编辑此页面'
    },
    outline: {
      label: '本页大纲'
    }
  }
})
