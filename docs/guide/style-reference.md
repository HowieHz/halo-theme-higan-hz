---
outline: deep
---

<!-- markdownlint-disable MD013 MD024 MD025 MD033 -->

# 样式参考

<script setup>
import DefaultRender from '../.vitepress/components/DefaultRender.vue';
</script>

此文档展示主题基本样式、扩展样式及其写法。

::: tip

展示样式为主题默认值，部分样式可根据实际需要调整。

:::

## 样式适用范围说明

相关文档：[模板文件与访问路径映射](/reference/template-map)

- <Badge type="tip" text="通用样式" /> 适用模板文件范围：每一页。
- <Badge type="tip" text="内容样式" /> 适用模板文件范围：`archives.html`, `category.html`, `links.html`, `moments.html`, `moment.html`, `page.html`, `photos.html`, `post.html(文章页)`, `tag.html`. `5xx.html`, `404.html`。CSS 选择器为 `.content`。
- <Badge type="tip" text="文章样式" /> 适用模板文件范围：`author.html`, `links.html`, `moment.html`, `moments.html`, `page.html`, `photos.html`, `post.html`, `qrcode.html`, `5xx.html`, `404.html`。CSS 选择器为 `article .content`。

## 如何在编辑器中使用 HTML 写法

- 在默认编辑器的使用方法：
  1. 需启用 [Markdown / HTML 内容块插件](https://github.com/halo-sigs/plugin-hybrid-edit-block)([应用市场页面](https://www.halo.run/store/apps/app-NgHnY))。
  2. 默认编辑器中输入 `/html` 选择插入 HTML 代码块。
- 在 Vditor 编辑器的使用方法：
  1. 需启用 [Vditor 编辑器插件](https://github.com/justice2001/halo-plugin-vditor)([应用市场页面](https://www.halo.run/store/apps/app-uBcYw))，并进入文章编辑页，将文章编辑器设置为 Vditor 编辑器。
  2. Vditor 编辑器原生支持 HTML 标签，直接编写即可。

## 扩展样式快速检索 <Badge type="warning" text="扩展样式" />

此处列出了本主题实现的扩展样式。

- [缩写](#abbreviation)
- [响应式视频嵌入](#responsive-video-embed)
- [引用块脚注](#blockquote-footnote)
- [拉引用块](#pullquote)
- [水平分割线（特殊样式）](#horizontal-divider-special-style)
- [隐藏/剧透](#hidden-spoiler-content)
- [明暗模式显隐块](#light-dark-mode-visibility-block)

## 斜体/强调 <Badge type="tip" text="通用样式" />

### Markdown 写法

<!-- prettier-ignore-start -->
```markdown
*这是强调文本*
_这是强调文本_
```
<!-- prettier-ignore-end -->

### HTML 标签写法

```html
<em>这是强调文本</em>
```

### 渲染效果

<DefaultRender>
<em>这是强调文本</em>
</DefaultRender>

## 粗体 <Badge type="tip" text="通用样式" />

### Markdown 写法

<!-- prettier-ignore-start -->
```markdown
**这是粗体文本**
__这是粗体文本__
```
<!-- prettier-ignore-end -->

### HTML 标签写法

```html
<strong>这是粗体文本</strong>
```

### 渲染效果

<DefaultRender>
<strong>这是粗体文本</strong>
</DefaultRender>

## 行内代码 <Badge type="tip" text="通用样式" />

### Markdown 写法

```markdown
`print("世界，你好！")`
```

### HTML 标签写法

```html
<code>print("世界，你好！")</code>
```

### 渲染效果

<DefaultRender>

`print("世界，你好！")`

</DefaultRender>

## 多行代码块 <Badge type="tip" text="通用样式" />

### Makrdown 写法

<!-- prettier-ignore-start -->
`````markdown
```python
print("世界，你好！")
```

~~~python
print("世界，你好！")
~~~

````markdown
_嵌套代码块示例_

```python
print("嵌套代码块")
```
````
`````
<!-- prettier-ignore-end -->

### 渲染效果

渲染效果随实际渲染器（如 `shiki`，`highlight.js`）变化，故不做渲染展示。

## 段落 <Badge type="tip" text="通用样式" />

### Markdown 写法

```markdown
这是一个普通段落，测试文本对齐和行高。这个段落包含一些常用格式如**粗体**、*斜体*和 `代码`。根据你的 CSS，这段文字应该有适当的行高和对齐方式。

这是另一个段落，这是一个\
换行。

而这不是一个
换行。

在这一行末尾空两格  
也可以产生一个换行。

默认不显示空行，如果你开启 `文章页样式 - 文章页样式 - 优化文章段落空行显示`，则会显示空行。
```

### HTML 标签写法

<!-- prettier-ignore-start -->
```html
<p>这是一个普通段落，测试文本对齐和行高。这个段落包含一些常用格式如<strong>粗体</strong>、<em>斜体</em>和 <code>代码</code>。根据你的 CSS，这段文字应该有适当的行高和对齐方式。</p>
```
<!-- prettier-ignore-end -->

### 渲染效果

<DefaultRender height="325px">

这是一个普通段落，测试文本对齐和行高。这个段落包含一些常用格式如**粗体**、*斜体*和 `代码`。根据你的 CSS，这段文字应该有适当的行高和对齐方式。

这是另一个段落，这是一个\
换行。

而这不是一个
换行。

另外在这一行末尾空两格  
也可以产生一个换行。

默认不显示空行，如果你开启 `文章页样式 - 文章页样式 - 优化文章段落空行显示`，则会显示空行。

</DefaultRender>

## 引用源 <Badge type="tip" text="通用样式" />

### HTML 标签写法

```html
来自<cite>《文档编写指南》</cite>

From <cite>Documentation Writing Guide</cite>
```

### 渲染效果

<DefaultRender>

来自<cite>《文档编写指南》</cite>

From <cite>Documentation Writing Guide</cite>

</DefaultRender>

## 上标和下标 <Badge type="tip" text="通用样式" />

### HTML 标签写法

<!-- prettier-ignore-start -->
```html
正常文本<sup>上标<sup>上上标<sup>上上上标<sup>上上上上标</sup></sup></sup></sup>
正常文本<sub>下标<sub>下下标<sub>下下下标<sub>下下下下标</sub></sub></sub></sub>

正常文本<sup>上标</sup>与<sub>下标</sub>
```
<!-- prettier-ignore-end -->

### 渲染效果

<DefaultRender height="100px">

正常文本<sup>上标<sup>上上标<sup>上上上标<sup>上上上上标</sup></sup></sup></sup>
正常文本<sub>下标<sub>下下标<sub>下下下标<sub>下下下下标</sub></sub></sub></sub>

正常文本<sup>上标</sup>与<sub>下标</sub>

</DefaultRender>

## 小号文本 <Badge type="tip" text="通用样式" />

### HTML 标签写法

<!-- prettier-ignore-start -->
```html
这是正常文本 <small>这是小号文本</small> 这是正常文本

This is normal text <small>This is small text</small> This is normal text
```
<!-- prettier-ignore-end -->

### 渲染效果

<DefaultRender>

这是正常文本 <small>这是小号文本</small> 这是正常文本

This is normal text <small>This is small text</small> This is normal text

</DefaultRender>

## 缩写 <Badge type="tip" text="通用样式" /> <Badge type="warning" text="扩展样式" /> {#abbreviation}

### HTML 标签写法

<!-- prettier-ignore-start -->
```html
这段文字包含一个缩写，在支持悬停的设备上鼠标放上去可以看到提示：<abbr title="Hypertext Markup Language">HTML</abbr>

当<strong>设备不支持悬停</strong>或处于<strong>打印模式</strong>时，全称将会以 `(全称)` 的形式显示在缩写后面。
例如在触摸设备上，上面的 "HTML" 会自动显示为 "HTML(Hypertext Markup Language)"。

<abbr title="Hypertext Markup Language"><a href="https://example.com">HTML - 此行在文章内会同时应用 a 标签的样式，因此有两层下划线</a></abbr>

<abbr title="我是提示">这个标签写了 title 属性，所以鼠标放上去会有提示。</abbr>

<abbr>实际上 <abbr>title</abbr> 是可选项</abbr>

<abbr>一层 <abbr>二层 <abbr>三层 <abbr>四层 abbr 标签嵌套测试 </abbr></abbr></abbr></abbr>
```
<!-- prettier-ignore-end -->

### 渲染效果

<DefaultRender height="300px">

这段文字包含一个缩写，在支持悬停的设备上鼠标放上去可以看到提示：<abbr title="Hypertext Markup Language">HTML</abbr>

当<strong>设备不支持悬停</strong>或处于<strong>打印模式</strong>时，全称将会以`(全称)`的形式显示在缩写后面。
例如在触摸设备上，上面的 "HTML" 会自动显示为 "HTML(Hypertext Markup Language)"。

<abbr title="Hypertext Markup Language"><a href="https://example.com">HTML - 此行在文章内会同时应用 a 标签的样式，因此有两层下划线</a></abbr>

<abbr title="我是提示">这个标签写了 title 属性，所以鼠标放上去会有提示。</abbr>

<abbr>实际上 <abbr>title</abbr> 是可选项</abbr>

<abbr>一层 <abbr>二层 <abbr>三层 <abbr>四层 abbr 标签嵌套测试 </abbr></abbr></abbr></abbr>

</DefaultRender>

## 标题 <Badge type="tip" text="通用样式" />

### Markdown 写法

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

### HTML 标签写法

```html
<h1>一级标题</h1>
<h2>二级标题</h2>
<h3>三级标题</h3>
<h4>四级标题</h4>
<h5>五级标题</h5>
<h6>六级标题</h6>
```

### HTML 类写法

```html
<div class="h1">使用 h1 类的文本</div>
<div class="h2">使用 h2 类的文本</div>
```

### 渲染效果

<DefaultRender height="300px">

# 一级标题

## 二级标题

### 三级标题

#### 四级标题

##### 五级标题

###### 六级标题

<div class="h1">使用 h1 类的文本</div>
<div class="h2">使用 h2 类的文本</div>

</DefaultRender>

## 文章二级标题样式 <Badge type="tip" text="文章样式" />

### Markdown 写法

```markdown
## 在此处 h2 标题前应有一个 `#` 字符
```

### HTML 标签写法

```html
<h2>在此处 h2 标题前应有一个 <code>#</code> 字符</h2>
```

### 渲染效果

<DefaultRender src="/halo-theme-higan-hz/frames/post">

## 在此处 h2 标题前应有一个 `#` 字符

</DefaultRender>

## 标题中的链接 <Badge type="tip" text="通用样式" />

### Markdown 写法

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

### HTML 标签写法

```html
<h1><a href="https://howiehz.top">一级标题中的链接</a></h1>
<h2><a href="https://howiehz.top">二级标题中的链接</a></h2>
<h3><a href="https://howiehz.top">三级标题中的链接</a></h3>
<h4><a href="https://howiehz.top">四级标题中的链接</a></h4>
<h5><a href="https://howiehz.top">五级标题中的链接</a></h5>
<h6><a href="https://howiehz.top">六级标题中的链接</a></h6>
```

### HTML 类写法

```html
<div class="h1"><a href="https://example.com">h1 类中的链接</a></div>
<div class="h2"><a href="https://example.com">h2 类中的链接</a></div>
```

### 渲染效果

<DefaultRender height="300px">

# [一级标题中的链接](https://howiehz.top)

## [二级标题中的链接](https://howiehz.top)

### [三级标题中的链接](https://howiehz.top)

#### [四级标题中的链接](https://howiehz.top)

##### [五级标题中的链接](https://howiehz.top)

###### [六级标题中的链接](https://howiehz.top)

<div class="h1"><a href="https://example.com">h1 类中的链接</a></div>
<div class="h2"><a href="https://example.com">h2 类中的链接</a></div>
</DefaultRender>

## 链接 <Badge type="tip" text="内容样式" />

### Markdown 写法

```markdown
[这是普通链接](https://example.com)，有下划线效果。鼠标悬停时下划线颜色会变化。
```

### HTML 标签写法

```html
<a href="https://example.com">这是普通链接</a>，有下划线效果。鼠标悬停时下划线颜色会变化。
```

### 渲染效果

<DefaultRender>

[这是普通链接](https://example.com)，有下划线效果。鼠标悬停时下划线颜色会变化。

</DefaultRender>

## 图标链接 <Badge type="tip" text="内容样式" />

<!-- prettier-ignore-start -->
```html
<a class="icon" href="javascript:void(0);">这里有一个带有 `class="icon"` 的超链接标签：用于图标链接，没有下划线，鼠标悬停时颜色会变化</a>
```
<!-- prettier-ignore-end -->

### 渲染效果

<DefaultRender>
<a class="icon" href="javascript:void(0);">这里有一个带有 `class="icon"` 的超链接标签：用于图标链接，没有下划线，鼠标悬停时颜色会变化</a>
</DefaultRender>

## 图片嵌入 <Badge type="tip" text="文章样式" />

### Markdown 写法

```markdown
![Alt text - 图片未加载则显示](https://probberechts.github.io/hexo-theme-cactus/cactus-dark/public/assets/wallpaper-2311325.jpg)

![Alt text - 图片未加载则显示](https://probberechts.github.io/hexo-theme-cactus/cactus-dark/public/assets/wallpaper-878514.jpg "Optional title - 可选的 title 值")

![cat](https://probberechts.github.io/hexo-theme-cactus/cactus-dark/public/assets/wallpaper-2572384.jpg)
```

### HTML 标签写法

```html
<img
  src="https://probberechts.github.io/hexo-theme-cactus/cactus-dark/public/assets/wallpaper-2311325.jpg"
  alt="Alt text - 图片未加载则显示"
/>

<img
  src="https://probberechts.github.io/hexo-theme-cactus/cactus-dark/public/assets/wallpaper-878514.jpg"
  alt="Alt text - 图片未加载则显示"
  title="Optional title - 可选的 title 值"
/>

<img src="https://probberechts.github.io/hexo-theme-cactus/cactus-dark/public/assets/wallpaper-2572384.jpg" alt="cat" />
```

### 渲染效果

<DefaultRender height="300px" src="/halo-theme-higan-hz/frames/post">

![Alt text - 图片未加载则显示](https://probberechts.github.io/hexo-theme-cactus/cactus-dark/public/assets/wallpaper-2311325.jpg)

![Alt text - 图片未加载则显示](https://probberechts.github.io/hexo-theme-cactus/cactus-dark/public/assets/wallpaper-878514.jpg "Optional title - 可选的 title 值")

![cat](https://probberechts.github.io/hexo-theme-cactus/cactus-dark/public/assets/wallpaper-2572384.jpg)

</DefaultRender>

## 说明文字 <Badge type="tip" text="文章样式" />

### HTML 标签写法

<!-- prettier-ignore-start -->
```html
<img src="https://probberechts.github.io/hexo-theme-cactus/cactus-dark/public/assets/wallpaper-878514.jpg" alt="cat" />

<div class="caption">我是图片说明文字 上面是城市夜景</div>
<div class="caption">我也是图片说明文字 <a href="https://probberechts.github.io/hexo-theme-cactus/cactus-dark/public/assets/wallpaper-2572384.jpg">我是超链接</a></div>
```

<!-- prettier-ignore-end -->

### 渲染效果

<DefaultRender height="300px" src="/halo-theme-higan-hz/frames/post">
<img src="https://probberechts.github.io/hexo-theme-cactus/cactus-dark/public/assets/wallpaper-878514.jpg" alt="cat" />

<div class="caption">我是图片说明文字 上面是城市夜景</div>
<div class="caption">我也是图片说明文字 <a href="https://probberechts.github.io/hexo-theme-cactus/cactus-dark/public/assets/wallpaper-2572384.jpg">我是超链接</a></div>
</DefaultRender>

## 响应式视频嵌入 <Badge type="tip" text="文章样式" /> <Badge type="warning" text="扩展样式" /> {#responsive-video-embed}

### HTML 标签写法

::: tip

包裹在 `<div class="video-container"></div>` 内使得嵌入的视频宽度能随着页面宽度减小，方法来自 [CSS: Elastic Videos - Web Designer Wall](https://webdesignerwall.com/tutorials/css-elastic-videos)。

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

### 渲染效果

<DefaultRender height="400px" src="/halo-theme-higan-hz/frames/post">
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

## 引用块 <Badge type="tip" text="文章样式" />

### Markdown 写法

```markdown
> 引用内容

> 这是引用内容
>
> > 这是嵌套引用内容
>
> 这层引用内容回到了第一层
```

### 渲染效果

<DefaultRender height="400px" src="/halo-theme-higan-hz/frames/post">

<!-- markdownlint-disable MD028 -->

> 引用内容

> 这是引用内容
>
> > 这是嵌套引用内容
>
> 这层引用内容回到了第一层

<!-- markdownlint-enable MD028 -->

</DefaultRender>

## 引用块脚注 <Badge type="tip" text="文章样式" /> <Badge type="warning" text="扩展样式" /> {#blockquote-footnote}

### Markdown 写法

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

### 渲染效果

<DefaultRender height="600px" src="/halo-theme-higan-hz/frames/post">

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

## 拉引用块 <Badge type="tip" text="文章样式" /> <Badge type="warning" text="扩展样式" /> {#pullquote}

### HTML 标签写法

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

### 渲染效果

<DefaultRender height="500px" src="/halo-theme-higan-hz/frames/post">
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

## 无序列表 <Badge type="tip" text="通用样式" />

### Markdown 写法

```markdown
- 列表项一
- 列表项二
  - 嵌套列表项
  - 另一嵌套列表项
- 列表项三
```

### HTML 标签写法

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

### 渲染效果

<DefaultRender height="250px">

- 列表项一
- 列表项二
  - 嵌套列表项
  - 另一嵌套列表项
- 列表项三

</DefaultRender>

## 有序列表 <Badge type="tip" text="通用样式" />

### Markdown 写法

```markdown
1. 第一项
2. 第二项
   1. 嵌套有序项
   2. 嵌套有序项
3. 第三项
```

### HTML 标签写法

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

### 渲染效果

<DefaultRender height="250px">

1. 第一项
2. 第二项
   1. 嵌套有序项
   2. 嵌套有序项
3. 第三项

</DefaultRender>

## 定义列表 <Badge type="tip" text="通用样式" />

### HTML 标签写法

```html
<dl>
  <dt>术语一</dt>
  <dd>术语一的定义说明</dd>
  <dt>术语二</dt>
  <dd>术语二的定义说明</dd>
</dl>
```

### 渲染效果

<DefaultRender height="250px">
<dl>
    <dt>术语一</dt>
    <dd>术语一的定义说明</dd>
    <dt>术语二</dt>
    <dd>术语二的定义说明</dd>
</dl>
</DefaultRender>

## 表格 <Badge type="tip" text="通用样式" />

### Markdown 写法

```markdown
| 名称     | 平均时间复杂度 | 空间复杂度 |
| -------- | -------------- | ---------- |
| 冒泡排序 | O(n^2)         | O(1)       |
| 归并排序 | O(n log n)     | O(n)       |
| 快速排序 | O(n log n)     | O(log n)   |
```

### HTML 标签写法

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

### 渲染效果

<DefaultRender height="200px">

| 名称     | 平均时间复杂度 | 空间复杂度 |
| -------- | -------------- | ---------- |
| 冒泡排序 | O(n^2)         | O(1)       |
| 归并排序 | O(n log n)     | O(n)       |
| 快速排序 | O(n log n)     | O(log n)   |

</DefaultRender>

## 水平分割线 <Badge type="tip" text="通用样式" /> {#horizontal-divider-special-style}

### Markdown 写法

```markdown
---
```

### HTML 标签写法

```html
<hr />
```

### 渲染效果

<DefaultRender>

---

</DefaultRender>

## 水平分割线（特殊样式） <Badge type="tip" text="通用样式" /> <Badge type="warning" text="扩展样式" />

### HTML 类写法

```html
<hr class="divide" />
```

### 渲染效果

<DefaultRender>
<hr class='divide' />
</DefaultRender>

## 隐藏/剧透 <Badge type="tip" text="通用样式" /> <Badge type="warning" text="扩展样式" /> {#hidden-spoiler-content}

### HTML 标签写法

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

### 渲染效果

<DefaultRender height="250px">

我不是隐藏内容。<hide class="blur">我是隐藏内容。应该是模糊样式。</hide>我也不是隐藏内容。
我不是隐藏内容。<spoiler class="blur">我是隐藏内容。应该是模糊样式。</spoiler>我也不是隐藏内容。

我不是隐藏内容。<hide class="black">我是隐藏内容。应该是黑块样式。</hide>我也不是隐藏内容。
我不是隐藏内容。<spoiler class="black">我是隐藏内容。应该是黑块样式。</spoiler>我也不是隐藏内容。

我不是隐藏内容。<hide>我是隐藏内容。鼠标悬停、聚焦或文字选中时自动显示。</hide>我也不是隐藏内容。
我不是隐藏内容。<spoiler>我是隐藏内容。鼠标悬停、聚焦或文字选中时自动显示。</spoiler>我也不是隐藏内容。

</DefaultRender>

## 长单词测试 <Badge type="tip" text="内容样式" />

### HTML 标签写法

<!-- prettier-ignore-start -->
```html
<p>这段文本使用了 hyphens: auto，显示自动断词效果。Supercalifragilisticexpialidocious 是一个非常长的英文单词，在窄容器中会自动添加连字符。Pneumonoultramicroscopicsilicovolcanoconiosis 是另一个超长单词示例。An extremely long English word</p>

<code>这段文本使用了 hyphens: manual，无自动断词。Supercalifragilisticexpialidocious 是一个非常长的英文单词，不会自动添加连字符。Pneumonoultramicroscopicsilicovolcanoconiosis 是另一个超长单词示例。An extremely long English word</code>
```
<!-- prettier-ignore-end -->

### 渲染结果

<DefaultRender height="300px">

<p>这段文本使用了 hyphens: auto，显示自动断词效果。Supercalifragilisticexpialidocious 是一个非常长的英文单词，在窄容器中会自动添加连字符。Pneumonoultramicroscopicsilicovolcanoconiosis 是另一个超长单词示例。An extreme&shy;ly long English word</p>

<code>这段文本使用了 hyphens: manual，无自动断词。Supercalifragilisticexpialidocious 是一个非常长的英文单词，不会自动添加连字符。Pneumonoultramicroscopicsilicovolcanoconiosis 是另一个超长单词示例。An extreme&shy;ly long English word</code>

</DefaultRender>

## 明暗模式显隐块 <Badge type="tip" text="文章样式" /> <Badge type="warning" text="扩展样式" /> {#light-dark-mode-visibility-block}

```html
<div class="light">这段内容只在亮色模式/自动模式 (亮色) 下显示。试试切换页面主题。</div>
<div class="dark">这段内容只在暗色模式/自动模式 (暗色) 下显示。试试切换页面主题。</div>
```

### 渲染效果

<DefaultRender src="/halo-theme-higan-hz/frames/post">
<div class="light">这段内容只在亮色模式/自动模式 (亮色) 下显示。试试切换页面主题。</div>
<div class="dark">这段内容只在暗色模式/自动模式 (暗色) 下显示。试试切换页面主题。</div>
</DefaultRender>

### Mermaid 适配明暗主题切换

以下方法均为 HTML 标签写法。  
相关链接：[如何在编辑器中使用 HTML 写法](#如何在编辑器中使用-html-写法)

::: details 方法一 <Badge type="tip" text="默认编辑器可用" /> <Badge type="tip" text="Vditor 编辑器可用" />  
需启用 [Mermaid 支持](/guide/theme-configuration#mermaid-支持)。  
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
需启用 [Mermaid 支持](/guide/theme-configuration#mermaid-支持)。  
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
需启用 [Mermaid 支持](/guide/theme-configuration#mermaid-支持)。  
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
需关闭 [Mermaid 支持](/guide/theme-configuration#mermaid-支持)。  
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
