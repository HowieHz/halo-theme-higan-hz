import fs from "node:fs/promises";
import path from "node:path";

const packageJsonPath = "package.json";
const githubDirPath = ".github";
const workflowsDirPath = path.join(githubDirPath, "workflows");
const actionsDirPath = path.join(githubDirPath, "actions");
const setupActionPath = path.join(actionsDirPath, "setup-node-pnpm", "action.yml");
const dryRun = process.argv.includes("--dry-run");
const releaseDelayMs = 24 * 60 * 60 * 1000;
const toolchainUpdaterUserAgent = "halo-theme-higan-hz-toolchain-updater";

const appendGitHubOutput = async (name, value) => {
  const outputPath = process.env.GITHUB_OUTPUT;

  if (!outputPath) {
    return;
  }

  await fs.appendFile(outputPath, `${name}=${value}\n`, "utf8");
};

const compareNumbers = (left, right) => left - right;

const hasReachedReleaseDelay = (value, releaseCutoffTimestamp = Date.now() - releaseDelayMs) => {
  const timestamp = Date.parse(value);

  if (Number.isNaN(timestamp)) {
    throw new Error(`Invalid release timestamp: ${value || "<empty>"}`);
  }

  return timestamp <= releaseCutoffTimestamp;
};

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

const parseTrackedNodeMajor = (value) => {
  const match = /^>=\s*(\d+)$/u.exec(value ?? "");

  if (!match) {
    throw new Error(`Unsupported package.json engines.node range: ${value || "<empty>"}`);
  }

  return Number(match[1]);
};

const parseTrackedPnpmVersion = (value) => {
  const match = /^pnpm@(.+)$/u.exec(value ?? "");
  const version = match?.[1]?.trim() ?? "";

  if (!parseSemVer(version)) {
    throw new Error(`Unsupported package.json packageManager value: ${value || "<empty>"}`);
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

const readTrackedToolchainVersions = async () => {
  const { content } = await readFileWithLineEnding(packageJsonPath);
  const packageJson = JSON.parse(content);

  return {
    nodeMajor: parseTrackedNodeMajor(packageJson.engines?.node),
    pnpmVersion: parseTrackedPnpmVersion(packageJson.packageManager),
  };
};

// Only advance to the current latest release after that exact latest has aged
// for at least 24 hours. If 1.1.0 becomes latest 12 hours after 1.0.0, we keep
// the repository on its current tracked version instead of updating to 1.0.0 or
// 1.1.0. "Some older version is old enough" is intentionally not sufficient.
const fetchLatestNodeRelease = async () => {
  const indexResponse = await fetch("https://nodejs.org/dist/index.json", {
    headers: {
      Accept: "application/json",
      "User-Agent": toolchainUpdaterUserAgent,
    },
  });

  if (!indexResponse.ok) {
    throw new Error(`Failed to fetch Node.js releases: ${indexResponse.status} ${indexResponse.statusText}`);
  }

  const releases = await indexResponse.json();
  const latestVersion = releases
    .map((release) => parseSemVer(release.version))
    .filter(Boolean)
    .sort((left, right) => compareSemVer(right, left))[0];

  if (!latestVersion) {
    throw new Error("No stable Node.js versions found in release index");
  }

  const latestTag = `v${latestVersion.major}.${latestVersion.minor}.${latestVersion.patch}`;

  // nodejs.org/dist/index.json only exposes YYYY-MM-DD, which is not precise
  // enough for a strict 24-hour delay. Verify the exact latest tag timestamp via
  // the matching GitHub release before deciding whether to update Node.js.
  const releaseResponse = await fetch(`https://api.github.com/repos/nodejs/node/releases/tags/${latestTag}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": toolchainUpdaterUserAgent,
    },
  });

  if (!releaseResponse.ok) {
    throw new Error(
      `Failed to fetch Node.js release metadata for ${latestTag}: ${releaseResponse.status} ${releaseResponse.statusText}`,
    );
  }

  const releaseMetadata = await releaseResponse.json();
  const publishedAt = typeof releaseMetadata.published_at === "string" ? releaseMetadata.published_at : "";

  if (publishedAt === "") {
    throw new Error(`Missing published_at for Node.js release ${latestTag}`);
  }

  return {
    major: latestVersion.major,
    publishedAt,
    version: latestTag,
  };
};

const fetchLatestPnpmRelease = async () => {
  const response = await fetch("https://registry.npmjs.org/pnpm", {
    headers: {
      Accept: "application/json",
      "User-Agent": toolchainUpdaterUserAgent,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch pnpm metadata: ${response.status} ${response.statusText}`);
  }

  const metadata = await response.json();

  // Respect the registry latest dist-tag. If latest itself is still within the
  // cooldown window, do not fall back to an older pnpm release that happens to
  // be older than 24 hours.
  const latestVersion = typeof metadata["dist-tags"]?.latest === "string" ? metadata["dist-tags"].latest.trim() : "";
  const publishedAt = typeof metadata.time?.[latestVersion] === "string" ? metadata.time[latestVersion] : "";

  if (!parseSemVer(latestVersion)) {
    throw new Error(`Invalid pnpm latest version: ${latestVersion || "<empty>"}`);
  }

  if (publishedAt === "") {
    throw new Error(`Missing pnpm publish time for latest version ${latestVersion}`);
  }

  return {
    publishedAt,
    version: latestVersion,
  };
};

const logLatestReleaseStatus = (toolName, latestVersion, publishedAt, eligible, appliedVersion) => {
  if (eligible) {
    console.log(`Resolved ${toolName} latest ${latestVersion} published at ${publishedAt}`);
    return;
  }

  console.log(
    `Skipped ${toolName} update because latest ${latestVersion} was published at ${publishedAt} and has not reached the 24-hour cooldown`,
  );
  console.log(`Keeping tracked ${toolName} version: ${appliedVersion}`);
};

const resolveToolchainTargets = async () => {
  const trackedVersions = await readTrackedToolchainVersions();
  const [latestNodeRelease, latestPnpmRelease] = await Promise.all([fetchLatestNodeRelease(), fetchLatestPnpmRelease()]);
  const releaseCutoffTimestamp = Date.now() - releaseDelayMs;
  const nodeEligible = hasReachedReleaseDelay(latestNodeRelease.publishedAt, releaseCutoffTimestamp);
  const pnpmEligible = hasReachedReleaseDelay(latestPnpmRelease.publishedAt, releaseCutoffTimestamp);

  logLatestReleaseStatus(
    "Node.js",
    latestNodeRelease.version,
    latestNodeRelease.publishedAt,
    nodeEligible,
    String(trackedVersions.nodeMajor),
  );
  logLatestReleaseStatus(
    "pnpm",
    latestPnpmRelease.version,
    latestPnpmRelease.publishedAt,
    pnpmEligible,
    trackedVersions.pnpmVersion,
  );

  return {
    nodeMajor: nodeEligible ? latestNodeRelease.major : trackedVersions.nodeMajor,
    pnpmVersion: pnpmEligible ? latestPnpmRelease.version : trackedVersions.pnpmVersion,
  };
};

const updatePackageJson = async (nodeMajor, pnpmVersion) => {
  const { content, lineEnding } = await readFileWithLineEnding(packageJsonPath);
  const packageJson = JSON.parse(content);
  const updatedFields = [];

  packageJson.engines ??= {};

  const nextNodeRange = `>=${nodeMajor}`;
  const nextPnpmRange = `^${pnpmVersion}`;
  const nextPackageManager = `pnpm@${pnpmVersion}`;

  if (packageJson.engines.node !== nextNodeRange) {
    packageJson.engines.node = nextNodeRange;
    updatedFields.push(`engines.node -> ${nextNodeRange}`);
  }

  if (packageJson.engines.pnpm !== nextPnpmRange) {
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
    .filter((entry) => entry.isFile() && (entry.name.endsWith(".yml") || entry.name.endsWith(".yaml")))
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

const { nodeMajor, pnpmVersion } = await resolveToolchainTargets();

console.log(`Applied Node.js major target: ${nodeMajor}`);
console.log(`Applied pnpm version target: ${pnpmVersion}`);

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
