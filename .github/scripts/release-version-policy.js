import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const BUMP_LEVELS = {
  patch: 0,
  minor: 1,
  major: 2,
};

const BUMP_NAMES = ["patch", "minor", "major"];
const DOCS_SUBJECT_RE = /^docs(!{0,2})?:/u;

function compareStableVersions(left, right) {
  const a = parseStableVersion(left);
  const b = parseStableVersion(right);

  if (a.major !== b.major) return a.major - b.major;
  if (a.minor !== b.minor) return a.minor - b.minor;
  return a.patch - b.patch;
}

export function parseStableVersion(version) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/u.exec(String(version).trim());
  if (!match) {
    throw new Error(`Expected stable semantic version x.y.z, got: ${version}`);
  }

  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
  };
}

export function inferSubjectBumpLevel(subject) {
  const colonIndex = subject.indexOf(":");
  const prefix = colonIndex === -1 ? subject : subject.slice(0, colonIndex);
  const bangCount = [...prefix].filter((char) => char === "!").length;

  if (bangCount >= 2) {
    return BUMP_LEVELS.major;
  }

  if (bangCount === 1) {
    return BUMP_LEVELS.minor;
  }

  return BUMP_LEVELS.patch;
}

export function inferHighestBumpLevel(subjects) {
  let highest = BUMP_LEVELS.patch;

  for (const subject of subjects) {
    highest = Math.max(highest, inferSubjectBumpLevel(subject));
  }

  return highest;
}

export function getCommitSubjects(commitRange) {
  const args = ["log", "--no-merges", "--format=%s"];
  if (commitRange) {
    args.push(...commitRange.split(/\s+/u).filter(Boolean));
  }

  const output = execFileSync("git", args, { encoding: "utf8" });
  return output
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter((line) => Boolean(line) && !DOCS_SUBJECT_RE.test(line));
}

export function bumpVersion(baseVersion, bumpLevel) {
  const parsed = parseStableVersion(baseVersion);

  if (bumpLevel >= BUMP_LEVELS.major) {
    return `${parsed.major + 1}.0.0`;
  }

  if (bumpLevel === BUMP_LEVELS.minor) {
    return `${parsed.major}.${parsed.minor + 1}.0`;
  }

  return `${parsed.major}.${parsed.minor}.${parsed.patch + 1}`;
}

export function inferNextVersion(baseVersion, commitRange) {
  const subjects = getCommitSubjects(commitRange);
  const bumpLevel = inferHighestBumpLevel(subjects);
  return {
    bump: BUMP_NAMES[bumpLevel],
    subjects,
    version: bumpVersion(baseVersion, bumpLevel),
  };
}

export function getLatestStableTag() {
  return execFileSync("git", ["tag", "--list", "v*"], { encoding: "utf8" })
    .split(/\r?\n/u)
    .map((tag) => tag.trim())
    .filter((tag) => /^v\d+\.\d+\.\d+$/u.test(tag))
    .sort((left, right) => compareStableVersions(left.slice(1), right.slice(1)))
    .at(-1);
}

function printUsageAndExit() {
  console.error(
    [
      "Usage:",
      "  node .github/scripts/release-version-policy.js latest-stable-tag",
      "  node .github/scripts/release-version-policy.js bump <commit-range>",
      "  node .github/scripts/release-version-policy.js next <base-version> <commit-range>",
      "  node .github/scripts/release-version-policy.js check <base-version> <target-version> <commit-range>",
    ].join("\n"),
  );
  process.exit(1);
}

const currentFilePath = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === currentFilePath) {
  const command = process.argv[2];

  if (command === "latest-stable-tag") {
    const tag = getLatestStableTag();
    if (!tag) {
      throw new Error("Unable to find previous stable release tag");
    }
    console.log(tag);
  } else if (command === "bump") {
    const commitRange = process.argv[3];
    if (!commitRange) {
      printUsageAndExit();
    }
    const subjects = getCommitSubjects(commitRange);
    console.log(BUMP_NAMES[inferHighestBumpLevel(subjects)]);
  } else if (command === "next") {
    const baseVersion = process.argv[3];
    const commitRange = process.argv[4];
    if (!baseVersion || !commitRange) {
      printUsageAndExit();
    }
    console.log(inferNextVersion(baseVersion, commitRange).version);
  } else if (command === "check") {
    const baseVersion = process.argv[3];
    const targetVersion = process.argv[4];
    const commitRange = process.argv[5];
    if (!baseVersion || !targetVersion || !commitRange) {
      printUsageAndExit();
    }
    const result = inferNextVersion(baseVersion, commitRange);
    if (targetVersion !== result.version) {
      throw new Error(
        `Release version must be ${result.version} (${result.bump} bump from ${baseVersion}) for commits in ${commitRange}; got ${targetVersion}`,
      );
    }
  } else {
    printUsageAndExit();
  }
}
