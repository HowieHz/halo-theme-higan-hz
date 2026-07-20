# 文档工具

此目录用于隔离文档相关工具的依赖版本。

目前，`vue-tsc` 尚未适配项目使用的 TypeScript 7，因此此目录暂时使用 TypeScript 6 运行文档站的 Vue 和 Markdown 类型检查。项目中的其他工具仍使用 TypeScript 7。

当 `vue-tsc` 支持 TypeScript 7 后，应删除此过渡方案，并将 `vue-tsc` 迁回根目录依赖。

英文说明请参阅 [README.en.md](README.en.md)。
