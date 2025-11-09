# halo-theme-higan-hz

![GitHub](https://img.shields.io/github/license/HowieHz/halo-theme-higan-hz)
![GitHub all releases](https://img.shields.io/github/downloads/HowieHz/halo-theme-higan-hz/total)
![GitHub release (latest by date)](https://img.shields.io/github/downloads/HowieHz/halo-theme-higan-hz/latest/total)
![GitHub repo size](https://img.shields.io/github/repo-size/HowieHz/halo-theme-higan-hz)
[![Halo Version](https://img.shields.io/badge/Halo-2.19+-brightgreen.svg)](https://halo.run)

一款在原 `halo-theme-higan` 基础上深度定制的 Halo 主题，聚焦响应式布局、可配置性与性能体验。项目默认遵循 MIT 许可证。

## Documentation

- 在线文档：https://howiehz.top/archives/higan-hz-style-guide
- 仓库文档源码：`docs/`（VitePress）

阅读文档可获取完整的安装、配置、进阶功能与模板说明，本 README 仅保留快速索引。

## Highlights

- 多语言体系：菜单、公告、页脚、页面语言等均支持按语言区分与前缀匹配。
- 可配置配色：浅色/深色/自动模式切换，自定义 CSS 变量与保留用户偏好。
- 页面模块控制：主页、文章、分类、标签、页面等模块级开关与布局细节调节。
- 插件适配：原生支持 links/photos/moments/feed/comment-widget/search-widget 等官方插件。
- 性能与安全：按页面拆分资源，集成 instant.page、自定义 CDN、防镜像跳转与 CSP 选项。

## Preview

![preview-1](./docs/img/preview-1.png)

更多样式示例见文档站点与 `docs/img/`。

## Installation

1. 前往 [Releases](https://github.com/HowieHz/halo-theme-higan-hz/releases) 下载最新主题包（或 Halo 应用市场「彼岸 - 皓改」）。
2. 在 Halo 控制台上传安装主题并启用。
3. 如需最新开发版，可在 [Build CI](https://github.com/HowieHz/halo-theme-higan-hz/actions/workflows/build.yml) 下载 `theme-artifact`。
4. 建议搭配文档中的可选插件，完善搜索、评论、图库等体验。

## Optional Plugins

- [plugin-search-widget](https://github.com/halo-sigs/plugin-search-widget) · 全局搜索
- [plugin-highlightjs](https://github.com/halo-sigs/plugin-highlightjs) · 代码高亮
- [plugin-lightgallery](https://github.com/halo-sigs/plugin-lightgallery) · 图片灯箱
- [plugin-links](https://github.com/halo-sigs/plugin-links) · 友链页
- [plugin-photos](https://github.com/halo-sigs/plugin-photos) · 图库页
- [plugin-moments](https://github.com/halo-sigs/plugin-moments) · 瞬间页

更多插件、配置步骤和调优技巧均在文档中详细说明。

## Credits

- 原主题：[`guqing/halo-theme-higan`](https://github.com/guqing/halo-theme-higan)
- 上游设计：[`probberechts/hexo-theme-cactus`](https://github.com/probberechts/hexo-theme-cactus)

感谢原作者及社区伙伴的贡献与反馈，欢迎 Star、Issue 或 PR 支持项目迭代。

## License

MIT © [HowieHz](https://github.com/HowieHz)
