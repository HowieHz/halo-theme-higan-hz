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

- String: A sequence of characters, such as `abc123`, `zh-CN`.
- Integer: Whole numbers, such as `-1`, `0`, `100`.
- Float: Numbers with decimal points, such as `1.2`, `0.3`, `4.5`.
- Boolean: `true` or `false`. In actual configuration items, it appears as a switch, on is `true`, off is `false`.
- Option: Fixed options are provided, just select directly.
- Repeater: Can repeat a group of inputs. Can add groups, remove groups, swap order of any groups.
- Code input box (programming language): Provides a multi-line code input box, which will be highlighted according to the specified programming language.
- Attachment: Select uploaded attachments.
- Icon: Use the icon setting box provided by Halo CMS, where you can select any [iconify](https://icon-sets.iconify.design/) icon.

<!-- - Array: List of multiple values, e.g., `[1, 2, 3]`
- Object: Collection of key-value pairs, e.g., `{name: "John", age: 20}`
- URL: Web address link, e.g., `https://example.com`
- Color value: e.g., `#FF5733`, `rgb(255, 87, 51)`
- CSS length value: e.g., `1rem`, `1px`, `1em`, `50%`, `1vw` -->

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

<QuickJumpConfig to="/console/theme/settings/global#:~:text=Default%20Page%20Language" />

:::
::: info 🏷️ Type

String

:::
::: info ⭐ Default Value

`zh`

:::
::: info 💡 Example Values

`zh`,`zh-CN`,`zh-Hans`,`en`,`en-US`

:::
::: info ⚠️ External Constraints

The set value must comply with [BCP 47](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/lang#:~:text=The%20attribute%20contains%20a%20single%20BCP%2047%20language%20tag), otherwise it will be invalid.

:::
::: info 🧩 Template Variable

`theme.config?.global?.default_page_language`

:::
::: info ℹ️ Additional Information

- Security: The set language value will be automatically escaped, no need to worry about XSS injection attacks.
- Setting priority: Please refer to [page language setting priority](/reference/faq#page-language-setting-priority).

:::

### Multilingual Function Prefix Matching Mode

::: info 🎯 Purpose

Enable the prefix matching mode for multilingual functionality, allowing the theme to match language settings more flexibly.

:::
::: info 📂 Configuration Item Location

Global -> Multilingual Function Prefix Matching Mode

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/global#:~:text=Multilingual%20Function%20Prefix%20Matching%20Mode" />

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

For specific usage methods, please refer to [Prefix Matching Mode Description](/tutorial/i18n.md#prefix-matching-mode-description).

:::

### Auto-redirect Based on Browser Language

::: info 🎯 Purpose

Automatically redirect to the corresponding language page based on the browser language settings.

:::
::: info 📂 Configuration Item Location

Global -> Auto-redirect Based on Browser Language

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/global#:~:text=Auto-redirect%20Based%20on%20Browser%20Language" />

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

([Global -> Auto-redirect Based on Browser Language](#Auto-redirect Based on Browser Language)When enabled, will display)

Global -> Allowed Target Language Code List for Redirects

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/global#:~:text=Allowed%20Target%20Language%20Code%20List%20for%20Redirects" />

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

After enabling [Auto-redirect Based on Browser Language](#Auto-redirect Based on Browser Language), if the browser language is different from the Default Page Language and the browser language exists in this option, it will automatically redirect to the corresponding page.

Please refer to the [Auto-redirect Based on Browser Language Usage Guide](/tutorial/i18n#auto-redirect-based-on-browser-language-usage-guide) for configuration.

Matching order is from top to bottom.

:::

### Multilingual Menu Support

::: info 🎯 Purpose

Enable Multilingual Menu Support, allowing the menu to display content in different languages.

:::
::: info 📂 Configuration Item Location

Global -> Multilingual Menu Support

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/global#:~:text=Multilingual%20Menu%20Support" />

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

After enabling, please refer to the [Multilingual Menu Usage Guide](/tutorial/i18n#multi-language-menu-usage-guide) for configuration.

:::

### CSP:upgrade-insecure-requests

::: info 🎯 Purpose

Automatically upgrade non-redirected insecure resource requests to HTTPS, including the current domain and third-party requests.

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

Prevent traffic loss after the site is maliciously mirrored, only allowing access from domains in the whitelist.

:::
::: info 📂 Configuration Item Location

Global -> Only Allow Access from Specified Domains

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/global#:~:text=Only%20Allow%20Access%20from%20Specified%20Domains" />

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

After enabling, please refer to [Enable Only Allow Access from Specified Domains](/tutorial/security#enable-only-allow-access-from-specified-domains) for configuration.

When enabled, you can configure:

- [Domain Whitelist](#Domain Whitelist)
- [Target Link](#Target Link)
- [Keep Path and Query Parameters After Redirect](#keep-path-and-query-parameters-after-redirect)

:::

### Domain Whitelist

::: info 🎯 Purpose

Set the Domain Whitelist.

:::
::: info 📂 Configuration Item Location

([Global -> Only Allow Access from Specified Domains](#Only Allow Access from Specified Domains)When enabled, will display)

Global -> Domain Whitelist

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/global#:~:text=Domain%20Whitelist" />

:::
::: info 🏷️ Type

Repeater

:::
::: info ⭐ Default Value

Empty

:::

> [!NOTE] 💡 Example Value
>
> ::: tip 📂 Configuration Item Name
>
> Base64-encoded domain name
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

Please refer to [Enable Only Allow Access from Specified Domains](/tutorial/security#enable-only-allow-access-from-specified-domains) for configuration.

:::

### Target Link

::: info 🎯 Purpose

SetDomain Whitelist.

:::
::: info 📂 Configuration Item Location

([Global -> Only Allow Access from Specified Domains](#Only Allow Access from Specified Domains)When enabled, will display)

Global -> Target Link

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/global#:~:text=Target%20Link" />

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

Please refer to [Enable Only Allow Access from Specified Domains](/tutorial/security#enable-only-allow-access-from-specified-domains) for configuration.

:::

### Keep Path and Query Parameters After Redirect

::: info 🎯 Purpose

Set whether to keep path and query parameters after redirect.

:::
::: info 📂 Configuration Item Location

([Global -> Only Allow Access from Specified Domains](#Only Allow Access from Specified Domains)When enabled, will display)

Global -> Keep Path and Query Parameters After Redirect

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/global#:~:text=Keep%20path%20and%20query" />

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

Please refer to [Enable Only Allow Access from Specified Domains](/tutorial/security#enable-only-allow-access-from-specified-domains) for configuration.

Assuming the user accesses the link `http://localhost/a/b?a=1`, and the [Target Link](#Target Link) is set to (before Base 64 encoding) `https://p.com`:

- With this option disabled, it will redirect to: `https://p.com`
- With this option enabled, it will redirect to: `https://p.com/a/b?a=1`

:::

### Custom Resource Location Address

::: info 🎯 Purpose

Specify that resources will use custom resource location addresses instead of the theme's default addresses.

:::
::: info 📂 Configuration Item Location

Global -> Custom Resource Location Address

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/global#:~:text=Custom%20Resource%20Location%20Address" />

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

After enabling this option, if you enable the "instant.page Support" or "Mermaid Support" options below, the corresponding resource location configuration items will be displayed.

:::

### instant.page Support

::: info 🎯 Purpose

Automatically load the instant.page script to preload links and improve page loading speed.

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

Enable Mermaid chart rendering functionality to support drawing flowcharts, sequence diagrams, etc. in posts.

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

Charts can support light/dark theme switching. For specific usage methods, please see: [Mermaid Light/Dark Theme Adaptation](/guide/style-reference#mermaid-light-dark-theme-adaptation)

After enabling, you need to configure the following sub-items:

- Mermaid CSS Selector (Default: `.content .mermaid`)
- Mermaid Config Property (Default: `{ startOnLoad: false }`)

:::

## General Styles

### Enable Custom Font Files

::: info 🎯 Purpose

Use uploaded custom font files to replace the default fonts.

:::
::: info 📂 Configuration Item Location

General Styles -> Enable Custom Font Files

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Enable%20Custom%20Font%20Files" />

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

- [Custom Font Files](#custom-font-files)
- [Font Name (Full Name/PostScript Name)](#font-name-full-namepostscript-name)

:::

### Custom Font Files

::: info 🎯 Purpose

Used to select uploaded font files to replace the default font files. Supports `.woff2`/`.woff`/`.ttf`/`.otf`/`.eot`/`.ttc`/`.otc`/`.sfnt` format font files.

:::
::: info 📂 Configuration Item Location

([General Styles -> Enable Custom Font Files](#enable-custom-font-files)When enabled, will display)

General Styles -> Custom Font Files

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Custom%20font%20files" />

:::
::: info 🏷️ Type

Repeater

:::
::: info 🧩 Template Variable

`theme.config?.styles?.custom_font_configs`

:::

### Font Name (Full Name/PostScript Name)

::: info 🎯 Purpose

After correctly filling in this option, if the user has this font installed locally, the local version will be used.  
If this option is left empty, even if the user has this font installed locally, the local version will not be used, and the font file will be downloaded from the network.

:::
::: info 📂 Configuration Item Location

([General Styles -> Enable Custom Font Files](#enable-custom-font-files)When enabled, will display)

General Styles -> Font Name (Full Name/PostScript Name)

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Font%20Name" />

:::
::: info 🏷️ Type

String

:::
::: info ⭐ Default Value

Empty

:::
::: info 💡 Example Values

`My Custom Font Regular`,`MyCustomFont-Regular`

:::
::: info External Constraints

Corresponds to the "Full font name (`nameID=4`)" or "PostScript name (`nameID=6`)" declared inside the font file.

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

### Color Scheme

::: info 🎯 Purpose

Set the overall color scheme of the website, supporting multiple built-in themes and custom colors.

:::
::: info 📂 Configuration Item Location

General Styles -> Color Scheme

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Color%20scheme" />

:::
::: info 🏷️ Type

Option

:::
::: info ⭐ Default Value

`Dark - Green`(internal value `dark`)

:::
::: info 💡 Other Options

- `Follow System - Green`(internal value `auto`)
- `Light - Green`(internal value `light`)
- `Follow System - Blue`(internal value `auto-blue`)
- `Light - Blue`(internal value `light-blue`)
- `Dark - Blue`(internal value `dark-blue`)
- `Light - Gray Pink`(internal value `gray`)
- `Custom Color Scheme`(internal value `custom`)

:::
::: info 🧩 Template Variable

`theme.config?.styles?.color_schema`

:::
::: info ℹ️ Additional Information

- For cases where [Light/Dark Mode Toggle Button](#lightdark-mode-toggle-button) is enabled, this determines the default color scheme when the website first loads.
- When selecting "Custom Color Scheme", it needs to be used with [Custom Color Scheme](#custom-color-scheme).

:::

### Custom Color Scheme

::: info 🎯 Purpose

Set custom color scheme.

:::
::: info 📂 Configuration Item Location

General Styles -> Custom Color Scheme

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Custom%20Color%20Scheme" />

:::
::: info 🏷️ Type

Repeater

:::
::: info ℹ️ Additional Information

For usage, please refer to the [Tutorial: Custom Color Scheme](/tutorial/custom-theme)

:::

> [!NOTE] ⭐ Default Value
>
> ::: tip 📂 Configuration Item Name
>
> Custom Color Scheme Identifier
>
> :::
> ::: info 🏷️ Type
>
> Number
>
> :::
> ::: info ⭐ Default Value
>
> `1`
>
> :::
> ::: info ℹ️ Additional Information
>
> Unique identifier, do not duplicate.
>
> :::
> ::: tip 📂 Configuration Item Name
>
> Theme Color Mode
>
> :::
> ::: info 🏷️ Type
>
> Option
>
> :::
> ::: info ⭐ Default Value
>
> `Dark Mode`(internal value `dark`)
>
> :::
> ::: info 💡 Other Options
>
> - `Light Mode`(internal value `light`)
> - `Auto Mode`(internal value `auto`)
>
> :::
> ::: tip 📂 Configuration Item Name
>
> CSS Variable Mode
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
> After enabling this option, CSS variables will be used to define the color scheme.
>
> :::
> ::: tip 📂 Configuration Item Name
>
> CSS Raw Output Mode
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
> Disablethis option 后，仅 Requires 填写 Custom CSS Variables 的部分。
> 输出 whenwill 自动输出 In 对应 CSS 选择器中 (选择器为 `html[theme="theme-{identifier}"]`).
>
> :::
> ::: tip 📂 Configuration Item Name
>
> Custom CSS Variables
>
> :::
> ::: info 🏷️ Type
>
> Code input box (CSS)
>
> :::
> ::: info ⚠️ External Constraints
>
> Enable `CSS Raw Output Mode` when，你填写的内容 Requires 要是合法的 CSS 代码。
> Disable `CSS Raw Output Mode` when，以下内容 Requires 要是合法的 CSS 代码：
>
> ```css
> html[theme="theme-{identifier}"] {
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
> 以下是 `CSS Raw Output Mode` 的一个示例：
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

### Light/Dark Mode Toggle Button

::: info 🎯 Purpose

If this option is enabled, a light/dark mode toggle button will be displayed next to the main title.  
Toggle logic: Light Mode -> Dark Mode -> Auto Mode -> Light Mode.

:::
::: info 📂 Configuration Item Location

General Styles -> Light/Dark Mode Toggle Button

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Light/Dark%20Mode%20Toggle%20Button" />

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

Selecting the same "Auto Mode Color Scheme" as "Light Mode Color Scheme" will disable auto mode.
Toggle logic will become: Light Mode -> Dark Mode -> Light Mode.

When enabled, you can configure:

- [Auto Mode Color Scheme](#auto-mode-color-scheme)
- [Light Mode Color Scheme](#light-mode-color-scheme)
- [Dark Mode Color Scheme](#dark-mode-color-scheme)

相关说明：

[Mermaid 适配明暗主题切换](/guide/style-reference#mermaid-适配明暗主题切换)

:::

### Auto Mode Color Scheme

::: info 🎯 Purpose

Set the color scheme for Auto Mode in the Light/Dark Mode Toggle Button.

:::
::: info 📂 Configuration Item Location

(When [General Styles -> Light/Dark Mode Toggle Button](#lightdark-mode-toggle-button) is enabled, will display)

General Styles -> Auto Mode Color Scheme

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Auto%20Mode%20Color%20Scheme" />

:::
::: info 🏷️ Type

Option

:::
::: info ⭐ Default Value

`Follow System - Green`(internal value `auto`)

:::
::: info 💡 Other Options

- `Light - Green`(internal value `light`)
- `Dark - Green`(internal value `dark`)
- `Follow System - Blue`(internal value `auto-blue`)
- `Light - Blue`(internal value `light-blue`)
- `Dark - Blue`(internal value `dark-blue`)
- `Light - Gray Pink`(internal value `gray`)
- `Custom Color Scheme`(internal value `custom`)

:::
::: info 🧩 Template Variable

`theme.config?.styles?.theme_auto`

:::
::: info ℹ️ Additional Information

When "Custom Color Scheme" is selected, you need to use it with [Custom Color Scheme](#custom-color-scheme) and fill in the Custom Color Scheme identifier.

:::

### Light Mode Color Scheme

::: info 🎯 Purpose

Set the color scheme for Light Mode in the Light/Dark Mode Toggle Button.

:::
::: info 📂 Configuration Item Location

(When [General Styles -> Light/Dark Mode Toggle Button](#lightdark-mode-toggle-button) is enabled, will display)

General Styles -> Light Mode Color Scheme

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Light%20Mode%20Color%20Scheme" />

:::
::: info 🏷️ Type

Option

:::
::: info ⭐ Default Value

`Light - Green`(internal value `light`)

:::
::: info 💡 Other Options

- `Follow System - Green`(internal value `auto`)
- `Dark - Green`(internal value `dark`)
- `Follow System - Blue`(internal value `auto-blue`)
- `Light - Blue`(internal value `light-blue`)
- `Dark - Blue`(internal value `dark-blue`)
- `Light - Gray Pink`(internal value `gray`)
- `Custom Color Scheme`(internal value `custom`)

:::
::: info 🧩 Template Variable

`theme.config?.styles?.theme_light`

:::
::: info ℹ️ Additional Information

When "Custom Color Scheme" is selected, you need to use it with [Custom Color Scheme](#custom-color-scheme) and fill in the Custom Color Scheme identifier.

:::

### Dark Mode Color Scheme

::: info 🎯 Purpose

Set the color scheme for Dark Mode in the Light/Dark Mode Toggle Button.

:::
::: info 📂 Configuration Item Location

(When [General Styles -> Light/Dark Mode Toggle Button](#lightdark-mode-toggle-button) is enabled, will display)

General Styles -> Dark Mode Color Scheme

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Dark%20Mode%20Color%20Scheme" />

:::
::: info 🏷️ Type

Option

:::
::: info ⭐ Default Value

`Dark - Green`(internal value `dark`)

:::
::: info 💡 Other Options

- `Follow System - Green`(internal value `auto`)
- `Light - Green`(internal value `light`)
- `Follow System - Blue`(internal value `auto-blue`)
- `Light - Blue`(internal value `light-blue`)
- `Dark - Blue`(internal value `dark-blue`)
- `Light - Gray Pink`(internal value `gray`)
- `Custom Color Scheme`(internal value `custom`)

:::
::: info 🧩 Template Variable

`theme.config?.styles?.theme_dark`

:::
::: info ℹ️ Additional Information

When "Custom Color Scheme" is selected, you need to use it with [Custom Color Scheme](#custom-color-scheme) and fill in the Custom Color Scheme identifier.

:::

### Font Size

::: info 🎯 Purpose

Set 网站的整体字体大小。

:::
::: info 📂 Configuration Item Location

General Styles -> Font Size

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Font%20Size" />

:::
::: info 🏷️ Type

Option

:::
::: info ⭐ Default Value

`小字体`(internal value `small`)

:::
::: info 💡 Other Options

- `常规`(internal value `normal`)
- `大字体`(internal value `large`)

:::
::: info 🧩 Template Variable

`theme.config?.styles?.text_size`

:::

### Custom Content Area Maximum Width

::: info 🎯 Purpose

Whether 定义 Content Area Maximum Width.

:::
::: info 📂 Configuration Item Location

General Styles -> Custom Content Area Maximum Width

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Custom%20Content%20Area%20Maximum%20Width" />

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

IfDisablethis option，Content Area Maximum Width will 随着 page 宽度变化而变化，但 cancan 出现内容整体偏左的现象。
If 想 Disablethis option，建议 Enable"Content Area Minimum Width"和"Custom Content Area Width Property".

When enabled, you can configure:

- [Content Area Maximum Width](#content-area-maximum-width)

:::

### Content Area Maximum Width

::: info 🎯 Purpose

Set 内容区域的最大宽度。

:::
::: info 📂 Configuration Item Location

([General Styles -> Custom Content Area Maximum Width](#custom-Content Area Maximum Width)When enabled, will display)

General Styles -> Content Area Maximum Width

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Content%20Area%20Maximum%20Width" />

:::
::: info 🏷️ Type

String

:::
::: info ⭐ Default Value

`48rem`

:::
::: info 💡 Example Values

`20rem`,`300px`,`30vw`

:::
::: info ⚠️ External Constraints

Valid CSS length unit.

:::
::: info 🧩 Template Variable

`theme.config?.styles?.max_width`

:::

### Custom Content Area Minimum Width

::: info 🎯 Purpose

Whether 定义 Content Area Minimum Width.

:::
::: info 📂 Configuration Item Location

General Styles -> Custom Content Area Minimum Width

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Custom%20Content%20Area%20Minimum%20Width" />

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

- [Content Area Minimum Width](#content-area-minimum-width)
- [强制应用 Content Area Minimum Width](#强制应用Content Area Minimum Width)

:::

### Content Area Minimum Width

::: info 🎯 Purpose

Set 内容区域的最小宽度。

:::
::: info 📂 Configuration Item Location

([General Styles -> Custom Content Area Minimum Width](#custom-Content Area Minimum Width)When enabled, will display)

General Styles -> Content Area Minimum Width

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Content%20Area%20Minimum%20Width" />

:::
::: info 🏷️ Type

String

:::
::: info ⭐ Default Value

`48rem`

:::
::: info 💡 Example Values

`20rem`,`300px`,`30vw`

:::
::: info ⚠️ External Constraints

Valid CSS length unit.

:::
::: info 🧩 Template Variable

`theme.config?.styles?.min_width`

:::

### Force Apply Content Area Minimum Width

::: info 🎯 Purpose

Controls whether 强制应用 Content Area Minimum Width.

:::
::: info 📂 Configuration Item Location

([General Styles -> Custom Content Area Minimum Width](#custom-Content Area Minimum Width)When enabled, will display)

General Styles -> Force Apply Content Area Minimum Width

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Force%20Apply%20Content%20Area%20Minimum%20Width" />

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

### Custom Content Area Width Property

::: info 🎯 Purpose

Whether 定义 Content Area Width Property.

:::
::: info 📂 Configuration Item Location

General Styles -> Custom Content Area Width Property

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Custom%20Content%20Area%20Width%20Property" />

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

- [Content Area Width Style](#content-area-width-style)

:::

### Content Area Width Style

::: info 🎯 Purpose

决定内容区域宽度样式。

:::
::: info 📂 Configuration Item Location

([General Styles -> Custom Content Area Width Property](/guide/theme-configuration#CustomContent Area Width Property)When enabled, will display)

General Styles -> Content Area Width Style

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Content%20Area%20Width%20Style" />

:::
::: info 🏷️ Type

String

:::
::: info ⭐ Default Value

`fit-content`

:::
::: info 💡 Example Values

`max-content`,`min-content`

:::
::: info ⚠️ External Constraints

符合[文档](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference/Properties/width#%E5%80%BC)对值的要求。

:::
::: info 🧩 Template Variable

`theme.config?.styles?.content_width_style`

:::
::: info ℹ️ Additional Information

Default Value 效果为：使内容区域宽度等于最宽的内容的宽度.(this option 实际是 InSet 内容区域的 `width` 属性对应的样式值)

:::

### Header Avatar Display

::: info 🎯 Purpose

Controls whetherIn 页眉 Display 头像。

:::
::: info 📂 Configuration Item Location

General Styles -> Header Avatar Display

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Header%20Avatar%20Display" />

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

- [Custom Header Avatar](#custom-header-avatar)
- [Circular Avatar](#circular-avatar)
- [Grayscale Avatar](#grayscale-avatar)

:::

### Custom Header Avatar

::: info 🎯 Purpose

Used for 选择上传的图片作为页眉头像。未 Set 将 Use 默认头像 `/themes/howiehz-higan/images/logo.{avif,webp,png}`.

:::
::: info 📂 Configuration Item Location

([Global -> Header Avatar Display](#header-avatar-display)When enabled, will display)

General Styles -> Custom Header Avatar

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Custom%20Header%20Avatar" />

:::
::: info 🏷️ Type

Attachment

:::
::: info 🧩 Template Variable

`theme.config?.styles?.icon`

:::

### Circular Avatar

::: info 🎯 Purpose

Controls whether 强制将头像裁切为圆形。

:::
::: info 📂 Configuration Item Location

([Global -> Header Avatar Display](#header-avatar-display)When enabled, will display)

General Styles -> Circular Avatar

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Circular%20Avatar" />

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

### Grayscale Avatar

::: info 🎯 Purpose

Controls whether 强制将头像以灰度处理。

:::
::: info 📂 Configuration Item Location

([Global -> Header Avatar Display](#header-avatar-display)When enabled, will display)

General Styles -> Grayscale Avatar

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Grayscale%20Avatar" />

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

### Additional Menu Items

::: info 🎯 Purpose

Controls whetherIn 菜单 Display 额外菜单项。

:::
::: info 📂 Configuration Item Location

General Styles -> Additional Menu Items

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Additional%20Menu%20Items" />

:::
::: info 🏷️ Type

Repeater

:::
::: info ⭐ Default Value

包含一个预设：搜索 (Requires[搜索组件插件](/guide/plugin-compatibility#搜索组件)).

:::

> [!NOTE] 💡 示例值
>
> ::: tip 📂 Configuration Item Name
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
> 搜索 (Requires[搜索组件插件](/guide/plugin-compatibility#搜索组件))(internal value `search`)
>
> :::
> ::: info 💡 Other Options
>
> - 随机 post(internal value `random`)
> - 用户账号 (internal value `user`)
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
> - 未登录 when，菜单 Display `登录`，点击后跳转 `/login` page.
> - 已登录 when，菜单 Display 用户名，点击后跳转 `/uc` page.
>
> :::

::: info 🧩 Template Variable

`theme.config?.styles?.extra_menu_items`

:::

### Display Header Menu

::: info 🎯 Purpose

Controls whetherDisplay 页眉菜单。

:::
::: info 📂 Configuration Item Location

General Styles -> Display Header Menu

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Display%20Header%20Menu" />

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

### Display Page Numbers

::: info 🎯 Purpose

Controls whetherDisplay 页码。

:::
::: info 📂 Configuration Item Location

General Styles -> Display Page Numbers

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Display%20Page%20Numbers" />

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

### Site Statistics at Page Bottom

::: info 🎯 Purpose

Controls whetherDisplaypage 底部站点统计信息。

:::
::: info 📂 Configuration Item Location

General Styles -> Site Statistics at Page Bottom

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Site%20Statistics%20at%20Page%20Bottom" />

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

- [Statistics Item Settings](#statistics-item-settings)

:::

### Statistics Item Settings

::: info 🎯 Purpose

Set 统计项。

:::
::: info 📂 Configuration Item Location

([Home Page Style -> Site Statistics at Page Bottom](#site-statistics-at-page-bottom)When enabled, will display)

General Styles -> Statistics Item Settings

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/global#:~:text=Statistics%20Item%20Settings" />

:::
::: info 🏷️ Type

Repeater

:::
::: info ⭐ Default Value

包含多个预设分享按钮：总阅读量，总 post 数，总点赞数，总评论数，总分类数，总字数 (Requires[API 扩展包插件](/guide/plugin-compatibility#api-扩展包)).

:::

> [!NOTE] 💡 示例值
>
> ::: tip 📂 Configuration Item Name
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
> 总阅读量 (internal value `visit`)
>
> :::
> ::: info 💡 Other Options
>
> - 总 post 数 (internal value `post`)
> - 总点赞数 (internal value `upvote`)
> - 总评论数 (internal value `comment`)
> - 总分类数 (internal value `category`)
> - 总字数 (internal value `wordcount`)
>
> :::
> ::: info 🔒 Internal Constraints
>
> Required field
>
> :::
> ::: tip 📂 Configuration Item Name
>
> 多语言文本包裹 Number
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
> ::: tip 📂 Configuration Item Name
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

### Theme Information at Page Bottom

::: info 🎯 Purpose

Controls whetherDisplaypage 底部主题信息。

:::
::: info 📂 Configuration Item Location

General Styles -> Theme Information at Page Bottom

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Theme%20Information%20at%20Page%20Bottom" />

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

- [Theme Name Displayed in Theme Information at Page Bottom](#theme-name-displayed-in-theme-information-at-page-bottom)
- [Halo Version Displayed in Theme Information at Page Bottom](#halo-version-displayed-in-theme-information-at-page-bottom)

:::

#### Theme Name Displayed in Theme Information at Page Bottom

::: info 🎯 Purpose

Setpage 底部主题信息所展示的主题名。

:::
::: info 📂 Configuration Item Location

([General Styles -> Theme Information at Page Bottom](#theme-information-at-page-bottom)When enabled, will display)

General Styles -> Custom Attribution in Copyright Information

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Theme%20Name%20Displayed%20in%20Theme%20Information%20at%20Page%20Bottom" />

:::
::: info 🏷️ Type

Option

:::
::: info ⭐ Default Value

Higan Haozi (internal value `Higan Haozi`)

:::
::: info 💡 Other Options

- Higan(internal value `Higan`)
- 彼岸 (internal value `彼岸`)

:::
::: info 🧩 Template Variable

`theme.config?.styles?.footer_theme_info_theme_name`

:::

#### Halo Version Displayed in Theme Information at Page Bottom

::: info 🎯 Purpose

Setpage 底部主题信息所展示的 Halo 版本。

:::
::: info 📂 Configuration Item Location

([General Styles -> Theme Information at Page Bottom](#theme-information-at-page-bottom)When enabled, will display)

General Styles -> Halo Version Displayed in Theme Information at Page Bottom

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Halo%20Version%20Displayed%20in%20Theme%20Information%20at%20Page%20Bottom" />

:::
::: info 🏷️ Type

Option

:::
::: info ⭐ Default Value

Halo (internal value `Halo`)

:::
::: info 💡 Other Options

- Halo Pro(internal value `Halo Pro`)
- Halo 专业版 (internal value `Halo 专业版`)

:::
::: info 🧩 Template Variable

`theme.config?.styles?.footer_theme_info_halo_version_name`

:::

### Copyright Information at Page Bottom

::: info 🎯 Purpose

Controls whetherDisplaypage 底部版权信息。

:::
::: info 📂 Configuration Item Location

General Styles -> Copyright Information at Page Bottom

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Copyright%20Information%20at%20Page%20Bottom" />

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

- [Custom Attribution in Copyright Information](#custom-attribution-in-copyright-information)

:::

#### Custom Attribution in Copyright Information

::: info 🎯 Purpose

Setpage 底部版权信息的署名。

:::
::: info 📂 Configuration Item Location

([General Styles -> Copyright Information at Page Bottom](#copyright-information-at-page-bottom)When enabled, will display)

General Styles -> Custom Attribution in Copyright Information

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Custom%20Attribution%20in%20Copyright%20Information" />

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

### Force Footer and Page Numbers at Page Bottom

::: info 🎯 Purpose

Controls whether 强制页脚，页码 Inpage 底部。

:::
::: info 📂 Configuration Item Location

General Styles -> Force Footer and Page Numbers at Page Bottom

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Force%20Footer%20and%20Page%20Numbers%20at%20Page%20Bottom" />

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

### Menu at Page Bottom

::: info 🎯 Purpose

Controls whetherDisplaypage 底部菜单。

:::
::: info 📂 Configuration Item Location

General Styles -> Menu at Page Bottom

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Menu%20at%20Page%20Bottom" />

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

### Add Content to Bottom of Page

::: info 🎯 Purpose

控制添加内容到 page 最底部。

:::
::: info 📂 Configuration Item Location

General Styles -> Add Content to Bottom of Page

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Add%20Content%20to%20Bottom%20of%20Page" />

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

In Halo CMS backend (<QuickJumpConfig to="/console/settings?tab=codeInjection:~:text=Footer" label="Quick Jump" />), the footer content set there will be displayed above "Theme Information", "Copyright Information", and "Menu at Page Bottom".
The footer content filled in here will be displayed below "Menu at Page Bottom", at the very bottom of the page.

When enabled, you can configure:

- [Content at Bottom of Page](#content-at-bottom-of-page)
- [Multi-language Support for Content at Bottom of Page](#multi-language-support-for-content-at-bottom-of-page)
  - [Custom Multi-language Content at Bottom of Page](#custom-multi-language-content-at-bottom-of-page)

:::

#### Content at Bottom of Page

::: info 🎯 Purpose

Setpage 最底部内容内容。

:::
::: info 📂 Configuration Item Location

([Home Page Style -> Content at Bottom of Page](#content-at-bottom-of-page)When enabled, will display)

Home Page Style -> Content at Bottom of Page

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Content%20at%20Bottom%20of%20Page" />

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

#### Multi-language Support for Content at Bottom of Page

::: info 🎯 Purpose

Controls whetherEnable 多语言 page 最底部内容 Support.

:::
::: info 📂 Configuration Item Location

([Home Page Style -> Content at Bottom of Page](#content-at-bottom-of-page)When enabled, will display)

Home Page Style -> Multi-language Support for Content at Bottom of Page

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=Multi-language%20Support%20for%20Content%20at%20Bottom%20of%20Page" />

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

#### Custom Multi-language Content at Bottom of Page

::: info 🎯 Purpose

Set 多语言 page 最底部内容内容。

:::
::: info 📂 Configuration Item Location

([Home Page Style -> Content at Bottom of Page](#content-at-bottom-of-page)When enabled, will display)

Home Page Style -> Custom Multi-language Content at Bottom of Page

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=Custom%20Multi-language%20Content%20at%20Bottom%20of%20Page" />

:::
::: info 🏷️ Type

Repeater

:::

> [!NOTE] ⭐ Default Value
>
> ::: tip 📂 Configuration Item Name
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
> `zh`,`zh-CN`,`zh-Hans`,`en`,`en-US`
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
> ::: tip 📂 Configuration Item Name
>
> page 最底部内容
>
> :::
> ::: info 🏷️ Type
>
> Code input box (HTML)
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

### Add Underline to H3 Headings

::: info 🎯 Purpose

Enablewhen，In 三级标题 (h3) 下方 Display 下划线装饰，让标题更加突出。

:::
::: info 📂 Configuration Item Location

General Styles -> Add Underline to H3 Headings

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Add%20underline%20to%20H3%20headings" />

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

### Preserve Empty Lines in Block Quotes

::: info 🎯 Purpose

Preserve empty lines in block quotes; otherwise, empty lines in block quotes will be automatically removed.

:::
::: info 📂 Configuration Item Location

General Styles -> Preserve Empty Lines in Block Quotes

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Preserve%20Empty%20Lines%20in%20Block%20Quotes" />

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

引用块写法请参考[写作样式](/guide/style-reference#引用块).

:::

### Add Quotation Mark Before Block Quote

::: info 🎯 Purpose

Add quotation mark before block quote.

:::
::: info 📂 Configuration Item Location

General Styles -> Add Quotation Mark Before Block Quote

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Add%20quotation%20mark%20before%20block%20quote" />

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

### Add Quotation Mark After Block Quote

::: info 🎯 Purpose

Add quotation mark after block quote.

:::
::: info 📂 Configuration Item Location

General Styles -> Add Quotation Mark After Block Quote

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Add%20quotation%20mark%20after%20block%20quote" />

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

### Table Row Lines (Excluding Header)

::: info 🎯 Purpose

Whether 为表格每行底部添加表格线 (除表头).

:::
::: info 📂 Configuration Item Location

General Styles -> Table Row Lines (Excluding Header)

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Table%20row%20lines" />

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

- [表格行间线宽度 (除表头)](#表格行间线宽度-除表头)
<!-- markdownlint-enable MD051 -->

:::

### Table Row Line Width (Excluding Header)

::: info 🎯 Purpose

Set 表格每行底部添表格线的宽度 (除表头).

:::
::: info 📂 Configuration Item Location

<!-- markdownlint-disable MD051 -->

([General Styles -> 表格行间线 (除表头)](#表格行间线-除表头)When enabled, will display)

<!-- markdownlint-enable MD051 -->

General Styles -> Table Row Line Width (Excluding Header)

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Table%20row%20line%20width" />

:::
::: info 🏷️ Type

String

:::
::: info ⭐ Default Value

`8px`

:::
::: info 💡 Example Values

`0px`,`5px`,`10%`,`1rem`

:::
::: info ⚠️ External Constraints

Valid CSS length unit.

:::
::: info 🧩 Template Variable

`theme.config?.styles?.table_bottom_border_width`

:::

### Heading Top Margin Multiplier

::: info 🎯 Purpose

Set[标题](/guide/style-reference#标题)的上边距 (`margin-top`) 倍率。

:::
::: info 📂 Configuration Item Location

General Styles -> Heading Top Margin Multiplier

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Heading%20top%20margin%20multiplier" />

:::
::: info 🏷️ Type

Float/Integer

:::
::: info ⭐ Default Value

`1`

:::
::: info 💡 Example Values

`0.5`,`1`,`1.5`,`2`

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

### Heading Bottom Margin Multiplier

::: info 🎯 Purpose

Set[标题](/guide/style-reference#标题)的下边距 (`margin-bottom`) 倍率。

:::
::: info 📂 Configuration Item Location

General Styles -> Heading Bottom Margin Multiplier

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Heading%20bottom%20margin%20multiplier" />

:::
::: info 🏷️ Type

Float/Integer

:::
::: info ⭐ Default Value

`1`

:::
::: info 💡 Example Values

`0.5`,`1`,`1.5`,`2`

:::
::: info 🔒 Internal Constraints

值 Range 为 0-5

:::
::: info 🧩 Template Variable

`theme.config?.styles?.heading_margin_bottom_multiplier`

:::

### Paragraph Top Margin Multiplier

::: info 🎯 Purpose

Set[段落](/guide/style-reference#段落)的上边距倍率。

:::
::: info 📂 Configuration Item Location

General Styles -> Paragraph Top Margin Multiplier

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Paragraph%20top%20margin%20multiplier" />

:::
::: info 🏷️ Type

Float/Integer

:::
::: info ⭐ Default Value

`1`

:::
::: info 💡 Example Values

`0.5`,`1`,`1.5`,`2`

:::
::: info 🔒 Internal Constraints

值 Range 为 0-5

:::
::: info 🧩 Template Variable

`theme.config?.styles?.paragraph_margin_top_multiplier`

:::

### Paragraph Bottom Margin Multiplier

::: info 🎯 Purpose

Set[段落](/guide/style-reference#段落)的下边距倍率。

:::
::: info 📂 Configuration Item Location

General Styles -> Paragraph Bottom Margin Multiplier

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/styles#:~:text=Paragraph%20bottom%20margin%20multiplier" />

:::
::: info 🏷️ Type

Float/Integer

:::
::: info ⭐ Default Value

`1`

:::
::: info 💡 Example Values

`0.5`,`1`,`1.5`,`2`

:::
::: info 🔒 Internal Constraints

值 Range 为 0-5

:::
::: info 🧩 Template Variable

`theme.config?.styles?.paragraph_margin_bottom_multiplier`

:::

## Home Page Style

应用 Range：[`/(page/{page})`](</reference/template-map#:~:text=/(page/%7Bpage%7D)>).

### Homepage HTML Title

::: info 🎯 Purpose

Custom 主页的 HTML 标题 (willDisplayIn 浏览器标签页上).

:::
::: info 📂 Configuration Item Location

Home Page Style -> Homepage HTML Title

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=Homepage%20HTML%20title" />

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

If left empty, the value will be taken from Halo CMS backend (<QuickJumpConfig to="/console/settings:~:text=Site%20title" label="Quick Jump" />) site title setting.

:::

### Hitokoto (One Quote)

::: info 🎯 Purpose

WhetherIn 首页 Display 一言 (hitokoto) 随机句子服务的内容。

:::
::: info 📂 Configuration Item Location

Home Page Style -> Hitokoto (One Quote)

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=Hitokoto" />

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

- 一言 (hitokoto) 服务链接：
  - Default Value：`https://v1.hitokoto.cn/?encode=js`
  - 补充说明：相关信息 can 阅读其[文档](https://developer.hitokoto.cn/sentence/)获取

:::

### Custom Random Display Quote

::: info 🎯 Purpose

WhetherIn 首页随机 Display 一句话。

:::
::: info 📂 Configuration Item Location

Home Page Style -> Custom Random Display Quote

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=Custom%20Random%20Display%20Quote" />

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

### Personal Profile/Announcement

::: info 🎯 Purpose

In 首页 Display 个人简介 or 公告栏内容。

:::
::: info 📂 Configuration Item Location

Home Page Style -> Personal Profile/Announcement

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=Personal%20profile/Announcement" />

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

#### Multi-language Personal Profile/Announcement Support

::: info 🎯 Purpose

Controls whetherEnable 多语言个人简介/公告栏 Support.

:::
::: info 📂 Configuration Item Location

<!-- markdownlint-disable MD051 -->

([Home Page Style -> 个人简介/公告栏](#个人简介-公告栏)When enabled, will display)

<!-- markdownlint-enable MD051 -->

Home Page Style -> Multi-language Personal Profile/Announcement Support

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=Multi-language%20personal%20profile/announcement%20support" />

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

#### Custom Multi-language Announcement Content

::: info 🎯 Purpose

Set 多语言公告栏内容。

:::
::: info 📂 Configuration Item Location

<!-- markdownlint-disable MD051 -->

([Home Page Style -> 个人简介/公告栏](#个人简介-公告栏)When enabled, will display)

<!-- markdownlint-enable MD051 -->

Home Page Style -> Custom Multi-language Announcement Content

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=Personal%20profile/Announcement%20content" />

:::
::: info 🏷️ Type

Repeater

:::

> [!NOTE] ⭐ Default Value
>
> ::: tip 📂 Configuration Item Name
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
> `zh`,`zh-CN`,`zh-Hans`,`en`,`en-US`
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
> ::: tip 📂 Configuration Item Name
>
> 个人简介/公告栏内容
>
> :::
> ::: info 🏷️ Type
>
> Code input box (HTML)
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

### Display Text on the Left Side of Social Media Icons

::: info 🎯 Purpose

Controls whetherDisplay 首页社交资料 Icon 左侧的文字。

:::
::: info 📂 Configuration Item Location

Home Page Style -> Display Text on the Left Side of Social Media Icons

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=Display%20Text%20on%20the%20Left%20Side%20of%20Social%20Media%20Icons" />

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

### Home Page Post List Title

::: info 🎯 Purpose

Controls whetherDisplay 首页 post 列表的标题。

:::
::: info 📂 Configuration Item Location

Home Page Style -> Home Page Post List Title

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=Enable%20post%20list%20title" />

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

### Home Page List Layout

::: info 🎯 Purpose

选择首页的 post 列表 Display 样式。

:::
::: info 📂 Configuration Item Location

Home Page Style -> Home Page List Layout

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=Home%20page%20post%20list%20layout" />

:::
::: info 🏷️ Type

Option

:::
::: info ⭐ Default Value

`简洁post列表`(internal value `simple-post-list`)

:::
::: info 💡 Other Options

- 多元 post 列表 (internal value `post-list-summary`)
- 瞬间列表 (internal value `moment-list-summary`)

:::
::: info 🧩 Template Variable

`theme.config?.index_styles?.list_layout`

:::
::: info ℹ️ Additional Information

"瞬间列表"Requires[瞬间页](/guide/plugin-compatibility#瞬间页)插件 Enable 后方 can.

根据选择的布局类型，willDisplay 不同的 ConfigurationOption.

简洁列表 When enabled, you can configure

- [Display Post Views in Simple List](#display-post-views-in-simple-list)

多元列表 When enabled, you can configure

- [Display Post Categories in Post List Summary](#display-post-categories-in-post-list-summary)
- [Display Post Tags in Post List Summary](#display-post-tags-in-post-list-summary)
- [Display Post Views in Post List Summary](#display-post-views-in-post-list-summary)
- [Display Post Estimated Reading Time in Post List Summary](#display-post-estimated-reading-time-in-post-list-summary)
- [Display Post Word Count in Post List Summary](#display-post-word-count-in-post-list-summary)
- [Display Post Excerpt in Post List Summary](#display-post-excerpt-in-post-list-summary)
- [Maximum Lines for Post Excerpt in Post List Summary](#maximum-lines-for-post-excerpt-in-post-list-summary)
- [Link Text for Post List Summary](#link-text-for-post-list-summary)
- [Display Post Cover in Post List Summary](#display-post-cover-in-post-list-summary)

瞬间列表 When enabled, you can configure

- [Number of Moments Per Page](#number-of-moments-per-page)
- [Show Author Avatar in Moment List](#show-author-avatar-in-moment-list)
- [Show Author Nickname in Moment List](#show-author-nickname-in-moment-list)

:::

### Display Post Views in Simple List

::: info 🎯 Purpose

Controls whetherIn 简洁列表中 Displaypost 阅读量。

:::
::: info 📂 Configuration Item Location

([Home Page Style -> Home Page List Layout](#home-page-list-layout)Set 为“简洁 post 列表”whenDisplay)

Home Page Style -> Display Post Views in Simple List

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=Display%20Post%20Views%20in%20Simple%20List" />

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

### Display Post Categories in Post List Summary

::: info 🎯 Purpose

Controls whetherIn 多元列表中 Displaypost 分类。

:::
::: info 📂 Configuration Item Location

([Home Page Style -> Home Page List Layout](#home-page-list-layout)Set 为“多元 post 列表”whenDisplay)

Home Page Style -> Display Post Categories in Post List Summary

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=Display%20Post%20Categories%20in%20Post%20List%20Summary" />

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

### Display Post Tags in Post List Summary

::: info 🎯 Purpose

Controls whetherIn 多元列表中 Displaypost 标签。

:::
::: info 📂 Configuration Item Location

([Home Page Style -> Home Page List Layout](#home-page-list-layout)Set 为“多元 post 列表”whenDisplay)

Home Page Style -> Display Post Tags in Post List Summary

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=Display%20Post%20Tags%20in%20Post%20List%20Summary" />

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

### Display Post Views in Post List Summary

::: info 🎯 Purpose

Controls whetherIn 多元列表中 Displaypost 阅读量。

:::
::: info 📂 Configuration Item Location

([Home Page Style -> Home Page List Layout](#home-page-list-layout)Set 为“多元 post 列表”whenDisplay)

Home Page Style -> Display Post Views in Post List Summary

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=Display%20Post%20Views%20in%20Post%20List%20Summary" />

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

### Display Post Estimated Reading Time in Post List Summary

::: info 🎯 Purpose

Controls whetherIn 多元列表中 Displaypost 预计阅读 when 间。

:::
::: info 📂 Configuration Item Location

([Home Page Style -> Home Page List Layout](#home-page-list-layout)Set 为“多元 post 列表”whenDisplay)

Home Page Style -> Display Post Estimated Reading Time in Post List Summary

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=Display%20post%20estimated%20reading%20time%20in%20post%20list%20summary" />

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

### Display Post Word Count in Post List Summary

::: info 🎯 Purpose

Controls whetherIn 多元列表中 Displaypost 字数统计。

:::
::: info 📂 Configuration Item Location

([Home Page Style -> Home Page List Layout](#home-page-list-layout)Set 为“多元 post 列表”whenDisplay)

Home Page Style -> Display Post Word Count in Post List Summary

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=Display%20post%20word%20count%20in%20post%20list%20summary" />

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

### Display Post Excerpt in Post List Summary

::: info 🎯 Purpose

Controls whetherIn 多元列表中 Displaypost 摘要。

:::
::: info 📂 Configuration Item Location

([Home Page Style -> Home Page List Layout](#home-page-list-layout)Set 为“多元 post 列表”whenDisplay)

Home Page Style -> Display Post Excerpt in Post List Summary

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=Display%20post%20excerpt%20in%20post%20list%20summary" />

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

### Maximum Lines for Post Excerpt in Post List Summary

::: info 🎯 Purpose

Set 多元列表中 post 摘要的最大行数。

:::
::: info 📂 Configuration Item Location

([Home Page Style -> Home Page List Layout](#home-page-list-layout)Set 为“多元 post 列表”whenDisplay)

Home Page Style -> Maximum Lines for Post Excerpt in Post List Summary

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=Maximum%20number%20of%20lines%20in%20the%20post%20list%20summary" />

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

### Link Text for Post List Summary

::: info 🎯 Purpose

Controls whetherIn 多元列表中 Display 跳转 post 链接的提示文字。

:::
::: info 📂 Configuration Item Location

([Home Page Style -> Home Page List Layout](#home-page-list-layout)Set 为“多元 post 列表”whenDisplay)

Home Page Style -> Link Text for Post List Summary

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=Display%20the%20text%20of%20the%20post%20list%20permalink" />

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

### Display Post Cover in Post List Summary

::: info 🎯 Purpose

Controls whetherIn 多元列表中 Displaypost 封面。

:::
::: info 📂 Configuration Item Location

([Home Page Style -> Home Page List Layout](#home-page-list-layout)Set 为“多元 post 列表”whenDisplay)

Home Page Style -> Display Post Cover in Post List Summary

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=Display%20Post%20Cover%20in%20Post%20List%20Summary" />

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

### Number of Moments Per Page

::: info 🎯 Purpose

Set 瞬间列表中 Display 的条目数量。

:::
::: info 📂 Configuration Item Location

([Home Page Style -> Home Page List Layout](#home-page-list-layout)Set 为“瞬间列表”whenDisplay)

Home Page Style -> Number of Moments Per Page

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=Number%20of%20Moments%20Per%20Page" />

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

### Show Author Avatar in Moment List

::: info 🎯 Purpose

Controls whetherIn 瞬间列表中 Display 条目作者头像。

:::
::: info 📂 Configuration Item Location

([Home Page Style -> Home Page List Layout](#home-page-list-layout)Set 为“瞬间列表”whenDisplay)

Home Page Style -> Show Author Avatar in Moment List

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=Show%20Author%20Avatar%20in%20Moment%20List" />

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

### Show Author Nickname in Moment List

::: info 🎯 Purpose

Controls whetherIn 瞬间列表中 Display 条目作者昵称。

:::
::: info 📂 Configuration Item Location

([Home Page Style -> Home Page List Layout](#home-page-list-layout)Set 为“瞬间列表”whenDisplay)

Home Page Style -> Show Author Nickname in Moment List

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=Show%20Author%20Nickname%20in%20Moment%20List" />

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

### Top Icon Display on Post List

::: info 🎯 Purpose

Inpost 列表中为置顶 postDisplay 特殊 icon.

:::
::: info 📂 Configuration Item Location

Home Page Style -> Top Icon Display on Post List

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=Top%20Icon%20Display%20on%20Post%20List" />

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

- 置顶 Icon 的位置 (标题左侧 or 右侧)，默认为右侧。

:::

## Post Page Style

应用 Range：[`/archives/{slug}`](/reference/template-map#:~:text=/archives/%7Bslug%7D).

### Optimize Post Paragraph Spacing Display

::: info 🎯 Purpose

为 post 内容段落添加最小高度，以 DisplayEmpty 行。

:::
::: info 📂 Configuration Item Location

post 页样式 -> 优化 post 段落 Empty 行 Display

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=Optimize%20Post%20Paragraph%20Spacing%20Display" />

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

### Document Paragraph First-line Indent

::: info 🎯 Purpose

为 post 内容段落首行添加缩进样式。

:::
::: info 📂 Configuration Item Location

Post Page Style -> Paragraph First-line Indent

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=Enable%20paragraph%20first-line%20indent" />

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
  - Default Value：`2em`(2 字符宽度)
  - 外部约束：CSS 长度单位.Such as: 20rem, 300px, 30vw.

:::

### Post Title Uppercase

::: info 🎯 Purpose

将 post 标题中字符转换为对应大写表示。

Such as: `a` 转换为 `A`.

:::
::: info 📂 Configuration Item Location

post 页样式 -> post 标题大写

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=Post%20title%20uppercase" />

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

### Post Publish Time

::: info 🎯 Purpose

Inpostpage 顶部 Displaypost 的发布 when 间。

:::
::: info 📂 Configuration Item Location

post 页样式 -> post 发布 when 间

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=Post%20Publish%20Time" />

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

### Post Update Time

::: info 🎯 Purpose

Inpostpage 顶部 Displaypost 的最后更新 when 间。

:::
::: info 📂 Configuration Item Location

post 页样式 -> post 更新 when 间

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=Post%20Update%20Time" />

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

### Show Post Views

::: info 🎯 Purpose

InpostpageDisplaypost 的阅读量统计。

:::
::: info 📂 Configuration Item Location

post 页样式 -> post 阅读量

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=Show%20post%20views" />

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

### Show Estimated Reading Time of Post

::: info 🎯 Purpose

InpostpageDisplay 根据 post 字数估算的阅读 when 间。

:::
::: info 📂 Configuration Item Location

post 页样式 -> post 预计阅读 when 间

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=Show%20Estimated%20Reading%20Time%20of%20Post" />

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

### Show Post Word Count

::: info 🎯 Purpose

InpostpageDisplaypost 的总字数。

:::
::: info 📂 Configuration Item Location

post 页样式 -> post 字数统计

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=Show%20post%20word%20count" />

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

### Share Button in Desktop Menu

::: info 🎯 Purpose

Controls whetherIn 桌面端 postpage 的菜单中 Display 分享按钮。

:::
::: info 📂 Configuration Item Location

Post Page Style -> Share Button in Desktop Menu

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=Share%20button%20in%20desktop%20menu" />

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

### Custom Sidebar Table of Contents Maximum Width

::: info 🎯 Purpose

Enable 后 can 以 Configuration

- postpage 右侧边栏目录的最大宽度。

:::
::: info 📂 Configuration Item Location

post 页样式 -> Custom 侧边目录最大宽度

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=Custom%20Sidebar%20Table%20of%20Contents%20Maximum%20Width" />

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
  - Default Value：`20rem`
  - 外部约束：CSS 长度单位.Such as: 20rem, 300px, 30vw.

:::

### Enable Dividing Line at End of Post

::: info 🎯 Purpose

Controls whetherDisplaypost 末尾的的分隔线。

:::
::: info 📂 Configuration Item Location

post 页样式 -> post 末尾的的分隔线

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=Enable%20dividing%20line%20at%20the%20end%20of%20the%20post" />

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

### Upvote Button at Bottom of Post

::: info 🎯 Purpose

Controls whetherDisplaypost 底部的点赞按钮。

:::
::: info 📂 Configuration Item Location

post 页样式 -> post 底部的点赞按钮

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=Upvote%20button%20at%20the%20bottom%20of%20the%20post" />

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
  - Default Value：`1rem`
  - 外部约束：CSS 长度单位.Such as: 20rem, 300px, 30vw.
- 点赞按钮高度
  - 类型：String
  - Default Value：`1rem`
  - 外部约束：CSS 长度单位.Such as: 20rem, 300px, 30vw.
- 展示 post 获赞数
- 点赞按钮位置

:::

### Recommended Articles at Bottom of Post

::: info 🎯 Purpose

Controls whetherInpost 底部 Display 推荐 post 列表。

原理：读取 When 前 post**第一个分类**，并且随机输出其中 If 干个 post.

:::
::: info 📂 Configuration Item Location

post 页样式 -> post 底部的推荐 post

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=Recommended%20articles%20at%20the%20bottom%20of%20the%20post" />

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

IfWhen 前 postIn 随机列表中 will 被剔除，因此实际推荐 post 数 cancan 小于 Set 的“推荐 post 数量”.  
IfWhen 前 post**未 Set 分类**，this 功 canwill 被**Disable**.  
If**分类仅有一篇 post**，this 功 canwill 被**Disable**.

When enabled, you can configure

- 推荐 post 数量

:::

### Adjacent Article Navigation at Bottom of Post

::: info 🎯 Purpose

Enable 后将 Inpost 底部 Display 上一篇和下一篇 post 的导航链接。

:::
::: info 📂 Configuration Item Location

post 页样式 -> post 底部的相邻 post 导航

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=Adjacent%20article%20navigation%20at%20the%20bottom%20of%20the%20post" />

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

### Post Comment Section

::: info 🎯 Purpose

Controls whetherInpostpageDisplay 评论区。

:::
::: info 📂 Configuration Item Location

post 页样式 -> post 评论区

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=Enable%20comment%20section" />

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

### Mobile Bottom Navigation Bar

::: info 🎯 Purpose

Controls whetherIn 移动端 postpage 底部 Display 导航栏。

:::
::: info 📂 Configuration Item Location

Post Page Style -> Mobile Bottom Navigation Bar

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=Mobile%20footer%20navigation" />

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

- Share buttons in mobile bottom navigation bar

:::

## Categories Page Style

应用 Range：[`/categories`](/reference/template-map#:~:text=/categories).

### Category Page Description

::: info 🎯 Purpose

Used forCustomthispage 的 HTML `<meta name="description">` 内容，方便针对 Set SEO 描述。

:::
::: info 📂 Configuration Item Location

Categories Page Style -> Page Description

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/categories_page_styles#:~:text=Page%20description%20(meta%20description)" />

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

If left empty, will fall back to site description (Quick Jump: <QuickJumpConfig to="/console/settings?tab=seo#:~:text=Site%20description" />)

:::

### Display Number of Posts Per Category

::: info 🎯 Purpose

Controls whetherIn 分类列表中 Display 每个分类包含的 post 数量。

:::
::: info 📂 Configuration Item Location

Categories Page Style -> Display Number of Posts Per Category

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/categories_page_styles#:~:text=Display%20Number%20of%20Posts%20Per%20Category" />

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
  - Default Value：`(`
- Inpost 数量右侧的字符
  - 类型：String
  - Default Value：`)`

:::

### Display Multi-layer Categories

::: info 🎯 Purpose

Controls whetherIn 分类 page 展示子分类。

:::
::: info 📂 Configuration Item Location

Categories Page Style -> Display Multi-layer Categories

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/categories_page_styles#:~:text=Display%20multi-layer%20categories" />

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

应用 Range：[`/categories/{slug}`](/reference/template-map#:~:text=/categories/%7Bslug%7D).

### Display Post Views in Category Details Page Post List

::: info 🎯 Purpose

In 分类详情页 Displaypost 阅读量。

:::
::: info 📂 Configuration Item Location

Category Detail Page Style -> post 列表 Displaypost 阅读量

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/category_page_styles#:~:text=Display%20post%20views%20in%20post%20list" />

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

### Show Category RSS Subscription Button

::: info 🎯 Purpose

In 分类详情页 Display RSS 订阅按钮。

:::
::: info 📂 Configuration Item Location

Category Detail Page Style -> 分类 RSS 订阅按钮

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/category_page_styles#:~:text=Show%20RSS%20subscription%20button" />

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

应用 Range：[`/tags`](/reference/template-map#:~:text=/tags).

### Tag Collection Page Description

::: info 🎯 Purpose

Used forCustomthispage 的 HTML `<meta name="description">` 内容，方便针对 Set SEO 描述。

:::
::: info 📂 Configuration Item Location

Tags Page Style -> Page Description

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/tags_page_styles#:~:text=Page%20description%20(meta%20description)" />

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

If left empty, will fall back to site description (Quick Jump: <QuickJumpConfig to="/console/settings?tab=seo#:~:text=Site%20description" />)

:::

### Display Number of Posts Per Tag

::: info 🎯 Purpose

Controls whetherIn 分类列表中 Display 每个标签包含的 post 数量。

:::
::: info 📂 Configuration Item Location

Tags Page Style -> Display Number of Posts Per Tag

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/tags_page_styles#:~:text=Display%20Number%20of%20Posts%20Per%20Tag" />

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
  - Default Value：`(`
- Inpost 数量右侧的字符
  - 类型：String
  - Default Value：`)`
    :::

### Tag Sort Order

::: info 🎯 Purpose

Set 标签 In 标签集合页的排序方式。

:::
::: info 📂 Configuration Item Location

Tags Page Style -> Tag Sort Order

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/tags_page_styles#:~:text=Tag%20sort%20order" />

:::
::: info 🏷️ Type

Option

:::
::: info ⭐ Default Value

默认 (internal value `default`)

:::
::: info 💡 Other Options

- 按 post 数量从多到少 (internal value `count_desc`)
- 按 post 数量从少到多 (internal value `count_asc`)
- 按名称升序 (internal value `name_asc`)
- 按名称降序 (internal value `name_desc`)

:::
::: info 🧩 Template Variable

`theme.config?.tags_page_styles?.tags_sort_order`

:::

## Tag Detail Page Style

应用 Range：[`/tags/{slug}`](/reference/template-map#:~:text=/tags/%7Bslug%7D).

### Display Post Views in Tag Details Page Post List

::: info 🎯 Purpose

In 标签详情页 Displaypost 阅读量。

:::
::: info 📂 Configuration Item Location

Tag Detail Page Style -> post 列表 Displaypost 阅读量

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/tag_page_styles#:~:text=Display%20post%20views%20in%20post%20list" />

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

### Show Tag RSS Subscription Button

::: info 🎯 Purpose

In 标签详情页 Display RSS 订阅按钮。

:::
::: info 📂 Configuration Item Location

Tag Detail Page Style -> Display 标签 RSS 订阅按钮

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/tag_page_styles#:~:text=Show%20RSS%20subscription%20button" />

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

应用 Range：[`/authors/{name}`](/reference/template-map#:~:text=/authors/%7Bname%7D).

### Author Details Page Description

::: info 🎯 Purpose

Used forCustomthispage 的 HTML `<meta name="description">` 内容，方便针对 Set SEO 描述。

:::
::: info 📂 Configuration Item Location

Author Detail Page Style -> Page Description

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/author_page_styles#:~:text=Page%20description%20(meta%20description)" />

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

If left empty, will fall back to site description (Quick Jump: <QuickJumpConfig to="/console/settings?tab=seo#:~:text=Site%20description" />)

:::

### Show Author RSS Subscription Button

::: info 🎯 Purpose

In 作者详情页 Display RSS 订阅按钮。

:::
::: info 📂 Configuration Item Location

Author Detail Page Style -> Show Author RSS Subscription Button

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/author_page_styles#:~:text=Show%20RSS%20subscription%20button" />

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

应用 Range：[`/archives(/{year}(/{month}))`](</reference/template-map#:~:text=/archives(/%7Byear%7D(/%7Bmonth%7D))>).

### Archives Page Description

::: info 🎯 Purpose

Used forCustomthispage 的 HTML `<meta name="description">` 内容，方便针对 Set SEO 描述。

:::
::: info 📂 Configuration Item Location

Archives Page Style -> Page Description

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/archives_page_styles#:~:text=Page%20description%20(meta%20description)" />

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

If left empty, will fall back to site description (Quick Jump: <QuickJumpConfig to="/console/settings?tab=seo#:~:text=Site%20description" />)

:::

### Collapse Post List by Publication Year and Month

::: info 🎯 Purpose

In 归档 page 中，按照 post 发布的年份和月份将 post 列表折叠 Display.

:::
::: info 📂 Configuration Item Location

Archives Page Style -> Collapse Post List by Publication Year and Month

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/archives_page_styles#:~:text=Collapse%20post%20list%20by%20publication%20year%20and%20month" />

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

- 展开折叠动画 when 长 (Unit: 毫 seconds)
  - 类型：Float/Integer
  - Default Value：`200`

:::

## Custom Page Style

应用 Range：[`/{slug}`](/reference/template-map#:~:text=/%7Bslug%7D).

### Optimize Paragraph Spacing Display

::: info 🎯 Purpose

为 Custompage 内容段落添加最小高度，以 DisplayEmpty 行。

:::
::: info 📂 Configuration Item Location

Custompage 样式 -> 优化段落 Empty 行 Display

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/custom_page_styles#:~:text=Optimize%20Paragraph%20Spacing%20Display" />

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

### Enable Paragraph First-line Indent

::: info 🎯 Purpose

为内容段落首行添加缩进样式。

:::
::: info 📂 Configuration Item Location

Custom Page Style -> Paragraph First-line Indent

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/custom_page_styles#:~:text=Enable%20paragraph%20first-line%20indent" />

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
  - Default Value：`2em`(2 字符宽度)
  - 外部约束：CSS 长度单位.Such as: 20rem, 300px, 30vw.

:::

### Show Estimated Reading Time of Page

::: info 🎯 Purpose

InpageDisplay 根据 post 字数估算的阅读 when 间。

:::
::: info 📂 Configuration Item Location

Custompage 样式 -> page 预计阅读 when 间

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/custom_page_styles#:~:text=Show%20Estimated%20Reading%20Time%20of%20Page" />

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

### Show Word Count of Page

::: info 🎯 Purpose

InpageDisplaypost 的总字数。

:::
::: info 📂 Configuration Item Location

Custompage 样式 -> page 字数统计

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/custom_page_styles#:~:text=Show%20Word%20Count%20of%20Page" />

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

### Enable Dividing Line at End of Page Content

::: info 🎯 Purpose

Controls whetherDisplaypage 正文内容末尾的的分隔线。

:::
::: info 📂 Configuration Item Location

Custompage 样式 -> page 正文内容末尾分隔线

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/post_styles#:~:text=Enable%20Dividing%20Line%20at%20End%20of%20Page%20Content" />

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

### Enable Comment Section

::: info 🎯 Purpose

Controls whetherInpageDisplay 评论区。

:::
::: info 📂 Configuration Item Location

Custompage 样式 -> page 评论区

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/custom_page_styles#:~:text=Enable%20Comment%20Section" />

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

### Page Auto-redirect

::: info 🎯 Purpose

In 错误 page(如 `404`) 自动跳转到 Specifypage.

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
  - Default Value：`/`
  - 外部约束：合法的相对/绝对链接
- 跳转等待 when 间 (Unit: seconds)
  - 类型：Integer
  - Default Value：`5`

:::

## Social Profile/RSS

### Home Page Social Profile Display

::: info 🎯 Purpose

In 首页展示社交媒体链接和 RSS 订阅等资料。

:::
::: info 📂 Configuration Item Location

社交资料/RSS -> 首页社交资料展示

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/sns#:~:text=Home%20page%20social%20profile%20display" />

:::
::: info 🏷️ Type

数组 (can 重复添加多个社交资料)

:::
::: info ⭐ Default Value

Empty 数组 `[]`

:::
::: info 🧩 Template Variable

`theme.config?.sns?.index_sns`

:::
::: info ℹ️ Additional Information

- Support 多种预设社交平台：RSS,BiliBili,Dribbble,Email,Facebook,GitHub,Instagram,QQ,Reddit,Stack Overflow,Telegram,X(Twitter),YouTube，豆瓣，网易云音乐，微博，知乎等
- SupportCustom 社交资料
- Support 纯文本 Display
- can 通过"SetCustom 资料"Configuration 自己的社交平台

:::

### Social Media Settings

::: info 🎯 Purpose

定义自己的社交资料，Used forIn 首页社交资料展示中。

:::
::: info 📂 Configuration Item Location

社交资料/RSS -> SetCustom 资料

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/sns#:~:text=Social%20media%20settings" />

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

Provide 了主流平台的预设值，只 Requires 要填写对应平台的 identifier 就 can 以添加。

除此之外，你也 can 以添加 Custom 资料。

每个 Custom 资料 Requires 要 Configuration：

- identifier：任意字母，Number，下划线组合 (如 `myBlog`)
- 链接：完整的 URL(如 `https://example.com`)
- Icon
- aria-label：无障碍标签 (如 `Find me on my blog`)

:::

## Custom Share Buttons

### Share Button Settings

::: info 🎯 Purpose

Configurationpostpage 的分享按钮列表，Support 多种分享方式。

:::
::: info 📂 Configuration Item Location

Custom 分享按钮 -> 分享按钮 Set

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/share#:~:text=Custom%20Share%20Buttons" />

:::
::: info 🏷️ Type

Repeater

:::
::: info ⭐ Default Value

包含多个预设分享按钮：E-mail,QRCode,Native,Facebook,X,LinkedIn,Pinterest,Telegram,QQ,Weibo,WeChat,Qzone,Douban

:::
::: info 🧩 Template Variable

`theme.config?.share?.button_config`

:::
::: info ℹ️ Additional Information

- `@URL` 和 `@TITLE` 是占位符，Usewhenwill 被替换为 page 实际地址和标题
- 每个分享按钮有四个 canConfiguration 项：名称，链接，Icon(Set 后将覆盖默认 Icon),`aria-label`(无障碍标签)
- can 以自由调整顺序，删除 or 新增分享按钮

:::

## Links Page Style

Requires[链接管理插件](/guide/plugin-compatibility#链接页)Enable 后方 can.

### Avatar-First Style

::: info 🎯 Purpose

Enable 后，链接页将 Use 强调头像的网格布局，每行最多 Display 三个链接，适合 Requires 要突出展示链接站点头像的场景。

:::
::: info 📂 Configuration Item Location

Links Page Style -> 头像优先样式

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/links_page_styles#:~:text=Avatar-First%20Style" />

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
  - 采用响应式三列网格 (根据 page 宽度，自动选择列数，最高三列)
  - 头像居中 Display，尺寸更大
  - 链接信息垂直排列 In 头像下方
  - 鼠标悬停 when 卡片上浮并有阴影效果
  - 头像 In 鼠标悬停 whenwill 放大并改变边框颜色

:::

### Link Description Maximum Lines

::: info 🎯 Purpose

Set 链接描述的最大行数。

:::
::: info 📂 Configuration Item Location

([Links Page Style -> Avatar-First Style](#avatar-first-style)When enabled, will display)

Links Page Style -> 链接描述行数上限

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/links_page_styles#:~:text=Link%20Description%20Maximum%20Lines" />

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

### Image Border Radius

::: info 🎯 Purpose

Set 相册 page 中图片的圆角宽度。

:::
::: info 📂 Configuration Item Location

相册页样式 -> 图片圆角宽度

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/photos_styles#:~:text=Image%20border%20radius" />

:::
::: info 🏷️ Type

String

:::
::: info ⭐ Default Value

`8px`

:::
::: info 💡 Example Values

`0px`,`5px`,`10%`,`1rem`

:::
::: info ⚠️ External Constraints

Valid CSS length unit.

:::
::: info 🧩 Template Variable

`theme.config?.photos_styles?.img_border_radius`

:::

### Image Fade-in Animation Duration

::: info 🎯 Purpose

Set 相册 page 中图片渐入动画 when 间。

:::
::: info 📂 Configuration Item Location

相册页样式 -> 图片渐入动画 when 间

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/photos_styles#:~:text=Image%20Fade-in%20Animation%20Duration" />

:::
::: info 🏷️ Type

Integer/Float (Unit: seconds)

:::
::: info ⭐ Default Value

`0.2`

:::
::: info 💡 Example Values

`1`,`0`

:::
::: info 🧩 Template Variable

`theme.config?.photos_styles?.img_transition_duration_after_load`

:::

### Enable Masonry Layout

::: info 🎯 Purpose

In 相册 pageUse 瀑布流布局展示图片。

:::
::: info 📂 Configuration Item Location

相册页样式 -> Enable 瀑布流布局

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/photos_styles#:~:text=Enable%20Masonry%20Layout" />

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

### Show Estimated Reading Time of Moment

::: info 🎯 Purpose

In 帖子开头 Display 根据字数估算的阅读 when 间。

:::
::: info 📂 Configuration Item Location

Moments Page Style -> Show Estimated Reading Time of Moment

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/moments_styles#:~:text=Show%20Estimated%20Reading%20Time%20of%20Moment" />

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

### Show Word Count of Moment

::: info 🎯 Purpose

In 帖子开头 Displaypost 的总字数。

:::
::: info 📂 Configuration Item Location

Moments Page Style -> Show Word Count of Moment

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/moments_styles#:~:text=Show%20Word%20Count%20of%20Moment" />

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

### Moment Page Upvote Button

::: info 🎯 Purpose

In 瞬间 pageDisplay 点赞按钮。

:::
::: info 📂 Configuration Item Location

Moments Page Style -> Enable Upvote Button

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/moments_styles#:~:text=Enable%20upvote%20button" />

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

### Moment Page Comment Section

::: info 🎯 Purpose

Controls whetherIn 瞬间 pageDisplay 评论区。

:::
::: info 📂 Configuration Item Location

Moments Page Style -> Enable Comment Section

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/moments_styles#:~:text=Enable%20comment%20section" />

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

<QuickJumpConfig to="/console/theme/settings/friends_page_styles#:~:text=Show%20publish%20date" />

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

<QuickJumpConfig to="/console/theme/settings/friends_page_styles#:~:text=Show%20author%20information" />

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

<QuickJumpConfig to="/console/theme/settings/friends_page_styles#:~:text=Show%20author%20avatar" />

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

<QuickJumpConfig to="/console/theme/settings/friends_page_styles#:~:text=Show%20author%20name" />

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

<QuickJumpConfig to="/console/theme/settings/friends_page_styles#:~:text=Show%20post%20description" />

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

<QuickJumpConfig to="/console/theme/settings/friends_page_styles#:~:text=Maximum%20lines%20for%20post%20description" />

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

<QuickJumpConfig to="/console/theme/settings/friends_page_styles#:~:text=Show%20link%20text" />

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

You can learn more about:

- [Metadata Configuration Items](/guide/metadata-configuration)
