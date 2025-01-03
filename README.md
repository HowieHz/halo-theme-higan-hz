# halo-theme-higan-hz

![GitHub](https://img.shields.io/github/license/HowieHz/halo-theme-higan-hz)
![GitHub all releases](https://img.shields.io/github/downloads/HowieHz/halo-theme-higan-hz/total)
![GitHub release (latest by date)](https://img.shields.io/github/downloads/HowieHz/halo-theme-higan-hz/latest/total)
![GitHub repo size](https://img.shields.io/github/repo-size/HowieHz/halo-theme-higan-hz)

## 说明

该主题是 guqing 的 [halo-theme-higan](https://github.com/guqing/halo-theme-higan) 进行了定制化修改后的主题

> 更激进的修改，更高的配置自由度！

主题交流群（QQ）：694413711

### 特色功能概要

1. 可自定义更多内容
   - 页面样式
   - 固定文字
   - 关闭一切你想关闭的部分！
2. 修复错误
3. 添加轻量的过渡动画
4. 支持更多特色功能
   - [浅色/深色模式切换按钮](#theme-switch-button-anchor)
   - 防止站点被恶意镜像
   - CSP: upgrade-insecure-requests
   - 文章页标题自定义
   - 完善的多语言支持（多语言文字支持，多语言菜单支持，详情请见文档[i18n 支持指南](#i18n-支持指南)）
   - [Mermaid 明暗切换支持](#mermaid-明暗切换支持)
   - [设置内容仅在浅色/深色模式下显示](#设置内容仅在浅色深色模式下显示)
5. 更多功能等您来探索...

### 作者的碎碎语

如果你喜欢这个主题，就给项目点个 star 吧  
用爱发电，你的 star 和支持就是我更新的动力！

欢迎大家加入主题交流群  
如果你想支持我也可以进群交流，让我知道这个主题除了我自己还有人在用 :)

欢迎在此项目基础上 fork，如果你能给我提个 issue 就更好了，不论多么诡谲的需求我都会尝试添加的 \^\_\^

![preview](./screenshots/preview-1.png)

文档版本：`1.18.0`  
（如此处文档版本小于您正在使用的主题版本，说明您正在阅读一份过时的文档，请到[项目原地址](https://github.com/HowieHz/halo-theme-higan-hz/blob/main/README.md)阅读最新版本。）

### 目录

- [halo-theme-higan-hz](#halo-theme-higan-hz)
  - [说明](#说明)
    - [特色功能概要](#特色功能概要)
    - [作者的碎碎语](#作者的碎碎语)
    - [目录](#目录)
  - [i18n 支持指南](#i18n-支持指南)
    - [站点默认语言标识](#站点默认语言标识)
    - [修改文章页面语言标识](#修改文章页面语言标识)
    - [修改分类页面语言标识](#修改分类页面语言标识)
    - [修改标签页面语言标识](#修改标签页面语言标识)
    - [修改独立页面语言标识](#修改独立页面语言标识)
    - [修改页面固定文字（修改语言文件）](#修改页面固定文字修改语言文件)
    - [多语言菜单使用指南](#多语言菜单使用指南)
  - [相较于原始主题 最新开发版 的修改](#相较于原始主题-最新开发版-的修改)
    - [样式修复](#样式修复)
    - [不可配置的样式修改](#不可配置的样式修改)
    - [配置项修改](#配置项修改)
      - [增加于“全局”](#增加于全局)
      - [增加于“总体样式”](#增加于总体样式)
      - [增加于“首页样式”](#增加于首页样式)
      - [增加于“文章页样式”](#增加于文章页样式)
      - [添加于“分类集合页样式”](#添加于分类集合页样式)
      - [增加于“自定义页面样式”](#增加于自定义页面样式)
      - [增加于“瞬间页样式”](#增加于瞬间页样式)
      - [增加于“社交资料/RSS”](#增加于社交资料rss)
      - [增加于文章元数据](#增加于文章元数据)
      - [增加于分类元数据](#增加于分类元数据)
      - [增加于标签元数据](#增加于标签元数据)
      - [增加于页面元数据](#增加于页面元数据)
      - [调整于“总体样式”](#调整于总体样式)
      - [调整于“首页样式”](#调整于首页样式)
    - [杂项（对主题使用者大概无感的修改）](#杂项对主题使用者大概无感的修改)
      - [杂项于“总体样式”](#杂项于总体样式)
  - [已合并至上游的内容/上游也已修复的内容](#已合并至上游的内容上游也已修复的内容)
  - [原项目说明](#原项目说明)
  - [主题应用实例](#主题应用实例)
  - [如何获取主题包](#如何获取主题包)
    - [稳定版获取方法](#稳定版获取方法)
    - [最新开发版获取方法](#最新开发版获取方法)
  - [可选插件（主题使用者必看章节！）](#可选插件主题使用者必看章节)
    - [Mermaid 明暗切换支持](#mermaid-明暗切换支持)
      - [使用默认编辑器](#使用默认编辑器)
        - [示例](#示例)
        - [使用说明](#使用说明)
      - [使用 Vditor 编辑器](#使用-vditor-编辑器)
        - [示例](#示例-1)
        - [使用说明](#使用说明-1)
  - [设置内容仅在浅色/深色模式下显示](#设置内容仅在浅色深色模式下显示)
    - [使用默认编辑器](#使用默认编辑器-1)
    - [使用 Vditor 编辑器](#使用-vditor-编辑器-1)
  - [开发指南/贡献指南](#开发指南贡献指南)
  - [Lighthouse](#lighthouse)
  - [TODO](#todo)
  - [项目状态](#项目状态)
    - [Repobeats analytics](#repobeats-analytics)
    - [Star History](#star-history)

## i18n 支持指南

### 站点默认语言标识

修改“全局 - 默认页面语言”，详情请见[增加于“全局”](#增加于全局)

### 修改文章页面语言标识

详情请见 [增加于文章元数据](#增加于文章元数据)

### 修改分类页面语言标识

详情请见 [增加于分类元数据](#增加于分类元数据)

### 修改标签页面语言标识

详情请见 [增加于标签元数据](#增加于标签元数据)

### 修改独立页面语言标识

详情请见 [增加于页面元数据](#增加于页面元数据)

### 修改页面固定文字（修改语言文件）

请到 halo 主题目录（themes），找到 howiehz-higan 文件夹里的 i18n 文件夹，找到对应语言的 properties 文件，修改保存即可（如中文是 zh.properties）

### 多语言菜单使用指南

（注：按 f12 打开开发者控制台，上面选择控制台，输入 navigator.language 后回车即可查看你浏览器的 navigator.language 值）

启用“全局 - 多语言菜单支持”选项后，主菜单应设置形如以下形式（注：“zh_CN”项可选择自定义链接，链接为 /，名称为 zh_CN。其中名称为关键设置，其他不影响）

- zh_CN
  - 首页
  - 关于
- en_US
  - Home
  - About
- defalut
  - Home
  - About

启用“全局 - 多语言菜单前缀匹配模式”，启用此项将允许菜单名符合 navigator.language 值前缀即显示，而无需完全匹配。（注：开启了这项之后，下面的“zh”可匹配 zh_CN，zh_TW 等 navigator.language 值。）
以上菜单可改为：

- zh
  - 首页
  - 关于
- en
  - Home
  - About
- defalut
  - Home
  - About

“默认多语言菜单名称”默认值为 defalut，你也可以设定为如 zh_CN，但是要注意这里是**完全匹配菜单名**，即使开启了“多语言菜单前缀匹配模式”。
默认菜单将在没有菜单成功匹配的时候显示。

## 相较于原始主题 最新开发版 的修改

原主题最新版本为：[v2.9.0](https://github.com/guqing/halo-theme-higan/releases/tag/v2.9.0)  
而本主题修改基于最新开发版：[上游提交日志](https://github.com/guqing/halo-theme-higan/commits/main/)

### 样式修复

1. 移除导航栏文字前出现的空白 _[guqing/halo-theme-higan#113](https://github.com/guqing/halo-theme-higan/issues/113)_
2. 使用 PostCSS + Tailwind CSS + daisyUI 重构，修复上游标注在标签的 class 内但没有正常引入的样式，以及没有正常工作的样式。
3. 修复在文章页平板端模式下，回到顶部按钮未正常显示的问题
4. 修复在文章页平板端模式下，菜单不能随菜单按钮一起隐藏的问题
5. 修复在文章页桌面端模式下，隐藏的顶部导航栏依然会遮挡页面按钮的问题 _[#89](https://github.com/HowieHz/halo-theme-higan-hz/issues/89)_

### 不可配置的样式修改

> 如果添加的样式修改是可被配置的（如可修改，可关闭），则不会被列举在此处

1. 新增文章顶部分享栏分享方式：QQ 空间
2. 修改文章顶部分享栏 Twitter 的链接为 X
3. 友链页面允许用户在链接描述使用 HTML 代码块
4. 为非文章页移动端模式下，顶部导航栏的出现和消失添加了动画
5. 为文章页移动端模式下，底部导航栏（包括子菜单，其中的回到顶部按钮）的出现和消失添加了动画
6. 为文章页桌面端模式下，顶部导航栏（包括子菜单）的出现和消失添加了动画
7. 为文章页平板端模式下，顶部导航栏（包括子菜单）和右下角的回到顶部按钮出现和消失添加了动画

### 配置项修改

为方便查找，本主题将选项分类到多栏目下，而不是像原主题集中在一个“样式”栏下。  
现分类为“全局”，“总体样式”，“首页样式”，“文章页样式”，“分类集合页样式”，“自定义页面样式”，“瞬间页样式”，“RSS”，“社交资料”。

解释：“现主题设置项位置”（原主题设置项位置）-> 小括号内的为“现主题设置项位置”对应的“原主题设置项位置“。

例：在[增加于“总体样式”](#增加于总体样式)这一章节中有如下文字：

- “配色方案”（样式 - 配色方案）

其含义为“总体样式 - 配色方案”对应原主题“样式 - 配色方案”选项。

#### 增加于“全局”

1. 添加“默认页面语言”，允许指定站点默认的页面语言（HTML lang 属性）（如配置值为空，则设置为 "zh"）
2. 添加“多语言菜单支持”，允许用户定义多套菜单适用于不同语言。
   - 添加“多语言菜单前缀匹配模式”，启用此项将允许菜单名符合 navigator.language 值前缀即显示，而无需完全匹配。
   - 添加“默认多语言菜单名称”，可设定默认菜单。默认菜单将在没有菜单成功匹配的时候显示。
   - 此项使用教程请看 [多语言菜单使用指南](#多语言菜单使用指南)
3. 添加“CSP:upgrade-insecure-requests”选项，避免 HTTPS 协议网页引用 HTTP 资源时报错。相关文档：[CSP: upgrade-insecure-requests - HTTP | MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy/upgrade-insecure-requests)
4. 增加“仅允许使用指定域名访问”。使用场景：防止站点被恶意镜像后的流量流失
5. 增加“instant.page 支持”，自动加载 instant.page 脚本，以提升页面加载速度。

#### 增加于“总体样式”

1. “配色方案”（样式 - 配色方案）添加“跟随系统”选项
2. <a id="theme-switch-button-anchor"></a>可在大标题旁添加浅色/深色模式切换按钮（切换顺序 浅色模式 -> 深色模式 -> 自动模式 -> 浅色模式）
   - 点击图标后，将存储当前状态到本地（localStorage）
   - 优先读取本地 localStorage，如果没有保存过，就根据浏览器主题设置自动选择浅色模式/深色模式
   - 注：“自动模式配色方案”选择一种浅色方案即可禁用自动模式。
3. （启用“浅色/深色模式切换按钮”后显示）“自动模式配色方案”指定“浅色/深色模式切换按钮”切换到自动模式时的配色方案
4. （启用“浅色/深色模式切换按钮”后显示）“浅色模式配色方案”指定“浅色/深色模式切换按钮”切换到浅色模式时的配色方案
5. （启用“浅色/深色模式切换按钮”后显示）“深色模式配色方案”指定“浅色/深色模式切换按钮”切换到深色模式时的配色方案
6. 对于内容区域宽度给予更大的配置自由度
   （说明：原主题在之后的更新里更新了自适应最大宽度设置，内容区域最大宽度将随着屏幕宽度的变化而变化。但是在文字内容较少时（如主页），会显得内容显示位置偏左，因此“可自定义内容区域最大宽度”默认开启。
   如果你想使用上游的最大宽度设置模式，请关闭“总体样式 - 自定义内容区域最大宽度”这一项设置，并且推荐同时开启“内容区域最小宽度”，“自定义内容区域宽度属性”并保持默认值，可有效解决文字较少时内容显示偏左的问题）
   1. 可自定义内容区域最大宽度
      （默认值为 48rem。允许全部 CSS 长度单位，如：48rem, 780px, 70vw, 70%。宽度最大值设置较大时可能会出现内容整体偏左的现象。为解决这个问题，可同时开启“内容区域最小宽度”，“自定义内容区域宽度属性”并保持默认值。）
   2. 可自定义内容区域最小宽度
      （默认值为 48rem。允许全部 CSS 长度单位，如：48rem, 780px, 70vw, 70%。当此设置宽度小于窗口宽度时，主题会使用窗口宽度。以避免出现横向滚动条。）
      - 允许强制应用内容区域最小宽度
        （强制使内容显示区域不小于设定的最小宽度，即使出现横向滚动条。）
   3. 可自定义内容区域宽度属性
      （默认值为 fit-content。默认值效果为：使内容区域宽度=最宽的内容的宽度。（此项实际是在设置内容区域的 width 属性对应的样式值））
7. 允许关闭页眉头像
8. 允许关闭页眉菜单
9. 允许关闭页码
10. 允许关闭页面底部主题信息
11. 允许关闭页面底部版权信息
12. 允许设定是否强制页脚在页面最底部
13. 允许关闭页面底部菜单
14. 允许添加内容到页脚最底部
15. 允许在引用块前添加引号（引用块在 Markdown 中使用 > 表示）
16. 允许在引用块后添加引号（引用块在 Markdown 中使用 > 表示）

#### 增加于“首页样式”

1. 允许设定主页 HTML 标题，而不是取值于“Halo 设置 - 基本设置 - 站点标题”
2. 允许同时开启一言和个人简介
3. 允许用户修改/隐藏主页上的固定文本 _[guqing/halo-theme-higan#86](https://github.com/guqing/halo-theme-higan/issues/86)_

   - 中文默认值相较于原主题的变化
     - Find me on -> 与我联系（首页样式 - 社交资料图标左侧文字）
     - Writing -> 近期发布（首页样式 - 首页文章列表标题）
     - Read article -> 阅读全文（首页样式 - 多元列表跳转文章链接所用提示文字）
   - 注：目前版本设置此选项仅能控制开启或关闭
   - 现为支持 i18n，如想编辑此文字，请到 halo 主题目录（themes），找到 howiehz-higan 文件夹里的 i18n 文件夹，找到对应语言的 properties 文件，修改保存即可（如中文是 zh.properties）

4. 允许自由选择是否开关文章列表置顶图标，以及选择图标位置

#### 增加于“文章页样式”

1. 将“文章标题大写”（样式 - 文章标题大写）配置项移动到这一栏下
2. 允许选择是否启用文章与评论区间的分隔线
3. 允许选择是否启用文章评论区
4. 允许关闭移动端底部导航栏

#### 添加于“分类集合页样式”

1. 允许选择是否显示每个分类下的文章数量
2. 允许设置在“文章数量”左侧的字符
3. 允许设置在“文章数量”右侧的字符
4. 允许选择是否显示多层分类

#### 增加于“自定义页面样式”

1. 允许选择是否启用正文内容与评论区间的分隔线
2. 允许选择是否启用评论区

#### 增加于“瞬间页样式”

1. 允许选择是否启用点赞按钮
2. 允许选择是否启用评论区

#### 增加于“社交资料/RSS”

1. 允许设置多个重复的社交平台
2. 允许设置社交平台的排列顺序
3. 在原支持 RSS, Dribbble, Email, Facebook, Github, Instagram, QQ, Telegram, X, 微博的基础上  
   额外增加对 BiliBili, Reddit, Stack Overflow, YouTube, 豆瓣，网易云音乐，知乎的支持  
   注：没有简书和 CSDN(Copy, Steal and pay-Download Net) 的原因是平台过于小众，甚至 iconify 找不到它们的图标
   注：将“首页 RSS 展示”（社交资料-RSS）配置项移动到这一栏下，允许自定义 RSS 地址
4. 支持插入纯文本
5. 支持完全自定义资料（图标，链接，无障碍标签）

#### 增加于文章元数据

如何找到一篇文章元数据的设置位置：

- 方法一：进入后台管理页面 -> 找到文章管理页 -> 点击一篇文章右边的三个点 -> 弹出的上下文菜单中选择“设置” -> 拉到底部即可见元数据设置位
- 方法二：进入后台管理页面 -> 找到文章管理页 -> 进入一篇文章的编辑页 -> 点击右上角“发布”按钮左侧的“设置”按钮 -> 拉到底部即可见元数据设置位

1. 增加“页面标题”配置项，可设定此文章在浏览页的 HTML 标题（如配置值为空，则 HTML 标题取此文章的标题）
2. 添加“页面语言”配置项，可指定此文章的页面语言（HTML lang 属性）（如配置值为空，则取“全局 - 默认页面语言”的值）

#### 增加于分类元数据

如何找到一个分类元数据的设置位置：

- 进入后台管理页面 -> 找到文章管理页 -> 点击右上角的“分类”按钮 -> 此时已进入文章分类管理页（/console/posts/categories） -> 点击一个分类右边的三个点 -> 弹出的上下文菜单中选择“编辑” -> 拉到底部即可见元数据设置位

1. 增加“页面标题”配置项，可设定此分类在浏览页的 HTML 标题（如配置值为空，则 HTML 标题取此文章的标题）
2. 添加“页面语言”配置项，可指定此分类的页面语言（HTML lang 属性）（如配置值为空，则取“全局 - 默认页面语言”的值）

#### 增加于标签元数据

如何找到一个标签元数据的设置位置：

- 进入后台管理页面 -> 找到文章管理页 -> 点击右上角的“标签”按钮 -> 此时已进入文章标签管理页（/console/posts/tags） -> 点击一个标签右边的三个点 -> 弹出的上下文菜单中选择“编辑” -> 拉到底部即可见元数据设置位

1. 增加“页面标题”配置项，可设定此标签在浏览页的 HTML 标题（如配置值为空，则 HTML 标题取此文章的标题）
2. 添加“页面语言”配置项，可指定此标签的页面语言（HTML lang 属性）（如配置值为空，则取“全局 - 默认页面语言”的值）

#### 增加于页面元数据

如何找到一个页面元数据的设置位置：

- 方法一：进入后台管理页面 -> 找到页面管理页 -> 点击一个页面右边的三个点 -> 弹出的上下文菜单中选择“设置” -> 拉到底部即可见元数据设置位
- 方法二：进入后台管理页面 -> 找到页面管理页 -> 进入一个页面的编辑页 -> 点击右上角“发布”按钮左侧的“设置”按钮 -> 拉到底部即可见元数据设置位

1. 增加“页面标题”配置项，可设定此文章在浏览页的 HTML 标题（如配置值为空，则 HTML 标题取此文章的标题）
2. 添加“页面语言”配置项，可指定此文章的页面语言（HTML lang 属性）（如配置值为空，则取“全局 - 默认页面语言”的值）

#### 调整于“总体样式”

1. 配色方案（样式 - 配色方案）对应的配置名修改：
   - 暗黑 -> 暗色 - 绿
   - 白色 -> 浅色 - 绿
   - 亮色 -> 浅色 - 灰粉

#### 调整于“首页样式”

1. 个人简介（样式 - 个人简介）输入框高度修改：100px -> 150px

### 杂项（对主题使用者大概无感的修改）

1. 重构样式切换方式 (原来是 body 标签的 class 决定样式，现在是 html 标签的 theme 属性的值决定样式)
2. 修改项目内各种链接指向分叉后的项目链接，并修改元数据避免与原主题冲突
3. 清除无用样式，减小最终文件体积

#### 杂项于“总体样式”

1. 配色方案（样式 - 配色方案）对应的内部配置值修改，修改值详情请看 [v1.0.1](https://github.com/HowieHz/halo-theme-higan-hz/releases/tag/v1.0.1)

## 已合并至上游的内容/上游也已修复的内容

<details><summary>点我展开详情</summary>

1. 关闭未关闭的 `label`，使得 `prettier` 能正常格式化文件 _[guqing/halo-theme-higan#92](https://github.com/guqing/halo-theme-higan/pull/92)_
2. 修复原项目不可用的格式化脚本 (`package.json` 内的 `npm` 脚本) _[guqing/halo-theme-higan#91](https://github.com/guqing/halo-theme-higan/pull/91)_
3. 页面底部的版权信息进行了分行避免在小屏上排版错乱 _[guqing/halo-theme-higan#87](https://github.com/guqing/halo-theme-higan/issues/87)[#108](https://github.com/guqing/halo-theme-higan/pull/108)_
4. 补充了部分缺失的 `aria-label` 属性 _[guqing/halo-theme-higan#83](https://github.com/guqing/halo-theme-higan/issues/83)[#110](https://github.com/guqing/halo-theme-higan/pull/110)_
5. 修复行内代码渲染问题 _[guqing/halo-theme-higan#85](https://github.com/guqing/halo-theme-higan/issues/85)[#109](https://github.com/guqing/halo-theme-higan/pull/109)_
6. 修复错误的大纲定位样式 _[guqing/halo-theme-higan#69](https://github.com/guqing/halo-theme-higan/issues/69)[#112](https://github.com/guqing/halo-theme-higan/pull/112)_

</details>

## 原项目说明

该主题的原作者为 Pieter Robberechts，非常感谢做出这么优秀的主题。

原主题地址：[hexo-theme-cactus](https://github.com/probberechts/hexo-theme-cactus.git)

## 主题应用实例

[howiehz.top](https://howiehz.top)

## 如何获取主题包

### 稳定版获取方法

1. 到 [Release](https://github.com/HowieHz/halo-theme-higan-hz/releases) 下载最新版的“Source code (zip)”
2. 在 Console 端的主题菜单直接上传安装即可使用

Release v1.2.1 包括之后的版本已上架 halo 应用市场，直接到商店页面下载即可

- 市场链接：[应用：彼岸 - 皓改](https://www.halo.run/store/apps/app-homxf?tab=releases)

### 最新开发版获取方法

1. 点击项目主页 [HowieHz/halo-theme-higan-hz](https://github.com/HowieHz/halo-theme-higan-hz/tree/main) 绿色的“<> Code”按钮
2. 选择“Download ZIP”下载最新代码
3. 在 Console 端的主题菜单直接上传安装即可使用

## 可选插件（主题使用者必看章节！）

- 友链页面（/links），需插件 [plugin-links](https://github.com/halo-sigs/plugin-links)
- 图库页面（/photos），需插件 [plugin-photos](https://github.com/halo-sigs/plugin-photos)
- 瞬间页面（/moments），需插件 [plugin-moments](https://github.com/halo-sigs/plugin-moments)
  - 瞬间页面可用于展示 github 活动，此用法请看 [howiehz/ghu-events-moments](https://github.com/howiehz/ghu-events-moments) 或 [guqing/ghu-events-moments](https://github.com/guqing/ghu-events-moments)（兼容原主题数据类型）
- 评论功能，需插件 [plugin-comment-widget](https://github.com/halo-sigs/plugin-comment-widget/releases)
- 搜索功能，需插件 [plugin-search-widget](https://github.com/halo-sigs/plugin-search-widget/releases)
- 代码渲染，需插件：[plugin-highlightjs](https://github.com/halo-sigs/plugin-highlightjs)
- - 暗黑模式下，代码块高亮主题推荐选择“an-old-hope.min.css”
- 图片灯箱，需插件：[plugin-lightgallery](https://github.com/halo-sigs/plugin-lightgallery)

- - 页面匹配规则 推荐设置为

| 路径匹配       | 匹配区域                   |
| -------------- | -------------------------- |
| `/archives/**` | `article .content`         |
| `/moments`     | `article .content .medium` |
| `/moments/**`  | `article .content .medium` |

### Mermaid 明暗切换支持

#### 使用默认编辑器

##### 示例

<details><summary>点我展开示例 展示使用方法</summary>

本图原始作者为 [欧雷流](https://ourai.ws/)
授权 [HowieHz](https://howiehz.top/) 重绘

> 第一种方式（以下内容作为 HTML 代码块插入默认编辑器）

```
<div class="mermaid auto">
flowchart TD
A(("`**Open (Network)**`")) -->|组成部分| RSSHub{RSSHub}
A -->|组成部分| RSS3{RSS3}
A -->|组成部分| Crossbell{Crossbell}
Crossbell -->|构建应用| xLog([xLog])
Crossbell -->|构建应用| xSync([xSync])
Crossbell -->|构建应用| xLhar([xLhar])
Crossbell -->|构建应用| xFeed([xFeed])
RSSHub -->|构建应用| Follow([Follow])
xLog -->|经济系统| $CSB
xLog -->|经济系统| $MIRA
Follow -->|经济系统| $POWER
Crossbell -->|发 Token| $CSB{{$CSB}}
Crossbell -->|发 Token| $MIRA{{$MIRA}}
RSS3 -->|发 Token| $RSS3{{$RSS3}}
RSS3 -->|发 Token| $POWER{{$POWER}}
</div>
```

> 第二种方式（以下内容作为 HTML 代码块插入默认编辑器）

```
<div class="mermaid dark">
%%{init: { "theme": "dark" } }%%
flowchart TD
A(("`**Open (Network)**`")) -->|组成部分| RSSHub{RSSHub}
A -->|组成部分| RSS3{RSS3}
A -->|组成部分| Crossbell{Crossbell}
Crossbell -->|构建应用| xLog([xLog])
Crossbell -->|构建应用| xSync([xSync])
Crossbell -->|构建应用| xLhar([xLhar])
Crossbell -->|构建应用| xFeed([xFeed])
RSSHub -->|构建应用| Follow([Follow])
xLog -->|经济系统| $CSB
xLog -->|经济系统| $MIRA
Follow -->|经济系统| $POWER
Crossbell -->|发 Token| $CSB{{$CSB}}
Crossbell -->|发 Token| $MIRA{{$MIRA}}
RSS3 -->|发 Token| $RSS3{{$RSS3}}
RSS3 -->|发 Token| $POWER{{$POWER}}
</div>

<div class="mermaid light">
%%{init: { "theme": "light" } }%%
flowchart TD
A(("`**Open (Network)**`")) -->|组成部分| RSSHub{RSSHub}
A -->|组成部分| RSS3{RSS3}
A -->|组成部分| Crossbell{Crossbell}
Crossbell -->|构建应用| xLog([xLog])
Crossbell -->|构建应用| xSync([xSync])
Crossbell -->|构建应用| xLhar([xLhar])
Crossbell -->|构建应用| xFeed([xFeed])
RSSHub -->|构建应用| Follow([Follow])
xLog -->|经济系统| $CSB
xLog -->|经济系统| $MIRA
Follow -->|经济系统| $POWER
Crossbell -->|发 Token| $CSB{{$CSB}}
Crossbell -->|发 Token| $MIRA{{$MIRA}}
RSS3 -->|发 Token| $RSS3{{$RSS3}}
RSS3 -->|发 Token| $POWER{{$POWER}}
</div>
```

</details>

##### 使用说明

1. 需插件 [plugin-hybrid-edit-block](https://github.com/halo-sigs/plugin-hybrid-edit-block)
2. 进入主题配置，启用 `全局-Mermaid 支持`
3. 默认编辑器中输入 `/html` 选择插入 html 代码块

输入以下内容，将 `[[图表标题]]` 和 `[[图表正文]]` 换成你自己的内容，  
即可适配明暗切换

> 第一种方式：只写一遍，自动生成浅色/深色模式下两种图表

```
<div class="mermaid auto">
[[图表正文]]
</div>
```

> 第二种方式：手动管理浅色/深色模式下的图表

```
<div class="mermaid dark">
%%{init: { "theme": "dark" } }%%
[[图表正文]]
</div>

<div class="mermaid light">
%%{init: { "theme": "light" } }%%
[[图表正文]]
</div>
```

#### 使用 [Vditor 编辑器](https://github.com/justice2001/halo-plugin-vditor)

##### 示例

<details><summary>点我展开示例 展示使用方法</summary>

````markdown
本图原始作者为 [欧雷流](https://ourai.ws/)
授权 [HowieHz](https://howiehz.top/) 重绘

## 第一种方式

<div class="mermaid auto">
flowchart TD
A(("`**Open (Network)**`")) -->|组成部分| RSSHub{RSSHub}
A -->|组成部分| RSS3{RSS3}
A -->|组成部分| Crossbell{Crossbell}
Crossbell -->|构建应用| xLog([xLog])
Crossbell -->|构建应用| xSync([xSync])
Crossbell -->|构建应用| xLhar([xLhar])
Crossbell -->|构建应用| xFeed([xFeed])
RSSHub -->|构建应用| Follow([Follow])
xLog -->|经济系统| $CSB
xLog -->|经济系统| $MIRA
Follow -->|经济系统| $POWER
Crossbell -->|发 Token| $CSB{{$CSB}}
Crossbell -->|发 Token| $MIRA{{$MIRA}}
RSS3 -->|发 Token| $RSS3{{$RSS3}}
RSS3 -->|发 Token| $POWER{{$POWER}}
</div>

## 第二种方式

<div class="mermaid auto">

```mermaid
flowchart TD
A(("`**Open (Network)**`")) -->|组成部分 | RSSHub{RSSHub}
A -->|组成部分 | RSS3{RSS3}
A -->|组成部分 | Crossbell{Crossbell}
Crossbell -->|构建应用 | xLog([xLog])
Crossbell -->|构建应用 | xSync([xSync])
Crossbell -->|构建应用 | xLhar([xLhar])
Crossbell -->|构建应用 | xFeed([xFeed])
RSSHub -->|构建应用 | Follow([Follow])
xLog -->|经济系统 | $CSB
xLog -->|经济系统 | $MIRA
Follow -->|经济系统 | $POWER
Crossbell -->|发 Token| $CSB{{$CSB}}
Crossbell -->|发 Token| $MIRA{{$MIRA}}
RSS3 -->|发 Token| $RSS3{{$RSS3}}
RSS3 -->|发 Token| $POWER{{$POWER}}
```

</div>

## 第三种方式

<div class="light">

```mermaid
---
title: The Open(RSS3) Universe
---
%%{init: { "theme": "light" } }%%
flowchart TD
A(("`**Open (Network)**`")) -->|组成部分 | RSSHub{RSSHub}
A -->|组成部分 | RSS3{RSS3}
A -->|组成部分 | Crossbell{Crossbell}
Crossbell -->|构建应用 | xLog([xLog])
Crossbell -->|构建应用 | xSync([xSync])
Crossbell -->|构建应用 | xLhar([xLhar])
Crossbell -->|构建应用 | xFeed([xFeed])
RSSHub -->|构建应用 | Follow([Follow])
xLog -->|经济系统 | $CSB
xLog -->|经济系统 | $MIRA
Follow -->|经济系统 | $POWER
Crossbell -->|发 Token| $CSB{{$CSB}}
Crossbell -->|发 Token| $MIRA{{$MIRA}}
RSS3 -->|发 Token| $RSS3{{$RSS3}}
RSS3 -->|发 Token| $POWER{{$POWER}}
```

</div>

<div class="dark">

```mermaid
---
title: The Open(RSS3) Universe
---
%%{init: { "theme": "dark" } }%%
flowchart TD
A(("`**Open (Network)**`")) -->|组成部分 | RSSHub{RSSHub}
A -->|组成部分 | RSS3{RSS3}
A -->|组成部分 | Crossbell{Crossbell}
Crossbell -->|构建应用 | xLog([xLog])
Crossbell -->|构建应用 | xSync([xSync])
Crossbell -->|构建应用 | xLhar([xLhar])
Crossbell -->|构建应用 | xFeed([xFeed])
RSSHub -->|构建应用 | Follow([Follow])
xLog -->|经济系统 | $CSB
xLog -->|经济系统 | $MIRA
Follow -->|经济系统 | $POWER
Crossbell -->|发 Token| $CSB{{$CSB}}
Crossbell -->|发 Token| $MIRA{{$MIRA}}
RSS3 -->|发 Token| $RSS3{{$RSS3}}
RSS3 -->|发 Token| $POWER{{$POWER}}
```

</div>
````

</details>

##### 使用说明

输入以下内容，将 `[[图表标题]]` 和 `[[图表正文]]` 换成你自己的内容，  
即可适配明暗切换。  
注意：下列模板中出现的空行不可省略，没出现空行的也不能多添加空行。建议使用分屏预览模式编辑。

> 第一种方式：只写一遍，自动生成浅色/深色模式下两种图表
> 此方式需要进入主题配置，启用 `全局-Mermaid 支持`
> 缺点：不兼容 Vditor 编辑器的实时预览

```
<div class="mermaid auto">
[[图表正文]]
</div>
```

> 第二种方式：只写一遍，自动生成浅色/深色模式下两种图表
> 此方式需要进入主题配置，启用 `全局-Mermaid 支持`
> 此方式原理：由于主题的 Mermaid 初始化先加载，可在 Vditor 自带的 Mermaid 渲染前抢先渲染生成
> 缺点：一张图会多被渲染一遍（被 Vditor 自带的 Mermaid 多渲染一遍）
> 优点：兼容 Vditor 编辑器的实时预览

````
<div class="mermaid auto">

```mermaid
[[图表正文]]
```

</div>
````

> 第三种方式：手动管理浅色/深色模式下的图表
> 缺点：同样内容要复制粘贴一遍。由于是完全使用 Vditor 自带的渲染，所以主题设置中有关 Mermaid 的设置会失效。会继承上游的 bug，如 [mermaid-js/mermaid@5741](https://github.com/mermaid-js/mermaid/issues/5741)。
> 优点：兼容 Vditor 编辑器的实时预览，兼容性最好。完全使用 Vditor 自带的渲染，和预览表现一致。

````
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

## 设置内容仅在浅色/深色模式下显示

### 使用默认编辑器

1. 需插件 [plugin-hybrid-edit-block](https://github.com/halo-sigs/plugin-hybrid-edit-block)
2. 默认编辑器中输入 `/html` 选择插入 html 代码块

输入以下内容，将 `[[浅色模式内容]]` 和 `[[深色模式内容]]` 换成你自己的内容，
即可适配明暗切换

```
<div class="dark">

[[深色模式内容]]

</div>

<div class="light">

[[浅色模式内容]]

</div>
```

### 使用 [Vditor 编辑器](https://github.com/justice2001/halo-plugin-vditor)

输入以下内容，将 `[[浅色模式内容]]` 和 `[[深色模式内容]]` 换成你自己的内容，
即可适配明暗切换

```
<div class="dark">

[[深色模式内容]]

</div>

<div class="light">

[[浅色模式内容]]

</div>
```

## 开发指南/贡献指南

见 [CONTRIBUTING](./CONTRIBUTING)

## Lighthouse

![Lighthouse-result-2024-04-15-post](./screenshots/Lighthouse-result-2024-04-15-post.png)

## TODO

见 [项目 Issue 页面](https://github.com/HowieHz/halo-theme-higan-hz/issues)  
注：社区意愿较大的 Issue 会列为优先项。如果你对某功能有需求，请一定要在对应 Issue 下回复，或进入我的博客通过其他联系方式联系我，谢谢！

## 项目状态

### Repobeats analytics

![Alt](https://repobeats.axiom.co/api/embed/b02231ee758d8477f8fdb3b166fcf0488cbe7377.svg "Repobeats analytics image")

### Star History

[![Star History Chart](https://api.star-history.com/svg?repos=HowieHz/halo-theme-higan-hz&type=Date)](https://star-history.com/#HowieHz/halo-theme-higan-hz&Date)
