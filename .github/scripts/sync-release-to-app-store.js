import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const {
  ASSETS_DIR,
  GITHUB_RELEASE_TAG,
  GITHUB_REPOSITORY,
  GITHUB_TOKEN,
  HALO_APP_ID,
  HALO_BACKEND_BASEURL = "https://www.halo.run",
  HALO_PAT,
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
    .sort((left, right) => {
      if (left === "howiehz-higan-cn.zip") {
        return -1;
      }
      if (right === "howiehz-higan-cn.zip") {
        return 1;
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

  const versionMatch = yamlContent.match(/^\s*version:\s*([^\r\n]+)$/mu);
  const requiresMatch = yamlContent.match(/^\s*requires:\s*"?([^\r\n"]+)"?$/mu);
  const appIdMatch = yamlContent.match(/^\s*store\.halo\.run\/app-id:\s*([^\r\n]+)$/mu);

  if (!versionMatch || !requiresMatch) {
    throw new Error(`Unable to read version or requires from ${assetPath}`);
  }

  return {
    version: versionMatch[1].trim(),
    requires: requiresMatch[1].trim(),
    appId: HALO_APP_ID || appIdMatch?.[1]?.trim(),
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

const main = async () => {
  const assets = listAssets();
  const manifest = readThemeManifest(path.join(ASSETS_DIR, assets[0]));

  if (!manifest.appId) {
    throw new Error("Halo app id is missing. Set HALO_APP_ID or store.halo.run/app-id in theme.yaml.");
  }

  const release = await githubRequest(`/releases/tags/${GITHUB_RELEASE_TAG}`);
  const markdown = `${release.body || ""}`;
  const html = await renderMarkdown(markdown);

  const appRelease = await haloRequest(
    `/apis/uc.api.developer.store.halo.run/v1alpha1/releases?applicationName=${manifest.appId}`,
    {
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
            draft: false,
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
        makeLatest: !release.prerelease,
      }),
    },
  );

  await uploadAssets(appRelease.metadata.name, assets);
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
