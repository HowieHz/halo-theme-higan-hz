---
outline: deep
---

# 贡献指南

## 项目结构

- [模板文件与访问路径映射](../reference/template-map.md)

## 版本适用说明

`main` 分支当前适用于 Halo 2.x。

## 开发指南

开始前请确保你的编辑器支持 [EditorConfig](https://editorconfig.org/#pre-installed)，以保证项目代码格式一致。

### 部署开发环境

#### 安装 pnpm

请先[安装 Node.js](https://nodejs.org/zh-cn/download/package-manager)，再运行以下命令安装 pnpm。

```bash
npm install -g pnpm
```

### 开发前准备

#### 下载项目源码，并进入到项目根目录

```bash
git clone https://github.com/HowieHz/halo-theme-higan-hz && cd halo-theme-higan-hz/
```

#### 安装项目依赖

在项目根目录运行以下命令安装依赖。

```bash
pnpm install
```

### 开发主题

开发时，在项目根目录运行以下命令即可实时渲染修改。

```bash
pnpm dev
```

此时会在 `tmp/` 目录输出未压缩的样式文件，便于追踪问题。

### 编写文档

开发文档时，在项目根目录运行以下命令可启动服务并实时预览修改。

```bash
pnpm docs:dev
```

以下命令会将构建产物输出到 `docs/.vitepress/dist` 目录。

```bash
pnpm docs:build
```

使用以下命令可启动服务以预览构建产物。

```bash
pnpm docs:preview
```

### 开发完成后

#### 求疵

请运行以下命令进行检查（确保无错误）。

```bash
pnpm lint
```

#### 格式化代码

提交前可运行以下命令进行格式化。

```bash
pnpm fmt
```

#### 构建主题

可运行以下命令构建主题。

```bash
pnpm build
```

### CI 检查

本项目会在 CI（GitHub Actions）中对 PR 执行以下检查，其中部分检查为按需手动触发：

#### CI 求疵步骤

CI 会自动运行 `pnpm lint`，包含以下检查：

- `oxlint` + `eslint`：代码风格与类型感知检查
  - **范围**：JavaScript 文件、TypeScript 文件、HTML 文件（仅内联 `script` 块）、Vue 文件（包括内联 `script` 块）
- `stylelint`：样式表检查
  - **范围**：CSS 文件、HTML 文件（仅内联 `style` 块）、Vue 文件（仅内联 `style` 块）
  - _备注_：`**/*.{css,html,vue}` 不会进入以 `.` 开头的文件夹，所以需要额外路径匹配。
- `markdownlint`：文档样式检查
  - **范围**：Markdown 文件
- `autocorrect`：自动文案校正
  - **范围**：其[支持的文件格式](https://github.com/huacnlee/autocorrect/tree/main/autocorrect/grammar)
- `tsgo --noEmit`：TypeScript 类型检查
  - **范围**：TypeScript 文件

> 所有求疵步骤都开启了自动修正，若有变更会自动提交。

#### CI 格式化步骤

CI 会自动运行 `pnpm fmt`，包含以下格式化步骤：

- `oxfmt`：格式化 JSON、JSONC、YAML、Markdown、CSS、JavaScript、TypeScript、HTML、Vue 和 Less 文件

> 格式化产生的变更会自动提交。

#### 页面审计

- 使用 Lighthouse CI 检查页面评分并输出报告（需全部满分）。
- 与基线版本进行页面资源体积差异检查并输出报告。

#### 发版约束检查

- 检查 `docs/maintenance/changelog.md` 与 `docs/en/maintenance/changelog.md` 是否仍然保留 `## [Unreleased]`（如未保留则不通过检查）。
- 检查 `docs/maintenance/changelog.md` 与 `docs/en/maintenance/changelog.md` 末尾的版本对比链接定义是否完整且正确（如缺失或与版本段落不匹配则不通过检查）。
- 检查非发布 PR 中是否手动修改了 `package.json` 的 `version`（如有修改则不通过检查）。
- 检查发布 PR（带 `release` 标签）是否手动修改了 `package.json` 的 `version`（如未修改则不通过检查），且为合法语义化版本号（如不符合 `/^\d+\.\d+\.\d+$/` 则不通过检查），且新版本号必须大于目标分支 `package.json` 的 `version` 字段的版本号（如未递增则不通过检查）。
- 检查 PR 中是否手动修改了 `theme.yaml` 与 `i18n-settings/theme.*.yaml` 的 `spec.version`（如有修改则不通过检查）。

#### 页面资源体积差异检查

如需对当前 PR 手动执行页面资源体积差异检查，请在 PR 评论中输入 `/audit`（仅项目具有 `write`、`maintain` 或 `admin` 权限的用户可触发）。  
该检查会基于 PR 的最新提交运行，并与上一个正式版进行页面资源体积差异比较。

#### 页面视觉差异检查（Visual Regression）

如需对当前 PR 手动执行页面视觉差异检查，请在 PR 评论中输入 `/visual`（仅项目具有 `write`、`maintain` 或 `admin` 权限的用户可触发）。  
通过 Playwright 在桌面、平板、手机三种设备视图（Viewport）下，使用 Chromium、Firefox、WebKit 内核对关键页面截图，并使用 Argos CI 与基线版本进行比较。  
当前自动化流程仅生成并上传 Chromium 截图用于比较。

## 发布流程

### 发布前检查清单

准备发布前，请先确认以下事项：

1. 计划合并到本次版本的分支或 PR 都已完成合并。
2. `docs/maintenance/changelog.md` 与 `docs/en/maintenance/changelog.md` 的 `## [Unreleased]` 下已经补充完整本次版本说明，并且 `## [Unreleased]` 标题没有被删除，以及末尾的版本对比链接定义已保留（发布工作流会自动重建该部分）。
3. 发布 PR（带 `release` 标签）仅允许手动修改 `package.json` 的 `version`，该值将作为正式版目标版本号。
4. 发布前人工确认 `theme.yaml` 与 `i18n-settings/theme.*.yaml` 中的 `requires` 仍符合目标 Halo CMS 版本要求。

### 正式版发布方法

正式版通过带标签的 PR 自动发布：

1. 创建用于正式发布的 PR（或在现有汇总 PR 上发布）。
2. 为 PR 添加 `release` 标签，并将 `package.json` 的 `version` 改为目标语义化版本号（例如 `1.57.6`）。
3. 等待 `release-guard.yml` 检查通过，并确认摘要中的目标版本号（来自 `package.json`）与上一个正式版版本号无误。
4. 合并 PR 到 `main`。

PR 合并后，机器人会自动执行以下动作：

1. 将中英文更新日志 `## [Unreleased]` 内容提升为本次正式版条目，新建本次正式版标题，并保留 `## [Unreleased]` 标题。
2. 自动重建中英文更新日志末尾的版本对比链接定义（`[Unreleased]` 与各版本号链接）。
3. 同步更新 `package.json` 的 `version`、`theme.yaml` 的 `spec.version`、`i18n-settings/theme.*.yaml` 的 `spec.version`，并推送机器人提交到 `main`。
4. 执行主题构建，产出多个 `howiehz-higan-*.zip`。
5. 执行 `gh attestation verify`，校验全部 `howiehz-higan-*.zip` 均由指定的复用构建工作流签名；只有校验通过后才继续发布。
6. 验证通过后，并行执行两项发布操作：
   - 创建 GitHub Release，并让 `howiehz-higan-cn.zip` 在发布附件列表中位于第一。
   - 同步到 Halo 应用市场，并让 `howiehz-higan-cn.zip` 在发布附件列表中位于第一，以便 Halo CMS 在更新安装时优先使用简体中文配置版本。
7. GitHub Release 发布成功后，再派发后续事件触发 `sync-page-audit-results.yml`，自动创建体积测量结果 PR；该 PR 会带上 `deploy-docs` 标签，合并后自动部署文档站。

### 测试版发布方法

测试版不需要手动改版本号，也不需要手动创建分支。

1. 工作流 `nightly-theme-prerelease.yml` 会在北京时间每天 0 点自动运行。
2. 仅当同时满足以下条件时才会自动生成测试版：
   - 有提交位于“前一个自然日（Asia/Shanghai）”时间窗口内。
   - 有提交位于“上一个正式版/测试版 Tag 之后”的提交范围内。
   - 会排除提交信息以 `docs:` 开头的自动提交。
3. 测试版版本号规则为“当前版本的修订号 + 1，再加上 `-alpha.yyyyMMddHHmmssSSS`”。
4. 工作流仅在运行环境内创建本地临时分支，完成版本号改写与构建产物；该分支不会推送到远端。
5. 在发布 GitHub Pre-release 或同步 Halo 应用市场之前，工作流会先校验全部 nightly `.zip` 产物的 GitHub Artifact Attestation。
6. 每日定时触发的测试版在验证通过后仅创建 GitHub Pre-release，默认不同步到 Halo 应用市场。

如需手动创建测试版，可通过 `workflow_dispatch` 触发，并使用 `sync_to_halo_store` 开关控制是否在验证通过后同步到 Halo 应用市场；该开关默认值为 `false`。

## Pull Request 约定

以下约定用于标记或触发 PR 的自动化流程。

### 特殊标签

- `deploy-docs`: 合并后自动部署文档站。
- `release`: 触发正式版创建流程。详情参考[发布流程](#发布流程)。

### 特殊评论

- `/audit`: 触发页面资源体积差异检查，与上一个正式版进行比较并输出报告。仅项目具有 `write`、`maintain` 或 `admin` 权限的用户可触发。
- `/visual`: 触发页面视觉差异检查，生成当前 PR 最新提交的截图产物，并在配置了 `ARGOS_TOKEN` 时继续上传到 Argos。仅项目具有 `write`、`maintain` 或 `admin` 权限的用户可触发。

## 如何添加带配置项的新功能

### 修改表单文件

请同步修改以下配置表单文件：

- 简体中文：`settings.yaml`
- 英文：`i18n-settings/settings.en.yaml`

### 同步配置项文档

请同步更新以下配置项文档：

- 简体中文：`docs/guide/theme-configuration.md`
- 英文：`docs/en/guide/theme-configuration.md`

编写时请参考文档开头的格式示例，且配置项顺序需与表单文件中的配置项顺序保持一致。

### 修订更新日志

请在以下更新日志中记录本次修改：

- 简体中文：`docs/maintenance/changelog.md`
- 英文：`docs/en/maintenance/changelog.md`
