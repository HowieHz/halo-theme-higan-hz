---
outline: deep
---

::: info Info

This documentation is AI-generated. You can help improve it by submitting an [Issue](https://github.com/HowieHz/halo-theme-higan-hz/issues/new).

:::

<!-- markdownlint-disable MD033 -->

# Custom Color Scheme

::: tip

If the issue remains unresolved, visit [GitHub Issues](https://github.com/HowieHz/halo-theme-higan-hz/issues) to search or submit new feedback, or join QQ group `694413711` for community support.

Contributions to this tutorial are always welcome.

:::

<script setup>
import { ref, computed } from 'vue'

const themeInput = ref('') // DaisyUI theme definition text pasted by user

const themeModeMessage = computed(() => {
  const match = themeInput.value.match(/color-scheme\s*:\s*"(.*?)"/i)
  if (!match) return ''
  const scheme = match[1].toLowerCase()
  const mode =
    scheme.includes('dark')
      ? 'Dark Mode'
      : scheme.includes('light')
        ? 'Light Mode'
        : scheme
  return `This theme is ${mode}, please copy the following CSS variables:`
})

const customProperties = computed(() =>
  themeInput.value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith('--color-'))
)

const customCssText = computed(() => customProperties.value.join('\n'))
</script>

## Simple Customization Method

### Generate Color Scheme

First, open the [daisyUI Theme Generator](https://daisyui.com/theme-generator/).  
As shown below, you can select a preset color scheme in the yellow highlighted section on the left, then customize colors in the red highlighted section in the middle.  
After customization, click the `CSS` button at the top.

![tutorial-custom-theme-1.avif](/tutorial-custom-theme-1.avif)

A dialog will appear as shown below, click the `Copy to clipboard` button in the upper right to copy your color scheme to the clipboard.

![tutorial-custom-theme-2.avif](/tutorial-custom-theme-2.avif)

Paste your color scheme in the input box below:

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
  placeholder="Paste the daisyUI generated color scheme here" />

<div v-if="themeModeMessage">

::: info Parse Result

{{ themeModeMessage }}

<pre v-if="customCssText">

{{ customCssText }}

</pre>

:::

</div>

### Add Custom Color Scheme

Navigate to the ["General Styling -> Custom Color Scheme"](/guide/theme-configuration#自定义配色方案) configuration item. As shown below, click the add button:

![tutorial-custom-theme-3.avif](/tutorial-custom-theme-3.avif)

In the popup window, click `CSS Variable Mode` to enable it. Then click the submit button.

![tutorial-custom-theme-4.avif](/tutorial-custom-theme-4.avif)

Click the newly created color scheme:

![tutorial-custom-theme-5.avif](/tutorial-custom-theme-5.avif)

::: tip Note

If you open the color scheme and see something like the image below, try clicking the `Submit`/`Cancel` buttons at the bottom, refreshing the page, etc., until it returns to normal.

![tutorial-custom-theme-6.avif](/tutorial-custom-theme-6.avif)

This is a rendering bug in Halo CMS that cannot be fixed at the moment.

:::

First, select your theme color mode in the red highlighted section at the top. Then paste the CSS variables you just parsed in the red highlighted section below. Finally, click the `Submit` button at the bottom.

![tutorial-custom-theme-7.avif](/tutorial-custom-theme-7.avif)

### Apply Custom Color Scheme

As shown in the image, select `Custom Color` for the color scheme, then save.

![tutorial-custom-theme-8.avif](/tutorial-custom-theme-8.avif)

In the newly appeared `Custom Color Scheme Identifier` configuration item (if this item doesn't appear, try refreshing the page), fill in the identifier for your custom color scheme. Finally, click the `Save` button at the bottom.

![tutorial-custom-theme-9.avif](/tutorial-custom-theme-9.avif)

Congratulations! You have successfully customized your color scheme and can now enjoy the wonderful experience of a personalized theme! 🎉
