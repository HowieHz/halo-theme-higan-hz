---
outline: deep
---

<!-- markdownlint-disable MD013 MD024 MD025 MD033 -->

# 组件样式扩展

::: danger

此页面需重写

:::

展示基本样式以及拓展样式。

::: info 样式适用范围说明

相关链接：[模板文件与访问路径映射](/reference/template-map)

- 通用样式，适用模板文件范围：每一页。
- 内容样式 `.content` ，适用模板文件范围：`archives.html`, `category.html`, `links.html`, `moments.html`, `moment.html`, `page.html`, `photos.html`, `post.html(文章页)`, `tag.html`. `5xx.html`, `404.html`。
- 文章样式 `article .content`，适用模板文件范围：`author.html`, `links.html`, `moment.html`, `moments.html`, `page.html`, `photos.html`, `post.html`, `qrcode.html`, `5xx.html`, `404.html`。

:::

如果你想快速寻找可能仅在本主题，而不能在其他 Halo CMS 主题生效的样式（作使用指导）。请使用 `CTRL+F` 快捷键搜索关键字：`higan-hz 式`

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

#### 渲染效果

<iframe data-why style="height: 300px;">

# 一级标题

## 二级标题

### 三级标题

#### 四级标题

##### 五级标题

###### 六级标题

<div class="h1">使用 h1 类的文本</div>
<div class="h2">使用 h2 类的文本</div>

</iframe>

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

#### 渲染效果

<iframe data-why style="height: 300px;">

# [一级标题中的链接](https://howiehz.top)

## [二级标题中的链接](https://howiehz.top)

### [三级标题中的链接](https://howiehz.top)

#### [四级标题中的链接](https://howiehz.top)

##### [五级标题中的链接](https://howiehz.top)

###### [六级标题中的链接](https://howiehz.top)

<div class="h1"><a href="https://example.com">h1 类中的链接</a></div>
<div class="h2"><a href="https://example.com">h2 类中的链接</a></div>
</iframe>

## 水平分割线 <Badge type="tip" text="通用样式" />

### Markdown 写法

```markdown
---
```

### HTML 标签写法

```html
<hr />
```

#### 渲染效果

<iframe data-why>

---

</iframe>

## higan-hz 式 - divide 类水平分割线 <Badge type="tip" text="通用样式" />

### HTML 类写法

```html
<hr class="divide" />
```

#### 渲染效果

<iframe data-why>
<hr class='divide' />
</iframe>

## 粗体 <Badge type="tip" text="通用样式" />

### Markdown 写法

```markdown
**这是粗体文本**
```

### HTML 标签写法

```html
<strong>这是粗体文本</strong>
```

#### 渲染效果

<iframe data-why>
<strong>这是粗体文本</strong>
</iframe>

## 斜体/强调 <Badge type="tip" text="通用样式" />

### Markdown 写法

```markdown
_这是强调文本_
```

### HTML 标签写法

```html
<em>这是强调文本</em>
```

#### 渲染效果

<iframe data-why>
<em>这是强调文本</em>
</iframe>

## 引用 <Badge type="tip" text="通用样式" />

### HTML 标签写法

```html
<cite>这是引用文本</cite>
```

#### 渲染效果

<iframe data-why>
<cite>这是引用文本</cite>
</iframe>

## 上标和下标 <Badge type="tip" text="通用样式" />

### HTML 标签写法

<!-- prettier-ignore-start -->
```html
正常文本<sup>上标<sup>上上标<sup>上上上标<sup>上上上上标</sup></sup></sup></sup>
正常文本<sub>下标<sub>下下标<sub>下下下标<sub>下下下下标</sub></sub></sub></sub>

正常文本<sup>上标</sup>与<sub>下标</sub>
```
<!-- prettier-ignore-end -->

#### 渲染效果

<iframe data-why style="height: 100px;">

正常文本<sup>上标<sup>上上标<sup>上上上标<sup>上上上上标</sup></sup></sup></sup>
正常文本<sub>下标<sub>下下标<sub>下下下标<sub>下下下下标</sub></sub></sub></sub>

正常文本<sup>上标</sup>与<sub>下标</sub>

</iframe>

## 小号文本 <Badge type="tip" text="通用样式" />

### HTML 标签写法

<!-- prettier-ignore-start -->
```html
这是正常文本 <small>这是小号文本</small> 这是正常文本

This is normal text <small>This is small text</small> This is normal text
```
<!-- prettier-ignore-end -->

#### 渲染效果

<iframe data-why>

这是正常文本 <small>这是小号文本</small> 这是正常文本

This is normal text <small>This is small text</small> This is normal text

</iframe>

## higan-hz 式 - 缩写 <Badge type="tip" text="通用样式" />

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

#### 渲染效果

<iframe data-why style="height: 300px;">

这段文字包含一个缩写，在支持悬停的设备上鼠标放上去可以看到提示：<abbr title="Hypertext Markup Language">HTML</abbr>

当<strong>设备不支持悬停</strong>或处于<strong>打印模式</strong>时，全称将会以`(全称)`的形式显示在缩写后面。
例如在触摸设备上，上面的 "HTML" 会自动显示为 "HTML(Hypertext Markup Language)"。

<abbr title="Hypertext Markup Language"><a href="https://example.com">HTML - 此行在文章内会同时应用 a 标签的样式，因此有两层下划线</a></abbr>

<abbr title="我是提示">这个标签写了 title 属性，所以鼠标放上去会有提示。</abbr>

<abbr>实际上 <abbr>title</abbr> 是可选项</abbr>

<abbr>一层 <abbr>二层 <abbr>三层 <abbr>四层 abbr 标签嵌套测试 </abbr></abbr></abbr></abbr>

</iframe>

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

#### 渲染效果

<iframe data-why>

- 列表项一
- 列表项二
  - 嵌套列表项
  - 另一嵌套列表项
- 列表项三

</iframe>

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

#### 渲染效果

<iframe data-why>

1. 第一项
2. 第二项
   1. 嵌套有序项
   2. 嵌套有序项
3. 第三项

</iframe>

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

#### 渲染效果

<iframe data-why>
<dl>
    <dt>术语一</dt>
    <dd>术语一的定义说明</dd>
    <dt>术语二</dt>
    <dd>术语二的定义说明</dd>
</dl>
</iframe>

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

#### 渲染效果

<iframe data-why>

| 名称     | 平均时间复杂度 | 空间复杂度 |
| -------- | -------------- | ---------- |
| 冒泡排序 | O(n^2)         | O(1)       |
| 归并排序 | O(n log n)     | O(n)       |
| 快速排序 | O(n log n)     | O(log n)   |

</iframe>

## 段落 <Badge type="tip" text="通用样式" />

### Markdown 写法

```markdown
这是一个普通段落，测试文本对齐和行高。这个段落包含一些常用格式如**粗体**、*斜体*和`代码`。根据你的 CSS，这段文字应该有适当的行高和对齐方式。
```

### HTML 标签写法

<!-- prettier-ignore-start -->
```html
<p>这是一个普通段落，测试文本对齐和行高。这个段落包含一些常用格式如<strong>粗体</strong>、<em>斜体</em>和<code>代码</code>。根据你的 CSS，这段文字应该有适当的行高和对齐方式。</p>
```
<!-- prettier-ignore-end -->

#### 渲染效果

<iframe data-why>

这是一个普通段落，测试文本对齐和行高。这个段落包含一些常用格式如**粗体**、*斜体*和 `代码`。根据你的 CSS，这段文字应该有适当的行高和对齐方式。

</iframe>

## higan-hz 式 - hide/spoiler 标签隐藏/剧透内容 <Badge type="tip" text="通用样式" />

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

#### 渲染效果

<iframe data-why>

我不是隐藏内容。<hide class="blur">我是隐藏内容。应该是模糊样式。</hide>我也不是隐藏内容。
我不是隐藏内容。<spoiler class="blur">我是隐藏内容。应该是模糊样式。</spoiler>我也不是隐藏内容。

我不是隐藏内容。<hide class="black">我是隐藏内容。应该是黑块样式。</hide>我也不是隐藏内容。
我不是隐藏内容。<spoiler class="black">我是隐藏内容。应该是黑块样式。</spoiler>我也不是隐藏内容。

我不是隐藏内容。<hide>我是隐藏内容。鼠标悬停、聚焦或文字选中时自动显示。</hide>我也不是隐藏内容。
我不是隐藏内容。<spoiler>我是隐藏内容。鼠标悬停、聚焦或文字选中时自动显示。</spoiler>我也不是隐藏内容。

</iframe>

### 长单词测试 <Badge type="tip" text="内容样式" />

### Markdown 写法

```markdown
这段文本使用了 hyphens: auto，显示自动断词效果。Supercalifragilisticexpialidocious 是一个非常长的英文单词，在窄容器中会自动添加连字符。Pneumonoultramicroscopicsilicovolcanoconiosis 是另一个超长单词示例。An extreme&shy;ly long English word

`这段文本使用了 hyphens: manual，无自动断词。Supercalifragilisticexpialidocious 是一个非常长的英文单词，不会自动添加连字符。Pneumonoultramicroscopicsilicovolcanoconiosis 是另一个超长单词示例。An extreme&shy;ly long English word`
```

#### HTML 标签写法

<!-- prettier-ignore-start -->
```html
<p>这段文本使用了 hyphens: auto，显示自动断词效果。Supercalifragilisticexpialidocious 是一个非常长的英文单词，在窄容器中会自动添加连字符。Pneumonoultramicroscopicsilicovolcanoconiosis 是另一个超长单词示例。An extreme&shy;ly long English word</p>

<code>这段文本使用了 hyphens: manual，无自动断词。Supercalifragilisticexpialidocious 是一个非常长的英文单词，不会自动添加连字符。Pneumonoultramicroscopicsilicovolcanoconiosis 是另一个超长单词示例。An extreme&shy;ly long English word</code>
```
<!-- prettier-ignore-end -->

#### 渲染结果

<iframe data-why>

这段文本使用了 hyphens: auto，显示自动断词效果。Supercalifragilisticexpialidocious 是一个非常长的英文单词，在窄容器中会自动添加连字符。Pneumonoultramicroscopicsilicovolcanoconiosis 是另一个超长单词示例。An extreme&shy;ly long English word

`这段文本使用了 hyphens: manual，无自动断词。Supercalifragilisticexpialidocious 是一个非常长的英文单词，不会自动添加连字符。Pneumonoultramicroscopicsilicovolcanoconiosis 是另一个超长单词示例。An extreme&shy;ly long English word`

<p>这段文本使用了 hyphens: auto，显示自动断词效果。Supercalifragilisticexpialidocious 是一个非常长的英文单词，在窄容器中会自动添加连字符。Pneumonoultramicroscopicsilicovolcanoconiosis 是另一个超长单词示例。An extreme&shy;ly long English word</p>

<code>这段文本使用了 hyphens: manual，无自动断词。Supercalifragilisticexpialidocious 是一个非常长的英文单词，不会自动添加连字符。Pneumonoultramicroscopicsilicovolcanoconiosis 是另一个超长单词示例。An extreme&shy;ly long English word</code>

</iframe>

### 链接样式 <Badge type="tip" text="内容样式" />

#### Markdown 写法

```markdown
[这是普通链接](https://example.com)，有下划线效果。鼠标悬停时下划线颜色会变化。
```

#### HTML 标签写法

```html
<a href="https://example.com">这是普通链接</a>，有下划线效果。鼠标悬停时下划线颜色会变化。
```

#### 渲染效果

<iframe data-why>

[这是普通链接](https://example.com)，有下划线效果。鼠标悬停时下划线颜色会变化。

</iframe>

### 图标链接样式 <Badge type="tip" text="内容样式" />

<!-- prettier-ignore-start -->
```html
<a class="icon" href="javascript:void(0);">这里有一个带有 `class="icon"` 的超链接标签：用于图标链接，没有下划线，鼠标悬停时颜色会变化</a>
```
<!-- prettier-ignore-end -->

#### 渲染效果

<iframe data-why>
<a class="icon" href="javascript:void(0);">这里有一个带有 `class="icon"` 的超链接标签：用于图标链接，没有下划线，鼠标悬停时颜色会变化</a>
</iframe>

### h2 标签样式测试 <Badge type="tip" text="文章样式" />

```markdown
## 在此处 h2 标题前应有一个 `#` 字符
```

#### 渲染效果

<iframe data-why>

## 在此处 h2 标题前应有一个 `#` 字符

</iframe>

### 图片测试 <Badge type="tip" text="文章样式" />

#### Markdown 写法

```markdown
![Alt text - 图片未加载则显示](https://probberechts.github.io/hexo-theme-cactus/cactus-dark/public/assets/wallpaper-2311325.jpg)

![Alt text - 图片未加载则显示](https://probberechts.github.io/hexo-theme-cactus/cactus-dark/public/assets/wallpaper-878514.jpg "Optional title - 可选的 title 值")

![cat](https://probberechts.github.io/hexo-theme-cactus/cactus-dark/public/assets/wallpaper-2572384.jpg)
```

#### HTML 标签写法

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

#### 渲染效果

<iframe data-why>

![Alt text - 图片未加载则显示](https://probberechts.github.io/hexo-theme-cactus/cactus-dark/public/assets/wallpaper-2311325.jpg)

![Alt text - 图片未加载则显示](https://probberechts.github.io/hexo-theme-cactus/cactus-dark/public/assets/wallpaper-878514.jpg "Optional title - 可选的 title 值")

![cat](https://probberechts.github.io/hexo-theme-cactus/cactus-dark/public/assets/wallpaper-2572384.jpg)

</iframe>

### 说明文字 <Badge type="tip" text="文章样式" />

<!-- prettier-ignore-start -->
```html
<img src="https://probberechts.github.io/hexo-theme-cactus/cactus-dark/public/assets/wallpaper-2572384.jpg" alt="cat" />

<div class="caption">我是图片说明文字 上面有一只猫</div>
<div class="caption">我也是图片说明文字 <a href="https://probberechts.github.io/hexo-theme-cactus/cactus-dark/public/assets/wallpaper-2572384.jpg">我是超链接</a></div>
```

<!-- prettier-ignore-end -->

#### 渲染效果

<iframe data-why>
<img src="https://probberechts.github.io/hexo-theme-cactus/cactus-dark/public/assets/wallpaper-2572384.jpg" alt="cat" />

<div class="caption">我是图片说明文字 上面有一只猫</div>
<div class="caption">我也是图片说明文字 <a href="https://probberechts.github.io/hexo-theme-cactus/cactus-dark/public/assets/wallpaper-2572384.jpg">我是超链接</a></div>
</iframe>

### higan-hz 式 - 视频嵌入 <Badge type="tip" text="文章样式" />

#### HTML 标签写法

注：包裹在 `<div class="video-container">` 使得嵌入的视频宽度能随着页面宽度减小，方法来自 [CSS: Elastic Videos - Web Designer Wall](https://webdesignerwall.com/tutorials/css-elastic-videos)

```html
<div class="video-container">
  <iframe
    src="https://player.bilibili.com/player.html?bvid=BV1A7QWY3EkW"
    width="100%"
    height="500"
    scrolling="no"
    frameborder="0"
    danmaku="false"
    allowfullscreen="true"
    muted="true"
    autoplay="false"
    sandbox="allow-top-navigation allow-same-origin allow-forms allow-scripts"
  ></iframe>
</div>
```

#### 渲染效果

<!-- <iframe data-why>
<div class="video-container">
  <iframe
    src="https://player.bilibili.com/player.html?bvid=BV1A7QWY3EkW"
    width="100%"
    height="500"
    scrolling="no"
    frameborder="0"
    danmaku="false"
    allowfullscreen="true"
    muted="true"
    autoplay="false"
    sandbox="allow-top-navigation allow-same-origin allow-forms allow-scripts"
  ></iframe>
</div>
</iframe> -->

### higan-hz 式 - 引用块测试 <Badge type="tip" text="文章样式" />

#### Markdown 写法

```markdown
> 引用内容

> 这是引用内容
>
> > 这是嵌套引用内容
>
> 这层引用内容回到了第一层

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

#### 渲染效果

<iframe data-why>

<!-- markdownlint-disable MD028 -->

> 引用内容

> 这是引用内容
>
> > 这是嵌套引用内容
>
> 这层引用内容回到了第一层

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

</iframe>

### higan-hz 式 - 拉引用样式 <Badge type="tip" text="文章样式" />

注：[hexo-theme-cactus](https://probberechts.github.io/hexo-theme-cactus/cactus-dark/public/2016/11/14/hello-world/) 和 halo-theme-higan 均未能出现文字围绕效果，本分支已添加。

#### HTML 标签写法

<!-- prettier-ignore-start -->
```html
<div style="clear: both">

这是一段测试文本，正如你所想的，只是一段测试文本。这是一段测试文本，正如你所想的，只是一段测试文本。这是一段测试文本，正如你所想的，只是一段测试文本。这是一段测试文本，正如你所想的，只是一段测试文本。这是一段测试文本，正如你所想的，只是一段测试文本。这是一段测试文本，正如你所想的，只是一段测试文本。

<blockquote class="pullquote">

这是拉引用样式。这是拉引用样式。这是拉引用样式。这是拉引用样式。这是拉引用样式。这是拉引用样式。这是拉引用样式。这是拉引用样式。这是拉引用样式。

</blockquote>

这还是一段测试文本，正如你所想的，只是一段测试文本。这还是一段测试文本，正如你所想的，只是一段测试文本。这还是一段测试文本，正如你所想的，只是一段测试文本。这还是一段测试文本，正如你所想的，只是一段测试文本。这还是一段测试文本，正如你所想的，只是一段测试文本。这还是一段测试文本，正如你所想的，只是一段测试文本。这还是一段测试文本，正如你所想的，只是一段测试文本。

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

#### 渲染效果

<iframe data-why>
<div style="clear: both">

这是一段测试文本，正如你所想的，只是一段测试文本。这是一段测试文本，正如你所想的，只是一段测试文本。这是一段测试文本，正如你所想的，只是一段测试文本。这是一段测试文本，正如你所想的，只是一段测试文本。这是一段测试文本，正如你所想的，只是一段测试文本。这是一段测试文本，正如你所想的，只是一段测试文本。

<blockquote class="pullquote">

这是拉引用样式。这是拉引用样式。这是拉引用样式。这是拉引用样式。这是拉引用样式。这是拉引用样式。这是拉引用样式。这是拉引用样式。这是拉引用样式。

</blockquote>

这还是一段测试文本，正如你所想的，只是一段测试文本。这还是一段测试文本，正如你所想的，只是一段测试文本。这还是一段测试文本，正如你所想的，只是一段测试文本。这还是一段测试文本，正如你所想的，只是一段测试文本。这还是一段测试文本，正如你所想的，只是一段测试文本。这还是一段测试文本，正如你所想的，只是一段测试文本。这还是一段测试文本，正如你所想的，只是一段测试文本。

<blockquote class="pullquote left">

这是左侧的拉引用样式。这是左侧的拉引用样式。这是左侧的拉引用样式。这是左侧的拉引用样式。这是左侧的拉引用样式。这是左侧的拉引用样式。这是左侧的拉引用样式。

</blockquote>

这是主文本内容，可以围绕左侧的拉引用。这段文本足够长，可以测试文本如何环绕左侧拉引用。可以看到引用只占据了 45% 的宽度，文本会自动填充剩余空间。这是主文本内容，可以围绕左侧的拉引用。这段文本足够长，可以测试文本如何环绕左侧拉引用。可以看到引用只占据了 45% 的宽度，文本会自动填充剩余空间。这是主文本内容，可以围绕左侧的拉引用。这段文本足够长，可以测试文本如何环绕左侧拉引用。可以看到引用只占据了 45% 的宽度，文本会自动填充剩余空间。这是主文本内容，可以围绕左侧的拉引用。这段文本足够长，可以测试文本如何环绕左侧拉引用。可以看到引用只占据了 45% 的宽度，文本会自动填充剩余空间。

<blockquote class="pullquote right">

这是右侧的拉引用样式。这是右侧的拉引用样式。这是右侧的拉引用样式。这是右侧的拉引用样式。这是右侧的拉引用样式。这是右侧的拉引用样式。这是右侧的拉引用样式。

</blockquote>

这是另一段文本，围绕右侧拉引用。同样地，这段文字需要足够长，才能看出环绕效果。右侧拉引用也有特定的边距设置。这是另一段文本，围绕右侧拉引用。同样地，这段文字需要足够长，才能看出环绕效果。右侧拉引用也有特定的边距设置。这是另一段文本，围绕右侧引用。这是另一段文本，围绕右侧拉引用。同样地，这段文字需要足够长，才能看出环绕效果。右侧拉引用也有特定的边距设置。这是另一段文本，围绕右侧引用。这是另一段文本，围绕右侧拉引用。同样地，这段文字需要足够长，才能看出环绕效果。右侧拉引用也有特定的边距设置。这是另一段文本，围绕右侧引用。这是另一段文本，围绕右侧拉引用。同样地，这段文字需要足够长，才能看出环绕效果。右侧拉引用也有特定的边距设置。这是另一段文本，围绕右侧引用。

</div>
</iframe>

### higan-hz 式 - 明暗模式块测试 <Badge type="tip" text="文章样式" />

```html
<div class="light">这段内容只在亮色模式/自动模式 (亮色) 下显示。</div>

<div class="dark">这段内容只在暗色模式/自动模式 (暗色) 下显示。</div>
```

#### 渲染效果

<iframe data-why>
<div class="light">这段内容只在亮色模式/自动模式 (亮色) 下显示。</div>

<div class="dark">这段内容只在暗色模式/自动模式 (暗色) 下显示。</div>
</iframe>
