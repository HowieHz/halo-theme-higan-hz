---
outline: deep
---

# 插件兼容性

以下均为可选插件。

## API 扩展

插件 [plugin-extra-api](https://github.com/HowieHz/halo-plugin-extra-api)（[应用市场页面](https://www.halo.run/store/apps/app-di1jh8gd)）

启用插件（轻量版）后：

- [文章预计阅读时间](/guide/theme-configuration#文章预计阅读时间)、[文章字数统计](/guide/theme-configuration#文章字数统计)、[页面预计阅读时间](/guide/theme-configuration#页面预计阅读时间)、[页面字数统计](/guide/theme-configuration#页面字数统计)、[帖文预计阅读时间](/guide/theme-configuration#帖文预计阅读时间)、[帖文字数统计](/guide/theme-configuration#帖文字数统计)将自动应用插件中更准确的计量方法。
- [页面底部站点统计信息](/guide/theme-configuration#页面底部站点统计信息)将支持“总字数”统计显示。

## 友链页

插件 [plugin-links](https://github.com/halo-sigs/plugin-links)（[应用市场页面](https://www.halo.run/store/apps/app-hfbQg)）

主题提供了友链页（`/links`）支持。

## 图库页

插件 [plugin-photos](https://github.com/halo-sigs/plugin-photos)（[应用市场页面](https://www.halo.run/store/apps/app-BmQJW)）

主题提供了图库页面（`/photos`）支持，详情请阅读[图库页样式](/guide/theme-configuration#图库页样式)相关文档。

## 瞬间页

插件 [plugin-moments](https://github.com/halo-sigs/plugin-moments)（[应用市场页面](https://www.halo.run/store/apps/app-SnwWD)）

主题提供了瞬间页（`/moments`）支持，详情请阅读[瞬间页样式](/guide/theme-configuration#瞬间页样式)相关文档。

- 瞬间页面可用于展示 GitHub 活动，此用法请看 [howiehz/ghu-events-moments](https://github.com/howiehz/ghu-events-moments) 或 [guqing/ghu-events-moments](https://github.com/guqing/ghu-events-moments)（兼容原主题数据类型）

## 评论区

以下插件任选其一即可：

- 官方评论区支持：[plugin-comment-widget](https://github.com/halo-sigs/plugin-comment-widget)（[应用市场页面](https://www.halo.run/store/apps/app-YXyaD)）
- Waline 评论系统支持：[plugin-waline](https://github.com/wenjing-xin/plugin-waline)（[应用市场页面](https://www.halo.run/store/apps/app-lggDh)）
- Artalk 评论系统支持：[plugin-artalk](https://github.com/wenjing-xin/plugin-artalk)（[应用市场页面](https://www.halo.run/store/apps/app-mBoYu)）

## 搜索框组件

插件 [plugin-search-widget](https://github.com/halo-sigs/plugin-search-widget)（[应用市场页面](https://www.halo.run/store/apps/app-DlacW)）

启用插件后：

- 菜单将显示“搜索”项，点击即可唤起搜索弹框。

## 代码渲染

以下插件任选其一即可：

- **推荐** shiki 渲染支持：[plugin-shiki](https://github.com/halo-sigs/plugin-shiki)（[应用市场页面](https://www.halo.run/store/apps/app-kzloktzn)）
- highlightjs.js 渲染支持：[plugin-highlightjs](https://github.com/halo-sigs/plugin-highlightjs)（[应用市场页面](https://www.halo.run/store/apps/app-sqpgf)）
  - 暗黑模式下，代码块高亮主题推荐选择 `an-old-hope.min.css`。

## 图片灯箱

插件 [plugin-lightgallery](https://github.com/halo-sigs/plugin-lightgallery)（[应用市场页面](https://www.halo.run/store/apps/app-OoggD)）

页面匹配规则 推荐设置为：

| 路径匹配       | 匹配区域                   |
| -------------- | -------------------------- |
| `/archives/**` | `article .content`         |
| `/moments`     | `article .content .medium` |
| `/moments/**`  | `article .content .medium` |
| `/photos`      | `article .content`         |
| `/photos/**`   | `article .content`         |

## Mermaid 和 PlantUML 支持

主题本体提供了 [Mermaid 支持](/guide/theme-configuration#mermaid-支持)，以及 [Mermaid 适配明暗主题切换](/guide/style-reference#mermaid-适配明暗主题切换)支持。

<!-- markdownlint-disable MD013 -->

此外，你也可以安装插件 [plugin-text-diagram](https://github.com/halo-sigs/plugin-text-diagram)（[应用市场页面](https://www.halo.run/store/apps/app-ahBRi)），这个插件提供了 Mermaid 和 PlantUML 支持。

<!-- markdownlint-enable MD013 -->

## RSS 订阅插件

插件 [plugin-feed](https://github.com/halo-dev/plugin-feed)（[应用市场页面](https://www.halo.run/store/apps/app-KhIVw)）

启用插件后：

- 可使用[分类 RSS 订阅按钮](/guide/theme-configuration#显示分类-rss-订阅按钮)。
- 可使用[标签 RSS 订阅按钮](/guide/theme-configuration#显示标签-rss-订阅按钮)。
- 可使用[作者 RSS 订阅按钮](/guide/theme-configuration#显示作者-rss-订阅按钮)。
