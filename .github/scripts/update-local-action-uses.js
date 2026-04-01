import fs from "node:fs/promises";
import path from "node:path";

const defaultActionRoot = path.join(".github", "actions");
const targetFilesFromArgs = process.argv.slice(2);
const releaseDelayMs = 24 * 60 * 60 * 1000;
const releaseCutoffTimestamp = Date.now() - releaseDelayMs;

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
const usesPattern =
  /^(\s*-?\s*uses:\s*)([A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(?:\/[A-Za-z0-9_./-]+)?)@([^\s#]+)(\s*(#.*)?)$/u;
const commitRefPattern = /^[0-9a-f]{7,40}$/iu;
const releaseTagUrlPattern = /\/releases\/tag\/([^/\s#]+)$/u;
const versionCache = new Map();
const latestReleaseCache = new Map();
const repoMetadataCache = new Map();
const tagCommitCache = new Map();
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

  return fs.appendFile(outputPath, `${name}=${value}\n`, "utf8");
};

const hasReachedReleaseDelay = (value) => {
  const timestamp = Date.parse(value);

  if (Number.isNaN(timestamp)) {
    throw new Error(`Invalid release timestamp: ${value || "<empty>"}`);
  }

  return timestamp <= releaseCutoffTimestamp;
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

const extractRepositoryName = (usesTarget) => usesTarget.split("/").slice(0, 2).join("/");

const isCommitRef = (ref) => commitRefPattern.test(ref);

const extractSemVerTagFromComment = (comment) => {
  if (!comment.includes("#")) {
    return null;
  }

  const releaseTagUrlMatch = comment.match(releaseTagUrlPattern);

  if (releaseTagUrlMatch && /^v?\d+(?:\.\d+\.\d+)?$/u.test(releaseTagUrlMatch[1])) {
    return releaseTagUrlMatch[1];
  }

  const inlineTagMatch = comment.match(/#\s*(v?\d+(?:\.\d+\.\d+)?)\b/u);
  return inlineTagMatch ? inlineTagMatch[1] : null;
};

const replaceCommentTag = (comment, currentTag, nextTag) => {
  if (!comment || currentTag === nextTag) {
    return comment;
  }

  return comment
    .replace(`/releases/tag/${currentTag}`, `/releases/tag/${nextTag}`)
    .replace(
      new RegExp(`(^|#\\s*)${currentTag.replace(/\./gu, "\\.")}(?=\\b)`, "u"),
      (_, prefix) => `${prefix}${nextTag}`,
    );
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

const fetchRepositoryMetadata = async (repository) => {
  const cached = repoMetadataCache.get(repository);

  if (cached) {
    return cached;
  }

  const response = await fetch(`https://api.github.com/repos/${repository}`, {
    headers: githubHeaders,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch repository metadata for ${repository}: ${response.status} ${response.statusText}`);
  }

  const metadata = await response.json();
  repoMetadataCache.set(repository, metadata);
  return metadata;
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

// Only advance semver-tagged action references after the current latest release
// itself has aged for at least 24 hours. If v6.3.0 is the newest tag but was
// published 12 hours ago, we intentionally keep the current ref instead of
// moving to v6.2.0 or v6.3.0.
const fetchLatestStableRelease = async (repository) => {
  const cached = latestReleaseCache.get(repository);

  if (cached) {
    return cached;
  }

  const latestVersion = await fetchLatestStableVersion(repository);
  const response = await fetch(`https://api.github.com/repos/${repository}/releases/tags/${encodeURIComponent(latestVersion.tag)}`, {
    headers: githubHeaders,
  });

  if (response.status === 404) {
    const result = {
      eligible: false,
      latestVersion,
      publishedAt: null,
      skipReason: "missing_release",
    };
    latestReleaseCache.set(repository, result);
    logLatestReleaseStatus(
      repository,
      result.latestVersion,
      result.publishedAt,
      result.eligible,
      result.skipReason,
    );
    return result;
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch release metadata for ${repository}@${latestVersion.tag}: ${response.status} ${response.statusText}`);
  }

  const release = await response.json();
  const publishedAt = typeof release.published_at === "string" ? release.published_at : "";

  if (publishedAt === "") {
    throw new Error(`Missing published_at for ${repository}@${latestVersion.tag}`);
  }

  const result = {
    eligible: hasReachedReleaseDelay(publishedAt),
    latestVersion,
    publishedAt,
    skipReason: null,
  };
  latestReleaseCache.set(repository, result);
  logLatestReleaseStatus(repository, result.latestVersion, result.publishedAt, result.eligible, result.skipReason);
  return result;
};

const logLatestReleaseStatus = (repository, latestVersion, publishedAt, eligible, skipReason) => {
  if (eligible) {
    console.log(`Resolved ${repository} latest release ${latestVersion.tag} published at ${publishedAt}`);
    return;
  }

  if (skipReason === "missing_release") {
    console.log(
      `Skipped ${repository} because latest semver tag ${latestVersion.tag} does not have a GitHub release, so a strict 24-hour cooldown cannot be verified`,
    );
    return;
  }

  console.log(
    `Skipped ${repository} because latest release ${latestVersion.tag} was published at ${publishedAt} and has not reached the 24-hour cooldown`,
  );
};

const fetchCommitShaForTag = async (repository, tag) => {
  const cacheKey = `${repository}@${tag}`;
  const cached = tagCommitCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const response = await fetch(`https://api.github.com/repos/${repository}/git/ref/tags/${encodeURIComponent(tag)}`, {
    headers: githubHeaders,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch tag ref for ${repository}@${tag}: ${response.status} ${response.statusText}`);
  }

  const refData = await response.json();
  let commitSha = refData.object.sha;

  if (refData.object.type === "tag") {
    const annotatedTagResponse = await fetch(`https://api.github.com/repos/${repository}/git/tags/${commitSha}`, {
      headers: githubHeaders,
    });

    if (!annotatedTagResponse.ok) {
      throw new Error(
        `Failed to resolve annotated tag for ${repository}@${tag}: ${annotatedTagResponse.status} ${annotatedTagResponse.statusText}`,
      );
    }

    const annotatedTag = await annotatedTagResponse.json();
    commitSha = annotatedTag.object.sha;
  }

  tagCommitCache.set(cacheKey, commitSha);
  return commitSha;
};

const fetchDefaultBranchHeadSha = async (repository) => {
  const metadata = await fetchRepositoryMetadata(repository);
  const response = await fetch(`https://api.github.com/repos/${repository}/commits/${metadata.default_branch}`, {
    headers: githubHeaders,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch default branch HEAD for ${repository}: ${response.status} ${response.statusText}`);
  }

  const commit = await response.json();
  return commit.sha;
};

const buildCommitRefUpdate = async (repository, currentRef, suffix) => {
  const commentTag = extractSemVerTagFromComment(suffix);

  if (!commentTag) {
    // A raw commit pin without a semver tag comment tracks the default branch
    // head by design, so there is no release timestamp available for cooldown.
    const targetRef = await fetchDefaultBranchHeadSha(repository);
    return {
      nextRef: targetRef,
      nextSuffix: suffix,
      summary: `${currentRef} -> ${targetRef.slice(0, 12)}`,
    };
  }

  const latestRelease = await fetchLatestStableRelease(repository);
  const targetTag = resolveTargetRef(commentTag, latestRelease.latestVersion);

  if (!targetTag || !latestRelease.eligible) {
    return null;
  }

  const targetRef = await fetchCommitShaForTag(repository, targetTag);
  return {
    nextRef: targetRef,
    nextSuffix: replaceCommentTag(suffix, commentTag, targetTag),
    summary: `${currentRef.slice(0, 12)} -> ${targetRef.slice(0, 12)} (${commentTag} -> ${targetTag})`,
  };
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

    const [, prefix, usesTarget, currentRef, suffix = ""] = match;
    const repository = extractRepositoryName(usesTarget);
    let update = null;

    if (isCommitRef(currentRef)) {
      update = await buildCommitRefUpdate(repository, currentRef, suffix);
    } else {
      const latestRelease = await fetchLatestStableRelease(repository);
      const targetVersion = resolveTargetRef(currentRef, latestRelease.latestVersion);

      if (targetVersion && latestRelease.eligible) {
        update = {
          nextRef: targetVersion,
          nextSuffix: replaceCommentTag(suffix, currentRef, targetVersion),
          summary: `${currentRef} -> ${targetVersion}`,
        };
      }
    }

    if (!update) {
      continue;
    }

    if (update.nextRef === currentRef && update.nextSuffix === suffix) {
      continue;
    }

    lines[index] = `${prefix}${usesTarget}@${update.nextRef}${update.nextSuffix}`;
    updates.push(`${usesTarget}: ${update.summary}`);
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
