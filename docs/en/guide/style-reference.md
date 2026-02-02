---
outline: deep
---

<!-- markdownlint-disable MD013 MD024 MD025 MD033 -->

# Style Reference

::: info Info

This documentation is AI-generated. You can help improve it by submitting an [Issue](https://github.com/HowieHz/halo-theme-higan-hz/issues/new).

:::

<script setup>
import DefaultRender from '../../.vitepress/components/DefaultRender.vue';
</script>

This documentation demonstrates the theme's basic styles, extended styles, and their syntax.

::: tip

The displayed styles are theme defaults; some styles can be adjusted according to actual needs.

:::

## Style Application Scope

::: details

Related Documentation: [模板文件 and 访问路径映射](/en/reference/template-map)

- <Badge type="tip" text="General Style" /> Applicable template file scope: Every page。
- <Badge type="tip" text="Content Style" /> Applicable template file scope: `archives.html`, `category.html`, `links.html`, `moments.html`, `moment.html`, `page.html`, `photos.html`, `post.html`, `tag.html`. `5xx.html`, `404.html`。CSS selector is `.content`。
- <Badge type="tip" text="Post Style" /> Applicable template file scope: `author.html`, `links.html`, `moment.html`, `moments.html`, `page.html`, `photos.html`, `post.html`, `qrcode.html`, `5xx.html`, `404.html`。CSS selector is `article .content`。

:::

## How to Use HTML Syntax in the Editor

::: details

- Usage in the default editor:
  1. Need to enable [Markdown / HTML 内容块插件](https://github.com/halo-sigs/plugin-hybrid-edit-block)([应用市场页面](https://www.halo.run/store/apps/app-NgHnY))。
  2. Type in the default editor `/html` and select to insert an HTML code block.
- Usage in Vditor editor:
  1. Need to enable [Vditor 编辑器插件](https://github.com/justice2001/halo-plugin-vditor)([应用市场页面](https://www.halo.run/store/apps/app-uBcYw))，and enter the post edit page, set the post editor to Vditor editor.
  2. Vditor editor natively supports HTML tags, just write directly.

:::

## Quick Reference for Extended Styles <Badge type="warning" text="Extended Style" />

This section lists the extended styles implemented by this theme.

- [缩写](#abbreviation)
- [响应式视频嵌入](#responsive-video-embed)
- [引用块脚注](#blockquote-footnote)
- [拉引用块](#pullquote)
- [水平分割线（特殊样式）](#horizontal-divider-special-style)
- [隐藏/剧透](#hidden-spoiler-content)
- [明暗模式显隐块](#light-dark-mode-visibility-block)

## Italic/Emphasis <Badge type="tip" text="General Style" />

### Italic/Emphasis Markdown Syntax

<!-- prettier-ignore-start -->
```markdown
*This is emphasized text*
_This is emphasized text_
```
<!-- prettier-ignore-end -->

### Italic/Emphasis HTML Tag Syntax

```html
<em>This is emphasized text</em>
```

### Italic/Emphasis Rendering Effect

<DefaultRender>
<em>This is emphasized text</em>
</DefaultRender>

## Bold <Badge type="tip" text="General Style" />

### Bold Markdown Syntax

<!-- prettier-ignore-start -->
```markdown
**This is bold text**
__This is bold text__
```
<!-- prettier-ignore-end -->

### Bold HTML Tag Syntax

```html
<strong>This is bold text</strong>
```

### Bold Rendering Effect

<DefaultRender>
<strong>This is bold text</strong>
</DefaultRender>

## Inline Code <Badge type="tip" text="General Style" />

### Inline Code Markdown Syntax

```markdown
`print("世界，你好！")`
```

### Inline Code HTML Tag Syntax

```html
<code>print("世界，你好！")</code>
```

### Inline Code Rendering Effect

<DefaultRender>

`print("世界，你好！")`

</DefaultRender>

## Multi-line Code Block <Badge type="tip" text="General Style" />

### Multi-line Code Block Markdown Syntax

<!-- prettier-ignore-start -->
`````markdown
```python
print("世界，你好！")
```

~~~python
print("世界，你好！")
~~~

````markdown
_嵌套 code 块示例_

```python
print("嵌套 code 块")
```
````
`````
<!-- prettier-ignore-end -->

### Multi-line Code Block Rendering Effect

渲染效果随实际渲染器（如 `shiki`，`highlight.js`）变化，故不做渲染展示。

## Paragraph <Badge type="tip" text="General Style" />

### Paragraph Markdown Syntax

```markdown
This is a regular paragraph, testing text alignment and line height.This paragraph contains some common formatting like**bold**、*italic*和 `code`。According to your CSS, this text should have appropriate line height and alignment.

This is another paragraph, this is a\
line break.

and this is not a
line break.

在这一行末尾空两格  
也可以产生一个 line break.

Empty lines are not displayed by default. If you enable `文章页样式 - 文章页样式 - 优化文章段落空行显示`, empty lines will be displayed.
```

### Paragraph HTML Tag Syntax

<!-- prettier-ignore-start -->
```html
<p>This is a regular paragraph, testing text alignment and line height.This paragraph contains some common formatting like<strong>bold</strong>、<em>italic</em>和 <code>code</code>。According to your CSS, this text should have appropriate line height and alignment.</p>
```
<!-- prettier-ignore-end -->

### Paragraph Rendering Effect

<DefaultRender height="325px">

This is a regular paragraph, testing text alignment and line height.This paragraph contains some common formatting like**bold**、*italic*和 `code`。According to your CSS, this text should have appropriate line height and alignment.

This is another paragraph, this is a\
line break.

and this is not a
line break.

Also, two spaces at the end of this line  
也可以产生一个 line break.

Empty lines are not displayed by default. If you enable `文章页样式 - 文章页样式 - 优化文章段落空行显示`, empty lines will be displayed.

</DefaultRender>

## Citation Source <Badge type="tip" text="General Style" />

### Citation Source HTML Tag Syntax

```html
From<cite>"Documentation Writing Guide"</cite>

From <cite>Documentation Writing Guide</cite>
```

### Citation Source Rendering Effect

<DefaultRender>

From<cite>"Documentation Writing Guide"</cite>

From <cite>Documentation Writing Guide</cite>

</DefaultRender>

## Superscript and Subscript <Badge type="tip" text="General Style" />

### Superscript and Subscript HTML Tag Syntax

<!-- prettier-ignore-start -->
```html
Normal text<sup>superscript<sup>上 superscript<sup>上上 superscript<sup>上上上 superscript</sup></sup></sup></sup>
Normal text<sub>subscript<sub>下 subscript<sub>下下 subscript<sub>下下下 subscript</sub></sub></sub></sub>

Normal text<sup>superscript</sup>and<sub>subscript</sub>
```
<!-- prettier-ignore-end -->

### Superscript and Subscript Rendering Effect

<DefaultRender height="100px">

Normal text<sup>superscript<sup>上 superscript<sup>上上 superscript<sup>上上上 superscript</sup></sup></sup></sup>
Normal text<sub>subscript<sub>下 subscript<sub>下下 subscript<sub>下下下 subscript</sub></sub></sub></sub>

Normal text<sup>superscript</sup>and<sub>subscript</sub>

</DefaultRender>

## Small Text <Badge type="tip" text="General Style" />

### Small Text HTML Tag Syntax

<!-- prettier-ignore-start -->
```html
这是 Normal text <small>This is small text</small> 这是 Normal text

This is normal text <small>This is small text</small> This is normal text
```
<!-- prettier-ignore-end -->

### Small Text Rendering Effect

<DefaultRender>

这是 Normal text <small>This is small text</small> 这是 Normal text

This is normal text <small>This is small text</small> This is normal text

</DefaultRender>

## Abbreviation <Badge type="tip" text="General Style" /> <Badge type="warning" text="Extended Style" /> {#abbreviation}

### Abbreviation HTML Tag Syntax

<!-- prettier-ignore-start -->
```html
This text contains an abbreviation, hover over it on devices that support hovering to see the tooltip:<abbr title="Hypertext Markup Language">HTML</abbr>

When <strong>device does not support hovering</strong> or in <strong>print mode</strong>, the full term will be displayed as `(全称)` after the abbreviation.
For example, on touch devices, the above "HTML" will automatically display as "HTML(Hypertext Markup Language)".

<abbr title="Hypertext Markup Language"><a href="https://example.com">HTML - This line will apply both a tag styles in posts, so there are two layers of underline</a></abbr>

<abbr title="我是提示">This tag has a title attribute, so hovering over it will show a tooltip.</abbr>

<abbr>Actually <abbr>title</abbr> is optional</abbr>

<abbr>One layer <abbr>Two layers <abbr>Three layers <abbr>Four layers abbr tag nesting test </abbr></abbr></abbr></abbr>
```
<!-- prettier-ignore-end -->

### Abbreviation Rendering Effect

<DefaultRender height="300px">

This text contains an abbreviation, hover over it on devices that support hovering to see the tooltip:<abbr title="Hypertext Markup Language">HTML</abbr>

When <strong>device does not support hovering</strong> or in <strong>print mode</strong>, the full term will be displayed as`(全称)`after the abbreviation.
For example, on touch devices, the above "HTML" will automatically display as "HTML(Hypertext Markup Language)"。

<abbr title="Hypertext Markup Language"><a href="https://example.com">HTML - This line will apply both a tag styles in posts, so there are two layers of underline</a></abbr>

<abbr title="我是提示">This tag has a title attribute, so hovering over it will show a tooltip.</abbr>

<abbr>Actually <abbr>title</abbr> is optional</abbr>

<abbr>One layer <abbr>Two layers <abbr>Three layers <abbr>Four layers abbr tag nesting test </abbr></abbr></abbr></abbr>

</DefaultRender>

## Heading <Badge type="tip" text="General Style" />

### Heading Markdown Syntax

<!-- prettier-ignore-start -->
```markdown
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题
```
<!-- prettier-ignore-end -->

### Heading HTML Tag Syntax

```html
<h1>一级标题</h1>
<h2>二级标题</h2>
<h3>三级标题</h3>
<h4>四级标题</h4>
<h5>五级标题</h5>
<h6>六级标题</h6>
```

### Heading HTML Class Syntax

```html
<div class="h1">使用 h1 类的文本</div>
<div class="h2">使用 h2 类的文本</div>
```

### Heading Rendering Effect

<DefaultRender height="300px">

<h1>一级标题</h1>
<h2>二级标题</h2>
<h3>三级标题</h3>
<h4>四级标题</h4>
<h5>五级标题</h5>
<h6>六级标题</h6>
<div class="h1">使用 h1 类的文本</div>
<div class="h2">使用 h2 类的文本</div>

</DefaultRender>

## Post Second Level Heading Style <Badge type="tip" text="Post Style" />

### Post Second Level Heading Style Markdown Syntax

```markdown
## 在此处 h2 标题前应有一个 `#` 字符
```

### There should be a `#` character before the h2 heading here HTML Tag Syntax

```html
<h2>在此处 h2 标题前应有一个 <code>#</code> 字符</h2>
```

### There should be a `#` character before the h2 heading here Rendering Effect

<DefaultRender src="/halo-theme-higan-haozi/frames/post">

## 在此处 h2 标题前应有一个 `#` 字符

</DefaultRender>

## Link in Heading <Badge type="tip" text="General Style" />

### Link in Heading Markdown Syntax

<!-- prettier-ignore-start -->
```markdown
# [一级标题中的链接](https://howiehz.top)
## [二级标题中的链接](https://howiehz.top)
### [三级标题中的链接](https://howiehz.top)
#### [四级标题中的链接](https://howiehz.top)
##### [五级标题中的链接](https://howiehz.top)
###### [六级标题中的链接](https://howiehz.top)
```
<!-- prettier-ignore-end -->

### [二级标题中的链接](https://howiehz.top) HTML Tag Syntax

```html
<h1><a href="https://howiehz.top">一级标题中的链接</a></h1>
<h2><a href="https://howiehz.top">二级标题中的链接</a></h2>
<h3><a href="https://howiehz.top">三级标题中的链接</a></h3>
<h4><a href="https://howiehz.top">四级标题中的链接</a></h4>
<h5><a href="https://howiehz.top">五级标题中的链接</a></h5>
<h6><a href="https://howiehz.top">六级标题中的链接</a></h6>
```

### [二级标题中的链接](https://howiehz.top) HTML Class Syntax

```html
<div class="h1"><a href="https://example.com">h1 类中的链接</a></div>
<div class="h2"><a href="https://example.com">h2 类中的链接</a></div>
```

### [二级标题中的链接](https://howiehz.top) Rendering Effect

<DefaultRender height="300px">

<h1><a href="https://howiehz.top">一级标题中的链接</a></h1>
<h2><a href="https://howiehz.top">二级标题中的链接</a></h2>
<h3><a href="https://howiehz.top">三级标题中的链接</a></h3>
<h4><a href="https://howiehz.top">四级标题中的链接</a></h4>
<h5><a href="https://howiehz.top">五级标题中的链接</a></h5>
<h6><a href="https://howiehz.top">六级标题中的链接</a></h6>
<div class="h1"><a href="https://example.com">h1 类中的链接</a></div>
<div class="h2"><a href="https://example.com">h2 类中的链接</a></div>
</DefaultRender>

## Link <Badge type="tip" text="Content Style" />

### Link Markdown Syntax

```markdown
[这是普通链接](https://example.com)，有下划线效果。鼠标悬停时下划线颜色会变化。
```

### Link HTML Tag Syntax

```html
<a href="https://example.com">这是普通链接</a>，有下划线效果。鼠标悬停时下划线颜色会变化。
```

### Link Rendering Effect

<DefaultRender>

[这是普通链接](https://example.com)，有下划线效果。鼠标悬停时下划线颜色会变化。

</DefaultRender>

## Icon Link <Badge type="tip" text="Content Style" />

<!-- prettier-ignore-start -->
```html
<a class="icon" href="javascript:void(0);">这里有一个带有 `class="icon"` 的超链接标签：用于图标链接，没有下划线，鼠标悬停时颜色会变化</a>
```
<!-- prettier-ignore-end -->

### Icon Link Rendering Effect

<DefaultRender>
<a class="icon" href="javascript:void(0);">这里有一个带有 `class="icon"` 的超链接标签：用于图标链接，没有下划线，鼠标悬停时颜色会变化</a>
</DefaultRender>

## Image Embed <Badge type="tip" text="Post Style" />

### Image Embed Markdown Syntax

```markdown
![Alt text - 图片未加载则显示](https://probberechts.github.io/hexo-theme-cactus/cactus-dark/public/assets/wallpaper-2311325.jpg)

![Alt text - 图片未加载则显示](https://probberechts.github.io/hexo-theme-cactus/cactus-dark/public/assets/wallpaper-878514.jpg "Optional title - 可选的 title 值")

![cat](https://probberechts.github.io/hexo-theme-cactus/cactus-dark/public/assets/wallpaper-2572384.jpg)
```

### Image Embed HTML Tag Syntax

```html
<p>
  <img
    src="https://probberechts.github.io/hexo-theme-cactus/cactus-dark/public/assets/wallpaper-2311325.jpg"
    alt="Alt text - 图片未加载则显示"
  />
</p>

<p>
  <img
    src="https://probberechts.github.io/hexo-theme-cactus/cactus-dark/public/assets/wallpaper-878514.jpg"
    alt="Alt text - 图片未加载则显示"
    title="Optional title - 可选的 title 值"
  />
</p>

<p>
  <img
    src="https://probberechts.github.io/hexo-theme-cactus/cactus-dark/public/assets/wallpaper-2572384.jpg"
    alt="cat"
  />
</p>
```

### Image Embed Rendering Effect

<DefaultRender height="300px" src="/halo-theme-higan-haozi/frames/post">

![Alt text - 图片未加载则显示](https://probberechts.github.io/hexo-theme-cactus/cactus-dark/public/assets/wallpaper-2311325.jpg)

![Alt text - 图片未加载则显示](https://probberechts.github.io/hexo-theme-cactus/cactus-dark/public/assets/wallpaper-878514.jpg "Optional title - 可选的 title 值")

![cat](https://probberechts.github.io/hexo-theme-cactus/cactus-dark/public/assets/wallpaper-2572384.jpg)

</DefaultRender>

## Caption <Badge type="tip" text="Post Style" />

### Caption HTML Tag Syntax

<!-- prettier-ignore-start -->
```html
<p><img src="https://probberechts.github.io/hexo-theme-cactus/cactus-dark/public/assets/wallpaper-878514.jpg" alt="cat" /></p>

<div class="caption">我是图片说明文字 上面是城市夜景</div>
<figcaption>我是图片说明文字 上面是城市夜景</figcaption>
<div class="caption">我也是图片说明文字 <a href="https://probberechts.github.io/hexo-theme-cactus/cactus-dark/public/assets/wallpaper-2572384.jpg">我是超链接</a></div>
<figcaption>我也是图片说明文字 <a href="https://probberechts.github.io/hexo-theme-cactus/cactus-dark/public/assets/wallpaper-2572384.jpg">我是超链接</a></figcaption>
```

<!-- prettier-ignore-end -->

### Caption Rendering Effect

<DefaultRender height="400px" src="/halo-theme-higan-haozi/frames/post">
<p><img src="https://probberechts.github.io/hexo-theme-cactus/cactus-dark/public/assets/wallpaper-878514.jpg" alt="cat" /></p>

<div class="caption">我是图片说明文字 上面是城市夜景</div>
<figcaption>我是图片说明文字 上面是城市夜景</figcaption>
<div class="caption">我也是图片说明文字 <a href="https://probberechts.github.io/hexo-theme-cactus/cactus-dark/public/assets/wallpaper-2572384.jpg">我是超链接</a></div>
<figcaption>我也是图片说明文字 <a href="https://probberechts.github.io/hexo-theme-cactus/cactus-dark/public/assets/wallpaper-2572384.jpg">我是超链接</a></figcaption>
</DefaultRender>

## Responsive Video Embed <Badge type="tip" text="Post Style" /> <Badge type="warning" text="Extended Style" /> {#responsive-video-embed}

### Responsive Video Embed HTML Tag Syntax

::: tip

包裹在 `<div class="video-container"></div>` 内使得嵌入的视频宽度能随着页面宽度减小，方法 From [CSS: Elastic Videos - Web Designer Wall](https://webdesignerwall.com/tutorials/css-elastic-videos)。

:::

```html
<div class="video-container">
  <iframe
    src="https://player.bilibili.com/player.html?bvid=BV1A7QWY3EkW&autoplay=0&poster=1&muted=1&danmaku=0"
    width="100%"
    height="500"
    scrolling="no"
    frameborder="0"
    framespacing="0"
    allowfullscreen="true"
    sandbox="allow-top-navigation allow-same-origin allow-forms allow-scripts"
  ></iframe>
</div>
```

### Responsive Video Embed Rendering Effect

<DefaultRender height="400px" src="/halo-theme-higan-haozi/frames/post">
<div class="video-container">
  <iframe
    src="https://player.bilibili.com/player.html?bvid=BV1A7QWY3EkW&autoplay=0&poster=1&muted=1&danmaku=0"
    width="100%"
    height="500"
    scrolling="no"
    frameborder="0"
    framespacing="0"
    allowfullscreen="true"
    sandbox="allow-top-navigation allow-same-origin allow-forms allow-scripts"
  ></iframe>
</div>
</DefaultRender>

## Blockquote <Badge type="tip" text="Post Style" />

### Blockquote Markdown Syntax

```markdown
> 引用内容

> 这是引用内容
>
> > 这是嵌套引用内容
>
> 这层引用内容回到了第 One layer
```

### Blockquote Rendering Effect

<DefaultRender height="400px" src="/halo-theme-higan-haozi/frames/post">

<!-- markdownlint-disable MD028 -->

> 引用内容

> 这是引用内容
>
> > 这是嵌套引用内容
>
> 这层引用内容回到了第 One layer

<!-- markdownlint-enable MD028 -->

</DefaultRender>

## Blockquote Footnote <Badge type="tip" text="Post Style" /> <Badge type="warning" text="Extended Style" /> {#blockquote-footnote}

### Blockquote Footnote Markdown Syntax

```markdown
> 引用内容
>
> <footer>脚注信息</footer>

> 引用内容
>
> <footer><cite>作者名</cite></footer>

> 引用内容
>
> <footer><a href="https://example.com">作者主页</a></footer>

> 这是一个引用块。它应用了特定的颜色和字体粗细。
>
> <footer><a href="https://example.com">作者链接</a><cite>作者名</cite></footer>
```

### Blockquote Footnote Rendering Effect

<DefaultRender height="600px" src="/halo-theme-higan-haozi/frames/post">

<!-- markdownlint-disable MD028 -->

> 引用内容
>
> <footer>脚注信息</footer>

> 引用内容
>
> <footer><cite>作者名</cite></footer>

> 引用内容
>
> <footer><a href="https://example.com">作者主页</a></footer>

> 这是一个引用块。它应用了特定的颜色和字体粗细。
>
> <footer><a href="https://example.com">作者链接</a><cite>作者名</cite></footer>

<!-- markdownlint-enable MD028 -->

</DefaultRender>

## Pullquote <Badge type="tip" text="Post Style" /> <Badge type="warning" text="Extended Style" /> {#pullquote}

### Pullquote HTML Tag Syntax

<!-- prettier-ignore-start -->
```html
<div style="clear: both">

这是一段测试文本，正如你所想的，只是一段测试文本。这是一段测试文本，正如你所想的，只是一段测试文本。这是一段测试文本，正如你所想的，只是一段测试文本。这是一段测试文本，正如你所想的，只是一段测试文本。

<blockquote class="pullquote">

这是拉引用样式。这是拉引用样式。这是拉引用样式。这是拉引用样式。这是拉引用样式。这是拉引用样式。这是拉引用样式。

</blockquote>

这还是一段测试文本，正如你所想的，只是一段测试文本。这还是一段测试文本，正如你所想的，只是一段测试文本。这还是一段测试文本，正如你所想的，只是一段测试文本。这还是一段测试文本，正如你所想的，只是一段测试文本。

<blockquote class="pullquote left">

这是左侧的拉引用样式。这是左侧的拉引用样式。这是左侧的拉引用样式。这是左侧的拉引用样式。这是左侧的拉引用样式。这是左侧的拉引用样式。这是左侧的拉引用样式。

</blockquote>

这是主文本内容，可以围绕左侧的拉引用。这段文本足够长，可以测试文本如何环绕左侧拉引用。可以看到引用只占据了 45% 的宽度，文本会自动填充剩余空间。这是主文本内容，可以围绕左侧的拉引用。这段文本足够长，可以测试文本如何环绕左侧拉引用。可以看到引用只占据了 45% 的宽度，文本会自动填充剩余空间。这是主文本内容，可以围绕左侧的拉引用。这段文本足够长，可以测试文本如何环绕左侧拉引用。可以看到引用只占据了 45% 的宽度，文本会自动填充剩余空间。这是主文本内容，可以围绕左侧的拉引用。这段文本足够长，可以测试文本如何环绕左侧拉引用。可以看到引用只占据了 45% 的宽度，文本会自动填充剩余空间。

<blockquote class="pullquote right">

这是右侧的拉引用样式。这是右侧的拉引用样式。这是右侧的拉引用样式。这是右侧的拉引用样式。这是右侧的拉引用样式。这是右侧的拉引用样式。这是右侧的拉引用样式。

</blockquote>

这是另一段文本，围绕右侧拉引用。同样地，这段文字需要足够长，才能看出环绕效果。右侧拉引用也有特定的边距设置。这是另一段文本，围绕右侧拉引用。同样地，这段文字需要足够长，才能看出环绕效果。右侧拉引用也有特定的边距设置。这是另一段文本，围绕右侧引用。这是另一段文本，围绕右侧拉引用。同样地，这段文字需要足够长，才能看出环绕效果。右侧拉引用也有特定的边距设置。这是另一段文本，围绕右侧引用。这是另一段文本，围绕右侧拉引用。同样地，这段文字需要足够长，才能看出环绕效果。右侧拉引用也有特定的边距设置。这是另一段文本，围绕右侧引用。这是另一段文本，围绕右侧拉引用。同样地，这段文字需要足够长，才能看出环绕效果。右侧拉引用也有特定的边距设置。这是另一段文本，围绕右侧引用。

</div>
```
<!-- prettier-ignore-end -->

### Pullquote Rendering Effect

<DefaultRender height="500px" src="/halo-theme-higan-haozi/frames/post">
<div style="clear: both">

这是一段测试文本，正如你所想的，只是一段测试文本。这是一段测试文本，正如你所想的，只是一段测试文本。这是一段测试文本，正如你所想的，只是一段测试文本。这是一段测试文本，正如你所想的，只是一段测试文本。

<blockquote class="pullquote">

这是拉引用样式。这是拉引用样式。这是拉引用样式。这是拉引用样式。这是拉引用样式。这是拉引用样式。这是拉引用样式。

</blockquote>

这还是一段测试文本，正如你所想的，只是一段测试文本。这还是一段测试文本，正如你所想的，只是一段测试文本。这还是一段测试文本，正如你所想的，只是一段测试文本。这还是一段测试文本，正如你所想的，只是一段测试文本。

<blockquote class="pullquote left">

这是左侧的拉引用样式。这是左侧的拉引用样式。这是左侧的拉引用样式。这是左侧的拉引用样式。这是左侧的拉引用样式。这是左侧的拉引用样式。这是左侧的拉引用样式。

</blockquote>

这是主文本内容，可以围绕左侧的拉引用。这段文本足够长，可以测试文本如何环绕左侧拉引用。可以看到引用只占据了 45% 的宽度，文本会自动填充剩余空间。这是主文本内容，可以围绕左侧的拉引用。这段文本足够长，可以测试文本如何环绕左侧拉引用。可以看到引用只占据了 45% 的宽度，文本会自动填充剩余空间。这是主文本内容，可以围绕左侧的拉引用。这段文本足够长，可以测试文本如何环绕左侧拉引用。可以看到引用只占据了 45% 的宽度，文本会自动填充剩余空间。这是主文本内容，可以围绕左侧的拉引用。这段文本足够长，可以测试文本如何环绕左侧拉引用。可以看到引用只占据了 45% 的宽度，文本会自动填充剩余空间。

<blockquote class="pullquote right">

这是右侧的拉引用样式。这是右侧的拉引用样式。这是右侧的拉引用样式。这是右侧的拉引用样式。这是右侧的拉引用样式。这是右侧的拉引用样式。这是右侧的拉引用样式。

</blockquote>

这是另一段文本，围绕右侧拉引用。同样地，这段文字需要足够长，才能看出环绕效果。右侧拉引用也有特定的边距设置。这是另一段文本，围绕右侧拉引用。同样地，这段文字需要足够长，才能看出环绕效果。右侧拉引用也有特定的边距设置。这是另一段文本，围绕右侧引用。这是另一段文本，围绕右侧拉引用。同样地，这段文字需要足够长，才能看出环绕效果。右侧拉引用也有特定的边距设置。这是另一段文本，围绕右侧引用。这是另一段文本，围绕右侧拉引用。同样地，这段文字需要足够长，才能看出环绕效果。右侧拉引用也有特定的边距设置。这是另一段文本，围绕右侧引用。这是另一段文本，围绕右侧拉引用。同样地，这段文字需要足够长，才能看出环绕效果。右侧拉引用也有特定的边距设置。这是另一段文本，围绕右侧引用。

</div>
</DefaultRender>

## Unordered List <Badge type="tip" text="General Style" />

### Unordered List Markdown Syntax

```markdown
- 列表项一
- 列表项二
  - 嵌套列表项
  - 另一嵌套列表项
- 列表项三
```

### Unordered List HTML Tag Syntax

```html
<ul>
  <li>列表项一</li>
  <li>
    列表项二
    <ul>
      <li>嵌套列表项</li>
      <li>另一嵌套列表项</li>
    </ul>
  </li>
  <li>列表项三</li>
</ul>
```

### Unordered List Rendering Effect

<DefaultRender height="250px">

- 列表项一
- 列表项二
  - 嵌套列表项
  - 另一嵌套列表项
- 列表项三

</DefaultRender>

## Ordered List <Badge type="tip" text="General Style" />

### Ordered List Markdown Syntax

```markdown
1. 第一项
2. 第二项
   1. 嵌套有序项
   2. 嵌套有序项
3. 第三项
```

### Ordered List HTML Tag Syntax

```html
<ol>
  <li>第一项</li>
  <li>
    第二项
    <ol>
      <li>嵌套有序项</li>
      <li>嵌套有序项</li>
    </ol>
  </li>
  <li>第三项</li>
</ol>
```

### Ordered List Rendering Effect

<DefaultRender height="250px">

1. 第一项
2. 第二项
   1. 嵌套有序项
   2. 嵌套有序项
3. 第三项

</DefaultRender>

## Definition List <Badge type="tip" text="General Style" />

### Definition List HTML Tag Syntax

```html
<dl>
  <dt>术语一</dt>
  <dd>术语一的定义说明</dd>
  <dt>术语二</dt>
  <dd>术语二的定义说明</dd>
</dl>
```

### Definition List Rendering Effect

<DefaultRender height="250px">
<dl>
    <dt>术语一</dt>
    <dd>术语一的定义说明</dd>
    <dt>术语二</dt>
    <dd>术语二的定义说明</dd>
</dl>
</DefaultRender>

## Table <Badge type="tip" text="General Style" />

### Table Markdown Syntax

```markdown
| 名称     | 平均时间复杂度 | 空间复杂度 |
| -------- | -------------- | ---------- |
| 冒泡排序 | O(n^2)         | O(1)       |
| 归并排序 | O(n log n)     | O(n)       |
| 快速排序 | O(n log n)     | O(log n)   |
```

### Table HTML Tag Syntax

```html
<table>
  <thead>
    <tr>
      <th><p>名称</p></th>
      <th><p>平均时间复杂度</p></th>
      <th><p>空间复杂度</p></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><p>冒泡排序</p></td>
      <td><p>O(n^2)</p></td>
      <td><p>O(1)</p></td>
    </tr>
    <tr>
      <td><p>归并排序</p></td>
      <td><p>O(n\log n)</p></td>
      <td><p>O(n)</p></td>
    </tr>
    <tr>
      <td><p>快速排序</p></td>
      <td><p>O(n\log n)</p></td>
      <td><p>O(\log n)</p></td>
    </tr>
  </tbody>
</table>
```

### Table Rendering Effect

<DefaultRender height="200px">

| 名称     | 平均时间复杂度 | 空间复杂度 |
| -------- | -------------- | ---------- |
| 冒泡排序 | O(n^2)         | O(1)       |
| 归并排序 | O(n log n)     | O(n)       |
| 快速排序 | O(n log n)     | O(log n)   |

</DefaultRender>

## Horizontal Divider <Badge type="tip" text="General Style" /> {#horizontal-divider-special-style}

### Horizontal Divider Markdown Syntax

```markdown
---
```

### Horizontal Divider HTML Tag Syntax

```html
<hr />
```

### Horizontal Divider Rendering Effect

<DefaultRender>

---

</DefaultRender>

## Horizontal Divider (Special Style) <Badge type="tip" text="General Style" /> <Badge type="warning" text="Extended Style" />

### Horizontal Divider (Special Style) HTML Class Syntax

```html
<hr class="divide" />
```

### Horizontal Divider (Special Style) Rendering Effect

<DefaultRender>
<hr class='divide' />
</DefaultRender>

## Hidden/Spoiler <Badge type="tip" text="General Style" /> <Badge type="warning" text="Extended Style" /> {#hidden-spoiler-content}

### Hidden/Spoiler HTML Tag Syntax

<!-- prettier-ignore-start -->
```html
我不是隐藏内容。<hide class="blur">我是隐藏内容。应该是模糊样式。</hide>我也不是隐藏内容。
我不是隐藏内容。<spoiler class="blur">我是隐藏内容。应该是模糊样式。</spoiler>我也不是隐藏内容。

我不是隐藏内容。<hide class="black">我是隐藏内容。应该是黑块样式。</hide>我也不是隐藏内容。
我不是隐藏内容。<spoiler class="black">我是隐藏内容。应该是黑块样式。</spoiler>我也不是隐藏内容。

我不是隐藏内容。<hide>我是隐藏内容。鼠标悬停、聚焦或文字选中时自动显示。</hide>我也不是隐藏内容。
我不是隐藏内容。<spoiler>我是隐藏内容。鼠标悬停、聚焦或文字选中时自动显示。</spoiler>我也不是隐藏内容。
```
<!-- prettier-ignore-end -->

### Hidden/Spoiler Rendering Effect

<DefaultRender height="250px">

我不是隐藏内容。<hide class="blur">我是隐藏内容。应该是模糊样式。</hide>我也不是隐藏内容。
我不是隐藏内容。<spoiler class="blur">我是隐藏内容。应该是模糊样式。</spoiler>我也不是隐藏内容。

我不是隐藏内容。<hide class="black">我是隐藏内容。应该是黑块样式。</hide>我也不是隐藏内容。
我不是隐藏内容。<spoiler class="black">我是隐藏内容。应该是黑块样式。</spoiler>我也不是隐藏内容。

我不是隐藏内容。<hide>我是隐藏内容。鼠标悬停、聚焦或文字选中时自动显示。</hide>我也不是隐藏内容。
我不是隐藏内容。<spoiler>我是隐藏内容。鼠标悬停、聚焦或文字选中时自动显示。</spoiler>我也不是隐藏内容。

</DefaultRender>

## Long Word Test <Badge type="tip" text="Content Style" />

### Long Word Test HTML Tag Syntax

<!-- prettier-ignore-start -->
```html
<p>这段文本使用了 hyphens: auto，显示自动断词效果。Supercalifragilisticexpialidocious 是一个非常长的英文单词，在窄容器中会自动添加连字符。Pneumonoultramicroscopicsilicovolcanoconiosis 是另一个超长单词示例。An extremely long English word</p>

<code>这段文本使用了 hyphens: manual，无自动断词。Supercalifragilisticexpialidocious 是一个非常长的英文单词，不会自动添加连字符。Pneumonoultramicroscopicsilicovolcanoconiosis 是另一个超长单词示例。An extremely long English word</code>
```
<!-- prettier-ignore-end -->

### Long Word Test Rendering Result

<DefaultRender height="300px">

<p>这段文本使用了 hyphens: auto，显示自动断词效果。Supercalifragilisticexpialidocious 是一个非常长的英文单词，在窄容器中会自动添加连字符。Pneumonoultramicroscopicsilicovolcanoconiosis 是另一个超长单词示例。An extreme&shy;ly long English word</p>

<code>这段文本使用了 hyphens: manual，无自动断词。Supercalifragilisticexpialidocious 是一个非常长的英文单词，不会自动添加连字符。Pneumonoultramicroscopicsilicovolcanoconiosis 是另一个超长单词示例。An extreme&shy;ly long English word</code>

</DefaultRender>

## Light/Dark Mode Visibility Block <Badge type="tip" text="Post Style" /> <Badge type="warning" text="Extended Style" /> {#light-dark-mode-visibility-block}

```html
<div class="light">这段内容只在亮色模式/自动模式 (亮色) 下显示。试试切换页面主题。</div>
<div class="dark">这段内容只在暗色模式/自动模式 (暗色) 下显示。试试切换页面主题。</div>
```

### Light/Dark Mode Visibility Block Rendering Effect

<DefaultRender src="/halo-theme-higan-haozi/frames/post">
<div class="light">这段内容只在亮色模式/自动模式 (亮色) 下显示。试试切换页面主题。</div>
<div class="dark">这段内容只在暗色模式/自动模式 (暗色) 下显示。试试切换页面主题。</div>
</DefaultRender>

### Mermaid Light/Dark Theme Adaptation

以下方法均为 HTML 标签写法。  
相关链接：[How to Use HTML Syntax in the Editor](#how-to-use-html-syntax-in-the-editor)

::: details 方法一 <Badge type="tip" text="默认编辑器可用" /> <Badge type="tip" text="Vditor 编辑器可用" />  
Need to enable [Mermaid 支持](/en/guide/theme-configuration#mermaid-支持)。  
图表只写一遍，自动生成浅色/深色模式下两种图表。  
缺点：不兼容 Vditor 编辑器的实时预览。

<!-- prettier-ignore-start -->
```html
<div class="mermaid auto">
[[图表正文]]
</div>
```
<!-- prettier-ignore-end -->

:::
::: details 方法二 <Badge type="tip" text="默认编辑器可用" />  
Need to enable [Mermaid 支持](/en/guide/theme-configuration#mermaid-支持)。  
手动管理浅色/深色模式下的图表。

<!-- prettier-ignore-start -->
```html
<div class="mermaid dark">
%%{init: { "theme": "dark" } }%%
[[图表正文]]
</div>

<div class="mermaid light">
%%{init: { "theme": "light" } }%%
[[图表正文]]
</div>
```
<!-- prettier-ignore-end -->

:::
::: details 方法三 <Badge type="tip" text="Vditor 编辑器可用" />  
Need to enable [Mermaid 支持](/en/guide/theme-configuration#mermaid-支持)。  
原理：由于主题的 Mermaid 初始化先加载，可在 Vditor 自带的 Mermaid 渲染前抢先渲染生成。  
缺点：一张图会多被渲染一遍（被 Vditor 自带的 Mermaid 多渲染一遍）。  
优点：兼容 Vditor 编辑器的实时预览。
注意：出现的空行不可省略，没出现空行的也不能多添加空行。建议使用分屏预览模式编辑。

<!-- prettier-ignore-start -->
````html
<div class="mermaid auto">

```mermaid
[[图表正文]]
```

</div>
````
<!-- prettier-ignore-end -->

:::
::: details 方法四 <Badge type="tip" text="Vditor 编辑器可用" />  
需关闭 [Mermaid 支持](/en/guide/theme-configuration#mermaid-支持)。  
缺点：同样内容要复制粘贴一遍。由于是完全使用 Vditor 自带的渲染，所以主题设置中有关 Mermaid 的设置会失效。会继承上游的 bug，如 [mermaid-js/mermaid@5741](https://github.com/mermaid-js/mermaid/issues/5741)。  
优点：兼容 Vditor 编辑器的实时预览，兼容性最好。完全使用 Vditor 自带的渲染，和预览表现一致。

<!-- prettier-ignore-start -->
````html
<div class="light">

```mermaid
---
title: [[图表标题]]
---
%%{init: { "theme": "light" } }%%
[[图表正文]]
```

</div>

<div class="dark">

```mermaid
---
title: [[图表标题]]
---
%%{init: { "theme": "dark" } }%%
[[图表正文]]
```

</div>
````
<!-- prettier-ignore-end -->

:::
