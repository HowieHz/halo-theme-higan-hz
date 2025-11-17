---
outline: deep
---

# 常见问题

此文档汇总在使用和二次开发时最常见的疑问及解决方案。

::: tip

如问题仍未解决，可前往 [GitHub Issues](https://github.com/HowieHz/halo-theme-higan-hz/issues) 搜索或提交新的反馈，或加入 QQ 群 `694413711` 获取社区支持。

:::

## 常规使用问题

### 菜单如何指向指定标签或分类页面？

- 在菜单中新建“自定义链接”，名称随意，链接地址根据[模板映射表](/reference/template-map)填写。例如标签归档 `/tags/{标签实际 slug}`、分类归档 `/categories/{分类实际 slug}`。
- 更多页面（如标签列表、分类列表、归档页）的路径可在[模板文件与访问路径映射](/reference/template-map)中查询。
- 提交修改后刷新前台确认结果。

### 主题启用后样式错乱怎么办？

1. 请确认所有静态资源都正常返回。可以在浏览器开发者工具（`DevTools`）的网络（`Network`）面板中筛选 `.css` 来检查。
2. 若使用了 CDN 或反向代理缓存，请刷新缓存；若先前缓存头配置有误，可尝试浏览器强制刷新（`Ctrl + F5`）来获取最新资源。

### 自定义字体不生效？

- 如果填写了字体名称，请确保值与字体文件内部的 `Full name` 或 `PostScript Name` 保持一致。
- 检查浏览器开发者工具（DevTools）中网络（Network）面板是否成功加载字体文件。

### 已启用多语言菜单但未生效？

请阅读[多语言菜单使用指南](/tutorial/i18n#多语言菜单使用指南)。

## 开发与调试

### 开发模式下如何快速验证样式？

- 请参照[使用符号链接实现 Halo 主题的热更新](https://erzbir.com/archives/symlink-halo-theme-hot-reload)

### 页面语言设定优先级

站点根标签 `<html>` 的 `lang` 属性设定优先级：

<!-- markdownlint-disable MD013 -->

1. [文章](/guide/metadata-configuration#文章页面标题)、[分类](/guide/metadata-configuration#分类页面标题)、[标签](/guide/metadata-configuration#标签元数据)、[页面](/guide/metadata-configuration#页面元数据)元数据中明确指定的 `language` 元数据。
2. URL 查询参数 `?lang=`。
3. 主题设置中的[默认页面语言](/guide/theme-configuration#默认页面语言)。
4. 若上述都为空，则回退到 `zh`。

<!-- markdownlint-enable MD013 -->
