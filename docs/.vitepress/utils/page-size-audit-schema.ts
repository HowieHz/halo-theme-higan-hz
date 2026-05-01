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
] as const;

const groupKeys = ["resources", "themeResources"] as const;
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

function decodeFlatNumbers(raw: unknown): AuditPageResult[] {
  const values = Array.isArray(raw) ? raw : [];
  let index = 0;

  return pageUrls.map((url) => {
    const pageResult: AuditPageResult = {
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

export function decodeAuditFile(raw: unknown): AuditFile {
  const root = Array.isArray(raw) ? raw : [];

  return {
    metadata: decodeMetadata(root[0]),
    timestamp: "",
    results: decodeFlatNumbers(root[1]),
  };
}
