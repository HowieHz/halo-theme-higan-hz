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

CI (GitHub Actions) runs the following checks for PRs. Some checks are triggered manually when needed.

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

- `oxfmt`: Formatting for JSON, JSONC, YAML, Markdown, CSS, JavaScript, TypeScript, HTML, Vue and Less files

> Changes produced by formatting will be automatically committed.

#### Lighthouse CI

- Checks Lighthouse scores and outputs reports (all scores must be full marks).
- Compares page resource-size differences against the baseline version and outputs reports.

#### Release Guard Checks

- Verifies that `docs/maintenance/changelog.md` and `docs/en/maintenance/changelog.md` still contain `## [Unreleased]` (fails if missing).
- Verifies that changelog compare-link definitions at the end of `docs/maintenance/changelog.md` and `docs/en/maintenance/changelog.md` are complete and match release headings (fails if missing or mismatched).
- Ensures non-release PRs do not manually modify the `version` field in `package.json` (fails if changed).
- Ensures release PRs (with the `release` label) update the `version`
  field in `package.json` (fails if unchanged), use a valid semantic
  version matching `/^\d+\.\d+\.\d+$/` (fails if invalid), and set a
  version greater than the target branch's current `package.json`
  version (fails if not incremented).
- Prevents manual changes to `spec.version` in `theme.yaml` and `i18n-settings/theme.*.yaml` in PRs (fails if changed).

#### Page Resource Size Diff Check

To run the page resource size diff check for the current PR, add a `/audit` comment to the PR conversation (only users with `write`, `maintain`, or `admin` access can trigger it).  
The check runs against the latest commit in the PR and compares page resource sizes with the latest stable release.

#### Visual Regression Testing

To run the visual regression check for the current PR, add a `/visual` comment to the PR conversation (only users with `write`, `maintain`, or `admin` access can trigger it).  
Playwright captures screenshots of key pages across desktop, tablet, and mobile viewports using Chromium, Firefox, and WebKit, then compares them against the baseline version with Argos CI.  
The current automation generates and uploads only Chromium screenshots for comparison.

## Release Flow

### Pre-release Checklist

Before releasing, confirm all of the following:

1. Every branch or PR intended for the release has already been merged.
2. The entries under `## [Unreleased]` in both
   `docs/maintenance/changelog.md` and
   `docs/en/maintenance/changelog.md` are complete, the
   `## [Unreleased]` heading has not been removed, and
   compare-link definitions at the end are retained
   (the release workflow will rebuild this section automatically).
3. In release PRs (with the `release` label), only `package.json` `version` should be changed manually. That value becomes the target stable version.
4. Manually verify that the `requires` field in `theme.yaml` and `i18n-settings/theme.*.yaml` still matches the target Halo CMS compatibility range.

### Stable Release Procedure

Stable releases are published automatically from a labeled PR:

1. Create a PR for the release (or use an existing aggregation PR).
2. Add the `release` label and change `package.json` `version` to the target semantic version, such as `1.57.6`.
3. Wait for `check-release-guard.yml` to pass and confirm both the target version (from `package.json`) and the previous stable version shown in the workflow summary.
4. Merge the PR into `main`.

After merge, the bot automatically:

1. Promotes content under `## [Unreleased]` into a new release section in both changelog files, creates the new stable-release heading, and keeps `## [Unreleased]`.
2. Rebuilds compare-link definitions at the end of both changelog files (`[Unreleased]` and version links).
3. Updates `package.json` `version`, `theme.yaml` `spec.version`, and `i18n-settings/theme.*.yaml` `spec.version`, then pushes the bot commit to `main`.
4. Builds the theme and produces multiple `howiehz-higan-*.zip` packages.
5. Runs `gh attestation verify` to confirm every `howiehz-higan-*.zip` package was signed by the expected reusable build workflow; publishing continues only after verification passes.
6. After verification passes, two publishing actions run in parallel:
   - Create the GitHub Release and keep `howiehz-higan-cn.zip` first in the release asset list.
   - Sync to the Halo App Store by creating a draft release first,
     publishing it only after all build artifacts upload successfully,
     and keeping `howiehz-higan-cn.zip` first in the release asset list
     so Halo CMS prefers the Simplified Chinese package during
     update installs.
7. After the GitHub Release is published, dispatches the follow-up event
   that triggers `generate-page-size-audit-json.yml`, which creates the
   page-size audit PR. That PR includes the `deploy-docs` label and deploys
   docs automatically after merge.

### Nightly Pre-release Procedure

Nightly pre-releases do not require manual version changes or a manually pushed branch.

1. `release-nightly-theme-prerelease.yml` runs automatically every day at 00:00 Asia/Shanghai.
2. A Nightly pre-release is created only when all of the following are true:
   - There are commits within the previous calendar-day window in Asia/Shanghai.
   - There are commits after the latest stable or pre-release tag.
   - Commits whose subject starts with `docs:` are excluded.
3. The Nightly pre-release version rule is “current patch version + 1”, then append `-alpha.yyyyMMddHHmmssSSS`.
4. The workflow creates a temporary local branch in the runner, updates version fields, and builds assets without pushing that branch.
5. Before publishing the GitHub pre-release or syncing the Halo App Store, the workflow verifies attestation for every nightly `.zip` artifact.
6. After verification passes, the scheduled nightly run creates only the GitHub pre-release and does not sync to the Halo App Store by default.

To create a Nightly pre-release manually, use `workflow_dispatch`
and set the `sync_to_halo_store` input to control Halo App Store sync
after verification passes; when enabled, App Store sync creates a
draft release first and publishes it only after all build artifacts
upload successfully. This input defaults to `false`.

## Pull Request Conventions

The following conventions are used to mark or trigger PR automation workflows.

### Special Labels

- `deploy-docs`: Automatically deploys the documentation site when merged.
- `release`: Triggers the stable release creation process. See the [Release Flow](#release-flow) section for details.

### Special Comments

- `/audit`: Triggers the page resource size diff check, compares
  the current PR with the latest stable release, and generates a
  report. Only users with `write`, `maintain`, or `admin` access
  can trigger it.
- `/visual`: Triggers the visual regression check, generates
  screenshots for the latest PR commit, and uploads them to Argos
  when `ARGOS_TOKEN` is configured. Only users with `write`,
  `maintain`, or `admin` access can trigger it.

## How to Add a New Feature with Config Options

### Update Form Files

Please update the following configuration form files in sync:

- Simplified Chinese: `settings.yaml`
- English: `i18n-settings/settings.en.yaml`

### Update Config Documentation

Please update the following configuration documentation in sync:

- Simplified Chinese: `docs/guide/theme-configuration.md`
- English: `docs/en/guide/theme-configuration.md`

When writing docs, follow the format example at the beginning of the document, and keep the option order consistent with the order in the form files.

### Update Changelog

Record your changes in the following changelog files:

- Simplified Chinese: `docs/maintenance/changelog.md`
- English: `docs/en/maintenance/changelog.md`
