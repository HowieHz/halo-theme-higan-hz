---
outline: deep
---

<!-- markdownlint-disable MD033 -->

# 主题配置项

::: danger

此页面尚未完成

:::

<script setup>
import { ref, computed, h } from 'vue'

const inputBaseUrl = ref('') // 用户输入的基础链接

const canJump = computed(() => inputBaseUrl.value.trim().length > 0)

function prefixHref(href) {
  if (!href) return href
  // 当不能跳转时，返回页面内锚点，指向警告元素（省去每处的三元判断）
  if (!canJump.value) return '#quick-jump-warning'
  // 如果是绝对链接（含协议），直接返回
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(href)) return href
  const base = inputBaseUrl.value.trim().replace(/\/+$/,'') // 去除末尾斜杠
  const path = href.replace(/^\/+/, '') // 去除前置斜杠
  if (!base) return href.startsWith('/') ? ('/' + path) : path
  return base + '/' + path
}

/**
 * QuickJumpConfigPage — 轻量函数式链接组件（返回 <a> 节点）
 *
 * 行为概述
 * - 根据 props.to 生成最终 href（通过 prefixHref 处理站点基础地址与绝对链接）
 * - 当用户未填写基础站点（canJump === false）时，prefixHref 返回 "#quick-jump-warning"
 *   并且链接会添加 aria-describedby="quick-jump-warning"、aria-disabled="true"、tabindex="-1"
 *
 * Props
 * - to: string（必需） — 目标路径
 * - label?: string — 链接显示文本，默认回退到 to
 * - ariaLabel?: string — 无障碍文本，默认回退到 to
 * - showRealUrl?: boolean — 是否展示实际跳转链接，为 true 将强制覆盖 label
 */
const QuickJumpConfig = (props) => {
  const to = props.to
  const label = props.label ?? to
  const ariaLabel = props.ariaLabel ?? to
  const href = prefixHref(to)
  const showRealUrl = props.showRealUrl ?? false

  const attrs = {
    href,
    ['aria-label']: ariaLabel
  }

  if (canJump.value) {
    attrs.target = '_blank'
    attrs.rel = 'noopener'
  } else {
    attrs.target = "_self"
  }

  // 当不能跳转时，添加无障碍提示
  if (!canJump.value) {
    attrs['aria-describedby'] = 'quick-jump-warning'
    attrs['aria-disabled'] = 'true'
    attrs.tabindex = '-1'
  }

  return h('a', attrs, showRealUrl ? href : label)
}
</script>

你可以在后台"主题设置"界面中直接修改这些配置项。

::: tip {#quick-jump-warning}

当你的站点已经安装了最新版本的主题后，可在下方填写你的站点链接。  
即可在本文档启用快速跳转链接，一键跳转到后台对应配置项。

:::
::: info 站点链接

<input v-model="inputBaseUrl" placeholder="请在此处填写你的 Halo 站点链接。例：https://example.com" style="width:100%" />

:::
<template v-if="canJump">

::: info 请确保此链接可访问

<QuickJumpConfig to="/console" showRealUrl=true />  
只有在上方链接可访问时，快速跳转链接才可以正常使用。

:::

</template>

## 示例

::: info 🎯 用途

说明配置项用途。

:::
::: info 📂 配置项位置

说明在主题配置项的位置。

:::
::: info ⚡ 快速跳转

点击即可快速跳转到对应主题配置项。

:::

::: info 🏷️ 值类型

此配置项的值类型。

::: tip 以下举例几个常见类型

- 字符串：一串字符，如 `abc123`、`zh-CN`。
- 整数：整数，如 `-1`、`0`、`100`。
- 浮点数：带小数点的数，如 `1.2`、`0.3`、`4.5`。
- 布尔值：`true` 或 `false`

<!-- - 数组：多个值的列表，如 `[1, 2, 3]`
- 对象：键值对集合，如 `{name: "张三", age: 20}`
- URL：网址链接，如 `https://example.com`
- 颜色值：如 `#FF5733`、`rgb(255, 87, 51)`
- CSS 长度值：如 `1rem`、`1px`、`1em`、`50%`、`1vw` -->

:::

::: info ⭐ 默认值

此配置项的默认值。

::: tip 如何重置全部配置为默认值？

前往 <QuickJumpConfig to="/console/theme" />，之后点击主题名这行最右边三个点，最后点击重置按钮即可。

:::

::: info 💡 示例值

再举几个例子便于理解。

:::
::: info 🔒 内部约束

如果填写的配置值不满足这个要求，将无法保存配置。

:::
::: info ⚠️ 外部约束

如果填写的配置值不满足这个要求，主题可能无法正常工作。

:::  
::: info 🧩 模板变量

提供给模板开发者使用的变量，用于读取此配置值。可通过 `${模板变量}` 使用。

:::
::: info ℹ️ 补充信息

补充说明一些信息。

:::

## 全局

### 默认页面语言

::: info 🎯 用途

指定站点根标签 `<html>` 的 `lang` 属性默认值，用于辅助无障碍、SEO 以及浏览器/插件的语言感知（例：浏览器是否弹出页面翻译提醒）。

:::
::: info 📂 配置项位置

全局 -> 默认页面语言

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/global#:~:text=默认页面语言" />

:::
::: info 🏷️ 值类型

字符串

:::
::: info ⭐ 默认值

`zh`

:::
::: info 💡 示例值

`zh`、`zh-CN`、`zh-Hans`、`en`、`en-US`

:::
::: info 🔒 内部约束

无

:::
::: info ⚠️ 外部约束

设定值需满足 [BCP 47](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Global_attributes/lang#:~:text=%E5%A6%82%E6%9E%9C%E6%A0%87%E7%AD%BE%E5%86%85%E5%AE%B9%E6%98%AF%E6%97%A0%E6%95%88%E7%9A%84%EF%BC%8C%E6%A0%B9%E6%8D%AE%20BCP47%EF%BC%8C%E5%AE%83%E5%B0%B1%E8%AE%BE%E4%B8%BA%E6%97%A0%E6%95%88%E3%80%82)，否则无效。

:::
::: info 🧩 模板变量

`theme.config?.global?.default_page_language`

:::
::: info ℹ️ 补充信息

- 安全性：设定的语言值的会自动转义，无需担心 XSS 注入攻击。
- 内部相关行为：
  - 站点根标签 `<html>` 的 `lang` 属性设定顺序：
    1. 页面/文章元数据中明确指定的 `language` 元数据（最高优先级）
    2. URL 查询参数 ?lang=（若存在且通过验证）
    3. 主题设置中的默认页面语言（此配置项）
    4. 若上述都为空，则回退到 "zh"

:::

### 多语言功能前缀匹配模式

::: info 🎯 用途

启用多语言功能的前缀匹配模式，使主题能够更灵活地匹配语言设置。

:::
::: info 📂 配置项位置

全局 -> 多语言功能前缀匹配模式

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/global#:~:text=多语言功能前缀匹配模式" />

:::
::: info 🏷️ 值类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.global?.is_i18n_prefix_match_mode`

:::
::: info ℹ️ 补充信息

具体使用方法请参考多语言文档。

:::

### 浏览器语言自动跳转

::: info 🎯 用途

根据浏览器的语言设置，自动跳转到对应语言的页面。

:::
::: info 📂 配置项位置

全局 -> 浏览器语言自动跳转

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/global#:~:text=浏览器语言自动跳转" />

:::
::: info 🏷️ 值类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.global?.is_auto_redirect_to_browser_language`

:::
::: info ℹ️ 补充信息

启用此项后，若浏览器语言与默认页面语言不同，且存在对应语言的页面，将自动跳转。

:::

### CSP:upgrade-insecure-requests

::: info 🎯 用途

自动将非跳转的不安全资源请求升级到 HTTPS，包括当前域名以及第三方请求。

:::
::: info 📂 配置项位置

全局 -> CSP:upgrade-insecure-requests

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/global#:~:text=CSP:upgrade-insecure-requests" />

:::
::: info 🏷️ 值类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.global?.upgrade_insecure_requests`

:::

### instant.page 支持

::: info 🎯 用途

自动加载 instant.page 脚本，预加载链接以提升页面加载速度。

:::
::: info 📂 配置项位置

全局 -> instant.page 支持

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/global#:~:text=instant.page 支持" />

:::
::: info 🏷️ 值类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.global?.is_instant_page_enable`

:::

### Mermaid 支持

::: info 🎯 用途

启用 Mermaid 图表渲染功能，支持在文章中绘制流程图、时序图等。

:::
::: info 📂 配置项位置

全局 -> Mermaid 支持

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/global#:~:text=Mermaid 支持" />

:::
::: info 🏷️ 值类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.global?.is_mermaid_enable`

:::
::: info ℹ️ 补充信息

启用后需要配置以下子项：

- Mermaid CSS 选择器（默认：`.content .mermaid`）
- Mermaid 脚本地址（默认：`https://registry.npmmirror.com/mermaid/11.4.1/files/dist/mermaid.esm.min.mjs`）
- Mermaid Config 属性（默认：`{ startOnLoad: false }`）

:::

### 多语言菜单支持

::: info 🎯 用途

启用多语言菜单支持，允许在菜单中显示不同语言的内容。

:::
::: info 📂 配置项位置

全局 -> 多语言菜单支持

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/global#:~:text=多语言菜单支持" />

:::
::: info 🏷️ 值类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.global?.is_i18n_menu_show`

:::
::: info ℹ️ 补充信息

具体使用方法请查看文档。

:::

### 仅允许使用指定域名访问

::: info 🎯 用途

防止站点被恶意镜像后的流量流失，仅允许白名单中的域名访问。

:::
::: info 📂 配置项位置

全局 -> 仅允许使用指定域名访问

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/global#:~:text=仅允许使用指定域名访问" />

:::
::: info 🏷️ 值类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.global?.anti_mirror_site`

:::
::: info ℹ️ 补充信息

启用后需要配置：

- 域名白名单列表（需要 Base64 编码）
- 目标链接（Base64 编码）
- 是否保留路径和查询参数

:::

## 总体样式

### 配色方案

::: info 🎯 用途

设置网站的整体配色方案，支持多种内置主题和自定义配色。

:::
::: info 📂 配置项位置

总体样式 -> 配色方案

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=配色方案" />

:::
::: info 🏷️ 值类型

对象

:::
::: info ⭐ 默认值

`{ theme: "auto", color-scheme: "auto" }`（跟随系统 - 绿）

:::
::: info 💡 示例值

- `{ theme: "light", color-scheme: "light" }`（浅色 - 绿）
- `{ theme: "dark", color-scheme: "dark" }`（暗色 - 绿）
- `{ theme: "light-blue", color-scheme: "light" }`（浅色 - 蓝）
- `{ theme: "dark-blue", color-scheme: "dark" }`（暗色 - 蓝）
- `{ theme: "gray", color-scheme: "light" }`（浅色 - 灰粉）
- `{ theme: "custom", color-scheme: "auto" }`（自定义配色）

:::
::: info 🧩 模板变量

`theme.config?.styles?.color_schema`

:::
::: info ℹ️ 补充信息

- 对于启用"浅色/深色模式切换按钮"的情况，这项决定了网站刚加载完成时的配色方案。
- 选择"自定义配色"时，需要配合"自定义配色方案识别码"使用。

:::

### 启用自定义字体文件

::: info 🎯 用途

使用上传的自定义字体文件替换默认字体。

:::
::: info 📂 配置项位置

总体样式 -> 启用自定义字体文件

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=启用自定义字体文件" />

:::
::: info 🏷️ 值类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.styles?.is_custom_font_files_enable`

:::
::: info ℹ️ 补充信息

启用后需要配置：

- 自定义字体文件：上传 .woff2/.woff/.ttf/.otf/.eot/.ttc/.otc/.sfnt 字体文件
- 字体名称：填写字体全名或 PostScript 名（如：My Custom Font Regular 或 MyCustomFont-Regular）

:::

### 字体大小

::: info 🎯 用途

设置网站的整体字体大小。

:::
::: info 📂 配置项位置

总体样式 -> 字体大小

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=字体大小" />

:::
::: info 🏷️ 值类型

字符串

:::
::: info ⭐ 默认值

`small`（小字体）

:::
::: info 💡 示例值

- `small`（小字体）
- `normal`（常规）
- `large`（大字体）

:::
::: info 🧩 模板变量

`theme.config?.styles?.text_size`

- 允许全部 CSS 长度单位。
- 如不开启"自定义内容区域最大宽度"，内容区域最大宽度会随着页面宽度变化而变化，但可能出现内容整体偏左的现象。
- 建议关闭"自定义内容区域最大宽度"的同时开启"内容区域最小宽度"和"自定义内容区域宽度属性"并保持默认值。

:::

### 页眉头像显示

::: info 🎯 用途

控制是否在页眉显示头像。

:::
::: info 📂 配置项位置

总体样式 -> 是否显示页眉头像

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=是否显示页眉头像" />

:::
::: info 🏷️ 值类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.styles?.is_show_header_icon`

:::

### 为三级标题添加下划线

::: info 🎯 用途

在三级标题（h3）下方显示下划线装饰，让标题更加突出。

:::
::: info 📂 配置项位置

总体样式 -> 为三级标题添加下划线

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=为三级标题添加下划线" />

:::
::: info 🏷️ 值类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.styles?.is_h3_underline`

:::

### 引用块保留空行

::: info 🎯 用途

在引用块中保留空行，否则将自动删除引用块中的空行。

:::
::: info 📂 配置项位置

总体样式 -> 引用块保留空行

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=引用块保留空行" />

:::
::: info 🏷️ 值类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.styles?.is_preserve_empty_lines_in_blockquote`

:::
::: info ℹ️ 补充信息

引用块在 Markdown 中使用 `>` 表示。

:::

### 引用块前添加引号

::: info 🎯 用途

在引用块前添加引号。

:::
::: info 📂 配置项位置

总体样式 -> 引用块前添加引号

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=引用块前添加引号" />

:::
::: info 🏷️ 值类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.styles?.is_show_the_quote_before_blockquote`

:::

### 引用块后添加引号

::: info 🎯 用途

在引用块后添加引号。

:::
::: info 📂 配置项位置

总体样式 -> 引用块后添加引号

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=引用块后添加引号" />

:::
::: info 🏷️ 值类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.styles?.is_show_the_quote_after_blockquote`

:::

### 表格每行底部的表格线

::: info 🎯 用途

为表格每行底部添加表格线（除去表头）。

:::
::: info 📂 配置项位置

总体样式 -> 表格每行底部的表格线（除去表头）

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=表格每行底部的表格线" />

:::
::: info 🏷️ 值类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.styles?.is_show_the_table_bottom_border`

:::

### 标题上边距倍率

::: info 🎯 用途

设置标题（h1, h2 等）的上边距倍率。

:::
::: info 📂 配置项位置

总体样式 -> 标题上边距倍率

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=标题上边距倍率" />

:::
::: info 🏷️ 值类型

浮点数

:::
::: info ⭐ 默认值

`1`

:::
::: info 💡 示例值

`0.5`、`1`、`1.5`、`2`

:::
::: info 🔒 内部约束

值范围为 0-5

:::
::: info 🧩 模板变量

`theme.config?.styles?.heading_margin_top_multiplier`

:::
::: info ℹ️ 补充信息

值为 1 表示使用默认边距，小于 1 减小边距，大于 1 增加边距。

:::

### 标题下边距倍率

::: info 🎯 用途

设置标题（h1, h2 等）的下边距倍率。

:::
::: info 📂 配置项位置

总体样式 -> 标题下边距倍率

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=标题下边距倍率" />

:::
::: info 🏷️ 值类型

浮点数

:::
::: info ⭐ 默认值

`1`

:::
::: info 💡 示例值

`0.5`、`1`、`1.5`、`2`

:::
::: info 🔒 内部约束

值范围为 0-5

:::
::: info 🧩 模板变量

`theme.config?.styles?.heading_margin_bottom_multiplier`

:::

### 段落上边距倍率

::: info 🎯 用途

设置段落（p 标签）的上边距倍率。

:::
::: info 📂 配置项位置

总体样式 -> 段落上边距倍率

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=段落上边距倍率" />

:::
::: info 🏷️ 值类型

浮点数

:::
::: info ⭐ 默认值

`1`

:::
::: info 💡 示例值

`0.5`、`1`、`1.5`、`2`

:::
::: info 🔒 内部约束

值范围为 0-5

:::
::: info 🧩 模板变量

`theme.config?.styles?.paragraph_margin_top_multiplier`

:::

### 段落下边距倍率

::: info 🎯 用途

设置段落（p 标签）的下边距倍率。

:::
::: info 📂 配置项位置

总体样式 -> 段落下边距倍率

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=段落下边距倍率" />

:::
::: info 🏷️ 值类型

浮点数

:::
::: info ⭐ 默认值

`1`

:::
::: info 💡 示例值

`0.5`、`1`、`1.5`、`2`

:::
::: info 🔒 内部约束

值范围为 0-5

:::
::: info 🧩 模板变量

`theme.config?.styles?.paragraph_margin_bottom_multiplier`

:::

## 首页样式

### 主页 HTML 标题

::: info 🎯 用途

自定义主页的 HTML 标题（显示在浏览器标签页上）。

:::
::: info 📂 配置项位置

首页样式 -> 主页 HTML 标题

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=主页 HTML 标题" />

:::
::: info 🏷️ 值类型

字符串

:::
::: info ⭐ 默认值

空（使用站点标题）

:::
::: info 🧩 模板变量

`theme.config?.index_styles?.page_html_title`

:::
::: info ℹ️ 补充信息

如置空则取值自"Halo 设置 - 基本设置 - 站点标题"。

:::

### 一言 (hitokoto)

::: info 🎯 用途

在首页显示一言（随机句子）服务的内容。

:::
::: info 📂 配置项位置

首页样式 -> 一言 (hitokoto)

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=一言 (hitokoto)" />

:::
::: info 🏷️ 值类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.index_styles?.hitokoto`

:::
::: info ℹ️ 补充信息

启用后可以配置一言链接，默认为 `https://v1.hitokoto.cn/?encode=js`。

:::

### 个人简介/公告栏

::: info 🎯 用途

在首页显示个人简介或公告栏内容。

:::
::: info 📂 配置项位置

首页样式 -> 个人简介/公告栏

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=个人简介/公告栏" />

:::
::: info 🏷️ 值类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.index_styles?.is_resume_show`

:::
::: info ℹ️ 补充信息

启用后可以填写公告栏内容（支持 HTML 代码块），并支持多语言配置。

:::

### 社交资料图标左侧文字

::: info 🎯 用途

控制是否显示社交资料图标左侧的"Find me on"等文字。

:::
::: info 📂 配置项位置

首页样式 -> 社交资料图标左侧文字

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=社交资料图标左侧文字" />

:::
::: info 🏷️ 值类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.index_styles?.is_show_find_me_left_text`

:::

### 首页文章列表标题

::: info 🎯 用途

控制是否显示首页文章列表的标题。

:::
::: info 📂 配置项位置

首页样式 -> 首页文章列表标题

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=首页文章列表标题" />

:::
::: info 🏷️ 值类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.index_styles?.is_show_index_post_list_title`

:::

### 主页列表布局

::: info 🎯 用途

选择首页的文章列表显示样式。

:::
::: info 📂 配置项位置

首页样式 -> 主页列表布局

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=主页列表布局" />

:::
::: info 🏷️ 值类型

字符串

:::
::: info ⭐ 默认值

`simple-post-list`（简洁文章列表）

:::
::: info 💡 示例值

- `simple-post-list`（简洁文章列表）
- `post-list-summary`（多元文章列表）
- `moment-list-summary`（瞬间列表）

:::
::: info 🧩 模板变量

`theme.config?.index_styles?.list_layout`

:::
::: info ℹ️ 补充信息

"瞬间列表"需要"瞬间"插件启用方可正常使用。根据选择的布局类型，会显示不同的配置选项（如简洁列表的阅读量显示、多元列表的分类标签等）。

:::

### 文章列表置顶图标

::: info 🎯 用途

在文章列表中为置顶文章显示特殊图标。

:::
::: info 📂 配置项位置

首页样式 -> 文章列表置顶图标

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=文章列表置顶图标" />

:::
::: info 🏷️ 值类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.index_styles?.is_pin_icon_show`

:::
::: info ℹ️ 补充信息

启用后可以配置置顶图标的位置（标题左侧或右侧），默认为右侧。

:::

## 文章页样式

### 文章标题大写

::: info 🎯 用途

将文章标题转换为大写字母显示。

:::
::: info 📂 配置项位置

文章页样式 -> 文章标题大写

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=文章标题大写" />

:::
::: info 🏷️ 值类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.post_styles?.post_title_uppper`

:::

### 文章发布时间

::: info 🎯 用途

在文章页面显示文章的发布时间。

:::
::: info 📂 配置项位置

文章页样式 -> 文章发布时间

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=文章发布时间" />

:::
::: info 🏷️ 值类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.post_styles?.is_show_post_publish_time`

:::

### 显示文章阅读量

::: info 🎯 用途

在文章页面显示文章的阅读量统计。

:::
::: info 📂 配置项位置

文章页样式 -> 显示文章阅读量

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=显示文章阅读量" />

:::
::: info 🏷️ 值类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.post_styles?.is_show_post_views`

:::

### 文章评论区

::: info 🎯 用途

控制是否在文章页面显示评论区。

:::
::: info 📂 配置项位置

文章页样式 -> 文章评论区

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=文章评论区" />

:::
::: info 🏷️ 值类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.post_styles?.is_post_comment_section_show`

:::

### 优化文章段落空行显示

::: info 🎯 用途

为文章内容段落添加最小高度，改善空行显示效果。

:::
::: info 📂 配置项位置

文章页样式 -> 优化文章段落空行显示

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=优化文章段落空行显示" />

:::
::: info 🏷️ 值类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.post_styles?.is_optimize_content_paragraph_spacing`

:::

### 文章更新时间

::: info 🎯 用途

在文章页面显示文章的最后更新时间。

:::
::: info 📂 配置项位置

文章页样式 -> 文章更新时间

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=文章更新时间" />

:::
::: info 🏷️ 值类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.post_styles?.is_show_post_updated_time`

:::

### 文章预计阅读时间

::: info 🎯 用途

显示根据文章字数估算的阅读时间。

:::
::: info 📂 配置项位置

文章页样式 -> 文章预计阅读时间

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=文章预计阅读时间" />

:::
::: info 🏷️ 值类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.post_styles?.is_show_post_estimated_reading_time`

:::

### 文章字数统计

::: info 🎯 用途

显示文章的总字数。

:::
::: info 📂 配置项位置

文章页样式 -> 文章字数统计

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=文章字数统计" />

:::
::: info 🏷️ 值类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.post_styles?.is_show_post_word_count`

:::

### 移动端底部导航栏

::: info 🎯 用途

在移动端显示底部导航栏，方便快速访问常用功能。

:::
::: info 📂 配置项位置

文章页样式 -> 移动端底部导航栏

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=移动端底部导航栏" />

:::
::: info 🏷️ 值类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.post_styles?.is_show_footer_nav`

:::

## 分类集合页样式

### 显示每个分类下的文章数量

::: info 🎯 用途

在分类列表中显示每个分类包含的文章数量。

:::
::: info 📂 配置项位置

分类集合页样式 -> 是否显示每个分类下的文章数量

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/categories_page_styles#:~:text=是否显示每个分类下的文章数量" />

:::
::: info 🏷️ 值类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.categories_page_styles?.is_show_the_number_of_articles_per_category`

:::

### 显示多层分类

::: info 🎯 用途

在分类页面展示多层级的分类结构。

:::
::: info 📂 配置项位置

分类集合页样式 -> 是否显示多层分类

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/categories_page_styles#:~:text=是否显示多层分类" />

:::
::: info 🏷️ 值类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.categories_page_styles?.is_show_multi_layer_categories`

:::

## 分类详情页样式

### 显示分类 RSS 订阅按钮

::: info 🎯 用途

在分类详情页显示 RSS 订阅按钮。

:::
::: info 📂 配置项位置

分类详情页样式 -> 显示 RSS 订阅按钮

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/category_page_styles#:~:text=显示 RSS 订阅按钮" />

:::
::: info 🏷️ 值类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.category_page_styles?.is_show_rss_button`

:::
::: info ⚠️ 外部约束

需启用 [RSS 插件](https://www.halo.run/store/apps/app-KhIVw)。

:::

## 标签集合页样式

### 标签排序方式

::: info 🎯 用途

设置标签在标签集合页的排序方式。

:::
::: info 📂 配置项位置

标签集合页样式 -> 标签排序方式

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/tags_page_styles#:~:text=标签排序方式" />

:::
::: info 🏷️ 值类型

字符串

:::
::: info ⭐ 默认值

`default`

:::
::: info 💡 示例值

- `default`（默认）
- `count_desc`（按文章数量从多到少）
- `count_asc`（按文章数量从少到多）
- `name_asc`（按名称升序）
- `name_desc`（按名称降序）

:::
::: info 🧩 模板变量

`theme.config?.tags_page_styles?.tags_sort_order`

:::

## 标签详情页样式

### 显示标签 RSS 订阅按钮

::: info 🎯 用途

在标签详情页显示 RSS 订阅按钮。

:::
::: info 📂 配置项位置

标签详情页样式 -> 显示 RSS 订阅按钮

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/tag_page_styles#:~:text=显示 RSS 订阅按钮" />

:::
::: info 🏷️ 值类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.tag_page_styles?.is_show_rss_button`

:::
::: info ⚠️ 外部约束

需启用 [RSS 插件](https://www.halo.run/store/apps/app-KhIVw)。

:::

## 作者详情页样式

### 显示作者 RSS 订阅按钮

::: info 🎯 用途

在作者详情页显示 RSS 订阅按钮。

:::
::: info 📂 配置项位置

作者详情页样式 -> 显示 RSS 订阅按钮

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/author_page_styles#:~:text=显示 RSS 订阅按钮" />

:::
::: info 🏷️ 值类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.author_page_styles?.is_show_rss_button`

:::
::: info ⚠️ 外部约束

需启用 [RSS 插件](https://www.halo.run/store/apps/app-KhIVw)。

:::

## 归档页样式

### 按照发布年份和月份折叠文章列表

::: info 🎯 用途

在归档页面中，按照文章发布的年份和月份将文章列表折叠显示。

:::
::: info 📂 配置项位置

归档页样式 -> 按照发布年份和月份折叠文章列表

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/archives_page_styles#:~:text=按照发布年份和月份折叠文章列表" />

:::
::: info 🏷️ 值类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.archives_page_styles?.is_collapse_post_list_by_publication_year_and_month`

:::
::: info ℹ️ 补充信息

启用后可以配置展开折叠动画时长（单位：毫秒），默认为 200ms。

:::

## 自定义页面样式

### 启用类文章页样式

::: info 🎯 用途

让自定义页面使用类似文章页的布局和样式。

:::
::: info 📂 配置项位置

自定义页面样式 -> 启用类文章页样式

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/custom_page_styles#:~:text=启用类文章页样式" />

:::
::: info 🏷️ 值类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.custom_page_styles?.is_enable_post_like_layout`

:::

## 相册页样式

### 图片圆角宽度

::: info 🎯 用途

设置相册页面中图片的圆角宽度。

:::
::: info 📂 配置项位置

相册页样式 -> 图片圆角宽度

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/photos_styles#:~:text=图片圆角宽度" />

:::
::: info 🏷️ 值类型

字符串（CSS 长度值）

:::
::: info ⭐ 默认值

`8px`

:::
::: info 💡 示例值

`0px`、`5px`、`10%`、`1rem`

:::
::: info 🧩 模板变量

`theme.config?.photos_styles?.img_border_radius`

:::

### 启用瀑布流布局

::: info 🎯 用途

在相册页面使用瀑布流布局展示图片。

:::
::: info 📂 配置项位置

相册页样式 -> 是否启用瀑布流布局

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/photos_styles#:~:text=是否启用瀑布流布局" />

:::
::: info 🏷️ 值类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.photos_styles?.is_enable_masonry_layout`

:::

## 瞬间页样式

### 瞬间页点赞按钮

::: info 🎯 用途

在瞬间页面显示点赞按钮。

:::
::: info 📂 配置项位置

瞬间页样式 -> 是否启用点赞按钮

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/moments_styles#:~:text=是否启用点赞按钮" />

:::
::: info 🏷️ 值类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.moments_styles?.is_moment_upvote_button_show`

:::

### 瞬间页评论区

::: info 🎯 用途

控制是否在瞬间页面显示评论区。

:::
::: info 📂 配置项位置

瞬间页样式 -> 是否启用评论区

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/moments_styles#:~:text=是否启用评论区" />

:::
::: info 🏷️ 值类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.moments_styles?.is_moment_comment_section_show`

:::

## 错误页样式

### 页面自动重定向

::: info 🎯 用途

在错误页面（如 404）自动跳转到指定页面。

:::
::: info 📂 配置项位置

错误页样式 -> 页面自动重定向

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/error_page_styles#:~:text=页面自动重定向" />

:::
::: info 🏷️ 值类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.error_page_styles?.is_auto_redirect`

:::
::: info ℹ️ 补充信息

启用后可以配置跳转目标链接（默认为 `/`）和跳转等待时间（默认为 5 秒）。

:::

## 社交资料/RSS

### 首页社交资料展示

::: info 🎯 用途

在首页展示社交媒体链接和 RSS 订阅等资料。

:::
::: info 📂 配置项位置

社交资料/RSS -> 首页社交资料展示

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/sns#:~:text=首页社交资料展示" />

:::
::: info 🏷️ 值类型

数组（可重复添加多个社交资料）

:::
::: info ⭐ 默认值

空数组 `[]`

:::
::: info 🧩 模板变量

`theme.config?.sns?.index_sns`

:::
::: info ℹ️ 补充信息

- 支持多种预设社交平台：RSS、BiliBili、Dribbble、Email、Facebook、GitHub、Instagram、QQ、Reddit、Stack Overflow、Telegram、X（Twitter）、YouTube、豆瓣、网易云音乐、微博、知乎等
- 支持自定义社交资料
- 支持纯文本显示
- 可通过"设定自定义资料"配置自己的社交平台

:::

### 设定自定义资料

::: info 🎯 用途

定义自己的社交资料，用于在首页社交资料展示中使用。

:::
::: info 📂 配置项位置

社交资料/RSS -> 设定自定义资料

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/sns#:~:text=设定自定义资料" />

:::
::: info 🏷️ 值类型

数组（可重复添加多个自定义资料）

:::
::: info ⭐ 默认值

空数组 `[]`

:::
::: info 🧩 模板变量

`theme.config?.sns?.custom_sns`

:::
::: info ℹ️ 补充信息

每个自定义资料需要配置：

- 识别码：任意字母、数字、下划线组合（如 `myBlog`）
- 链接：完整的 URL（如 `https://example.com`）
- 图标：图标代码（可从 [Iconify](https://icon-sets.iconify.design/) 查找）
- aria-label：无障碍标签（如 `Find me on my blog`）

:::

## 自定义分享按钮

### 分享按钮设置

::: info 🎯 用途

配置文章页面的分享按钮列表，支持多种分享方式。

:::
::: info 📂 配置项位置

自定义分享按钮 -> 分享按钮设置

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/share#:~:text=分享按钮设置" />

:::
::: info 🏷️ 值类型

数组（可重复添加多个分享按钮）

:::
::: info ⭐ 默认值

包含多个预设分享按钮：E-mail、QRCode、Native、Facebook、X、LinkedIn、Pinterest、Telegram、QQ、Weibo、WeChat、Qzone、Douban

:::
::: info 🧩 模板变量

`theme.config?.share?.share_menu_config`

:::
::: info ℹ️ 补充信息

- `@URL` 和 `@TITLE` 是占位符，使用时会被替换为页面实际地址和标题
- 每个分享按钮需要配置：名称、链接、图标、aria-label
- 可以自由调整顺序、删除或新增分享按钮

:::
