module.exports = {
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  endOfLine: "lf",
  importOrder: ["^@core/(.*)$", "", "^@server/(.*)$", "", "^@ui/(.*)$", "", "^[./]"],
  importOrderTypeScriptVersion: "5.0.0",
  plugins: ["@ianvs/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"],
};
