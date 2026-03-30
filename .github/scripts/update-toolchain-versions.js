import fs from "node:fs/promises";
import path from "node:path";

const packageJsonPath = "package.json";
const githubDirPath = ".github";
const workflowsDirPath = path.join(githubDirPath, "workflows");
const actionsDirPath = path.join(githubDirPath, "actions");
const setupActionPath = path.join(actionsDirPath, "setup-node-pnpm", "action.yml");
const dryRun = process.argv.includes("--dry-run");

const appendGitHubOutput = async (name, value) => {
  const outputPath = process.env.GITHUB_OUTPUT;

  if (!outputPath) {
    return;
  }

  await fs.appendFile(outputPath, `${name}=${value}\n`);
};

const compareNumbers = (left, right) => left - right;

const parseSemVer = (version) => {
  const match = /^v?(\d+)\.(\d+)\.(\d+)$/u.exec(version);

  if (!match) {
    return null;
  }

  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
  };
};

const compareSemVer = (left, right) =>
  compareNumbers(left.major, right.major) ||
  compareNumbers(left.minor, right.minor) ||
  compareNumbers(left.patch, right.patch);

const stripUtf8Bom = (content) => content.replace(/^\uFEFF/u, "");

const fetchLatestNodeMajor = async () => {
  const response = await fetch("https://nodejs.org/dist/index.json", {
    headers: {
      Accept: "application/json",
      "User-Agent": "halo-theme-higan-hz-toolchain-updater",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Node.js releases: ${response.status} ${response.statusText}`);
  }

  const releases = await response.json();
  const stableVersions = releases
    .map((release) => parseSemVer(release.version))
    .filter(Boolean)
    .sort((left, right) => compareSemVer(right, left));

  if (stableVersions.length === 0) {
    throw new Error("No stable Node.js versions found in release index");
  }

  return stableVersions[0].major;
};

const fetchLatestPnpmVersion = async () => {
  const response = await fetch("https://registry.npmjs.org/pnpm/latest", {
    headers: {
      Accept: "application/json",
      "User-Agent": "halo-theme-higan-hz-toolchain-updater",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch pnpm latest metadata: ${response.status} ${response.statusText}`);
  }

  const metadata = await response.json();
  const version = typeof metadata.version === "string" ? metadata.version.trim() : "";

  if (!parseSemVer(version)) {
    throw new Error(`Invalid pnpm latest version: ${version || "<empty>"}`);
  }

  return version;
};

const readFileWithLineEnding = async (filePath) => {
  const content = stripUtf8Bom(await fs.readFile(path.resolve(process.cwd(), filePath), "utf8"));

  return {
    content,
    lineEnding: content.includes("\r\n") ? "\r\n" : "\n",
  };
};

const maybeWriteFile = async (filePath, nextContent) => {
  if (dryRun) {
    return;
  }

  await fs.writeFile(path.resolve(process.cwd(), filePath), nextContent, "utf8");
};

const collectFilesByName = async (directoryPath, fileName) => {
  const entries = await fs.readdir(path.resolve(process.cwd(), directoryPath), { withFileTypes: true });
  const filePaths = [];

  for (const entry of entries) {
    const relativePath = path.join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      filePaths.push(...(await collectFilesByName(relativePath, fileName)));
      continue;
    }

    if (entry.isFile() && entry.name === fileName) {
      filePaths.push(relativePath);
    }
  }

  return filePaths.sort((left, right) => left.localeCompare(right));
};

const updatePackageJson = async (nodeMajor, pnpmVersion) => {
  const { content, lineEnding } = await readFileWithLineEnding(packageJsonPath);
  const packageJson = JSON.parse(content);
  const updatedFields = [];
  packageJson.engines ??= {};

  const nextNodeRange = `>=${nodeMajor}`;
  const nextPnpmRange = `^${pnpmVersion}`;
  const nextPackageManager = `pnpm@${pnpmVersion}`;

  if (packageJson.engines?.node !== nextNodeRange) {
    packageJson.engines.node = nextNodeRange;
    updatedFields.push(`engines.node -> ${nextNodeRange}`);
  }

  if (packageJson.engines?.pnpm !== nextPnpmRange) {
    packageJson.engines.pnpm = nextPnpmRange;
    updatedFields.push(`engines.pnpm -> ${nextPnpmRange}`);
  }

  if (packageJson.packageManager !== nextPackageManager) {
    packageJson.packageManager = nextPackageManager;
    updatedFields.push(`packageManager -> ${nextPackageManager}`);
  }

  if (updatedFields.length === 0) {
    return [];
  }

  const nextContent = `${JSON.stringify(packageJson, null, 2)}${lineEnding}`;
  await maybeWriteFile(packageJsonPath, nextContent.replace(/\n/gu, lineEnding));
  return updatedFields;
};

const replaceNodeVersionValue = (content, nodeMajor) => {
  const nodeVersionPattern = /^(\s*node-version:\s*)(["']?)(?:lts\/\*|\d+)\2(\s*(?:#.*)?)$/gmu;
  let changed = false;

  const nextContent = content.replace(nodeVersionPattern, (_, prefix, quote, suffix) => {
    changed = true;
    const wrappedValue = `${quote}${nodeMajor}${quote}`;
    return `${prefix}${wrappedValue}${suffix}`;
  });

  return {
    changed,
    nextContent,
  };
};

const updateToolchainFile = async (filePath, nodeMajor, pnpmVersion) => {
  const { content, lineEnding } = await readFileWithLineEnding(filePath);
  const updates = [];
  let nextContent = content;

  if (content.includes("actions/setup-node@")) {
    const { changed, nextContent: replacedContent } = replaceNodeVersionValue(nextContent, nodeMajor);

    if (changed && replacedContent !== nextContent) {
      nextContent = replacedContent;
      updates.push(`node-version -> ${nodeMajor}`);
    }
  }

  if (filePath === setupActionPath) {
    const pnpmAnchor = /pnpm-version:\s*\n(?:\s+.*\n)*?\s+default:\s*"(.*?)"/u;
    const pnpmMatch = nextContent.match(pnpmAnchor);
    if (!pnpmMatch) {
      throw new Error(`Could not find pnpm-version default in ${setupActionPath}`);
    }

    if (pnpmMatch[1] !== pnpmVersion) {
      nextContent = nextContent.replace(pnpmAnchor, (match) =>
        match.replace(`default: "${pnpmMatch[1]}"`, `default: "${pnpmVersion}"`),
      );
      updates.push(`inputs.pnpm-version.default -> ${pnpmVersion}`);
    }
  }

  if (updates.length === 0) {
    return [];
  }

  await maybeWriteFile(filePath, nextContent.replace(/\n/gu, lineEnding));
  return updates;
};

const updateToolchainFiles = async (nodeMajor, pnpmVersion) => {
  const workflowEntries = await fs.readdir(path.resolve(process.cwd(), workflowsDirPath), { withFileTypes: true });
  const workflowFiles = workflowEntries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".yml"))
    .map((entry) => path.join(workflowsDirPath, entry.name))
    .sort((left, right) => left.localeCompare(right));
  const actionFiles = await collectFilesByName(actionsDirPath, "action.yml");
  const targetFiles = [...actionFiles, ...workflowFiles];

  const updateGroups = [];

  for (const filePath of targetFiles) {
    const updates = await updateToolchainFile(filePath, nodeMajor, pnpmVersion);

    if (updates.length > 0) {
      updateGroups.push({ filePath, updates });
    }
  }

  return updateGroups;
};

const nodeMajor = await fetchLatestNodeMajor();
const pnpmVersion = await fetchLatestPnpmVersion();

console.log(`Resolved latest Node.js major: ${nodeMajor}`);
console.log(`Resolved latest pnpm version: ${pnpmVersion}`);

const toolchainFileUpdateGroups = await updateToolchainFiles(nodeMajor, pnpmVersion);

const updateGroups = [
  {
    filePath: packageJsonPath,
    updates: await updatePackageJson(nodeMajor, pnpmVersion),
  },
  ...toolchainFileUpdateGroups,
].filter(({ updates }) => updates.length > 0);

if (updateGroups.length === 0) {
  console.log("No toolchain version updates were required");
} else {
  for (const { filePath, updates } of updateGroups) {
    console.log(`Updated ${filePath}`);

    for (const update of updates) {
      console.log(`- ${update}`);
    }
  }
}

await appendGitHubOutput("changed", updateGroups.length > 0 ? "true" : "false");
await appendGitHubOutput("node_major", String(nodeMajor));
await appendGitHubOutput("pnpm_version", pnpmVersion);
await appendGitHubOutput("updated_files", updateGroups.map(({ filePath }) => filePath).join(","));
await appendGitHubOutput(
  "update_count",
  String(updateGroups.reduce((count, group) => count + group.updates.length, 0)),
);

if (dryRun && updateGroups.length > 0) {
  process.exitCode = 10;
}
