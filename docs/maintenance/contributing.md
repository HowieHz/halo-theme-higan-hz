# 贡献指南

## 项目结构

- [模板文件与访问路径映射](../reference/template-map.md)

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
pnpm fmt
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
      - HTML 文件（仅内联 `script` 块）
      - Vue 文件（包括内联 `script` 块）
  - `stylelint`: 样式表检查
    - 范围：
      - CSS 文件
      - HTML 文件（仅内联 `style` 块）
      - Vue 文件（仅内联 `style` 块）
    - 备注：Stylelint 比较特殊，`**/*.{css,html,vue}` 不会进入 `.` 开头的文件夹，所以需要写额外的路径匹配。
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

- 格式化 (`pnpm fmt`)：
  - `stylus-supremacy`: Stylus 格式化
    - 范围：
      - Stylus 文件
  - `oxfmt`: 格式化
    - 范围：
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

- 发版约束检查（`release-guard.yml`）：
  - 检查 `docs/maintenance/changelog.md` 与 `docs/en/maintenance/changelog.md` 是否仍然保留 `## [Unreleased]`。
  - 检查非发布 PR 中是否手动修改了 `package.json` 的 `version`。
  - 检查发布 PR（带 `release` 标签）是否手动修改了 `package.json` 的 `version`，且为合法语义化版本号。
  - 检查 PR 中是否手动修改了 `theme.yaml` 与 `i18n-settings/theme.*.yaml` 的 `spec.version`。

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

### 其他指令

检查项目依赖是否过时

```bash
pnpm -r outdated
```

## 发布流程

### 发布前检查清单

准备发布前，请先确认以下事项：

1. 计划合并到本次版本的分支或 PR 都已完成合并。
2. `docs/maintenance/changelog.md` 与 `docs/en/maintenance/changelog.md` 的 `## [Unreleased]` 下已经补充完整本次版本说明，并且 `## [Unreleased]` 标题没有被删除。
3. 非发布 PR 不要手动修改版本号字段：`package.json` 的 `version`、`theme.yaml` 的 `spec.version`、`i18n-settings/theme.*.yaml` 的 `spec.version`。
4. 发布 PR（带 `release` 标签）仅允许手动修改 `package.json` 的 `version`，该值将作为正式版目标版本号。
5. 发布前人工确认 `theme.yaml` 与 `i18n-settings/theme.*.yaml` 中的 `requires` 仍符合目标 Halo CMS 版本要求。

### 正式版发布方法

正式版通过带标签的 PR 自动发布：

1. 创建用于正式发布的 PR（或在现有汇总 PR 上发布）。
2. 为 PR 添加 `release` 标签，并将 `package.json` 的 `version` 改为目标语义化版本号（例如 `1.57.6`）。
3. 等待 `release-guard.yml` 检查通过，并确认摘要中的目标版本号（来自 `package.json`）与上一个正式版版本号无误。
4. 合并 PR 到 `main`。

PR 合并后，机器人会自动完成以下动作：

1. 将中英文更新日志 `## [Unreleased]` 内容提升为本次正式版条目，并保留 `## [Unreleased]` 标题。
2. 同步更新 `package.json` 的 `version`、`theme.yaml` 的 `spec.version`、`i18n-settings/theme.*.yaml` 的 `spec.version`，并推送机器人提交到 `main`。
3. 执行主题构建，产出多个 `howiehz-higan-*.zip`。
4. 创建 GitHub Release，并上传全部 `howiehz-higan-*.zip` 到 GitHub Release 与 Halo 应用市场（`howiehz-higan-cn.zip` 优先上传）。
5. 由 release 事件触发 `page-audit-generate-json.yml`，自动创建体积测量结果 PR；该 PR 会带上 `deploy-docs` 标签，合并后自动部署文档站。

### 测试版发布方法

测试版不需要手动改版本号，也不需要手动创建分支。

1. 工作流 `nightly-theme-prerelease.yml` 会在北京时间每天 0 点自动运行。
2. 如果 `main` 在前一个自然日有新提交，则自动生成测试版。
3. 测试版版本号规则为“当前版本的修订号 + 1，再加上 `-alpha.yyyyMMddHHmmssSSS`”。
4. 工作流仅在运行环境内创建本地临时分支，完成版本号改写、构建产物、创建 GitHub Pre-release，并同步到 Halo 应用市场；该分支不会推送到远端。
