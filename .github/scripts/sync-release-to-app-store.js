import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import yaml from "js-yaml";

const {
  ASSETS_DIR,
  GITHUB_RELEASE_TAG,
  GITHUB_REPOSITORY,
  GITHUB_TOKEN,
  HALO_APP_ID,
  HALO_BACKEND_BASEURL = "https://www.halo.run",
  HALO_PAT,
  RELEASE_NAME,
  RELEASE_NOTES_FILE,
  RELEASE_PRERELEASE,
} = process.env;

if (!ASSETS_DIR || !GITHUB_RELEASE_TAG || !GITHUB_REPOSITORY || !GITHUB_TOKEN || !HALO_PAT) {
  console.error("Missing required environment variables for app store sync");
  process.exit(1);
}

const repoApiBase = `https://api.github.com/repos/${GITHUB_REPOSITORY}`;
const haloApiBase = HALO_BACKEND_BASEURL.replace(/\/$/u, "");

const listAssets = () => {
  const assets = fs
    .readdirSync(ASSETS_DIR)
    .filter((fileName) => fs.statSync(path.join(ASSETS_DIR, fileName)).isFile())
    // Halo App Store 的展示顺序与上传顺序相反，因此 cn.zip 排最后上传，以确保在商店中排在最前面。
    // （GitHub Release 侧则相反：cn.zip 排在 assets 列表首位。）
    .sort((left, right) => {
      if (left === "howiehz-higan-cn.zip") {
        return 1;
      }
      if (right === "howiehz-higan-cn.zip") {
        return -1;
      }
      return left.localeCompare(right, "en");
    });

  if (assets.length === 0) {
    throw new Error(`Assets directory is empty: ${ASSETS_DIR}`);
  }

  return assets;
};

const readThemeManifest = (assetPath) => {
  const yamlContent = execFileSync("unzip", ["-p", assetPath, "theme.yaml"], {
    encoding: "utf8",
  });

  const manifest = yaml.load(yamlContent);
  const version = manifest?.spec?.version;
  const requires = manifest?.spec?.requires;
  const appId = manifest?.metadata?.annotations?.["store.halo.run/app-id"];

  if (!version || !requires) {
    throw new Error(`Unable to read version or requires from ${assetPath}`);
  }

  return {
    version: String(version).trim(),
    requires: String(requires).trim(),
    appId: HALO_APP_ID || (appId ? String(appId).trim() : undefined),
  };
};

const githubRequest = async (pathname, init = {}) => {
  const response = await fetch(`${repoApiBase}${pathname}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "User-Agent": "halo-theme-higan-hz-release-bot",
      ...(init.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

const haloRequest = async (pathname, init = {}) => {
  const response = await fetch(`${haloApiBase}${pathname}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${HALO_PAT}`,
      ...(init.headers ?? {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Halo API request failed: ${response.status} ${response.statusText} - ${body}`);
  }

  return response.json();
};

const renderMarkdown = async (markdown) => {
  const response = await fetch("https://api.github.com/markdown", {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
      "User-Agent": "halo-theme-higan-hz-release-bot",
    },
    body: JSON.stringify({
      text: markdown,
      mode: "gfm",
      context: GITHUB_REPOSITORY,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to render GitHub markdown: ${response.status} ${response.statusText}`);
  }

  return response.text();
};

const resolveReleaseMetadata = async () => {
  if (RELEASE_NAME && RELEASE_NOTES_FILE && RELEASE_PRERELEASE) {
    return {
      name: RELEASE_NAME,
      body: fs.readFileSync(RELEASE_NOTES_FILE, "utf8"),
      prerelease: RELEASE_PRERELEASE === "true",
    };
  }

  return githubRequest(`/releases/tags/${GITHUB_RELEASE_TAG}`);
};

const createReleaseNotesPayload = (notesName, markdown, html) => ({
  apiVersion: "store.halo.run/v1alpha1",
  html,
  kind: "Content",
  metadata: {
    name: notesName,
  },
  rawType: "MARKDOWN",
  raw: markdown,
});

const createDraftRelease = async (appId, release, manifest, markdown, html) =>
  haloRequest(`/apis/uc.api.developer.store.halo.run/v1alpha1/releases?applicationName=${appId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      release: {
        apiVersion: "store.halo.run/v1alpha1",
        kind: "Release",
        metadata: {
          generateName: "app-release-",
          name: "",
        },
        spec: {
          applicationName: "",
          displayName: release.name,
          draft: true,
          ownerName: "",
          preRelease: release.prerelease,
          requires: manifest.requires,
          version: manifest.version,
          notesName: "",
        },
      },
      notes: {
        apiVersion: "store.halo.run/v1alpha1",
        html,
        kind: "Content",
        metadata: {
          generateName: "app-release-notes-",
          name: "",
        },
        rawType: "MARKDOWN",
        raw: markdown,
      },
      makeLatest: false,
    }),
  });

const uploadAssets = async (releaseName, assets) => {
  for (const asset of assets) {
    const assetPath = path.join(ASSETS_DIR, asset);
    const formData = new FormData();
    formData.append("releaseName", releaseName);
    formData.append("file", new Blob([fs.readFileSync(assetPath)]), asset);

    await haloRequest("/apis/uc.api.developer.store.halo.run/v1alpha1/assets", {
      method: "POST",
      body: formData,
    });
  }
};

const publishDraftRelease = async (appId, draftRelease, release, markdown, html) => {
  const releaseName = draftRelease?.metadata?.name;
  const notesName = draftRelease?.spec?.notesName;

  if (!releaseName || !notesName) {
    throw new Error("Draft release response is missing the release name or notes name.");
  }

  return haloRequest(`/apis/uc.api.developer.store.halo.run/v1alpha1/releases/${releaseName}?applicationName=${appId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      release: {
        ...draftRelease,
        spec: {
          ...draftRelease.spec,
          draft: false,
        },
        status: {
          ...(draftRelease.status ?? {}),
          published: false,
        },
      },
      notes: createReleaseNotesPayload(notesName, markdown, html),
      makeLatest: !release.prerelease,
    }),
  });
};

const main = async () => {
  const assets = listAssets();
  const manifest = readThemeManifest(path.join(ASSETS_DIR, assets[0]));

  if (!manifest.appId) {
    throw new Error("Halo app id is missing. Set HALO_APP_ID or store.halo.run/app-id in theme.yaml.");
  }

  const release = await resolveReleaseMetadata();
  const markdown = `${release.body || ""}`;
  const html = await renderMarkdown(markdown);

  const draftRelease = await createDraftRelease(manifest.appId, release, manifest, markdown, html);
  const draftReleaseName = draftRelease?.metadata?.name;

  if (!draftReleaseName) {
    throw new Error("Draft release response is missing the release name.");
  }

  await uploadAssets(draftReleaseName, assets);
  await publishDraftRelease(manifest.appId, draftRelease, release, markdown, html);
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
