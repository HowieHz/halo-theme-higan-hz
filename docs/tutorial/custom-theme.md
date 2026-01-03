---
outline: deep
---

<!-- markdownlint-disable MD033 -->

# 自定义配色方案

::: tip

如问题仍未解决，可前往 [GitHub Issues](https://github.com/HowieHz/halo-theme-higan-hz/issues) 搜索或提交新的反馈，或加入 QQ 群 `694413711` 获取社区支持。

随时欢迎您为本教程添砖加瓦。

:::

<script setup>
import { ref, computed } from 'vue'

const themeInput = ref('') // 用户粘贴的 DaisyUI 主题定义文本

const themeModeMessage = computed(() => {
  const match = themeInput.value.match(/color-scheme\s*:\s*"(.*?)"/i)
  if (!match) return ''
  const scheme = match[1].toLowerCase()
  const mode =
    scheme.includes('dark')
      ? '深色模式'
      : scheme.includes('light')
        ? '浅色模式'
        : scheme
  return `这个主题是${mode}，请复制以下 CSS 变量：`
})

const customProperties = computed(() =>
  themeInput.value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith('--color-'))
)

const customCssText = computed(() => customProperties.value.join('\n'))
</script>

## 简易自定义方法

### 生成配色方案

首先打开 [daisyUI 主题生成器](https://daisyui.com/theme-generator/)。  
如下图，您可以在左侧的黄色框选部分选择预设配色方案，然后在中间红色框选部分自定义颜色。  
完成自定义后，点击上方的 `CSS` 按钮。

![tutorial-custom-theme-1.avif](/tutorial-custom-theme-1.avif)

弹出下图的框，点击右上角 `Copy to clipboard` 按钮，复制您的配色方案到剪贴板。

![tutorial-custom-theme-2.avif](/tutorial-custom-theme-2.avif)

在下方输入框粘贴您的配色方案：

<style>
textarea {
    width: 100%;
    min-height: 2rem;
    border-radius: 8px;
    padding: 16px 16px 8px;
    font-family: inherit;
    border: 1px solid var(--vp-c-divider);
    &:hover,
    &:focus {
        border-color: var(--vp-c-brand-1);
    }
}
</style>

<textarea
  v-model="themeInput"
  placeholder="请在此处粘贴 daisyUI 生成的配色方案" />

<div v-if="themeModeMessage">

::: info 解析结果

{{ themeModeMessage }}

<pre v-if="customCssText">

{{ customCssText }}

</pre>

:::

</div>

### 添加自定义配色方案

找到[“总体样式 -> 自定义配色方案”](/guide/theme-configuration#自定义配色方案)配置项。按下图所示，点击添加按钮：

![tutorial-custom-theme-3.avif](/tutorial-custom-theme-3.avif)

在弹出的窗口中点击 `CSS 变量模式`，使其为启用状态。然后点击提交按钮。

![tutorial-custom-theme-4.avif](/tutorial-custom-theme-4.avif)

点击刚才新建的配色方案：

![tutorial-custom-theme-5.avif](/tutorial-custom-theme-5.avif)

::: tip 提示

如果打开刚才的配色方案，如下图所示。出现这个情况请尝试点击下方的 `提交`/`取消` 按钮、刷新页面等操作，直到恢复正常。

![tutorial-custom-theme-6.avif](/tutorial-custom-theme-6.avif)

这是 Halo CMS 的渲染 BUG。暂时无法修复。

:::

先在上方红色框选部分选择您的主题色彩模式。然后在下方红色框选部分粘贴刚才解析得到的 CSS 变量。最后点击底部的`提交`按钮。

![tutorial-custom-theme-7.avif](/tutorial-custom-theme-7.avif)

### 应用自定义配色方案

按图所示，配色方案选择`自定义配色`，随后保存。

![tutorial-custom-theme-8.avif](/tutorial-custom-theme-8.avif)

在新出现的 `自定义配色方案识别码` 配置项（如果没出现这个配置项，请尝试刷新页面），填写自定义配色方案的识别码。最后点击页脚的`保存`按钮。

![tutorial-custom-theme-9.avif](/tutorial-custom-theme-9.avif)

恭喜！您已成功自定义配色方案，现在可以尽情享受个性化主题带来的美妙体验！🎉
