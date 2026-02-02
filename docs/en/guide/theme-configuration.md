---
outline: deep
---

<!-- markdownlint-disable MD033 MD013 -->

# Theme Configuration

::: info Info

This documentation is AI-generated. You can help improve it by submitting an [Issue](https://github.com/HowieHz/halo-theme-higan-hz/issues/new).

:::

<script setup>
import { ref, computed, h } from 'vue'

const inputBaseUrl = ref('') // User input base URL

const canJump = computed(() => inputBaseUrl.value.trim().length > 0)

function prefixHref(href) {
  if (!href) return href
  // When cannot jump, return in-page anchor pointing to warning element (avoids ternary judgment everywhere)
  if (!canJump.value) return '#quick-jump-warning'
  // If it's an absolute link (with protocol), return directly
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(href)) return href
  const base = inputBaseUrl.value.trim().replace(/\/+$/,'') // Remove trailing slashes
  const path = href.replace(/^\/+/, '') // Remove leading slashes
  if (!base) return href.startsWith('/') ? ('/' + path) : path
  return base + '/' + path
}

/**
 * QuickJumpConfig — Lightweight functional link component (returns <a> node)
 *
 * Behavior Overview
 * - Generate final href based on props.to (process site base address and absolute links through prefixHref)
 * - When user hasn't filled in base site (canJump === false), prefixHref returns "#quick-jump-warning"
 *   and the link will add aria-describedby="quick-jump-warning", aria-disabled="true", tabindex="-1"
 *
 * Props
 * - to: string (required) — Target path
 * - label?: string — Link display text, defaults to to
 * - ariaLabel?: string — Accessibility text, defaults to to
 * - showRealUrl?: boolean — Whether to display actual jump link, if true will force override label
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

  // When cannot jump, add accessibility prompt
  if (!canJump.value) {
    attrs['aria-describedby'] = 'quick-jump-warning'
    attrs['aria-disabled'] = 'true'
    attrs.tabindex = '-1'
  }

  return h('a', attrs, showRealUrl ? href : label)
}
</script>

You can directly modify these configuration items in the backend "Theme Settings" interface.

::: tip {#quick-jump-warning}

After your site has installed the latest version of the theme, you can fill in your site link below.  
This will enable quick jump links in this documentation, jumping to the corresponding configuration item in the backend with one click.

:::
::: info Site Link

<input v-model="inputBaseUrl" placeholder="Please enter your Halo site link here. Example: https://example.com" style="width:100%" />

:::
<template v-if="canJump">

::: info Please ensure this link is accessible

<QuickJumpConfig to="/console" showRealUrl=true />  
Quick jump links will only work when the above link is accessible.

:::

</template>

## Example

::: info 🎯 Purpose

Explains the purpose of the configuration item.

:::
::: info 📂 Configuration Item Location

Explains the location in the theme configuration.

:::
::: info ⚡ Quick Jump

Click to quickly jump to the corresponding theme configuration item.

:::

::: info 🏷️ Type

The value type of this configuration item.

::: tip Here are some common types

- String: A sequence of characters, such as `abc123`、`zh-CN`。
- Integer: Whole numbers, such as `-1`、`0`、`100`。
- Float: Numbers with decimal points, such as `1.2`、`0.3`、`4.5`。
- Boolean: `true` or `false`. In actual configuration items, it appears as a switch, on is `true`, off is `false`。
- Option: Fixed options are provided, just select directly.
- Repeater: Can repeat a group of inputs. Can add groups, remove groups, swap order of any groups.
- Code input box (programming language): Provides a multi-line code input box, which will be highlighted according to the specified programming language.
- Attachment: Select uploaded attachments.
- Icon: Use the icon setting box provided by Halo CMS, where you can select any [iconify](https://icon-sets.iconify.design/) icon.

<!-- - 数组：多个值的列表，如 `[1, 2, 3]`
- 对象：键值对集合，如 `{name: "张三", age: 20}`
- URL：网址链接，如 `https://example.com`
- 颜色值：如 `#FF5733`、`rgb(255, 87, 51)`
- CSS 长度值：如 `1rem`、`1px`、`1em`、`50%`、`1vw` -->

:::

::: info ⭐ Default Value

The default value of this configuration item.

::: tip How to reset all configurations to default values?

Go to <QuickJumpConfig to="/console/theme" />, then click the three dots on the far right of the theme name row, and finally click the reset button.

:::

::: info 💡 Example Values

A few more examples for better understanding.

:::
::: info 🔒 Internal Constraints

If the configured value does not meet this requirement, the configuration cannot be saved.

:::
::: info ⚠️ External Constraints

If the configured value does not meet this requirement, the theme may not work properly.

:::  
::: info 🧩 Template Variable

Variables provided for template developers to read this configuration value. Can be used via `${template variable}` .

:::
::: info ℹ️ Additional Information

Supplementary information.

:::

## Global

### Default Page Language

::: info 🎯 Purpose

Specify the site root tag `<html>` `lang` attribute default value, used to assist accessibility, SEO, and browser/plugin language detection (e.g., whether the browser prompts for page translation).

:::
::: info 📂 Configuration Item Location

Global -> Default Page Language

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/global#:~:text=Default Page Language" />

:::
::: info 🏷️ Type

String

:::
::: info ⭐ Default Value

`zh`

:::
::: info 💡 Example Values

`zh`、`zh-CN`、`zh-Hans`、`en`、`en-US`

:::
::: info ⚠️ External Constraints

The set value must comply with [BCP 47](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/lang#:~:text=The%20attribute%20contains%20a%20single%20BCP%2047%20language%20tag), otherwise it will be invalid.

:::
::: info 🧩 Template Variable

`theme.config?.global?.default_page_language`

:::
::: info ℹ️ Additional Information

- Security: The set language value will be automatically escaped, no need to worry about XSS injection attacks.
- Setting priority: Please refer to [page language setting priority](/reference/faq#page语言Set优先级).

:::

### Multilingual Function Prefix Matching Mode

::: info 🎯 Purpose

Enable the prefix matching mode for multilingual functionality, allowing the theme to match language settings more flexibly.

:::
::: info 📂 Configuration Item Location

Global -> Multilingual Function Prefix Matching Mode

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/global#:~:text=Multilingual Function Prefix Matching Mode" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`theme.config?.global?.is_i18n_prefix_match_mode`

:::
::: info ℹ️ Additional Information

For specific usage methods, please refer to [Prefix Matching Mode Description](/tutorial/i18n.md#前缀匹配模式说明).

:::

### Auto-redirect Based on Browser Language

::: info 🎯 Purpose

Automatically redirect to the corresponding language page based on the browser language settings.

:::
::: info 📂 Configuration Item Location

Global -> Auto-redirect Based on Browser Language

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/global#:~:text=Auto-redirect Based on Browser Language" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.global?.is_auto_redirect_to_browser_language`

:::
::: info ℹ️ Additional Information

After enabling this option, if the browser language differs from the Default Page Language and the browser language exists in the [Allowed Target Language Code List for Redirects](#allowed-target-language-code-list-for-redirects), it will automatically redirect to the corresponding page.

After enabling, please refer to the [Auto-redirect Based on Browser Language Guide](/tutorial/i18n#auto-redirect-based-on-browser-language-guide) for configuration.

When enabled, you can configure:

- [Allowed Target Language Code List for Redirects](#Allowed Target Language Code List for Redirects)

:::

### Allowed Target Language Code List for Redirects

::: info 🎯 Purpose

Set allowed auto-redirect target languages.

:::
::: info 📂 Configuration Item Location

（[Global -> Auto-redirect Based on Browser Language](#Auto-redirect Based on Browser Language)When enabled, will display)

Global -> Allowed Target Language Code List for Redirects

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/global#:~:text=Allowed Target Language Code List for Redirects" />

:::
::: info 🏷️ Type

Repeater

:::
::: info ⭐ Default Value

Empty

:::

> [!NOTE] 💡 Example Values
>
> ::: tip 📂 Configuration Item Name
>
> Language Code
>
> :::
> ::: info 🏷️ Type
>
> String
>
> :::
> ::: info ⭐ Default Value
>
> `zh`
>
> :::
> ::: info 💡 Example Values
>
> `zh`, `zh-CN`, `zh-Hans`, `en`, `en-US`
>
> :::
> ::: info 🔒 Internal Constraints
>
> Required field
>
> :::
> ::: info ⚠️ External Constraints
>
> The set value must comply with [BCP 47](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/lang#:~:text=The%20attribute%20contains%20a%20single%20BCP%2047%20language%20tag), otherwise it will be invalid.
>
> :::

::: info 🧩 Template Variable

`theme.config?.global?.auto_redirect_target_language_list`

:::
::: info ℹ️ Additional Information

Enable[Auto-redirect Based on Browser Language](#Auto-redirect Based on Browser Language)后，If 浏览器语言与 Default Page Language 不同，且浏览器语言存 In 于 this option，将自动跳转到对应 page。

请参照[Auto-redirect Based on Browser LanguageUse 指南](/tutorial/i18n#Auto-redirect Based on Browser LanguageUse指南)进行 Configuration。

匹配顺序从上到下。

:::

### Multilingual Menu Support

::: info 🎯 Purpose

EnableMultilingual Menu Support，AllowIn 菜单中 Display 不同语言的内容。

:::
::: info 📂 Configuration Item Location

Global -> Multilingual Menu Support

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/global#:~:text=Multilingual Menu Support" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.global?.is_i18n_menu_show`

:::
::: info ℹ️ Additional Information

Enable 后请参照[多语言菜单 Use 指南](/tutorial/i18n#多语言菜单Use指南)进行 Configuration。

:::

### CSP:upgrade-insecure-requests

::: info 🎯 Purpose

自动将非跳转的不安全资源请求升级到 HTTPS，包括 When 前域名以及第三方请求。

:::
::: info 📂 Configuration Item Location

Global -> CSP:upgrade-insecure-requests

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/global#:~:text=CSP%3Aupgrade%2Dinsecure%2Drequests" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.global?.upgrade_insecure_requests`

:::

### Only Allow Access from Specified Domains

::: info 🎯 Purpose

防止站点被恶意镜像后的流量流失，仅 Allow 白名单中的域名访问。

:::
::: info 📂 Configuration Item Location

Global -> Only Allow Access from Specified Domains

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/global#:~:text=Only Allow Access from Specified Domains" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.global?.anti_mirror_site`

:::
::: info ℹ️ Additional Information

Enable 后请参照[EnableOnly Allow Access from Specified Domains](/tutorial/security#EnableOnly Allow Access from Specified Domains)进行 Configuration。

When enabled, you can configure:

- [Domain Whitelist](#Domain Whitelist)
- [Target Link](#Target Link)
- [跳转后 Whether 保留路径和查询参数](#跳转后-whether-保留路径和查询参数)

:::

### Domain Whitelist

::: info 🎯 Purpose

SetDomain Whitelist.

:::
::: info 📂 Configuration Item Location

（[Global -> Only Allow Access from Specified Domains](#Only Allow Access from Specified Domains)When enabled, will display)

Global -> Domain Whitelist

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/global#:~:text=Domain Whitelist" />

:::
::: info 🏷️ Type

Repeater

:::
::: info ⭐ Default Value

Empty

:::

> [!NOTE] 💡 示例值
>
> ::: tip 📂 Configuration 项名
>
> Base64 编码后的域名
>
> :::
> ::: info 🏷️ Type
>
> String
>
> :::
> ::: info 💡 Example Values
>
> `bG9jYWxob3N0`
>
> :::
> ::: info 🔒 Internal Constraints
>
> Required field
>
> :::

::: info 🧩 Template Variable

`theme.config?.global?.allow_site_whitelist`

:::
::: info ℹ️ Additional Information

请参照[EnableOnly Allow Access from Specified Domains](/tutorial/security#EnableOnly Allow Access from Specified Domains)进行 Configuration。

:::

### Target Link

::: info 🎯 Purpose

SetDomain Whitelist.

:::
::: info 📂 Configuration Item Location

（[Global -> Only Allow Access from Specified Domains](#Only Allow Access from Specified Domains)When enabled, will display)

Global -> Target Link

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/global#:~:text=Target Link" />

:::
::: info 🏷️ Type

String

:::
::: info ⭐ Default Value

`bG9jYWxob3N0`

:::
::: info 💡 Example Values

`bG9jYWxob3N0`

:::
::: info 🧩 Template Variable

`theme.config?.global?.target_url`

:::
::: info ℹ️ Additional Information

请参照[EnableOnly Allow Access from Specified Domains](/tutorial/security#EnableOnly Allow Access from Specified Domains)进行 Configuration。

:::

### 跳转后 Whether 保留路径和查询参数

::: info 🎯 Purpose

Set 跳转后 Whether 保留路径和查询参数。

:::
::: info 📂 Configuration Item Location

（[Global -> Only Allow Access from Specified Domains](#Only Allow Access from Specified Domains)When enabled, will display)

Global -> 跳转后 Whether 保留路径和查询参数

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/global#:~:text=跳转后Whether保留路径和查询参数" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`theme.config?.global?.is_keep_path_and_query`

:::
::: info ℹ️ Additional Information

请参照[EnableOnly Allow Access from Specified Domains](/tutorial/security#EnableOnly Allow Access from Specified Domains)进行 Configuration。

假设用户访问的链接为 `http://localhost/a/b?a=1`，[Target Link](#Target Link)Set 为（Base 64 编码前）`https://p.com`：

- Disablethis optionwill 跳转到：`https://p.com`
- Enablethis optionwill 跳转到：`https://p.com/a/b?a=1`

:::

### Custom Resource Location Address

::: info 🎯 Purpose

Specify 资源将 UseCustom 的资源位置地址，而不是主题默认的地址。

:::
::: info 📂 Configuration Item Location

Global -> Custom Resource Location Address

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/global#:~:text=Custom Resource Location Address" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.global?.is_custom_resource_locations`

:::
::: info ℹ️ Additional Information

Enablethis option 厚，IfEnable 下面的“instant.page Support”、“Mermaid Support”willDisplay 对应的资源位置 Configuration 项。

:::

### instant.page Support

::: info 🎯 Purpose

自动加载 instant.page 脚本，预加载链接以提升 page 加载速度。

:::
::: info 📂 Configuration Item Location

Global -> instant.page Support

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/global#:~:text=instant.page%20Support" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.global?.is_instant_page_enable`

:::

### Mermaid Support

::: info 🎯 Purpose

Enable Mermaid 图表渲染功 can，SupportInpost 中绘制流程图、when 序图等。

:::
::: info 📂 Configuration Item Location

Global -> Mermaid Support

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/global#:~:text=Mermaid%20Support" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.global?.is_mermaid_enable`

:::
::: info ℹ️ Additional Information

图表 canSupport 明暗切换，具体 Use 方法请看：[Mermaid 适配明暗主题切换](/guide/style-reference#mermaid-适配明暗主题切换)

Enable 后 Requires 要 Configuration 以下子项：

- Mermaid CSS 选择器（Default: `.content .mermaid`）
- Mermaid Config 属性（Default: `{ startOnLoad: false }`）

:::

## General Styles

### EnableCustom 字体文件

::: info 🎯 Purpose

Use 上传的 Custom 字体文件替换默认字体。

:::
::: info 📂 Configuration Item Location

General Styles -> EnableCustom 字体文件

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=EnableCustom字体文件" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.styles?.is_custom_font_files_enable`

:::
::: info ℹ️ Additional Information

When enabled, you can configure:

- [Custom 字体文件](#custom-字体文件)
- [Custom 字体名称](#custom-字体名称)

:::

### Custom 字体文件

::: info 🎯 Purpose

Used for 选择上传的字体文件替换默认字体文件。Support `.woff2`/`.woff`/`.ttf`/`.otf`/`.eot`/`.ttc`/`.otc`/`.sfnt` 格式的字体文件。

:::
::: info 📂 Configuration Item Location

（[General Styles -> EnableCustom 字体文件](#enablecustom-字体文件)When enabled, will display）

General Styles -> 选择 Custom 字体文件

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=选择Custom字体文件" />

:::
::: info 🏷️ Type

Repeater

:::
::: info 🧩 Template Variable

`theme.config?.styles?.custom_font_configs`

:::

### Custom 字体名称

::: info 🎯 Purpose

正确填写 this option 后，If 用户本地安装已经此字体，则应用本地版本。  
Ifthis option 置 Empty，则即 Use 户本地已安装 this 字体，也不 willUse 本地版本，而是从网络下载字体文件。

:::
::: info 📂 Configuration Item Location

（[General Styles -> EnableCustom 字体文件](#enablecustom-字体文件)When enabled, will display）

General Styles -> Custom 字体名称

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Custom字体名称" />

:::
::: info 🏷️ Type

String

:::
::: info ⭐ Default Value

Empty

:::
::: info 💡 Example Values

`My Custom Font Regular`、`MyCustomFont-Regular`

:::
::: info 外部约束

对应字体文件内部声明的“字体全名 (`nameID=4`)”or“PostScript 名 (`nameID=6`)”。

:::
::: info 🧩 Template Variable

`theme.config?.styles?.custom_font_name`

:::

### Enable Custom Cursor Files

::: info 🎯 Purpose

Replace the default cursor set with uploaded custom cursor files.

:::
::: info 📂 Configuration Item Location

Style -> Enable Custom Cursor Files

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Enable%20Custom%20Cursor%20Files" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.styles?.is_custom_cursor_files_enable`

:::

### 配色方案

::: info 🎯 Purpose

Set 网站的整体配色方案，Support 多种内置主题和 Custom 配色。

:::
::: info 📂 Configuration Item Location

General Styles -> 配色方案

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=配色方案" />

:::
::: info 🏷️ Type

Option

:::
::: info ⭐ Default Value

`暗色 - 绿`（internal value `dark`）

:::
::: info 💡 Other Options

- `跟随系统 - 绿`（internal value `auto`）
- `浅色 - 绿`（internal value `light`）
- `跟随系统 - 蓝`（internal value `auto-blue`）
- `浅色 - 蓝`（internal value `light-blue`）
- `暗色 - 蓝`（internal value `dark-blue`）
- `浅色 - 灰粉`（internal value `gray`）
- `Custom配色`（internal value `custom`）

:::
::: info 🧩 Template Variable

`theme.config?.styles?.color_schema`

:::
::: info ℹ️ Additional Information

- 对于 Enable[深浅色模式切换按钮](#深浅色模式切换按钮)的情况，这项决定了网站刚加载完成 when 的默认配色方案。
- 选择"Custom 配色"when，Requires 要配合[Custom 配色方案](#custom-配色方案).

:::

### Custom 配色方案

::: info 🎯 Purpose

SetCustom 配色方案。

:::
::: info 📂 Configuration Item Location

General Styles -> Custom 配色方案

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Custom配色方案" />

:::
::: info 🏷️ Type

Repeater

:::
::: info ℹ️ Additional Information

Use 方法请参考 [教程：Custom 配色方案](/tutorial/custom-theme)

:::

> [!NOTE] ⭐ 默认值
>
> ::: tip 📂 Configuration 项名
>
> Custom 配色方案识别码
>
> :::
> ::: info 🏷️ Type
>
> 数字
>
> :::
> ::: info ⭐ Default Value
>
> `1`
>
> :::
> ::: info ℹ️ Additional Information
>
> 唯一识别码，请勿重复。
>
> :::
> ::: tip 📂 Configuration 项名
>
> 主题色彩模式
>
> :::
> ::: info 🏷️ Type
>
> Option
>
> :::
> ::: info ⭐ Default Value
>
> `深色模式`（internal value `dark`）
>
> :::
> ::: info 💡 Other Options
>
> - `浅色模式`（internal value `light`）
> - `自动模式`（internal value `auto`）
>
> :::
> ::: tip 📂 Configuration 项名
>
> CSS 变量模式
>
> :::
> ::: info 🏷️ Type
>
> Boolean
>
> :::
> ::: info ⭐ Default Value
>
> `false`
>
> :::
> ::: info ℹ️ Additional Information
>
> Enablethis option 后，将 Use CSS 变量来定义配色方案。
>
> :::
> ::: tip 📂 Configuration 项名
>
> CSS 原始输出模式
>
> :::
> ::: info 🏷️ Type
>
> Boolean
>
> :::
> ::: info ⭐ Default Value
>
> `false`
>
> :::
> ::: info ℹ️ Additional Information
>
> Disablethis option 后，仅 Requires 填写 Custom CSS 变量的部分。  
> 输出 whenwill 自动输出 In 对应 CSS 选择器中（选择器为 `html[theme="theme-{识别码}"]`）。
>
> :::
> ::: tip 📂 Configuration 项名
>
> Custom CSS 变量
>
> :::
> ::: info 🏷️ Type
>
> Code input box (CSS）
>
> :::
> ::: info ⚠️ External Constraints
>
> Enable `CSS 原始输出模式` when，你填写的内容 Requires 要是合法的 CSS 代码。  
> Disable `CSS 原始输出模式` when，以下内容 Requires 要是合法的 CSS 代码：
>
> ```css
> html[theme="theme-{识别码}"] {
>   /* 你填写的内容 */
> }
> ```
>
> :::
> ::: info ℹ️ Additional Information
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

::: info 🎯 Purpose

IfEnablethis option，将 In 大标题旁 Display 明暗模式切换按钮。  
切换逻辑为：浅色模式 -> 深色模式 -> 自动模式 -> 浅色模式。

:::
::: info 📂 Configuration Item Location

General Styles -> 深浅色模式切换按钮

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=深浅色模式切换按钮" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.styles?.is_show_color_scheme_toggle_button`

:::
::: info ℹ️ Additional Information

“自动模式配色方案”选择与“浅色模式配色方案”相同即 canDisable 自动模式。  
切换逻辑将变为：浅色模式 -> 深色模式 -> 浅色模式。

When enabled, you can configure:

- [自动模式配色方案](#自动模式配色方案)
- [浅色模式配色方案](#浅色模式配色方案)
- [深色模式配色方案](#深色模式配色方案)

相关说明：

[Mermaid 适配明暗主题切换](/guide/style-reference#mermaid-适配明暗主题切换)

:::

### 自动模式配色方案

::: info 🎯 Purpose

Set 深浅色模式切换按钮中自动模式的配色方案。

:::
::: info 📂 Configuration Item Location

（[General Styles -> 深浅色模式切换按钮](#深浅色模式切换按钮)When enabled, will display）

General Styles -> 自动模式配色方案

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=自动模式配色方案" />

:::
::: info 🏷️ Type

Option

:::
::: info ⭐ Default Value

`跟随系统 - 绿`（internal value `auto`）

:::
::: info 💡 Other Options

- `浅色 - 绿`（internal value `light`）
- `暗色 - 绿`（internal value `dark`）
- `跟随系统 - 蓝`（internal value `auto-blue`）
- `浅色 - 蓝`（internal value `light-blue`）
- `暗色 - 蓝`（internal value `dark-blue`）
- `浅色 - 灰粉`（internal value `gray`）
- `Custom配色`（internal value `custom`）

:::
::: info 🧩 Template Variable

`theme.config?.styles?.theme_auto`

:::
::: info ℹ️ Additional Information

选择“Custom 配色”when，Requires 要配合[Custom 配色方案](#custom-配色方案)Use，并填写 Custom 配色方案识别码。

:::

### 浅色模式配色方案

::: info 🎯 Purpose

Set 深浅色模式切换按钮中浅色模式的配色方案。

:::
::: info 📂 Configuration Item Location

（[General Styles -> 深浅色模式切换按钮](#深浅色模式切换按钮)When enabled, will display）

General Styles -> 浅色模式配色方案

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=浅色模式配色方案" />

:::
::: info 🏷️ Type

Option

:::
::: info ⭐ Default Value

`浅色 - 绿`（internal value `light`）

:::
::: info 💡 Other Options

- `跟随系统 - 绿`（internal value `auto`）
- `暗色 - 绿`（internal value `dark`）
- `跟随系统 - 蓝`（internal value `auto-blue`）
- `浅色 - 蓝`（internal value `light-blue`）
- `暗色 - 蓝`（internal value `dark-blue`）
- `浅色 - 灰粉`（internal value `gray`）
- `Custom配色`（internal value `custom`）

:::
::: info 🧩 Template Variable

`theme.config?.styles?.theme_light`

:::
::: info ℹ️ Additional Information

选择"Custom 配色"when，Requires 要配合[Custom 配色方案](#custom-配色方案)Use，并填写 Custom 配色方案识别码。

:::

### 深色模式配色方案

::: info 🎯 Purpose

Set 深浅色模式切换按钮中深色模式的配色方案。

:::
::: info 📂 Configuration Item Location

（[General Styles -> 深浅色模式切换按钮](#深浅色模式切换按钮)When enabled, will display）

General Styles -> 深色模式配色方案

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=深色模式配色方案" />

:::
::: info 🏷️ Type

Option

:::
::: info ⭐ Default Value

`暗色 - 绿`（internal value `dark`）

:::
::: info 💡 Other Options

- `跟随系统 - 绿`（internal value `auto`）
- `浅色 - 绿`（internal value `light`）
- `跟随系统 - 蓝`（internal value `auto-blue`）
- `浅色 - 蓝`（internal value `light-blue`）
- `暗色 - 蓝`（internal value `dark-blue`）
- `浅色 - 灰粉`（internal value `gray`）
- `Custom配色`（internal value `custom`）

:::
::: info 🧩 Template Variable

`theme.config?.styles?.theme_dark`

:::
::: info ℹ️ Additional Information

选择"Custom 配色"when，Requires 要配合[Custom 配色方案](#custom-配色方案)Use，并填写 Custom 配色方案识别码。

:::

### 字体大小

::: info 🎯 Purpose

Set 网站的整体字体大小。

:::
::: info 📂 Configuration Item Location

General Styles -> 字体大小

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=字体大小" />

:::
::: info 🏷️ Type

Option

:::
::: info ⭐ Default Value

`小字体`（internal value `small`）

:::
::: info 💡 Other Options

- `常规`（internal value `normal`）
- `大字体`（internal value `large`）

:::
::: info 🧩 Template Variable

`theme.config?.styles?.text_size`

:::

### Custom 内容区域最大宽度

::: info 🎯 Purpose

Whether 定义内容区域最大宽度。

:::
::: info 📂 Configuration Item Location

General Styles -> Custom 内容区域最大宽度

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Custom内容区域最大宽度" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`theme.config?.styles?.is_max_width_settings`

:::
::: info ℹ️ Additional Information

IfDisablethis option，内容区域最大宽度 will 随着 page 宽度变化而变化，但 cancan 出现内容整体偏左的现象。  
If 想 Disablethis option，建议 Enable"内容区域最小宽度"和"Custom 内容区域宽度属性"。

When enabled, you can configure:

- [内容区域最大宽度](#内容区域最大宽度)

:::

### 内容区域最大宽度

::: info 🎯 Purpose

Set 内容区域的最大宽度。

:::
::: info 📂 Configuration Item Location

（[General Styles -> Custom 内容区域最大宽度](#custom-内容区域最大宽度)When enabled, will display）

General Styles -> 内容区域最大宽度

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=内容区域最大宽度" />

:::
::: info 🏷️ Type

String

:::
::: info ⭐ Default Value

`48rem`

:::
::: info 💡 Example Values

`20rem`、`300px`、`30vw`

:::
::: info ⚠️ External Constraints

Valid CSS length unit.

:::
::: info 🧩 Template Variable

`theme.config?.styles?.max_width`

:::

### Custom 内容区域最小宽度

::: info 🎯 Purpose

Whether 定义内容区域最小宽度。

:::
::: info 📂 Configuration Item Location

General Styles -> Custom 内容区域最小宽度

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Custom内容区域最小宽度" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.styles?.is_min_width_settings`

:::
::: info ℹ️ Additional Information

When 窗口宽度小于此此 Set 宽度 when，实际 willUse 窗口宽度。以避免出现横向滚动条。

When enabled, you can configure:

- [内容区域最小宽度](#内容区域最小宽度)
- [强制应用内容区域最小宽度](#强制应用内容区域最小宽度)

:::

### 内容区域最小宽度

::: info 🎯 Purpose

Set 内容区域的最小宽度。

:::
::: info 📂 Configuration Item Location

（[General Styles -> Custom 内容区域最小宽度](#custom-内容区域最小宽度)When enabled, will display）

General Styles -> 内容区域最小宽度

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=内容区域最小宽度" />

:::
::: info 🏷️ Type

String

:::
::: info ⭐ Default Value

`48rem`

:::
::: info 💡 Example Values

`20rem`、`300px`、`30vw`

:::
::: info ⚠️ External Constraints

Valid CSS length unit.

:::
::: info 🧩 Template Variable

`theme.config?.styles?.min_width`

:::

### 强制应用内容区域最小宽度

::: info 🎯 Purpose

Controls whether 强制应用内容区域最小宽度。

:::
::: info 📂 Configuration Item Location

（[General Styles -> Custom 内容区域最小宽度](#custom-内容区域最小宽度)When enabled, will display）

General Styles -> 强制应用内容区域最小宽度

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=强制应用内容区域最小宽度" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.styles?.is_force_min_width_settings`

:::
::: info ℹ️ Additional Information

- Disablewhen：When 窗口宽度小于 Set 的最小宽度 when，实际 willUse 窗口宽度。以避免出现横向滚动条。
- Enablewhen：强制使内容 Display 区域不小于 Set 的最小宽度，即使出现横向滚动条。

:::

### Custom 内容区域宽度属性

::: info 🎯 Purpose

Whether 定义内容区域宽度属性。

:::
::: info 📂 Configuration Item Location

General Styles -> Custom 内容区域宽度属性

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Custom内容区域宽度属性" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.styles?.is_content_width_style_settings`

:::
::: info ℹ️ Additional Information

When enabled, you can configure:

- [内容区域宽度样式](#内容区域宽度样式)

:::

### 内容区域宽度样式

::: info 🎯 Purpose

决定内容区域宽度样式。

:::
::: info 📂 Configuration Item Location

（[General Styles -> Custom 内容区域宽度属性](/guide/theme-configuration#Custom内容区域宽度属性)When enabled, will display）

General Styles -> 内容区域宽度样式

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=内容区域宽度样式" />

:::
::: info 🏷️ Type

String

:::
::: info ⭐ Default Value

`fit-content`

:::
::: info 💡 Example Values

`max-content`、`min-content`

:::
::: info ⚠️ External Constraints

符合[文档](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference/Properties/width#%E5%80%BC)对值的要求。

:::
::: info 🧩 Template Variable

`theme.config?.styles?.content_width_style`

:::
::: info ℹ️ Additional Information

默认值效果为：使内容区域宽度等于最宽的内容的宽度。（this option 实际是 InSet 内容区域的 `width` 属性对应的样式值）

:::

### 页眉头像 Display

::: info 🎯 Purpose

Controls whetherIn 页眉 Display 头像。

:::
::: info 📂 Configuration Item Location

General Styles -> WhetherDisplay 页眉头像

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=WhetherDisplay页眉头像" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`theme.config?.styles?.is_show_header_icon`

:::
::: info ℹ️ Additional Information

When enabled, you can configure:

- [Custom 页眉头像](#custom-页眉头像)
- [圆形头像](#圆形头像)
- [灰度头像](#灰度头像)

:::

### Custom 页眉头像

::: info 🎯 Purpose

Used for 选择上传的图片作为页眉头像。未 Set 将 Use 默认头像 `/themes/howiehz-higan/images/logo.{avif,webp,png}`。

:::
::: info 📂 Configuration Item Location

（[Global -> 页眉头像 Display](#页眉头像-display)When enabled, will display）

General Styles -> Custom 页眉头像

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Custom页眉头像" />

:::
::: info 🏷️ Type

Attachment

:::
::: info 🧩 Template Variable

`theme.config?.styles?.icon`

:::

### 圆形头像

::: info 🎯 Purpose

Controls whether 强制将头像裁切为圆形。

:::
::: info 📂 Configuration Item Location

（[Global -> 页眉头像 Display](#页眉头像-display)When enabled, will display）

General Styles -> 圆形头像

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=圆形头像" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.styles?.avatar_circle`

:::

### 灰度头像

::: info 🎯 Purpose

Controls whether 强制将头像以灰度处理。

:::
::: info 📂 Configuration Item Location

（[Global -> 页眉头像 Display](#页眉头像-display)When enabled, will display）

General Styles -> 灰度头像

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=灰度头像" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.styles?.avatar_grayout`

:::

### 额外菜单项

::: info 🎯 Purpose

Controls whetherIn 菜单 Display 额外菜单项。

:::
::: info 📂 Configuration Item Location

General Styles -> 额外菜单项

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=额外菜单项" />

:::
::: info 🏷️ Type

Repeater

:::
::: info ⭐ Default Value

包含一个预设：搜索（Requires[搜索组件插件](/guide/plugin-compatibility#搜索组件)）。

:::

> [!NOTE] 💡 示例值
>
> ::: tip 📂 Configuration 项名
>
> 菜单项类型
>
> :::
> ::: info 🏷️ Type
>
> Option
>
> :::
> ::: info ⭐ Default Value
>
> 搜索（Requires[搜索组件插件](/guide/plugin-compatibility#搜索组件)）（internal value `search`）
>
> :::
> ::: info 💡 Other Options
>
> - 随机 post（internal value `random`）
> - 用户账号（internal value `user`）
>
> :::
> ::: info 🔒 Internal Constraints
>
> Required field
>
> :::
> ::: info ℹ️ Additional Information
>
> 对于`用户账号`类型：
>
> - 未登录 when，菜单 Display `登录`，点击后跳转 `/login` page。
> - 已登录 when，菜单 Display 用户名，点击后跳转 `/uc` page。
>
> :::

::: info 🧩 Template Variable

`theme.config?.styles?.extra_menu_items`

:::

### Display 页眉菜单

::: info 🎯 Purpose

Controls whetherDisplay 页眉菜单。

:::
::: info 📂 Configuration Item Location

General Styles -> Display 页眉菜单

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Display页眉菜单" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`theme.config?.styles?.is_show_header_menu`

:::

### Display 页码

::: info 🎯 Purpose

Controls whetherDisplay 页码。

:::
::: info 📂 Configuration Item Location

General Styles -> Display 页码

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Display页码" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`theme.config?.styles?.is_show_page_number`

:::

### page 底部站点统计信息

::: info 🎯 Purpose

Controls whetherDisplaypage 底部站点统计信息。

:::
::: info 📂 Configuration Item Location

General Styles -> page 底部站点统计信息

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=page底部站点统计信息" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.styles?.is_footer_site_stats_show`

:::
::: info ℹ️ Additional Information

When enabled, you can configure:

- [统计项 Set](#统计项-set)

:::

### 统计项 Set

::: info 🎯 Purpose

Set 统计项。

:::
::: info 📂 Configuration Item Location

（[Home Page Style -> page 底部站点统计信息](#page-底部站点统计信息)When enabled, will display）

General Styles -> 统计项 Set

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/global#:~:text=统计项Set" />

:::
::: info 🏷️ Type

Repeater

:::
::: info ⭐ Default Value

包含多个预设分享按钮：总阅读量、总 post 数、总点赞数、总评论数、总分类数、总字数（Requires[API 扩展包插件](/guide/plugin-compatibility#api-扩展包)）。

:::

> [!NOTE] 💡 示例值
>
> ::: tip 📂 Configuration 项名
>
> 统计项
>
> :::
> ::: info 🏷️ Type
>
> Option
>
> :::
> ::: info ⭐ Default Value
>
> 总阅读量（internal value `visit`）
>
> :::
> ::: info 💡 Other Options
>
> - 总 post 数（internal value `post`）
> - 总点赞数（internal value `upvote`）
> - 总评论数（internal value `comment`）
> - 总分类数（internal value `category`）
> - 总字数（internal value `wordcount`）
>
> :::
> ::: info 🔒 Internal Constraints
>
> Required field
>
> :::
> ::: tip 📂 Configuration 项名
>
> 多语言文本包裹数字
>
> :::
> ::: info 🏷️ Type
>
> Boolean
>
> :::
> ::: info ⭐ Default Value
>
> `true`
>
> :::
> ::: tip 📂 Configuration 项名
>
> 文字左侧的 Icon
>
> :::
> ::: info 🏷️ Type
>
> Icon
>
> :::
> ::: info ⭐ Default Value
>
> Empty
>
> :::

### page 底部主题信息

::: info 🎯 Purpose

Controls whetherDisplaypage 底部主题信息。

:::
::: info 📂 Configuration Item Location

General Styles -> page 底部主题信息

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=page底部主题信息" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`theme.config?.styles?.is_footer_theme_info_show`

:::
::: info ℹ️ Additional Information

When enabled, you can configure:

- [page 底部主题信息所展示的主题名](#page-底部主题信息所展示的主题名)
- [page 底部主题信息所展示的 Halo 版本](#page-底部主题信息所展示的-halo-版本)

:::

#### page 底部主题信息所展示的主题名

::: info 🎯 Purpose

Setpage 底部主题信息所展示的主题名。

:::
::: info 📂 Configuration Item Location

（[General Styles -> page 底部主题信息](#page-底部主题信息)When enabled, will display）

General Styles -> 版权信息 Custom 署名

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=page底部主题信息所展示的主题名" />

:::
::: info 🏷️ Type

Option

:::
::: info ⭐ Default Value

Higan Haozi (internal value `Higan Haozi`）

:::
::: info 💡 Other Options

- Higan（internal value `Higan`）
- 彼岸（internal value `彼岸`）

:::
::: info 🧩 Template Variable

`theme.config?.styles?.footer_theme_info_theme_name`

:::

#### page 底部主题信息所展示的 Halo 版本

::: info 🎯 Purpose

Setpage 底部主题信息所展示的 Halo 版本。

:::
::: info 📂 Configuration Item Location

（[General Styles -> page 底部主题信息](#page-底部主题信息)When enabled, will display）

General Styles -> page 底部主题信息所展示的 Halo 版本

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=page底部主题信息所展示的%20Halo%20版本" />

:::
::: info 🏷️ Type

Option

:::
::: info ⭐ Default Value

Halo (internal value `Halo`）

:::
::: info 💡 Other Options

- Halo Pro（internal value `Halo Pro`）
- Halo 专业版（internal value `Halo 专业版`）

:::
::: info 🧩 Template Variable

`theme.config?.styles?.footer_theme_info_halo_version_name`

:::

### page 底部版权信息

::: info 🎯 Purpose

Controls whetherDisplaypage 底部版权信息。

:::
::: info 📂 Configuration Item Location

General Styles -> page 底部版权信息

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=page底部版权信息" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`theme.config?.styles?.is_footer_copyright_show`

:::
::: info ℹ️ Additional Information

When enabled, you can configure:

- [版权信息 Custom 署名](#版权信息-custom-署名)

:::

#### 版权信息 Custom 署名

::: info 🎯 Purpose

Setpage 底部版权信息的署名。

:::
::: info 📂 Configuration Item Location

（[General Styles -> page 底部版权信息](#page-底部版权信息)When enabled, will display）

General Styles -> 版权信息 Custom 署名

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=版权信息Custom署名" />

:::
::: info 🏷️ Type

String

:::
::: info ⭐ Default Value

Empty

:::
::: info 💡 Example Values

`HowieHz`

:::
::: info 🧩 Template Variable

`theme.config?.styles?.footer_copyright_custom_name`

:::

### 强制页脚、页码 Inpage 底部

::: info 🎯 Purpose

Controls whether 强制页脚、页码 Inpage 底部。

:::
::: info 📂 Configuration Item Location

General Styles -> 强制页脚、页码 Inpage 底部

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=强制页脚、页码Inpage底部" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`theme.config?.styles?.is_footer_force_bottom`

:::

### page 底部菜单

::: info 🎯 Purpose

Controls whetherDisplaypage 底部菜单。

:::
::: info 📂 Configuration Item Location

General Styles -> page 底部菜单

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=page底部菜单" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`theme.config?.styles?.is_footer_menu_show`

:::

### 添加内容到 page 最底部

::: info 🎯 Purpose

控制添加内容到 page 最底部。

:::
::: info 📂 Configuration Item Location

General Styles -> 添加内容到 page 最底部

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=添加内容到page最底部" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.styles?.is_footer_content_show`

:::
::: info ℹ️ Additional Information

In Halo CMS 的后台（<QuickJumpConfig to="/console/settings?tab=codeInjection:~:text=页脚" label="快速跳转" />）Set 的页脚内容，Display 位置 In“主题信息”、“版权信息”、“底部菜单”之上。  
而此处填写页脚内容的 In“底部菜单”之下，为 page 的最底部。

When enabled, you can configure:

- [page 最底部内容](#page-最底部内容)
- [多语言 page 最底部内容 Support](#多语言-page-最底部内容-support)
  - [Custom 多语言 page 最底部内容](#custom-多语言-page-最底部内容)

:::

#### page 最底部内容

::: info 🎯 Purpose

Setpage 最底部内容内容。

:::
::: info 📂 Configuration Item Location

（[Home Page Style -> page 最底部内容](#page-最底部内容)When enabled, will display）

Home Page Style -> page 最底部内容

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=page最底部内容" />

:::
::: info 🏷️ Type

Code input box (HTML)

:::
::: info ⭐ Default Value

Empty

:::
::: info 💡 Example Values

```html
已经结束了！
```

HTML 代码也是 can 以的：

```html
<code>下面已经没有东西了</code>
```

:::
::: info ⚠️ External Constraints

合法的 HTML 代码。

:::
::: info 🧩 Template Variable

`theme.config?.styles?.footer_content`

:::

#### 多语言 page 最底部内容 Support

::: info 🎯 Purpose

Controls whetherEnable 多语言 page 最底部内容 Support。

:::
::: info 📂 Configuration Item Location

（[Home Page Style -> page 最底部内容](#page-最底部内容)When enabled, will display）

Home Page Style -> 多语言 page 最底部内容 Support

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=多语言page最底部内容Support" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.styles?.is_18n_footer_content_show`

:::
::: info ℹ️ Additional Information

Enable 后请参照[多语言 page 最底部内容 Use 指南](/tutorial/i18n#多语言page最底部内容Use指南)进行 Configuration

:::

#### Custom 多语言 page 最底部内容

::: info 🎯 Purpose

Set 多语言 page 最底部内容内容。

:::
::: info 📂 Configuration Item Location

（[Home Page Style -> page 最底部内容](#page-最底部内容)When enabled, will display）

Home Page Style -> Custom 多语言 page 最底部内容

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=Custom多语言page最底部内容" />

:::
::: info 🏷️ Type

Repeater

:::

> [!NOTE] ⭐ 默认值
>
> ::: tip 📂 Configuration 项名
>
> 语言代码
>
> :::
> ::: info 🏷️ Type
>
> String
>
> :::
> ::: info ⭐ Default Value
>
> `zh`
>
> :::
> ::: info 💡 Example Values
>
> `zh`、`zh-CN`、`zh-Hans`、`en`、`en-US`
>
> :::
> ::: info 🔒 Internal Constraints
>
> Required field
>
> :::
> ::: info ⚠️ External Constraints
>
> Set 值 Requires 满足 [BCP 47](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Global_attributes/lang#:~:text=%E5%A6%82%E6%9E%9C%E6%A0%87%E7%AD%BE%E5%86%85%E5%AE%B9%E6%98%AF%E6%97%A0%E6%95%88%E7%9A%84%EF%BC%8C%E6%A0%B9%E6%8D%AE%20BCP47%EF%BC%8C%E5%AE%83%E5%B0%B1%E8%AE%BE%E4%B8%BA%E6%97%A0%E6%95%88%E3%80%82)，否则无效。
>
> :::
> ::: tip 📂 Configuration 项名
>
> page 最底部内容
>
> :::
> ::: info 🏷️ Type
>
> Code input box (HTML）
>
> :::
> ::: info ⭐ Default Value
>
> Empty
>
> :::
> ::: info 💡 Example Values
>
> ```html
> 已经结束了！
> ```
>
> HTML 代码也是 can 以的：
>
> ```html
> <code>下面已经没有东西了</code>
> ```
>
> :::
> ::: info ⚠️ External Constraints
>
> 合法的 HTML 代码。
>
> :::

::: info 🧩 Template Variable

`theme.config?.styles?.i18n_footer_content`

:::

### 为三级标题添加下划线

::: info 🎯 Purpose

Enablewhen，In 三级标题（h3）下方 Display 下划线装饰，让标题更加突出。

:::
::: info 📂 Configuration Item Location

General Styles -> 为三级标题添加下划线

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=为三级标题添加下划线" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`theme.config?.styles?.is_h3_underline`

:::

### 引用块保留 Empty 行

::: info 🎯 Purpose

In 引用块中保留 Empty 行，否则将自动删除引用块中的 Empty 行。

:::
::: info 📂 Configuration Item Location

General Styles -> 引用块保留 Empty 行

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=引用块保留Empty行" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`theme.config?.styles?.is_preserve_empty_lines_in_blockquote`

:::
::: info ℹ️ Additional Information

引用块写法请参考[写作样式](/guide/style-reference#引用块)。

:::

### 引用块前添加引号

::: info 🎯 Purpose

In 引用块前添加引号。

:::
::: info 📂 Configuration Item Location

General Styles -> 引用块前添加引号

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=引用块前添加引号" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`theme.config?.styles?.is_show_the_quote_before_blockquote`

:::

### 引用块后添加引号

::: info 🎯 Purpose

In 引用块后添加引号。

:::
::: info 📂 Configuration Item Location

General Styles -> 引用块后添加引号

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=引用块后添加引号" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.styles?.is_show_the_quote_after_blockquote`

:::

### 表格行间线（除表头）

::: info 🎯 Purpose

Whether 为表格每行底部添加表格线（除表头）。

:::
::: info 📂 Configuration Item Location

General Styles -> 表格行间线（除表头）

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=表格行间线" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.styles?.is_show_the_table_bottom_border`

:::
::: info ℹ️ Additional Information

When enabled, you can configure:

<!-- markdownlint-disable MD051 -->

- [表格行间线宽度（除表头）](#表格行间线宽度-除表头)
<!-- markdownlint-enable MD051 -->

:::

### 表格行间线宽度（除表头）

::: info 🎯 Purpose

Set 表格每行底部添表格线的宽度（除表头）。

:::
::: info 📂 Configuration Item Location

<!-- markdownlint-disable MD051 -->

（[General Styles -> 表格行间线（除表头）](#表格行间线-除表头)When enabled, will display）

<!-- markdownlint-enable MD051 -->

General Styles -> 表格行间线宽度（除表头）

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=表格行间线宽度" />

:::
::: info 🏷️ Type

String

:::
::: info ⭐ Default Value

`8px`

:::
::: info 💡 Example Values

`0px`、`5px`、`10%`、`1rem`

:::
::: info ⚠️ External Constraints

Valid CSS length unit.

:::
::: info 🧩 Template Variable

`theme.config?.styles?.table_bottom_border_width`

:::

### 标题上边距倍率

::: info 🎯 Purpose

Set[标题](/guide/style-reference#标题)的上边距 (`margin-top`) 倍率。

:::
::: info 📂 Configuration Item Location

General Styles -> 标题上边距倍率

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=标题上边距倍率" />

:::
::: info 🏷️ Type

Float/Integer

:::
::: info ⭐ Default Value

`1`

:::
::: info 💡 Example Values

`0.5`、`1`、`1.5`、`2`

:::
::: info 🔒 Internal Constraints

值 Range 为 0-5

:::
::: info 🧩 Template Variable

`theme.config?.styles?.heading_margin_top_multiplier`

:::
::: info ℹ️ Additional Information

值为 1 表示 Use 默认边距，小于 1 减小边距，大于 1 增加边距。

:::

### 标题下边距倍率

::: info 🎯 Purpose

Set[标题](/guide/style-reference#标题)的下边距 (`margin-bottom`) 倍率。

:::
::: info 📂 Configuration Item Location

General Styles -> 标题下边距倍率

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=标题下边距倍率" />

:::
::: info 🏷️ Type

Float/Integer

:::
::: info ⭐ Default Value

`1`

:::
::: info 💡 Example Values

`0.5`、`1`、`1.5`、`2`

:::
::: info 🔒 Internal Constraints

值 Range 为 0-5

:::
::: info 🧩 Template Variable

`theme.config?.styles?.heading_margin_bottom_multiplier`

:::

### 段落上边距倍率

::: info 🎯 Purpose

Set[段落](/guide/style-reference#段落)的上边距倍率。

:::
::: info 📂 Configuration Item Location

General Styles -> 段落上边距倍率

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=段落上边距倍率" />

:::
::: info 🏷️ Type

Float/Integer

:::
::: info ⭐ Default Value

`1`

:::
::: info 💡 Example Values

`0.5`、`1`、`1.5`、`2`

:::
::: info 🔒 Internal Constraints

值 Range 为 0-5

:::
::: info 🧩 Template Variable

`theme.config?.styles?.paragraph_margin_top_multiplier`

:::

### 段落下边距倍率

::: info 🎯 Purpose

Set[段落](/guide/style-reference#段落)的下边距倍率。

:::
::: info 📂 Configuration Item Location

General Styles -> 段落下边距倍率

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=段落下边距倍率" />

:::
::: info 🏷️ Type

Float/Integer

:::
::: info ⭐ Default Value

`1`

:::
::: info 💡 Example Values

`0.5`、`1`、`1.5`、`2`

:::
::: info 🔒 Internal Constraints

值 Range 为 0-5

:::
::: info 🧩 Template Variable

`theme.config?.styles?.paragraph_margin_bottom_multiplier`

:::

## Home Page Style

应用 Range：[`/(page/{page})`](</reference/template-map#:~:text=/(page/%7Bpage%7D)>)。

### 主页 HTML 标题

::: info 🎯 Purpose

Custom 主页的 HTML 标题（willDisplayIn 浏览器标签页上）。

:::
::: info 📂 Configuration Item Location

Home Page Style -> 主页 HTML 标题

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=主页%20HTML%20标题" />

:::
::: info 🏷️ Type

String

:::
::: info ⭐ Default Value

Empty

:::
::: info ⚠️ External Constraints

IfConfiguration 值过长，cancan 影响 SEO 和 pageDisplay 效果。

:::
::: info 🧩 Template Variable

`theme.config?.index_styles?.page_html_title`

:::
::: info ℹ️ Additional Information

如置 Empty 则取值 Halo CMS 的后台（<QuickJumpConfig to="/console/settings:~:text=站点标题" label="快速跳转" />）Set 的站点标题。

:::

### 一言（hitokoto）

::: info 🎯 Purpose

WhetherIn 首页 Display 一言（hitokoto）随机句子服务的内容。

:::
::: info 📂 Configuration Item Location

Home Page Style -> 一言（hitokoto）

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=一言（hitokoto）" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.index_styles?.hitokoto`

:::
::: info ℹ️ Additional Information

When enabled, you can configure

- 一言（hitokoto）服务链接：
  - 默认值：`https://v1.hitokoto.cn/?encode=js`
  - 补充说明：相关信息 can 阅读其[文档](https://developer.hitokoto.cn/sentence/)获取

:::

### Custom 随机 Display 一句话

::: info 🎯 Purpose

WhetherIn 首页随机 Display 一句话。

:::
::: info 📂 Configuration Item Location

Home Page Style -> Custom 随机 Display 一句话

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=Custom随机Display一句话" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.index_styles?.is_random_sentence_show`

:::
::: info ℹ️ Additional Information

When enabled, you can configure

- Custom 句子内容

:::

### 个人简介/公告栏

::: info 🎯 Purpose

In 首页 Display 个人简介 or 公告栏内容。

:::
::: info 📂 Configuration Item Location

Home Page Style -> 个人简介/公告栏

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=个人简介/公告栏" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.index_styles?.is_resume_show`

:::
::: info ℹ️ Additional Information

When enabled, you can configure

- 个人简介/公告栏内容
- 多语言个人简介/公告栏 Support
  - Custom 多语言公告栏内容

:::

#### 多语言个人简介/公告栏 Support

::: info 🎯 Purpose

Controls whetherEnable 多语言个人简介/公告栏 Support。

:::
::: info 📂 Configuration Item Location

<!-- markdownlint-disable MD051 -->

（[Home Page Style -> 个人简介/公告栏](#个人简介-公告栏)When enabled, will display）

<!-- markdownlint-enable MD051 -->

Home Page Style -> 多语言个人简介/公告栏 Support

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=多语言个人简介/公告栏Support" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.index_styles?.is_i18n_resume_show`

:::
::: info ℹ️ Additional Information

Enable 后请参照[多语言个人简介/公告栏 Use 指南](/tutorial/i18n#多语言个人简介-公告栏Use指南)进行 Configuration

:::

#### Custom 多语言公告栏内容

::: info 🎯 Purpose

Set 多语言公告栏内容。

:::
::: info 📂 Configuration Item Location

<!-- markdownlint-disable MD051 -->

（[Home Page Style -> 个人简介/公告栏](#个人简介-公告栏)When enabled, will display）

<!-- markdownlint-enable MD051 -->

Home Page Style -> Custom 多语言公告栏内容

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=Custom多语言公告栏内容" />

:::
::: info 🏷️ Type

Repeater

:::

> [!NOTE] ⭐ 默认值
>
> ::: tip 📂 Configuration 项名
>
> 语言代码
>
> :::
> ::: info 🏷️ Type
>
> String
>
> :::
> ::: info ⭐ Default Value
>
> `zh`
>
> :::
> ::: info 💡 Example Values
>
> `zh`、`zh-CN`、`zh-Hans`、`en`、`en-US`
>
> :::
> ::: info 🔒 Internal Constraints
>
> Required field
>
> :::
> ::: info ⚠️ External Constraints
>
> Set 值 Requires 满足 [BCP 47](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Global_attributes/lang#:~:text=%E5%A6%82%E6%9E%9C%E6%A0%87%E7%AD%BE%E5%86%85%E5%AE%B9%E6%98%AF%E6%97%A0%E6%95%88%E7%9A%84%EF%BC%8C%E6%A0%B9%E6%8D%AE%20BCP47%EF%BC%8C%E5%AE%83%E5%B0%B1%E8%AE%BE%E4%B8%BA%E6%97%A0%E6%95%88%E3%80%82)，否则无效。
>
> :::
> ::: tip 📂 Configuration 项名
>
> 个人简介/公告栏内容
>
> :::
> ::: info 🏷️ Type
>
> Code input box (HTML）
>
> :::
> ::: info ⭐ Default Value
>
> Empty
>
> :::
> ::: info 💡 Example Values
>
> ```html
> 欢迎大家访问此站点！
> ```
>
> HTML 代码也是 can 以的：
>
> ```html
> <code>Support 填写 HTML 代码</code>
> ```
>
> :::
> ::: info ⚠️ External Constraints
>
> 合法的 HTML 代码。
>
> :::

::: info 🧩 Template Variable

`theme.config?.index_styles?.i18n_resume`

:::

### 社交资料 Icon 左侧文字

::: info 🎯 Purpose

Controls whetherDisplay 首页社交资料 Icon 左侧的文字。

:::
::: info 📂 Configuration Item Location

Home Page Style -> 社交资料 Icon 左侧文字

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=社交资料Icon左侧文字" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`theme.config?.index_styles?.is_show_find_me_left_text`

:::

### 首页 post 列表标题

::: info 🎯 Purpose

Controls whetherDisplay 首页 post 列表的标题。

:::
::: info 📂 Configuration Item Location

Home Page Style -> 首页 post 列表标题

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=首页post列表标题" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`theme.config?.index_styles?.is_show_index_post_list_title`

:::

### 主页列表布局

::: info 🎯 Purpose

选择首页的 post 列表 Display 样式。

:::
::: info 📂 Configuration Item Location

Home Page Style -> 主页列表布局

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=主页列表布局" />

:::
::: info 🏷️ Type

Option

:::
::: info ⭐ Default Value

`简洁post列表`（internal value `simple-post-list`）

:::
::: info 💡 Other Options

- 多元 post 列表（internal value `post-list-summary`）
- 瞬间列表（internal value `moment-list-summary`）

:::
::: info 🧩 Template Variable

`theme.config?.index_styles?.list_layout`

:::
::: info ℹ️ Additional Information

"瞬间列表"Requires[瞬间页](/guide/plugin-compatibility#瞬间页)插件 Enable 后方 can.

根据选择的布局类型，willDisplay 不同的 ConfigurationOption。

简洁列表 When enabled, you can configure

- [Display publish date](#简洁列表-display-publish-date)
- [Displaypost 阅读量](#简洁列表-displaypost-阅读量)

多元列表 When enabled, you can configure

- [Display publish date](#多元列表-display-publish-date)
- [Displaypost 分类](#多元列表-displaypost-分类)
- [Displaypost 标签](#多元列表-displaypost-标签)
- [Displaypost 阅读量](#多元列表-displaypost-阅读量)
- [Displaypost 预计阅读 when 间](#多元列表-displaypost-预计阅读-when-间)
- [Displaypost 字数统计](#多元列表-displaypost-字数统计)
- [Displaypost 摘要](#多元列表-displaypost-摘要)
- [post 摘要行数上限](#多元列表-post-摘要行数上限)
- [跳转 post 链接所用提示文字](#多元列表跳转-post-链接所用提示文字)
- [Displaypost 封面](#多元列表-displaypost-封面)

瞬间列表 When enabled, you can configure

- [Display 条数](#瞬间列表-display-条数)
- [Display 条目作者头像](#瞬间列表-display-条目作者头像)
- [Display 条目作者昵称](#瞬间列表-display-条目作者昵称)

:::

### 简洁列表 Display publish date

::: info 🎯 Purpose

Controls whether to display publish date in the simple post list.

:::
::: info 📂 Configuration Item Location

（[Home Page Style -> 主页列表布局](#主页列表布局)Set 为"简洁 post 列表"whenDisplay）

Home Page Style -> 简洁列表 Display publish date

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=简洁列表显示发布日期" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`theme.config?.index_styles?.is_show_post_pubdate_in_simple_post_list`

:::

### 简洁列表 Displaypost 阅读量

::: info 🎯 Purpose

Controls whetherIn 简洁列表中 Displaypost 阅读量。

:::
::: info 📂 Configuration Item Location

（[Home Page Style -> 主页列表布局](#主页列表布局)Set 为“简洁 post 列表”whenDisplay）

Home Page Style -> 简洁列表 Displaypost 阅读量

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=简洁列表Displaypost阅读量" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.index_styles?.is_show_post_views_in_simple_post_list`

:::

### 多元列表 Display publish date

::: info 🎯 Purpose

Controls whether to display publish date in the post list summary.

:::
::: info 📂 Configuration Item Location

（[Home Page Style -> 主页列表布局](#主页列表布局)Set 为"多元 post 列表"whenDisplay）

Home Page Style -> 多元列表 Display publish date

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=多元列表显示发布日期" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`theme.config?.index_styles?.is_show_post_pubdate_in_post_list_summary`

:::

### 多元列表 Displaypost 分类

::: info 🎯 Purpose

Controls whetherIn 多元列表中 Displaypost 分类。

:::
::: info 📂 Configuration Item Location

（[Home Page Style -> 主页列表布局](#主页列表布局)Set 为“多元 post 列表”whenDisplay）

Home Page Style -> 多元列表 Displaypost 分类

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=多元列表Displaypost分类" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`theme.config?.index_styles?.is_show_post_categories_in_post_list_summary`

:::

### 多元列表 Displaypost 标签

::: info 🎯 Purpose

Controls whetherIn 多元列表中 Displaypost 标签。

:::
::: info 📂 Configuration Item Location

（[Home Page Style -> 主页列表布局](#主页列表布局)Set 为“多元 post 列表”whenDisplay）

Home Page Style -> 多元列表 Displaypost 标签

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=多元列表Displaypost标签" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`theme.config?.index_styles?.is_show_post_tags_in_post_list_summary`

:::

### 多元列表 Displaypost 阅读量

::: info 🎯 Purpose

Controls whetherIn 多元列表中 Displaypost 阅读量。

:::
::: info 📂 Configuration Item Location

（[Home Page Style -> 主页列表布局](#主页列表布局)Set 为“多元 post 列表”whenDisplay）

Home Page Style -> 多元列表 Displaypost 阅读量

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=多元列表Displaypost阅读量" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`theme.config?.index_styles?.is_show_post_views_in_post_list_summary`

:::

### 多元列表 Displaypost 预计阅读 when 间

::: info 🎯 Purpose

Controls whetherIn 多元列表中 Displaypost 预计阅读 when 间。

:::
::: info 📂 Configuration Item Location

（[Home Page Style -> 主页列表布局](#主页列表布局)Set 为“多元 post 列表”whenDisplay）

Home Page Style -> 多元列表 Displaypost 预计阅读 when 间

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=多元列表Displaypost预计阅读when间" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.index_styles?.is_show_post_estimated_reading_time_in_post_list_summary`

:::
::: info ℹ️ Additional Information

Enable [API 拓展](/guide/plugin-compatibility#api-扩展)插件后将自动 Enable 更准确的计量方法。

:::

### 多元列表 Displaypost 字数统计

::: info 🎯 Purpose

Controls whetherIn 多元列表中 Displaypost 字数统计。

:::
::: info 📂 Configuration Item Location

（[Home Page Style -> 主页列表布局](#主页列表布局)Set 为“多元 post 列表”whenDisplay）

Home Page Style -> 多元列表 Displaypost 字数统计

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=多元列表Displaypost字数统计" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.index_styles?.is_show_post_word_count_in_post_list_summary`

:::
::: info ℹ️ Additional Information

Enable [API 拓展](/guide/plugin-compatibility#api-扩展)插件后将自动 Enable 更准确的计量方法。

:::

### 多元列表 Displaypost 摘要

::: info 🎯 Purpose

Controls whetherIn 多元列表中 Displaypost 摘要。

:::
::: info 📂 Configuration Item Location

（[Home Page Style -> 主页列表布局](#主页列表布局)Set 为“多元 post 列表”whenDisplay）

Home Page Style -> 多元列表 Displaypost 摘要

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=多元列表Displaypost摘要" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`theme.config?.index_styles?.is_show_post_excerpt_in_post_list_summary`

:::

### 多元列表 post 摘要行数上限

::: info 🎯 Purpose

Set 多元列表中 post 摘要的最大行数。

:::
::: info 📂 Configuration Item Location

（[Home Page Style -> 主页列表布局](#主页列表布局)Set 为“多元 post 列表”whenDisplay）

Home Page Style -> 多元列表 post 摘要行数上限

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=多元列表post摘要行数上限" />

:::
::: info 🏷️ Type

Integer

:::
::: info ⭐ Default Value

`3`

:::
::: info 🔒 Internal Constraints

Range 1-5

:::
::: info 🧩 Template Variable

`theme.config?.index_styles?.post_excerpt_max_lines`

:::

### 多元列表跳转 post 链接所用提示文字

::: info 🎯 Purpose

Controls whetherIn 多元列表中 Display 跳转 post 链接的提示文字。

:::
::: info 📂 Configuration Item Location

（[Home Page Style -> 主页列表布局](#主页列表布局)Set 为“多元 post 列表”whenDisplay）

Home Page Style -> 多元列表跳转 post 链接所用提示文字

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=多元列表跳转post链接所用提示文字" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`theme.config?.index_styles?.is_show_index_post_list_permalink_text`

:::
::: info ℹ️ Additional Information

如 Disablethis option，首页 post 列表 post 项将不 Display 跳转链接文字

:::

### 多元列表 Displaypost 封面

::: info 🎯 Purpose

Controls whetherIn 多元列表中 Displaypost 封面。

:::
::: info 📂 Configuration Item Location

（[Home Page Style -> 主页列表布局](#主页列表布局)Set 为“多元 post 列表”whenDisplay）

Home Page Style -> 多元列表 Displaypost 封面

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=多元列表Displaypost封面" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`theme.config?.index_styles?.is_show_post_cover_in_post_list_summary`

:::

### 瞬间列表 Display 条数

::: info 🎯 Purpose

Set 瞬间列表中 Display 的条目数量。

:::
::: info 📂 Configuration Item Location

（[Home Page Style -> 主页列表布局](#主页列表布局)Set 为“瞬间列表”whenDisplay）

Home Page Style -> 瞬间列表 Display 条数

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=瞬间列表Display条数" />

:::
::: info 🏷️ Type

Integer

:::
::: info ⭐ Default Value

`10`

:::
::: info 🧩 Template Variable

`theme.config?.index_styles?.moment_list_page_size`

:::

### 瞬间列表 Display 条目作者头像

::: info 🎯 Purpose

Controls whetherIn 瞬间列表中 Display 条目作者头像。

:::
::: info 📂 Configuration Item Location

（[Home Page Style -> 主页列表布局](#主页列表布局)Set 为“瞬间列表”whenDisplay）

Home Page Style -> 瞬间列表 Display 条目作者头像

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=瞬间列表Display条目作者头像" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`theme.config?.index_styles?.is_show_moment_avatar`

:::

### 瞬间列表 Display 条目作者昵称

::: info 🎯 Purpose

Controls whetherIn 瞬间列表中 Display 条目作者昵称。

:::
::: info 📂 Configuration Item Location

（[Home Page Style -> 主页列表布局](#主页列表布局)Set 为“瞬间列表”whenDisplay）

Home Page Style -> 瞬间列表 Display 条目作者昵称

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=瞬间列表Display条目作者昵称" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`theme.config?.index_styles?.is_show_moment_nickname`

:::

### post 列表置顶 Icon

::: info 🎯 Purpose

Inpost 列表中为置顶 postDisplay 特殊 icon.

:::
::: info 📂 Configuration Item Location

Home Page Style -> post 列表置顶 Icon

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=post列表置顶Icon" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`theme.config?.index_styles?.is_pin_icon_show`

:::
::: info ℹ️ Additional Information

When enabled, you can configure

- 置顶 Icon 的位置（标题左侧 or 右侧），默认为右侧。

:::

## Post Page Style

应用 Range：[`/archives/{slug}`](/reference/template-map#:~:text=/archives/%7Bslug%7D)。

### 优化 post 段落 Empty 行 Display

::: info 🎯 Purpose

为 post 内容段落添加最小高度，以 DisplayEmpty 行。

:::
::: info 📂 Configuration Item Location

post 页样式 -> 优化 post 段落 Empty 行 Display

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=优化post段落Empty行Display" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.post_styles?.is_optimize_content_paragraph_spacing`

:::
::: details ℹ️ 补充信息

不同 Markdown 编辑器所用解析器不同，故此 Configuration 项反映到最终渲染结果上，cancanwill 有所不同。  
相关链接：[babelmark3](https://babelmark.github.io/) 是一个对比不同 Markdown 解析器解析结果的网站。

:::

### 文档段落首行缩进

::: info 🎯 Purpose

为 post 内容段落首行添加缩进样式。

:::
::: info 📂 Configuration Item Location

post 页样式 -> 段落首行缩进

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=段落首行缩进" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.post_styles?.is_enable_paragraph_first_line_indent`

:::
::: info ℹ️ Additional Information

When enabled, you can configure

- 首行缩进值
  - 类型：String
  - 默认值：`2em`（2 字符宽度）
  - 外部约束：CSS 长度单位。Such as: 20rem, 300px, 30vw。

:::

### post 标题大写

::: info 🎯 Purpose

将 post 标题中字符转换为对应大写表示。

Such as: `a` 转换为 `A`。

:::
::: info 📂 Configuration Item Location

post 页样式 -> post 标题大写

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=post标题大写" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.post_styles?.post_title_uppper`

:::

### post 发布 when 间

::: info 🎯 Purpose

Inpostpage 顶部 Displaypost 的发布 when 间。

:::
::: info 📂 Configuration Item Location

post 页样式 -> post 发布 when 间

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=post发布when间" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`theme.config?.post_styles?.is_show_post_publish_time`

:::
::: info ℹ️ Additional Information

When enabled, you can configure

- post 发布 when 间左侧文字

:::

### post 更新 when 间

::: info 🎯 Purpose

Inpostpage 顶部 Displaypost 的最后更新 when 间。

:::
::: info 📂 Configuration Item Location

post 页样式 -> post 更新 when 间

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=post更新when间" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.post_styles?.is_show_post_updated_time`

:::
::: info ℹ️ Additional Information

When enabled, you can configure

- post 更新 when 间左侧文字

:::

### post 阅读量

::: info 🎯 Purpose

InpostpageDisplaypost 的阅读量统计。

:::
::: info 📂 Configuration Item Location

post 页样式 -> post 阅读量

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=post阅读量" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`theme.config?.post_styles?.is_show_post_views`

:::

### post 预计阅读 when 间

::: info 🎯 Purpose

InpostpageDisplay 根据 post 字数估算的阅读 when 间。

:::
::: info 📂 Configuration Item Location

post 页样式 -> post 预计阅读 when 间

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=post预计阅读when间" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.post_styles?.is_show_post_estimated_reading_time`

:::
::: info ℹ️ Additional Information

Enable [API 拓展](/guide/plugin-compatibility#api-扩展)插件后将自动 Enable 更准确的计量方法。

:::

### post 字数统计

::: info 🎯 Purpose

InpostpageDisplaypost 的总字数。

:::
::: info 📂 Configuration Item Location

post 页样式 -> post 字数统计

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=post字数统计" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.post_styles?.is_show_post_word_count`

:::
::: info ℹ️ Additional Information

Enable [API 拓展](/guide/plugin-compatibility#api-扩展)插件后将自动 Enable 更准确的计量方法。

:::

### 桌面端菜单中的分享按钮

::: info 🎯 Purpose

Controls whetherIn 桌面端 postpage 的菜单中 Display 分享按钮。

:::
::: info 📂 Configuration Item Location

post 页样式 -> 桌面端菜单中的分享按钮

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=桌面端菜单中的分享按钮" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`theme.config?.post_styles?.is_show_post_nav_share_button`

:::

### Custom 侧边目录最大宽度

::: info 🎯 Purpose

Enable 后 can 以 Configuration

- postpage 右侧边栏目录的最大宽度。

:::
::: info 📂 Configuration Item Location

post 页样式 -> Custom 侧边目录最大宽度

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=Custom侧边目录最大宽度" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.post_styles?.is_custom_toc_max_width`

:::
::: info ℹ️ Additional Information

When enabled, you can configure

- 侧边目录最大宽度
  - 类型：String
  - 默认值：`20rem`
  - 外部约束：CSS 长度单位。Such as: 20rem, 300px, 30vw。

:::

### post 末尾的的分隔线

::: info 🎯 Purpose

Controls whetherDisplaypost 末尾的的分隔线。

:::
::: info 📂 Configuration Item Location

post 页样式 -> post 末尾的的分隔线

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=post末尾的的分隔线" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`theme.config?.post_styles?.is_dividing_line_at_the_end_of_post_show`

:::

### post 底部的点赞按钮

::: info 🎯 Purpose

Controls whetherDisplaypost 底部的点赞按钮。

:::
::: info 📂 Configuration Item Location

post 页样式 -> post 底部的点赞按钮

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=post底部的点赞按钮" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.post_styles?.is_post_upvote_button_show`

:::
::: info ℹ️ Additional Information

When enabled, you can configure

- 点赞按钮宽度
  - 类型：String
  - 默认值：`1rem`
  - 外部约束：CSS 长度单位。Such as: 20rem, 300px, 30vw。
- 点赞按钮高度
  - 类型：String
  - 默认值：`1rem`
  - 外部约束：CSS 长度单位。Such as: 20rem, 300px, 30vw。
- 展示 post 获赞数
- 点赞按钮位置

:::

### post 底部的推荐 post

::: info 🎯 Purpose

Controls whetherInpost 底部 Display 推荐 post 列表。

原理：读取 When 前 post**第一个分类**，并且随机输出其中 If 干个 post。

:::
::: info 📂 Configuration Item Location

post 页样式 -> post 底部的推荐 post

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=post底部的推荐post" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.post_styles?.is_post_recommended_articles_show`

:::
::: info ℹ️ Additional Information

IfWhen 前 postIn 随机列表中 will 被剔除，因此实际推荐 post 数 cancan 小于 Set 的“推荐 post 数量”。  
IfWhen 前 post**未 Set 分类**，this 功 canwill 被**Disable**。  
If**分类仅有一篇 post**，this 功 canwill 被**Disable**。

When enabled, you can configure

- 推荐 post 数量

:::

### post 底部的相邻 post 导航

::: info 🎯 Purpose

Enable 后将 Inpost 底部 Display 上一篇和下一篇 post 的导航链接。

:::
::: info 📂 Configuration Item Location

post 页样式 -> post 底部的相邻 post 导航

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=post底部的相邻post导航" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.post_styles?.is_post_prev_next_navigation_show`

:::

### post 评论区

::: info 🎯 Purpose

Controls whetherInpostpageDisplay 评论区。

:::
::: info 📂 Configuration Item Location

post 页样式 -> post 评论区

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=post评论区" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`theme.config?.post_styles?.is_post_comment_section_show`

:::

### 移动端底部导航栏

::: info 🎯 Purpose

Controls whetherIn 移动端 postpage 底部 Display 导航栏。

:::
::: info 📂 Configuration Item Location

post 页样式 -> 移动端底部导航栏

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=移动端底部导航栏" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`theme.config?.post_styles?.is_show_footer_nav`

:::
::: info ℹ️ Additional Information

When enabled, you can configure

- 移动端底部导航栏中的分享按钮

:::

## Categories Page Style

应用 Range：[`/categories`](/reference/template-map#:~:text=/categories)。

### 分类集合页 page 描述

::: info 🎯 Purpose

Used forCustomthispage 的 HTML `<meta name="description">` 内容，方便针对 Set SEO 描述。

:::
::: info 📂 Configuration Item Location

Categories Page Style -> page 描述

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/categories_page_styles#:~:text=page描述" />

:::
::: info 🏷️ Type

String

:::
::: info ⭐ Default Value

Empty

:::
::: info 🧩 Template Variable

`theme.config?.categories_page_styles?.description`

:::
::: info ℹ️ Additional Information

Set 为 Empty 将回退到站点描述（快速跳转：<QuickJumpConfig to="/console/settings?tab=seo#:~:text=站点描述" />）

:::

### Display 每个分类下的 post 数量

::: info 🎯 Purpose

Controls whetherIn 分类列表中 Display 每个分类包含的 post 数量。

:::
::: info 📂 Configuration Item Location

Categories Page Style -> Display 每个分类下的 post 数量

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/categories_page_styles#:~:text=Display每个分类下的post数量" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`theme.config?.categories_page_styles?.is_show_the_number_of_articles_per_category`

:::
::: info ℹ️ Additional Information

When enabled, you can configure

- Inpost 数量左侧的字符
  - 类型：String
  - 默认值：`(`
- Inpost 数量右侧的字符
  - 类型：String
  - 默认值：`)`

:::

### Display 多层分类

::: info 🎯 Purpose

Controls whetherIn 分类 page 展示子分类。

:::
::: info 📂 Configuration Item Location

Categories Page Style -> WhetherDisplay 多层分类

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/categories_page_styles#:~:text=WhetherDisplay多层分类" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`theme.config?.categories_page_styles?.is_show_multi_layer_categories`

:::

## Category Detail Page Style

应用 Range：[`/categories/{slug}`](/reference/template-map#:~:text=/categories/%7Bslug%7D)。

### 分类详情页 post 列表 Displaypost 阅读量

::: info 🎯 Purpose

In 分类详情页 Displaypost 阅读量。

:::
::: info 📂 Configuration Item Location

Category Detail Page Style -> post 列表 Displaypost 阅读量

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/category_page_styles#:~:text=post列表Displaypost阅读量" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.category_page_styles?.is_show_post_views_in_post_list`

:::

### Display 分类 RSS 订阅按钮

::: info 🎯 Purpose

In 分类详情页 Display RSS 订阅按钮。

:::
::: info 📂 Configuration Item Location

Category Detail Page Style -> 分类 RSS 订阅按钮

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/category_page_styles#:~:text=分类%20RSS%20订阅按钮" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.category_page_styles?.is_show_rss_button`

:::
::: info ⚠️ External Constraints

Requires [RSS 订阅插件](/guide/plugin-compatibility#rss-订阅插件)Enable 后方 can.

:::

## Tags Page Style

应用 Range：[`/tags`](/reference/template-map#:~:text=/tags)。

### 标签集合页 page 描述

::: info 🎯 Purpose

Used forCustomthispage 的 HTML `<meta name="description">` 内容，方便针对 Set SEO 描述。

:::
::: info 📂 Configuration Item Location

Tags Page Style -> page 描述

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/tags_page_styles#:~:text=page描述" />

:::
::: info 🏷️ Type

String

:::
::: info ⭐ Default Value

Empty

:::
::: info 🧩 Template Variable

`theme.config?.tags_page_styles?.description`

:::
::: info ℹ️ Additional Information

Set 为 Empty 将回退到站点描述（快速跳转：<QuickJumpConfig to="/console/settings?tab=seo#:~:text=站点描述" />）

:::

### Display 每个标签下的 post 数量

::: info 🎯 Purpose

Controls whetherIn 分类列表中 Display 每个标签包含的 post 数量。

:::
::: info 📂 Configuration Item Location

Tags Page Style -> Display 每个标签下的 post 数量

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/tags_page_styles#:~:text=Display每个标签下的post数量" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`theme.config?.tags_page_styles?.is_show_the_number_of_posts_per_tag`

:::
::: info ℹ️ Additional Information

When enabled, you can configure

- Inpost 数量左侧的字符
  - 类型：String
  - 默认值：`(`
- Inpost 数量右侧的字符
  - 类型：String
  - 默认值：`)`
    :::

### 标签排序方式

::: info 🎯 Purpose

Set 标签 In 标签集合页的排序方式。

:::
::: info 📂 Configuration Item Location

Tags Page Style -> 标签排序方式

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/tags_page_styles#:~:text=标签排序方式" />

:::
::: info 🏷️ Type

Option

:::
::: info ⭐ Default Value

默认（internal value `default`）

:::
::: info 💡 Other Options

- 按 post 数量从多到少（internal value `count_desc`）
- 按 post 数量从少到多（internal value `count_asc`）
- 按名称升序（internal value `name_asc`）
- 按名称降序（internal value `name_desc`）

:::
::: info 🧩 Template Variable

`theme.config?.tags_page_styles?.tags_sort_order`

:::

## Tag Detail Page Style

应用 Range：[`/tags/{slug}`](/reference/template-map#:~:text=/tags/%7Bslug%7D)。

### 标签详情页 post 列表 Displaypost 阅读量

::: info 🎯 Purpose

In 标签详情页 Displaypost 阅读量。

:::
::: info 📂 Configuration Item Location

Tag Detail Page Style -> post 列表 Displaypost 阅读量

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/tag_page_styles#:~:text=post列表Displaypost阅读量" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.tag_page_styles?.is_show_post_views_in_post_list`

:::

### Display 标签 RSS 订阅按钮

::: info 🎯 Purpose

In 标签详情页 Display RSS 订阅按钮。

:::
::: info 📂 Configuration Item Location

Tag Detail Page Style -> Display 标签 RSS 订阅按钮

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/tag_page_styles#:~:text=Display标签%20RSS%20订阅按钮" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.tag_page_styles?.is_show_rss_button`

:::
::: info ⚠️ External Constraints

Requires [RSS 订阅插件](/guide/plugin-compatibility#rss-订阅插件)Enable 后方 can.

:::

## Author Detail Page Style

应用 Range：[`/authors/{name}`](/reference/template-map#:~:text=/authors/%7Bname%7D)。

### 作者详情页 page 描述

::: info 🎯 Purpose

Used forCustomthispage 的 HTML `<meta name="description">` 内容，方便针对 Set SEO 描述。

:::
::: info 📂 Configuration Item Location

Author Detail Page Style -> page 描述

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/author_page_styles#:~:text=page描述" />

:::
::: info 🏷️ Type

String

:::
::: info ⭐ Default Value

Empty

:::
::: info 🧩 Template Variable

`theme.config?.author_page_styles?.description`

:::
::: info ℹ️ Additional Information

Set 为 Empty 将回退到站点描述（快速跳转：<QuickJumpConfig to="/console/settings?tab=seo#:~:text=站点描述" />）

:::

### Display 作者 RSS 订阅按钮

::: info 🎯 Purpose

In 作者详情页 Display RSS 订阅按钮。

:::
::: info 📂 Configuration Item Location

Author Detail Page Style -> Display 作者 RSS 订阅按钮

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/author_page_styles#:~:text=Display作者%20RSS%20订阅按钮" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.author_page_styles?.is_show_rss_button`

:::
::: info ⚠️ External Constraints

Requires [RSS 订阅插件](/guide/plugin-compatibility#rss-订阅插件)Enable 后方 can.

:::

## Archives Page Style

应用 Range：[`/archives(/{year}(/{month}))`](</reference/template-map#:~:text=/archives(/%7Byear%7D(/%7Bmonth%7D))>)。

### 归档页 page 描述

::: info 🎯 Purpose

Used forCustomthispage 的 HTML `<meta name="description">` 内容，方便针对 Set SEO 描述。

:::
::: info 📂 Configuration Item Location

Archives Page Style -> page 描述

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/archives_page_styles#:~:text=page描述" />

:::
::: info 🏷️ Type

String

:::
::: info ⭐ Default Value

Empty

:::
::: info 🧩 Template Variable

`theme.config?.archives_page_styles?.description`

:::
::: info ℹ️ Additional Information

Set 为 Empty 将回退到站点描述（快速跳转：<QuickJumpConfig to="/console/settings?tab=seo#:~:text=站点描述" />）

:::

### 按照发布年份和月份折叠 post 列表

::: info 🎯 Purpose

In 归档 page 中，按照 post 发布的年份和月份将 post 列表折叠 Display。

:::
::: info 📂 Configuration Item Location

Archives Page Style -> 按照发布年份和月份折叠 post 列表

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/archives_page_styles#:~:text=按照发布年份和月份折叠post列表" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.archives_page_styles?.is_collapse_post_list_by_publication_year_and_month`

:::
::: info ℹ️ Additional Information

When enabled, you can configure

- 展开折叠动画 when 长（Unit: 毫 seconds）
  - 类型：Float/Integer
  - 默认值：`200`

:::

## Custom Page Style

应用 Range：[`/{slug}`](/reference/template-map#:~:text=/%7Bslug%7D)。

### 优化段落 Empty 行 Display

::: info 🎯 Purpose

为 Custompage 内容段落添加最小高度，以 DisplayEmpty 行。

:::
::: info 📂 Configuration Item Location

Custompage 样式 -> 优化段落 Empty 行 Display

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/custom_page_styles#:~:text=优化段落Empty行Display" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.custom_page_styles?.is_optimize_content_paragraph_spacing`

:::
::: details ℹ️ 补充信息

不同 Markdown 编辑器所用解析器不同，故此 Configuration 项反映到最终渲染结果上，cancanwill 有所不同。  
相关链接：[babelmark3](https://babelmark.github.io/) 是一个对比不同 Markdown 解析器解析结果的网站。

:::

### Custompage 段落首行缩进

::: info 🎯 Purpose

为内容段落首行添加缩进样式。

:::
::: info 📂 Configuration Item Location

Custompage 样式 -> 段落首行缩进

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/custom_page_styles#:~:text=段落首行缩进" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.custom_page_styles?.is_enable_paragraph_first_line_indent`

:::
::: info ℹ️ Additional Information

When enabled, you can configure

- 首行缩进值
  - 类型：String
  - 默认值：`2em`（2 字符宽度）
  - 外部约束：CSS 长度单位。Such as: 20rem, 300px, 30vw。

:::

### page 预计阅读 when 间

::: info 🎯 Purpose

InpageDisplay 根据 post 字数估算的阅读 when 间。

:::
::: info 📂 Configuration Item Location

Custompage 样式 -> page 预计阅读 when 间

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/custom_page_styles#:~:text=page预计阅读when间" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.custom_page_styles?.is_show_post_estimated_reading_time`

:::
::: info ℹ️ Additional Information

Enable [API 拓展](/guide/plugin-compatibility#api-扩展)插件后将自动 Enable 更准确的计量方法。

:::

### page 字数统计

::: info 🎯 Purpose

InpageDisplaypost 的总字数。

:::
::: info 📂 Configuration Item Location

Custompage 样式 -> page 字数统计

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/custom_page_styles#:~:text=page字数统计" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.custom_page_styles?.is_show_post_word_count`

:::
::: info ℹ️ Additional Information

Enable [API 拓展](/guide/plugin-compatibility#api-扩展)插件后将自动 Enable 更准确的计量方法。

:::

### page 正文内容末尾分隔线

::: info 🎯 Purpose

Controls whetherDisplaypage 正文内容末尾的的分隔线。

:::
::: info 📂 Configuration Item Location

Custompage 样式 -> page 正文内容末尾分隔线

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=page正文内容末尾分隔线" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`theme.config?.custom_page_styles?.is_dividing_line_at_the_end_of_content_show`

:::

### page 评论区

::: info 🎯 Purpose

Controls whetherInpageDisplay 评论区。

:::
::: info 📂 Configuration Item Location

Custompage 样式 -> page 评论区

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/custom_page_styles#:~:text=page评论区" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`theme.config?.custom_page_styles?.is_custom_page_comment_section_show`

:::

## Error Page Style

### page 自动重定向

::: info 🎯 Purpose

In 错误 page（如 `404`）自动跳转到 Specifypage。

:::
::: info 📂 Configuration Item Location

Error Page Style -> page 自动重定向

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/error_page_styles#:~:text=page自动重定向" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`theme.config?.error_page_styles?.is_auto_redirect`

:::
::: info ℹ️ Additional Information

When enabled, you can configure

- 跳转 Target Link
  - 类型：String
  - 默认值：`/`
  - 外部约束：合法的相对/绝对链接
- 跳转等待 when 间（Unit: seconds）
  - 类型：Integer
  - 默认值：`5`

:::

## Social Profile/RSS

### 首页社交资料展示

::: info 🎯 Purpose

In 首页展示社交媒体链接和 RSS 订阅等资料。

:::
::: info 📂 Configuration Item Location

社交资料/RSS -> 首页社交资料展示

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/sns#:~:text=首页社交资料展示" />

:::
::: info 🏷️ Type

数组（can 重复添加多个社交资料）

:::
::: info ⭐ Default Value

Empty 数组 `[]`

:::
::: info 🧩 Template Variable

`theme.config?.sns?.index_sns`

:::
::: info ℹ️ Additional Information

- Support 多种预设社交平台：RSS、BiliBili、Dribbble、Email、Facebook、GitHub、Instagram、QQ、Reddit、Stack Overflow、Telegram、X（Twitter）、YouTube、豆瓣、网易云音乐、微博、知乎等
- SupportCustom 社交资料
- Support 纯文本 Display
- can 通过"SetCustom 资料"Configuration 自己的社交平台

:::

### SetCustom 资料

::: info 🎯 Purpose

定义自己的社交资料，Used forIn 首页社交资料展示中。

:::
::: info 📂 Configuration Item Location

社交资料/RSS -> SetCustom 资料

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/sns#:~:text=SetCustom资料" />

:::
::: info 🏷️ Type

Repeater

:::
::: info ⭐ Default Value

Empty

:::
::: info 🧩 Template Variable

`theme.config?.sns?.custom_sns`

:::
::: info ℹ️ Additional Information

Provide 了主流平台的预设值，只 Requires 要填写对应平台的识别码就 can 以添加。

除此之外，你也 can 以添加 Custom 资料。

每个 Custom 资料 Requires 要 Configuration：

- 识别码：任意字母、数字、下划线组合（如 `myBlog`）
- 链接：完整的 URL（如 `https://example.com`）
- Icon
- aria-label：无障碍标签（如 `Find me on my blog`）

:::

## Custom Share Buttons

### 分享按钮 Set

::: info 🎯 Purpose

Configurationpostpage 的分享按钮列表，Support 多种分享方式。

:::
::: info 📂 Configuration Item Location

Custom 分享按钮 -> 分享按钮 Set

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/share#:~:text=分享按钮Set" />

:::
::: info 🏷️ Type

Repeater

:::
::: info ⭐ Default Value

包含多个预设分享按钮：E-mail、QRCode、Native、Facebook、X、LinkedIn、Pinterest、Telegram、QQ、Weibo、WeChat、Qzone、Douban

:::
::: info 🧩 Template Variable

`theme.config?.share?.button_config`

:::
::: info ℹ️ Additional Information

- `@URL` 和 `@TITLE` 是占位符，Usewhenwill 被替换为 page 实际地址和标题
- 每个分享按钮有四个 canConfiguration 项：名称、链接、Icon（Set 后将覆盖默认 Icon）、`aria-label`（无障碍标签）
- can 以自由调整顺序、删除 or 新增分享按钮

:::

## Links Page Style

Requires[链接管理插件](/guide/plugin-compatibility#链接页)Enable 后方 can.

### 头像优先样式

::: info 🎯 Purpose

Enable 后，链接页将 Use 强调头像的网格布局，每行最多 Display 三个链接，适合 Requires 要突出展示链接站点头像的场景。

:::
::: info 📂 Configuration Item Location

Links Page Style -> 头像优先样式

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/links_page_styles#:~:text=头像优先样式" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.links_page_styles?.is_head_first_style`

:::
::: info ℹ️ Additional Information

- **默认样式**：DisablewhenUse 传统的横向列表布局，头像较小，信息 In 头像右侧排列
- **头像优先样式**：EnablewhenUse 网格卡片布局
  - 采用响应式三列网格（根据 page 宽度，自动选择列数，最高三列）
  - 头像居中 Display，尺寸更大
  - 链接信息垂直排列 In 头像下方
  - 鼠标悬停 when 卡片上浮并有阴影效果
  - 头像 In 鼠标悬停 whenwill 放大并改变边框颜色

:::

### 链接描述行数上限

::: info 🎯 Purpose

Set 链接描述的最大行数。

:::
::: info 📂 Configuration Item Location

（[Links Page Style -> 头像优先样式](#头像优先样式)When enabled, will display）

Links Page Style -> 链接描述行数上限

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/links_page_styles#:~:text=链接描述行数上限" />

:::
::: info 🏷️ Type

Integer

:::
::: info ⭐ Default Value

`3`

:::
::: info 🔒 Internal Constraints

Range 1-5

:::
::: info 🧩 Template Variable

`theme.config?.links_page_styles?.link_description_max_lines`

:::

## Photo Gallery Page Style

Requires[图库管理插件](/guide/plugin-compatibility#图库页)Enable 后方 can.

### 图片圆角宽度

::: info 🎯 Purpose

Set 相册 page 中图片的圆角宽度。

:::
::: info 📂 Configuration Item Location

相册页样式 -> 图片圆角宽度

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/photos_styles#:~:text=图片圆角宽度" />

:::
::: info 🏷️ Type

String

:::
::: info ⭐ Default Value

`8px`

:::
::: info 💡 Example Values

`0px`、`5px`、`10%`、`1rem`

:::
::: info ⚠️ External Constraints

Valid CSS length unit.

:::
::: info 🧩 Template Variable

`theme.config?.photos_styles?.img_border_radius`

:::

### 图片渐入动画 when 间

::: info 🎯 Purpose

Set 相册 page 中图片渐入动画 when 间。

:::
::: info 📂 Configuration Item Location

相册页样式 -> 图片渐入动画 when 间

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/photos_styles#:~:text=图片渐入动画when间" />

:::
::: info 🏷️ Type

Integer/Float (Unit: seconds)

:::
::: info ⭐ Default Value

`0.2`

:::
::: info 💡 Example Values

`1`、`0`

:::
::: info 🧩 Template Variable

`theme.config?.photos_styles?.img_transition_duration_after_load`

:::

### Enable 瀑布流布局

::: info 🎯 Purpose

In 相册 pageUse 瀑布流布局展示图片。

:::
::: info 📂 Configuration Item Location

相册页样式 -> Enable 瀑布流布局

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/photos_styles#:~:text=Enable瀑布流布局" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`theme.config?.photos_styles?.is_enable_masonry_layout`

:::
::: info ℹ️ Additional Information

When enabled, you can configure

- 瀑布流最大列数
- 瀑布流最小列数
- 瀑布流最小图片宽度
- 瀑布流间隔宽度
- 进阶 ConfigurationOption
  - Custom 图片 onmouseover 属性
  - Custom 图片 onmouseout 属性

Disable 后 can 以 Configuration

- Display 分组标题

:::

## Moments Page Style

Requires[瞬间管理插件](/guide/plugin-compatibility#瞬间页)Enable 后方 can.

### moment 预计阅读 when 间

::: info 🎯 Purpose

In 帖子开头 Display 根据字数估算的阅读 when 间。

:::
::: info 📂 Configuration Item Location

Moments Page Style -> moment 预计阅读 when 间

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/moments_styles#:~:text=moment预计阅读when间" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.moments_styles?.is_show_post_estimated_reading_time`

:::
::: info ℹ️ Additional Information

Enable [API 拓展](/guide/plugin-compatibility#api-扩展)插件后将自动 Enable 更准确的计量方法。

:::

### moment 字数统计

::: info 🎯 Purpose

In 帖子开头 Displaypost 的总字数。

:::
::: info 📂 Configuration Item Location

Moments Page Style -> moment 字数统计

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/moments_styles#:~:text=moment字数统计" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`false`

:::
::: info 🧩 Template Variable

`theme.config?.moments_styles?.is_show_post_word_count`

:::
::: info ℹ️ Additional Information

Enable [API 拓展](/guide/plugin-compatibility#api-扩展)插件后将自动 Enable 更准确的计量方法。

:::

### 瞬间页点赞按钮

::: info 🎯 Purpose

In 瞬间 pageDisplay 点赞按钮。

:::
::: info 📂 Configuration Item Location

Moments Page Style -> Enable 点赞按钮

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/moments_styles#:~:text=Enable点赞按钮" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`theme.config?.moments_styles?.is_moment_upvote_button_show`

:::

### 瞬间页评论区

::: info 🎯 Purpose

Controls whetherIn 瞬间 pageDisplay 评论区。

:::
::: info 📂 Configuration Item Location

Moments Page Style -> Enable 评论区

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/moments_styles#:~:text=Enable评论区" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`theme.config?.moments_styles?.is_moment_comment_section_show`

:::

## Friends Page Style

Requires the [Friends Plugin](/en/guide/plugin-compatibility#moments-feed-subscription) to be enabled for use.

### Show Publish Date

::: info 🎯 Purpose

Display the publication date of posts in the friends list.

:::
::: info 📂 Configuration Item Location

Friends Page Style -> Show Publish Date

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/friends_page_styles#:~:text=Show publish date" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`theme.config?.friends_page_styles?.is_show_friend_pubdate`

:::

### Show Author Information

::: info 🎯 Purpose

Display the author's avatar and name in the friends list.

:::
::: info 📂 Configuration Item Location

Friends Page Style -> Show Author Information

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/friends_page_styles#:~:text=Show author information" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`theme.config?.friends_page_styles?.is_show_friend_author`

:::

### Show Author Avatar

::: info 🎯 Purpose

Display the author's avatar in the friends list. Clicking the avatar will navigate to the author's website.

:::
::: info 📂 Configuration Item Location

Friends Page Style -> Show Author Avatar

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/friends_page_styles#:~:text=Show author avatar" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`theme.config?.friends_page_styles?.is_show_friend_author_avatar`

:::
::: info ℹ️ Additional Information

Only takes effect when "Show Author Information" option is enabled.

:::

### Show Author Name

::: info 🎯 Purpose

Display the author's name in the friends list. Clicking the name will navigate to the author's website.

:::
::: info 📂 Configuration Item Location

Friends Page Style -> Show Author Name

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/friends_page_styles#:~:text=Show author name" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`theme.config?.friends_page_styles?.is_show_friend_author_name`

:::
::: info ℹ️ Additional Information

Only takes effect when "Show Author Information" option is enabled.

:::

### Show Post Description

::: info 🎯 Purpose

Display the post description/excerpt in the friends list.

:::
::: info 📂 Configuration Item Location

Friends Page Style -> Show Post Description

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/friends_page_styles#:~:text=Show post description" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`theme.config?.friends_page_styles?.is_show_friend_description`

:::

### Maximum Lines for Post Description

::: info 🎯 Purpose

Control the maximum number of lines displayed for post descriptions in the friends list.

:::
::: info 📂 Configuration Item Location

Friends Page Style -> Maximum Lines for Post Description

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/friends_page_styles#:~:text=Maximum lines for post description" />

:::
::: info 🏷️ Type

Number (1-5)

:::
::: info ⭐ Default Value

`3`

:::
::: info 🧩 Template Variable

`theme.config?.friends_page_styles?.friend_description_max_lines`

:::
::: info ℹ️ Additional Information

Only takes effect when "Show Post Description" option is enabled.

:::

### Show Link Text

::: info 🎯 Purpose

Display link text (such as "Read original") in friends list items.

:::
::: info 📂 Configuration Item Location

Friends Page Style -> Show Link Text

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/friends_page_styles#:~:text=Show link text" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`theme.config?.friends_page_styles?.is_show_friend_permalink_text`

:::

## Next Steps

你 can 以进一步了解：

- [元数据 Configuration 项](/guide/metadata-configuration)
