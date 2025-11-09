---
title: 主题概览
outline: deep
---

# 主题概览

higan-hz 是一款面向 Halo 2.19+ 的简洁美观而强大的主题，延续清爽的设计表达，同时提供高度可调的配置能力、更完善的多语言体验，以及对 Halo 生态插件的全面适配。

> 更激进的修改，更高的配置自由度！

本页汇总项目亮点、兼容性、社区渠道及版本说明，帮助你在深入操作指南前快速建立全局认识。

## 特色功能摘要

- **配置自由度**：可按页面/模块级别启用或关闭功能，固定文案、配色、排版细节均可自定义。
- **性能优化**：移除 jQuery，脚本样式按页面拆分；instant.page 预加载、自定义 CDN、资源懒加载与预读取齐备。
- **多语言体系**：支持语言前缀匹配、浏览器自动跳转、多语言菜单/公告/页脚与元数据语言标识。
- **视觉与交互**：内建浅色/深色/自动模式，支持自定义配色、拉引用、隐藏内容、明暗模式专属区块与轻量过渡动效。
- **插件适配**：原生整合 links/photos/moments/feed/comment-widget/search-widget 等官方插件，额外提供 Mermaid、二维码分享、分享按钮扩展等功能。
- **安全守护**：upgrade-insecure-requests、镜像站防护、可定制的自定义资源域名、CSP 友好。
- **开发体验**：TypeScript 类型定义、复用片段、Stylus+Tailwind 构建链路，方便二次开发。

更多能力会在《[站点配置基础](../essentials/site-configuration.md)》《[内容写作与增强](../essentials/content-authoring.md)》《[多语言实践](../essentials/multi-language.md)》与《[模板映射与页面路径](../../reference/template-map.md)》中逐一展开。

## 兼容性与运行环境

- **Halo 版本**：建议使用 Halo 2.19 及以上稳定版。
- **浏览器**：覆盖 `defaults`、Safari ≥ 16.4、Chrome ≥ 111、Firefox ≥ 128；详细矩阵可在 [browsersl.ist](https://browsersl.ist/#q=defaults%0ASafari+%3E%3D+16.4%0AChrome+%3E%3D+111%0AFirefox+%3E%3D+128) 查询。
- **构建工具（可选）**：Node.js ≥ 18 与 pnpm ≥ 9，用于本地开发/打包。

## 社区与支持渠道

- **GitHub 仓库**：<https://github.com/HowieHz/halo-theme-higan-hz>
- **官方示例与样式演示**：<https://howiehz.top/archives/higan-hz-style-guide>
- **反馈与需求**：欢迎在 GitHub Issues 创建问题或提交 Pull Request。
- **交流社群**：QQ 群 `694413711`（可通过 [加群链接](http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=QCcmLkzDHUT22qP_-MVYSYDwlL_Jf55Y&authKey=KWfge330T3nQAJy96gacr8eyp8u0egY3tNGBFAnNjqdBdMJKQLp9I9efUU9aMiGM&noverify=0&group_code=694413711) 加入）。
- **赞助致谢**：感谢通过赞助支持项目的朋友，详见项目 README 的赞助清单。

如果你喜欢这个主题，欢迎点亮 GitHub Star——这是推动主题持续迭代的最大动力。

## 阅读路线推荐

1. 《[快速开始](../getting-started/)》：安装、升级、构建流程。
2. 《[站点配置基础](../essentials/site-configuration.md)》：后台表单逐项说明。
3. 《[多语言实践](../essentials/multi-language.md)》：多语言菜单、公告、页面语言与元数据配置。
4. 《[内容写作与增强](../essentials/content-authoring.md)》：主题特有组件、明暗模式内容与编辑器写法。
5. 《[进阶功能](../advanced/)》：CDN、防镜像、Mermaid、安全策略、插件集成。
6. 《[模板映射与页面路径](../../reference/template-map.md)》与《[常见问题](../../reference/faq.md)》：定位模板及排障。
7. 《[与上游主题的差异](../../reference/upstream-diff.md)》：了解主题在样式、配置、交互方面的全部改动。

> 当前文档版本会随主题发布迭代。如需确认与所用主题版本一致，可对照仓库 README 中的版本号说明。
