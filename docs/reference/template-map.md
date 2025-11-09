---
title: 模板映射与页面路径
outline: deep
---

# 模板映射与页面路径

下表汇总主题内主要模板文件、对应访问路径以及 Halo 官方变量文档，便于排查页面来源或自定义布局。

## Halo 内置页面

| 模板位置 | 渲染页面 | 默认访问路径 | Halo 文档 |
|----------|----------|--------------|-----------|
| `src/templates/index.html` | 首页 | `/` | [首页](https://docs.halo.run/developer-guide/theme/template-variables/index_) |
| `src/templates/post.html` | 文章详情 | `/archives/:slug`（可在后台自定义） | [文章](https://docs.halo.run/developer-guide/theme/template-variables/post) |
| `src/templates/page.html` | 独立页面 | `/:slug` | [单页面](https://docs.halo.run/developer-guide/theme/template-variables/page) |
| `src/templates/archives.html` | 文章归档 | `/archives`、`/archives/:year`、`/archives/:year/:month` | [文章归档](https://docs.halo.run/developer-guide/theme/template-variables/archives) |
| `src/templates/tags.html` | 标签集合 | `/tags` | [标签集合](https://docs.halo.run/developer-guide/theme/template-variables/tags) |
| `src/templates/tag.html` | 标签详情 | `/tags/:slug` | [标签](https://docs.halo.run/developer-guide/theme/template-variables/tag) |
| `src/templates/categories.html` | 分类集合 | `/categories` | [分类集合](https://docs.halo.run/developer-guide/theme/template-variables/categories) |
| `src/templates/category.html` | 分类详情 | `/categories/:slug` | [分类](https://docs.halo.run/developer-guide/theme/template-variables/category) |
| `src/templates/author.html` | 作者详情 | `/authors/:name` | [作者](https://docs.halo.run/developer-guide/theme/template-variables/author) |
| `src/templates/error/404.html` 等 | 错误页 | 异常时自动渲染 | [错误页面](https://docs.halo.run/developer-guide/theme/template-variables/error) |

> 认证页模板（`auth`）暂未在主题中提供定制实现，若有需求可参考 HALO 官方示例自行添加。

## 插件页面

| 模板位置 | 依赖插件 | 页面 | 默认路径 | 文档 / 仓库 |
|----------|----------|------|---------|-------------|
| `src/templates/links.html` | [plugin-links](https://github.com/halo-sigs/plugin-links) | 友链列表 | `/links` | 插件 README |
| `src/templates/photos.html` | [plugin-photos](https://github.com/halo-sigs/plugin-photos) | 图库页面 | `/photos`、`/photos/page/{page}` | 插件 README |
| `src/templates/moments.html` | [plugin-moments](https://github.com/halo-sigs/plugin-moments) | 瞬间列表 | `/moments`、`/moments/page/{page}`、`/moments?tag={tag}` | 插件 README |
| `src/templates/moment.html` | [plugin-moments](https://github.com/halo-sigs/plugin-moments) | 瞬间详情 | `/moments/{name}` | 插件 README |
| `public/assets/qrcode.html` | 无 | 分享二维码页 | `/themes/howiehz-higan/assets/qrcode.html` | - |

## 模板片段

主题在 `src/templates/fragments/` 与顶层 `templates/fragments/` 下提供了大量片段，用于复用页眉、页脚、菜单、文章目录等结构。在 Halo 2.x 中，这些片段会通过 Vite 构建成最终的 HTML：

| 片段 | 作用 |
|------|------|
| `fragments/header.html` | 顶部导航、头像与菜单切换按钮 |
| `fragments/layout.html` | 页面主布局容器与公共插槽 |
| `fragments/post-nav.html` | 文章底部上一页/下一页导航 |
| `fragments/posts.html` | 多元文章列表项目 |
| `error/404.html`、`error/5xx.html` | 特定错误页面内容 |

编辑片段时无需手动导入，在构建阶段（`pnpm build`）会将 `src/templates` 与 `templates` 同步输出。

## 排错提示

1. **确认访问路径**：若页面输出与预期不一致，可通过浏览器查看页面源代码顶部的注释，里面通常包含模板名称（由 Halo 注入）。
2. **插件模板优先级**：插件会注册新的路由，确保插件已启用且具备对应数据（例如相册中的相册分组）后再测试页面。
3. **静态资源**：`public/assets` 目录下的文件会原样复制到主题输出中，适合放置自定义脚本、字体与二维码模板。
4. **配置联动**：某些页面（如 `/moments`、`/photos`）需要在主题设置中开启相应的展示开关，详见《[站点配置基础](../guide/essentials/site-configuration.md)》。

---

如果你需要添加自定义模板，可在 `src/templates` 中新增文件并在 Halo 后台为页面指定自定义模板，更多细节请参考 Halo 官方文档。
