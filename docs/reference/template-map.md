---
outline: deep
---

<!-- markdownlint-disable MD013 -->

# 模板文件与访问路径映射

下表汇总本主题主要模板文件、对应访问路径以及 Halo CMS 官方模板文档。

以便于进行二次开发、配置菜单路径以及在其他需要设置超链接的场景中查阅。

## Halo 内置页面

模板文件在 `src/templates` 文件夹下。  
表格默认访问路径中 `{xxx}` 表示变量，请填入实际值；`(xxx)` 表示可选值，请根据需要填写。

| 模板文件                    | 渲染页面 | 默认访问路径                                                                    | 文档                                                                                  |
| --------------------------- | -------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `index.html`                | 首页     | `/(page/{page})`                                                                | [首页](https://docs.halo.run/developer-guide/theme/template-variables/index_)         |
| `post.html`                 | 文章详情 | `/archives/{slug}`（可在 Halo CMS 后台修改）                                    | [文章](https://docs.halo.run/developer-guide/theme/template-variables/post)           |
| `page.html`                 | 独立页面 | `/{slug}`                                                                       | [单页面](https://docs.halo.run/developer-guide/theme/template-variables/page)         |
| `page-like-post-style.html` | 独立页面 | `/{slug}`（自定义模板：[文章页样式](/guide/metadata-configuration#文章页样式)） | [单页面](https://docs.halo.run/developer-guide/theme/template-variables/page)         |
| `archives.html`             | 文章归档 | `/archives(/{year}(/{month}))`                                                  | [文章归档](https://docs.halo.run/developer-guide/theme/template-variables/archives)   |
| `tags.html`                 | 标签集合 | `/tags`                                                                         | [标签集合](https://docs.halo.run/developer-guide/theme/template-variables/tags)       |
| `tag.html`                  | 标签详情 | `/tags/{slug}`                                                                  | [标签](https://docs.halo.run/developer-guide/theme/template-variables/tag)            |
| `categories.html`           | 分类集合 | `/categories`                                                                   | [分类集合](https://docs.halo.run/developer-guide/theme/template-variables/categories) |
| `category.html`             | 分类详情 | `/categories/{slug}`                                                            | [分类](https://docs.halo.run/developer-guide/theme/template-variables/category)       |
| `author.html`               | 作者详情 | `/authors/{name}`                                                               | [作者](https://docs.halo.run/developer-guide/theme/template-variables/author)         |
| `error/*.html`              | 错误页   | 无固定访问路径，由异常决定                                                      | [错误页面](https://docs.halo.run/developer-guide/theme/template-variables/error)      |

## 插件页面

模板文件在 `src/templates` 文件夹下。  
表格默认访问路径中 `{xxx}` 表示变量，请填入实际值。`(xxx)` 表示可选值。

| 模板文件       | 页面               | 默认路径                                       | 依赖插件                                                          |
| -------------- | ------------------ | ---------------------------------------------- | ----------------------------------------------------------------- |
| `links.html`   | 友链列表           | `/links`                                       | [plugin-links](https://github.com/halo-sigs/plugin-links)         |
| `photos.html`  | 图库页面           | `/photos`、`/photos/page/{page}`               | [plugin-photos](https://github.com/halo-sigs/plugin-photos)       |
| `moments.html` | 瞬间列表           | `/moments(/page/{page})(?tag={tag})`           | [plugin-moments](https://github.com/halo-sigs/plugin-moments)     |
| `moment.html`  | 瞬间详情           | `/moments/{name}`                              | [plugin-moments](https://github.com/halo-sigs/plugin-moments)     |
| `friends.html` | 朋友圈（订阅聚合） | `/friends(/page/{page})(?linkName={linkName})` | [plugin-friends](https://github.com/chengzhongxue/plugin-friends) |

### 其他插件适配

| 文件位置                                                   | 介绍                 | 依赖插件                                                                                                                           |
| ---------------------------------------------------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `src\styles\mixins\colors\mixins\comment-widget-vars.styl` | 官方评论组件样式适配 | [plugin-comment-widget](https://github.com/halo-dev/plugin-comment-widget?tab=readme-ov-file#%E4%B8%BB%E9%A2%98%E9%80%82%E9%85%8D) |
