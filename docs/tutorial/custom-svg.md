---
outline: deep
---

# 自定义图标

::: warning

此文档适用于 < 1.50.0

:::

::: tip

如问题仍未解决，可前往 [GitHub Issues](https://github.com/HowieHz/halo-theme-higan-hz/issues) 搜索或提交新的反馈，或加入 QQ 群 `694413711` 获取社区支持。

随时欢迎您为本教程添砖加瓦。

:::

## 通过 iconify 获取图标

此方法获取的 SVG 格式为 data URI，百分号编码形式：`url("data:image/svg+xml,%3Csvg...%3E")`。

前往 [iconify](https://icon-sets.iconify.design/)，点击任意图标集（如下图红框）。

![tutorial-custom-svg-1.avif](/tutorial-custom-svg-1.avif)

选择任意图标（如下图红框）。

![tutorial-custom-svg-2.avif](/tutorial-custom-svg-2.avif)

点击图标后，底部会弹出详细信息展示，左边一列选择 `CSS`，顶栏选择 `URL` 即可看到 `url("……")` 格式的图标信息。点击 `Copy to Clipboard` 按钮将此信息复制到剪切板。

![tutorial-custom-svg-3.avif](/tutorial-custom-svg-3.avif)

找到主题配置位置，粘贴即可。

![tutorial-custom-svg-4.avif](/tutorial-custom-svg-4.avif)
