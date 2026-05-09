export const performanceAuditPageEntries = [
  { key: "home", url: "/" },
  { key: "archives", url: "/archives" },
  { key: "post", url: "/archives/hello-halo" },
  { key: "tags", url: "/tags" },
  { key: "tagDetail", url: "/tags/halo" },
  { key: "categories", url: "/categories" },
  { key: "categoryDetail", url: "/categories/default" },
  { key: "author", url: "/authors/admin" },
  { key: "about", url: "/about" },
] as const;

export type PerformanceContentPageKey = (typeof performanceAuditPageEntries)[number]["key"];
export type PerformancePageKey = PerformanceContentPageKey | "average";

export const performanceDatasetKinds = [
  "themeGzipped",
  "themeRaw",
  "resourcesGzipped",
  "resourcesRaw",
] as const;

export type PerformanceDatasetKind = (typeof performanceDatasetKinds)[number];

export const performanceProgressStages = ["dataLoading", "dataProcessing", "chartCreation"] as const;
export type PerformanceProgressStage = (typeof performanceProgressStages)[number];
