// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(eslint.configs.recommended, ...tseslint.configs.recommended, {});

// module.exports = {
//   root: true,
//   parser: "@typescript-eslint/parser",
//   plugins: ["@typescript-eslint", "prettier"],
//   extends: [
//     "prettier",
//   ],
// env: {
//   browser: true,
//   node: true,
//   jquery: true
// },
// };
