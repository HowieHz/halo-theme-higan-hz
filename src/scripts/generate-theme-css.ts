import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

type ThemeTokens = Record<string, string>;

function parseThemeTokens(themePath: string): ThemeTokens {
  const themeContent = readFileSync(themePath, "utf8").trim();
  const themeMatch = themeContent.match(/^:root\s*\{\n([\s\S]*?)\n\}$/);

  if (!themeMatch) {
    throw new Error(`Theme source must be a single :root block: ${themePath}`);
  }

  const themeDeclarations = themeMatch[1].split("\n").filter((line) => line.trim() !== "");

  return Object.fromEntries(
    themeDeclarations.map((line) => {
      const declaration = line.trim().replace(/;$/, "");
      const separatorIndex = declaration.indexOf(":");

      if (separatorIndex === -1) {
        throw new Error(`Invalid CSS declaration in ${themePath}: ${line}`);
      }

      return [declaration.slice(0, separatorIndex).trim(), declaration.slice(separatorIndex + 1).trim()];
    }),
  );
}

function formatThemeDeclarations(themeTokens: ThemeTokens): string {
  return Object.entries(themeTokens)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join("\n");
}

function wrapThemeCss(themeSelector: string, themeTokens: ThemeTokens): string {
  return `${themeSelector} {\n${formatThemeDeclarations(themeTokens)}\n}\n`;
}

function indentCssBlock(cssContent: string): string {
  return cssContent
    .split("\n")
    .filter((line) => line !== "")
    .map((line) => `  ${line}`)
    .join("\n");
}

const themesDir = resolve(import.meta.dirname, "../templates/_runtime/styles/themes");
const generatedDir = resolve(import.meta.dirname, "../generated");

const themeLight = parseThemeTokens(resolve(themesDir, "theme-light.css"));
const themeDark = parseThemeTokens(resolve(themesDir, "theme-dark.css"));
const themeLightBlue = parseThemeTokens(resolve(themesDir, "theme-light-blue.css"));
const themeDarkBlue = parseThemeTokens(resolve(themesDir, "theme-dark-blue.css"));
const themeGray = parseThemeTokens(resolve(themesDir, "theme-gray.css"));

mkdirSync(generatedDir, { recursive: true });

writeFileSync(resolve(generatedDir, "theme-light.css"), wrapThemeCss('html[theme="light"]', themeLight), "utf8");
writeFileSync(resolve(generatedDir, "theme-dark.css"), wrapThemeCss('html[theme="dark"]', themeDark), "utf8");
writeFileSync(
  resolve(generatedDir, "theme-light-blue.css"),
  wrapThemeCss('html[theme="light-blue"]', themeLightBlue),
  "utf8",
);
writeFileSync(
  resolve(generatedDir, "theme-dark-blue.css"),
  wrapThemeCss('html[theme="dark-blue"]', themeDarkBlue),
  "utf8",
);
writeFileSync(resolve(generatedDir, "theme-gray.css"), wrapThemeCss('html[theme="gray"]', themeGray), "utf8");
writeFileSync(
  resolve(generatedDir, "theme-auto.css"),
  `${wrapThemeCss('html[theme="auto"]', themeLight)}\n@media (prefers-color-scheme: dark) {\n${indentCssBlock(
    wrapThemeCss('html[theme="auto"]', themeDark).trimEnd(),
  )}\n}\n`,
  "utf8",
);
writeFileSync(
  resolve(generatedDir, "theme-auto-blue.css"),
  `${wrapThemeCss('html[theme="auto-blue"]', themeLightBlue)}\n@media (prefers-color-scheme: dark) {\n${indentCssBlock(
    wrapThemeCss('html[theme="auto-blue"]', themeDarkBlue).trimEnd(),
  )}\n}\n`,
  "utf8",
);
