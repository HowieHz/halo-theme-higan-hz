---
outline: deep
---

<!-- markdownlint-disable MD033 -->

# 元数据配置项

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

::: tip {#quick-jump-warning}

当你的站点已经安装了最新版本的主题后，可在下方填写你的站点链接。  
即可在本文档启用快速跳转链接。

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

- 字符串：一串字符，如 `abc123`、`zh-Hans`。
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

## 文章元数据

如何找到一篇文章元数据的设置位：

- 方法一：进入文章管理页（<QuickJumpConfig to="/console/posts" />）-> 点击一篇文章右边的三个点 -> 弹出的上下文菜单中选择“设置” -> 拉到底部即可见元数据设置位
- 方法二：进入文章管理页（<QuickJumpConfig to="/console/posts" />）-> 点击右上角“发布”按钮左侧的“设置”按钮 -> 拉到底部即可见元数据设置位

### 文章页面标题

::: info 🎯 用途

设定文章在浏览页的 HTML 标题。如果配置值为空，则 HTML 标题取文章标题。

:::
::: info 📂 配置项位置

文章元数据 -> 页面标题

:::
::: info 🏷️ 类型

字符串

:::
::: info ⭐ 默认值

空

:::
::: info 💡 示例值

- `Halo 主题指南`

:::
::: info ⚠️ 外部约束

如果配置值过长，可能影响 SEO 和页面显示效果。

:::
::: info 🧩 模板变量

`#annotations.get(post, 'higan.howiehz.top/page-title')`

为空时回退为文章标题的写法：
`#annotations.getOrDefault(post, 'higan.howiehz.top/page-title', post.spec?.title)`

:::

### 文章页面语言

::: info 🎯 用途

设定文章在浏览页的页面语言（HTML `lang` 属性）。如果配置值为空，将按[页面语言设定优先级](/reference/faq#页面语言设定优先级)进行回退。

:::
::: info 📂 配置项位置

文章元数据 -> 页面语言

:::
::: info 🏷️ 类型

字符串

:::
::: info ⭐ 默认值

空

:::
::: info 💡 示例值

`zh`、`zh-Hans`、`zh-Hant`、`en`、`en-US`

:::
::: info ⚠️ 外部约束

设定值需满足 [BCP 47](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Global_attributes/lang#:~:text=%E5%A6%82%E6%9E%9C%E6%A0%87%E7%AD%BE%E5%86%85%E5%AE%B9%E6%98%AF%E6%97%A0%E6%95%88%E7%9A%84%EF%BC%8C%E6%A0%B9%E6%8D%AE%20BCP47%EF%BC%8C%E5%AE%83%E5%B0%B1%E8%AE%BE%E4%B8%BA%E6%97%A0%E6%95%88%E3%80%82)，否则无效。

:::
::: info 🧩 模板变量

`#annotations.get(post, 'higan.howiehz.top/page-language')`

:::

### 是否显示在文章列表中

::: info 🎯 用途

设定文章是否显示在文章列表中（包括[首页](/guide/theme-configuration#首页样式)、[标签详情页](/guide/theme-configuration#标签详情页样式)，[分类详情页](/guide/theme-configuration#分类详情页样式)，[作者详情页](/guide/theme-configuration#作者详情页样式)，[归档页](/guide/theme-configuration#归档页样式)）。

:::
::: info 📂 配置项位置

文章元数据 -> 显示在文章列表中

:::
::: info 🏷️ 类型

布尔值

:::
::: info ⭐ 默认值

`true`

:::
::: info 🧩 模板变量

`#annotations.getOrDefault(post, 'higan.howiehz.top/show-in-post-list', 'true')`

:::

## 分类元数据

如何找到一个分类元数据的设置位：

- 进入文章分类管理页（<QuickJumpConfig to="/console/posts/categories" />）-> 点击一个分类右边的三个点 -> 弹出的上下文菜单中选择“编辑” -> 拉到底部即可见元数据设置位

### 分类页面标题

::: info 🎯 用途

设定分类详情页的 HTML 标题。如果配置值为空，则 HTML 标题取分类名。

:::
::: info 📂 配置项位置

分类元数据 -> 页面标题

:::
::: info 🏷️ 类型

字符串

:::
::: info ⭐ 默认值

空

:::
::: info 💡 示例值

- `Halo 主题指南`

:::
::: info ⚠️ 外部约束

如果配置值过长，可能影响 SEO 和页面显示效果。

:::
::: info 🧩 模板变量

`#annotations.get(category, 'higan.howiehz.top/page-title)`

为空时回退为分类名的写法：
`#annotations.getOrDefault(category, 'higan.howiehz.top/page-title', category.spec?.displayName)`

:::

### 分类页面语言

::: info 🎯 用途

设定分类详情页的页面语言（HTML `lang` 属性）。如果配置值为空，将按[页面语言设定优先级](/reference/faq#页面语言设定优先级)进行回退。

:::
::: info 📂 配置项位置

分类元数据 -> 页面语言

:::
::: info 🏷️ 类型

字符串

:::
::: info ⭐ 默认值

空

:::
::: info 💡 示例值

`zh`、`zh-Hans`、`zh-Hant`、`en`、`en-US`

:::
::: info ⚠️ 外部约束

设定值需满足 [BCP 47](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Global_attributes/lang#:~:text=%E5%A6%82%E6%9E%9C%E6%A0%87%E7%AD%BE%E5%86%85%E5%AE%B9%E6%98%AF%E6%97%A0%E6%95%88%E7%9A%84%EF%BC%8C%E6%A0%B9%E6%8D%AE%20BCP47%EF%BC%8C%E5%AE%83%E5%B0%B1%E8%AE%BE%E4%B8%BA%E6%97%A0%E6%95%88%E3%80%82)，否则无效。

:::
::: info 🧩 模板变量

`#annotations.get(category, 'higan.howiehz.top/page-language')`

:::

## 标签元数据

如何找到一个标签元数据的设置位：

- 进入文章标签管理页（<QuickJumpConfig to="/console/posts/tags" />）-> 点击一个标签右边的三个点 -> 弹出的上下文菜单中选择“编辑” -> 拉到底部即可见元数据设置位

### 标签页面标题

::: info 🎯 用途

设定标签详情页的 HTML 标题。如果配置值为空，则 HTML 标题取标签名。

:::
::: info 📂 配置项位置

标签元数据 -> 页面标题

:::
::: info 🏷️ 类型

字符串

:::
::: info ⭐ 默认值

空

:::
::: info 💡 示例值

- `Halo 主题指南`

:::
::: info ⚠️ 外部约束

如果配置值过长，可能影响 SEO 和页面显示效果。

:::
::: info 🧩 模板变量

`#annotations.get(tag, 'higan.howiehz.top/page-title')`

为空时回退为站点标题的写法：
`#annotations.getOrDefault(tag, 'higan.howiehz.top/page-title', tag.spec?.displayName)`

:::

### 标签页面语言

::: info 🎯 用途

设定标签详情页的页面语言（HTML `lang` 属性）。如果配置值为空，将按[页面语言设定优先级](/reference/faq#页面语言设定优先级)进行回退。

:::
::: info 📂 配置项位置

标签元数据 -> 页面语言

:::
::: info 🏷️ 类型

字符串

:::
::: info ⭐ 默认值

空

:::
::: info 💡 示例值

`zh`、`zh-Hans`、`zh-Hant`、`en`、`en-US`

:::
::: info ⚠️ 外部约束

设定值需满足 [BCP 47](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Global_attributes/lang#:~:text=%E5%A6%82%E6%9E%9C%E6%A0%87%E7%AD%BE%E5%86%85%E5%AE%B9%E6%98%AF%E6%97%A0%E6%95%88%E7%9A%84%EF%BC%8C%E6%A0%B9%E6%8D%AE%20BCP47%EF%BC%8C%E5%AE%83%E5%B0%B1%E8%AE%BE%E4%B8%BA%E6%97%A0%E6%95%88%E3%80%82)，否则无效。

:::
::: info 🧩 模板变量

`#annotations.get(tag, 'higan.howiehz.top/page-language')`

:::

## 页面元数据

如何找到一个页面元数据的设置位：

- 方法一：进入页面管理页（<QuickJumpConfig to="/console/single-pages" />）-> 点击一个页面右边的三个点 -> 弹出的上下文菜单中选择“设置” -> 拉到底部即可见元数据设置位
- 方法二：进入页面管理页（<QuickJumpConfig to="/console/single-pages" />）-> 进入一个页面的编辑页 -> 点击右上角“发布”按钮左侧的“设置”按钮 -> 拉到底部即可见元数据设置位

### 自定义模板

#### 文章页样式

::: info 🎯 用途

让自定义页面使用类似文章页的布局和样式。

:::
::: info 📂 配置项位置

自定义页面样式 -> 自定义模板

:::
::: info ℹ️ 补充信息

启用后，自定义页面将使用类似文章页的布局和样式。
主要体现在：

1. 桌面端顶部菜单（侧边目录，回到顶端按钮，分享菜单）
2. 移动端底部菜单（折叠目录，回到顶端按钮，分享菜单）
3. 以及，菜单、目录相关设置与[文章页样式](/guide/theme-configuration#文章页样式)下对应设置保持一致。

:::

### 页面标题

::: info 🎯 用途

设定页面的 HTML 标题。如果配置值为空，则 HTML 标题取页面标题。

:::
::: info 📂 配置项位置

页面元数据 -> 页面标题

:::
::: info 🏷️ 类型

字符串

:::
::: info ⭐ 默认值

空

:::
::: info 💡 示例值

- `Halo 主题指南`

:::
::: info ⚠️ 外部约束

如果配置值过长，可能影响 SEO 和页面显示效果。

:::
::: info 🧩 模板变量

`#annotations.get(singlePage, 'higan.howiehz.top/page-title')`

为空时回退为站点标题的写法：
`#annotations.getOrDefault(singlePage, 'higan.howiehz.top/page-title', singlePage.spec?.title)`

:::

### 页面语言

::: info 🎯 用途

设定页面语言（HTML `lang` 属性）。如果配置值为空，将按[页面语言设定优先级](/reference/faq#页面语言设定优先级)进行回退。

:::
::: info 📂 配置项位置

页面元数据 -> 页面语言

:::
::: info 🏷️ 类型

字符串

:::
::: info ⭐ 默认值

空

:::
::: info 💡 示例值

`zh`、`zh-Hans`、`zh-Hant`、`en`、`en-US`

:::
::: info ⚠️ 外部约束

设定值需满足 [BCP 47](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Global_attributes/lang#:~:text=%E5%A6%82%E6%9E%9C%E6%A0%87%E7%AD%BE%E5%86%85%E5%AE%B9%E6%98%AF%E6%97%A0%E6%95%88%E7%9A%84%EF%BC%8C%E6%A0%B9%E6%8D%AE%20BCP47%EF%BC%8C%E5%AE%83%E5%B0%B1%E8%AE%BE%E4%B8%BA%E6%97%A0%E6%95%88%E3%80%82)，否则无效。

:::
::: info 🧩 模板变量

`#annotations.get(post, 'higan.howiehz.top/page-language')`

:::
