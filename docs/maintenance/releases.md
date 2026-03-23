# 发布策略

## 发布类型

本项目的主题发布分为正式版和测试版两类，二者都会同时发布到 GitHub Releases 和 Halo 应用市场，并且都上传全部主题构建产物。

- 正式版：由带有 `release` 标签、并在 `theme.yaml` 中设置目标语义化版本号的 PR 合并到 `main` 后自动触发。
- 测试版：北京时间每天 0 点自动检查 `main` 分支前一天是否有新提交；如果有，则自动发布测试版。

## 构建产物

发布流程会基于当前构建规则生成多个主题安装包，并保证上传顺序中 `howiehz-higan-cn.zip` 始终排在第一位，以便 Halo CMS 在更新安装时优先使用简体中文配置版本。

当前发布产物包括：

- `howiehz-higan-cn.zip`
- `howiehz-higan-en.zip`

完整发布流程请参阅[贡献指南](./contributing.md#发布流程)中的“发布流程”章节。

## 构建溯源

每次正式版发布时，CI 流程会为所有 `.zip` 产物生成两类溯源证明，证明文件由 GitHub Actions 构建环境签发，用于验证下载文件的真实来源。

| 类型                     | 文件 / 位置                          | 验证工具                |
| ------------------------ | ------------------------------------ | ----------------------- |
| GitHub Attestation（L2） | 存储于 GitHub Attestation API        | `gh attestation verify` |
| SLSA Provenance（L3）    | Release 附件 `multiple.intoto.jsonl` | `slsa-verifier`         |

验证方法请参阅[安全防护](/tutorial/security#验证主题包完整性)。
