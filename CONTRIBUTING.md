# 贡献指南

## 项目结构

- 待补充

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
pnpm format
```

#### 构建主题

最后在提交前请不要忘记运行以下的指令构建主题

```bash
pnpm build
```

#### 其他 NPM 脚本的作用

在 .\tmp\ 目录输出未压缩的样式文件，便于追踪问题

```bash
pnpm dev-build
```

<!-- #### 打包主题

```bash
pnpm release
``` -->
