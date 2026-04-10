import fs from "node:fs/promises";
import path from "node:path";

const rootPackageJsonPath = "package.json";
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
  const { content } = await readFileWithLineEnding(rootPackageJsonPath);
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
const fetchLatestNodeLtsRelease = async () => {
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
    .filter((release) => typeof release.lts === "string" && release.lts.trim() !== "")
    .map((release) => parseSemVer(release.version))
    .filter(Boolean)
    .sort((left, right) => compareSemVer(right, left))[0];

  if (!latestVersion) {
    throw new Error("No LTS Node.js versions found in release index");
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
  const [latestNodeLtsRelease, latestPnpmRelease] = await Promise.all([
    fetchLatestNodeLtsRelease(),
    fetchLatestPnpmRelease(),
  ]);
  const releaseCutoffTimestamp = Date.now() - releaseDelayMs;
  const nodeEligible = hasReachedReleaseDelay(latestNodeLtsRelease.publishedAt, releaseCutoffTimestamp);
  const pnpmEligible = hasReachedReleaseDelay(latestPnpmRelease.publishedAt, releaseCutoffTimestamp);

  logLatestReleaseStatus(
    "Node.js LTS",
    latestNodeLtsRelease.version,
    latestNodeLtsRelease.publishedAt,
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
    nodeMajor: nodeEligible ? latestNodeLtsRelease.major : trackedVersions.nodeMajor,
    pnpmVersion: pnpmEligible ? latestPnpmRelease.version : trackedVersions.pnpmVersion,
  };
};

const updatePackageJson = async (nodeMajor, pnpmVersion) => {
  const { content, lineEnding } = await readFileWithLineEnding(rootPackageJsonPath);
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
  await maybeWriteFile(rootPackageJsonPath, nextContent.replace(/\n/gu, lineEnding));
  return updatedFields;
};

const replaceNodeVersionValue = (content, nextNodeVersion) => {
  const nodeVersionPattern = /^(\s*node-version:\s*)(["']?)(?:lts\/\*|\d+)\2(\s*(?:#.*)?)$/gmu;
  let changed = false;

  const nextContent = content.replace(nodeVersionPattern, (_, prefix, quote, suffix) => {
    changed = true;
    const wrappedValue = `${quote}${nextNodeVersion}${quote}`;
    return `${prefix}${wrappedValue}${suffix}`;
  });

  return {
    changed,
    nextContent,
  };
};

const replaceCompositeActionInputDefault = (content, lineEnding, inputName, nextValue) => {
  const lines = content.split(/\r?\n/u);
  let changed = false;
  let insideTargetInput = false;
  let foundDefault = false;

  const nextLines = lines.map((line) => {
    const inputHeaderMatch = /^ {2}([a-z0-9-]+):\s*$/iu.exec(line);

    if (inputHeaderMatch) {
      insideTargetInput = inputHeaderMatch[1] === inputName;
      return line;
    }

    if (!insideTargetInput) {
      return line;
    }

    const defaultMatch = /^(\s+default:\s*")([^"]*)(".*)$/u.exec(line);

    if (!defaultMatch) {
      return line;
    }

    foundDefault = true;

    if (defaultMatch[2] === nextValue) {
      return line;
    }

    changed = true;
    return `${defaultMatch[1]}${nextValue}${defaultMatch[3]}`;
  });

  if (!foundDefault) {
    throw new Error(`Could not find ${inputName} default in ${setupActionPath}`);
  }

  return {
    changed,
    nextContent: nextLines.join(lineEnding),
  };
};

const updateToolchainFile = async (filePath, nodeMajor, pnpmVersion) => {
  const { content, lineEnding } = await readFileWithLineEnding(filePath);
  const updates = [];
  let nextContent = content;

  if (content.includes("actions/setup-node@")) {
    const nextNodeVersion = String(nodeMajor);
    const { changed, nextContent: replacedContent } = replaceNodeVersionValue(nextContent, nextNodeVersion);

    if (changed && replacedContent !== nextContent) {
      nextContent = replacedContent;
      updates.push(`node-version -> ${nextNodeVersion}`);
    }
  }

  if (filePath === setupActionPath) {
    const { changed: nodeDefaultChanged, nextContent: nodeDefaultContent } = replaceCompositeActionInputDefault(
      nextContent,
      lineEnding,
      "node-version",
      String(nodeMajor),
    );

    if (nodeDefaultChanged) {
      nextContent = nodeDefaultContent;
      updates.push(`inputs.node-version.default -> ${nodeMajor}`);
    }

    const { changed, nextContent: replacedContent } = replaceCompositeActionInputDefault(
      nextContent,
      lineEnding,
      "pnpm-version",
      pnpmVersion,
    );

    if (changed) {
      nextContent = replacedContent;
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
    filePath: rootPackageJsonPath,
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
