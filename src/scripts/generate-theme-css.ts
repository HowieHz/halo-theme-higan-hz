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

function wrapAutoThemeCss(themeSelector: string, lightTokens: ThemeTokens, darkTokens: ThemeTokens): string {
  return `${wrapThemeCss(themeSelector, lightTokens)}\n@media (prefers-color-scheme: dark) {\n${indentCssBlock(
    wrapThemeCss(themeSelector, darkTokens).trimEnd(),
  )}\n}\n`;
}

const themesDir = resolve(import.meta.dirname, "../templates/_runtime/styles/themes");
const generatedDir = resolve(import.meta.dirname, "../generated");

const themeLight = parseThemeTokens(resolve(themesDir, "theme-light.css"));
const themeDark = parseThemeTokens(resolve(themesDir, "theme-dark.css"));
const themeLightBlue = parseThemeTokens(resolve(themesDir, "theme-light-blue.css"));
const themeDarkBlue = parseThemeTokens(resolve(themesDir, "theme-dark-blue.css"));
const themeGray = parseThemeTokens(resolve(themesDir, "theme-gray.css"));
const staticThemes = [
  ["theme-light.css", 'html[theme="light"]', themeLight],
  ["theme-dark.css", 'html[theme="dark"]', themeDark],
  ["theme-light-blue.css", 'html[theme="light-blue"]', themeLightBlue],
  ["theme-dark-blue.css", 'html[theme="dark-blue"]', themeDarkBlue],
  ["theme-gray.css", 'html[theme="gray"]', themeGray],
] as const;
const autoThemes = [
  ["theme-auto.css", 'html[theme="auto"]', themeLight, themeDark],
  ["theme-auto-blue.css", 'html[theme="auto-blue"]', themeLightBlue, themeDarkBlue],
] as const;

mkdirSync(generatedDir, { recursive: true });

for (const [fileName, themeSelector, themeTokens] of staticThemes) {
  writeFileSync(resolve(generatedDir, fileName), wrapThemeCss(themeSelector, themeTokens), "utf8");
}

for (const [fileName, themeSelector, lightTokens, darkTokens] of autoThemes) {
  writeFileSync(resolve(generatedDir, fileName), wrapAutoThemeCss(themeSelector, lightTokens, darkTokens), "utf8");
}
