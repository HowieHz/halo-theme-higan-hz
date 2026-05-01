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
} as const;

const resourceTypeEntries = ["document", "font", "script", "stylesheet", "image", "fetch", "other", "total"] as const;

export type ResourceType = (typeof resourceTypeEntries)[number];

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

function decodeMetadata(raw: unknown): AuditFile["metadata"] {
  const value = Array.isArray(raw) ? raw : [];

  return {
    haloVersion: asString(value[0]),
    javaVersion: asString(value[1]),
    themeVersion: asString(value[2]),
    lhciVersion: asString(value[3]),
    generatedAt: asString(value[4]),
  };
}

function decodeResourceGroup(raw: unknown): AuditResourceGroup {
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

export function decodeAuditFile(raw: unknown): AuditFile {
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
