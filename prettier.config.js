/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  endOfLine: "lf",
  importOrder: ["^@core/(.*)$", "", "^@server/(.*)$", "", "^@ui/(.*)$", "", "^[./]"],
  importOrderTypeScriptVersion: "5.0.0",
  plugins: ["@ianvs/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"],
  overrides: [
    {
      files: ["**/*.jsonc"],
      options: {
        trailingComma: "none",
      },
    },
  ],
};

export default config;
