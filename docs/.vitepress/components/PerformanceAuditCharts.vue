<script setup lang="ts">
import {
  Chart as ChartJS,
  type Chart,
  type ChartOptions,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useData } from "vitepress";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { Line as LineChart } from "vue-chartjs";

import {
  decodeAuditFile,
  type AuditFile,
  type AuditPageResult,
  type ResourceType,
} from "../utils/page-size-audit-schema";
import ProgressBar from "./ProgressBar.vue";

type LocaleKey = "zh-CN" | "en";
type ContentPageKey =
  | "home"
  | "archives"
  | "post"
  | "tags"
  | "tagDetail"
  | "categories"
  | "categoryDetail"
  | "author"
  | "about";
type PageKey = ContentPageKey | "average";
type AxisMode = "version" | "time";
type DatasetKind = "themeGzipped" | "themeRaw" | "resourcesGzipped" | "resourcesRaw";
type ProgressStage = "dataLoading" | "dataProcessing" | "chartCreation";
type ChartSettingsStatus = "idle" | "rendering" | "done";
interface TimelineEntry {
  version: string;
  publishedAt: number;
  index: number;
}
interface ChartPoint {
  x: number;
  y: number | null;
  version: string;
  publishedAt: number;
}
interface LoadedAuditEntry {
  version: string;
  publishedAt: number;
  data: AuditFile;
}
interface IndexedAuditEntry {
  version: string;
  publishedAt: number;
  resultsByUrl: Map<string, AuditPageResult>;
}
type NumericSeries = Record<ResourceType, (number | null)[]>;
type PageDatasets = Record<DatasetKind, NumericSeries>;
type DatasetCollection = Record<PageKey, PageDatasets>;
interface ChartSeries {
  labels: string[];
  datasets: {
    label: string;
    data: ChartPoint[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
    borderWidth: number;
  }[];
}
type ChartPageData = Record<DatasetKind, ChartSeries>;
type ChartDatasetCollection = Partial<Record<PageKey, ChartPageData>>;
interface RawDatasetsState {
  datasets: DatasetCollection;
  versions: string[];
  publishedAts: number[];
}
interface AxisRangeOption {
  value: string;
  label: string;
  position: number;
}
type ChartLoadingFlags = Record<DatasetKind, boolean>;
type ChartLoadingState = Record<PageKey, ChartLoadingFlags>;
interface LocaleText {
  noPublishedTime: string;
  loadErrorPrefix: string;
  chartSettings: string;
  rendering: string;
  rendered: string;
  axisMode: string;
  versionSpacing: string;
  timeSpacing: string;
  versionRange: string;
  timeRange: string;
  rangeSeparator: string;
  ariaAxisMode: string;
  ariaRangeStart: string;
  ariaRangeEnd: string;
  xAxisVersion: string;
  xAxisTime: string;
  progressLabel: string;
  loadingStages: Record<ProgressStage, string>;
  sectionTitles: Record<PageKey, string>;
  datasetTitles: Record<DatasetKind, string>;
  resourceLabels: Record<ResourceType, string>;
}

const props = defineProps<{
  locale: LocaleKey;
}>();

const { isDark } = useData();

const pageEntries = [
  { key: "home", url: "/" },
  { key: "archives", url: "/archives" },
  { key: "post", url: "/archives/hello-halo" },
  { key: "tags", url: "/tags" },
  { key: "tagDetail", url: "/tags/halo" },
  { key: "categories", url: "/categories" },
  { key: "categoryDetail", url: "/categories/default" },
  { key: "author", url: "/authors/admin" },
  { key: "about", url: "/about" },
] as const satisfies readonly { key: ContentPageKey; url: string }[];

const resourceTypes = ["document", "font", "script", "stylesheet", "image", "fetch", "other", "total"] as const;
const datasetKinds = [
  "themeGzipped",
  "themeRaw",
  "resourcesGzipped",
  "resourcesRaw",
] as const satisfies readonly DatasetKind[];

const localeText = {
  "zh-CN": {
    noPublishedTime: "未记录发布时间",
    loadErrorPrefix: "加载图表数据失败:",
    chartSettings: "图表设置",
    rendering: "渲染中",
    rendered: "渲染完毕",
    axisMode: "横轴模式",
    versionSpacing: "版本均分",
    timeSpacing: "时间均分",
    versionRange: "版本范围",
    timeRange: "时间范围",
    rangeSeparator: "至",
    ariaAxisMode: "切换横轴模式",
    ariaRangeStart: "选择起始范围",
    ariaRangeEnd: "选择结束范围",
    xAxisVersion: "版本",
    xAxisTime: "发布时间",
    progressLabel: "进度",
    loadingStages: {
      dataLoading: "加载数据",
      dataProcessing: "数据排序与处理",
      chartCreation: "图表数据创建",
    },
    sectionTitles: {
      average: "平均每个页面",
      home: "首页",
      archives: "文章归档",
      post: "文章详情",
      tags: "标签集合",
      tagDetail: "标签详情",
      categories: "分类集合",
      categoryDetail: "分类详情",
      author: "作者详情",
      about: "独立页面",
    },
    datasetTitles: {
      themeGzipped: "主题资源（压缩）",
      themeRaw: "主题资源（原始）",
      resourcesGzipped: "页面资源（压缩）",
      resourcesRaw: "页面资源（原始）",
    },
    resourceLabels: {
      document: "文档",
      font: "字体",
      script: "脚本",
      stylesheet: "样式表",
      image: "图片",
      fetch: "数据请求",
      other: "其他",
      total: "总计",
    },
  },
  en: {
    noPublishedTime: "Published time unavailable",
    loadErrorPrefix: "Failed to load chart data:",
    chartSettings: "Chart Settings",
    rendering: "Rendering",
    rendered: "Rendered",
    axisMode: "Axis mode",
    versionSpacing: "Version spacing",
    timeSpacing: "Time spacing",
    versionRange: "Version range",
    timeRange: "Time range",
    rangeSeparator: "to",
    ariaAxisMode: "Switch axis mode",
    ariaRangeStart: "Select range start",
    ariaRangeEnd: "Select range end",
    xAxisVersion: "Version",
    xAxisTime: "Published time",
    progressLabel: "Progress",
    loadingStages: {
      dataLoading: "Loading Data",
      dataProcessing: "Sorting and Processing Data",
      chartCreation: "Creating Chart Data",
    },
    sectionTitles: {
      average: "Average Per Page",
      home: "Home Page",
      archives: "Archives",
      post: "Post Detail",
      tags: "Tags Collection",
      tagDetail: "Tag Detail",
      categories: "Categories Collection",
      categoryDetail: "Category Detail",
      author: "Author Detail",
      about: "Single Page",
    },
    datasetTitles: {
      themeGzipped: "Theme Resources (compressed)",
      themeRaw: "Theme Resources (raw)",
      resourcesGzipped: "Page Resources (compressed)",
      resourcesRaw: "Page Resources (raw)",
    },
    resourceLabels: {
      document: "Document",
      font: "Font",
      script: "Script",
      stylesheet: "Stylesheet",
      image: "Image",
      fetch: "Fetch",
      other: "Other",
      total: "Total",
    },
  },
} as const satisfies Record<LocaleKey, LocaleText>;

const activeCharts = new Set<Chart>();
const axisMode = ref<AxisMode>("version");
const chartDatasets = ref<ChartDatasetCollection>({});
const rawDatasets = ref<RawDatasetsState | null>(null);
const loadingProgress = ref(0);
const isLoading = ref(false);
const loadingStage = ref<ProgressStage>("dataLoading");
const chartLoadingStatus = ref<ChartLoadingState>(createChartLoadingState());
const chartSettingsStatus = ref<ChartSettingsStatus>("idle");
const selectedRangeStart = ref("");
const selectedRangeEnd = ref("");

let chartSettingsTransitionToken = 0;
let chartSettingsDoneTimer: ReturnType<typeof setTimeout> | null = null;

const text = computed(() => localeText[props.locale]);
const loadingLabels = computed(() => text.value.loadingStages);
const sectionList = computed(
  () =>
    [
      { key: "average", title: text.value.sectionTitles.average },
      ...pageEntries.map(({ key }) => ({
        key,
        title: text.value.sectionTitles[key],
      })),
    ] satisfies { key: PageKey; title: string }[],
);
const datasetList = computed(() =>
  datasetKinds.map((key) => ({
    key,
    title: text.value.datasetTitles[key],
  })),
);

const exclusiveTooltipPlugin = {
  id: "exclusiveTooltip",
  afterInit(chart: Chart) {
    activeCharts.add(chart);
  },
  beforeEvent(chart: Chart, args: { event?: { type?: string } }) {
    const eventType = args.event?.type;
    if (!eventType || !["mousemove", "mouseout", "touchstart", "touchmove", "click"].includes(eventType)) {
      return;
    }

    for (const otherChart of activeCharts) {
      if (otherChart === chart) continue;
      if ((otherChart.tooltip?.getActiveElements().length ?? 0) === 0) continue;
      otherChart.tooltip?.setActiveElements([], { x: 0, y: 0 });
      otherChart.update("none");
    }

    if (eventType === "mouseout" && (chart.tooltip?.getActiveElements().length ?? 0) > 0) {
      chart.tooltip?.setActiveElements([], { x: 0, y: 0 });
      chart.update("none");
    }
  },
  afterDestroy(chart: Chart) {
    activeCharts.delete(chart);
  },
};

ChartJS.register(LinearScale, PointElement, LineElement, Title, Tooltip, Legend, exclusiveTooltipPlugin);

function createEmptyNumericSeries(): NumericSeries {
  return {
    document: [],
    font: [],
    script: [],
    stylesheet: [],
    image: [],
    fetch: [],
    other: [],
    total: [],
  };
}

function createEmptyPageDatasets(): PageDatasets {
  return {
    themeGzipped: createEmptyNumericSeries(),
    themeRaw: createEmptyNumericSeries(),
    resourcesGzipped: createEmptyNumericSeries(),
    resourcesRaw: createEmptyNumericSeries(),
  };
}

function createDatasetCollection(): DatasetCollection {
  const datasets = { average: createEmptyPageDatasets() } as DatasetCollection;

  for (const { key } of pageEntries) {
    datasets[key] = createEmptyPageDatasets();
  }

  return datasets;
}

function createChartLoadingState(isChartLoading = false): ChartLoadingState {
  const flags: ChartLoadingFlags = {
    themeGzipped: isChartLoading,
    themeRaw: isChartLoading,
    resourcesGzipped: isChartLoading,
    resourcesRaw: isChartLoading,
  };
  const state = { average: { ...flags } } as ChartLoadingState;

  for (const { key } of pageEntries) {
    state[key] = { ...flags };
  }

  return state;
}

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

function formatUtcOffset(date: Date): string {
  const totalMinutes = -date.getTimezoneOffset();
  const sign = totalMinutes >= 0 ? "+" : "-";
  const absoluteMinutes = Math.abs(totalMinutes);
  const hours = Math.floor(absoluteMinutes / 60);
  const minutes = absoluteMinutes % 60;
  return minutes === 0 ? `UTC${sign}${hours}` : `UTC${sign}${hours}:${pad2(minutes)}`;
}

function formatLocalDate(timestamp: number, includeYear: boolean): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = pad2(date.getMonth() + 1);
  const day = pad2(date.getDate());
  return includeYear ? `${year}-${month}-${day}` : `${month}-${day}`;
}

function formatLocalDateTime(timestamp: number): string {
  const date = new Date(timestamp);
  return `${formatLocalDate(timestamp, true)} ${pad2(date.getHours())}:${pad2(date.getMinutes())} ${formatUtcOffset(date)}`;
}

function formatPublishedTime(timestamp: number): string {
  return timestamp > 0 ? formatLocalDateTime(timestamp) : text.value.noPublishedTime;
}

function formatTimeAxisTick(timestamp: number, includeYear: boolean): string {
  if (timestamp <= 0) return "";
  return formatLocalDate(timestamp, includeYear);
}

function shouldShowYearOnTick(timestamp: number, previousTimestamp: number | null): boolean {
  if (timestamp <= 0) return false;
  if (previousTimestamp === null || previousTimestamp <= 0) return true;
  return new Date(timestamp).getFullYear() !== new Date(previousTimestamp).getFullYear();
}

function parseTickTimestamp(value: number | string): number | null {
  const numericValue = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
}

function formatRangeOptionLabel(version: string, publishedAt: number): string {
  return `${formatLocalDate(publishedAt, true)} · ${version}`;
}

const resourceColors = computed<Record<ResourceType, string>>(() =>
  isDark.value
    ? {
        document: "#b794f4",
        font: "#4fd1c5",
        script: "#fc8181",
        stylesheet: "#63b3ed",
        image: "#f6ad55",
        fetch: "#68d391",
        other: "#cbd5e0",
        total: "#e2e8f0",
      }
    : {
        document: "#8e44ad",
        font: "#16a085",
        script: "#e74c3c",
        stylesheet: "#3498db",
        image: "#f39c12",
        fetch: "#27ae60",
        other: "#95a5a6",
        total: "#2c3e50",
      },
);

const rangeOptions = computed<AxisRangeOption[]>(() => {
  if (!rawDatasets.value) return [];

  if (axisMode.value === "version") {
    return rawDatasets.value.versions.map((version, index) => ({
      value: version,
      label: version,
      position: index,
    }));
  }

  return rawDatasets.value.versions.flatMap((version, index) => {
    const publishedAt = rawDatasets.value?.publishedAts[index] ?? 0;
    if (publishedAt <= 0) return [];
    return [
      {
        value: version,
        label: formatRangeOptionLabel(version, publishedAt),
        position: publishedAt,
      },
    ];
  });
});

function getRangeOptionIndex(value: string, options: AxisRangeOption[]): number {
  return options.findIndex((option) => option.value === value);
}

function normalizeRangeSelection(changedField: "start" | "end" | "auto" = "auto") {
  const options = rangeOptions.value;
  if (options.length === 0) {
    selectedRangeStart.value = "";
    selectedRangeEnd.value = "";
    return;
  }

  if (getRangeOptionIndex(selectedRangeStart.value, options) === -1) {
    selectedRangeStart.value = options[0].value;
  }

  if (getRangeOptionIndex(selectedRangeEnd.value, options) === -1) {
    selectedRangeEnd.value = options[options.length - 1].value;
  }

  const startIndex = getRangeOptionIndex(selectedRangeStart.value, options);
  const endIndex = getRangeOptionIndex(selectedRangeEnd.value, options);

  if (startIndex === -1 || endIndex === -1) return;
  if (startIndex <= endIndex) return;

  if (changedField === "end") {
    selectedRangeStart.value = selectedRangeEnd.value;
    return;
  }

  selectedRangeEnd.value = selectedRangeStart.value;
}

const selectedRangeBounds = computed(() => {
  const options = rangeOptions.value;
  if (options.length === 0) {
    return { min: 0, max: 0 };
  }

  const startIndex = getRangeOptionIndex(selectedRangeStart.value, options);
  const endIndex = getRangeOptionIndex(selectedRangeEnd.value, options);
  const safeStartIndex = startIndex === -1 ? 0 : startIndex;
  const safeEndIndex = endIndex === -1 ? options.length - 1 : endIndex;
  const minIndex = Math.min(safeStartIndex, safeEndIndex);
  const maxIndex = Math.max(safeStartIndex, safeEndIndex);

  return {
    min: options[minIndex].position,
    max: options[maxIndex].position,
  };
});

const xAxisRange = computed(() => {
  if (!rawDatasets.value) {
    return { min: 0, max: 0 };
  }

  return selectedRangeBounds.value;
});

function buildChartPoints(series: (number | null)[], timelineEntries: TimelineEntry[]): ChartPoint[] {
  const points = timelineEntries
    .map(({ version, publishedAt, index }) => ({
      x: axisMode.value === "version" ? index : publishedAt,
      y: series[index] ?? null,
      version,
      publishedAt,
    }))
    .filter((point) => axisMode.value !== "time" || point.x > 0)
    .filter((point) => point.x >= selectedRangeBounds.value.min && point.x <= selectedRangeBounds.value.max);

  if (axisMode.value === "time") {
    points.sort((a, b) => a.x - b.x);
  }

  return points;
}

function buildChartDatasets(source: RawDatasetsState, updateLoading = false): ChartDatasetCollection {
  const colors = resourceColors.value;
  const timelineEntries = source.versions.map((version, index) => ({
    version,
    publishedAt: source.publishedAts[index] ?? 0,
    index,
  }));
  let processedCount = 0;
  const totalCharts = (pageEntries.length + 1) * datasetKinds.length;
  const currentChartDatasets = {} as ChartDatasetCollection;

  const createChartSeries = (series: NumericSeries): ChartSeries => ({
    labels: source.versions,
    datasets: resourceTypes.map((type) => ({
      label: text.value.resourceLabels[type],
      data: buildChartPoints(series[type], timelineEntries),
      borderColor: colors[type],
      backgroundColor: colors[type],
      tension: 0.1,
      borderWidth: type === "total" ? 3 : 2,
    })),
  });

  const updateChartData = (pageKey: PageKey, pageData: PageDatasets) => {
    const pageCharts = {} as ChartPageData;

    for (const kind of datasetKinds) {
      pageCharts[kind] = createChartSeries(pageData[kind]);
      if (updateLoading) {
        chartLoadingStatus.value[pageKey][kind] = false;
        processedCount++;
        loadingProgress.value = Math.round((processedCount / totalCharts) * 100);
      }
    }

    currentChartDatasets[pageKey] = pageCharts;
  };

  for (const { key } of pageEntries) {
    updateChartData(key, source.datasets[key]);
  }
  updateChartData("average", source.datasets.average);

  return currentChartDatasets;
}

const chartOptions = computed<ChartOptions<"line">>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  elements: {
    point: {
      radius: 0,
      hitRadius: 5,
      hoverRadius: 5,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: "KiB",
        color: isDark.value ? "#e2e8f0" : "#2c3e50",
      },
      ticks: {
        color: isDark.value ? "#cbd5e0" : "#4a5568",
      },
      grid: {
        color: isDark.value ? "#4a5568" : "#e2e8f0",
      },
    },
    x: {
      type: "linear",
      bounds: "data",
      offset: false,
      grace: 0,
      min: xAxisRange.value.min,
      max: xAxisRange.value.max,
      title: {
        display: true,
        text: axisMode.value === "version" ? text.value.xAxisVersion : text.value.xAxisTime,
        color: isDark.value ? "#e2e8f0" : "#2c3e50",
      },
      ticks: {
        autoSkip: true,
        maxRotation: axisMode.value === "version" ? 45 : 0,
        minRotation: axisMode.value === "version" ? 45 : 0,
        stepSize: axisMode.value === "version" ? 1 : undefined,
        color: isDark.value ? "#cbd5e0" : "#4a5568",
        callback: (value: number | string, index: number, ticks: { value: number | string }[]) => {
          const numericValue = parseTickTimestamp(value);
          if (numericValue === null) return "";

          if (axisMode.value === "version") {
            const versionIndex = Math.round(numericValue);
            if (Math.abs(numericValue - versionIndex) > Number.EPSILON) return "";
            return rawDatasets.value?.versions[versionIndex] ?? "";
          }

          const previousTimestamp = index > 0 ? parseTickTimestamp(ticks[index - 1]?.value) : null;
          return formatTimeAxisTick(numericValue, shouldShowYearOnTick(numericValue, previousTimestamp));
        },
      },
      grid: {
        color: isDark.value ? "#4a5568" : "#e2e8f0",
      },
    },
  },
  plugins: {
    legend: {
      display: true,
      position: "top",
      labels: {
        color: isDark.value ? "#e2e8f0" : "#2c3e50",
      },
    },
    tooltip: {
      mode: "index",
      intersect: false,
      backgroundColor: isDark.value ? "#2d3748" : "#ffffff",
      titleColor: isDark.value ? "#e2e8f0" : "#2c3e50",
      bodyColor: isDark.value ? "#cbd5e0" : "#4a5568",
      borderColor: isDark.value ? "#4a5568" : "#e2e8f0",
      borderWidth: 1,
      callbacks: {
        title: (items: { raw?: unknown }[]) => {
          const point = items[0]?.raw as ChartPoint | undefined;
          if (!point) return "";
          return [point.version, formatPublishedTime(point.publishedAt)];
        },
      },
    },
  },
  interaction: {
    mode: "index",
    axis: "x",
    intersect: false,
  },
}));

function refreshChartDatasetsWithFeedback() {
  if (!rawDatasets.value) return;

  if (chartSettingsDoneTimer) {
    clearTimeout(chartSettingsDoneTimer);
    chartSettingsDoneTimer = null;
  }

  chartSettingsStatus.value = "rendering";
  chartSettingsTransitionToken += 1;
  const currentToken = chartSettingsTransitionToken;
  chartDatasets.value = buildChartDatasets(rawDatasets.value);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (currentToken === chartSettingsTransitionToken) {
        chartSettingsStatus.value = "done";
        chartSettingsDoneTimer = setTimeout(() => {
          if (currentToken === chartSettingsTransitionToken) {
            chartSettingsStatus.value = "idle";
          }
        }, 500);
      }
    });
  });
}

function getChartData(pageKey: PageKey, kind: DatasetKind): ChartSeries | null {
  return chartDatasets.value[pageKey]?.[kind] ?? null;
}

function getChartLoading(pageKey: PageKey, kind: DatasetKind): boolean {
  return chartLoadingStatus.value[pageKey][kind];
}

function hasChartData(pageKey: PageKey, kind: DatasetKind): boolean {
  return getChartData(pageKey, kind) !== null;
}

watch(
  [rangeOptions, axisMode],
  () => {
    normalizeRangeSelection("auto");
  },
  { immediate: true },
);

watch(selectedRangeStart, () => {
  normalizeRangeSelection("start");
});

watch(selectedRangeEnd, () => {
  normalizeRangeSelection("end");
});

watch([isDark, axisMode, selectedRangeStart, selectedRangeEnd, text], () => {
  refreshChartDatasetsWithFeedback();
});

onMounted(async () => {
  try {
    console.timeEnd("📊 Chart Initialization Total Time");
    console.timeEnd("  1️⃣ Data Loading");
    console.timeEnd("  2️⃣ Data Sorting and Processing");
    console.timeEnd("  3️⃣ Chart Data Creation");
  } catch {
    // Ignore non-existent timer errors
  }

  console.time("📊 Chart Initialization Total Time");
  isLoading.value = true;
  loadingProgress.value = 0;
  chartLoadingStatus.value = createChartLoadingState(true);

  try {
    console.time("  1️⃣ Data Loading");
    loadingStage.value = "dataLoading";

    const jsonFiles = import.meta.glob<{ default: unknown }>("../../../.github/page_size_audit_results/*.json");
    const paths = Object.keys(jsonFiles);
    const totalFiles = paths.length;
    let completedCount = 0;

    const loadPromises = paths.map(async (path) => {
      const module = await jsonFiles[path]();
      const version = path.match(/v\d+\.\d+\.\d+/)?.[0];

      completedCount++;
      loadingProgress.value = Math.round((completedCount / totalFiles) * 100);

      if (version && module.default) {
        const data = decodeAuditFile(module.default);
        return {
          version,
          publishedAt: data.metadata.publishedAt,
          data,
        };
      }
      return null;
    });

    const allData = (await Promise.all(loadPromises)).filter((item): item is LoadedAuditEntry => item !== null);

    console.timeEnd("  1️⃣ Data Loading");

    console.time("  2️⃣ Data Sorting and Processing");
    loadingStage.value = "dataProcessing";
    loadingProgress.value = 0;

    allData.sort((a, b) => {
      const parseVersion = (version: string) => version.replace("v", "").split(".").map(Number);
      const [aMajor, aMinor, aPatch] = parseVersion(a.version);
      const [bMajor, bMinor, bPatch] = parseVersion(b.version);

      if (aMajor !== bMajor) return aMajor - bMajor;
      if (aMinor !== bMinor) return aMinor - bMinor;
      return aPatch - bPatch;
    });

    const indexedData: IndexedAuditEntry[] = allData.map(({ version, publishedAt, data }) => ({
      version,
      publishedAt,
      resultsByUrl: new Map<string, AuditPageResult>(
        data.results.map((result: AuditPageResult) => [result.url, result]),
      ),
    }));
    const versions = indexedData.map(({ version }) => version);
    const publishedAts = indexedData.map(({ publishedAt }) => publishedAt);
    const datasets = createDatasetCollection();

    for (const { key, url } of pageEntries) {
      for (const { resultsByUrl } of indexedData) {
        const pageData = resultsByUrl.get(url);
        if (pageData) {
          for (const type of resourceTypes) {
            datasets[key].themeGzipped[type].push(pageData.themeResources[type].transferSize / 1024);
            datasets[key].themeRaw[type].push(pageData.themeResources[type].resourceSize / 1024);
            datasets[key].resourcesGzipped[type].push(pageData.resources[type].transferSize / 1024);
            datasets[key].resourcesRaw[type].push(pageData.resources[type].resourceSize / 1024);
          }
        } else {
          for (const type of resourceTypes) {
            datasets[key].themeGzipped[type].push(null);
            datasets[key].themeRaw[type].push(null);
            datasets[key].resourcesGzipped[type].push(null);
            datasets[key].resourcesRaw[type].push(null);
          }
        }
      }
    }

    const hasCompleteDatasetValues = (
      values: Record<DatasetKind, number | null>,
    ): values is Record<DatasetKind, number> => datasetKinds.every((kind) => values[kind] !== null);

    for (let index = 0; index < versions.length; index++) {
      for (const type of resourceTypes) {
        const sums = {
          themeGzipped: 0,
          themeRaw: 0,
          resourcesGzipped: 0,
          resourcesRaw: 0,
        } satisfies Record<DatasetKind, number>;
        let count = 0;

        for (const { key } of pageEntries) {
          const values = {
            themeGzipped: datasets[key].themeGzipped[type][index],
            themeRaw: datasets[key].themeRaw[type][index],
            resourcesGzipped: datasets[key].resourcesGzipped[type][index],
            resourcesRaw: datasets[key].resourcesRaw[type][index],
          } satisfies Record<DatasetKind, number | null>;

          if (hasCompleteDatasetValues(values)) {
            for (const kind of datasetKinds) {
              sums[kind] += values[kind];
            }
            count++;
          }
        }

        for (const kind of datasetKinds) {
          datasets.average[kind][type].push(count > 0 ? sums[kind] / count : null);
        }
      }
    }

    loadingProgress.value = 100;
    console.timeEnd("  2️⃣ Data Sorting and Processing");

    rawDatasets.value = {
      datasets,
      versions,
      publishedAts,
    };
    normalizeRangeSelection("auto");

    console.time("  3️⃣ Chart Data Creation");
    loadingStage.value = "chartCreation";
    loadingProgress.value = 0;
    chartDatasets.value = buildChartDatasets(rawDatasets.value, true);
    loadingProgress.value = 100;
    console.timeEnd("  3️⃣ Chart Data Creation");
    console.timeEnd("📊 Chart Initialization Total Time");
  } catch (error) {
    console.error(text.value.loadErrorPrefix, error);
  } finally {
    isLoading.value = false;
    loadingProgress.value = 100;
  }
});

onBeforeUnmount(() => {
  if (chartSettingsDoneTimer) {
    clearTimeout(chartSettingsDoneTimer);
    chartSettingsDoneTimer = null;
  }
  activeCharts.clear();
});
</script>

<template>
  <div class="chart-controls">
    <div class="chart-controls__header">
      <div class="chart-controls__title">
        {{ text.chartSettings }}
      </div>
      <span
        v-if="chartSettingsStatus !== 'idle'"
        class="axis-mode-switch__loading"
        aria-live="polite"
      >
        <span
          class="axis-mode-switch__status-icon"
          :class="{ 'axis-mode-switch__status-icon--spinning': chartSettingsStatus === 'rendering' }"
        >
          {{ chartSettingsStatus === "rendering" ? "" : "√" }}
        </span>
        {{ chartSettingsStatus === "rendering" ? text.rendering : text.rendered }}
      </span>
    </div>
    <div class="axis-mode-switch">
      <span class="axis-mode-switch__label">{{ text.axisMode }}</span>
      <label class="axis-mode-switch__control">
        <select
          v-model="axisMode"
          class="axis-mode-switch__select"
          :aria-label="text.ariaAxisMode"
        >
          <option value="version">{{ text.versionSpacing }}</option>
          <option value="time">{{ text.timeSpacing }}</option>
        </select>
      </label>
    </div>
    <div class="chart-range-controls">
      <span class="axis-mode-switch__label">{{ axisMode === "version" ? text.versionRange : text.timeRange }}</span>
      <label class="axis-mode-switch__control">
        <select
          v-model="selectedRangeStart"
          class="axis-mode-switch__select axis-mode-switch__select--range"
          :aria-label="text.ariaRangeStart"
        >
          <option
            v-for="option in rangeOptions"
            :key="`start-${option.value}`"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </label>
      <span class="chart-range-controls__separator">{{ text.rangeSeparator }}</span>
      <label class="axis-mode-switch__control">
        <select
          v-model="selectedRangeEnd"
          class="axis-mode-switch__select axis-mode-switch__select--range"
          :aria-label="text.ariaRangeEnd"
        >
          <option
            v-for="option in rangeOptions"
            :key="`end-${option.value}`"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </label>
    </div>
  </div>

  <section
    v-for="section in sectionList"
    :key="section.key"
    class="performance-chart-section"
  >
    <h3>{{ section.title }}</h3>

    <details
      v-for="dataset in datasetList"
      :key="`${section.key}-${dataset.key}`"
      class="performance-chart-details"
    >
      <summary>{{ dataset.title }}</summary>

      <div class="performance-chart-details__body">
        <ProgressBar
          :is-loading="getChartLoading(section.key, dataset.key)"
          :stage="loadingStage"
          :labels="loadingLabels"
          :progress="loadingProgress"
          :label="text.progressLabel"
        />

        <div v-if="hasChartData(section.key, dataset.key)" class="performance-chart-canvas">
          <LineChart
            :data="getChartData(section.key, dataset.key) ?? { labels: [], datasets: [] }"
            :options="chartOptions"
          />
        </div>
      </div>
    </details>
  </section>
</template>

<style scoped>
.chart-controls {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  margin: 1rem 0 1.5rem;
  padding: 0.85rem 1rem;
}

.chart-controls__header {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 0.85rem;
}

.chart-controls__title {
  color: var(--vp-c-text-1);
  font-weight: 600;
}

.axis-mode-switch,
.chart-range-controls {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.chart-range-controls {
  margin-top: 0.85rem;
}

.axis-mode-switch__label,
.chart-range-controls__separator {
  color: var(--vp-c-text-2);
}

.axis-mode-switch__control {
  align-items: center;
  display: inline-flex;
  position: relative;
}

.axis-mode-switch__select {
  appearance: none;
  background: var(--vp-c-bg);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2.5 4.5L6 8L9.5 4.5' stroke='%236b7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-position: right 0.8rem center;
  background-repeat: no-repeat;
  background-size: 0.75rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  color: var(--vp-c-text-1);
  cursor: pointer;
  min-width: 10rem;
  padding: 0.45rem 2.5rem 0.45rem 0.75rem;
}

.axis-mode-switch__select--range {
  min-width: 13rem;
}

.axis-mode-switch__loading {
  align-items: center;
  color: var(--vp-c-text-2);
  display: inline-flex;
  font-size: 0.95rem;
  gap: 0.5rem;
}

.axis-mode-switch__status-icon {
  align-items: center;
  color: var(--vp-c-brand-1);
  display: inline-flex;
  font-weight: 700;
  height: 0.95rem;
  justify-content: center;
  width: 0.95rem;
}

.axis-mode-switch__status-icon--spinning {
  animation: axis-mode-spin 0.8s linear infinite;
  border: 2px solid color-mix(in srgb, var(--vp-c-brand-1) 25%, transparent);
  border-radius: 999px;
  border-top-color: var(--vp-c-brand-1);
}

.performance-chart-section + .performance-chart-section {
  margin-top: 2rem;
}

.performance-chart-details {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  margin: 1rem 0;
  overflow: hidden;
}

.performance-chart-details > summary {
  color: var(--vp-c-text-1);
  cursor: pointer;
  font-weight: 600;
  padding: 0.9rem 1rem;
  user-select: none;
}

.performance-chart-details[open] > summary {
  border-bottom: 1px solid var(--vp-c-divider);
}

.performance-chart-details__body {
  padding: 0 1rem 1rem;
}

.performance-chart-canvas {
  height: 400px;
  position: relative;
}

@keyframes axis-mode-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
