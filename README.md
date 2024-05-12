# halo-theme-higan-hz

![GitHub](https://img.shields.io/github/license/HowieHz/halo-theme-higan-hz)
![GitHub all releases](https://img.shields.io/github/downloads/HowieHz/halo-theme-higan-hz/total)
![GitHub release (latest by date)](https://img.shields.io/github/downloads/HowieHz/halo-theme-higan-hz/latest/total)
![GitHub repo size](https://img.shields.io/github/repo-size/HowieHz/halo-theme-higan-hz)

## 说明

该主题是 guqing 的 [halo-theme-higan](https://github.com/guqing/halo-theme-higan) 进行了定制化修改后的主题

> 更激进的修改，更高的配置自由度！

### 目录

- [halo-theme-higan-hz](#halo-theme-higan-hz)
  - [说明](#说明)
    - [目录](#目录)
  - [相较于原始主题的修改](#相较于原始主题的修改)
    - [样式修复](#样式修复)
    - [样式修改](#样式修改)
    - [配置项修改](#配置项修改)
      - [增加于`总体样式`](#增加于总体样式)
      - [增加于`首页样式`](#增加于首页样式)
      - [增加于 `RSS`](#增加于-rss)
      - [增加于 `社交资料`](#增加于-社交资料)
      - [调整于`总体样式`](#调整于总体样式)
      - [调整于`首页样式`](#调整于首页样式)
    - [杂项](#杂项)
      - [杂项于`总体样式`](#杂项于总体样式)
  - [已合并至上游的内容/上游也已修复的内容](#已合并至上游的内容上游也已修复的内容)
  - [原项目说明](#原项目说明)
  - [预览截图](#预览截图)
  - [主题应用实例](#主题应用实例)
  - [使用方法](#使用方法)
    - [可选插件](#可选插件)
  - [进行此项目的开发](#进行此项目的开发)
    - [开发前准备](#开发前准备)
      - [安装pnpm](#安装pnpm)
      - [安装项目依赖](#安装项目依赖)
    - [开发主题](#开发主题)
    - [开发之后](#开发之后)
      - [求疵](#求疵)
      - [格式化代码](#格式化代码)
      - [构建主题](#构建主题)
  - [版本适用说明](#版本适用说明)
  - [Lighthouse](#lighthouse)
  - [项目状态](#项目状态)
  - [Star History](#star-history)

## 相较于原始主题的修改

### 样式修复

1. 修复错误的大纲定位样式 *[guqing/halo-theme-higan#69](https://github.com/guqing/halo-theme-higan/issues/69)*

### 样式修改

1. 添加了使用多元列表模式时，置顶文章在首页列表的标识（图标与简洁列表模式一致）
2. 新增文章顶部分享栏分享方式: qqzone
3. 修改主页上的一些固定文字 *[guqing/halo-theme-higan#86](https://github.com/guqing/halo-theme-higan/issues/86)*
    - `Writing` -> `近期发布`
    - `Read article` -> `阅读全文`
    - `Find me on` -> `与我联系`
4. 修改文章顶部分享栏 Twitter 的链接为 X
5. 友链页面允许用户在链接描述使用 html 代码块

### 配置项修改

将选项分类到多栏目下，而不是集中在一个`样式`栏下
现分类为`总体样式`，`首页样式`，`文章页样式`，`RSS`，`社交资料`（请以实际为准）
说明：`现主题设置项位置`（`原主题设置项位置`）-> 小括号内的为`现主题设置项位置`对应的`原主题设置项位置`

#### 增加于`总体样式`

1. `配色方案`（`样式-配色方案`）添加`跟随系统`
2. 添加 `内容区域最大宽度`, 默认值为`48rem`

#### 增加于`首页样式`

1. `首页样式`（`样式`）允许同时开启一言和个人简介
2. 允许用户自由选择是否开关文章列表置顶图标，以及选择图标位置

#### 增加于 `RSS`

1. 允许自定义 RSS 地址

#### 增加于 `社交资料`

1. 现允许用户设置多个重复的社交平台
2. 现允许用户设置社交平台的排列顺序
3. 现在原支持 Dribbble, Email, Facebook, Github, Instagram, QQ, Telegram, X, 微博的基础上
  额外增加对 BiliBili, Reddit, Stack Overflow, YouTube, 豆瓣, 网易云音乐, 知乎的支持
  没有简书和 CSDN(Copy, Steal and pay-Download Net) 的原因是 iconify 找不到它们的图标

#### 调整于`总体样式`

1. `配色方案`（`样式-配色方案`）对应的配置名修改: `暗黑` -> `暗色`, `白色` -> `亮色`, `亮色` -> `灰粉`

#### 调整于`首页样式`

1. `个人简介`（`样式-个人简介`）输入框高度修改: `100px` -> `150px`

### 杂项

1. 修改html标签lang属性值，`lang='en'` 改为 `lang='zh'`
2. 重构样式切换方式 (原来是 `body` 标签的 `class` 决定样式，现在是 `body` 标签的 `theme` 属性的值决定样式)
3. 修改原项目内各种链接指向 `fork` 后的项目链接，并修改元数据避免与原主题冲突

#### 杂项于`总体样式`

1. `配色方案`（`样式-配色方案`）对应的配置值修改，修改值详情请看 [v1.0.1](https://github.com/HowieHz/halo-theme-higan-hz/releases/tag/v1.0.1)

## 已合并至上游的内容/上游也已修复的内容

1. 关闭未关闭的 `label`，使得 `prettier` 能正常格式化文件 *[guqing/halo-theme-higan#92](https://github.com/guqing/halo-theme-higan/pull/92)*
2. 修复原项目不可用的格式化脚本 (`package.json` 内的 `npm` 脚本) *[guqing/halo-theme-higan#91](https://github.com/guqing/halo-theme-higan/pull/91)*
3. 页面底部的版权信息进行了分行避免在小屏上排版错乱 *[guqing/halo-theme-higan#87](https://github.com/guqing/halo-theme-higan/issues/87)[#108](https://github.com/guqing/halo-theme-higan/pull/108)*
4. 补充了部分缺失的 `aria-label` 属性 *[guqing/halo-theme-higan#83](https://github.com/guqing/halo-theme-higan/issues/83)[#110](https://github.com/guqing/halo-theme-higan/pull/110)*
5. 修复行内代码渲染问题 *[guqing/halo-theme-higan#85](https://github.com/guqing/halo-theme-higan/issues/85)[#109](https://github.com/guqing/halo-theme-higan/pull/109)*

## 原项目说明

该主题的原作者为 Pieter Robberechts，非常感谢做出这么优秀的主题。

原主题地址：[hexo-theme-cactus](https://github.com/probberechts/hexo-theme-cactus.git)

## 预览截图

待添加...

## 主题应用实例

[howiehz.top](https://howiehz.top)

## 使用方法

Release版本获取方法:

1. 到 [Release](https://github.com/HowieHz/halo-theme-higan-hz/releases) 下载最新版的 `Source code
(zip)`
2. 在 Console 端的主题菜单直接上传安装即可使用

最新开发版本获取方法:

1. 点击项目主页 [HowieHz/halo-theme-higan-hz](https://github.com/HowieHz/halo-theme-higan-hz/tree/main) 绿色的`<> Code`按钮
2. 选择`Download ZIP`下载最新代码
3. 在 Console 端的主题菜单直接上传安装即可使用

### 可选插件

- 友链页面（/links），需插件 [plugin-links](https://github.com/halo-sigs/plugin-links)
- 图库页面（/photos），需插件 [plugin-photos](https://github.com/halo-sigs/plugin-photos)
- 瞬间页面（/moments），需插件 [plugin-moments](https://github.com/halo-sigs/plugin-moments)
- 评论功能，需插件 [plugin-comment-widget](https://github.com/halo-sigs/plugin-comment-widget/releases)
- 搜索功能，需插件 [plugin-search-widget](https://github.com/halo-sigs/plugin-search-widget/releases)
- 代码渲染，需插件: [plugin-highlightjs](https://github.com/halo-sigs/plugin-highlightjs)
- - 暗黑模式下，代码块高亮主题推荐选择`an-old-hope.min.css`  
- 图片灯箱，需插件: [plugin-lightgallery](https://github.com/halo-sigs/plugin-lightgallery)

- - 页面匹配规则 推荐设置为

| 路径匹配       | 匹配区域                   |
| -------------- | -------------------------- |
| `/archives/**` | `article .content`         |
| `/moments`     | `article .content .medium` |
| `/moments/**`  | `article .content .medium` |

## 进行此项目的开发

首先请确保你的编辑器支持`EditorConfig`

### 开发前准备

#### 安装pnpm

需要提前安装 `Node.js`，然后运行以下指令安装 `pnpm`

```bash
npm install -g pnpm
```

#### 安装项目依赖

之后在项目根目录运行以下指令完成依赖的安装

```bash
pnpm install
```

### 开发主题

开发时在项目根目录运行运行以下指令可实时渲染修改

```bash
pnpm dev
```

### 开发之后

#### 求疵

开发完成后请运行以下的指令进行检查（请确保无 error）

```bash
pnpm lint
```

#### 格式化代码

提交前请运行以下的指令的指令格式化代码

```bash
pnpm prettier
```

#### 构建主题

最后在提交前请不要忘记运行以下的指令构建主题

```bash
pnpm build
```

<!-- #### 打包主题

```bash
pnpm release
``` -->

## 版本适用说明

当前 main 分支适用于 Halo 2.0 版本

适用于 Halo 1.x 版本的主题位于分支 [halo-theme-higan 1.x](https://github.com/HowieHz/halo-theme-higan-hz/tree/1.x)

## Lighthouse

![Lighthouse-result-2024-04-15-post](./screenshots/Lighthouse-result-2024-04-15-post.png)

## 项目状态

![Alt](https://repobeats.axiom.co/api/embed/b02231ee758d8477f8fdb3b166fcf0488cbe7377.svg "Repobeats analytics image")

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=HowieHz/halo-theme-higan-hz&type=Date)](https://star-history.com/#HowieHz/halo-theme-higan-hz&Date)
