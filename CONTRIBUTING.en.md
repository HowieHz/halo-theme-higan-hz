# Contribution Guide

[简体中文](./CONTRIBUTING.md) | **English**

## Project Structure

- [Template Files and Access Path Mapping](https://howiehz.top/halo-theme-higan-haozi/en/reference/template-map)

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
pnpm format
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

- Formatting (`pnpm format`):
  - `stylus-supremacy`: Stylus formatting
    - Scope:
      - Stylus files
  - `prettier`: Formatting
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

<!-- #### Icon Libraries Used

[vite-plugin-purge-icons](https://github.com/antfu/purge-icons/blob/main/packages/vite-plugin-purge-icons/README.md) -->

<!-- #### Packaging the Theme

```bash
pnpm release
``` -->

### Other Commands

Check if project dependencies are outdated:

```bash
pnpm -r outdated
```
