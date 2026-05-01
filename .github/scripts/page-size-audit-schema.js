/**
 * Page size audit JSON compact schema helpers.
 *
 * Compact keys intentionally keep comments of the original field names nearby: - m: metadata - t: timestamp - r:
 * results - u: url - rs: resources - tr: themeResources - ts: transferSize - rs: resourceSize (inside resource stat
 * objects)
 */

const topLevelCompactKeys = {
  metadata: "m",
  timestamp: "t",
  results: "r",
};

const metadataCompactKeys = {
  haloVersion: "hv",
  javaVersion: "jv",
  themeVersion: "tv",
  lhciVersion: "lv",
  generatedAt: "ga",
};

const resultCompactKeys = {
  url: "u",
  resources: "rs",
  themeResources: "tr",
};

const resourceStatCompactKeys = {
  transferSize: "ts",
  resourceSize: "rs",
};

const resourceTypeEntries = [
  ["document", "d"],
  ["font", "f"],
  ["script", "s"],
  ["stylesheet", "ss"],
  ["image", "i"],
  ["fetch", "fc"],
  ["other", "o"],
  ["total", "tot"],
];

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

function decodeResourceStat(raw) {
  const value = asObject(raw);

  return {
    transferSize: asFiniteNumber(value[resourceStatCompactKeys.transferSize] ?? value.transferSize),
    resourceSize: asFiniteNumber(value[resourceStatCompactKeys.resourceSize] ?? value.resourceSize),
  };
}

function decodeResourceGroup(raw) {
  const value = asObject(raw);
  const group = createEmptyResourceGroup();

  for (const [longKey, shortKey] of resourceTypeEntries) {
    group[longKey] = decodeResourceStat(value[shortKey] ?? value[longKey]);
  }

  return group;
}

function encodeResourceStat(stat) {
  return {
    [resourceStatCompactKeys.transferSize]: asFiniteNumber(stat?.transferSize),
    [resourceStatCompactKeys.resourceSize]: asFiniteNumber(stat?.resourceSize),
  };
}

function encodeResourceGroup(group) {
  const encoded = {};

  for (const [longKey, shortKey] of resourceTypeEntries) {
    encoded[shortKey] = encodeResourceStat(group?.[longKey]);
  }

  return encoded;
}

export function decodeAuditFile(raw) {
  const value = asObject(raw);
  const metadataValue = asObject(value[topLevelCompactKeys.metadata] ?? value.metadata);
  const rawResults = value[topLevelCompactKeys.results] ?? value.results;
  const results = Array.isArray(rawResults) ? rawResults : [];

  return {
    metadata: {
      haloVersion: asString(metadataValue[metadataCompactKeys.haloVersion] ?? metadataValue.haloVersion),
      javaVersion: asString(metadataValue[metadataCompactKeys.javaVersion] ?? metadataValue.javaVersion),
      themeVersion: asString(metadataValue[metadataCompactKeys.themeVersion] ?? metadataValue.themeVersion),
      lhciVersion: asString(metadataValue[metadataCompactKeys.lhciVersion] ?? metadataValue.lhciVersion),
      generatedAt: asString(metadataValue[metadataCompactKeys.generatedAt] ?? metadataValue.generatedAt),
    },
    timestamp: asString(value[topLevelCompactKeys.timestamp] ?? value.timestamp),
    results: results.map((result) => {
      const resultValue = asObject(result);

      return {
        url: asString(resultValue[resultCompactKeys.url] ?? resultValue.url, "/"),
        resources: decodeResourceGroup(resultValue[resultCompactKeys.resources] ?? resultValue.resources),
        themeResources: decodeResourceGroup(
          resultValue[resultCompactKeys.themeResources] ?? resultValue.themeResources,
        ),
      };
    }),
  };
}

export function encodeAuditFile(auditFile) {
  const metadata = asObject(auditFile?.metadata);
  const rawResults = auditFile?.results;
  const results = Array.isArray(rawResults) ? rawResults : [];

  return {
    [topLevelCompactKeys.metadata]: {
      [metadataCompactKeys.haloVersion]: asString(metadata.haloVersion),
      [metadataCompactKeys.javaVersion]: asString(metadata.javaVersion),
      [metadataCompactKeys.themeVersion]: asString(metadata.themeVersion),
      [metadataCompactKeys.lhciVersion]: asString(metadata.lhciVersion),
      [metadataCompactKeys.generatedAt]: asString(metadata.generatedAt),
    },
    [topLevelCompactKeys.timestamp]: asString(auditFile?.timestamp),
    [topLevelCompactKeys.results]: results.map((result) => ({
      [resultCompactKeys.url]: asString(result?.url, "/"),
      [resultCompactKeys.resources]: encodeResourceGroup(result?.resources),
      [resultCompactKeys.themeResources]: encodeResourceGroup(result?.themeResources),
    })),
  };
}
