import fs from "node:fs";
import path from "node:path";

import { syncChangelogCompareLinks } from "./update-changelog-links.js";

const releaseVersion = process.argv[2];
const previousVersion = process.argv[3];
const releaseDate = process.argv[4];
void previousVersion;

if (!releaseVersion || !previousVersion || !releaseDate) {
  console.error("Usage: node .github/scripts/prepare-changelog-release.js <version> <previous-version> <date>");
  process.exit(1);
}

const changelogFiles = [
  path.join(process.cwd(), "docs", "maintenance", "changelog.md"),
  path.join(process.cwd(), "docs", "en", "maintenance", "changelog.md"),
];

for (const filePath of changelogFiles) {
  const content = fs.readFileSync(filePath, "utf8");
  const unreleasedHeading = "## [Unreleased]";
  const unreleasedIndex = content.indexOf(unreleasedHeading);

  if (unreleasedIndex === -1) {
    throw new Error(`Missing ${unreleasedHeading} in ${filePath}`);
  }

  const afterHeadingIndex = unreleasedIndex + unreleasedHeading.length;
  const nextHeadingIndex = content.indexOf("\n## [", afterHeadingIndex);

  if (nextHeadingIndex === -1) {
    throw new Error(`Unable to locate next release heading in ${filePath}`);
  }

  const unreleasedBody = content.slice(afterHeadingIndex, nextHeadingIndex).trim();

  if (!unreleasedBody) {
    throw new Error(`Unreleased section is empty in ${filePath}`);
  }

  // Keep heading style aligned with existing changelog entries.
  const newReleaseBlock = `${unreleasedHeading}\n\n## [${releaseVersion}] - ${releaseDate}\n\n${unreleasedBody}\n\n`;
  const updatedContent = `${content.slice(0, unreleasedIndex)}${newReleaseBlock}${content.slice(nextHeadingIndex + 1)}`;
  fs.writeFileSync(filePath, updatedContent);
  syncChangelogCompareLinks(filePath);
}
