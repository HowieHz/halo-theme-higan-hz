---
outline: deep
---

<!-- This documentation is AI-generated. You can help improve it by submitting an [Issue](https://github.com/HowieHz/halo-theme-higan-hz/issues/new). -->

<!-- markdownlint-disable MD033 -->

# Metadata Configuration

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
 * QuickJumpConfigPage — Lightweight functional link component (returns <a> node)
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

::: tip {#quick-jump-warning}

After your site has installed the latest version of the theme, you can fill in your site link below.  
This will enable quick jump links in this documentation.

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

<!-- - Array: A list of multiple values, such as `[1, 2, 3]`
- Object: A collection of key-value pairs, such as `{name: "Zhang San", age: 20}`
- URL: Web link, such as `https://example.com`
- Color value: Such as `#FF5733`, `rgb(255, 87, 51)`
- CSS length value: Such as `1rem`, `1px`, `1em`, `50%`, `1vw` -->

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

Variables provided for template developers to read this configuration value. Can be used via `${template variable}`.

:::
::: info ℹ️ Additional Information

Supplementary information.

:::

## Post Metadata

How to find the settings for a post's metadata:

- Method 1: Go to post management page (<QuickJumpConfig to="/console/posts" />) -> Click the three dots on the right of a post -> Select "Settings" in the context menu that pops up -> Scroll to the bottom to see metadata settings
- Method 2: Go to post management page (<QuickJumpConfig to="/console/posts" />) -> Click the "Settings" button to the left of the "Publish" button in the upper right corner -> Scroll to the bottom to see metadata settings

### Post Page Title

::: info 🎯 Purpose

Sets the HTML title of the post on the browse page. If the configured value is empty, the HTML title will take the post title.

:::
::: info 📂 Configuration Item Location

Post Metadata -> Page Title

:::
::: info 🏷️ Type

String

:::
::: info ⭐ Default Value

Empty

:::
::: info 💡 Example Values

- `Halo Theme Guide`

:::
::: info ⚠️ External Constraints

If the configured value is too long, it may affect SEO and page display.

:::
::: info 🧩 Template Variable

`#annotations.get(post, 'higan.howiehz.top/page-title')`

Fallback to post title when empty:
`#annotations.getOrDefault(post, 'higan.howiehz.top/page-title', post.spec?.title)`

:::

### Post Page Language

::: info 🎯 Purpose

Sets the page language (HTML `lang` attribute) of the post on the browse page. If the configured value is empty, it will fall back according to [page language setting priority](/reference/faq#页面语言设定优先级).

:::
::: info 📂 Configuration Item Location

Post Metadata -> Page Language

:::
::: info 🏷️ Type

String

:::
::: info ⭐ Default Value

Empty

:::
::: info 💡 Example Values

`zh`, `zh-CN`, `zh-Hans`, `en`, `en-US`

:::
::: info ⚠️ External Constraints

The set value must comply with [BCP 47](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Global_attributes/lang#:~:text=%E5%A6%82%E6%9E%9C%E6%A0%87%E7%AD%BE%E5%86%85%E5%AE%B9%E6%98%AF%E6%97%A0%E6%95%88%E7%9A%84%EF%BC%8C%E6%A0%B9%E6%8D%AE%20BCP47%EF%BC%8C%E5%AE%83%E5%B0%B1%E8%AE%BE%E4%B8%BA%E6%97%A0%E6%95%88%E3%80%82), otherwise it is invalid.

:::
::: info 🧩 Template Variable

`#annotations.get(post, 'higan.howiehz.top/page-language')`

:::

### Show in Post List

::: info 🎯 Purpose

Sets whether the post is displayed in the post list (including [Home](/guide/theme-configuration#首页样式), [Tag Detail Page](/guide/theme-configuration#标签详情页样式), [Category Detail Page](/guide/theme-configuration#分类详情页样式), [Author Detail Page](/guide/theme-configuration#作者详情页样式), [Archive Page](/guide/theme-configuration#归档页样式)).

:::
::: info 📂 Configuration Item Location

Post Metadata -> Show in Post List

:::
::: info 🏷️ Type

Boolean

:::
::: info ⭐ Default Value

`true`

:::
::: info 🧩 Template Variable

`#annotations.getOrDefault(post, 'higan.howiehz.top/show-in-post-list', 'true')`

:::

## Category Metadata

How to find the settings for a category's metadata:

- Go to post category management page (<QuickJumpConfig to="/console/posts/categories" />) -> Click the three dots on the right of a category -> Select "Edit" in the context menu that pops up -> Scroll to the bottom to see metadata settings

### Category Page Title

::: info 🎯 Purpose

Sets the HTML title of the category detail page. If the configured value is empty, the HTML title will take the category name.

:::
::: info 📂 Configuration Item Location

Category Metadata -> Page Title

:::
::: info 🏷️ Type

String

:::
::: info ⭐ Default Value

Empty

:::
::: info 💡 Example Values

- `Halo Theme Guide`

:::
::: info ⚠️ External Constraints

If the configured value is too long, it may affect SEO and page display.

:::
::: info 🧩 Template Variable

`#annotations.get(category, 'higan.howiehz.top/page-title)`

Fallback to category name when empty:
`#annotations.getOrDefault(category, 'higan.howiehz.top/page-title', category.spec?.displayName)`

:::

### Category Page Language

::: info 🎯 Purpose

Sets the page language (HTML `lang` attribute) of the category detail page. If the configured value is empty, it will fall back according to [page language setting priority](/reference/faq#页面语言设定优先级).

:::
::: info 📂 Configuration Item Location

Category Metadata -> Page Language

:::
::: info 🏷️ Type

String

:::
::: info ⭐ Default Value

Empty

:::
::: info 💡 Example Values

`zh`, `zh-CN`, `zh-Hans`, `en`, `en-US`

:::
::: info ⚠️ External Constraints

The set value must comply with [BCP 47](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Global_attributes/lang#:~:text=%E5%A6%82%E6%9E%9C%E6%A0%87%E7%AD%BE%E5%86%85%E5%AE%B9%E6%98%AF%E6%97%A0%E6%95%88%E7%9A%84%EF%BC%8C%E6%A0%B9%E6%8D%AE%20BCP47%EF%BC%8C%E5%AE%83%E5%B0%B1%E8%AE%BE%E4%B8%BA%E6%97%A0%E6%95%88%E3%80%82), otherwise it is invalid.

:::
::: info 🧩 Template Variable

`#annotations.get(category, 'higan.howiehz.top/page-language')`

:::

## Tag Metadata

How to find the settings for a tag's metadata:

- Go to post tag management page (<QuickJumpConfig to="/console/posts/tags" />) -> Click the three dots on the right of a tag -> Select "Edit" in the context menu that pops up -> Scroll to the bottom to see metadata settings

### Tag Page Title

::: info 🎯 Purpose

Sets the HTML title of the tag detail page. If the configured value is empty, the HTML title will take the tag name.

:::
::: info 📂 Configuration Item Location

Tag Metadata -> Page Title

:::
::: info 🏷️ Type

String

:::
::: info ⭐ Default Value

Empty

:::
::: info 💡 Example Values

- `Halo Theme Guide`

:::
::: info ⚠️ External Constraints

If the configured value is too long, it may affect SEO and page display.

:::
::: info 🧩 Template Variable

`#annotations.get(tag, 'higan.howiehz.top/page-title')`

Fallback to site title when empty:
`#annotations.getOrDefault(tag, 'higan.howiehz.top/page-title', tag.spec?.displayName)`

:::

### Tag Page Language

::: info 🎯 Purpose

Sets the page language (HTML `lang` attribute) of the tag detail page. If the configured value is empty, it will fall back according to [page language setting priority](/reference/faq#页面语言设定优先级).

:::
::: info 📂 Configuration Item Location

Tag Metadata -> Page Language

:::
::: info 🏷️ Type

String

:::
::: info ⭐ Default Value

Empty

:::
::: info 💡 Example Values

`zh`, `zh-CN`, `zh-Hans`, `en`, `en-US`

:::
::: info ⚠️ External Constraints

The set value must comply with [BCP 47](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Global_attributes/lang#:~:text=%E5%A6%82%E6%9E%9C%E6%A0%87%E7%AD%BE%E5%86%85%E5%AE%B9%E6%98%AF%E6%97%A0%E6%95%88%E7%9A%84%EF%BC%8C%E6%A0%B9%E6%8D%AE%20BCP47%EF%BC%8C%E5%AE%83%E5%B0%B1%E8%AE%BE%E4%B8%BA%E6%97%A0%E6%95%88%E3%80%82), otherwise it is invalid.

:::
::: info 🧩 Template Variable

`#annotations.get(tag, 'higan.howiehz.top/page-language')`

:::

## Page Metadata

How to find the settings for a page's metadata:

- Method 1: Go to page management page (<QuickJumpConfig to="/console/single-pages" />) -> Click the three dots on the right of a page -> Select "Settings" in the context menu that pops up -> Scroll to the bottom to see metadata settings
- Method 2: Go to page management page (<QuickJumpConfig to="/console/single-pages" />) -> Enter a page's edit page -> Click the "Settings" button to the left of the "Publish" button in the upper right corner -> Scroll to the bottom to see metadata settings

### Custom Template

#### Post Page Style

::: info 🎯 Purpose

Make custom pages use a layout and style similar to post pages.

:::
::: info 📂 Configuration Item Location

Custom Page Style -> Custom Template

:::
::: info ℹ️ Additional Information

When enabled, custom pages will use a layout and style similar to post pages.
Mainly reflected in:

1. Desktop top menu (sidebar table of contents, back to top button, share menu)
2. Mobile bottom menu (collapsible table of contents, back to top button, share menu)
3. And, menu and table of contents related settings remain consistent with corresponding settings under [Post Page Style](/guide/theme-configuration#文章页样式).

:::

### Page Title

::: info 🎯 Purpose

Sets the HTML title of the page. If the configured value is empty, the HTML title will take the page title.

:::
::: info 📂 Configuration Item Location

Page Metadata -> Page Title

:::
::: info 🏷️ Type

String

:::
::: info ⭐ Default Value

Empty

:::
::: info 💡 Example Values

- `Halo Theme Guide`

:::
::: info ⚠️ External Constraints

If the configured value is too long, it may affect SEO and page display.

:::
::: info 🧩 Template Variable

`#annotations.get(singlePage, 'higan.howiehz.top/page-title')`

Fallback to site title when empty:
`#annotations.getOrDefault(singlePage, 'higan.howiehz.top/page-title', singlePage.spec?.title)`

:::

### Page Language

::: info 🎯 Purpose

Sets the page language (HTML `lang` attribute). If the configured value is empty, it will fall back according to [page language setting priority](/reference/faq#页面语言设定优先级).

:::
::: info 📂 Configuration Item Location

Page Metadata -> Page Language

:::
::: info 🏷️ Type

String

:::
::: info ⭐ Default Value

Empty

:::
::: info 💡 Example Values

`zh`, `zh-CN`, `zh-Hans`, `en`, `en-US`

:::
::: info ⚠️ External Constraints

The set value must comply with [BCP 47](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Global_attributes/lang#:~:text=%E5%A6%82%E6%9E%9C%E6%A0%87%E7%AD%BE%E5%86%85%E5%AE%B9%E6%98%AF%E6%97%A0%E6%95%88%E7%9A%84%EF%BC%8C%E6%A0%B9%E6%8D%AE%20BCP47%EF%BC%8C%E5%AE%83%E5%B0%B1%E8%AE%BE%E4%B8%BA%E6%97%A0%E6%95%88%E3%80%82), otherwise it is invalid.

:::
::: info 🧩 Template Variable

`#annotations.get(post, 'higan.howiehz.top/page-language')`

:::
