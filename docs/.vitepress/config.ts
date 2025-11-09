import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'Halo higan-hz 主题文档',
  titleTemplate: ':title - higan-hz 主题文档',
  description: 'Halo higan-hz 主题文档与指南，涵盖特色功能、配置说明、插件支持及示例演示。',
  lastUpdated: true,
  cleanUrls: true,
  themeConfig: {
    nav: [
      {
        text: '指南',
        items: [
          { text: '简介', link: '/guide/introduction/' },
          { text: '快速开始', link: '/guide/getting-started/' },
          {
            text: '核心要素',
            items: [
              { text: '站点配置', link: '/guide/essentials/site-configuration' },
              { text: '内容写作', link: '/guide/essentials/content-authoring' },
              { text: '多语言实践', link: '/guide/essentials/multi-language' }
            ]
          },
          { text: '进阶功能', link: '/guide/advanced/' }
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
          text: '简介',
          items: [{ text: '主题概览', link: '/guide/introduction/' }]
        },
        {
          text: '快速开始',
          items: [{ text: '安装与升级', link: '/guide/getting-started/' }]
        },
        {
          text: '核心要素',
          items: [
            { text: '站点配置基础', link: '/guide/essentials/site-configuration' },
            { text: '内容写作与增强', link: '/guide/essentials/content-authoring' },
            { text: '多语言实践', link: '/guide/essentials/multi-language' }
          ]
        },
        {
          text: '进阶',
          items: [{ text: '性能、安全与插件', link: '/guide/advanced/' }]
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
      message: '基于 MIT 许可发布',
      copyright: '版权所有 © 2024-至今 HowieHz'
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
