---
outline: deep
---

::: danger

此页面文档还未完成。

:::

# 主题配置项

你可在后台“主题设置”界面中直接修改这些配置项。

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
 * - to: string （必需） — 目标路径
 * - label?: string — 链接显示文本，默认回退到 to
 * - ariaLabel?: string — 无障碍文本，默认回退到 label
 */
const QuickJumpConfig = (props) => {
  const to = props.to
  const label = props.label ?? to
  const ariaLabel = props.ariaLabel ?? label
  const href = prefixHref(to)

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

  return h('a', attrs, label)
}
</script>

<template v-if="!canJump">

::: warning {#quick-jump-warning}

请先在下方填写你的站点链接，快速跳转链接才能启用。

:::

</template>

<p>
  基础站点链接：<input v-model="inputBaseUrl" placeholder="例：https://example.com" style="width:50%" />
</p>

## 目录

[[toc]]

## 示例

- 用途：说明配置项用途。
- 配置项位置：说明在主题配置项的位置。
- 快速跳转：点击即可快速跳转到对应主题配置项。
- 值类型：此配置项的值类型，以下举例几个常见类型：
  - 字符串：一串字符，如 `abc123`、`zh-CN`。
  - 整型：整数，如 `-1`、`0`、`100`。
  - 浮点数：带小数点的数，如 `1.2`、`0.3`、`4.5`。
- 默认值：此配置项的默认值。

::: tip

重置全部配置为默认值：<QuickJumpConfig to="/console/theme" /> 点击主题名这行最右边三个点，然后点击“重置”按钮即可。

:::

- 示例值：再举几个例子便于理解。
- 内部约束：如果填写的配置值不满足这个要求，将无法保存配置。
- 外部约束：如果填写的配置值不满足这个要求，主题可能无法正常工作。
- 模板变量：提供给模板开发者使用的变量，用于读取此配置值。可使用 `${模板变量}` 调用。
- 补充信息：补充说明一些信息。

## 全局

### 默认页面语言

- 用途：指定站点根标签 `<html>` 的 `lang` 属性默认值，用于辅助无障碍、SEO 以及浏览器/插件的语言感知（如：浏览器是否弹出页面翻译提醒）。
- 配置项位置：全局 -> 默认页面语言
- 快速跳转：<QuickJumpConfig to="/console/theme/settings/global#:~:text=默认页面语言" />
- 值类型：字符串
- 默认值：`zh`
- 示例值：`zh`、`zh-CN`、`zh-Hans`、`en`、`en-US`
- 内部约束：无。
- 外部约束：设定值需满足 [BCP 47](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Global_attributes/lang#:~:text=%E5%A6%82%E6%9E%9C%E6%A0%87%E7%AD%BE%E5%86%85%E5%AE%B9%E6%98%AF%E6%97%A0%E6%95%88%E7%9A%84%EF%BC%8C%E6%A0%B9%E6%8D%AE%20BCP47%EF%BC%8C%E5%AE%83%E5%B0%B1%E8%AE%BE%E4%B8%BA%E6%97%A0%E6%95%88%E3%80%82)，否则无效。
- 模板变量：`theme.config?.global?.default_page_language`
- 补充信息：
  - 安全性：设定的语言值的会自动转义，无需担心 XSS 注入攻击。
  - 内部相关行为：
    - 站点根标签 `<html>` 的 `lang` 属性设定顺序：
      1. 页面/文章元数据中明确指定的 `language` 元数据（最高优先级）
      2. URL 查询参数 ?lang=（若存在且通过验证）
      3. 主题设置中的默认页面语言（此项）
      4. 若上述都为空，则回退到 "zh"
