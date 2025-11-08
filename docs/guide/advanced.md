---
title: 进阶功能
outline: deep
---

# 进阶功能

本章介绍 higan-hz 的高级能力与可选插件集成，包括性能优化、安全策略、多语言策略以及可扩展的分享与统计方案。

## 资源与性能

### 使用自定义 CDN

- 在 `全局 → 自定义资源位置地址` 勾选启用后，可将主题静态文件（CSS/JS）指向自建 CDN。
- `instant.page 资源位置` 字段接受完整 URL 或站内相对路径，推荐使用具备 HTTPS、HTTP/2 的源以获取最佳性能。
- 若你同时启用了浏览器缓存策略或反向代理缓存，请在更新主题后同步刷新缓存，避免加载旧版本资源。

### instant.page 预加载

- 主题默认开启 `instant.page`，当用户鼠标悬停在链接上时会提前发起请求。
- 适合中小站点提升响应速度；若后端性能有限或存在 REST 接口限流，可关闭该选项以减少预热请求。

### 自定义字体文件

- 在 `总体样式 → 启用自定义字体文件` 上传字体资源。
- 若填写了“字体名称”，浏览器会优先使用本地安装的同名字体；否则始终下载上传的字体文件。
- 建议搭配 `font-display: swap` 的 @font-face 声明，以减少布局抖动。

## 安全策略与防护

### upgrade-insecure-requests

- 当站点启用 HTTPS，而页面中仍存在 HTTP 资源（例如外链图片、脚本）时，浏览器会触发 Mixed Content 警告。
- 勾选 `全局 → CSP:upgrade-insecure-requests` 后，浏览器会自动将这些请求升级为 HTTPS。确保第三方资源支持 HTTPS，否则可能导致资源无法加载。

### 防镜像跳转

- `全局 → 仅允许使用指定域名访问` 会检测当前访问域名是否在白名单中。
- `域名白名单列表` 与 `Base64 编码后的目标链接` 都需要输入 **Base64 后的结果**。可以使用在线工具编码 `https://example.com` → `aHR0cHM6Ly9leGFtcGxlLmNvbQ==`。
- `跳转后是否保留路径和查询参数` 适用于希望保留原始路由（例如从镜像站 `http://evil.com/post/1` 跳转回 `https://example.com/post/1`）。

## 多语言进阶技巧

- 前缀匹配模式可用来统一 `zh`、`zh_CN`、`zh_TW`，但若某个地区需要特殊内容，可在“多语言个人简介/页面底部内容”中单独添加具体语言代码提升优先级。
- 若与 Halo 多语言内容功能（站点级）同时使用，建议统一语言代码命名，避免出现 `zh-CN` 与 `zh_CN` 混用。
- 在主题资源中可以通过 `data-lang="xx"` 自行读取当前语言：

```javascript
const currentLang = document.documentElement.lang || 'zh';
```

## Mermaid

1. 启用 `全局 → Mermaid 支持`。
2. `Mermaid CSS 选择器` 默认值为 `.content .mermaid`，即仅对正文中带 `.mermaid` 的节点生效。若你希望在评论区渲染，请自定义选择器并确认评论系统是否允许脚本执行。
3. `Mermaid 脚本地址` 默认为官方镜像，可根据网络环境切换至 `jsdelivr`、`unpkg` 等 CDN。
4. `Mermaid Config 属性` 支持填写完整配置对象：

```javascript
{
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose'
}
```

若你希望在文章内手动初始化，请设置 `startOnLoad: false`，然后在自定义脚本中调用 `mermaid.run()`。

## 自定义分享菜单

- 所有分享项目都定义在 `自定义分享按钮 → 分享按钮设置` 列表中。
- `@URL`、`@TITLE` 会在运行时替换成实际页面地址与标题，支持出现在查询参数或 URL Path 中。
- 若某个平台需要附加 UTM 参数，可直接在链接中编写：

```
https://x.com/share?url=@URL&utm_source=blog&title=@TITLE
```

- 移动端底部分享按钮与桌面端浮动菜单共用同一份配置。删除某个条目即可从两处一起移除。

## 插件适配

| 插件 | 页面 | 主题适配要点 |
|------|------|--------------|
| `plugin-links` | `/links` | 链接描述支持 HTML；可在“多元文章列表”中显示标签颜色。 |
| `plugin-photos` | `/photos` | 支持瀑布流、自定义 onmouseover/onmouseout、图片渐隐。 |
| `plugin-moments` | `/moments`、`/moments/:name` | 主题提供专属列表布局，与首页瞬间列表共享设置。 |
| `plugin-feed` | 分类、标签、作者详情 | 打开对应页面的“显示 RSS 订阅按钮”开关即可注入订阅入口。 |
| `plugin-comment-widget` | 文章/瞬间/自定义页 | 主题内置样式与切换模式兼容，推荐搭配。 |
| `plugin-search-widget` | 任意页面 | 通过 Halo 导航按钮展示。主题不修改插件 DOM 结构，可无缝使用。 |
| `plugin-extra-api` | 统计/字数 | 提供更精准的字数统计；开启后可在站点统计中选择“总字数”。 |

> 启用插件后若发现样式异常，可尝试在“总体样式 → 自定义内容区域最大宽度”中缩小宽度以避免插件容器超出。

## 可选插件与配置建议

| 能力 | 插件 | 说明 |
|------|------|------|
| 字数统计 / 站点总字数 | [`plugin-extra-api`](https://www.halo.run/store/apps/app-di1jh8gd) | 启用后主题会自动调用更精确的字数接口，同时“总体样式 → 页面底部站点统计信息”新增“总字数”指标。 |
| 友链管理 | [`plugin-links`](https://www.halo.run/store/apps/app-hfbQg) | `/links` 页面将启用主题模板，友链描述可写 HTML；支持“多元文章列表”显示标签颜色。 |
| 图库 / 瀑布流 | [`plugin-photos`](https://www.halo.run/store/apps/app-BmQJW) | 配合“相册页样式”分组调节圆角、列数、间距、鼠标事件。建议在插件中为相册补充封面图。 |
| 瞬间流 / Microblog | [`plugin-moments`](https://www.halo.run/store/apps/app-SnwWD) | `/moments`、`/moments/:name` 页面使用主题特制布局；可与 GitHub 活动同步脚本（如 `ghu-events-moments`）组合。 |
| 评论系统 | [`plugin-comment-widget`](https://www.halo.run/store/apps/app-YXyaD) | 主题内置 comment-widget 样式变量，支持深浅色同步；可在文章/瞬间/自定义页面单独开关。 |
| 搜索弹窗 | [`plugin-search-widget`](https://www.halo.run/store/apps/app-DlacW) | 搜索按钮可加入 Halo 导航菜单，主题不会覆盖其输出结构。 |
| 代码高亮 | [`plugin-highlightjs`](https://www.halo.run/store/apps/app-sqpgf) | 推荐暗色主题选择 `an-old-hope.min.css`，保持阅读体验一致。 |
| 图片灯箱 | [`plugin-lightgallery`](https://www.halo.run/store/apps/app-OoggD) | 建议匹配区域：`/archives/**` → `article .content`、`/moments` → `article .content .medium`、`/moments/**` → `article .content .medium`、`/photos`/`/photos/**` → `article .content`。 |
| Mermaid 编辑块 | [`plugin-hybrid-edit-block`](https://www.halo.run/store/apps/app-NgHnY) | 默认编辑器渲染 Mermaid、浅/深模式内容时所必需。启用后可使用 `/html` 插入自定义块。 |
| Vditor 编辑器 | [`halo-plugin-vditor`](https://www.halo.run/store/apps/app-uBcYw) | 获得 Markdown + 所见即所得体验，主题内置的 Mermaid、暗/亮内容、隐藏组件均与 Vditor 兼容。 |

## 打包与部署技巧

- `pnpm build` 会生成 `dist/howiehz-higan*.zip`，其中包含简体中文与英文两个成品包，可直接上传 Halo。
- 主题打包过程使用了 Stylus + Tailwind + Vite 的组合，若你只修改 HTML/配置，可直接在 `src/templates` 内编辑，不必重新构建。
- Tailwind 的基类清单位于 `src/styles/tailwind.css`，如需新增实用类，记得更新该文件并重新执行 `pnpm build` 以写入最终样式。

## 自定义脚本与样式注入

- Halo 后台的 `系统设置 → 代码注入` 可以与主题末尾的“页面最底部内容”同时使用。前者插入到主题信息之上，后者位于最底部。
- 若需要针对特定页面注入脚本，可结合 Halo 的元数据（如文章 `页面语言`、`页面标题`）设置条件渲染。
- 主题的主要入口脚本位于 `src/pages/*.ts` 与 `src/utils/*.ts`，其中 `header-menu.ts` 控制导航折叠，`create-toc.ts` 控制目录生成。

## 调试与排错

1. **启用浏览器 DevTools**：检查 Console 是否存在 CSP、跨域、资源 404 报错。
2. **确认配置保存成功**：Halo 在保存主题设置后会在主题目录生成 `settings.yaml` 的副本以及前端可读的 JSON。若保存后无变化，可查看 Halo 日志确认写入权限。
3. **逐项排查**：
   - 样式缺失 → 检查是否清空缓存、是否正确构建。
   - 多语言未生效 → 确认菜单/公告等语言代码是否与 `navigator.language` 匹配。
   - 分享按钮异常 → 在浏览器地址栏输入生成后的分享 URL，检查是否被参数编码影响。

---

至此，你已掌握 higan-hz 的高级选项与插件整合方式。若还未阅读模板映射与常见问题，请前往《[参考资料](../reference/template-map.md)》与《[常见问题](../reference/faq.md)》。
