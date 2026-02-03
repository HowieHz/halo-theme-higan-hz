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

([Global -> Auto-redirect Based on Browser Language](#Auto-redirect Based on Browser Language) When enabled, will display)

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

([Global -> Only Allow Access from Specified Domains](#Only Allow Access from Specified Domains) When enabled, will display)

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

([Global -> Only Allow Access from Specified Domains](#Only Allow Access from Specified Domains) When enabled, will display)

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

([Global -> Only Allow Access from Specified Domains](#Only Allow Access from Specified Domains) When enabled, will display)

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

([General Styles -> Enable Custom Font Files](#enable-custom-font-files) When enabled, will display)

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

([General Styles -> Enable Custom Font Files](#enable-custom-font-files) When enabled, will display)

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
> After disabling this option, you only need to fill in the Custom CSS Variables part.
> The output will be automatically placed in the corresponding CSS selector (selector is `html[theme="theme-{identifier}"]`).
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
> When `CSS Raw Output Mode` is enabled, the content you fill in must be valid CSS code.
> When `CSS Raw Output Mode` is disabled, the following content must be valid CSS code:
>
> ```css
> html[theme="theme-{identifier}"] {
>   /* Your content here */
> }
> ```
>
> :::
> ::: info ℹ️ Additional Information
>
> Here are some example CSS variables:
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
> Here is an example of `CSS Raw Output Mode`:
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

Related information:

[Adapting Mermaid to Light/Dark Mode Toggle](/guide/style-reference#adapting-mermaid-to-lightdark-mode-toggle)

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

Set the overall font size of the site.

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

`Small` (internal value `small`)

:::
::: info 💡 Other Options

- `Regular` (internal value `normal`)
- `Large` (internal value `large`)

:::
::: info 🧩 Template Variable

`theme.config?.styles?.text_size`

:::

### Custom Content Area Maximum Width

::: info 🎯 Purpose

Whether to define the Content Area Maximum Width.

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

If you disable this option, the Content Area Maximum Width will change with the page width, but the content may appear to be left-aligned overall.
If you want to disable this option, it is recommended to enable "Content Area Minimum Width" and "Custom Content Area Width Property".

When enabled, you can configure:

- [Content Area Maximum Width](#content-area-maximum-width)

:::

### Content Area Maximum Width

::: info 🎯 Purpose

Set the maximum width of the content area.

:::
::: info 📂 Configuration Item Location

([General Styles -> Custom Content Area Maximum Width](#custom-content-area-maximum-width) When enabled, will display)

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

Whether to define Content Area Minimum Width.

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

When the window width is less than the set width, the actual window width will be used to avoid horizontal scrollbars.

When enabled, you can configure:

- [Content Area Minimum Width](#content-area-minimum-width)
- [Force Apply Content Area Minimum Width](#force-apply-content-area-minimum-width)

:::

### Content Area Minimum Width

::: info 🎯 Purpose

Set the minimum width of the content area.

:::
::: info 📂 Configuration Item Location

([General Styles -> Custom Content Area Minimum Width](#custom-Content Area Minimum Width) When enabled, will display)

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

Controls whether to force apply Content Area Minimum Width.

:::
::: info 📂 Configuration Item Location

([General Styles -> Custom Content Area Minimum Width](#custom-Content Area Minimum Width) When enabled, will display)

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

- When disabled: When the window width is less than the set minimum width, the actual window width will be used to avoid horizontal scrollbars.
- When enabled: Forces the content display area to be no less than the set minimum width, even if it causes horizontal scrollbars.

:::

### Custom Content Area Width Property

::: info 🎯 Purpose

Whether to define Content Area Width Property.

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

Determines the content area width style.

:::
::: info 📂 Configuration Item Location

([General Styles -> Custom Content Area Width Property](/guide/theme-configuration#CustomContent Area Width Property) When enabled, will display)

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

Must conform to the requirements specified in the [documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/width#values).

:::
::: info 🧩 Template Variable

`theme.config?.styles?.content_width_style`

:::
::: info ℹ️ Additional Information

Default Value effect: Makes the content area width equal to the width of the widest content. (This option actually sets the style value for the `width` property of the content area)

:::

### Header Avatar Display

::: info 🎯 Purpose

Controls whether to display avatar in the header.

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

Used to select an uploaded image as the header avatar. If not set, the default avatar `/themes/howiehz-higan/images/logo.{avif,webp,png}` will be used.

:::
::: info 📂 Configuration Item Location

([Global -> Header Avatar Display](#header-avatar-display) When enabled, will display)

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

Controls whether to force crop the avatar into a circle.

:::
::: info 📂 Configuration Item Location

([Global -> Header Avatar Display](#header-avatar-display) When enabled, will display)

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

Controls whether to force grayscale processing of the avatar.

:::
::: info 📂 Configuration Item Location

([Global -> Header Avatar Display](#header-avatar-display) When enabled, will display)

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

Controls whether to display additional menu items in the menu.

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

Includes one preset: Search (requires [Search Component Plugin](/guide/plugin-compatibility#search-component)).

:::

> [!NOTE] 💡 Example Value
>
> ::: tip 📂 Configuration Item Name
>
> Menu Item Type
>
> :::
> ::: info 🏷️ Type
>
> Option
>
> :::
> ::: info ⭐ Default Value
>
> `Search` (requires [Search Component Plugin](/guide/plugin-compatibility#search-component)) (internal value `search`)
>
> :::
> ::: info 💡 Other Options
>
> - Random post (internal value `random`)
> - User Account (internal value `user`)
>
> :::
> ::: info 🔒 Internal Constraints
>
> Required field
>
> :::
> ::: info ℹ️ Additional Information
>
> For `User Account` type:
>
> - When not logged in, the menu displays `Login`, and clicking it redirects to `/login` page.
> - When logged in, the menu displays the username, and clicking it redirects to `/uc` page.
>
> :::

::: info 🧩 Template Variable

`theme.config?.styles?.extra_menu_items`

:::

### Display Header Menu

::: info 🎯 Purpose

Controls whether to display the header menu.

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

Controls whether to display page numbers.

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

Controls whether to display site statistics at the page footer.

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

Set statistics items.

:::
::: info 📂 Configuration Item Location

([Home Page Style -> Site Statistics at Page Bottom](#site-statistics-at-page-bottom) When enabled, will display)

General Styles -> Statistics Item Settings

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/global#:~:text=Statistics%20Item%20Settings" />

:::
::: info 🏷️ Type

Repeater

:::
::: info ⭐ Default Value

Includes multiple preset share buttons: Total Views, Total Posts, Total Likes, Total Comments, Total Categories, Total Words (requires [API Extension Plugin](/guide/plugin-compatibility#api-extension)).

:::

> [!NOTE] 💡 Example Value
>
> ::: tip 📂 Configuration Item Name
>
> Statistics Item
>
> :::
> ::: info 🏷️ Type
>
> Option
>
> :::
> ::: info ⭐ Default Value
>
> Total Views (internal value `visit`)
>
> :::
> ::: info 💡 Other Options
>
> - Total Posts (internal value `post`)
> - Total Likes (internal value `upvote`)
> - Total Comments (internal value `comment`)
> - Total Categories (internal value `category`)
> - Total Words (internal value `wordcount`)
>
> :::
> ::: info 🔒 Internal Constraints
>
> Required field
>
> :::
> ::: tip 📂 Configuration Item Name
>
> Multilingual text wrapping number
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
> Icon to the left of text
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

Controls whether to display theme information at the page footer.

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

Set the theme name displayed in the page footer theme information.

:::
::: info 📂 Configuration Item Location

([General Styles -> Theme Information at Page Bottom](#theme-information-at-page-bottom) When enabled, will display)

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

- Higan (internal value `Higan`)
- 彼岸 (internal value `彼岸`)

:::
::: info 🧩 Template Variable

`theme.config?.styles?.footer_theme_info_theme_name`

:::

#### Halo Version Displayed in Theme Information at Page Bottom

::: info 🎯 Purpose

Set the Halo version displayed in the page footer theme information.

:::
::: info 📂 Configuration Item Location

([General Styles -> Theme Information at Page Bottom](#theme-information-at-page-bottom) When enabled, will display)

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

- Halo Pro (internal value `Halo Pro`)
- Halo Professional Edition (internal value `Halo Professional Edition`)

:::
::: info 🧩 Template Variable

`theme.config?.styles?.footer_theme_info_halo_version_name`

:::

### Copyright Information at Page Bottom

::: info 🎯 Purpose

Controls whether to display copyright information at the page footer.

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

Set the attribution for copyright information at the page footer.

:::
::: info 📂 Configuration Item Location

([General Styles -> Copyright Information at Page Bottom](#copyright-information-at-page-bottom) When enabled, will display)

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

Controls whether to force the footer and page numbers to the bottom of the page.

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

Controls whether to display the footer menu.

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

Controls adding content to the very bottom of the page.

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

Set the content for the very bottom of the page.

:::
::: info 📂 Configuration Item Location

([Home Page Style -> Content at Bottom of Page](#content-at-bottom-of-page) When enabled, will display)

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
That's all!
```

HTML code is also allowed:

```html
<code>Nothing below</code>
```

:::
::: info ⚠️ External Constraints

Valid HTML code.

:::
::: info 🧩 Template Variable

`theme.config?.styles?.footer_content`

:::

#### Multi-language Support for Content at Bottom of Page

::: info 🎯 Purpose

Controls whether to enable multilingual support for page bottom content.

:::
::: info 📂 Configuration Item Location

([Home Page Style -> Content at Bottom of Page](#content-at-bottom-of-page) When enabled, will display)

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

After enabling, please refer to the [Multilingual Page Bottom Content Usage Guide](/tutorial/i18n#multilingual-page-bottom-content-usage-guide) for configuration

:::

#### Custom Multi-language Content at Bottom of Page

::: info 🎯 Purpose

Set the multilingual page bottom content.

:::
::: info 📂 Configuration Item Location

([Home Page Style -> Content at Bottom of Page](#content-at-bottom-of-page) When enabled, will display)

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
> The set value must comply with [BCP 47](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang), otherwise it will be invalid.
>
> :::
> ::: tip 📂 Configuration Item Name
>
> Page Bottom Content
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
> That's all!
> ```
>
> HTML code is also allowed:
>
> ```html
> <code>Nothing below</code>
> ```
>
> :::
> ::: info ⚠️ External Constraints
>
> Valid HTML code.
>
> :::

::: info 🧩 Template Variable

`theme.config?.styles?.i18n_footer_content`

:::

### Add Underline to H3 Headings

::: info 🎯 Purpose

When enabled, display underline decoration below third-level headings (h3) to make the headings more prominent.

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

For blockquote syntax, please refer to [Writing Style](/guide/style-reference#blockquotes).

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

Whether to add table lines at the bottom of each table row (except header).

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

- [Table Row Line Width (Except Header)](#table-row-line-width-except-header)
<!-- markdownlint-enable MD051 -->

:::

### Table Row Line Width (Excluding Header)

::: info 🎯 Purpose

Set the width of table lines added at the bottom of each table row (except header).

:::
::: info 📂 Configuration Item Location

<!-- markdownlint-disable MD051 -->

([General Styles -> Table Row Lines (Except Header)](#table-row-lines-except-header) When enabled, will display)

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

Set the top margin (`margin-top`) multiplier for [headings](/guide/style-reference#headings).

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

Value range is 0-5

:::
::: info 🧩 Template Variable

`theme.config?.styles?.heading_margin_top_multiplier`

:::
::: info ℹ️ Additional Information

A value of 1 means use default margin, less than 1 reduces margin, greater than 1 increases margin.

:::

### Heading Bottom Margin Multiplier

::: info 🎯 Purpose

Set the bottom margin (`margin-bottom`) multiplier for [headings](/guide/style-reference#headings).

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

Value range is 0-5

:::
::: info 🧩 Template Variable

`theme.config?.styles?.heading_margin_bottom_multiplier`

:::

### Paragraph Top Margin Multiplier

::: info 🎯 Purpose

Set the top margin multiplier for [paragraphs](/guide/style-reference#paragraphs).

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

Value range is 0-5

:::
::: info 🧩 Template Variable

`theme.config?.styles?.paragraph_margin_top_multiplier`

:::

### Paragraph Bottom Margin Multiplier

::: info 🎯 Purpose

Set the bottom margin multiplier for [paragraphs](/guide/style-reference#paragraphs).

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

Value range is 0-5

:::
::: info 🧩 Template Variable

`theme.config?.styles?.paragraph_margin_bottom_multiplier`

:::

## Home Page Style

Application Range: [`/(page/{page})`](</reference/template-map#:~:text=/(page/%7Bpage%7D)>).

### Homepage HTML Title

::: info 🎯 Purpose

Customize the HTML title for the homepage (will be displayed in the browser tab).

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

If the configuration value is too long, it may affect SEO and page display effects.

:::
::: info 🧩 Template Variable

`theme.config?.index_styles?.page_html_title`

:::
::: info ℹ️ Additional Information

If left empty, the value will be taken from Halo CMS backend (<QuickJumpConfig to="/console/settings:~:text=Site%20title" label="Quick Jump" />) site title setting.

:::

### Hitokoto (One Quote)

::: info 🎯 Purpose

Whether to display content from the Hitokoto random sentence service on the homepage.

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

- Hitokoto service link:
  - Default Value:`https://v1.hitokoto.cn/?encode=js`
  - Additional notes: Related information can be obtained by reading the [documentation](https://developer.hitokoto.cn/sentence/)

:::

### Custom Random Display Quote

::: info 🎯 Purpose

Whether to randomly display a sentence on the homepage.

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

- Custom sentence content

:::

### Personal Profile/Announcement

::: info 🎯 Purpose

Display personal profile or announcement content on the homepage.

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

- Personal Profile/Announcement Content
- Multilingual Personal Profile/Announcement Support
  - Custom multilingual announcement content

:::

#### Multi-language Personal Profile/Announcement Support

::: info 🎯 Purpose

Controls whether to enable multilingual personal profile/announcement support.

:::
::: info 📂 Configuration Item Location

<!-- markdownlint-disable MD051 -->

([Home Page Style -> Personal Profile/Announcement](#personal-profile-announcement) When enabled, will display)

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

After enabling, please refer to the [Multilingual Personal Profile/Announcement Usage Guide](/tutorial/i18n#multilingual-personal-profile-announcement-usage-guide) for configuration

:::

#### Custom Multi-language Announcement Content

::: info 🎯 Purpose

Set multilingual announcement content.

:::
::: info 📂 Configuration Item Location

<!-- markdownlint-disable MD051 -->

([Home Page Style -> Personal Profile/Announcement](#personal-profile-announcement) When enabled, will display)

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
> The set value must comply with [BCP 47](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang), otherwise it will be invalid.
>
> :::
> ::: tip 📂 Configuration Item Name
>
> Personal Profile/Announcement Content
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
> Welcome everyone to visit this site!
> ```
>
> HTML code is also allowed:
>
> ```html
> <code>Supports HTML code</code>
> ```
>
> :::
> ::: info ⚠️ External Constraints
>
> Valid HTML code.
>
> :::

::: info 🧩 Template Variable

`theme.config?.index_styles?.i18n_resume`

:::

### Display Text on the Left Side of Social Media Icons

::: info 🎯 Purpose

Controls whether to display text to the left of social profile icons on the homepage.

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

Controls whether to display the title of the homepage post list.

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

Select the display style for the homepage post list.

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

`Simple Post List` (internal value `simple-post-list`)

:::
::: info 💡 Other Options

- `Multi-element Post List` (internal value `post-list-summary`)
- `Moments List` (internal value `moment-list-summary`)

:::
::: info 🧩 Template Variable

`theme.config?.index_styles?.list_layout`

:::
::: info ℹ️ Additional Information

"Moments List" requires the [Moments Page](/guide/plugin-compatibility#moments-page) plugin to be enabled.

Different configuration options will be displayed based on the selected layout type.

When Simple List is enabled, you can configure

- [Display Publish Date in Simple List](#display-publish-date-in-simple-list)
- [Display Post Views in Simple List](#display-post-views-in-simple-list)

When Multi-element List is enabled, you can configure

- [Display Publish Date in Post List Summary](#display-publish-date-in-post-list-summary)
- [Display Post Categories in Post List Summary](#display-post-categories-in-post-list-summary)
- [Display Post Tags in Post List Summary](#display-post-tags-in-post-list-summary)
- [Display Post Views in Post List Summary](#display-post-views-in-post-list-summary)
- [Display Post Estimated Reading Time in Post List Summary](#display-post-estimated-reading-time-in-post-list-summary)
- [Display Post Word Count in Post List Summary](#display-post-word-count-in-post-list-summary)
- [Display Post Excerpt in Post List Summary](#display-post-excerpt-in-post-list-summary)
- [Maximum Lines for Post Excerpt in Post List Summary](#maximum-lines-for-post-excerpt-in-post-list-summary)
- [Link Text for Post List Summary](#link-text-for-post-list-summary)
- [Display Post Cover in Post List Summary](#display-post-cover-in-post-list-summary)

When Moments List is enabled, you can configure

- [Number of Moments Per Page](#number-of-moments-per-page)
- [Show Author Avatar in Moment List](#show-author-avatar-in-moment-list)
- [Show Author Nickname in Moment List](#show-author-nickname-in-moment-list)

:::

### Display Publish Date in Simple List

::: info 🎯 Purpose

Controls whether to display the publication date of posts in the simple list.

:::
::: info 📂 Configuration Item Location

([Home Page Style -> Home Page List Layout](#home-page-list-layout) Displayed when set to "Simple Post List")

Home Page Style -> Display Publish Date in Simple List

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=Display%20publish%20date%20in%20simple%20post%20list" />

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

### Display Post Views in Simple List

::: info 🎯 Purpose

Controls whether to display post view count in the simple list.

:::
::: info 📂 Configuration Item Location

([Home Page Style -> Home Page List Layout](#home-page-list-layout) Displayed when set to "Simple Post List")

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

### Display Publish Date in Post List Summary

::: info 🎯 Purpose

Controls whether to display the publication date of posts in the post list summary.

:::
::: info 📂 Configuration Item Location

([Home Page Style -> Home Page List Layout](#home-page-list-layout) Displayed when set to "Rich Post List")

Home Page Style -> Display Publish Date in Post List Summary

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/index_styles#:~:text=Display%20publish%20date%20in%20post%20list%20summary" />

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

### Display Post Categories in Post List Summary

::: info 🎯 Purpose

Controls whether to display post categories in the multi-element list.

:::
::: info 📂 Configuration Item Location

([Home Page Style -> Home Page List Layout](#home-page-list-layout) Displayed when set to "Multi-element Post List")

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

Controls whether to display post tags in the multi-element list.

:::
::: info 📂 Configuration Item Location

([Home Page Style -> Home Page List Layout](#home-page-list-layout) Displayed when set to "Multi-element Post List")

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

Controls whether to display post view count in the multi-element list.

:::
::: info 📂 Configuration Item Location

([Home Page Style -> Home Page List Layout](#home-page-list-layout) Displayed when set to "Multi-element Post List")

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

Controls whether to display estimated reading time in the multi-element list.

:::
::: info 📂 Configuration Item Location

([Home Page Style -> Home Page List Layout](#home-page-list-layout) Displayed when set to "Multi-element Post List")

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

After enabling the [API Extension](/guide/plugin-compatibility#api-extension) plugin, a more accurate measurement method will be automatically enabled.

:::

### Display Post Word Count in Post List Summary

::: info 🎯 Purpose

Controls whether to display post word count in the multi-element list.

:::
::: info 📂 Configuration Item Location

([Home Page Style -> Home Page List Layout](#home-page-list-layout) Displayed when set to "Multi-element Post List")

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

After enabling the [API Extension](/guide/plugin-compatibility#api-extension) plugin, a more accurate measurement method will be automatically enabled.

:::

### Display Post Excerpt in Post List Summary

::: info 🎯 Purpose

Controls whether to display post excerpt in the multi-element list.

:::
::: info 📂 Configuration Item Location

([Home Page Style -> Home Page List Layout](#home-page-list-layout) Displayed when set to "Multi-element Post List")

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

Set the maximum number of lines for post excerpt in the multi-element list.

:::
::: info 📂 Configuration Item Location

([Home Page Style -> Home Page List Layout](#home-page-list-layout) Displayed when set to "Multi-element Post List")

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

Controls whether to display the prompt text for the post link in the multi-element list.

:::
::: info 📂 Configuration Item Location

([Home Page Style -> Home Page List Layout](#home-page-list-layout) Displayed when set to "Multi-element Post List")

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

If this option is disabled, the post items in the homepage post list will not display the link text

:::

### Display Post Cover in Post List Summary

::: info 🎯 Purpose

Controls whether to display post cover in the multi-element list.

:::
::: info 📂 Configuration Item Location

([Home Page Style -> Home Page List Layout](#home-page-list-layout) Displayed when set to "Multi-element Post List")

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

Set the number of items displayed in the moments list.

:::
::: info 📂 Configuration Item Location

([Home Page Style -> Home Page List Layout](#home-page-list-layout) Displayed when set to "Moments List")

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

Controls whether to display the author avatar in the moments list.

:::
::: info 📂 Configuration Item Location

([Home Page Style -> Home Page List Layout](#home-page-list-layout) Displayed when set to "Moments List")

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

Controls whether to display the author nickname in the moments list.

:::
::: info 📂 Configuration Item Location

([Home Page Style -> Home Page List Layout](#home-page-list-layout) Displayed when set to "Moments List")

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

Display a special icon for pinned posts in the post list.

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

- Position of the pinned icon (left or right of the title), default is right.

:::

## Post Page Style

Application Range: [`/archives/{slug}`](/reference/template-map#:~:text=/archives/%7Bslug%7D).

### Optimize Post Paragraph Spacing Display

::: info 🎯 Purpose

Add minimum height to post content paragraphs to display empty lines.

:::
::: info 📂 Configuration Item Location

Post Page Style -> Optimize Post Paragraph Empty Line Display

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
::: details ℹ️ Additional Information

Different Markdown editors use different parsers, so this configuration item may have different effects on the final rendering result.
Related link: [babelmark3](https://babelmark.github.io/) is a website that compares the parsing results of different Markdown parsers.

:::

### Document Paragraph First-line Indent

::: info 🎯 Purpose

Add indentation style to the first line of post content paragraphs.

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

- First line indentation value
  - Type: String
  - Default Value: `2em` (2 character width)
  - External constraints: CSS length units. Such as: 20rem, 300px, 30vw.

:::

### Post Title Uppercase

::: info 🎯 Purpose

Convert characters in post titles to uppercase.

Such as: `a` converts to `A`.

:::
::: info 📂 Configuration Item Location

Post Page Style -> Post Title Uppercase

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

Display the post publication time at the top of the post page.

:::
::: info 📂 Configuration Item Location

Post Page Style -> Post Publication Time

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

- Text to the left of post publication time

:::

### Post Update Time

::: info 🎯 Purpose

Display the post last update time at the top of the post page.

:::
::: info 📂 Configuration Item Location

Post Page Style -> Post Update Time

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

- Text to the left of post update time

:::

### Show Post Views

::: info 🎯 Purpose

Display post view count statistics on the post page.

:::
::: info 📂 Configuration Item Location

Post Page Style -> Post View Count

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

Display estimated reading time based on post word count on the post page.

:::
::: info 📂 Configuration Item Location

Post Page Style -> Post Estimated Reading Time

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

After enabling the [API Extension](/guide/plugin-compatibility#api-extension) plugin, a more accurate measurement method will be automatically enabled.

:::

### Show Post Word Count

::: info 🎯 Purpose

Display the total word count of the post on the post page.

:::
::: info 📂 Configuration Item Location

Post Page Style -> Post Word Count

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

After enabling the [API Extension](/guide/plugin-compatibility#api-extension) plugin, a more accurate measurement method will be automatically enabled.

:::

### Share Button in Desktop Menu

::: info 🎯 Purpose

Controls whether to display the share button in the menu on the desktop post page.

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

When enabled, you can configure

- Maximum width of the sidebar table of contents on the post page.

:::
::: info 📂 Configuration Item Location

Post Page Style -> Custom Sidebar Table of Contents Maximum Width

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

- Sidebar Table of Contents Maximum Width
  - Type: String
  - Default Value:`20rem`
  - External constraints: CSS length units. Such as: 20rem, 300px, 30vw.

:::

### Enable Dividing Line at End of Post

::: info 🎯 Purpose

Controls whether to display the separator at the end of the post.

:::
::: info 📂 Configuration Item Location

Post Page Style -> Post End Separator

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

Controls whether to display the like button at the bottom of the post.

:::
::: info 📂 Configuration Item Location

Post Page Style -> Post Bottom Like Button

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

- Like button width
  - Type: String
  - Default Value:`1rem`
  - External constraints: CSS length units. Such as: 20rem, 300px, 30vw.
- Like button height
  - Type: String
  - Default Value:`1rem`
  - External constraints: CSS length units. Such as: 20rem, 300px, 30vw.
- Display post like count
- Like button position

:::

### Recommended Articles at Bottom of Post

::: info 🎯 Purpose

Controls whether to display recommended post list at the bottom of the post.

Principle: Reads the **first category** of the current post and randomly outputs some posts from it.

:::
::: info 📂 Configuration Item Location

Post Page Style -> Recommended Posts at Post Bottom

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

If the current post is in the random list it will be excluded, so the actual number of recommended posts may be less than the set "Recommended Post Count".  
If the current post **has no category set**, this feature will be **disabled**.  
If **the category has only one post**, this feature will be **disabled**.

When enabled, you can configure

- Recommended post count

:::

### Adjacent Article Navigation at Bottom of Post

::: info 🎯 Purpose

When enabled, navigation links to the previous and next posts will be displayed at the bottom of the post.

:::
::: info 📂 Configuration Item Location

Post Page Style -> Adjacent Post Navigation at Post Bottom

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

Controls whether to display the comment section on the post page.

:::
::: info 📂 Configuration Item Location

Post Page Style -> Post Comment Section

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

Controls whether to display the navigation bar at the bottom of the mobile post page.

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

Application Range: [`/categories`](/reference/template-map#:~:text=/categories).

### Category Page Description

::: info 🎯 Purpose

Used to customize the HTML `<meta name="description">` content for this page, convenient for setting SEO descriptions.

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

Controls whether to display the number of posts in each category in the category list.

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

- Character to the left of post count
  - Type: String
  - Default Value:`(`
- Character to the right of post count
  - Type: String
  - Default Value:`)`

:::

### Display Multi-layer Categories

::: info 🎯 Purpose

Controls whether to display subcategories on the category page.

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

Application Range: [`/categories/{slug}`](/reference/template-map#:~:text=/categories/%7Bslug%7D).

### Display Post Publish Date in Category Details Page Post List

::: info 🎯 Purpose

Display the post publish date in the post list on the category detail page.

:::
::: info 📂 Configuration Item Location

Category Detail Page Style -> Display Post Publish Date in Post List

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/category_page_styles#:~:text=Display%20post%20publish%20date%20in%20post%20list" />

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`theme.config?.category_page_styles?.is_show_post_pubdate_in_post_list`

:::

### Display Post Views in Category Details Page Post List

::: info 🎯 Purpose

Display post view count on the category detail page.

:::
::: info 📂 Configuration Item Location

Category Detail Page Style -> Display Post View Count in Post List

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

Display RSS subscription button on the category detail page.

:::
::: info 📂 Configuration Item Location

Category Detail Page Style -> Category RSS Subscription Button

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

Requires the [RSS Subscription Plugin](/guide/plugin-compatibility#rss-subscription-plugin) to be enabled.

:::

## Tags Page Style

Application Range: [`/tags`](/reference/template-map#:~:text=/tags).

### Tag Collection Page Description

::: info 🎯 Purpose

Used to customize the HTML `<meta name="description">` content for this page, convenient for setting SEO descriptions.

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

Controls whether to display the number of posts in each tag in the tag list.

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

- Character to the left of post count
  - Type: String
  - Default Value:`(`
- Character to the right of post count
  - Type: String
  - Default Value:`)`
    :::

### Tag Sort Order

::: info 🎯 Purpose

Set the sorting method for tags on the tag collection page.

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

Default (internal value `default`)

:::
::: info 💡 Other Options

- By post count descending (internal value `count_desc`)
- By post count ascending (internal value `count_asc`)
- By name ascending (internal value `name_asc`)
- By name descending (internal value `name_desc`)

:::
::: info 🧩 Template Variable

`theme.config?.tags_page_styles?.tags_sort_order`

:::

## Tag Detail Page Style

Application Range: [`/tags/{slug}`](/reference/template-map#:~:text=/tags/%7Bslug%7D).

### Display Post Views in Tag Details Page Post List

::: info 🎯 Purpose

Display post view count on the tag detail page.

:::
::: info 📂 Configuration Item Location

Tag Detail Page Style -> Display Post View Count in Post List

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

Display RSS subscription button on the tag detail page.

:::
::: info 📂 Configuration Item Location

Tag Detail Page Style -> Display Tag RSS Subscription Button

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

Requires the [RSS Subscription Plugin](/guide/plugin-compatibility#rss-subscription-plugin) to be enabled.

:::

## Author Detail Page Style

Application Range: [`/authors/{name}`](/reference/template-map#:~:text=/authors/%7Bname%7D).

### Author Details Page Description

::: info 🎯 Purpose

Used to customize the HTML `<meta name="description">` content for this page, convenient for setting SEO descriptions.

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

Display RSS subscription button on the author detail page.

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

Requires the [RSS Subscription Plugin](/guide/plugin-compatibility#rss-subscription-plugin) to be enabled.

:::

## Archives Page Style

Application Range: [`/archives(/{year}(/{month}))`](</reference/template-map#:~:text=/archives(/%7Byear%7D(/%7Bmonth%7D))>).

### Archives Page Description

::: info 🎯 Purpose

Used to customize the HTML `<meta name="description">` content for this page, convenient for setting SEO descriptions.

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

In the archive page, collapse and display the post list by year and month of post publication.

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

- Expand/collapse animation duration (Unit: milliseconds)
  - Type: Float/Integer
  - Default Value:`200`

:::

## Custom Page Style

Application Range: [`/{slug}`](/reference/template-map#:~:text=/%7Bslug%7D).

### Optimize Paragraph Spacing Display

::: info 🎯 Purpose

Add minimum height to custom page content paragraphs to display empty lines.

:::
::: info 📂 Configuration Item Location

Custom Page Style -> Optimize Paragraph Empty Line Display

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
::: details ℹ️ Additional Information

Different Markdown editors use different parsers, so this configuration item may have different effects on the final rendering result.
Related link: [babelmark3](https://babelmark.github.io/) is a website that compares the parsing results of different Markdown parsers.

:::

### Enable Paragraph First-line Indent

::: info 🎯 Purpose

Add indentation style to the first line of content paragraphs.

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

- First line indentation value
  - Type: String
  - Default Value: `2em` (2 character width)
  - External constraints: CSS length units. Such as: 20rem, 300px, 30vw.

:::

### Show Estimated Reading Time of Page

::: info 🎯 Purpose

Display estimated reading time based on post word count on the page.

:::
::: info 📂 Configuration Item Location

Custom Page Style -> Page Estimated Reading Time

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

After enabling the [API Extension](/guide/plugin-compatibility#api-extension) plugin, a more accurate measurement method will be automatically enabled.

:::

### Show Word Count of Page

::: info 🎯 Purpose

Display the total word count of the post on the page.

:::
::: info 📂 Configuration Item Location

Custom Page Style -> Page Word Count

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

After enabling the [API Extension](/guide/plugin-compatibility#api-extension) plugin, a more accurate measurement method will be automatically enabled.

:::

### Enable Dividing Line at End of Page Content

::: info 🎯 Purpose

Controls whether to display the separator at the end of the page content.

:::
::: info 📂 Configuration Item Location

Custom Page Style -> Page Content End Separator

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

Controls whether to display the comment section on the page.

:::
::: info 📂 Configuration Item Location

Custom Page Style -> Page Comment Section

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

Automatically redirect to a specified page on error pages (such as `404`).

:::
::: info 📂 Configuration Item Location

Error Page Style -> Page Auto Redirect

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/error_page_styles#:~:text=Page%20Auto%20Redirect" />

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

- Redirect target link
  - Type: String
  - Default Value:`/`
  - External constraints: Valid relative/absolute link
- Redirect wait time (Unit: seconds)
  - Type: Integer
  - Default Value:`5`

:::

## Social Profile/RSS

### Home Page Social Profile Display

::: info 🎯 Purpose

Display social media links and RSS subscription information on the homepage.

:::
::: info 📂 Configuration Item Location

Social Profile/RSS -> Homepage Social Profile Display

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/sns#:~:text=Home%20page%20social%20profile%20display" />

:::
::: info 🏷️ Type

Array (can repeatedly add multiple social profiles)

:::
::: info ⭐ Default Value

Empty array `[]`

:::
::: info 🧩 Template Variable

`theme.config?.sns?.index_sns`

:::
::: info ℹ️ Additional Information

- Supports multiple preset social platforms: RSS, BiliBili, Dribbble, Email, Facebook, GitHub, Instagram, QQ, Reddit, Stack Overflow, Telegram, X(Twitter), YouTube, Douban, NetEase Cloud Music, Weibo, Zhihu, etc.
- Supports custom social profiles
- Supports plain text display
- Can configure your own social platform through "Set Custom Profile"

:::

### Social Media Settings

::: info 🎯 Purpose

Define your own social profile to be used in the homepage social profile display.

:::
::: info 📂 Configuration Item Location

Social Profile/RSS -> Set Custom Profile

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

Provides preset values for mainstream platforms, only requires filling in the corresponding platform identifier to add.

In addition, you can also add custom profiles.

Each custom profile requires configuration:

- identifier: Any combination of letters, numbers, and underscores (e.g., `myBlog`)
- Link: Complete URL (e.g., `https://example.com`)
- Icon
- aria-label: Accessibility label (e.g., `Find me on my blog`)

:::

## Custom Share Buttons

### Share Button Settings

::: info 🎯 Purpose

Configure the share button list for post pages, supports multiple sharing methods.

:::
::: info 📂 Configuration Item Location

Custom Share Buttons -> Share Button Configuration

:::
::: info ⚡ Quick Jump

<QuickJumpConfig to="/console/theme/settings/share#:~:text=Custom%20Share%20Buttons" />

:::
::: info 🏷️ Type

Repeater

:::
::: info ⭐ Default Value

Includes multiple preset share buttons: E-mail, QRCode, Native, Facebook, X, LinkedIn, Pinterest, Telegram, QQ, Weibo, WeChat, Qzone, Douban

:::
::: info 🧩 Template Variable

`theme.config?.share?.button_config`

:::
::: info ℹ️ Additional Information

- `@URL` and `@TITLE` are placeholders that will be replaced with the actual page address and title when used
- Each share button has four configurable items: name, link, Icon (setting will override the default icon), `aria-label` (accessibility label)
- Can freely adjust order, delete or add share buttons

:::

## Links Page Style

Requires the [Links Management Plugin](/guide/plugin-compatibility#links-page) to be enabled.

### Avatar-First Style

::: info 🎯 Purpose

When enabled, the links page will use a grid layout that emphasizes avatars, displaying up to three links per row, suitable for scenarios that require highlighting link site avatars.

:::
::: info 📂 Configuration Item Location

Links Page Style -> Avatar-First Style

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

- **Default Style**: When disabled, uses traditional horizontal list layout with smaller avatars and information arranged to the right of the avatar
- **Avatar-First Style**: When enabled, uses grid card layout
  - Uses responsive three-column grid (automatically selects number of columns based on page width, maximum three columns)
  - Avatar centered display with larger size
  - Link information arranged vertically below the avatar
  - Card floats up with shadow effect on mouse hover
  - Avatar enlarges and changes border color on mouse hover

:::

### Link Description Maximum Lines

::: info 🎯 Purpose

Set the maximum number of lines for link descriptions.

:::
::: info 📂 Configuration Item Location

([Links Page Style -> Avatar-First Style](#avatar-first-style) When enabled, will display)

Links Page Style -> Link Description Line Limit

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

Requires the [Gallery Management Plugin](/guide/plugin-compatibility#gallery-page) to be enabled.

### Image Border Radius

::: info 🎯 Purpose

Set the border radius width of images in the gallery page.

:::
::: info 📂 Configuration Item Location

Gallery Page Style -> Image Border Radius Width

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

Set the fade-in animation duration for images in the gallery page.

:::
::: info 📂 Configuration Item Location

Gallery Page Style -> Image Fade-In Animation Duration

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

Use waterfall layout to display images in the gallery page.

:::
::: info 📂 Configuration Item Location

Gallery Page Style -> Enable Waterfall Layout

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

- Waterfall layout maximum columns
- Waterfall layout minimum columns
- Waterfall layout minimum image width
- Waterfall layout gap width
- Advanced configuration options
  - Custom image onmouseover attribute
  - Custom image onmouseout attribute

When disabled, you can configure

- Display group titles

:::

## Moments Page Style

Requires the [Moments Management Plugin](/guide/plugin-compatibility#moments-page) to be enabled.

### Show Estimated Reading Time of Moment

::: info 🎯 Purpose

Display estimated reading time based on word count at the beginning of the moment.

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

After enabling the [API Extension](/guide/plugin-compatibility#api-extension) plugin, a more accurate measurement method will be automatically enabled.

:::

### Show Word Count of Moment

::: info 🎯 Purpose

Display the total word count of the post at the beginning of the moment.

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

After enabling the [API Extension](/guide/plugin-compatibility#api-extension) plugin, a more accurate measurement method will be automatically enabled.

:::

### Moment Page Upvote Button

::: info 🎯 Purpose

Display the like button on the moments page.

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

Controls whether to display the comment section on the moments page.

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
