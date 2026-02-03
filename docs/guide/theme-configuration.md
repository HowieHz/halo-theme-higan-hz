---
outline: deep
---

<!-- markdownlint-disable MD033 -->

# 主题配置项

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
  const ariaLabel = props.ariaLabel ?? label
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

::: info 🏷️ 类型

此配置项的值类型。

::: tip 以下举例几个常见类型

- 字符串：一串字符，如 `abc123`、`zh-CN`。
- 整数：整数，如 `-1`、`0`、`100`。
- 浮点数：带小数点的数，如 `1.2`、`0.3`、`4.5`。
- 布尔值：`true` 或 `false`。实际配置项体现为一个开关，打开就是 `true`，关闭就是 `false`。
- 选项：提供了固定选项，直接选择即可。
- 重复器：可重复一组输入。可增加组，移除组，交换任意组顺序。
- 代码输入框（编程语言）：提供一个多行的代码输入框，会按照指定编程语言进行高亮。
- 附件：选择上传的附件。
- 图标：使用 Halo CMS 提供的图标设置框，你可在其中选择任意 [iconify](https://icon-sets.iconify.design/) 图标。

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
::: info 🏷️ 类型

字符串

:::
::: info ⭐ 默认值

`zh`

:::
::: info 💡 示例值

`zh`、`zh-CN`、`zh-Hans`、`en`、`en-US`

:::
::: info ⚠️ 外部约束

设定值需满足 [BCP 47](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Global_attributes/lang#:~:text=%E5%A6%82%E6%9E%9C%E6%A0%87%E7%AD%BE%E5%86%85%E5%AE%B9%E6%98%AF%E6%97%A0%E6%95%88%E7%9A%84%EF%BC%8C%E6%A0%B9%E6%8D%AE%20BCP47%EF%BC%8C%E5%AE%83%E5%B0%B1%E8%AE%BE%E4%B8%BA%E6%97%A0%E6%95%88%E3%80%82)，否则无效。

:::
::: info 🧩 模板变量

`theme.config?.global?.default_page_language`

:::
::: info ℹ️ 补充信息

- 安全性：设定的语言值的会自动转义，无需担心 XSS 注入攻击。
- 设定优先级：请查阅[页面语言设定优先级](/reference/faq#页面语言设定优先级)。

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
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.global?.is_i18n_prefix_match_mode`

:::
::: info ℹ️ 补充信息

具体使用方法请参考[前缀匹配模式说明](/tutorial/i18n.md#前缀匹配模式说明)。

:::

### 浏览器按语言自动跳转

::: info 🎯 用途

根据浏览器的语言设置，自动跳转到对应语言的页面。

:::
::: info 📂 配置项位置

全局 -> 浏览器按语言自动跳转

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/global#:~:text=浏览器按语言自动跳转" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.global?.is_auto_redirect_to_browser_language`

:::
::: info ℹ️ 补充信息

启用此项后，若浏览器语言与默认页面语言不同，且浏览器语言存在于[允许跳转的目标区域语言代码列表](#允许跳转的目标区域语言代码列表)，将自动跳转到对应页面。

启用后请参照[浏览器按语言自动跳转使用指南](/tutorial/i18n#浏览器按语言自动跳转使用指南)进行配置。

启用后可配置：

- [允许跳转的目标区域语言代码列表](#允许跳转的目标区域语言代码列表)

:::

### 允许跳转的目标区域语言代码列表

::: info 🎯 用途

设定允许的自动跳转目标语言。

:::
::: info 📂 配置项位置

（[全局 -> 浏览器按语言自动跳转](#浏览器按语言自动跳转)启用时显示）

全局 -> 允许跳转的目标区域语言代码列表

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/global#:~:text=允许跳转的目标区域语言代码列表" />

:::
::: info 🏷️ 类型

重复器

:::
::: info ⭐ 默认值

空

:::

> [!NOTE] 💡 示例值
>
> ::: tip 📂 配置项名
>
> 语言代码
>
> :::
> ::: info 🏷️ 类型
>
> 字符串
>
> :::
> ::: info ⭐ 默认值
>
> `zh`
>
> :::
> ::: info 💡 示例值
>
> `zh`、`zh-CN`、`zh-Hans`、`en`、`en-US`
>
> :::
> ::: info 🔒 内部约束
>
> 必填项
>
> :::
> ::: info ⚠️ 外部约束
>
> 设定值需满足 [BCP 47](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Global_attributes/lang#:~:text=%E5%A6%82%E6%9E%9C%E6%A0%87%E7%AD%BE%E5%86%85%E5%AE%B9%E6%98%AF%E6%97%A0%E6%95%88%E7%9A%84%EF%BC%8C%E6%A0%B9%E6%8D%AE%20BCP47%EF%BC%8C%E5%AE%83%E5%B0%B1%E8%AE%BE%E4%B8%BA%E6%97%A0%E6%95%88%E3%80%82)，否则无效。
>
> :::

::: info 🧩 模板变量

`theme.config?.global?.auto_redirect_target_language_list`

:::
::: info ℹ️ 补充信息

启用[浏览器按语言自动跳转](#浏览器按语言自动跳转)后，若浏览器语言与默认页面语言不同，且浏览器语言存在于此项，将自动跳转到对应页面。

请参照[浏览器按语言自动跳转使用指南](/tutorial/i18n#浏览器按语言自动跳转使用指南)进行配置。

匹配顺序从上到下。

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
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.global?.is_i18n_menu_show`

:::
::: info ℹ️ 补充信息

启用后请参照[多语言菜单使用指南](/tutorial/i18n#多语言菜单使用指南)进行配置。

:::

### CSP:upgrade-insecure-requests

::: info 🎯 用途

自动将非跳转的不安全资源请求升级到 HTTPS，包括当前域名以及第三方请求。

:::
::: info 📂 配置项位置

全局 -> CSP:upgrade-insecure-requests

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/global#:~:text=CSP%3Aupgrade%2Dinsecure%2Drequests" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.global?.upgrade_insecure_requests`

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
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.global?.anti_mirror_site`

:::
::: info ℹ️ 补充信息

启用后请参照[开启仅允许使用指定域名访问](/tutorial/security#开启仅允许使用指定域名访问)进行配置。

启用后可配置：

- [域名白名单列表](#域名白名单列表)
- [目标链接](#目标链接)
- [跳转后是否保留路径和查询参数](#跳转后是否保留路径和查询参数)

:::

### 域名白名单列表

::: info 🎯 用途

设定域名白名单列表。

:::
::: info 📂 配置项位置

（[全局 -> 仅允许使用指定域名访问](#仅允许使用指定域名访问)启用时显示）

全局 -> 域名白名单列表

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/global#:~:text=域名白名单列表" />

:::
::: info 🏷️ 类型

重复器

:::
::: info ⭐ 默认值

空

:::

> [!NOTE] 💡 示例值
>
> ::: tip 📂 配置项名
>
> Base64 编码后的域名
>
> :::
> ::: info 🏷️ 类型
>
> 字符串
>
> :::
> ::: info 💡 示例值
>
> `bG9jYWxob3N0`
>
> :::
> ::: info 🔒 内部约束
>
> 必填项
>
> :::

::: info 🧩 模板变量

`theme.config?.global?.allow_site_whitelist`

:::
::: info ℹ️ 补充信息

请参照[开启仅允许使用指定域名访问](/tutorial/security#开启仅允许使用指定域名访问)进行配置。

:::

### 目标链接

::: info 🎯 用途

设定域名白名单列表。

:::
::: info 📂 配置项位置

（[全局 -> 仅允许使用指定域名访问](#仅允许使用指定域名访问)启用时显示）

全局 -> 目标链接

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/global#:~:text=目标链接" />

:::
::: info 🏷️ 类型

字符串

:::
::: info ⭐ 默认值

`bG9jYWxob3N0`

:::
::: info 💡 示例值

`bG9jYWxob3N0`

:::
::: info 🧩 模板变量

`theme.config?.global?.target_url`

:::
::: info ℹ️ 补充信息

请参照[开启仅允许使用指定域名访问](/tutorial/security#开启仅允许使用指定域名访问)进行配置。

:::

### 跳转后是否保留路径和查询参数

::: info 🎯 用途

设定跳转后是否保留路径和查询参数。

:::
::: info 📂 配置项位置

（[全局 -> 仅允许使用指定域名访问](#仅允许使用指定域名访问)启用时显示）

全局 -> 跳转后是否保留路径和查询参数

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/global#:~:text=跳转后是否保留路径和查询参数" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.global?.is_keep_path_and_query`

:::
::: info ℹ️ 补充信息

请参照[开启仅允许使用指定域名访问](/tutorial/security#开启仅允许使用指定域名访问)进行配置。

假设用户访问的链接为 `http://localhost/a/b?a=1`，[目标链接](#目标链接)设定为（Base 64 编码前）`https://p.com`：

- 关闭此项会跳转到：`https://p.com`
- 开启此项会跳转到：`https://p.com/a/b?a=1`

:::

### 自定义资源位置地址

::: info 🎯 用途

指定资源将使用自定义的资源位置地址，而不是主题默认的地址。

:::
::: info 📂 配置项位置

全局 -> 自定义资源位置地址

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/global#:~:text=自定义资源位置地址" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.global?.is_custom_resource_locations`

:::
::: info ℹ️ 补充信息

启用此项厚，如果启用下面的“instant.page 支持”、“Mermaid 支持”会显示对应的资源位置配置项。

:::

### instant.page 支持

::: info 🎯 用途

自动加载 instant.page 脚本，预加载链接以提升页面加载速度。

:::
::: info 📂 配置项位置

全局 -> instant.page 支持

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/global#:~:text=instant.page%20支持" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

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

<QuickJumpConfig to="/console/theme/settings/global#:~:text=Mermaid%20支持" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.global?.is_mermaid_enable`

:::
::: info ℹ️ 补充信息

图表可支持明暗切换，具体使用方法请看：[Mermaid 适配明暗主题切换](/guide/style-reference#mermaid-适配明暗主题切换)

启用后需要配置以下子项：

- Mermaid CSS 选择器（默认：`.content .mermaid`）
- Mermaid Config 属性（默认：`{ startOnLoad: false }`）

:::

## 总体样式

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
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.styles?.is_custom_font_files_enable`

:::
::: info ℹ️ 补充信息

启用后可配置：

- [自定义字体文件](#自定义字体文件)
- [自定义字体名称](#自定义字体名称)

:::

### 自定义字体文件

::: info 🎯 用途

用于选择上传的字体文件替换默认字体文件。支持 `.woff2`/`.woff`/`.ttf`/`.otf`/`.eot`/`.ttc`/`.otc`/`.sfnt` 格式的字体文件。

:::
::: info 📂 配置项位置

（[总体样式 -> 启用自定义字体文件](#启用自定义字体文件)启用时显示）

总体样式 -> 选择自定义字体文件

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=选择自定义字体文件" />

:::
::: info 🏷️ 类型

重复器

:::
::: info 🧩 模板变量

`theme.config?.styles?.custom_font_configs`

:::

### 自定义字体名称

::: info 🎯 用途

正确填写此项后，如果用户本地安装已经此字体，则应用本地版本。  
若此项置空，则即使用户本地已安装该字体，也不会使用本地版本，而是从网络下载字体文件。

:::
::: info 📂 配置项位置

（[总体样式 -> 启用自定义字体文件](#启用自定义字体文件)启用时显示）

总体样式 -> 自定义字体名称

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=自定义字体名称" />

:::
::: info 🏷️ 类型

字符串

:::
::: info ⭐ 默认值

空

:::
::: info 💡 示例值

`My Custom Font Regular`、`MyCustomFont-Regular`

:::
::: info 外部约束

对应字体文件内部声明的“字体全名 (`nameID=4`)”或“PostScript 名 (`nameID=6`)”。

:::
::: info 🧩 模板变量

`theme.config?.styles?.custom_font_name`

:::

### 启用自定义光标文件

::: info 🎯 用途

将使用上传的自定义光标替换默认光标组。

:::
::: info 📂 配置项位置

总体样式 -> 启用自定义光标文件

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=启用自定义光标文件" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.styles?.is_custom_cursor_files_enable`

:::

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
::: info 🏷️ 类型

选项

:::
::: info ⭐ 默认值

`暗色 - 绿`（内部值 `dark`）

:::
::: info 💡 其余选项

- `跟随系统 - 绿`（内部值 `auto`）
- `浅色 - 绿`（内部值 `light`）
- `跟随系统 - 蓝`（内部值 `auto-blue`）
- `浅色 - 蓝`（内部值 `light-blue`）
- `暗色 - 蓝`（内部值 `dark-blue`）
- `浅色 - 灰粉`（内部值 `gray`）
- `自定义配色`（内部值 `custom`）

:::
::: info 🧩 模板变量

`theme.config?.styles?.color_schema`

:::
::: info ℹ️ 补充信息

- 对于启用[深浅色模式切换按钮](#深浅色模式切换按钮)的情况，这项决定了网站刚加载完成时的默认配色方案。
- 选择"自定义配色"时，需要配合[自定义配色方案](#自定义配色方案)使用。

:::

### 自定义配色方案

::: info 🎯 用途

设置自定义配色方案。

:::
::: info 📂 配置项位置

总体样式 -> 自定义配色方案

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=自定义配色方案" />

:::
::: info 🏷️ 类型

重复器

:::
::: info ℹ️ 补充信息

使用方法请参考 [教程：自定义配色方案](/tutorial/custom-theme)

:::

> [!NOTE] ⭐ 默认值
>
> ::: tip 📂 配置项名
>
> 自定义配色方案识别码
>
> :::
> ::: info 🏷️ 类型
>
> 数字
>
> :::
> ::: info ⭐ 默认值
>
> `1`
>
> :::
> ::: info ℹ️ 补充信息
>
> 唯一识别码，请勿重复。
>
> :::
> ::: tip 📂 配置项名
>
> 主题色彩模式
>
> :::
> ::: info 🏷️ 类型
>
> 选项
>
> :::
> ::: info ⭐ 默认值
>
> `深色模式`（内部值 `dark`）
>
> :::
> ::: info 💡 其余选项
>
> - `浅色模式`（内部值 `light`）
> - `自动模式`（内部值 `auto`）
>
> :::
> ::: tip 📂 配置项名
>
> CSS 变量模式
>
> :::
> ::: info 🏷️ 类型
>
> 布尔值
>
> :::
> ::: info ⭐ 默认值
>
> `false`
>
> :::
> ::: info ℹ️ 补充信息
>
> 启用此项后，将使用 CSS 变量来定义配色方案。
>
> :::
> ::: tip 📂 配置项名
>
> CSS 原始输出模式
>
> :::
> ::: info 🏷️ 类型
>
> 布尔值
>
> :::
> ::: info ⭐ 默认值
>
> `false`
>
> :::
> ::: info ℹ️ 补充信息
>
> 关闭此项后，仅需填写自定义 CSS 变量的部分。  
> 输出时会自动输出在对应 CSS 选择器中（选择器为 `html[theme="theme-{识别码}"]`）。
>
> :::
> ::: tip 📂 配置项名
>
> 自定义 CSS 变量
>
> :::
> ::: info 🏷️ 类型
>
> 代码输入框（CSS）
>
> :::
> ::: info ⚠️ 外部约束
>
> 开启 `CSS 原始输出模式` 时，你填写的内容需要是合法的 CSS 代码。  
> 关闭 `CSS 原始输出模式` 时，以下内容需要是合法的 CSS 代码：
>
> ```css
> html[theme="theme-{识别码}"] {
>   /* 你填写的内容 */
> }
> ```
>
> :::
> ::: info ℹ️ 补充信息
>
> 以下是示例 CSS 变量：
>
> ```plaintext
> --color-accent: #d480aa
> --color-accent-content: #212326
> --color-base-100: #212326
> --color-base-200: #1c1c1c
> --color-base-300: #181818
> --color-base-content: #d5d7d8
> --color-neutral: #1d1f21
> --color-neutral-content: #d5d7d8
> --color-primary: #2bbc8a
> --color-primary-content: #212326
> --color-secondary: #ccffb6
> --color-secondary-content: #d5d7d8
> ```
>
> 以下是 `CSS 原始输出模式` 的一个示例：
>
> ```css
> html[theme="auto"] {
>   --color-accent: #d480aa;
>   --color-accent-content: #212326;
>   --color-base-100: #fafafa;
>   --color-base-200: #f5f5f5;
>   --color-base-300: #e4e4e4;
>   --color-base-content: #333;
>   --color-neutral: #1d1f21;
>   --color-neutral-content: #d5d7d8;
>   --color-primary: #b32959;
>   --color-primary-content: #212326;
>   --color-scrollbar: #aaa;
>   --color-secondary: #2bbc8a;
>   --color-secondary-content: #dddbd9;
> }
> @media (prefers-color-scheme: dark) {
>   html[theme="theme-1"] {
>     --color-accent: #d480aa;
>     --color-accent-content: #212326;
>     --color-base-100: #212326;
>     --color-base-200: #1c1c1c;
>     --color-base-300: #181818;
>     --color-base-content: #d5d7d8;
>     --color-neutral: #1d1f21;
>     --color-neutral-content: #d5d7d8;
>     --color-primary: #2bbc8a;
>     --color-primary-content: #212326;
>     --color-secondary: #ccffb6;
>     --color-secondary-content: #d5d7d8;
>   }
> }
> ```
>
> :::

### 深浅色模式切换按钮

::: info 🎯 用途

若启用此项，将在大标题旁显示明暗模式切换按钮。  
切换逻辑为：浅色模式 -> 深色模式 -> 自动模式 -> 浅色模式。

:::
::: info 📂 配置项位置

总体样式 -> 深浅色模式切换按钮

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=深浅色模式切换按钮" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.styles?.is_show_color_scheme_toggle_button`

:::
::: info ℹ️ 补充信息

“自动模式配色方案”选择与“浅色模式配色方案”相同即可禁用自动模式。  
切换逻辑将变为：浅色模式 -> 深色模式 -> 浅色模式。

启用后可配置：

- [自动模式配色方案](#自动模式配色方案)
- [浅色模式配色方案](#浅色模式配色方案)
- [深色模式配色方案](#深色模式配色方案)

相关说明：

[Mermaid 适配明暗主题切换](/guide/style-reference#mermaid-适配明暗主题切换)

:::

### 自动模式配色方案

::: info 🎯 用途

设置深浅色模式切换按钮中自动模式的配色方案。

:::
::: info 📂 配置项位置

（[总体样式 -> 深浅色模式切换按钮](#深浅色模式切换按钮)启用时显示）

总体样式 -> 自动模式配色方案

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=自动模式配色方案" />

:::
::: info 🏷️ 类型

选项

:::
::: info ⭐ 默认值

`跟随系统 - 绿`（内部值 `auto`）

:::
::: info 💡 其余选项

- `浅色 - 绿`（内部值 `light`）
- `暗色 - 绿`（内部值 `dark`）
- `跟随系统 - 蓝`（内部值 `auto-blue`）
- `浅色 - 蓝`（内部值 `light-blue`）
- `暗色 - 蓝`（内部值 `dark-blue`）
- `浅色 - 灰粉`（内部值 `gray`）
- `自定义配色`（内部值 `custom`）

:::
::: info 🧩 模板变量

`theme.config?.styles?.theme_auto`

:::
::: info ℹ️ 补充信息

选择“自定义配色”时，需要配合[自定义配色方案](#自定义配色方案)使用，并填写自定义配色方案识别码。

:::

### 浅色模式配色方案

::: info 🎯 用途

设置深浅色模式切换按钮中浅色模式的配色方案。

:::
::: info 📂 配置项位置

（[总体样式 -> 深浅色模式切换按钮](#深浅色模式切换按钮)启用时显示）

总体样式 -> 浅色模式配色方案

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=浅色模式配色方案" />

:::
::: info 🏷️ 类型

选项

:::
::: info ⭐ 默认值

`浅色 - 绿`（内部值 `light`）

:::
::: info 💡 其余选项

- `跟随系统 - 绿`（内部值 `auto`）
- `暗色 - 绿`（内部值 `dark`）
- `跟随系统 - 蓝`（内部值 `auto-blue`）
- `浅色 - 蓝`（内部值 `light-blue`）
- `暗色 - 蓝`（内部值 `dark-blue`）
- `浅色 - 灰粉`（内部值 `gray`）
- `自定义配色`（内部值 `custom`）

:::
::: info 🧩 模板变量

`theme.config?.styles?.theme_light`

:::
::: info ℹ️ 补充信息

选择"自定义配色"时，需要配合[自定义配色方案](#自定义配色方案)使用，并填写自定义配色方案识别码。

:::

### 深色模式配色方案

::: info 🎯 用途

设置深浅色模式切换按钮中深色模式的配色方案。

:::
::: info 📂 配置项位置

（[总体样式 -> 深浅色模式切换按钮](#深浅色模式切换按钮)启用时显示）

总体样式 -> 深色模式配色方案

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=深色模式配色方案" />

:::
::: info 🏷️ 类型

选项

:::
::: info ⭐ 默认值

`暗色 - 绿`（内部值 `dark`）

:::
::: info 💡 其余选项

- `跟随系统 - 绿`（内部值 `auto`）
- `浅色 - 绿`（内部值 `light`）
- `跟随系统 - 蓝`（内部值 `auto-blue`）
- `浅色 - 蓝`（内部值 `light-blue`）
- `暗色 - 蓝`（内部值 `dark-blue`）
- `浅色 - 灰粉`（内部值 `gray`）
- `自定义配色`（内部值 `custom`）

:::
::: info 🧩 模板变量

`theme.config?.styles?.theme_dark`

:::
::: info ℹ️ 补充信息

选择"自定义配色"时，需要配合[自定义配色方案](#自定义配色方案)使用，并填写自定义配色方案识别码。

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
::: info 🏷️ 类型

选项

:::
::: info ⭐ 默认值

`小字体`（内部值 `small`）

:::
::: info 💡 其余选项

- `常规`（内部值 `normal`）
- `大字体`（内部值 `large`）

:::
::: info 🧩 模板变量

`theme.config?.styles?.text_size`

:::

### 自定义内容区域最大宽度

::: info 🎯 用途

是否定义内容区域最大宽度。

:::
::: info 📂 配置项位置

总体样式 -> 自定义内容区域最大宽度

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=自定义内容区域最大宽度" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.styles?.is_max_width_settings`

:::
::: info ℹ️ 补充信息

若关闭此项，内容区域最大宽度会随着页面宽度变化而变化，但可能出现内容整体偏左的现象。  
若想关闭此项，建议开启"内容区域最小宽度"和"自定义内容区域宽度属性"。

启用后可配置：

- [内容区域最大宽度](#内容区域最大宽度)

:::

### 内容区域最大宽度

::: info 🎯 用途

设置内容区域的最大宽度。

:::
::: info 📂 配置项位置

（[总体样式 -> 自定义内容区域最大宽度](#自定义内容区域最大宽度)启用时显示）

总体样式 -> 内容区域最大宽度

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=内容区域最大宽度" />

:::
::: info 🏷️ 类型

字符串

:::
::: info ⭐ 默认值

`48rem`

:::
::: info 💡 示例值

`20rem`、`300px`、`30vw`

:::
::: info ⚠️ 外部约束

合法的 CSS 长度单位。

:::
::: info 🧩 模板变量

`theme.config?.styles?.max_width`

:::

### 自定义内容区域最小宽度

::: info 🎯 用途

是否定义内容区域最小宽度。

:::
::: info 📂 配置项位置

总体样式 -> 自定义内容区域最小宽度

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=自定义内容区域最小宽度" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.styles?.is_min_width_settings`

:::
::: info ℹ️ 补充信息

当窗口宽度小于此此设置宽度时，实际会使用窗口宽度。以避免出现横向滚动条。

启用后可配置：

- [内容区域最小宽度](#内容区域最小宽度)
- [强制应用内容区域最小宽度](#强制应用内容区域最小宽度)

:::

### 内容区域最小宽度

::: info 🎯 用途

设置内容区域的最小宽度。

:::
::: info 📂 配置项位置

（[总体样式 -> 自定义内容区域最小宽度](#自定义内容区域最小宽度)启用时显示）

总体样式 -> 内容区域最小宽度

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=内容区域最小宽度" />

:::
::: info 🏷️ 类型

字符串

:::
::: info ⭐ 默认值

`48rem`

:::
::: info 💡 示例值

`20rem`、`300px`、`30vw`

:::
::: info ⚠️ 外部约束

合法的 CSS 长度单位。

:::
::: info 🧩 模板变量

`theme.config?.styles?.min_width`

:::

### 强制应用内容区域最小宽度

::: info 🎯 用途

控制是否强制应用内容区域最小宽度。

:::
::: info 📂 配置项位置

（[总体样式 -> 自定义内容区域最小宽度](#自定义内容区域最小宽度)启用时显示）

总体样式 -> 强制应用内容区域最小宽度

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=强制应用内容区域最小宽度" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.styles?.is_force_min_width_settings`

:::
::: info ℹ️ 补充信息

- 禁用时：当窗口宽度小于设定的最小宽度时，实际会使用窗口宽度。以避免出现横向滚动条。
- 启用时：强制使内容显示区域不小于设定的最小宽度，即使出现横向滚动条。

:::

### 自定义内容区域宽度属性

::: info 🎯 用途

是否定义内容区域宽度属性。

:::
::: info 📂 配置项位置

总体样式 -> 自定义内容区域宽度属性

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=自定义内容区域宽度属性" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.styles?.is_content_width_style_settings`

:::
::: info ℹ️ 补充信息

启用后可配置：

- [内容区域宽度样式](#内容区域宽度样式)

:::

### 内容区域宽度样式

::: info 🎯 用途

决定内容区域宽度样式。

:::
::: info 📂 配置项位置

（[总体样式 -> 自定义内容区域宽度属性](/guide/theme-configuration#自定义内容区域宽度属性)启用时显示）

总体样式 -> 内容区域宽度样式

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=内容区域宽度样式" />

:::
::: info 🏷️ 类型

字符串

:::
::: info ⭐ 默认值

`fit-content`

:::
::: info 💡 示例值

`max-content`、`min-content`

:::
::: info ⚠️ 外部约束

符合[文档](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference/Properties/width#%E5%80%BC)对值的要求。

:::
::: info 🧩 模板变量

`theme.config?.styles?.content_width_style`

:::
::: info ℹ️ 补充信息

默认值效果为：使内容区域宽度等于最宽的内容的宽度。（此项实际是在设置内容区域的 `width` 属性对应的样式值）

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
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.styles?.is_show_header_icon`

:::
::: info ℹ️ 补充信息

启用后可配置：

- [自定义页眉头像](#自定义页眉头像)
- [圆形头像](#圆形头像)
- [灰度头像](#灰度头像)

:::

### 自定义页眉头像

::: info 🎯 用途

用于选择上传的图片作为页眉头像。未设置将使用默认头像 `/themes/howiehz-higan/images/logo.{avif,webp,png}`。

:::
::: info 📂 配置项位置

（[全局 -> 页眉头像显示](#页眉头像显示)启用时显示）

总体样式 -> 自定义页眉头像

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=自定义页眉头像" />

:::
::: info 🏷️ 类型

附件

:::
::: info 🧩 模板变量

`theme.config?.styles?.icon`

:::

### 圆形头像

::: info 🎯 用途

控制是否强制将头像裁切为圆形。

:::
::: info 📂 配置项位置

（[全局 -> 页眉头像显示](#页眉头像显示)启用时显示）

总体样式 -> 圆形头像

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=圆形头像" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.styles?.avatar_circle`

:::

### 灰度头像

::: info 🎯 用途

控制是否强制将头像以灰度处理。

:::
::: info 📂 配置项位置

（[全局 -> 页眉头像显示](#页眉头像显示)启用时显示）

总体样式 -> 灰度头像

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=灰度头像" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.styles?.avatar_grayout`

:::

### 额外菜单项

::: info 🎯 用途

控制是否在菜单显示额外菜单项。

:::
::: info 📂 配置项位置

总体样式 -> 额外菜单项

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=额外菜单项" />

:::
::: info 🏷️ 类型

重复器

:::
::: info ⭐ 默认值

包含一个预设：搜索（需[搜索组件插件](/guide/plugin-compatibility#搜索组件)）。

:::

> [!NOTE] 💡 示例值
>
> ::: tip 📂 配置项名
>
> 菜单项类型
>
> :::
> ::: info 🏷️ 类型
>
> 选项
>
> :::
> ::: info ⭐ 默认值
>
> 搜索（需[搜索组件插件](/guide/plugin-compatibility#搜索组件)）（内部值 `search`）
>
> :::
> ::: info 💡 其余选项
>
> - 随机文章（内部值 `random`）
> - 用户账号（内部值 `user`）
>
> :::
> ::: info 🔒 内部约束
>
> 必填项
>
> :::
> ::: info ℹ️ 补充信息
>
> 对于`用户账号`类型：
>
> - 未登录时，菜单显示 `登录`，点击后跳转 `/login` 页面。
> - 已登录时，菜单显示用户名，点击后跳转 `/uc` 页面。
>
> :::

::: info 🧩 模板变量

`theme.config?.styles?.extra_menu_items`

:::

### 显示页眉菜单

::: info 🎯 用途

控制是否显示页眉菜单。

:::
::: info 📂 配置项位置

总体样式 -> 显示页眉菜单

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=显示页眉菜单" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.styles?.is_show_header_menu`

:::

### 显示页码

::: info 🎯 用途

控制是否显示页码。

:::
::: info 📂 配置项位置

总体样式 -> 显示页码

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=显示页码" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.styles?.is_show_page_number`

:::

### 页面底部站点统计信息

::: info 🎯 用途

控制是否显示页面底部站点统计信息。

:::
::: info 📂 配置项位置

总体样式 -> 页面底部站点统计信息

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=页面底部站点统计信息" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.styles?.is_footer_site_stats_show`

:::
::: info ℹ️ 补充信息

启用后可配置：

- [统计项设置](#统计项设置)

:::

### 统计项设置

::: info 🎯 用途

设定统计项。

:::
::: info 📂 配置项位置

（[首页样式 -> 页面底部站点统计信息](#页面底部站点统计信息)启用时显示）

总体样式 -> 统计项设置

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/global#:~:text=统计项设置" />

:::
::: info 🏷️ 类型

重复器

:::
::: info ⭐ 默认值

包含多个预设分享按钮：总阅读量、总文章数、总点赞数、总评论数、总分类数、总字数（需[API 扩展包插件](/guide/plugin-compatibility#api-扩展包)）。

:::

> [!NOTE] 💡 示例值
>
> ::: tip 📂 配置项名
>
> 统计项
>
> :::
> ::: info 🏷️ 类型
>
> 选项
>
> :::
> ::: info ⭐ 默认值
>
> 总阅读量（内部值 `visit`）
>
> :::
> ::: info 💡 其余选项
>
> - 总文章数（内部值 `post`）
> - 总点赞数（内部值 `upvote`）
> - 总评论数（内部值 `comment`）
> - 总分类数（内部值 `category`）
> - 总字数（内部值 `wordcount`）
>
> :::
> ::: info 🔒 内部约束
>
> 必填项
>
> :::
> ::: tip 📂 配置项名
>
> 多语言文本包裹数字
>
> :::
> ::: info 🏷️ 类型
>
> 布尔值
>
> :::
> ::: info ⭐ 默认值
>
> `true`
>
> :::
> ::: tip 📂 配置项名
>
> 文字左侧的图标
>
> :::
> ::: info 🏷️ 类型
>
> 图标
>
> :::
> ::: info ⭐ 默认值
>
> 空
>
> :::

### 页面底部主题信息

::: info 🎯 用途

控制是否显示页面底部主题信息。

:::
::: info 📂 配置项位置

总体样式 -> 页面底部主题信息

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=页面底部主题信息" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.styles?.is_footer_theme_info_show`

:::
::: info ℹ️ 补充信息

启用后可配置：

- [页面底部主题信息所展示的主题名](#页面底部主题信息所展示的主题名)
- [页面底部主题信息所展示的 Halo 版本](#页面底部主题信息所展示的-halo-版本)

:::

#### 页面底部主题信息所展示的主题名

::: info 🎯 用途

设定页面底部主题信息所展示的主题名。

:::
::: info 📂 配置项位置

（[总体样式 -> 页面底部主题信息](#页面底部主题信息)启用时显示）

总体样式 -> 版权信息自定义署名

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=页面底部主题信息所展示的主题名" />

:::
::: info 🏷️ 类型

选项

:::
::: info ⭐ 默认值

Higan Haozi（内部值 `Higan Haozi`）

:::
::: info 💡 其余选项

- Higan（内部值 `Higan`）
- 彼岸（内部值 `彼岸`）

:::
::: info 🧩 模板变量

`theme.config?.styles?.footer_theme_info_theme_name`

:::

#### 页面底部主题信息所展示的 Halo 版本

::: info 🎯 用途

设定页面底部主题信息所展示的 Halo 版本。

:::
::: info 📂 配置项位置

（[总体样式 -> 页面底部主题信息](#页面底部主题信息)启用时显示）

总体样式 -> 页面底部主题信息所展示的 Halo 版本

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=页面底部主题信息所展示的%20Halo%20版本" />

:::
::: info 🏷️ 类型

选项

:::
::: info ⭐ 默认值

Halo（内部值 `Halo`）

:::
::: info 💡 其余选项

- Halo Pro（内部值 `Halo Pro`）
- Halo 专业版（内部值 `Halo 专业版`）

:::
::: info 🧩 模板变量

`theme.config?.styles?.footer_theme_info_halo_version_name`

:::

### 页面底部版权信息

::: info 🎯 用途

控制是否显示页面底部版权信息。

:::
::: info 📂 配置项位置

总体样式 -> 页面底部版权信息

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=页面底部版权信息" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.styles?.is_footer_copyright_show`

:::
::: info ℹ️ 补充信息

启用后可配置：

- [版权信息自定义署名](#版权信息自定义署名)

:::

#### 版权信息自定义署名

::: info 🎯 用途

设定页面底部版权信息的署名。

:::
::: info 📂 配置项位置

（[总体样式 -> 页面底部版权信息](#页面底部版权信息)启用时显示）

总体样式 -> 版权信息自定义署名

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=版权信息自定义署名" />

:::
::: info 🏷️ 类型

字符串

:::
::: info ⭐ 默认值

空

:::
::: info 💡 示例值

`HowieHz`

:::
::: info 🧩 模板变量

`theme.config?.styles?.footer_copyright_custom_name`

:::

### 强制页脚、页码在页面底部

::: info 🎯 用途

控制是否强制页脚、页码在页面底部。

:::
::: info 📂 配置项位置

总体样式 -> 强制页脚、页码在页面底部

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=强制页脚、页码在页面底部" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.styles?.is_footer_force_bottom`

:::

### 页面底部菜单

::: info 🎯 用途

控制是否显示页面底部菜单。

:::
::: info 📂 配置项位置

总体样式 -> 页面底部菜单

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=页面底部菜单" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.styles?.is_footer_menu_show`

:::

### 添加内容到页面最底部

::: info 🎯 用途

控制添加内容到页面最底部。

:::
::: info 📂 配置项位置

总体样式 -> 添加内容到页面最底部

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=添加内容到页面最底部" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.styles?.is_footer_content_show`

:::
::: info ℹ️ 补充信息

在 Halo CMS 的后台（<QuickJumpConfig to="/console/settings?tab=codeInjection:~:text=页脚" label="快速跳转" />）设定的页脚内容，显示位置在“主题信息”、“版权信息”、“底部菜单”之上。  
而此处填写页脚内容的在“底部菜单”之下，为页面的最底部。

启用后可配置：

- [页面最底部内容](#页面最底部内容)
- [多语言页面最底部内容支持](#多语言页面最底部内容支持)
  - [自定义多语言页面最底部内容](#自定义多语言页面最底部内容)

:::

#### 页面最底部内容

::: info 🎯 用途

设定页面最底部内容内容。

:::
::: info 📂 配置项位置

（[首页样式 -> 页面最底部内容](#页面最底部内容)启用时显示）

首页样式 -> 页面最底部内容

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=页面最底部内容" />

:::
::: info 🏷️ 类型

代码输入框（HTML）

:::
::: info ⭐ 默认值

空

:::
::: info 💡 示例值

```html
已经结束了！
```

HTML 代码也是可以的：

```html
<code>下面已经没有东西了</code>
```

:::
::: info ⚠️ 外部约束

合法的 HTML 代码。

:::
::: info 🧩 模板变量

`theme.config?.styles?.footer_content`

:::

#### 多语言页面最底部内容支持

::: info 🎯 用途

控制是否启用多语言页面最底部内容支持。

:::
::: info 📂 配置项位置

（[首页样式 -> 页面最底部内容](#页面最底部内容)启用时显示）

首页样式 -> 多语言页面最底部内容支持

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=多语言页面最底部内容支持" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.styles?.is_18n_footer_content_show`

:::
::: info ℹ️ 补充信息

启用后请参照[多语言页面最底部内容使用指南](/tutorial/i18n#多语言页面最底部内容使用指南)进行配置

:::

#### 自定义多语言页面最底部内容

::: info 🎯 用途

设定多语言页面最底部内容内容。

:::
::: info 📂 配置项位置

（[首页样式 -> 页面最底部内容](#页面最底部内容)启用时显示）

首页样式 -> 自定义多语言页面最底部内容

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=自定义多语言页面最底部内容" />

:::
::: info 🏷️ 类型

重复器

:::

> [!NOTE] ⭐ 默认值
>
> ::: tip 📂 配置项名
>
> 语言代码
>
> :::
> ::: info 🏷️ 类型
>
> 字符串
>
> :::
> ::: info ⭐ 默认值
>
> `zh`
>
> :::
> ::: info 💡 示例值
>
> `zh`、`zh-CN`、`zh-Hans`、`en`、`en-US`
>
> :::
> ::: info 🔒 内部约束
>
> 必填项
>
> :::
> ::: info ⚠️ 外部约束
>
> 设定值需满足 [BCP 47](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Global_attributes/lang#:~:text=%E5%A6%82%E6%9E%9C%E6%A0%87%E7%AD%BE%E5%86%85%E5%AE%B9%E6%98%AF%E6%97%A0%E6%95%88%E7%9A%84%EF%BC%8C%E6%A0%B9%E6%8D%AE%20BCP47%EF%BC%8C%E5%AE%83%E5%B0%B1%E8%AE%BE%E4%B8%BA%E6%97%A0%E6%95%88%E3%80%82)，否则无效。
>
> :::
> ::: tip 📂 配置项名
>
> 页面最底部内容
>
> :::
> ::: info 🏷️ 类型
>
> 代码输入框（HTML）
>
> :::
> ::: info ⭐ 默认值
>
> 空
>
> :::
> ::: info 💡 示例值
>
> ```html
> 已经结束了！
> ```
>
> HTML 代码也是可以的：
>
> ```html
> <code>下面已经没有东西了</code>
> ```
>
> :::
> ::: info ⚠️ 外部约束
>
> 合法的 HTML 代码。
>
> :::

::: info 🧩 模板变量

`theme.config?.styles?.i18n_footer_content`

:::

### 为三级标题添加下划线

::: info 🎯 用途

启用时，在三级标题（h3）下方显示下划线装饰，让标题更加突出。

:::
::: info 📂 配置项位置

总体样式 -> 为三级标题添加下划线

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=为三级标题添加下划线" />

:::
::: info 🏷️ 类型

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
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.styles?.is_preserve_empty_lines_in_blockquote`

:::
::: info ℹ️ 补充信息

引用块写法请参考[写作样式](/guide/style-reference#引用块)。

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
::: info 🏷️ 类型

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
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.styles?.is_show_the_quote_after_blockquote`

:::

### 表格行间线（除表头）

::: info 🎯 用途

是否为表格每行底部添加表格线（除表头）。

:::
::: info 📂 配置项位置

总体样式 -> 表格行间线（除表头）

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=表格行间线" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.styles?.is_show_the_table_bottom_border`

:::
::: info ℹ️ 补充信息

启用后可配置：

<!-- markdownlint-disable MD051 -->

- [表格行间线宽度（除表头）](#表格行间线宽度-除表头)
<!-- markdownlint-enable MD051 -->

:::

### 表格行间线宽度（除表头）

::: info 🎯 用途

设置表格每行底部添表格线的宽度（除表头）。

:::
::: info 📂 配置项位置

<!-- markdownlint-disable MD051 -->

（[总体样式 -> 表格行间线（除表头）](#表格行间线-除表头)启用时显示）

<!-- markdownlint-enable MD051 -->

总体样式 -> 表格行间线宽度（除表头）

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=表格行间线宽度" />

:::
::: info 🏷️ 类型

字符串

:::
::: info ⭐ 默认值

`8px`

:::
::: info 💡 示例值

`0px`、`5px`、`10%`、`1rem`

:::
::: info ⚠️ 外部约束

合法的 CSS 长度单位。

:::
::: info 🧩 模板变量

`theme.config?.styles?.table_bottom_border_width`

:::

### 标题上边距倍率

::: info 🎯 用途

设置[标题](/guide/style-reference#标题)的上边距 (`margin-top`) 倍率。

:::
::: info 📂 配置项位置

总体样式 -> 标题上边距倍率

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=标题上边距倍率" />

:::
::: info 🏷️ 类型

浮点数/整数

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

设置[标题](/guide/style-reference#标题)的下边距 (`margin-bottom`) 倍率。

:::
::: info 📂 配置项位置

总体样式 -> 标题下边距倍率

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=标题下边距倍率" />

:::
::: info 🏷️ 类型

浮点数/整数

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

设置[段落](/guide/style-reference#段落)的上边距倍率。

:::
::: info 📂 配置项位置

总体样式 -> 段落上边距倍率

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=段落上边距倍率" />

:::
::: info 🏷️ 类型

浮点数/整数

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

设置[段落](/guide/style-reference#段落)的下边距倍率。

:::
::: info 📂 配置项位置

总体样式 -> 段落下边距倍率

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=段落下边距倍率" />

:::
::: info 🏷️ 类型

浮点数/整数

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

应用范围：[`/(page/{page})`](</reference/template-map#:~:text=/(page/%7Bpage%7D)>)。

### 主页 HTML 标题

::: info 🎯 用途

自定义主页的 HTML 标题（会显示在浏览器标签页上）。

:::
::: info 📂 配置项位置

首页样式 -> 主页 HTML 标题

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=主页%20HTML%20标题" />

:::
::: info 🏷️ 类型

字符串

:::
::: info ⭐ 默认值

空

:::
::: info ⚠️ 外部约束

如果配置值过长，可能影响 SEO 和页面显示效果。

:::
::: info 🧩 模板变量

`theme.config?.index_styles?.page_html_title`

:::
::: info ℹ️ 补充信息

如置空则取值 Halo CMS 的后台（<QuickJumpConfig to="/console/settings:~:text=站点标题" label="快速跳转" />）设定的站点标题。

:::

### 一言（hitokoto）

::: info 🎯 用途

是否在首页显示一言（hitokoto）随机句子服务的内容。

:::
::: info 📂 配置项位置

首页样式 -> 一言（hitokoto）

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=一言（hitokoto）" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.index_styles?.hitokoto`

:::
::: info ℹ️ 补充信息

启用后可以配置

- 一言（hitokoto）服务链接：
  - 默认值：`https://v1.hitokoto.cn/?encode=js`
  - 补充说明：相关信息可阅读其[文档](https://developer.hitokoto.cn/sentence/)获取

:::

### 自定义随机显示一句话

::: info 🎯 用途

是否在首页随机显示一句话。

:::
::: info 📂 配置项位置

首页样式 -> 自定义随机显示一句话

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=自定义随机显示一句话" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.index_styles?.is_random_sentence_show`

:::
::: info ℹ️ 补充信息

启用后可以配置

- 自定义句子内容

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
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.index_styles?.is_resume_show`

:::
::: info ℹ️ 补充信息

启用后可以配置

- 个人简介/公告栏内容
- 多语言个人简介/公告栏支持
  - 自定义多语言公告栏内容

:::

#### 多语言个人简介/公告栏支持

::: info 🎯 用途

控制是否启用多语言个人简介/公告栏支持。

:::
::: info 📂 配置项位置

<!-- markdownlint-disable MD051 -->

（[首页样式 -> 个人简介/公告栏](#个人简介-公告栏)启用时显示）

<!-- markdownlint-enable MD051 -->

首页样式 -> 多语言个人简介/公告栏支持

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=多语言个人简介/公告栏支持" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.index_styles?.is_i18n_resume_show`

:::
::: info ℹ️ 补充信息

启用后请参照[多语言个人简介/公告栏使用指南](/tutorial/i18n#多语言个人简介-公告栏使用指南)进行配置

:::

#### 自定义多语言公告栏内容

::: info 🎯 用途

设定多语言公告栏内容。

:::
::: info 📂 配置项位置

<!-- markdownlint-disable MD051 -->

（[首页样式 -> 个人简介/公告栏](#个人简介-公告栏)启用时显示）

<!-- markdownlint-enable MD051 -->

首页样式 -> 自定义多语言公告栏内容

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=自定义多语言公告栏内容" />

:::
::: info 🏷️ 类型

重复器

:::

> [!NOTE] ⭐ 默认值
>
> ::: tip 📂 配置项名
>
> 语言代码
>
> :::
> ::: info 🏷️ 类型
>
> 字符串
>
> :::
> ::: info ⭐ 默认值
>
> `zh`
>
> :::
> ::: info 💡 示例值
>
> `zh`、`zh-CN`、`zh-Hans`、`en`、`en-US`
>
> :::
> ::: info 🔒 内部约束
>
> 必填项
>
> :::
> ::: info ⚠️ 外部约束
>
> 设定值需满足 [BCP 47](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Global_attributes/lang#:~:text=%E5%A6%82%E6%9E%9C%E6%A0%87%E7%AD%BE%E5%86%85%E5%AE%B9%E6%98%AF%E6%97%A0%E6%95%88%E7%9A%84%EF%BC%8C%E6%A0%B9%E6%8D%AE%20BCP47%EF%BC%8C%E5%AE%83%E5%B0%B1%E8%AE%BE%E4%B8%BA%E6%97%A0%E6%95%88%E3%80%82)，否则无效。
>
> :::
> ::: tip 📂 配置项名
>
> 个人简介/公告栏内容
>
> :::
> ::: info 🏷️ 类型
>
> 代码输入框（HTML）
>
> :::
> ::: info ⭐ 默认值
>
> 空
>
> :::
> ::: info 💡 示例值
>
> ```html
> 欢迎大家访问此站点！
> ```
>
> HTML 代码也是可以的：
>
> ```html
> <code>支持填写 HTML 代码</code>
> ```
>
> :::
> ::: info ⚠️ 外部约束
>
> 合法的 HTML 代码。
>
> :::

::: info 🧩 模板变量

`theme.config?.index_styles?.i18n_resume`

:::

### 社交资料图标左侧文字

::: info 🎯 用途

控制是否显示首页社交资料图标左侧的文字。

:::
::: info 📂 配置项位置

首页样式 -> 社交资料图标左侧文字

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=社交资料图标左侧文字" />

:::
::: info 🏷️ 类型

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
::: info 🏷️ 类型

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
::: info 🏷️ 类型

选项

:::
::: info ⭐ 默认值

`简洁文章列表`（内部值 `simple-post-list`）

:::
::: info 💡 其余选项

- 多元文章列表（内部值 `post-list-summary`）
- 瞬间列表（内部值 `moment-list-summary`）

:::
::: info 🧩 模板变量

`theme.config?.index_styles?.list_layout`

:::
::: info ℹ️ 补充信息

"瞬间列表"需[瞬间页](/guide/plugin-compatibility#瞬间页)插件启用后方可使用。

根据选择的布局类型，会显示不同的配置选项。

简洁列表启用后可以配置

- [显示发布日期](#简洁列表显示发布日期)
- [显示文章阅读量](#简洁列表显示文章阅读量)

多元列表启用后可以配置

- [显示发布日期](#多元列表显示发布日期)
- [显示文章分类](#多元列表显示文章分类)
- [显示文章标签](#多元列表显示文章标签)
- [显示文章阅读量](#多元列表显示文章阅读量)
- [显示文章预计阅读时间](#多元列表显示文章预计阅读时间)
- [显示文章字数统计](#多元列表显示文章字数统计)
- [显示文章摘要](#多元列表显示文章摘要)
- [文章摘要行数上限](#多元列表文章摘要行数上限)
- [跳转文章链接所用提示文字](#多元列表跳转文章链接所用提示文字)
- [显示文章封面](#多元列表显示文章封面)

瞬间列表启用后可以配置

- [显示条数](#瞬间列表显示条数)
- [显示条目作者头像](#瞬间列表显示条目作者头像)
- [显示条目作者昵称](#瞬间列表显示条目作者昵称)

:::

### 简洁列表显示发布日期

::: info 🎯 用途

控制是否在简洁列表中显示文章的发布日期。

:::
::: info 📂 配置项位置

（[首页样式 -> 主页列表布局](#主页列表布局)设置为“简洁文章列表”时显示）

首页样式 -> 简洁列表显示发布日期

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=简洁列表显示发布日期" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.index_styles?.is_show_post_pubdate_in_simple_post_list`

:::

### 简洁列表显示文章阅读量

::: info 🎯 用途

控制是否在简洁列表中显示文章阅读量。

:::
::: info 📂 配置项位置

（[首页样式 -> 主页列表布局](#主页列表布局)设置为“简洁文章列表”时显示）

首页样式 -> 简洁列表显示文章阅读量

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=简洁列表显示文章阅读量" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.index_styles?.is_show_post_views_in_simple_post_list`

:::

### 多元列表显示发布日期

::: info 🎯 用途

控制是否在多元列表中显示文章的发布日期。

:::
::: info 📂 配置项位置

（[首页样式 -> 主页列表布局](#主页列表布局)设置为“多元文章列表”时显示）

首页样式 -> 多元列表显示发布日期

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=多元列表显示发布日期" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.index_styles?.is_show_post_pubdate_in_post_list_summary`

:::

### 多元列表显示文章分类

::: info 🎯 用途

控制是否在多元列表中显示文章分类。

:::
::: info 📂 配置项位置

（[首页样式 -> 主页列表布局](#主页列表布局)设置为“多元文章列表”时显示）

首页样式 -> 多元列表显示文章分类

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=多元列表显示文章分类" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.index_styles?.is_show_post_categories_in_post_list_summary`

:::

### 多元列表显示文章标签

::: info 🎯 用途

控制是否在多元列表中显示文章标签。

:::
::: info 📂 配置项位置

（[首页样式 -> 主页列表布局](#主页列表布局)设置为“多元文章列表”时显示）

首页样式 -> 多元列表显示文章标签

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=多元列表显示文章标签" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.index_styles?.is_show_post_tags_in_post_list_summary`

:::

### 多元列表显示文章阅读量

::: info 🎯 用途

控制是否在多元列表中显示文章阅读量。

:::
::: info 📂 配置项位置

（[首页样式 -> 主页列表布局](#主页列表布局)设置为“多元文章列表”时显示）

首页样式 -> 多元列表显示文章阅读量

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=多元列表显示文章阅读量" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.index_styles?.is_show_post_views_in_post_list_summary`

:::

### 多元列表显示文章预计阅读时间

::: info 🎯 用途

控制是否在多元列表中显示文章预计阅读时间。

:::
::: info 📂 配置项位置

（[首页样式 -> 主页列表布局](#主页列表布局)设置为“多元文章列表”时显示）

首页样式 -> 多元列表显示文章预计阅读时间

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=多元列表显示文章预计阅读时间" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.index_styles?.is_show_post_estimated_reading_time_in_post_list_summary`

:::
::: info ℹ️ 补充信息

启用 [API 拓展](/guide/plugin-compatibility#api-扩展)插件后将自动启用更准确的计量方法。

:::

### 多元列表显示文章字数统计

::: info 🎯 用途

控制是否在多元列表中显示文章字数统计。

:::
::: info 📂 配置项位置

（[首页样式 -> 主页列表布局](#主页列表布局)设置为“多元文章列表”时显示）

首页样式 -> 多元列表显示文章字数统计

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=多元列表显示文章字数统计" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.index_styles?.is_show_post_word_count_in_post_list_summary`

:::
::: info ℹ️ 补充信息

启用 [API 拓展](/guide/plugin-compatibility#api-扩展)插件后将自动启用更准确的计量方法。

:::

### 多元列表显示文章摘要

::: info 🎯 用途

控制是否在多元列表中显示文章摘要。

:::
::: info 📂 配置项位置

（[首页样式 -> 主页列表布局](#主页列表布局)设置为“多元文章列表”时显示）

首页样式 -> 多元列表显示文章摘要

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=多元列表显示文章摘要" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.index_styles?.is_show_post_excerpt_in_post_list_summary`

:::

### 多元列表文章摘要行数上限

::: info 🎯 用途

设置多元列表中文章摘要的最大行数。

:::
::: info 📂 配置项位置

（[首页样式 -> 主页列表布局](#主页列表布局)设置为“多元文章列表”时显示）

首页样式 -> 多元列表文章摘要行数上限

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=多元列表文章摘要行数上限" />

:::
::: info 🏷️ 类型

整数

:::
::: info ⭐ 默认值

`3`

:::
::: info 🔒 内部约束

范围 1-5

:::
::: info 🧩 模板变量

`theme.config?.index_styles?.post_excerpt_max_lines`

:::

### 多元列表跳转文章链接所用提示文字

::: info 🎯 用途

控制是否在多元列表中显示跳转文章链接的提示文字。

:::
::: info 📂 配置项位置

（[首页样式 -> 主页列表布局](#主页列表布局)设置为“多元文章列表”时显示）

首页样式 -> 多元列表跳转文章链接所用提示文字

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=多元列表跳转文章链接所用提示文字" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.index_styles?.is_show_index_post_list_permalink_text`

:::
::: info ℹ️ 补充信息

如关闭此项，首页文章列表文章项将不显示跳转链接文字

:::

### 多元列表显示文章封面

::: info 🎯 用途

控制是否在多元列表中显示文章封面。

:::
::: info 📂 配置项位置

（[首页样式 -> 主页列表布局](#主页列表布局)设置为“多元文章列表”时显示）

首页样式 -> 多元列表显示文章封面

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=多元列表显示文章封面" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.index_styles?.is_show_post_cover_in_post_list_summary`

:::

### 瞬间列表显示条数

::: info 🎯 用途

设置瞬间列表中显示的条目数量。

:::
::: info 📂 配置项位置

（[首页样式 -> 主页列表布局](#主页列表布局)设置为“瞬间列表”时显示）

首页样式 -> 瞬间列表显示条数

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=瞬间列表显示条数" />

:::
::: info 🏷️ 类型

整数

:::
::: info ⭐ 默认值

`10`

:::
::: info 🧩 模板变量

`theme.config?.index_styles?.moment_list_page_size`

:::

### 瞬间列表显示条目作者头像

::: info 🎯 用途

控制是否在瞬间列表中显示条目作者头像。

:::
::: info 📂 配置项位置

（[首页样式 -> 主页列表布局](#主页列表布局)设置为“瞬间列表”时显示）

首页样式 -> 瞬间列表显示条目作者头像

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=瞬间列表显示条目作者头像" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.index_styles?.is_show_moment_avatar`

:::

### 瞬间列表显示条目作者昵称

::: info 🎯 用途

控制是否在瞬间列表中显示条目作者昵称。

:::
::: info 📂 配置项位置

（[首页样式 -> 主页列表布局](#主页列表布局)设置为“瞬间列表”时显示）

首页样式 -> 瞬间列表显示条目作者昵称

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=瞬间列表显示条目作者昵称" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.index_styles?.is_show_moment_nickname`

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
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.index_styles?.is_pin_icon_show`

:::
::: info ℹ️ 补充信息

启用后可以配置

- 置顶图标的位置（标题左侧或右侧），默认为右侧。

:::

## 文章页样式

应用范围：[`/archives/{slug}`](/reference/template-map#:~:text=/archives/%7Bslug%7D)。

### 优化文章段落空行显示

::: info 🎯 用途

为文章内容段落添加最小高度，以显示空行。

:::
::: info 📂 配置项位置

文章页样式 -> 优化文章段落空行显示

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=优化文章段落空行显示" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.post_styles?.is_optimize_content_paragraph_spacing`

:::
::: details ℹ️ 补充信息

不同 Markdown 编辑器所用解析器不同，故此配置项反映到最终渲染结果上，可能会有所不同。  
相关链接：[babelmark3](https://babelmark.github.io/) 是一个对比不同 Markdown 解析器解析结果的网站。

:::

### 文档段落首行缩进

::: info 🎯 用途

为文章内容段落首行添加缩进样式。

:::
::: info 📂 配置项位置

文章页样式 -> 段落首行缩进

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=段落首行缩进" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.post_styles?.is_enable_paragraph_first_line_indent`

:::
::: info ℹ️ 补充信息

启用后可以配置

- 首行缩进值
  - 类型：字符串
  - 默认值：`2em`（2 字符宽度）
  - 外部约束：CSS 长度单位。如：20rem, 300px, 30vw。

:::

### 文章标题大写

::: info 🎯 用途

将文章标题中字符转换为对应大写表示。

如：`a` 转换为 `A`。

:::
::: info 📂 配置项位置

文章页样式 -> 文章标题大写

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=文章标题大写" />

:::
::: info 🏷️ 类型

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

在文章页面顶部显示文章的发布时间。

:::
::: info 📂 配置项位置

文章页样式 -> 文章发布时间

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=文章发布时间" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.post_styles?.is_show_post_publish_time`

:::
::: info ℹ️ 补充信息

启用后可以配置

- 文章发布时间左侧文字

:::

### 文章更新时间

::: info 🎯 用途

在文章页面顶部显示文章的最后更新时间。

:::
::: info 📂 配置项位置

文章页样式 -> 文章更新时间

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=文章更新时间" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.post_styles?.is_show_post_updated_time`

:::
::: info ℹ️ 补充信息

启用后可以配置

- 文章更新时间左侧文字

:::

### 文章阅读量

::: info 🎯 用途

在文章页面显示文章的阅读量统计。

:::
::: info 📂 配置项位置

文章页样式 -> 文章阅读量

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=文章阅读量" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.post_styles?.is_show_post_views`

:::

### 文章预计阅读时间

::: info 🎯 用途

在文章页面显示根据文章字数估算的阅读时间。

:::
::: info 📂 配置项位置

文章页样式 -> 文章预计阅读时间

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=文章预计阅读时间" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.post_styles?.is_show_post_estimated_reading_time`

:::
::: info ℹ️ 补充信息

启用 [API 拓展](/guide/plugin-compatibility#api-扩展)插件后将自动启用更准确的计量方法。

:::

### 文章字数统计

::: info 🎯 用途

在文章页面显示文章的总字数。

:::
::: info 📂 配置项位置

文章页样式 -> 文章字数统计

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=文章字数统计" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.post_styles?.is_show_post_word_count`

:::
::: info ℹ️ 补充信息

启用 [API 拓展](/guide/plugin-compatibility#api-扩展)插件后将自动启用更准确的计量方法。

:::

### 桌面端菜单中的分享按钮

::: info 🎯 用途

控制是否在桌面端文章页面的菜单中显示分享按钮。

:::
::: info 📂 配置项位置

文章页样式 -> 桌面端菜单中的分享按钮

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=桌面端菜单中的分享按钮" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.post_styles?.is_show_post_nav_share_button`

:::

### 自定义侧边目录最大宽度

::: info 🎯 用途

开启后可以配置

- 文章页面右侧边栏目录的最大宽度。

:::
::: info 📂 配置项位置

文章页样式 -> 自定义侧边目录最大宽度

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=自定义侧边目录最大宽度" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.post_styles?.is_custom_toc_max_width`

:::
::: info ℹ️ 补充信息

启用后可以配置

- 侧边目录最大宽度
  - 类型：字符串
  - 默认值：`20rem`
  - 外部约束：CSS 长度单位。如：20rem, 300px, 30vw。

:::

### 文章末尾的的分隔线

::: info 🎯 用途

控制是否显示文章末尾的的分隔线。

:::
::: info 📂 配置项位置

文章页样式 -> 文章末尾的的分隔线

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=文章末尾的的分隔线" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.post_styles?.is_dividing_line_at_the_end_of_post_show`

:::

### 文章底部的点赞按钮

::: info 🎯 用途

控制是否显示文章底部的点赞按钮。

:::
::: info 📂 配置项位置

文章页样式 -> 文章底部的点赞按钮

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=文章底部的点赞按钮" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.post_styles?.is_post_upvote_button_show`

:::
::: info ℹ️ 补充信息

启用后可以配置

- 点赞按钮宽度
  - 类型：字符串
  - 默认值：`1rem`
  - 外部约束：CSS 长度单位。如：20rem, 300px, 30vw。
- 点赞按钮高度
  - 类型：字符串
  - 默认值：`1rem`
  - 外部约束：CSS 长度单位。如：20rem, 300px, 30vw。
- 展示文章获赞数
- 点赞按钮位置

:::

### 文章底部的推荐文章

::: info 🎯 用途

控制是否在文章底部显示推荐文章列表。

原理：读取当前文章**第一个分类**，并且随机输出其中若干个文章。

:::
::: info 📂 配置项位置

文章页样式 -> 文章底部的推荐文章

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=文章底部的推荐文章" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.post_styles?.is_post_recommended_articles_show`

:::
::: info ℹ️ 补充信息

如果当前文章在随机列表中将会被剔除，因此实际推荐文章数可能小于设定的“推荐文章数量”。  
如果当前文章**未设置分类**，该功能会被**禁用**。  
如果**分类仅有一篇文章**，该功能会被**禁用**。

启用后可以配置

- 推荐文章数量

:::

### 文章底部的相邻文章导航

::: info 🎯 用途

开启后将在文章底部显示上一篇和下一篇文章的导航链接。

:::
::: info 📂 配置项位置

文章页样式 -> 文章底部的相邻文章导航

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=文章底部的相邻文章导航" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.post_styles?.is_post_prev_next_navigation_show`

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
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.post_styles?.is_post_comment_section_show`

:::

### 移动端底部导航栏

::: info 🎯 用途

控制是否在移动端文章页面底部显示导航栏。

:::
::: info 📂 配置项位置

文章页样式 -> 移动端底部导航栏

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=移动端底部导航栏" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.post_styles?.is_show_footer_nav`

:::
::: info ℹ️ 补充信息

启用后可以配置

- 移动端底部导航栏中的分享按钮

:::

## 分类集合页样式

应用范围：[`/categories`](/reference/template-map#:~:text=/categories)。

### 分类集合页页面描述

::: info 🎯 用途

用于自定义该页面的 HTML `<meta name="description">` 内容，方便针对设置 SEO 描述。

:::
::: info 📂 配置项位置

分类集合页样式 -> 页面描述

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/categories_page_styles#:~:text=页面描述" />

:::
::: info 🏷️ 类型

字符串

:::
::: info ⭐ 默认值

空

:::
::: info 🧩 模板变量

`theme.config?.categories_page_styles?.description`

:::
::: info ℹ️ 补充信息

设置为空将回退到站点描述（快速跳转：<QuickJumpConfig to="/console/settings?tab=seo#:~:text=站点描述" />）

:::

### 显示每个分类下的文章数量

::: info 🎯 用途

控制是否在分类列表中显示每个分类包含的文章数量。

:::
::: info 📂 配置项位置

分类集合页样式 -> 显示每个分类下的文章数量

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/categories_page_styles#:~:text=显示每个分类下的文章数量" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.categories_page_styles?.is_show_the_number_of_articles_per_category`

:::
::: info ℹ️ 补充信息

启用后可以配置

- 在文章数量左侧的字符
  - 类型：字符串
  - 默认值：`(`
- 在文章数量右侧的字符
  - 类型：字符串
  - 默认值：`)`

:::

### 显示多层分类

::: info 🎯 用途

控制是否在分类页面展示子分类。

:::
::: info 📂 配置项位置

分类集合页样式 -> 是否显示多层分类

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/categories_page_styles#:~:text=是否显示多层分类" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.categories_page_styles?.is_show_multi_layer_categories`

:::

## 分类详情页样式

应用范围：[`/categories/{slug}`](/reference/template-map#:~:text=/categories/%7Bslug%7D)。

### 分类详情页文章列表显示文章发布时间

::: info 🎯 用途

在分类详情页的文章列表中显示文章发布时间。

:::
::: info 📂 配置项位置

分类详情页样式 -> 文章列表显示文章发布时间

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/category_page_styles#:~:text=文章列表显示文章发布时间" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.category_page_styles?.is_show_post_pubdate_in_post_list`

:::

### 分类详情页文章列表显示文章阅读量

::: info 🎯 用途

在分类详情页显示文章阅读量。

:::
::: info 📂 配置项位置

分类详情页样式 -> 文章列表显示文章阅读量

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/category_page_styles#:~:text=文章列表显示文章阅读量" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.category_page_styles?.is_show_post_views_in_post_list`

:::

### 显示分类 RSS 订阅按钮

::: info 🎯 用途

在分类详情页显示 RSS 订阅按钮。

:::
::: info 📂 配置项位置

分类详情页样式 -> 分类 RSS 订阅按钮

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/category_page_styles#:~:text=分类%20RSS%20订阅按钮" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.category_page_styles?.is_show_rss_button`

:::
::: info ⚠️ 外部约束

需 [RSS 订阅插件](/guide/plugin-compatibility#rss-订阅插件)启用后方可使用。

:::

## 标签集合页样式

应用范围：[`/tags`](/reference/template-map#:~:text=/tags)。

### 标签集合页页面描述

::: info 🎯 用途

用于自定义该页面的 HTML `<meta name="description">` 内容，方便针对设置 SEO 描述。

:::
::: info 📂 配置项位置

标签集合页样式 -> 页面描述

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/tags_page_styles#:~:text=页面描述" />

:::
::: info 🏷️ 类型

字符串

:::
::: info ⭐ 默认值

空

:::
::: info 🧩 模板变量

`theme.config?.tags_page_styles?.description`

:::
::: info ℹ️ 补充信息

设置为空将回退到站点描述（快速跳转：<QuickJumpConfig to="/console/settings?tab=seo#:~:text=站点描述" />）

:::

### 显示每个标签下的文章数量

::: info 🎯 用途

控制是否在分类列表中显示每个标签包含的文章数量。

:::
::: info 📂 配置项位置

标签集合页样式 -> 显示每个标签下的文章数量

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/tags_page_styles#:~:text=显示每个标签下的文章数量" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.tags_page_styles?.is_show_the_number_of_posts_per_tag`

:::
::: info ℹ️ 补充信息

启用后可以配置

- 在文章数量左侧的字符
  - 类型：字符串
  - 默认值：`(`
- 在文章数量右侧的字符
  - 类型：字符串
  - 默认值：`)`
    :::

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
::: info 🏷️ 类型

选项

:::
::: info ⭐ 默认值

默认（内部值 `default`）

:::
::: info 💡 其余选项

- 按文章数量从多到少（内部值 `count_desc`）
- 按文章数量从少到多（内部值 `count_asc`）
- 按名称升序（内部值 `name_asc`）
- 按名称降序（内部值 `name_desc`）

:::
::: info 🧩 模板变量

`theme.config?.tags_page_styles?.tags_sort_order`

:::

## 标签详情页样式

应用范围：[`/tags/{slug}`](/reference/template-map#:~:text=/tags/%7Bslug%7D)。

### 标签详情页文章列表显示文章阅读量

::: info 🎯 用途

在标签详情页显示文章阅读量。

:::
::: info 📂 配置项位置

标签详情页样式 -> 文章列表显示文章阅读量

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/tag_page_styles#:~:text=文章列表显示文章阅读量" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.tag_page_styles?.is_show_post_views_in_post_list`

:::

### 显示标签 RSS 订阅按钮

::: info 🎯 用途

在标签详情页显示 RSS 订阅按钮。

:::
::: info 📂 配置项位置

标签详情页样式 -> 显示标签 RSS 订阅按钮

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/tag_page_styles#:~:text=显示标签%20RSS%20订阅按钮" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.tag_page_styles?.is_show_rss_button`

:::
::: info ⚠️ 外部约束

需 [RSS 订阅插件](/guide/plugin-compatibility#rss-订阅插件)启用后方可使用。

:::

## 作者详情页样式

应用范围：[`/authors/{name}`](/reference/template-map#:~:text=/authors/%7Bname%7D)。

### 作者详情页页面描述

::: info 🎯 用途

用于自定义该页面的 HTML `<meta name="description">` 内容，方便针对设置 SEO 描述。

:::
::: info 📂 配置项位置

作者详情页样式 -> 页面描述

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/author_page_styles#:~:text=页面描述" />

:::
::: info 🏷️ 类型

字符串

:::
::: info ⭐ 默认值

空

:::
::: info 🧩 模板变量

`theme.config?.author_page_styles?.description`

:::
::: info ℹ️ 补充信息

设置为空将回退到站点描述（快速跳转：<QuickJumpConfig to="/console/settings?tab=seo#:~:text=站点描述" />）

:::

### 显示作者 RSS 订阅按钮

::: info 🎯 用途

在作者详情页显示 RSS 订阅按钮。

:::
::: info 📂 配置项位置

作者详情页样式 -> 显示作者 RSS 订阅按钮

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/author_page_styles#:~:text=显示作者%20RSS%20订阅按钮" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.author_page_styles?.is_show_rss_button`

:::
::: info ⚠️ 外部约束

需 [RSS 订阅插件](/guide/plugin-compatibility#rss-订阅插件)启用后方可使用。

:::

## 归档页样式

应用范围：[`/archives(/{year}(/{month}))`](</reference/template-map#:~:text=/archives(/%7Byear%7D(/%7Bmonth%7D))>)。

### 归档页页面描述

::: info 🎯 用途

用于自定义该页面的 HTML `<meta name="description">` 内容，方便针对设置 SEO 描述。

:::
::: info 📂 配置项位置

归档页样式 -> 页面描述

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/archives_page_styles#:~:text=页面描述" />

:::
::: info 🏷️ 类型

字符串

:::
::: info ⭐ 默认值

空

:::
::: info 🧩 模板变量

`theme.config?.archives_page_styles?.description`

:::
::: info ℹ️ 补充信息

设置为空将回退到站点描述（快速跳转：<QuickJumpConfig to="/console/settings?tab=seo#:~:text=站点描述" />）

:::

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
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.archives_page_styles?.is_collapse_post_list_by_publication_year_and_month`

:::
::: info ℹ️ 补充信息

启用后可以配置

- 展开折叠动画时长（单位：毫秒）
  - 类型：浮点数/整数
  - 默认值：`200`

:::

## 自定义页面样式

应用范围：[`/{slug}`](/reference/template-map#:~:text=/%7Bslug%7D)。

### 优化段落空行显示

::: info 🎯 用途

为自定义页面内容段落添加最小高度，以显示空行。

:::
::: info 📂 配置项位置

自定义页面样式 -> 优化段落空行显示

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/custom_page_styles#:~:text=优化段落空行显示" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.custom_page_styles?.is_optimize_content_paragraph_spacing`

:::
::: details ℹ️ 补充信息

不同 Markdown 编辑器所用解析器不同，故此配置项反映到最终渲染结果上，可能会有所不同。  
相关链接：[babelmark3](https://babelmark.github.io/) 是一个对比不同 Markdown 解析器解析结果的网站。

:::

### 自定义页面段落首行缩进

::: info 🎯 用途

为内容段落首行添加缩进样式。

:::
::: info 📂 配置项位置

自定义页面样式 -> 段落首行缩进

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/custom_page_styles#:~:text=段落首行缩进" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.custom_page_styles?.is_enable_paragraph_first_line_indent`

:::
::: info ℹ️ 补充信息

启用后可以配置

- 首行缩进值
  - 类型：字符串
  - 默认值：`2em`（2 字符宽度）
  - 外部约束：CSS 长度单位。如：20rem, 300px, 30vw。

:::

### 页面预计阅读时间

::: info 🎯 用途

在页面显示根据文章字数估算的阅读时间。

:::
::: info 📂 配置项位置

自定义页面样式 -> 页面预计阅读时间

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/custom_page_styles#:~:text=页面预计阅读时间" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.custom_page_styles?.is_show_post_estimated_reading_time`

:::
::: info ℹ️ 补充信息

启用 [API 拓展](/guide/plugin-compatibility#api-扩展)插件后将自动启用更准确的计量方法。

:::

### 页面字数统计

::: info 🎯 用途

在页面显示文章的总字数。

:::
::: info 📂 配置项位置

自定义页面样式 -> 页面字数统计

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/custom_page_styles#:~:text=页面字数统计" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.custom_page_styles?.is_show_post_word_count`

:::
::: info ℹ️ 补充信息

启用 [API 拓展](/guide/plugin-compatibility#api-扩展)插件后将自动启用更准确的计量方法。

:::

### 页面正文内容末尾分隔线

::: info 🎯 用途

控制是否显示页面正文内容末尾的的分隔线。

:::
::: info 📂 配置项位置

自定义页面样式 -> 页面正文内容末尾分隔线

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=页面正文内容末尾分隔线" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.custom_page_styles?.is_dividing_line_at_the_end_of_content_show`

:::

### 页面评论区

::: info 🎯 用途

控制是否在页面显示评论区。

:::
::: info 📂 配置项位置

自定义页面样式 -> 页面评论区

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/custom_page_styles#:~:text=页面评论区" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.custom_page_styles?.is_custom_page_comment_section_show`

:::

## 错误页样式

### 页面自动重定向

::: info 🎯 用途

在错误页面（如 `404`）自动跳转到指定页面。

:::
::: info 📂 配置项位置

错误页样式 -> 页面自动重定向

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/error_page_styles#:~:text=页面自动重定向" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.error_page_styles?.is_auto_redirect`

:::
::: info ℹ️ 补充信息

启用后可以配置

- 跳转目标链接
  - 类型：字符串
  - 默认值：`/`
  - 外部约束：合法的相对/绝对链接
- 跳转等待时间（单位：秒）
  - 类型：整数
  - 默认值：`5`

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
::: info 🏷️ 类型

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
::: info 🏷️ 类型

重复器

:::
::: info ⭐ 默认值

空

:::
::: info 🧩 模板变量

`theme.config?.sns?.custom_sns`

:::
::: info ℹ️ 补充信息

提供了主流平台的预设值，只需要填写对应平台的识别码就可以添加。

除此之外，你也可以添加自定义资料。

每个自定义资料需要配置：

- 识别码：任意字母、数字、下划线组合（如 `myBlog`）
- 链接：完整的 URL（如 `https://example.com`）
- 图标
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
::: info 🏷️ 类型

重复器

:::
::: info ⭐ 默认值

包含多个预设分享按钮：E-mail、QRCode、Native、Facebook、X、LinkedIn、Pinterest、Telegram、QQ、Weibo、WeChat、Qzone、Douban

:::
::: info 🧩 模板变量

`theme.config?.share?.button_config`

:::
::: info ℹ️ 补充信息

- `@URL` 和 `@TITLE` 是占位符，使用时会被替换为页面实际地址和标题
- 每个分享按钮有四个可配置项：名称、链接、图标（设定后将覆盖默认图标）、`aria-label`（无障碍标签）
- 可以自由调整顺序、删除或新增分享按钮

:::

## 链接页样式

需[链接管理插件](/guide/plugin-compatibility#链接页)启用后方可使用。

### 头像优先样式

::: info 🎯 用途

启用后，链接页将使用强调头像的网格布局，每行最多显示三个链接，适合需要突出展示链接站点头像的场景。

:::
::: info 📂 配置项位置

链接页样式 -> 头像优先样式

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/links_page_styles#:~:text=头像优先样式" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.links_page_styles?.is_head_first_style`

:::
::: info ℹ️ 补充信息

- **默认样式**：关闭时使用传统的横向列表布局，头像较小，信息在头像右侧排列
- **头像优先样式**：开启时使用网格卡片布局
  - 采用响应式三列网格（根据页面宽度，自动选择列数，最高三列）
  - 头像居中显示，尺寸更大
  - 链接信息垂直排列在头像下方
  - 鼠标悬停时卡片上浮并有阴影效果
  - 头像在鼠标悬停时会放大并改变边框颜色

:::

### 链接描述行数上限

::: info 🎯 用途

设置链接描述的最大行数。

:::
::: info 📂 配置项位置

（[链接页样式 -> 头像优先样式](#头像优先样式)启用时显示）

链接页样式 -> 链接描述行数上限

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/links_page_styles#:~:text=链接描述行数上限" />

:::
::: info 🏷️ 类型

整数

:::
::: info ⭐ 默认值

`3`

:::
::: info 🔒 内部约束

范围 1-5

:::
::: info 🧩 模板变量

`theme.config?.links_page_styles?.link_description_max_lines`

:::

## 图库页样式

需[图库管理插件](/guide/plugin-compatibility#图库页)启用后方可使用。

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
::: info 🏷️ 类型

字符串

:::
::: info ⭐ 默认值

`8px`

:::
::: info 💡 示例值

`0px`、`5px`、`10%`、`1rem`

:::
::: info ⚠️ 外部约束

合法的 CSS 长度单位。

:::
::: info 🧩 模板变量

`theme.config?.photos_styles?.img_border_radius`

:::

### 图片渐入动画时间

::: info 🎯 用途

设置相册页面中图片渐入动画时间。

:::
::: info 📂 配置项位置

相册页样式 -> 图片渐入动画时间

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/photos_styles#:~:text=图片渐入动画时间" />

:::
::: info 🏷️ 类型

整数/浮点数（单位：秒）

:::
::: info ⭐ 默认值

`0.2`

:::
::: info 💡 示例值

`1`、`0`

:::
::: info 🧩 模板变量

`theme.config?.photos_styles?.img_transition_duration_after_load`

:::

### 启用瀑布流布局

::: info 🎯 用途

在相册页面使用瀑布流布局展示图片。

:::
::: info 📂 配置项位置

相册页样式 -> 启用瀑布流布局

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/photos_styles#:~:text=启用瀑布流布局" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.photos_styles?.is_enable_masonry_layout`

:::
::: info ℹ️ 补充信息

启用后可以配置

- 瀑布流最大列数
- 瀑布流最小列数
- 瀑布流最小图片宽度
- 瀑布流间隔宽度
- 进阶配置选项
  - 自定义图片 onmouseover 属性
  - 自定义图片 onmouseout 属性

禁用后可以配置

- 显示分组标题

:::

## 瞬间页样式

需[瞬间管理插件](/guide/plugin-compatibility#瞬间页)启用后方可使用。

### 帖文预计阅读时间

::: info 🎯 用途

在帖子开头显示根据字数估算的阅读时间。

:::
::: info 📂 配置项位置

瞬间页样式 -> 帖文预计阅读时间

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/moments_styles#:~:text=帖文预计阅读时间" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.moments_styles?.is_show_post_estimated_reading_time`

:::
::: info ℹ️ 补充信息

启用 [API 拓展](/guide/plugin-compatibility#api-扩展)插件后将自动启用更准确的计量方法。

:::

### 帖文字数统计

::: info 🎯 用途

在帖子开头显示文章的总字数。

:::
::: info 📂 配置项位置

瞬间页样式 -> 帖文字数统计

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/moments_styles#:~:text=帖文字数统计" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`false`

:::
::: info 🧩 模板变量

`theme.config?.moments_styles?.is_show_post_word_count`

:::
::: info ℹ️ 补充信息

启用 [API 拓展](/guide/plugin-compatibility#api-扩展)插件后将自动启用更准确的计量方法。

:::

### 瞬间页点赞按钮

::: info 🎯 用途

在瞬间页面显示点赞按钮。

:::
::: info 📂 配置项位置

瞬间页样式 -> 启用点赞按钮

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/moments_styles#:~:text=启用点赞按钮" />

:::
::: info 🏷️ 类型

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

瞬间页样式 -> 启用评论区

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/moments_styles#:~:text=启用评论区" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.moments_styles?.is_moment_comment_section_show`

:::

## 朋友圈页面样式

需[朋友圈插件](/guide/plugin-compatibility#朋友圈-订阅聚合)启用后方可使用。

### 显示发布日期

::: info 🎯 用途

在朋友圈列表中显示文章的发布日期。

:::
::: info 📂 配置项位置

朋友圈页面样式 -> 显示发布日期

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/friends_page_styles#:~:text=显示发布日期" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.friends_page_styles?.is_show_friend_pubdate`

:::

### 显示作者信息

::: info 🎯 用途

在朋友圈列表中显示文章作者的头像和名称。

:::
::: info 📂 配置项位置

朋友圈页面样式 -> 显示作者信息

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/friends_page_styles#:~:text=显示作者信息" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.friends_page_styles?.is_show_friend_author`

:::

### 显示作者头像

::: info 🎯 用途

在朋友圈列表中显示文章作者的头像。点击头像可以前往作者的网站。

:::
::: info 📂 配置项位置

朋友圈页面样式 -> 显示作者头像

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/friends_page_styles#:~:text=显示作者头像" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.friends_page_styles?.is_show_friend_author_avatar`

:::
::: info ℹ️ 补充信息

仅在"显示作者信息"选项启用时生效。

:::

### 显示作者名称

::: info 🎯 用途

在朋友圈列表中显示文章作者的名称。点击名称可以前往作者的网站。

:::
::: info 📂 配置项位置

朋友圈页面样式 -> 显示作者名称

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/friends_page_styles#:~:text=显示作者名称" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.friends_page_styles?.is_show_friend_author_name`

:::
::: info ℹ️ 补充信息

仅在"显示作者信息"选项启用时生效。

:::

### 显示文章描述

::: info 🎯 用途

在朋友圈列表中显示文章的描述/摘要。

:::
::: info 📂 配置项位置

朋友圈页面样式 -> 显示文章描述

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/friends_page_styles#:~:text=显示文章描述" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.friends_page_styles?.is_show_friend_description`

:::

### 文章描述行数上限

::: info 🎯 用途

控制朋友圈列表中文章描述显示的最大行数。

:::
::: info 📂 配置项位置

朋友圈页面样式 -> 文章描述行数上限

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/friends_page_styles#:~:text=文章描述行数上限" />

:::
::: info 🏷️ 类型

数字（1-5）

:::
::: info ⭐ 默认值

`3`

:::
::: info 🧩 模板变量

`theme.config?.friends_page_styles?.friend_description_max_lines`

:::
::: info ℹ️ 补充信息

仅在"显示文章描述"选项启用时生效。

:::

### 显示跳转链接提示文字

::: info 🎯 用途

在朋友圈列表项中显示跳转链接的提示文字（如"阅读原文"）。

:::
::: info 📂 配置项位置

朋友圈页面样式 -> 显示跳转链接提示文字

:::
::: info ⚡ 快速跳转

<QuickJumpConfig to="/console/theme/settings/friends_page_styles#:~:text=显示跳转链接提示文字" />

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`theme.config?.friends_page_styles?.is_show_friend_permalink_text`

:::

## 下一步

你可以进一步了解：

- [元数据配置项](/guide/metadata-configuration)
