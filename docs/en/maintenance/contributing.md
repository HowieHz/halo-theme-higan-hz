# Contribution Guide

## Project Structure

- [Template Files and Access Path Mapping](../reference/template-map.md)

## Version Compatibility

The current main branch is compatible with Halo 2.x versions.

## Development Guide

First, ensure your editor supports EditorConfig, which guarantees consistent code formatting across the project.

### Setting Up the Development Environment

#### Install pnpm

Make sure to [install Node.js](https://nodejs.org/en/download/package-manager) first, then run the following command to install pnpm:

```bash
npm install -g pnpm
```

### Preparation Before Development

#### Clone the Project Source Code and Navigate to the Root Directory

```bash
git clone https://github.com/HowieHz/halo-theme-higan-hz && cd halo-theme-higan-hz/
```

#### Install Project Dependencies

Run the following command in the project root directory to install dependencies:

```bash
pnpm install
```

### Developing the Theme

During development, run the following command in the project root directory to render modifications in real-time:

```bash
pnpm dev
```

This will output uncompressed style files in the `tmp/` directory, making it easier to trace issues.

#### After Development

##### Linting

After development, run the following command to check for issues (ensure there are no errors):

```bash
pnpm lint
```

##### Formatting Code

Before committing, you can run the following command to format the code:

```bash
pnpm fmt
```

##### Building the Theme

You can run the following command to build the theme:

```bash
pnpm build
```

### CI Checks

This project runs a set of quality checks on each PR via CI (GitHub Actions):

- Linters (`pnpm lint`):
  - `oxlint` + `eslint`: Code style and type-aware checks
    - Scope:
      - JavaScript files
      - TypeScript files
      - HTML files (only inline `script` blocks)
      - Vue files (including inline `script` blocks)
  - `stylelint`: Stylesheet checks
    - Scope:
      - CSS files
      - HTML files (only inline `style` blocks)
      - Vue files (only inline `style` blocks)
    - Note: Stylelint is special; `**/*.{css,html,vue}` does not include folders starting with `.` by default, so additional path matching is required.
  - `markdownlint`: Documentation style checks
    - Scope:
      - Markdown files
  - `autocorrect`: Automatic text correction
    - Scope:
      - [Supported file formats](https://github.com/huacnlee/autocorrect/tree/main/autocorrect/grammar)
  - `tsgo --noEmit`: TypeScript type checks
    - Scope:
      - TypeScript files
  - Note: All checks enable auto-fixing, and changes will be automatically committed if any are made.

- Formatting (`pnpm fmt`):
  - `stylus-supremacy`: Stylus formatting
    - Scope:
      - Stylus files
  - `oxfmt`: Formatting
    - Scope:
      - JSON files
      - JSONC files
      - YAML files
      - Markdown files
      - CSS files
      - JavaScript files
      - TypeScript files
      - Vue files
      - HTML files
  - Note: Changes made during formatting will be automatically committed.

- Lighthouse CI:
  - Checks page scores and outputs reports (must achieve full scores).
  - Compares page resource size differences with the baseline version and outputs reports.

- Visual Regression Testing:
  - Uses Playwright to take screenshots of key pages on desktop, tablet, and mobile devices (viewports) with Chromium, Firefox, and WebKit engines. Finally, Argos CI compares the screenshots with the baseline version (currently, only Chromium-generated screenshots are uploaded for comparison to save resources).

- Release Guard Checks:
  - Verifies that `docs/maintenance/changelog.md` and `docs/en/maintenance/changelog.md` still keep `## [Unreleased]` (fails if missing).
  - Verifies that non-release PRs do not manually change the `version` field in `package.json` (fails if changed).
  - Verifies that release PRs (with the `release` label) do manually change the `version` field in `package.json` (fails if unchanged), that it is a valid semantic version matching `/^\d+\.\d+\.\d+$/` (fails if it does not match), and that the new version is strictly greater than the `version` field in `package.json` on the target branch (fails if not incremented).
  - Verifies that PRs do not manually change `spec.version` in `theme.yaml` and `i18n-settings/theme.*.yaml` (fails if changed).

### Writing Documentation

During development, run the following command in the project root directory to start a server for real-time rendering of modifications:

```bash
pnpm docs:dev
```

The following command builds the final output in the `docs/.vitepress/dist` directory:

```bash
pnpm docs:build
```

Use the following command to start a server for previewing the final output:

```bash
pnpm docs:preview
```

### Other Commands

Check if project dependencies are outdated:

```bash
pnpm -r outdated
```

## Release Flow

### Pre-release Checklist

Before releasing, confirm all of the following:

1. Every branch or PR intended for the release has already been merged.
2. The entries under `## [Unreleased]` in both `docs/maintenance/changelog.md` and `docs/en/maintenance/changelog.md` are complete, and the `## [Unreleased]` heading has not been removed.
3. In release PRs (with the `release` label), only `package.json` `version` should be changed manually; that value is used as the target stable version.
4. Manually verify that the `requires` field in `theme.yaml` and `i18n-settings/theme.*.yaml` still matches the target Halo CMS compatibility range.

### Stable Release Procedure

Stable releases are published automatically from a labeled PR:

1. Create a PR for the release (or use an existing aggregation PR).
2. Add the `release` label and change `package.json` `version` to the target semantic version, such as `1.57.6`.
3. Wait for `release-guard.yml` to pass and confirm both the target version (from `package.json`) and the previous stable version shown in the workflow summary.
4. Merge the PR into `main`.

After the PR is merged, the bot automatically:

1. Promotes content from `## [Unreleased]` into a new released section in both changelog files while keeping `## [Unreleased]`.
2. Updates `package.json` `version`, `theme.yaml` `spec.version`, and `i18n-settings/theme.*.yaml` `spec.version`, then pushes the bot commit to `main`.
3. Builds the theme and produces multiple `howiehz-higan-*.zip` packages.
4. Creates the GitHub Release and uploads all `howiehz-higan-*.zip` packages to both GitHub Release and the Halo App Store (`howiehz-higan-cn.zip` first).
5. Lets the published release trigger `page-audit-generate-json.yml` to create the page-size audit PR; that PR carries the `deploy-docs` label and deploys docs automatically after merge.

### Nightly Prerelease Procedure

Nightly prereleases do not require manual version changes or a manually pushed branch.

1. `nightly-theme-prerelease.yml` runs automatically every day at 00:00 Asia/Shanghai.
2. If `main` received commits during the previous natural day, it creates a nightly prerelease automatically.
3. The prerelease version rule is “current patch version + 1”, then append `-alpha.yyyyMMddHHmmssSSS`.
4. The workflow uses only a local temporary branch in the runner, then rewrites version fields, builds assets, creates a GitHub prerelease, and syncs to the Halo App Store without pushing that branch.
