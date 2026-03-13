---
outline: deep
---

# Contribution Guide

## Project Structure

- [Template Files and Access Path Mapping](../reference/template-map.md)

## Version Compatibility

The `main` branch currently targets Halo 2.x.

## Development Guide

Before you start, make sure your editor supports [EditorConfig](https://editorconfig.org/#pre-installed) so formatting stays consistent across the project.

### Setting Up the Development Environment

#### Install pnpm

First, [install Node.js](https://nodejs.org/en/download/package-manager), then run:

```bash
npm install -g pnpm
```

### Preparation Before Development

#### Clone the Project Source Code and Navigate to the Root Directory

```bash
git clone https://github.com/HowieHz/halo-theme-higan-hz && cd halo-theme-higan-hz/
```

#### Install Project Dependencies

In the project root, install dependencies:

```bash
pnpm install
```

### Developing the Theme

To run the theme in development mode with live updates, execute:

```bash
pnpm dev
```

Uncompressed style files are generated in `tmp/`, which makes debugging easier.

### Writing Documentation

For documentation development with live preview, run:

```bash
pnpm docs:dev
```

Build production docs to `docs/.vitepress/dist` with:

```bash
pnpm docs:build
```

Preview the production build with:

```bash
pnpm docs:preview
```

### After Development

#### Linting

Run the following command and make sure there are no errors:

```bash
pnpm lint
```

#### Formatting Code

Before committing, format the code with:

```bash
pnpm fmt
```

#### Building the Theme

Build the theme with:

```bash
pnpm build
```

### CI Checks

For every PR, CI (GitHub Actions) runs the following quality checks:

#### CI Linting Steps

CI automatically runs `pnpm lint`, including the following checks:

- `oxlint` + `eslint`: Code style and type-aware checks
  - **Scope**: JavaScript files, TypeScript files, HTML files (inline `script` blocks only), and Vue files (including inline `script` blocks)
- `stylelint`: Stylesheet checks
  - **Scope**: CSS files, HTML files (inline `style` blocks only), and Vue files (inline `style` blocks only)
  - _Note_: By default, `**/*.{css,html,vue}` does not match dot-prefixed directories, so additional path globs are required.
- `markdownlint`: Documentation style checks
  - **Scope**: Markdown files
- `autocorrect`: Automated text corrections
  - **Scope**: [Supported file formats](https://github.com/huacnlee/autocorrect/tree/main/autocorrect/grammar)
- `tsgo --noEmit`: TypeScript type checks
  - **Scope**: TypeScript files

> All lint steps run with auto-fix enabled. If fixes are applied, the changes are committed automatically.

#### CI Formatting Steps

CI automatically runs `pnpm fmt`, including the following formatting steps:

- `stylus-supremacy`: Stylus formatting (Stylus files)
- `oxfmt`: Formatting for JSON, JSONC, YAML, Markdown, CSS, JavaScript, TypeScript, Vue, and HTML files

> Changes produced by formatting will be automatically committed.

#### Lighthouse CI

- Checks Lighthouse scores and outputs reports (all scores must be full marks).
- Compares page resource-size differences against the baseline version and outputs reports.

#### Visual Regression Testing

Playwright captures screenshots of key pages across desktop, tablet, and mobile viewports using Chromium, Firefox, and WebKit. Argos CI then compares those screenshots against the baseline version. To save CI quota, only Chromium screenshots are currently uploaded.

#### Release Guard Checks

- Verifies that `docs/maintenance/changelog.md` and `docs/en/maintenance/changelog.md` still contain `## [Unreleased]` (fails if missing).
- Ensures non-release PRs do not manually modify the `version` field in `package.json` (fails if changed).
- Ensures release PRs (with the `release` label) update the `version` field in `package.json` (fails if unchanged), use a valid semantic version matching `/^\d+\.\d+\.\d+$/` (fails if invalid), and set a version greater than the target branch's current `package.json` version (fails if not incremented).
- Prevents manual changes to `spec.version` in `theme.yaml` and `i18n-settings/theme.*.yaml` in PRs (fails if changed).

## Release Flow

### Pre-release Checklist

Before releasing, confirm all of the following:

1. Every branch or PR intended for the release has already been merged.
2. The entries under `## [Unreleased]` in both `docs/maintenance/changelog.md` and `docs/en/maintenance/changelog.md` are complete, and the `## [Unreleased]` heading has not been removed.
3. In release PRs (with the `release` label), only `package.json` `version` should be changed manually. That value becomes the target stable version.
4. Manually verify that the `requires` field in `theme.yaml` and `i18n-settings/theme.*.yaml` still matches the target Halo CMS compatibility range.

### Stable Release Procedure

Stable releases are published automatically from a labeled PR:

1. Create a PR for the release (or use an existing aggregation PR).
2. Add the `release` label and change `package.json` `version` to the target semantic version, such as `1.57.6`.
3. Wait for `release-guard.yml` to pass and confirm both the target version (from `package.json`) and the previous stable version shown in the workflow summary.
4. Merge the PR into `main`.

After merge, the bot automatically:

1. Promotes content under `## [Unreleased]` into a new release section in both changelog files while keeping `## [Unreleased]`.
2. Updates `package.json` `version`, `theme.yaml` `spec.version`, and `i18n-settings/theme.*.yaml` `spec.version`, then pushes the bot commit to `main`.
3. Builds the theme and produces multiple `howiehz-higan-*.zip` packages.
4. Creates the GitHub Release and uploads all `howiehz-higan-*.zip` packages to both GitHub Release and the Halo App Store (`howiehz-higan-cn.zip` first).
5. Uses the published release to trigger `page-audit-generate-json.yml`, which creates the page-size audit PR. That PR includes the `deploy-docs` label and deploys docs automatically after merge.

### Nightly Prerelease Procedure

Nightly prereleases do not require manual version changes or a manually pushed branch.

1. `nightly-theme-prerelease.yml` runs automatically every day at 00:00 Asia/Shanghai.
2. If `main` received commits during the previous calendar day, a nightly prerelease is created automatically.
3. The prerelease version rule is “current patch version + 1”, then append `-alpha.yyyyMMddHHmmssSSS`.
4. The workflow creates a temporary local branch in the runner, updates version fields, builds assets, creates a GitHub prerelease, and syncs to the Halo App Store without pushing that branch.

## Pull Request Conventions

The following conventions are used to mark or trigger PR automation workflows.

### Special Labels

- `deploy-docs`: Automatically deploys the documentation site when merged.
- `release`: Triggers the stable release creation process. See the [Release Flow](#release-flow) section for details.

### Special Comments

- `/audit`: Triggers a page audit comparing the current branch against the latest stable release and generates a report.
