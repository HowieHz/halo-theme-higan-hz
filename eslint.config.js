import { resolve } from "node:path";

import { includeIgnoreFile } from "@eslint/compat";
import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import html from "eslint-plugin-html";
import oxlint from "eslint-plugin-oxlint";
import pluginVue from "eslint-plugin-vue";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";
import vueParser from "vue-eslint-parser";

const gitignorePath = resolve(import.meta.dirname, ".gitignore");

const browserTsFiles = [
  "src/templates/**/*.{js,ts}",
  "docs/.vitepress/theme/**/*.ts",
  "docs/.vitepress/components/**/*.ts",
  "docs/.vitepress/utils/**/*.ts",
];

const vueFiles = ["docs/.vitepress/components/**/*.vue", "docs/.vitepress/theme/**/*.vue"];

const nodeFiles = [
  "docs/.vitepress/config.ts",
  "docs/en/config.ts",
  "vite.config.ts",
  "plugins/**/*.ts",
  "eslint.config.js",
  "stylelint.config.js",
  ".github/scripts/**/*.{js,ts}",
];

const browserLanguageOptions = {
  ecmaVersion: "latest",
  sourceType: "module",
  globals: {
    ...globals.browser,
  },
};

const htmlLanguageOptions = {
  ecmaVersion: "latest",
  sourceType: "script",
  globals: {
    ...globals.browser,
  },
};

const qrcodeHtmlLanguageOptions = {
  ...htmlLanguageOptions,
  globals: {
    ...htmlLanguageOptions.globals,
    QRious: "readonly",
  },
};

const nodeLanguageOptions = {
  ecmaVersion: 2024,
  sourceType: "module",
  globals: {
    ...globals.node,
  },
};

const vueLanguageOptions = {
  ...browserLanguageOptions,
  parser: vueParser,
  parserOptions: {
    parser: {
      // Script parser for `<script>`
      js: "espree",
      // Script parser for `<script lang="ts">`
      ts: tsParser,
      // Script parser for vue directives (e.g. `v-if=` or `:attribute=`)
      // and vue interpolations (e.g. `{{variable}}`).
      // If not specified, the parser determined by `<script lang ="...">` is used.
      "<template>": "espree",
    },
  },
};

export default defineConfig(
  globalIgnores(["src/templates/public/assets/lib/**/*"]),
  includeIgnoreFile(gitignorePath),
  js.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  {
    // Browser-side TS/JS covered by tsconfig.browser.json and docs/tsconfig.browser.json.
    files: browserTsFiles,
    languageOptions: browserLanguageOptions,
  },
  {
    // HTML templates: eslint-plugin-html lints inline scripts with classic script semantics.
    files: ["src/templates/**/*.html"],
    plugins: { html },
    languageOptions: htmlLanguageOptions,
  },
  {
    // HTML template with an extra global provided by qrious.min.js.
    files: ["src/templates/public/assets/qrcode.html"],
    plugins: { html },
    languageOptions: qrcodeHtmlLanguageOptions,
  },
  {
    // Browser-side Vue SFCs covered by docs/tsconfig.browser.json.
    files: vueFiles,
    languageOptions: vueLanguageOptions,
  },
  {
    // Node-side config/build/tooling covered by tsconfig.node.json and docs/tsconfig.node.json.
    files: nodeFiles,
    languageOptions: nodeLanguageOptions,
  },
  ...oxlint.buildFromOxlintConfigFile("./.oxlintrc.json"),
);
