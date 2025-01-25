import globals from "globals";
import { includeIgnoreFile } from "@eslint/compat";
import path from "node:path";
import { fileURLToPath } from "node:url";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, ".gitignore");

export default [
  includeIgnoreFile(gitignorePath),
  ...tseslint.config(eslint.configs.recommended, tseslint.configs.recommended),
  {
    files: ["**/*.js", "**/*.cjs", "**/*.mjs", "**/*.cts", "**/*.ts", "**/*.mts"],

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jquery,
      },
    },
  },
  eslintPluginPrettierRecommended,
];
