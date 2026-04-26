# 发布策略

## 版本规则

本项目使用语义化版本号 `MAJOR.MINOR.PATCH`。

- `MAJOR`：随着 Halo CMS 大版本更新而更新。
- `MINOR`：在有配置更新时更新。
- `PATCH`：在无配置文件更新、仅包含其他变更时更新。

## 发布类型

本项目的主题发布分为正式版和测试版两类，二者都会先完成构建产物签名校验，再发布全部主题构建产物；其中正式版会同步到 Halo 应用市场，而测试版是否同步取决于触发方式。同步到 Halo 应用市场时会先创建草稿版本，成功上传全部构建产物后再发布，以避免市场侧先出现不完整附件。

- 正式版：由带有 `release` 标签、并在 `package.json` 中设置目标语义化版本号的 PR 合并到 `main` 后自动触发。
- 测试版：北京时间每天 0 点自动检查 `main` 分支前一天是否有新提交；如果有，则自动发布测试版。定时任务默认只发布到 GitHub Releases，不同步到 Halo 应用市场；手动触发时可通过 `sync_to_halo_store` 开关控制是否同步，默认不同步。

## 构建产物

发布流程会基于当前构建规则生成多个主题安装包，并确保 `howiehz-higan-cn.zip` 在发布附件列表中位于第一，以便 Halo CMS 在更新安装时优先使用简体中文配置版本。

当前发布产物包括：

- `howiehz-higan-cn.zip`
- `howiehz-higan-en.zip`

完整发布流程请参阅[贡献指南](./contributing.md#发布流程)中的“发布流程”章节。

## 构建溯源

每次正式版与测试版发布时，CI 流程会为所有 `.zip` 产物生成 GitHub Artifact Attestation，由 GitHub Actions 构建环境签发，用于验证下载文件的真实来源。

当前构建流程采用 GitHub 推荐的 reusable workflow 模式：构建、产物上传与 attestation 签发均在复用构建工作流内部完成，对应 GitHub 文档中的 SLSA v1 Build Level 3 路线。

在正式版与测试版工作流中，会先使用 `gh attestation verify` 校验全部 `.zip` 产物，确认这些文件确实由指定的 GitHub Actions 复用构建工作流生成并签名。验证通过后才会进行发布任务，确保发布出去的主题包来源可验证且未被篡改。

| 类型                                               | 文件 / 位置            | 验证工具                |
| -------------------------------------------------- | ---------------------- | ----------------------- |
| GitHub Artifact Attestation（GitHub 推荐 L3 路线） | GitHub Attestation API | `gh attestation verify` |

验证方法请参阅[安全防护](/tutorial/security#验证主题包完整性)。
