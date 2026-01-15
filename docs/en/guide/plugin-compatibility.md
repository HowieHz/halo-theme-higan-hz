---
outline: deep
---

::: info Info

This documentation is AI-generated. You can help improve it by submitting an [Issue](https://github.com/HowieHz/halo-theme-higan-hz/issues/new).

:::

# Plugin Compatibility

All of the following are optional plugins.

## API Extension Package

Plugin [plugin-extra-api](https://github.com/HowieHz/halo-plugin-extra-api) ([App Store Page](https://www.halo.run/store/apps/app-di1jh8gd))

After enabling the plugin (lite version):

- [Post Estimated Reading Time](/guide/theme-configuration#文章预计阅读时间), [Post Word Count](/guide/theme-configuration#文章字数统计), [Page Estimated Reading Time](/guide/theme-configuration#页面预计阅读时间), [Page Word Count](/guide/theme-configuration#页面字数统计), [Moment Estimated Reading Time](/guide/theme-configuration#帖文预计阅读时间), [Moment Word Count](/guide/theme-configuration#帖文字数统计), [Multi-list Post Estimated Reading Time](/guide/theme-configuration#多元列表显示文章预计阅读时间), [Multi-list Post Word Count](/guide/theme-configuration#多元列表显示文章字数统计) will automatically apply more accurate metrics from the plugin.
- [Footer Site Statistics](/guide/theme-configuration#页面底部站点统计信息) will support "Total Word Count" statistics display.

## Links Page

Plugin [plugin-links](https://github.com/halo-sigs/plugin-links) ([App Store Page](https://www.halo.run/store/apps/app-hfbQg))

The theme provides links page (`/links`) support, please read [Links Page Style](/guide/theme-configuration#链接页样式) related documentation for details.

## Photo Gallery Page

Plugin [plugin-photos](https://github.com/halo-sigs/plugin-photos) ([App Store Page](https://www.halo.run/store/apps/app-BmQJW))

The theme provides photo gallery page (`/photos`) support, please read [Photo Gallery Page Style](/guide/theme-configuration#图库页样式) related documentation for details.

## Moments Page

Plugin [plugin-moments](https://github.com/halo-sigs/plugin-moments) ([App Store Page](https://www.halo.run/store/apps/app-SnwWD))

The theme provides moments page (`/moments`) support, please read [Moments Page Style](/guide/theme-configuration#瞬间页样式) related documentation for details.

- The moments page can be used to display GitHub activity, see [howiehz/ghu-events-moments](https://github.com/howiehz/ghu-events-moments) for this usage

## Comment Section

Choose one of the following plugins:

- Official comment section support: [plugin-comment-widget](https://github.com/halo-sigs/plugin-comment-widget) ([App Store Page](https://www.halo.run/store/apps/app-YXyaD))
- Waline comment system support: [plugin-waline](https://github.com/wenjing-xin/plugin-waline) ([App Store Page](https://www.halo.run/store/apps/app-lggDh))
- Artalk comment system support: [plugin-artalk](https://github.com/wenjing-xin/plugin-artalk) ([App Store Page](https://www.halo.run/store/apps/app-mBoYu))

## Search Widget

Plugin [plugin-search-widget](https://github.com/halo-sigs/plugin-search-widget) ([App Store Page](https://www.halo.run/store/apps/app-DlacW))

After enabling the plugin:

- The menu will display a "Search" item, click to open the search popup.

## Code Rendering

Choose one of the following plugins:

- **Recommended** shiki rendering support: [plugin-shiki](https://github.com/halo-sigs/plugin-shiki) ([App Store Page](https://www.halo.run/store/apps/app-kzloktzn))
- highlightjs.js rendering support: [plugin-highlightjs](https://github.com/halo-sigs/plugin-highlightjs) ([App Store Page](https://www.halo.run/store/apps/app-sqpgf))
  - In dark mode, the recommended code block highlight theme is `an-old-hope.min.css`.

## Image Lightbox

Plugin [plugin-lightgallery](https://github.com/halo-sigs/plugin-lightgallery) ([App Store Page](https://www.halo.run/store/apps/app-OoggD))

Recommended page matching rules:

| Path Match     | Match Area                 |
| -------------- | -------------------------- |
| `/archives/**` | `article .content`         |
| `/moments`     | `article .content .medium` |
| `/moments/**`  | `article .content .medium` |
| `/photos`      | `article .content`         |
| `/photos/**`   | `article .content`         |

## Mermaid and PlantUML Support

The theme itself provides [Mermaid Support](/guide/theme-configuration#mermaid-支持), as well as [Mermaid Adaptation for Light/Dark Theme Switching](/guide/style-reference#mermaid-适配明暗主题切换) support.

In addition, you can also install plugin [plugin-text-diagram](https://github.com/halo-sigs/plugin-text-diagram) ([App Store Page](https://www.halo.run/store/apps/app-ahBRi)), which provides Mermaid and PlantUML support.

## RSS Feed Plugin

Plugin [plugin-feed](https://github.com/halo-dev/plugin-feed) ([App Store Page](https://www.halo.run/store/apps/app-KhIVw))

After enabling the plugin:

- You can use [Category RSS Subscribe Button](/guide/theme-configuration#显示分类-rss-订阅按钮).
- You can use [Tag RSS Subscribe Button](/guide/theme-configuration#显示标签-rss-订阅按钮).
- You can use [Author RSS Subscribe Button](/guide/theme-configuration#显示作者-rss-订阅按钮).
