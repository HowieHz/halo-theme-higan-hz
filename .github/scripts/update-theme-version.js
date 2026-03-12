import fs from "node:fs";
import path from "node:path";

const nextVersion = process.argv[2];

if (!nextVersion) {
  console.error("Usage: node .github/scripts/update-theme-version.js <version>");
  process.exit(1);
}

const repoRoot = process.cwd();
const yamlFiles = [
  path.join(repoRoot, "theme.yaml"),
  ...fs
    .readdirSync(path.join(repoRoot, "i18n-settings"))
    .filter((fileName) => /^theme\..+\.ya?ml$/u.test(fileName))
    .map((fileName) => path.join(repoRoot, "i18n-settings", fileName)),
];

const replaceOnce = (content, pattern, replacer, filePath) => {
  if (!pattern.test(content)) {
    throw new Error(`Unable to find version field in ${filePath}`);
  }

  return content.replace(pattern, replacer);
};

const packageJsonPath = path.join(repoRoot, "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
packageJson.version = nextVersion;
fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);

for (const filePath of yamlFiles) {
  const content = fs.readFileSync(filePath, "utf8");
  const updated = replaceOnce(
    content,
    /(^\s*version:\s*)([^\r\n]+)$/mu,
    (_, prefix) => `${prefix}${nextVersion}`,
    filePath,
  );
  fs.writeFileSync(filePath, updated);
}
