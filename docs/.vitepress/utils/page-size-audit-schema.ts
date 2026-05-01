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
} as const;

const metadataCompactKeys = {
  haloVersion: "hv",
  javaVersion: "jv",
  themeVersion: "tv",
  lhciVersion: "lv",
  generatedAt: "ga",
} as const;

const resultCompactKeys = {
  url: "u",
  resources: "rs",
  themeResources: "tr",
} as const;

const resourceStatCompactKeys = {
  transferSize: "ts",
  resourceSize: "rs",
} as const;

const resourceTypeEntries = [
  ["document", "d"],
  ["font", "f"],
  ["script", "s"],
  ["stylesheet", "ss"],
  ["image", "i"],
  ["fetch", "fc"],
  ["other", "o"],
  ["total", "tot"],
] as const;

export type ResourceType = (typeof resourceTypeEntries)[number][0];

export interface AuditResourceStat {
  transferSize: number;
  resourceSize: number;
}

export type AuditResourceGroup = Record<ResourceType, AuditResourceStat>;

export interface AuditPageResult {
  url: string;
  resources: AuditResourceGroup;
  themeResources: AuditResourceGroup;
}

export interface AuditFile {
  metadata: {
    haloVersion: string;
    javaVersion: string;
    themeVersion: string;
    lhciVersion: string;
    generatedAt: string;
  };
  timestamp: string;
  results: AuditPageResult[];
}

function asObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asFiniteNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function createEmptyResourceGroup(): AuditResourceGroup {
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

function decodeResourceStat(raw: unknown): AuditResourceStat {
  const value = asObject(raw);

  return {
    transferSize: asFiniteNumber(value[resourceStatCompactKeys.transferSize] ?? value.transferSize),
    resourceSize: asFiniteNumber(value[resourceStatCompactKeys.resourceSize] ?? value.resourceSize),
  };
}

function decodeResourceGroup(raw: unknown): AuditResourceGroup {
  const value = asObject(raw);
  const group = createEmptyResourceGroup();

  for (const [longKey, shortKey] of resourceTypeEntries) {
    group[longKey] = decodeResourceStat(value[shortKey] ?? value[longKey]);
  }

  return group;
}

export function decodeAuditFile(raw: unknown): AuditFile {
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
