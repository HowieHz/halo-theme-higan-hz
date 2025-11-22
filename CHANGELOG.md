# 更新日志

<!-- markdownlint-disable MD024 -->

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
