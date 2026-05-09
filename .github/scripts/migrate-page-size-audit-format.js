import { execFileSync } from "node:child_process";
import { readFile, readdir, writeFile } from "node:fs/promises";

import { decodeAuditFile, encodeAuditFile } from "./page-size-audit-schema.js";

const RESULTS_DIR = ".github/page_size_audit_results";

function resolveRepoSlug() {
  if (process.env.GITHUB_REPOSITORY) return process.env.GITHUB_REPOSITORY;

  try {
    const remote = execFileSync("git", ["remote", "get-url", "origin"], { encoding: "utf8" }).trim();
    const match = remote.match(/[:/]([^/]+)\/([^/]+?)(?:\.git)?$/);
    if (match) return `${match[1]}/${match[2]}`;
  } catch {
    // ignore
  }

  throw new Error("Unable to resolve repository slug for GitHub API requests.");
}

async function fetchAllReleaseTimes(repoSlug) {
  const releaseTimes = new Map();
  let page = 1;

  while (true) {
    const response = await fetch(`https://api.github.com/repos/${repoSlug}/releases?per_page=100&page=${page}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "halo-theme-higan-hz-format-migration",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch releases for ${repoSlug}: ${response.status} ${response.statusText}`);
    }

    const releases = await response.json();
    if (!Array.isArray(releases) || releases.length === 0) break;

    for (const release of releases) {
      if (release?.tag_name) {
        releaseTimes.set(String(release.tag_name), release.published_at || release.created_at || "");
      }
    }

    if (releases.length < 100) break;
    page += 1;
  }

  return releaseTimes;
}

async function main() {
  const repoSlug = resolveRepoSlug();
  const releaseTimes = await fetchAllReleaseTimes(repoSlug);
  const fileNames = (await readdir(RESULTS_DIR)).filter((name) => /^v\d+\.\d+\.\d+\.json$/.test(name));

  let updatedCount = 0;

  for (const fileName of fileNames) {
    const filePath = `${RESULTS_DIR}/${fileName}`;
    const raw = JSON.parse(await readFile(filePath, "utf8"));
    const auditFile = decodeAuditFile(raw);
    const tagName = fileName.replace(/\.json$/, "");
    const publishedAt = Date.parse(releaseTimes.get(tagName) || "");

    auditFile.metadata.publishedAt = Number.isFinite(publishedAt) ? publishedAt : 0;

    const nextContent = `${JSON.stringify(encodeAuditFile(auditFile), null, 2)}\n`;
    const currentContent = await readFile(filePath, "utf8");
    if (currentContent !== nextContent) {
      await writeFile(filePath, nextContent, "utf8");
      updatedCount += 1;
      console.log(`Updated ${fileName}`);
    }
  }

  console.log(`Done. Updated ${updatedCount} file(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
