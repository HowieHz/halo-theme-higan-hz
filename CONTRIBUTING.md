# 贡献指南

## 项目结构

- [模板文件与访问路径映射](https://howiehz.top/halo-theme-higan-haozi/reference/template-map)

## 版本适用说明

当前 main 分支适用于 Halo 2.x 版本

## 开发指南

首先请确保你的编辑器支持 EditorConfig，这保证了项目代码格式的统一。

### 部署开发环境

#### 安装 pnpm

需要提前[安装 Node.js](https://nodejs.org/zh-cn/download/package-manager)，然后运行以下指令安装 pnpm

```bash
npm install -g pnpm
```

### 开发前准备

#### 下载项目源码，并进入到项目根目录

```bash
git clone https://github.com/HowieHz/halo-theme-higan-hz && cd halo-theme-higan-hz/
```

#### 安装项目依赖

之后在项目根目录运行以下指令完成依赖的安装

```bash
pnpm install
```

### 开发主题

开发时在项目根目录运行以下指令可实时渲染修改。

```bash
pnpm dev
```

此时会在 `tmp/` 目录输出未压缩的样式文件，便于追踪问题。

#### 开发之后

##### 求疵

开发完成后请运行以下的指令进行检查（请确保无 error）。

```bash
pnpm lint
```

##### 格式化代码

提交前你可以运行以下的指令以格式化代码。

```bash
pnpm format
```

##### 构建主题

你可以运行以下的指令构建主题。

```bash
pnpm build
```

### CI 检查

本项目在 CI（GitHub Actions）对每个 PR 会运行一组质量检查：

- Linters (`pnpm lint`)：
  - `oxlint` + `eslint`: 代码风格与类型感知检查
    - 范围：
      - JavaScript 文件
      - TypeScript 文件
      - Vue 文件（内联 `script` 块）
  - `stylelint`: 样式表检查
    - 范围：
      - CSS 文件
      - Vue 文件（内联 `style` 块）
      - HTML 文件（内联 `style` 块）
  - `markdownlint`: 文档样式检查
    - 范围：
      - Markdown 文件
  - `autocorrect`: 自动文案校正
    - 范围：
      - 其[支持的文件格式](https://github.com/huacnlee/autocorrect/tree/main/autocorrect/grammar)
  - `tsgo --noEmit`: TypeScript 类型检查
    - 范围：
      - TypeScript 文件
  - 注：均开启了自动修正，如有变更会自动提交。

- 格式化 (`pnpm format`)：
  - `stylus-supremacy`: Stylus 格式化
    - 范围：
      - Stylus 文件
  - `prettier`: 格式化
    - 范围:
      - JSON 文件
      - JSONC 文件
      - YAML 文件
      - Markdown 文件
      - CSS 文件
      - JavaScript 文件
      - TypeScript 文件
      - Vue 文件
      - HTML 文件
  - 注：格式化后有变更会自动提交。

- Lighthouse CI：
  - 检查页面评分，并输出报告。（需全部满分）
  - 与基线版本进行页面资源体积差异检查，并输出报告。

- 页面视觉差异检查（Visual Regression）：
  - 通过 Playwright 在桌面、平板、手机三种设备视图（Viewport）下，使用 Chromium, Firefox, WebKit 内核对关键页面截图。最后使用 Argos CI 与基线版本进行比较。（为节省额度，现仅上传 Chromium 生成的截图进行比较）

### 编写文档

开发时在项目根目录运行以下指令可启动服务器，用以实时渲染修改。

```bash
pnpm docs:dev
```

以下指令将在 `docs/.vitepress/dist` 目录构建成品。

```bash
pnpm docs:build
```

使用以下指令可启用服务器，用于预览成品。

```bash
pnpm docs:preview
```

<!-- #### 目前所用的图标库

[vite-plugin-purge-icons](https://github.com/antfu/purge-icons/blob/main/packages/vite-plugin-purge-icons/README.md) -->

<!-- #### 打包主题

```bash
pnpm release
``` -->

### 其他指令

检查项目依赖是否过时

```bash
pnpm -r outdated
```
