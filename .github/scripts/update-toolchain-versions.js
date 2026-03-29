import fs from "node:fs/promises";
import path from "node:path";

const packageJsonPath = "package.json";
const setupActionPath = path.join(".github", "actions", "setup-node-pnpm", "action.yml");
const updateLocalActionUsesWorkflowPath = path.join(".github", "workflows", "update-local-action-uses.yml");
const updateToolchainVersionsWorkflowPath = path.join(".github", "workflows", "update-toolchain-versions.yml");
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
  const content = await fs.readFile(path.resolve(process.cwd(), filePath), "utf8");

  return {
    content,
    lineEnding: content.includes("\r\n") ? "\r\n" : "\n",
  };
};

const maybeWriteFile = async (filePath, nextContent) => {
  if (dryRun) {
    return;
  }

  await fs.writeFile(path.resolve(process.cwd(), filePath), nextContent);
};

const updatePackageJson = async (nodeMajor, pnpmVersion) => {
  const { content, lineEnding } = await readFileWithLineEnding(packageJsonPath);
  const packageJson = JSON.parse(content);
  const updatedFields = [];

  const nextNodeRange = `>= ${nodeMajor}`;
  const nextPnpmRange = `>= ${pnpmVersion}`;
  const nextPackageManager = `pnpm@${pnpmVersion}`;

  if (packageJson.devEngines?.packageManager?.version !== nextPnpmRange) {
    packageJson.devEngines.packageManager.version = nextPnpmRange;
    updatedFields.push(`devEngines.packageManager.version -> ${nextPnpmRange}`);
  }

  if (packageJson.devEngines?.runtime?.version !== nextNodeRange) {
    packageJson.devEngines.runtime.version = nextNodeRange;
    updatedFields.push(`devEngines.runtime.version -> ${nextNodeRange}`);
  }

  if (packageJson.engines?.node !== nextNodeRange) {
    packageJson.engines.node = nextNodeRange;
    updatedFields.push(`engines.node -> ${nextNodeRange}`);
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

const updateSetupAction = async (nodeMajor, pnpmVersion) => {
  const { content } = await readFileWithLineEnding(setupActionPath);
  const updates = [];
  let nextContent = content;

  const nodeAnchor = /node-version:\s*\n(?:\s+.*\n)*?\s+default:\s*"(.*?)"/u;
  const nodeMatch = nextContent.match(nodeAnchor);
  if (!nodeMatch) {
    throw new Error(`Could not find node-version default in ${setupActionPath}`);
  }

  if (nodeMatch[1] !== String(nodeMajor)) {
    nextContent = nextContent.replace(nodeAnchor, (match) =>
      match.replace(`default: "${nodeMatch[1]}"`, `default: "${nodeMajor}"`),
    );
    updates.push(`inputs.node-version.default -> ${nodeMajor}`);
  }

  const pnpmAnchor = /pnpm-version:\s*\n(?:\s+.*\n)*?\s+default:\s*"(.*?)"/u;
  const pnpmMatch = nextContent.match(pnpmAnchor);
  if (!pnpmMatch) {
    throw new Error(`Could not find pnpm-version default in ${setupActionPath}`);
  }

  if (pnpmMatch[1] !== pnpmVersion) {
    nextContent = nextContent.replace(pnpmAnchor, (match) => match.replace(`default: "${pnpmMatch[1]}"`, `default: "${pnpmVersion}"`));
    updates.push(`inputs.pnpm-version.default -> ${pnpmVersion}`);
  }

  if (updates.length === 0) {
    return [];
  }

  await maybeWriteFile(setupActionPath, nextContent);
  return updates;
};

const updateWorkflowNodeVersion = async (filePath, nodeMajor) => {
  const { content } = await readFileWithLineEnding(filePath);
  const pattern = /^(\s*node-version:\s*)(\d+)(\s*)$/mu;
  const match = content.match(pattern);

  if (!match) {
    throw new Error(`Could not find node-version in ${filePath}`);
  }

  if (Number(match[2]) === nodeMajor) {
    return [];
  }

  const nextContent = content.replace(pattern, `$1${nodeMajor}$3`);
  await maybeWriteFile(filePath, nextContent);
  return [`node-version -> ${nodeMajor}`];
};

const nodeMajor = await fetchLatestNodeMajor();
const pnpmVersion = await fetchLatestPnpmVersion();

console.log(`Resolved latest Node.js major: ${nodeMajor}`);
console.log(`Resolved latest pnpm version: ${pnpmVersion}`);

const updateGroups = [
  {
    filePath: packageJsonPath,
    updates: await updatePackageJson(nodeMajor, pnpmVersion),
  },
  {
    filePath: setupActionPath,
    updates: await updateSetupAction(nodeMajor, pnpmVersion),
  },
  {
    filePath: updateLocalActionUsesWorkflowPath,
    updates: await updateWorkflowNodeVersion(updateLocalActionUsesWorkflowPath, nodeMajor),
  },
  {
    filePath: updateToolchainVersionsWorkflowPath,
    updates: await updateWorkflowNodeVersion(updateToolchainVersionsWorkflowPath, nodeMajor),
  },
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
