# 更新日志

<!-- markdownlint-disable MD024 -->

## [1.49.0](https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.48.3...v1.49.0) (未发布)

### ⚠破坏性修改

- 你需要使用新流程自定义图标，相关文档请见[教程：自定义图标](https://howiehz.top/halo-theme-higan-haozi/tutorial/custom-svg)。如果你先前自定义了图标，需按照教程进行迁移。
- “自定义分享按钮”下的配置项将会被重置，先前的配置不会被覆盖，你可通过在主题信息[“导出主题配置”](https://howiehz.top/halo-theme-higan-haozi/reference/faq#如何导出主题配置)获取。

### 🐛 错误修复

- 修复在“自定义分享按钮 -> 分享按钮设置”中部分默认值空缺导致无法保存的问题。
  - “自定义分享按钮 -> 分享按钮设置”中名称为`Native`项，链接应为`@URL`，如您之前安装过本主题，可使用此默认值填充。
- 修复桌面端文章页分享菜单有概率无法唤出的问题。
- 修复英文版配置项主题包中文章元数据“Show in Post List”的类型错误。

### 🔧 优化改进

- 增强在“自定义分享按钮 -> 分享按钮设置”中名称为“Native”（浏览器原生分享）的链接设置功能。
- 优化部分代码，不再挂载到 window 全局变量上，优化页面体积。
- 修复 SVG 图标未成功内联到 CSS 的问题，运行时无需再从 iconify 服务器拉取图标信息。
- 升级 Tailwind CSS 从 v3 至 v4
- 迁移图标系统从 `vite-plugin-purge-icons` 至 `@iconify/tailwind4`

## [1.48.3](https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.48.2...v1.48.3) (2025-11-26)

### 🐛 错误修复

- 修复在瞬间页中，作者名的悬停样式未按预期渲染的问题。

### 🔧 优化改进

- 进一步分包优化，移除冗余样式。

### 🛠️ 开发体验

- 重构构建流程。
- 组件化部分模板。
- 更新开发依赖

## [1.48.2](https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.48.1...v1.48.2) (2025-11-25)

### 🐛 错误修复

- 修复使用简洁文章列表的页面，无法按预期渲染的问题。
- 修复在瞬间页中，瞬间列表出现多余样式的问题。
- 修复在瞬间页中，交互栏按钮的悬停样式未按预期渲染的问题。

### 🔧 优化改进

- 进一步分包优化，移除冗余样式。
- 经过上述优化：
  - 主题资源：
    - 1.48.1 平均体积：66.808 KiB (gzipped) / 135.609 KiB (原始)
    - 1.48.2 平均体积：66.867 KiB (gzipped) / 132.980 KiB (原始)
    - 📉 Gzipped 下降：-0.060 KiB (-0.09%)
    - 📉 原始大小下降：2.629 KiB (1.94%)
  - 页面全部资源：
    - 1.48.1 平均体积：341.412 KiB (gzipped) / 999.784 KiB (原始)
    - 1.48.2 平均体积：341.500 KiB (gzipped) / 997.325 KiB (原始)
    - 📉 Gzipped 下降：-0.088 KiB (-0.03%)
    - 📉 原始大小下降：2.460 KiB (0.25%)

### 🛠️ 开发体验

- 更新开发依赖

## [1.48.1](https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.48.0...v1.48.1) (2025-11-23)

### 🚀 新功能

- 新文档：[性能参考](https://howiehz.top/halo-theme-higan-haozi/reference/performance)
  - 展示了主题从 v1.0.0 到最新版的资源体积变化。

### 🔧 优化改进

- 为默认 LOGO 添加 Avif/WebP 格式，原本的 PNG 格式作为回退。
- 使用 [KonghaYao/cn-font-split](https://github.com/KonghaYao/cn-font-split) 对默认字体进行分割。
- 修订构建流程，移除模板中的 `// <!--/* 到 */-->` 注释、`<!--/* 到 */-->` 注释、空行。优化分发体积和输出体积。
- 经过上述优化：
  - 主题资源：
    - 1.48.0 平均体积：368.038 KiB (gzipped) / 428.557 KiB (原始)
    - 1.48.1 平均体积：66.808 KiB (gzipped) / 135.609 KiB (原始)
    - 📉 Gzipped 下降：301.230 KiB (81.85%)
    - 📉 原始大小下降：292.948 KiB (68.36%)
  - 页面全部资源：
    - 1.48.0 平均体积：642.663 KiB (gzipped) / 1292.573 KiB (原始)
    - 1.48.1 平均体积：341.412 KiB (gzipped) / 999.784 KiB (原始)
    - 📉 Gzipped 下降：301.251 KiB (46.88%)
    - 📉 原始大小下降：292.789 KiB (22.65%)

### 🛠️ 开发体验

- 更新开发依赖

## [1.48.0](https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.47.0...v1.48.0) (2025-11-22)

### 🚀 新功能

- 添加“页面元数据 -> 自定义模板 -> [文章页样式](http://howiehz.top/halo-theme-higan-haozi/guide/metadata-configuration#%E6%96%87%E7%AB%A0%E9%A1%B5%E6%A0%B7%E5%BC%8F)”
  - 替代原有的“自定义页面样式 -> 启用类文章页样式”

### 🔧 优化改进

- 优化自定义页面样式体积。脚本和样式表均 [-15%](https://github.com/HowieHz/halo-theme-higan-hz/pull/327#issuecomment-3566640583) 的体积。

### 🛠️ 开发体验

- 更新开发依赖

## [1.47.0](https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.46.0...v1.47.0) (2025-11-20)

### 🚀 新功能

- 添加“总体样式 -> [额外菜单项](http://howiehz.top/halo-theme-higan-haozi/guide/theme-configuration#%E9%A2%9D%E5%A4%96%E8%8F%9C%E5%8D%95%E9%A1%B9)”
  - 替代原有的“总体样式 -> 菜单中随机文章项”、“总体样式 -> 菜单中用户账号项”。
  - 类型为“重复器”，支持自定义排序，允许自由添加或删除条目。
  - 其中新增`用户账号`类型：
    - 未登录时，菜单显示 `登录`，点击后跳转 `/login` 页面。
    - 已登录时，菜单显示用户名，点击后跳转 `/uc` 页面。

### 🛠️ 开发体验

- 更新开发依赖

## [1.46.0](https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.45.4...v1.46.0) (2025-11-17)

### 🚀 新功能

- 新文档站已上线，欢迎体验：[Higan Haozi](https://howiehz.top/halo-theme-higan-haozi)
  - [写作参考文档：基本样式、扩展样式及其写法](https://howiehz.top/halo-theme-higan-haozi/guide/style-reference)
  - [插件兼容性文档](https://howiehz.top/halo-theme-higan-haozi/guide/plugin-compatibility)
  - [主题配置项文档](https://howiehz.top/halo-theme-higan-haozi/guide/theme-configuration)
  - [元数据配置项文档](https://howiehz.top/halo-theme-higan-haozi/guide/metadata-configuration)

### 🔧 优化改进

- 将部分样式从公用包分离，减小页面体积。
- 优化主题配置项说明。

### 🛠️ 开发体验

- 更新开发依赖，移除无用依赖

## [1.45.4](https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.45.3...v1.45.4) (2025-11-07)

### 🐛 错误修复

- 修复启用“标签集合页样式——标签排序方式”时标签颜色无法正常显示的问题。

<!-- ### Features -->

<!-- ### BREAKING CHANGES -->
