import path from "node:path";
import { fileURLToPath } from "node:url";
import { includeIgnoreFile } from "@eslint/compat";
import js from "@eslint/js";
import oxlint from "eslint-plugin-oxlint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, ".gitignore");

export default defineConfig(
  globalIgnores(["public/assets/lib/**/*"]),
  includeIgnoreFile(gitignorePath),
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ["**/*.js", "**/*.ts"],

    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    files: ["postcss.config.js"],

    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  eslintPluginPrettierRecommended,
  ...oxlint.buildFromOxlintConfigFile("./.oxlintrc.json"),
);
