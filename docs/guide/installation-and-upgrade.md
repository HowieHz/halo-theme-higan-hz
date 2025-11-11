---
outline: deep
---

# 安装与升级

## 如何下载并安装主题

### 快速安装

如果你启用了应用市场插件，可以直接前往 `/console/app-store` 路径打开应用市场。搜索 `Higan Haozi` 并点击安装按钮，即可完成主题安装。

### 稳定版获取方法

从 `v1.2.1` 版本开始，本主题已上架 Halo 应用市场，到应用市场即可获取：

- 市场链接：[Higan Haozi](https://www.halo.run/store/apps/app-homxf)

你也可以在 GitHub 发布页获取主题包：

1. 到 [Release](https://github.com/HowieHz/halo-theme-higan-hz/releases)，找到 `Assets`，根据[文件分发说明](#文件分发说明)选择你所需语言的主题压缩包。
2. 在 Halo CMS 后台 `/console/theme` 路径下，点击右上角“主题管理”按钮。在弹出的主题管理页面，选择顶栏的“上传安装/升级”，然后拖拽主题压缩包到中间（或者点击蓝字后选择主题压缩包上传），即可成功安装。

### 最新开发版获取方法

1. 前往[自动构建页](https://github.com/HowieHz/halo-theme-higan-hz/actions/workflows/build.yml)，找到最新的构建任务并下载 `theme-artifact`。
2. **解压**下载的压缩包，根据[文件分发说明](#文件分发说明)选择你所需语言的主题压缩包。
3. 在 Halo CMS 后台 `/console/theme` 路径下，点击右上角“主题管理”按钮。在弹出的主题管理页面，选择顶栏的“上传安装/升级”，然后拖拽主题压缩包到中间（或者点击蓝字后选择主题压缩包上传），即可成功安装。

## 如何升级主题

### 简易更新方法

当[Halo 应用市场](https://www.halo.run/store/apps)更新发布新版本时，在 Halo CMS 后台 `/console/theme` 路径下会出现升级按钮，点击升级即可。

::: warning

由于 Halo 应用市场限制，默认更新为第一构建产物，如果您使用的主题包并非 `howiehz-higan-cn.zip`（即简体中文配置文件版本），请前往[市场](https://www.halo.run/store/apps/app-homxf/releases)选择所需版本手动安装。

:::

### 复杂更新方法

重复[如何下载并安装主题](#如何下载并安装主题)，即可升级。

## 文件分发说明

- `howiehz-higan-cn.zip` 为简体中文配置文件版本。
- `howiehz-higan-en.zip` 为英文配置文件版本。
