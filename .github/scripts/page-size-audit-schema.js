/**
 * Page size audit JSON compact schema helpers.
 *
 * Current protocol only: - m: metadata -> [haloVersion, javaVersion, themeVersion, lhciVersion, generatedAt] - r:
 * results -> [[url, resources, themeResources], ...] - resources/themeResources -> flat number arrays ordered by:
 * document, font, script, stylesheet, image, fetch, other, total each resource contributes [transferSize,
 * resourceSize]
 */

const topLevelCompactKeys = {
  metadata: "m",
  results: "r",
};

const resourceTypeEntries = ["document", "font", "script", "stylesheet", "image", "fetch", "other", "total"];

function asObject(value) {
  return value && typeof value === "object" ? value : {};
}

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

function decodeResourceGroup(raw) {
  const value = Array.isArray(raw) ? raw : [];
  const group = createEmptyResourceGroup();
  let index = 0;

  for (const resourceType of resourceTypeEntries) {
    group[resourceType] = {
      transferSize: asFiniteNumber(value[index]),
      resourceSize: asFiniteNumber(value[index + 1]),
    };
    index += 2;
  }

  return group;
}

function encodeResourceGroup(group) {
  const encoded = [];

  for (const resourceType of resourceTypeEntries) {
    encoded.push(asFiniteNumber(group?.[resourceType]?.transferSize));
    encoded.push(asFiniteNumber(group?.[resourceType]?.resourceSize));
  }

  return encoded;
}

export function decodeAuditFile(raw) {
  const value = asObject(raw);
  const metadata = decodeMetadata(value[topLevelCompactKeys.metadata]);
  const rawResults = value[topLevelCompactKeys.results];
  const results = Array.isArray(rawResults) ? rawResults : [];

  return {
    metadata,
    timestamp: "",
    results: results.map((result) => {
      const item = Array.isArray(result) ? result : [];

      return {
        url: asString(item[0], "/"),
        resources: decodeResourceGroup(item[1]),
        themeResources: decodeResourceGroup(item[2]),
      };
    }),
  };
}

export function encodeAuditFile(auditFile) {
  const metadata = asObject(auditFile?.metadata);
  const rawResults = auditFile?.results;
  const results = Array.isArray(rawResults) ? rawResults : [];

  return {
    [topLevelCompactKeys.metadata]: [
      asString(metadata.haloVersion),
      asString(metadata.javaVersion),
      asString(metadata.themeVersion),
      asString(metadata.lhciVersion),
      asString(metadata.generatedAt),
    ],
    [topLevelCompactKeys.results]: results.map((result) => [
      asString(result?.url, "/"),
      encodeResourceGroup(result?.resources),
      encodeResourceGroup(result?.themeResources),
    ]),
  };
}
