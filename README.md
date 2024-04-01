# halo-theme-higan-hz

![GitHub](https://img.shields.io/github/license/HowieHz/halo-theme-higan-hz)
![GitHub all releases](https://img.shields.io/github/downloads/HowieHz/halo-theme-higan-hz/total)
![GitHub release (latest by date)](https://img.shields.io/github/downloads/HowieHz/halo-theme-higan-hz/latest/total)
![GitHub repo size](https://img.shields.io/github/repo-size/HowieHz/halo-theme-higan-hz)

## 说明

该主题是 guqing 的 [halo-theme-higan](https://github.com/guqing/halo-theme-higan) 进行了个人的定制化修改后的主题

### 相较于原始主题的修改

1. 页面底部的 `Theme is higan Powered by Halo © 2024 sitename` 进行了分行避免在小屏上排版错乱 [guqing/halo-theme-higan#87](https://github.com/guqing/halo-theme-higan/issues/87)
2. 对于主页上的一些固定文字进行了修改 [guqing/halo-theme-higan#86](https://github.com/guqing/halo-theme-higan/issues/86)
    - `Writing` -> `近期发布`
    - `Read article` -> `阅读全文`
    - `Find me on` -> `与我联系`
3. 补充了部分缺失的aria-label属性 [guqing/halo-theme-higan#83](https://github.com/guqing/halo-theme-higan/issues/83)
4. 添加了使用多元列表模式时，置顶文章在首页列表的标识（图标与简洁列表模式一致）
5. 修改html标签lang属性值，`lang='en'`改为`lang='zh'`

以及修改原项目链接指向fork后的项目链接，修改元数据避免与原主题冲突

## 原项目说明

该主题的原作者为 Pieter Robberechts，非常感谢做出这么优秀的主题。

原主题地址：[hexo-theme-cactus](https://github.com/probberechts/hexo-theme-cactus.git)

全局搜索功能需要先安装插件: [plugin-search-widget](https://github.com/halo-sigs/plugin-search-widget)

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

1. 点击项目主页[HowieHz/halo-theme-higan-hz](https://github.com/HowieHz/halo-theme-higan-hz/tree/main)绿色的`<> Code`按钮
2. 选择`Download ZIP`下载最新代码
3. 在 Console 端的主题菜单直接上传安装即可使用

2.0 版本去掉了代码高亮和内容页图片点击放大预览功能，可以通过安装以下两个插件来实现：

代码块高亮插件: [plugin-highlightjs](https://github.com/halo-sigs/plugin-highlightjs)

- 暗黑模式下，代码块高亮主题推荐选择`an-old-hope.min.css`  

图片点击放大预览功能: [plugin-lightgallery](https://github.com/halo-sigs/plugin-lightgallery)

页面匹配规则 推荐设置为

| 路径匹配       | 匹配区域                   |
| -------------- | -------------------------- |
| `/archives/**` | `article .content`         |
| `/moments`     | `article .content .medium` |
| `/moments/**`  | `article .content .medium` |

## 进行此项目的开发

> 对前端开发没什么经验，是一晚上摸索出来的，可能有误

首先确保你的开发环境中安装好了`pnpm`
在项目根目录运行`pnpm install`完成依赖的安装

vscode打开资源管理器页面，找到右边三个点
勾选其中`NPM 脚本`
每次开发后进行`lint`检查，`prettier`格式化代码，`build`构建样式之后再提交

## 迁移

适用于 Halo 1.x 版本的主题位于分支 [halo-theme-higan 1.x](https://github.com/HowieHz/halo-theme-higan-hz/tree/1.x)

当前 main 分支适用于 Halo 2.0 版本

## 项目状态

![Alt](https://repobeats.axiom.co/api/embed/b02231ee758d8477f8fdb3b166fcf0488cbe7377.svg "Repobeats analytics image")

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=HowieHz/halo-theme-higan-hz&type=Date)](https://star-history.com/#HowieHz/halo-theme-higan-hz&Date)
