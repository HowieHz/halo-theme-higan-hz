/**
 * Page size audit JSON extreme compact schema helpers.
 *
 * Protocol only: - root[0]: metadata -> [haloVersion, javaVersion, themeVersion, lhciVersion, generatedAt] - root[1]:
 * flat numbers -> 9 pages * 2 groups * 8 resource types * 2 stats = 288 numbers
 *
 * Fixed page order: /, /archives, /archives/hello-halo, /tags, /tags/halo, /categories, /categories/default,
 * /authors/admin, /about
 *
 * Group order: resources, themeResources
 *
 * Resource type order: document, font, script, stylesheet, image, fetch, other, total
 *
 * Stat order: transferSize, resourceSize
 */

const pageUrls = [
  "/",
  "/archives",
  "/archives/hello-halo",
  "/tags",
  "/tags/halo",
  "/categories",
  "/categories/default",
  "/authors/admin",
  "/about",
];

const groupKeys = ["resources", "themeResources"];
const resourceTypeEntries = ["document", "font", "script", "stylesheet", "image", "fetch", "other", "total"];

function asString(value, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function createEmptyResourceGroup() {
  return {
    document: { transferSize: 0, resourceSize: 0 },
    font: { transferSize: 0, resourceSize: 0 },
    script: { transferSize: 0, resourceSize: 0 },
    stylesheet: { transferSize: 0, resourceSize: 0 },
    image: { transferSize: 0, resourceSize: 0 },
    fetch: { transferSize: 0, resourceSize: 0 },
    other: { transferSize: 0, resourceSize: 0 },
    total: { transferSize: 0, resourceSize: 0 },
  };
}

function decodeMetadata(raw) {
  const value = Array.isArray(raw) ? raw : [];

  return {
    haloVersion: asString(value[0]),
    javaVersion: asString(value[1]),
    themeVersion: asString(value[2]),
    lhciVersion: asString(value[3]),
    generatedAt: asString(value[4]),
  };
}

function decodeFlatNumbers(raw) {
  const values = Array.isArray(raw) ? raw : [];
  let index = 0;

  return pageUrls.map((url) => {
    const pageResult = {
      url,
      resources: createEmptyResourceGroup(),
      themeResources: createEmptyResourceGroup(),
    };

    for (const groupKey of groupKeys) {
      for (const resourceType of resourceTypeEntries) {
        pageResult[groupKey][resourceType] = {
          transferSize: asFiniteNumber(values[index]),
          resourceSize: asFiniteNumber(values[index + 1]),
        };
        index += 2;
      }
    }

    return pageResult;
  });
}

function encodeFlatNumbers(results) {
  const byUrl = new Map((Array.isArray(results) ? results : []).map((result) => [result?.url, result]));
  const values = [];

  for (const url of pageUrls) {
    const pageResult = byUrl.get(url);

    for (const groupKey of groupKeys) {
      for (const resourceType of resourceTypeEntries) {
        values.push(asFiniteNumber(pageResult?.[groupKey]?.[resourceType]?.transferSize));
        values.push(asFiniteNumber(pageResult?.[groupKey]?.[resourceType]?.resourceSize));
      }
    }
  }

  return values;
}

export function decodeAuditFile(raw) {
  const root = Array.isArray(raw) ? raw : [];

  return {
    metadata: decodeMetadata(root[0]),
    timestamp: "",
    results: decodeFlatNumbers(root[1]),
  };
}

export function encodeAuditFile(auditFile) {
  const metadata = auditFile?.metadata ?? {};

  return [
    [
      asString(metadata.haloVersion),
      asString(metadata.javaVersion),
      asString(metadata.themeVersion),
      asString(metadata.lhciVersion),
      asString(metadata.generatedAt),
    ],
    encodeFlatNumbers(auditFile?.results),
  ];
}
