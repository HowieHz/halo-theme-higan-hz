import fs from "node:fs/promises";
import path from "node:path";

const defaultActionRoot = path.join(".github", "actions");
const targetFilesFromArgs = process.argv.slice(2);

const collectActionYamlFiles = async (directoryPath) => {
  const absoluteDirectoryPath = path.resolve(process.cwd(), directoryPath);
  const dirEntries = await fs.readdir(absoluteDirectoryPath, { withFileTypes: true });
  const filePaths = [];

  for (const entry of dirEntries) {
    const relativePath = path.join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      filePaths.push(...(await collectActionYamlFiles(relativePath)));
      continue;
    }

    if (entry.isFile() && entry.name === "action.yml") {
      filePaths.push(relativePath);
    }
  }

  return filePaths.sort((left, right) => left.localeCompare(right));
};

const githubToken = process.env.GITHUB_TOKEN ?? "";
const githubRepository = process.env.GITHUB_REPOSITORY ?? "local-action-updater";
const usesPattern = /^(\s*-?\s*uses:\s*)([A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+)@([^\s#]+)(\s*(#.*)?)$/u;
const versionCache = new Map();
const githubHeaders = {
  Accept: "application/vnd.github+json",
  "User-Agent": githubRepository,
  "X-GitHub-Api-Version": "2022-11-28",
};

if (githubToken) {
  githubHeaders.Authorization = `Bearer ${githubToken}`;
}

const appendGitHubOutput = (name, value) => {
  const outputPath = process.env.GITHUB_OUTPUT;

  if (!outputPath) {
    return;
  }

  return fs.appendFile(outputPath, `${name}=${value}\n`);
};

const parseStableSemVer = (tag) => {
  const match = /^v?(\d+)\.(\d+)\.(\d+)$/u.exec(tag);

  if (!match) {
    return null;
  }

  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    tag,
  };
};

const compareSemVer = (left, right) => {
  if (left.major !== right.major) {
    return left.major - right.major;
  }

  if (left.minor !== right.minor) {
    return left.minor - right.minor;
  }

  return left.patch - right.patch;
};

const resolveTargetRef = (currentRef, latestVersion) => {
  const hasVPrefix = currentRef.startsWith("v");

  if (/^v?\d+$/u.test(currentRef)) {
    return `${hasVPrefix ? "v" : ""}${latestVersion.major}`;
  }

  if (/^v?\d+\.\d+\.\d+$/u.test(currentRef)) {
    return `${hasVPrefix ? "v" : ""}${latestVersion.major}.${latestVersion.minor}.${latestVersion.patch}`;
  }

  return null;
};

const fetchLatestStableVersion = async (repository) => {
  const cached = versionCache.get(repository);

  if (cached) {
    return cached;
  }

  const response = await fetch(`https://api.github.com/repos/${repository}/tags?per_page=100`, {
    headers: githubHeaders,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch tags for ${repository}: ${response.status} ${response.statusText}`);
  }

  const tags = await response.json();
  const latestVersion = tags
    .map(({ name }) => parseStableSemVer(name))
    .filter(Boolean)
    .sort((left, right) => compareSemVer(right, left))[0];

  if (!latestVersion) {
    throw new Error(`No stable semver tags found for ${repository}`);
  }

  versionCache.set(repository, latestVersion);
  return latestVersion;
};

const updateFile = async (filePath) => {
  const absolutePath = path.resolve(process.cwd(), filePath);
  const originalContent = await fs.readFile(absolutePath, "utf8");
  const lineEnding = originalContent.includes("\r\n") ? "\r\n" : "\n";
  const lines = originalContent.split(/\r?\n/u);
  const updates = [];

  for (const [index, line] of lines.entries()) {
    const match = line.match(usesPattern);

    if (!match) {
      continue;
    }

    const [, prefix, repository, currentRef, suffix = ""] = match;
    const targetVersion = resolveTargetRef(currentRef, await fetchLatestStableVersion(repository));

    if (!targetVersion || targetVersion === currentRef) {
      continue;
    }

    lines[index] = `${prefix}${repository}@${targetVersion}${suffix}`;
    updates.push(`${repository}: ${currentRef} -> ${targetVersion}`);
  }

  if (updates.length === 0) {
    return [];
  }

  await fs.writeFile(absolutePath, lines.join(lineEnding));
  return updates;
};

const targetFiles =
  targetFilesFromArgs.length > 0 ? targetFilesFromArgs : await collectActionYamlFiles(defaultActionRoot);

if (targetFiles.length === 0) {
  console.error(`No action.yml files found under ${defaultActionRoot}`);
  process.exit(1);
}

if (targetFilesFromArgs.length === 0) {
  console.log(`Scanning ${defaultActionRoot}/**/action.yml`);
}

const updateGroups = [];

for (const filePath of targetFiles) {
  const updates = await updateFile(filePath);

  if (updates.length === 0) {
    console.log(`No updates found in ${filePath}`);
    continue;
  }

  console.log(`Updated ${filePath}`);

  for (const update of updates) {
    console.log(`- ${update}`);
  }

  updateGroups.push({ filePath, updates });
}

const updatedFiles = updateGroups.map(({ filePath }) => filePath);
const updateCount = updateGroups.reduce((total, { updates }) => total + updates.length, 0);

await appendGitHubOutput("changed", updateGroups.length > 0 ? "true" : "false");
await appendGitHubOutput("update_count", String(updateCount));
await appendGitHubOutput("updated_files", updatedFiles.join(","));
