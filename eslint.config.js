import path from "node:path";
import { fileURLToPath } from "node:url";

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, ".gitignore");

export default defineConfig(
  globalIgnores(["src/templates/public/assets/lib/**/*"]),
  includeIgnoreFile(gitignorePath),
  js.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  {
    files: [
      "src/templates/**/*.{js,ts}",
      "docs/.vitepress/theme/**/*.ts",
      "docs/.vitepress/components/**/*.ts",
      "docs/.vitepress/utils/**/*.ts",
    ],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    files: ["src/templates/**/*.html"],
    plugins: { html },
    languageOptions: {
      sourceType: "script",
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    files: ["src/templates/public/assets/qrcode.html"],
    plugins: { html },
    languageOptions: {
      sourceType: "script",
      globals: {
        ...globals.browser,
        QRious: "readonly",
      },
    },
  },
  {
    files: ["docs/.vitepress/components/**/*.vue", "docs/.vitepress/theme/**/*.vue"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
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
    },
  },
  {
    files: [
      "docs/.vitepress/config.ts",
      "docs/en/config.ts",
      "vite.config.ts",
      "plugins/**/*.ts",
      "eslint.config.js",
      "stylelint.config.js",
      ".github/scripts/**/*.{js,ts}",
    ],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
  },
  ...oxlint.buildFromOxlintConfigFile("./.oxlintrc.json"),
);
