---
title: 快速开始
outline: deep
---

# 快速开始

欢迎使用 **higan-hz**，这是一款面向 Halo 2.19+ 的高可配置主题。本文将帮助你完成主题安装、启用以及基础校验，并给出升级与本地开发的建议流程。

## 环境要求

- **Halo**：2.19 或更高版本。建议始终使用官方最新的 2.x 稳定版。
- **浏览器兼容性**：主题默认目标浏览器为 `defaults`、Safari ≥ 16.4、Chrome ≥ 111、Firefox ≥ 128。
- **可选（本地构建）**：Node.js ≥ 18 与 pnpm ≥ 9。如果你只在后台上传 zip 包，可以忽略这一项。

## 获取主题包

你可以从稳定渠道或构建产物中获取主题包，根据需求二选一即可。

### 稳定版（推荐）

1. 访问 [GitHub Releases](https://github.com/HowieHz/halo-theme-higan-hz/releases)。
2. 下载最新版本的 `Source code (zip)`，或直接前往 [Halo 应用市场](https://www.halo.run/store/apps/app-homxf?tab=releases) 获取资源包。
3. 解压后根据语言选择合适的压缩包，如 `howiehz-higan-cn.zip` / `howiehz-higan-en.zip`。

### 最新开发版

如果需要体验最新特性，可从 CI 构建获取：

1. 打开 [Build CI](https://github.com/HowieHz/halo-theme-higan-hz/actions/workflows/build.yml)。
2. 在最新一次成功的构建中下载 `theme-artifact`。
3. 解压并挑选目标语言的主题压缩包。

## 在 Halo 中安装

1. 登录 Halo 后台 `Console → 外观 → 主题`。
2. 点击右上角的 **上传主题**。
3. 选择上一步获取的主题压缩包并上传。
4. 上传完成后点击“启用”即可。

> 初次启用建议刷新前台页面并打开浏览器开发者工具 (F12)，确保不存在 404 / CSP 报错。如果你启用了 `仅允许使用指定域名访问` 等安全选项，更需要确认资源是否正常加载。

## 启用后建议操作清单

- **检查语言设置**：在“全局 → 默认页面语言”确认默认语言与站点一致。
- **配置导航菜单**：若需要多语言菜单，请同时开启“多语言菜单支持”并按照文档指引配置菜单树。
- **设置站点统计与页脚信息**：依据品牌需求调整“总体样式”下的页脚与统计项。
- **验证首页布局**：在“首页样式”中选择合适的列表风格，并确认首页展示无异常。
- **启用必要插件**：参考[可选插件列表](../guide/advanced.md#插件适配)，安装评论、搜索、瞬间、相册等插件以获得最佳体验。

## 升级主题

升级时建议执行以下步骤：

1. **备份当前主题与设置**：在 Halo 后台导出当前主题配置，或将 `data/templates/themes/howiehz-higan` 目录备份到安全位置。
2. **下载新版本**：按照“获取主题包”步骤获取目标版本。
3. **上传并覆盖**：在 Halo 后台重新上传主题压缩包。Halo 会保留你的配置项，但新增选项默认使用主题作者的默认值。
4. **执行回归检查**：重点检查首页、文章页、分类/标签页、插件页面（links/photos/moments）以及所有自定义组件是否正常。若使用了浏览器缓存策略，别忘记强制刷新 (`Ctrl+F5`)。

> 如果升级后出现样式错乱，可以尝试清空 `browser` 与 `reverse proxy` 缓存，并重新保存主题设置以刷新生成的静态资源。

## 卸载与回滚

- 若需回滚旧版本，可重新上传旧版主题包覆盖，或直接在后台切换到其他主题。
- 若 Halo 已经加载了新的配色/字体资源，务必同步恢复相关设置以免遗留无用文件。

## 本地开发与调试

当你需要二次开发或者调试主题脚本时，可按以下步骤在本地构建：

```bash
# 克隆仓库
git clone https://github.com/HowieHz/halo-theme-higan-hz.git
cd halo-theme-higan-hz

# 安装依赖
pnpm install

# 开发模式（并行监听 stylus、postcss、vite 构建）
pnpm dev

# 或者单独预览文档站
pnpm docs:dev
```

> Windows 下 `pnpm build` 会自动设置 `NODE_ENV=777`，该值仅用于主题打包流程，不影响实际运行。

本地开发完成后，运行 `pnpm build` 即可在仓库根目录生成 `dist` 目录，Halo 可以直接上传该目录中的成品压缩包。

## 反馈渠道

- 问题反馈：在 [GitHub Issues](https://github.com/HowieHz/halo-theme-higan-hz/issues) 创建 Issue。
- 主题交流群：QQ 群 `694413711`。
- 作者博客：[howiehz.top](https://howiehz.top)。

如需深入了解各项配置，请继续阅读下一篇《[配置总览](./configuration-overview.md)》。
