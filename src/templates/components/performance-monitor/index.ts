type ThemeName = "dark" | "light";
type DockMode = "free" | "top";
type LocaleName = "zh-CN" | "en-US";
type ViewMode = "concise" | "detailed" | "advanced";

interface PanelState {
  compactGraphHeight: number;
  dockMode: DockMode;
  left: number;
  locale: LocaleName;
  minimized: boolean;
  theme: ThemeName;
  top: number;
  totalGraphHeight: number;
  viewMode: ViewMode;
  width: number;
}

interface ThemeVars {
  bad: string;
  buttonBg: string;
  buttonHoverBg: string;
  canvasBg: string;
  fpsFillBottom: string;
  fpsFillTop: string;
  fpsLine: string;
  good: string;
  grid: string;
  longTask: string;
  lowFps: string;
  memFillBottom: string;
  memFillTop: string;
  memLine: string;
  muted: string;
  panelBg: string;
  resizeGrip: string;
  shadow: string;
  text: string;
  warn: string;
}

interface LongTaskPoint {
  duration: number;
  start: number;
}

interface TimedNumberPoint {
  time: number;
  value: number;
}

interface MemoryInfoLike {
  jsHeapSizeLimit: number;
  totalJSHeapSize: number;
  usedJSHeapSize: number;
}

interface LocaleCopy {
  actionClose: string;
  actionDisplayToggle: string;
  actionExitTopDock: string;
  actionHelp: string;
  actionLanguageToggle: string;
  actionMinimizeRestore: string;
  actionResize: string;
  actionThemeToggle: string;
  chartFps: string;
  chartMem: string;
  chartMemHeapMaxLabel: string;
  memLimitLabel: string;
  memUnavailable: string;
  statAvgFps: string;
  statAvgFrameMs: string;
  statCurrentFrameMs: string;
  statDroppedFrames: string;
  statFpsRange: string;
  statHeapGrowthRateMbMin: string;
  statLongTasks: string;
  statOnePercentLowFps: string;
  statP95FrameMs: string;
  statP99FrameMs: string;
  statMemTotalMb: string;
  statMemUsedMb: string;
  summaryLongTasks: string;
  targetLanguageEnglish: string;
  targetLanguageZhHans: string;
  targetThemeDark: string;
  targetThemeLight: string;
  targetViewConcise: string;
  targetViewDetailed: string;
  targetViewAdvanced: string;
  helpContentHtml: string;
  titleMain: string;
  titleMinimized: string;
}

export interface PerformanceMonitorApi {
  destroy: () => void;
  dockTop: () => void;
  maximize: () => void;
  minimize: () => void;
  toggle: () => void;
  toggleTheme: () => void;
  undock: () => void;
}

declare global {
  interface Window {
    __PERF_MONITOR__?: PerformanceMonitorApi;
    __PERF_MONITOR_DEBUG__?: boolean;
  }

  interface Performance {
    memory?: MemoryInfoLike;
  }
}

const STORAGE_KEY = "__higan_perf_monitor_state_v9__";
const DEBUG_RESIZE_KEY = "__higan_perf_monitor_debug_resize__";
const DEFAULT_LOCALE: LocaleName = detectBrowserLocale();
const DEFAULT_STATE: PanelState = {
  compactGraphHeight: 75,
  dockMode: "free",
  left: 12,
  locale: DEFAULT_LOCALE,
  minimized: false,
  theme: "dark",
  top: 12,
  totalGraphHeight: 150,
  viewMode: "detailed",
  width: 320,
};

const MINIMIZED_WIDTH = 210;
const MIN_PANEL_WIDTH = 260;
const MIN_COMPACT_GRAPH_HEIGHT = 70;
const MAX_PANEL_WIDTH = 560;
const MIN_TOTAL_GRAPH_HEIGHT = 120;
const MAX_TOTAL_GRAPH_HEIGHT = 320;
const SNAP_DISTANCE = 20;
const TOP_DOCK_TRIGGER = 18;
const TOP_DOCK_MARGIN = 8;
const MAX_TOP_DOCK_WIDTH = 720;
const NARROW_HEADER_THRESHOLD = 420;
const COMPACT_ACTIONS_THRESHOLD = 360;
const MINIMAL_ACTIONS_THRESHOLD = 320;
const ANIMATION_MS = 180;
const TOP_DOCK_ANIMATION_MS = 170;
const TOP_DOCK_MOVE_ANIMATION_MS = 136;
const TOP_DOCK_SHAPE_ANIMATION_MS = 92;
const TOP_DOCK_SHAPE_DELAY_MS = 20;
const FPS_CAP = 60;
const UPDATE_INTERVAL = 120;
const RECENT_WINDOW_MS = 1000;
const DPR = Math.max(1, window.devicePixelRatio || 1);
const BUTTON_HIT_SIZE = 28;
const RESIZE_HANDLE_HIT_SIZE = 22;
const AXIS_LEFT_GUTTER = 0;
const AXIS_RIGHT_GUTTER = 2;
const AXIS_TOP_GUTTER = 0;
const AXIS_BOTTOM_GUTTER = 14;

const LOCALE_COPY: Record<LocaleName, LocaleCopy> = {
  "zh-CN": {
    actionClose: "关闭",
    actionDisplayToggle: "切换显示等级（简洁 / 详情 / 更详情）",
    actionExitTopDock: "退出顶部停靠",
    actionHelp: "查看指标说明",
    actionLanguageToggle: "切换语言（简体中文 / English）",
    actionMinimizeRestore: "最小化 / 还原",
    actionResize: "拖拽缩放",
    actionThemeToggle: "切换深色 / 浅色主题",
    chartFps: "帧率曲线 (FPS) / 长任务标记 (50ms+)",
    chartMem: "JS 堆内存曲线 (MB)",
    chartMemHeapMaxLabel: "堆内存最大大小",
    memLimitLabel: "图表上限 (MB)",
    memUnavailable: "performance.memory 不可用",
    statAvgFps: "平均帧率 (FPS)",
    statAvgFrameMs: "平均帧耗时 (ms)",
    statCurrentFrameMs: "当前帧耗时 (ms)",
    statDroppedFrames: "估算掉帧数 (frames)",
    statFpsRange: "帧率范围 (Min/Max)",
    statHeapGrowthRateMbMin: "堆内存增速 (MB/min)",
    statLongTasks: "长任务次数 (50ms+)",
    statOnePercentLowFps: "1% Low FPS",
    statP95FrameMs: "P95 帧耗时 (ms)",
    statP99FrameMs: "P99 帧耗时 (ms)",
    statMemTotalMb: "堆内存总量 (MB)",
    statMemUsedMb: "已用堆内存 (MB)",
    summaryLongTasks: "长任务",
    targetLanguageEnglish: "English",
    targetLanguageZhHans: "简体中文",
    targetThemeDark: "深色",
    targetThemeLight: "浅色",
    targetViewConcise: "简洁",
    targetViewDetailed: "详情",
    targetViewAdvanced: "更详情",
    helpContentHtml:
      '<div style="font-weight:700;margin-bottom:6px;">指标与功能说明</div>' +
      "<div><b>平均帧率 (FPS)</b>：采样窗口内的平均帧率。</div>" +
      "<div><b>平均帧耗时 / P95 / P99 / 1% Low</b>：衡量流畅度与卡顿尾部。</div>" +
      "<div><b>长任务次数 (50ms+)</b>：主线程被长时间阻塞的次数。</div>" +
      "<div><b>已用/总堆内存 + 堆内存增速</b>：观察内存压力与泄漏趋势。</div>" +
      '<div style="margin-top:6px;"><b>按钮</b>：主题、语言、简洁/详情/更详情模式、最小化/还原、关闭。</div>' +
      "<div><b>拖拽行为</b>：拖动面板空白区域移动，拖右下角调整图表大小。</div>",
    titleMain: "性能监视器",
    titleMinimized: "性能监视器（已最小化）",
  },
  "en-US": {
    actionClose: "Close",
    actionDisplayToggle: "Cycle display level (concise / detailed / advanced)",
    actionExitTopDock: "Exit top dock",
    actionHelp: "View metric guide",
    actionLanguageToggle: "Switch language (English / Simplified Chinese)",
    actionMinimizeRestore: "Minimize / Restore",
    actionResize: "Drag to resize",
    actionThemeToggle: "Toggle light/dark theme",
    chartFps: "FPS Trend (FPS) / Long Task Markers (50ms+)",
    chartMem: "JS Heap Trend (MB)",
    chartMemHeapMaxLabel: "Heap Size Limit",
    memLimitLabel: "Chart Ceiling (MB)",
    memUnavailable: "performance.memory unavailable",
    statAvgFps: "Average FPS",
    statAvgFrameMs: "Average Frame Time (ms)",
    statCurrentFrameMs: "Last Frame Delta (ms)",
    statDroppedFrames: "Estimated Dropped Frames",
    statFpsRange: "FPS Range (Min/Max)",
    statHeapGrowthRateMbMin: "Heap Growth (MB/min)",
    statLongTasks: "Long Tasks (50ms+)",
    statOnePercentLowFps: "1% Low FPS",
    statP95FrameMs: "P95 Frame Time (ms)",
    statP99FrameMs: "P99 Frame Time (ms)",
    statMemTotalMb: "Total JS Heap (MB)",
    statMemUsedMb: "Used JS Heap (MB)",
    summaryLongTasks: "Long Tasks",
    targetLanguageEnglish: "English",
    targetLanguageZhHans: "简体中文",
    targetThemeDark: "Dark",
    targetThemeLight: "Light",
    targetViewConcise: "Concise",
    targetViewDetailed: "Detailed",
    targetViewAdvanced: "Advanced",
    helpContentHtml:
      '<div style="font-weight:700;margin-bottom:6px;">Metric & Feature Guide</div>' +
      "<div><b>Average FPS</b>: Mean frame rate over the recent sampling window.</div>" +
      "<div><b>Avg/P95/P99 Frame Time & 1% Low FPS</b>: Smoothness and tail-latency quality.</div>" +
      "<div><b>Long Tasks (50ms+)</b>: Main-thread blocking events over 50ms.</div>" +
      "<div><b>Used/Total JS Heap + Heap Growth</b>: Memory pressure and leak trend signals.</div>" +
      '<div style="margin-top:6px;"><b>Buttons</b>: theme, language, concise/detailed/advanced mode, minimize/restore, close.</div>' +
      "<div><b>Drag behavior</b>: drag blank panel area to move, drag bottom-right corner to resize charts.</div>",
    titleMain: "Performance Monitor",
    titleMinimized: "Performance Monitor (Minimized)",
  },
};

const THEMES: Record<ThemeName, ThemeVars> = {
  dark: {
    bad: "#f85149",
    buttonBg: "rgba(255,255,255,0.06)",
    buttonHoverBg: "rgba(255,255,255,0.12)",
    canvasBg: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
    fpsFillBottom: "rgba(88,166,255,0.02)",
    fpsFillTop: "rgba(88,166,255,0.28)",
    fpsLine: "#58a6ff",
    good: "#3fb950",
    grid: "rgba(255,255,255,0.08)",
    longTask: "rgba(248,81,73,0.95)",
    lowFps: "rgba(255,180,0,0.82)",
    memFillBottom: "rgba(63,185,80,0.02)",
    memFillTop: "rgba(63,185,80,0.26)",
    memLine: "#3fb950",
    muted: "#8b949e",
    panelBg: "rgba(15,18,24,0.92)",
    resizeGrip: "linear-gradient(135deg, transparent 0 45%, rgba(255,255,255,0.18) 45% 55%, transparent 55% 100%)",
    shadow: "0 1px 2px rgba(0,0,0,0.28)",
    text: "#e6edf3",
    warn: "#d29922",
  },
  light: {
    bad: "#cf222e",
    buttonBg: "rgba(31,35,40,0.06)",
    buttonHoverBg: "rgba(31,35,40,0.12)",
    canvasBg: "linear-gradient(180deg, rgba(31,35,40,0.04), rgba(31,35,40,0.02))",
    fpsFillBottom: "rgba(9,105,218,0.03)",
    fpsFillTop: "rgba(9,105,218,0.22)",
    fpsLine: "#0969da",
    good: "#1a7f37",
    grid: "rgba(31,35,40,0.10)",
    longTask: "rgba(207,34,46,0.92)",
    lowFps: "rgba(191,135,0,0.78)",
    memFillBottom: "rgba(26,127,55,0.03)",
    memFillTop: "rgba(26,127,55,0.18)",
    memLine: "#1a7f37",
    muted: "#59636e",
    panelBg: "rgba(255,255,255,0.94)",
    resizeGrip: "linear-gradient(135deg, transparent 0 45%, rgba(31,35,40,0.18) 45% 55%, transparent 55% 100%)",
    shadow: "0 1px 2px rgba(31,35,40,0.08)",
    text: "#1f2328",
    warn: "#9a6700",
  },
};

function clamp(value: number, min: number, max: number): number {
  return max < min ? max : Math.min(Math.max(value, min), max);
}

function detectBrowserLocale(): LocaleName {
  const preferredLocales = [...(navigator.languages ?? []), navigator.language];
  for (const locale of preferredLocales) {
    if (typeof locale !== "string") continue;
    if (locale.toLowerCase().startsWith("zh")) return "zh-CN";
  }
  return "en-US";
}

function isResizeDebugEnabled(): boolean {
  if (window.__PERF_MONITOR_DEBUG__ === true) return true;
  try {
    const queryDebug = new URLSearchParams(window.location.search).get("perfMonitorDebug");
    if (queryDebug === "1" || queryDebug === "true") return true;
    return localStorage.getItem(DEBUG_RESIZE_KEY) === "1";
  } catch {
    return false;
  }
}

function loadState(): PanelState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw) as Partial<PanelState> & { viewMode?: string };
    const detailedGraphHeight = clamp(
      Number.isFinite(parsed.totalGraphHeight) ? Number(parsed.totalGraphHeight) : DEFAULT_STATE.totalGraphHeight,
      MIN_TOTAL_GRAPH_HEIGHT,
      MAX_TOTAL_GRAPH_HEIGHT,
    );
    const compactGraphHeightFallback = Math.round(detailedGraphHeight / 2);
    let viewMode: ViewMode = DEFAULT_STATE.viewMode;
    if (parsed.viewMode === "concise" || parsed.viewMode === "advanced") {
      viewMode = parsed.viewMode;
    } else if (parsed.viewMode === "detailed") {
      viewMode = "detailed";
    }
    return {
      compactGraphHeight: clamp(
        Number.isFinite(parsed.compactGraphHeight) ? Number(parsed.compactGraphHeight) : compactGraphHeightFallback,
        MIN_COMPACT_GRAPH_HEIGHT,
        MAX_TOTAL_GRAPH_HEIGHT,
      ),
      dockMode: parsed.dockMode === "top" ? "top" : "free",
      left: Number.isFinite(parsed.left) ? Number(parsed.left) : DEFAULT_STATE.left,
      locale: parsed.locale === "zh-CN" || parsed.locale === "en-US" ? parsed.locale : DEFAULT_STATE.locale,
      minimized: Boolean(parsed.minimized),
      theme: parsed.theme === "light" ? "light" : "dark",
      top: Number.isFinite(parsed.top) ? Number(parsed.top) : DEFAULT_STATE.top,
      totalGraphHeight: detailedGraphHeight,
      viewMode,
      width: clamp(
        Number.isFinite(parsed.width) ? Number(parsed.width) : DEFAULT_STATE.width,
        MIN_PANEL_WIDTH,
        MAX_PANEL_WIDTH,
      ),
    };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

function saveState(state: PanelState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

function formatMBValue(bytes: number): string {
  return (bytes / 1048576).toFixed(1);
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  let sum = 0;
  for (const value of values) sum += value;
  return sum / values.length;
}

function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const rank = (clamp(p, 0, 100) / 100) * (sorted.length - 1);
  const lower = Math.floor(rank);
  const upper = Math.ceil(rank);
  if (lower === upper) return sorted[lower];
  const weight = rank - lower;
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

function computeHeapGrowthMbPerMin(samples: Array<number | null>, times: number[]): number | null {
  let start = -1;
  let end = -1;
  for (let i = 0; i < samples.length; i += 1) {
    if (samples[i] === null) continue;
    start = i;
    break;
  }
  for (let i = samples.length - 1; i >= 0; i -= 1) {
    if (samples[i] === null) continue;
    end = i;
    break;
  }
  if (start < 0 || end < 0 || end <= start) return null;
  const deltaMs = times[end] - times[start];
  if (!Number.isFinite(deltaMs) || deltaMs < 1000) return null;
  const deltaBytes = (samples[end] ?? 0) - (samples[start] ?? 0);
  return deltaBytes / 1048576 / (deltaMs / 60000);
}

function averageRecentNumbers(samples: number[], times: number[], windowMs: number, fallback: number): number {
  if (samples.length === 0 || times.length === 0) return fallback;
  const endTime = times[times.length - 1];
  const cutoff = endTime - Math.max(1, windowMs);
  let sum = 0;
  let count = 0;
  for (let i = samples.length - 1; i >= 0; i -= 1) {
    if (times[i] < cutoff) break;
    const value = samples[i];
    if (!Number.isFinite(value)) continue;
    sum += value;
    count += 1;
  }
  return count > 0 ? sum / count : fallback;
}

function maxRecentNumbers(samples: number[], times: number[], windowMs: number, fallback: number): number {
  if (samples.length === 0 || times.length === 0) return fallback;
  const endTime = times[times.length - 1];
  const cutoff = endTime - Math.max(1, windowMs);
  let maxValue = Number.NEGATIVE_INFINITY;
  for (let i = samples.length - 1; i >= 0; i -= 1) {
    if (times[i] < cutoff) break;
    const value = samples[i];
    if (!Number.isFinite(value)) continue;
    if (value > maxValue) maxValue = value;
  }
  return Number.isFinite(maxValue) ? maxValue : fallback;
}

function averageRecentNullableNumbers(
  samples: Array<number | null>,
  times: number[],
  windowMs: number,
  fallback: number,
): number {
  if (samples.length === 0 || times.length === 0) return fallback;
  const endTime = times[times.length - 1];
  const cutoff = endTime - Math.max(1, windowMs);
  let sum = 0;
  let count = 0;
  for (let i = samples.length - 1; i >= 0; i -= 1) {
    if (times[i] < cutoff) break;
    const value = samples[i];
    if (value === null || !Number.isFinite(value)) continue;
    sum += value;
    count += 1;
  }
  return count > 0 ? sum / count : fallback;
}

function maxRecentNullableNumbers(
  samples: Array<number | null>,
  times: number[],
  windowMs: number,
  fallback: number,
): number {
  if (samples.length === 0 || times.length === 0) return fallback;
  const endTime = times[times.length - 1];
  const cutoff = endTime - Math.max(1, windowMs);
  let maxValue = Number.NEGATIVE_INFINITY;
  for (let i = samples.length - 1; i >= 0; i -= 1) {
    if (times[i] < cutoff) break;
    const value = samples[i];
    if (value === null || !Number.isFinite(value)) continue;
    if (value > maxValue) maxValue = value;
  }
  return Number.isFinite(maxValue) ? maxValue : fallback;
}

function resizeArrayTail<T>(values: T[], desired: number, fillValue: T): T[] {
  const tail = values.slice(-desired);
  return tail.length >= desired ? tail : new Array(desired - tail.length).fill(fillValue).concat(tail);
}

function resizeTimeArray(values: number[], desired: number, now: number): number[] {
  const tail = values.slice(-desired);
  if (tail.length >= desired) return tail;
  const missing = desired - tail.length;
  const start = tail.length > 0 ? tail[0] - missing * 16.7 : now - desired * 16.7;
  return Array.from({ length: missing }, (_, index) => start + index * 16.7).concat(tail);
}

function getDockWidth(): number {
  const viewportLimit = Math.max(0, window.innerWidth - TOP_DOCK_MARGIN * 2);
  const maxDockWidth = Math.min(MAX_TOP_DOCK_WIDTH, viewportLimit);
  const minDockWidth = Math.min(420, maxDockWidth);
  return clamp(Math.round(window.innerWidth * 0.42), minDockWidth, maxDockWidth);
}

function getCurrentPanelWidth(state: PanelState): number {
  if (state.dockMode === "top") return getDockWidth();
  return state.minimized ? MINIMIZED_WIDTH : state.width;
}

function getDetailedGraphHeights(totalHeight: number): { fpsHeight: number; memHeight: number } {
  const clampedTotal = clamp(totalHeight, MIN_TOTAL_GRAPH_HEIGHT, MAX_TOTAL_GRAPH_HEIGHT);
  const memHeight = clamp(Math.round(clampedTotal * 0.38), 44, 140);
  const fpsHeight = clampedTotal - memHeight;
  return { fpsHeight, memHeight };
}

function findDetailedTotalHeightByFpsHeight(targetFpsHeight: number): number {
  let bestTotalHeight = MIN_TOTAL_GRAPH_HEIGHT;
  let bestDiff = Number.POSITIVE_INFINITY;
  for (let total = MIN_TOTAL_GRAPH_HEIGHT; total <= MAX_TOTAL_GRAPH_HEIGHT; total += 1) {
    const { fpsHeight } = getDetailedGraphHeights(total);
    const diff = Math.abs(fpsHeight - targetFpsHeight);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestTotalHeight = total;
    }
  }
  return bestTotalHeight;
}

function getDims(state: PanelState): { fpsHeight: number; graphWidth: number; memHeight: number; panelWidth: number } {
  const panelWidth = getCurrentPanelWidth(state);
  const graphWidth = Math.max(220, panelWidth - 24);
  if (state.viewMode === "concise") {
    return {
      fpsHeight: 0,
      graphWidth,
      memHeight: 0,
      panelWidth,
    };
  }
  if (state.viewMode === "detailed") {
    return {
      fpsHeight: clamp(state.compactGraphHeight, MIN_COMPACT_GRAPH_HEIGHT, MAX_TOTAL_GRAPH_HEIGHT),
      graphWidth,
      memHeight: 0,
      panelWidth,
    };
  }
  const { fpsHeight, memHeight } = getDetailedGraphHeights(state.totalGraphHeight);
  return { fpsHeight, graphWidth, memHeight, panelWidth };
}

function setCanvasSize(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
): void {
  canvas.width = Math.max(1, Math.round(width * DPR));
  canvas.height = Math.max(1, Math.round(height * DPR));
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  context.setTransform(DPR, 0, 0, DPR, 0, 0);
}

function createCanvas(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.style.display = "block";
  canvas.style.borderRadius = "8px";
  return canvas;
}

function createButton(label: string, titleText: string, minWidth: number): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.title = titleText;
  button.setAttribute("aria-label", titleText);
  button.setAttribute("data-perf-interactive", "true");
  button.style.cssText = [
    `height:${BUTTON_HIT_SIZE}px`,
    `min-width:${Math.max(minWidth, BUTTON_HIT_SIZE)}px`,
    "border:0",
    "border-radius:8px",
    "cursor:pointer",
    "touch-action:manipulation",
    "position:relative",
    "z-index:3",
    "outline:2px solid transparent",
    "outline-offset:2px",
    "font:12px/1 Consolas, Menlo, Monaco, monospace",
    "padding:0 8px",
  ].join(";");
  return button;
}

export function initPerformanceMonitor(): PerformanceMonitorApi {
  window.__PERF_MONITOR__?.destroy();
  const state = loadState();
  const dims = getDims(state);
  const now = performance.now();
  const transitionMs = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? 0 : ANIMATION_MS;

  let themeVars = THEMES[state.theme];
  let localeCopy = LOCALE_COPY[state.locale];
  let fpsSamples = new Array<number>(dims.graphWidth).fill(FPS_CAP);
  let memSamples = new Array<number | null>(dims.graphWidth).fill(null);
  let sampleTimes = Array.from({ length: dims.graphWidth }, (_, index) => now - (dims.graphWidth - index) * 16.7);
  const frameTimes: number[] = [];
  let longTasks: LongTaskPoint[] = [];
  let longTaskStartIndex = 0;
  let fpsRecentPoints: TimedNumberPoint[] = [];
  let fpsRecentMaxDeque: TimedNumberPoint[] = [];
  let fpsRecentSum = 0;
  let fpsRecentCount = 0;
  let memRecentPoints: TimedNumberPoint[] = [];
  let memRecentMaxDeque: TimedNumberPoint[] = [];
  let memRecentSum = 0;
  let memRecentCount = 0;
  let droppedFrames = 0;
  let lastTime = performance.now();
  let lastUpdate = lastTime;
  let lastDeltaValue = 0;
  let lastPerfLogAt = lastTime;
  let drawCostTotalMs = 0;
  let drawCostFrames = 0;
  let rafId = 0;
  let observer: PerformanceObserver | null = null;
  let destroyed = false;
  let dragState: { offsetX: number; offsetY: number; pointerId: number } | null = null;
  let resizeState: {
    pointerId: number;
    startGraphHeight: number;
    startWidth: number;
    startX: number;
    startY: number;
  } | null = null;
  let lastResizeDebugAt = 0;
  let helpButtonHovering = false;
  let helpPopoverHovering = false;
  let helpPopoverPinned = false;
  let helpPopoverHideTimer = 0;
  let lastSrStatusAt = 0;
  let lastSrStatusText = "";

  const panel = document.createElement("div");
  panel.id = "performance-monitor-pro";
  panel.setAttribute("role", "region");
  panel.setAttribute("aria-label", localeCopy.titleMain);
  panel.style.cssText = [
    "position:fixed",
    "z-index:2147483646",
    "padding:10px",
    "box-sizing:border-box",
    "overflow:hidden",
    "font:12px/1.4 Consolas, Menlo, Monaco, monospace",
    "user-select:none",
  ].join(";");

  const header = document.createElement("div");
  header.style.cssText = [
    "display:flex",
    "align-items:center",
    "justify-content:space-between",
    "gap:8px",
    "font-weight:700",
    "letter-spacing:.2px",
    "cursor:move",
    "touch-action:none",
  ].join(";");

  const title = document.createElement("div");
  title.style.cssText = ["flex:1", "overflow:hidden", "white-space:nowrap", "text-overflow:ellipsis"].join(";");
  title.style.transition = `opacity ${transitionMs}ms ease`;

  const summary = document.createElement("div");
  summary.style.cssText = [
    "flex:0 1 auto",
    "overflow:hidden",
    "white-space:nowrap",
    "text-overflow:ellipsis",
    "font-weight:400",
    "display:none",
  ].join(";");
  summary.style.transition = `opacity ${transitionMs}ms ease`;

  const secondaryActions = document.createElement("div");
  secondaryActions.style.cssText = [
    "display:flex",
    "align-items:center",
    "gap:6px",
    "flex-shrink:0",
    "padding:2px",
    "border-radius:10px",
    "border:1px solid transparent",
    "position:relative",
    "z-index:4",
  ].join(";");
  const primaryActions = document.createElement("div");
  primaryActions.style.cssText = [
    "display:flex",
    "align-items:center",
    "gap:6px",
    "flex-shrink:0",
    "padding:2px",
    "border-radius:10px",
    "border:1px solid transparent",
    "position:relative",
    "z-index:4",
  ].join(";");

  const themeButton = createButton("", localeCopy.actionThemeToggle, 46);
  const languageButton = createButton("", localeCopy.actionLanguageToggle, 68);
  const viewModeButton = createButton("", localeCopy.actionDisplayToggle, 58);
  const helpButton = createButton("?", localeCopy.actionHelp, 22);
  helpButton.setAttribute("aria-haspopup", "true");
  helpButton.setAttribute("aria-controls", "performance-monitor-help-popover");
  helpButton.setAttribute("aria-describedby", "performance-monitor-help-popover");
  helpButton.setAttribute("aria-expanded", "false");
  const minimizeButton = createButton("-", localeCopy.actionMinimizeRestore, 22);
  const closeButton = createButton("x", localeCopy.actionClose, 22);
  const controlButtons = [themeButton, languageButton, viewModeButton, helpButton, minimizeButton, closeButton];
  secondaryActions.append(themeButton, languageButton, viewModeButton, helpButton);
  primaryActions.append(minimizeButton, closeButton);
  header.append(title, summary, secondaryActions, primaryActions);

  const body = document.createElement("div");
  body.style.overflow = "hidden";
  body.style.transformOrigin = "center top";
  body.style.transition = `opacity ${transitionMs}ms ease, transform ${transitionMs}ms ease, max-height ${transitionMs}ms ease`;
  const stats = document.createElement("div");
  stats.style.cssText = ["display:grid", "grid-template-columns:1fr 1fr", "gap:4px 10px", "margin-bottom:8px"].join(
    ";",
  );
  stats.setAttribute("aria-hidden", "true");

  const fpsTitle = document.createElement("div");
  fpsTitle.textContent = localeCopy.chartFps;
  fpsTitle.style.cssText = "margin:4px 0 6px;";

  const fpsCanvas = createCanvas();
  fpsCanvas.setAttribute("role", "img");
  fpsCanvas.setAttribute("aria-label", localeCopy.chartFps);
  const fpsContext2d = fpsCanvas.getContext("2d")!;
  if (!fpsContext2d) throw new Error("Failed to create performance monitor canvas context.");

  const memTitle = document.createElement("div");
  memTitle.textContent = localeCopy.chartMem;
  memTitle.style.cssText = "margin:8px 0 6px;";

  const memCanvas = createCanvas();
  memCanvas.setAttribute("role", "img");
  memCanvas.setAttribute("aria-label", localeCopy.chartMem);
  const memContext2d = memCanvas.getContext("2d")!;
  if (!memContext2d) throw new Error("Failed to create performance monitor memory context.");

  body.append(stats, fpsTitle, fpsCanvas, memTitle, memCanvas);

  const resizeHandle = document.createElement("div");
  resizeHandle.title = localeCopy.actionResize;
  resizeHandle.setAttribute("role", "button");
  resizeHandle.setAttribute("aria-label", localeCopy.actionResize);
  resizeHandle.setAttribute("data-perf-interactive", "true");
  resizeHandle.setAttribute(
    "aria-keyshortcuts",
    "ArrowLeft ArrowRight ArrowUp ArrowDown Shift+ArrowLeft Shift+ArrowRight Shift+ArrowUp Shift+ArrowDown",
  );
  resizeHandle.tabIndex = 0;
  resizeHandle.style.cssText = [
    "position:absolute",
    "right:4px",
    "bottom:4px",
    `width:${RESIZE_HANDLE_HIT_SIZE}px`,
    `height:${RESIZE_HANDLE_HIT_SIZE}px`,
    "cursor:nwse-resize",
    "border-radius:6px",
    "z-index:3",
    "outline:2px solid transparent",
    "outline-offset:2px",
    "touch-action:none",
  ].join(";");

  const helpPopover = document.createElement("div");
  helpPopover.id = "performance-monitor-help-popover";
  helpPopover.setAttribute("role", "tooltip");
  helpPopover.setAttribute("aria-hidden", "true");
  helpPopover.style.cssText = [
    "position:fixed",
    "left:12px",
    "top:12px",
    "width:320px",
    "max-height:320px",
    "overflow:auto",
    "padding:10px 12px",
    "box-sizing:border-box",
    "border-radius:10px",
    "font:12px/1.5 Consolas, Menlo, Monaco, monospace",
    "z-index:2147483647",
    "opacity:0",
    "pointer-events:none",
    "transform:translateY(-6px)",
    `transition:opacity ${transitionMs}ms ease, transform ${transitionMs}ms ease`,
  ].join(";");

  panel.append(header, body, resizeHandle);

  const srStatus = document.createElement("div");
  srStatus.setAttribute("role", "status");
  srStatus.setAttribute("aria-live", "polite");
  srStatus.setAttribute("aria-atomic", "true");
  srStatus.style.cssText = [
    "position:absolute",
    "width:1px",
    "height:1px",
    "padding:0",
    "margin:-1px",
    "overflow:hidden",
    "clip:rect(0,0,0,0)",
    "white-space:nowrap",
    "border:0",
  ].join(";");
  panel.append(srStatus);
  document.body.append(helpPopover);
  document.body.append(panel);

  if (isResizeDebugEnabled()) {
    console.log("[PerfMonitor:resize] debug enabled");
  }

  function shouldShowMonitorBody(): boolean {
    return state.dockMode === "free" && !state.minimized;
  }

  function getActiveGraphHeight(): number {
    return state.viewMode === "advanced" ? state.totalGraphHeight : state.compactGraphHeight;
  }

  function setActiveGraphHeight(nextHeight: number): void {
    if (state.viewMode === "advanced") state.totalGraphHeight = nextHeight;
    else state.compactGraphHeight = nextHeight;
  }

  function getMinGraphHeightForMode(): number {
    return state.viewMode === "advanced" ? MIN_TOTAL_GRAPH_HEIGHT : MIN_COMPACT_GRAPH_HEIGHT;
  }

  function getMaxResizableGraphHeight(): number {
    const minHeight = getMinGraphHeightForMode();
    const viewportRoom = Math.max(minHeight, window.innerHeight - state.top - 8);
    const currentGraphHeight =
      state.viewMode === "advanced" ? fpsCanvas.offsetHeight + memCanvas.offsetHeight : fpsCanvas.offsetHeight;
    const nonGraphHeight = Math.max(0, panel.offsetHeight - currentGraphHeight);
    const maxByViewport = Math.floor(viewportRoom - nonGraphHeight);
    return clamp(maxByViewport, minHeight, MAX_TOTAL_GRAPH_HEIGHT);
  }

  function logResizeDebug(stage: string, details: Record<string, unknown> = {}, force = false): void {
    if (!isResizeDebugEnabled()) return;
    const nowTs = performance.now();
    if (!force && nowTs - lastResizeDebugAt < 120) return;
    lastResizeDebugAt = nowTs;
    const rect = panel.getBoundingClientRect();
    const viewportBottom = window.innerHeight - 8;
    console.log("[PerfMonitor:resize]", {
      stage,
      viewMode: state.viewMode,
      panelRect: {
        top: Math.round(rect.top),
        bottom: Math.round(rect.bottom),
        height: Math.round(rect.height),
      },
      viewportBottom,
      overflowBottom: Math.round(rect.bottom - viewportBottom),
      state: {
        top: state.top,
        width: state.width,
        detailedGraphHeight: state.totalGraphHeight,
        compactGraphHeight: state.compactGraphHeight,
      },
      layout: {
        headerHeight: header.offsetHeight,
        bodyHeight: body.offsetHeight,
        fpsCanvasHeight: fpsCanvas.offsetHeight,
        memCanvasHeight: memCanvas.offsetHeight,
        memVisible: memCanvas.style.display !== "none",
      },
      ...details,
    });
  }

  function clearHelpPopoverHideTimer(): void {
    if (!helpPopoverHideTimer) return;
    window.clearTimeout(helpPopoverHideTimer);
    helpPopoverHideTimer = 0;
  }

  function positionHelpPopover(): void {
    const buttonRect = helpButton.getBoundingClientRect();
    const viewportPadding = 12;
    const targetWidth = clamp(window.innerWidth - viewportPadding * 2, 260, 420);
    helpPopover.style.width = `${targetWidth}px`;
    const popRect = helpPopover.getBoundingClientRect();
    const targetHeight = Math.min(320, Math.max(80, popRect.height || 180));

    let left = buttonRect.right - targetWidth;
    left = clamp(left, viewportPadding, window.innerWidth - targetWidth - viewportPadding);

    let top = buttonRect.bottom + 8;
    if (top + targetHeight > window.innerHeight - viewportPadding) {
      top = buttonRect.top - targetHeight - 8;
    }
    top = clamp(top, viewportPadding, window.innerHeight - targetHeight - viewportPadding);

    helpPopover.style.left = `${Math.round(left)}px`;
    helpPopover.style.top = `${Math.round(top)}px`;
  }

  function syncHelpPopoverVisibility(): void {
    const visible = helpPopoverPinned || helpButtonHovering || helpPopoverHovering;
    if (visible) positionHelpPopover();
    helpPopover.style.opacity = visible ? "1" : "0";
    helpPopover.style.pointerEvents = visible ? "auto" : "none";
    helpPopover.style.transform = visible ? "translateY(0)" : "translateY(-6px)";
    helpPopover.setAttribute("aria-hidden", visible ? "false" : "true");
    helpButton.setAttribute("aria-expanded", visible ? "true" : "false");
  }

  function scheduleHelpPopoverHide(): void {
    clearHelpPopoverHideTimer();
    helpPopoverHideTimer = window.setTimeout(() => {
      if (!helpPopoverPinned && !helpButtonHovering && !helpPopoverHovering) syncHelpPopoverVisibility();
    }, 120);
  }

  function closeHelpPopover(): void {
    helpPopoverPinned = false;
    helpButtonHovering = false;
    helpPopoverHovering = false;
    clearHelpPopoverHideTimer();
    syncHelpPopoverVisibility();
  }

  function onHelpButtonClick(event: MouseEvent): void {
    helpPopoverPinned = !helpPopoverPinned;
    if (!helpPopoverPinned) {
      closeHelpPopover();
      return;
    }
    helpButtonHovering = true;
    clearHelpPopoverHideTimer();
    syncHelpPopoverVisibility();
    event.preventDefault();
    event.stopPropagation();
  }

  function onHelpButtonPointerEnter(): void {
    helpButtonHovering = true;
    clearHelpPopoverHideTimer();
    syncHelpPopoverVisibility();
  }

  function onHelpButtonPointerLeave(): void {
    helpButtonHovering = false;
    scheduleHelpPopoverHide();
  }

  function onHelpPopoverPointerEnter(): void {
    helpPopoverHovering = true;
    clearHelpPopoverHideTimer();
    syncHelpPopoverVisibility();
  }

  function onHelpPopoverPointerLeave(): void {
    helpPopoverHovering = false;
    scheduleHelpPopoverHide();
  }

  function onHelpButtonFocus(): void {
    onHelpButtonPointerEnter();
  }

  function onHelpButtonBlur(event: FocusEvent): void {
    const related = event.relatedTarget;
    if (related instanceof Node && helpPopover.contains(related)) return;
    helpButtonHovering = false;
    if (helpPopoverPinned) closeHelpPopover();
    else scheduleHelpPopoverHide();
  }

  function onWindowPointerDown(event: PointerEvent): void {
    if (!helpPopoverPinned) return;
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (helpButton.contains(target) || helpPopover.contains(target)) return;
    closeHelpPopover();
  }

  function onWindowKeyDown(event: KeyboardEvent): void {
    if (event.key !== "Escape") return;
    if (helpButton.getAttribute("aria-expanded") !== "true") return;
    closeHelpPopover();
    helpButton.focus();
    event.preventDefault();
  }

  function setButtonTheme(button: HTMLButtonElement): void {
    button.style.background = themeVars.buttonBg;
    button.style.color = themeVars.text;
  }

  function getNextViewMode(viewMode: ViewMode): ViewMode {
    if (viewMode === "concise") return "detailed";
    if (viewMode === "detailed") return "advanced";
    return "concise";
  }

  function getViewModeTargetText(viewMode: ViewMode): string {
    const nextMode = getNextViewMode(viewMode);
    if (nextMode === "concise") return localeCopy.targetViewConcise;
    if (nextMode === "detailed") return localeCopy.targetViewDetailed;
    return localeCopy.targetViewAdvanced;
  }

  function syncActionButtonText(): void {
    themeButton.textContent = state.theme === "dark" ? localeCopy.targetThemeLight : localeCopy.targetThemeDark;
    languageButton.textContent =
      state.locale === "zh-CN" ? localeCopy.targetLanguageEnglish : localeCopy.targetLanguageZhHans;
    viewModeButton.textContent = getViewModeTargetText(state.viewMode);
  }

  function applyLocaleCopy(): void {
    localeCopy = LOCALE_COPY[state.locale];
    panel.lang = state.locale === "zh-CN" ? "zh-CN" : "en-US";
    panel.setAttribute("aria-label", localeCopy.titleMain);
    fpsTitle.textContent = localeCopy.chartFps;
    memTitle.textContent = getMemTitleText(performance.memory ?? null);
    fpsCanvas.setAttribute("aria-label", localeCopy.chartFps);
    memCanvas.setAttribute("aria-label", localeCopy.chartMem);
    resizeHandle.title = localeCopy.actionResize;
    resizeHandle.setAttribute("aria-label", localeCopy.actionResize);
    themeButton.title = localeCopy.actionThemeToggle;
    themeButton.setAttribute("aria-label", localeCopy.actionThemeToggle);
    languageButton.title = localeCopy.actionLanguageToggle;
    languageButton.setAttribute("aria-label", localeCopy.actionLanguageToggle);
    viewModeButton.title = localeCopy.actionDisplayToggle;
    viewModeButton.setAttribute("aria-label", localeCopy.actionDisplayToggle);
    helpButton.title = localeCopy.actionHelp;
    helpButton.setAttribute("aria-label", localeCopy.actionHelp);
    minimizeButton.title = localeCopy.actionMinimizeRestore;
    minimizeButton.setAttribute("aria-label", localeCopy.actionMinimizeRestore);
    closeButton.title = localeCopy.actionClose;
    closeButton.setAttribute("aria-label", localeCopy.actionClose);
    helpPopover.innerHTML = localeCopy.helpContentHtml;
    lastSrStatusText = "";
    syncActionButtonText();
  }

  function applyViewModeStyles(): void {
    const showFpsGraph = state.viewMode !== "concise";
    const showMemory = state.viewMode === "advanced";
    fpsTitle.style.display = showFpsGraph ? "" : "none";
    fpsCanvas.style.display = showFpsGraph ? "block" : "none";
    memTitle.style.display = showMemory ? "" : "none";
    memCanvas.style.display = showMemory ? "block" : "none";
  }

  function withAnimation(enabled: boolean, mode: "auto" | "top" = "auto"): void {
    const isTopMotion = mode === "top" || state.dockMode === "top";
    const activeMs = isTopMotion ? Math.min(transitionMs, TOP_DOCK_ANIMATION_MS) : transitionMs;
    const moveMs = isTopMotion ? Math.min(activeMs, TOP_DOCK_MOVE_ANIMATION_MS) : activeMs;
    const shapeMs = isTopMotion ? Math.min(activeMs, TOP_DOCK_SHAPE_ANIMATION_MS) : activeMs;
    const shapeDelayMs = isTopMotion ? Math.min(TOP_DOCK_SHAPE_DELAY_MS, Math.max(0, moveMs - shapeMs)) : 0;
    const moveEasing = isTopMotion ? "cubic-bezier(.2,.78,.24,1)" : "cubic-bezier(.2,.8,.2,1)";
    const shapeEasing = isTopMotion ? "cubic-bezier(.24,.76,.2,1)" : "ease";

    panel.style.transition = enabled
      ? `left ${moveMs}ms ${moveEasing}, top ${moveMs}ms ${moveEasing}, width ${moveMs}ms ${moveEasing}, height ${moveMs}ms ${moveEasing}, border-radius ${shapeMs}ms ${shapeEasing} ${shapeDelayMs}ms, box-shadow ${moveMs}ms ease, opacity ${moveMs}ms ease`
      : "none";

    const contentMs = enabled ? (isTopMotion ? Math.min(transitionMs, 118) : transitionMs) : 0;
    const contentTransition = contentMs
      ? `opacity ${contentMs}ms ease, transform ${contentMs}ms ease, max-height ${contentMs}ms ease`
      : "none";
    body.style.transition = contentTransition;
    title.style.transition = contentMs ? `opacity ${contentMs}ms ease` : "none";
    summary.style.transition = contentMs ? `opacity ${contentMs}ms ease` : "none";
  }

  function stat(label: string, value: string, color?: string): string {
    return `<div style="color:${themeVars.muted}">${label}</div><div style="text-align:right;color:${color ?? themeVars.text}">${value}</div>`;
  }

  function getMemTitleText(memory: MemoryInfoLike | null): string {
    if (!memory || !memory.jsHeapSizeLimit) return localeCopy.chartMem;
    if (state.locale === "zh-CN") {
      return `${localeCopy.chartMem}（${localeCopy.chartMemHeapMaxLabel}：${formatMBValue(memory.jsHeapSizeLimit)} MB）`;
    }
    return `${localeCopy.chartMem} (${localeCopy.chartMemHeapMaxLabel}: ${formatMBValue(memory.jsHeapSizeLimit)} MB)`;
  }

  function drawTimeAxis(
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
    startTime: number,
    endTime: number,
  ): {
    plotBottom: number;
    plotHeight: number;
    plotLeft: number;
    plotRight: number;
    plotTop: number;
    plotWidth: number;
  } {
    const plotLeft = Math.min(AXIS_LEFT_GUTTER, Math.max(0, width - 2));
    const plotRight = Math.max(plotLeft + 1, width - AXIS_RIGHT_GUTTER);
    const plotWidth = Math.max(1, plotRight - plotLeft);
    const plotTop = Math.min(AXIS_TOP_GUTTER, Math.max(0, height - AXIS_BOTTOM_GUTTER - 1));
    const plotBottom = Math.max(plotTop + 1, height - AXIS_BOTTOM_GUTTER);
    const plotHeight = Math.max(1, plotBottom - plotTop);
    const visibleMs = Math.max(1, endTime - startTime);
    const majorTicksMs = [1000, 2000];
    const minorTicksMs = [500, 1500, 2500];
    const xFromMs = (ms: number): number => plotRight - (ms / visibleMs) * plotWidth;

    context.strokeStyle = themeVars.grid;
    context.lineWidth = 1;

    for (const tickMs of majorTicksMs) {
      if (tickMs > visibleMs) continue;
      const x = xFromMs(tickMs);
      context.beginPath();
      context.moveTo(x, plotTop);
      context.lineTo(x, plotBottom);
      context.stroke();
    }

    for (const tickMs of minorTicksMs) {
      if (tickMs > visibleMs) continue;
      const x = xFromMs(tickMs);
      context.beginPath();
      context.moveTo(x, plotBottom - 4);
      context.lineTo(x, plotBottom);
      context.stroke();
    }

    context.beginPath();
    context.moveTo(plotLeft, plotTop);
    context.lineTo(plotLeft, plotBottom);
    context.stroke();

    context.beginPath();
    context.moveTo(plotRight, plotTop);
    context.lineTo(plotRight, plotBottom);
    context.stroke();

    context.beginPath();
    context.moveTo(plotLeft, plotBottom);
    context.lineTo(plotRight, plotBottom);
    context.stroke();

    context.fillStyle = themeVars.muted;
    context.font = "10px Consolas, monospace";
    context.textBaseline = "bottom";

    if (visibleMs >= 2000) {
      context.textAlign = "center";
      context.fillText("-2s", xFromMs(2000), height - 1);
    }
    if (visibleMs >= 1000) {
      context.textAlign = "center";
      context.fillText("-1s", xFromMs(1000), height - 1);
    }
    if (visibleMs >= 500) {
      context.textAlign = "center";
      context.fillText("-500ms", xFromMs(500), height - 1);
    }
    context.textAlign = "right";
    context.fillText("0s", plotRight, height - 1);
    context.textAlign = "left";

    return { plotBottom, plotHeight, plotLeft, plotRight, plotTop, plotWidth };
  }

  function updateScreenReaderStatus(
    avgFps: number,
    avgFrame: number,
    p95FrameMs: number,
    p99FrameMs: number,
    onePercentLowFps: number,
    longTaskCount: number,
    memUsed: string,
    heapGrowthText: string,
  ): void {
    const nowTs = performance.now();
    if (nowTs - lastSrStatusAt < 2000) return;

    const parts = [
      `${localeCopy.titleMain}`,
      `${localeCopy.statAvgFps}: ${avgFps.toFixed(1)}`,
      `${localeCopy.statAvgFrameMs}: ${avgFrame.toFixed(2)}`,
      `${localeCopy.statP95FrameMs}: ${p95FrameMs.toFixed(2)}`,
      `${localeCopy.statP99FrameMs}: ${p99FrameMs.toFixed(2)}`,
      `${localeCopy.statOnePercentLowFps}: ${onePercentLowFps.toFixed(1)}`,
      `${localeCopy.statLongTasks}: ${longTaskCount}`,
    ];
    if (state.viewMode === "advanced") {
      parts.push(`${localeCopy.statMemUsedMb}: ${memUsed}`);
      parts.push(`${localeCopy.statHeapGrowthRateMbMin}: ${heapGrowthText}`);
    }

    const nextText = parts.join(" | ");
    if (nextText === lastSrStatusText) return;
    srStatus.textContent = nextText;
    lastSrStatusText = nextText;
    lastSrStatusAt = nowTs;
  }

  function pruneFpsRecent(cutoff: number): void {
    while (fpsRecentPoints.length > 0 && fpsRecentPoints[0].time < cutoff) {
      const removed = fpsRecentPoints.shift()!;
      fpsRecentSum -= removed.value;
      fpsRecentCount -= 1;
      if (
        fpsRecentMaxDeque.length > 0 &&
        fpsRecentMaxDeque[0].time === removed.time &&
        fpsRecentMaxDeque[0].value === removed.value
      ) {
        fpsRecentMaxDeque.shift();
      }
    }
    if (fpsRecentCount <= 0) {
      fpsRecentSum = 0;
      fpsRecentCount = 0;
      fpsRecentMaxDeque = [];
    }
  }

  function pushFpsRecent(time: number, value: number): void {
    const point = { time, value };
    fpsRecentPoints.push(point);
    fpsRecentSum += value;
    fpsRecentCount += 1;
    while (fpsRecentMaxDeque.length > 0 && fpsRecentMaxDeque[fpsRecentMaxDeque.length - 1].value <= value) {
      fpsRecentMaxDeque.pop();
    }
    fpsRecentMaxDeque.push(point);
    pruneFpsRecent(time - RECENT_WINDOW_MS);
  }

  function pruneMemRecent(cutoff: number): void {
    while (memRecentPoints.length > 0 && memRecentPoints[0].time < cutoff) {
      const removed = memRecentPoints.shift()!;
      memRecentSum -= removed.value;
      memRecentCount -= 1;
      if (
        memRecentMaxDeque.length > 0 &&
        memRecentMaxDeque[0].time === removed.time &&
        memRecentMaxDeque[0].value === removed.value
      ) {
        memRecentMaxDeque.shift();
      }
    }
    if (memRecentCount <= 0) {
      memRecentSum = 0;
      memRecentCount = 0;
      memRecentMaxDeque = [];
    }
  }

  function pushMemRecent(time: number, value: number | null): void {
    if (value === null || !Number.isFinite(value)) {
      pruneMemRecent(time - RECENT_WINDOW_MS);
      return;
    }
    const point = { time, value };
    memRecentPoints.push(point);
    memRecentSum += value;
    memRecentCount += 1;
    while (memRecentMaxDeque.length > 0 && memRecentMaxDeque[memRecentMaxDeque.length - 1].value <= value) {
      memRecentMaxDeque.pop();
    }
    memRecentMaxDeque.push(point);
    pruneMemRecent(time - RECENT_WINDOW_MS);
  }

  function rebuildRecentWindowCaches(): void {
    fpsRecentPoints = [];
    fpsRecentMaxDeque = [];
    fpsRecentSum = 0;
    fpsRecentCount = 0;
    memRecentPoints = [];
    memRecentMaxDeque = [];
    memRecentSum = 0;
    memRecentCount = 0;
    if (sampleTimes.length === 0) return;

    const endTime = sampleTimes[sampleTimes.length - 1];
    const cutoff = endTime - RECENT_WINDOW_MS;
    for (let i = 0; i < sampleTimes.length; i += 1) {
      const time = sampleTimes[i];
      if (!Number.isFinite(time) || time < cutoff) continue;
      pushFpsRecent(time, fpsSamples[i]);
      pushMemRecent(time, memSamples[i]);
    }
  }

  function getRecentFpsAverage(fallback: number): number {
    return fpsRecentCount > 0 ? fpsRecentSum / fpsRecentCount : fallback;
  }

  function getRecentFpsMax(fallback: number): number {
    return fpsRecentMaxDeque.length > 0 ? fpsRecentMaxDeque[0].value : fallback;
  }

  function getRecentMemAverage(fallback: number): number {
    return memRecentCount > 0 ? memRecentSum / memRecentCount : fallback;
  }

  function getRecentMemMax(fallback: number): number {
    return memRecentMaxDeque.length > 0 ? memRecentMaxDeque[0].value : fallback;
  }

  function pruneLongTasks(cutoff: number): void {
    while (longTaskStartIndex < longTasks.length && longTasks[longTaskStartIndex].start < cutoff) {
      longTaskStartIndex += 1;
    }
    if (longTaskStartIndex > 0 && (longTaskStartIndex > 256 || longTaskStartIndex > longTasks.length / 2)) {
      longTasks = longTasks.slice(longTaskStartIndex);
      longTaskStartIndex = 0;
    }
  }

  function getVisibleLongTaskCount(): number {
    return Math.max(0, longTasks.length - longTaskStartIndex);
  }

  function syncHistoryLength(desired: number, currentNow: number): void {
    fpsSamples = resizeArrayTail(fpsSamples, desired, FPS_CAP);
    memSamples = resizeArrayTail(memSamples, desired, null);
    sampleTimes = resizeTimeArray(sampleTimes, desired, currentNow);
    rebuildRecentWindowCaches();
  }

  function clampFreePanelToViewport(): void {
    const currentWidth = getCurrentPanelWidth(state);
    state.left = clamp(state.left, 0, Math.max(0, window.innerWidth - currentWidth));
    state.top = clamp(state.top, 0, Math.max(0, window.innerHeight - 36));
  }

  function dockToTop(): void {
    state.dockMode = "top";
    state.left = Math.round((window.innerWidth - getCurrentPanelWidth(state)) / 2);
    state.top = TOP_DOCK_MARGIN;
  }

  function undockToFree(left = state.left, top = state.top): void {
    state.dockMode = "free";
    state.minimized = false;
    state.left = left;
    state.top = top;
    clampFreePanelToViewport();
  }

  function snapFreePanelToEdges(): void {
    const panelWidth = getCurrentPanelWidth(state);
    const panelHeight = panel.offsetHeight;
    const maxLeft = Math.max(0, window.innerWidth - panelWidth);
    const maxTop = Math.max(0, window.innerHeight - panelHeight);

    state.left = clamp(state.left, 0, maxLeft);
    state.top = clamp(state.top, 0, maxTop);

    if (state.left <= SNAP_DISTANCE) state.left = 0;
    else if (maxLeft - state.left <= SNAP_DISTANCE) state.left = maxLeft;

    if (state.top <= SNAP_DISTANCE) state.top = 0;
    else if (maxTop - state.top <= SNAP_DISTANCE) state.top = maxTop;
  }

  function finalizePositionAfterDrag(): void {
    if (state.top <= TOP_DOCK_TRIGGER) {
      withAnimation(true, "top");
      dockToTop();
    } else {
      withAnimation(true);
      state.dockMode = "free";
      snapFreePanelToEdges();
    }

    applyLayout();
    saveState(state);
  }

  function applyTheme(): void {
    themeVars = THEMES[state.theme];
    panel.style.background = themeVars.panelBg;
    panel.style.color = themeVars.text;
    panel.style.boxShadow = themeVars.shadow;
    fpsTitle.style.color = themeVars.muted;
    memTitle.style.color = themeVars.muted;
    summary.style.color = themeVars.muted;
    fpsCanvas.style.background = themeVars.canvasBg;
    memCanvas.style.background = themeVars.canvasBg;
    resizeHandle.style.background = themeVars.resizeGrip;
    secondaryActions.style.background = themeVars.buttonBg;
    secondaryActions.style.borderColor = themeVars.grid;
    primaryActions.style.background = themeVars.buttonHoverBg;
    primaryActions.style.borderColor = themeVars.grid;
    helpPopover.style.background = state.theme === "dark" ? "rgba(13,17,23,0.98)" : "rgba(255,255,255,0.98)";
    helpPopover.style.border = `1px solid ${themeVars.grid}`;
    helpPopover.style.boxShadow = themeVars.shadow;
    helpPopover.style.color = themeVars.text;

    [themeButton, languageButton, viewModeButton, helpButton, minimizeButton, closeButton].forEach((button) => {
      setButtonTheme(button);
      button.style.outlineColor = "transparent";
      button.onmouseenter = () => {
        button.style.background = themeVars.buttonHoverBg;
      };
      button.onmouseleave = () => {
        button.style.background = themeVars.buttonBg;
      };
      button.onfocus = () => {
        button.style.background = themeVars.buttonHoverBg;
        button.style.outlineColor = themeVars.fpsLine;
      };
      button.onblur = () => {
        button.style.background = themeVars.buttonBg;
        button.style.outlineColor = "transparent";
      };
    });
    resizeHandle.style.outlineColor = "transparent";
    resizeHandle.onfocus = () => {
      resizeHandle.style.outlineColor = themeVars.fpsLine;
    };
    resizeHandle.onblur = () => {
      resizeHandle.style.outlineColor = "transparent";
    };
    applyLocaleCopy();
  }

  function applyDockModeStyles(): void {
    applyViewModeStyles();
    const isFreeMinimized = state.dockMode === "free" && state.minimized;
    if (isFreeMinimized) closeHelpPopover();
    const currentPanelWidth = getCurrentPanelWidth(state);
    const isNarrowFreeHeader =
      state.dockMode === "free" && !state.minimized && currentPanelWidth <= NARROW_HEADER_THRESHOLD;
    const isCompactFreeActions =
      state.dockMode === "free" && !state.minimized && currentPanelWidth <= COMPACT_ACTIONS_THRESHOLD;
    const isMinimalFreeActions =
      state.dockMode === "free" && !state.minimized && currentPanelWidth <= MINIMAL_ACTIONS_THRESHOLD;
    panel.style.boxShadow = themeVars.shadow;
    panel.style.height = "";
    header.style.display = isNarrowFreeHeader ? "grid" : "flex";
    header.style.flexDirection = "row";
    header.style.alignItems = "center";
    header.style.justifyContent = "space-between";
    header.style.height = "";
    if (isNarrowFreeHeader) {
      header.style.gridTemplateColumns = "1fr auto";
      header.style.gridTemplateAreas = `"title primary" "secondary secondary"`;
      header.style.columnGap = "8px";
      header.style.rowGap = "6px";
      title.style.gridArea = "title";
      primaryActions.style.gridArea = "primary";
      secondaryActions.style.gridArea = "secondary";
      primaryActions.style.justifySelf = "end";
      secondaryActions.style.justifySelf = "start";
    } else {
      header.style.gridTemplateColumns = "";
      header.style.gridTemplateAreas = "";
      header.style.columnGap = "";
      header.style.rowGap = "";
      title.style.gridArea = "";
      primaryActions.style.gridArea = "";
      secondaryActions.style.gridArea = "";
      primaryActions.style.justifySelf = "";
      secondaryActions.style.justifySelf = "";
    }
    title.style.writingMode = "";
    title.style.textOrientation = "";
    title.style.flex = "1";
    title.style.opacity = "1";
    summary.style.writingMode = "";
    summary.style.textOrientation = "";
    summary.style.flex = "0 1 auto";
    summary.style.minWidth = "";
    summary.style.display = "none";
    themeButton.style.display = "";
    languageButton.style.display = "";
    viewModeButton.style.display = "";
    helpButton.style.display = "";
    secondaryActions.style.gap = "6px";
    primaryActions.style.gap = isFreeMinimized ? "4px" : "6px";
    primaryActions.style.marginLeft = isFreeMinimized || isNarrowFreeHeader ? "0" : "8px";
    secondaryActions.style.display = isFreeMinimized ? "none" : "flex";
    primaryActions.style.display = "flex";
    closeButton.style.marginLeft = "4px";

    if (isCompactFreeActions) {
      languageButton.style.display = "none";
      helpButton.style.display = "none";
      secondaryActions.style.gap = "4px";
    }
    if (isMinimalFreeActions) {
      themeButton.style.display = "none";
    }

    if (state.dockMode === "top") {
      closeHelpPopover();
      secondaryActions.style.display = "flex";
      primaryActions.style.display = "flex";
      primaryActions.style.marginLeft = "8px";
      title.style.display = "none";
      summary.style.flex = "1 1 auto";
      summary.style.minWidth = "0";
      languageButton.style.display = "none";
      viewModeButton.style.display = "none";
      helpButton.style.display = "none";
      panel.style.borderRadius = "999px";
      header.style.marginBottom = "0";
      body.style.display = "";
      body.style.opacity = "0";
      body.style.maxHeight = "0px";
      body.style.pointerEvents = "none";
      body.style.transform = "translateY(-8px)";
      body.setAttribute("aria-hidden", "true");
      resizeHandle.style.display = "none";
      minimizeButton.textContent = "v";
      minimizeButton.title = localeCopy.actionExitTopDock;
      minimizeButton.setAttribute("aria-label", localeCopy.actionExitTopDock);
      summary.style.display = "";
      summary.style.opacity = "1";
      return;
    }

    panel.style.borderRadius = "14px";
    header.style.marginBottom = state.minimized ? "0" : "8px";
    title.style.display = state.minimized ? "none" : "";
    body.style.display = "";
    body.style.opacity = state.minimized ? "0" : "1";
    body.style.maxHeight = state.minimized ? "0px" : "9999px";
    body.style.pointerEvents = state.minimized ? "none" : "auto";
    body.style.transform = state.minimized ? "translateY(-8px)" : "translateX(0)";
    body.setAttribute("aria-hidden", state.minimized ? "true" : "false");
    resizeHandle.style.display = state.minimized ? "none" : "";
    resizeHandle.style.cursor = state.viewMode === "concise" ? "ew-resize" : "nwse-resize";
    minimizeButton.textContent = state.minimized ? "+" : "-";
    minimizeButton.title = localeCopy.actionMinimizeRestore;
    minimizeButton.setAttribute("aria-label", localeCopy.actionMinimizeRestore);
    summary.style.display = state.minimized ? "" : "none";
    summary.style.opacity = state.minimized ? "1" : "0";
  }

  function applyLayout(): void {
    const nextDims = getDims(state);

    if (state.dockMode === "top") {
      state.left = Math.round((window.innerWidth - nextDims.panelWidth) / 2);
      state.top = TOP_DOCK_MARGIN;
    } else {
      clampFreePanelToViewport();
    }

    panel.style.left = `${state.left}px`;
    panel.style.top = `${state.top}px`;
    panel.style.width = `${nextDims.panelWidth}px`;
    applyDockModeStyles();

    if (shouldShowMonitorBody() && state.viewMode !== "concise") {
      syncHistoryLength(nextDims.graphWidth, performance.now());
      setCanvasSize(fpsCanvas, fpsContext2d, nextDims.graphWidth, nextDims.fpsHeight);
      if (state.viewMode === "advanced") {
        setCanvasSize(memCanvas, memContext2d, nextDims.graphWidth, nextDims.memHeight);
      }
    }
    if (helpButton.getAttribute("aria-expanded") === "true") positionHelpPopover();
  }

  function drawFpsGraph(): void {
    const currentDims = getDims(state);
    const width = currentDims.graphWidth;
    const height = currentDims.fpsHeight;
    const startTime = sampleTimes[0];
    const endTime = sampleTimes[sampleTimes.length - 1];
    const recentAvgFps = averageRecentNumbers(fpsSamples, sampleTimes, 1000, FPS_CAP);
    const recentMaxFps = maxRecentNumbers(fpsSamples, sampleTimes, 1000, FPS_CAP);
    const fpsScaleMax = Math.max(1, recentMaxFps * 1.1, recentAvgFps * 1.2);

    fpsContext2d.clearRect(0, 0, width, height);
    fpsContext2d.strokeStyle = themeVars.grid;
    fpsContext2d.lineWidth = 1;
    const { plotBottom, plotHeight, plotLeft, plotRight, plotTop, plotWidth } = drawTimeAxis(
      fpsContext2d,
      width,
      height,
      startTime,
      endTime,
    );
    const sampleCount = Math.max(1, fpsSamples.length);
    const xFromIndex = (index: number): number =>
      plotLeft + (sampleCount <= 1 ? 0 : (index / (sampleCount - 1)) * plotWidth);

    for (const fps of [0, fpsScaleMax * 0.5, fpsScaleMax]) {
      const y = plotBottom - (Math.min(fps, fpsScaleMax) / fpsScaleMax) * plotHeight;
      fpsContext2d.beginPath();
      fpsContext2d.moveTo(plotLeft, y);
      fpsContext2d.lineTo(plotRight, y);
      fpsContext2d.stroke();
      fpsContext2d.fillStyle = themeVars.muted;
      fpsContext2d.font = "10px Consolas, monospace";
      fpsContext2d.fillText(String(Math.round(fps)), 4, Math.max(10, y - 2));
    }

    const targetFps = 60;
    const targetY = clamp(plotBottom - (targetFps / fpsScaleMax) * plotHeight, plotTop, plotBottom);
    fpsContext2d.beginPath();
    fpsContext2d.moveTo(plotLeft, targetY);
    fpsContext2d.lineTo(plotRight, targetY);
    fpsContext2d.strokeStyle = themeVars.grid;
    fpsContext2d.lineWidth = 1;
    fpsContext2d.stroke();
    fpsContext2d.fillStyle = themeVars.muted;
    fpsContext2d.font = "10px Consolas, monospace";
    fpsContext2d.fillText("60", 4, Math.max(10, targetY - 2));

    if (endTime > startTime) {
      for (const task of longTasks) {
        if (task.start < startTime || task.start > endTime) continue;
        const x = plotLeft + ((task.start - startTime) / (endTime - startTime)) * plotWidth;
        fpsContext2d.strokeStyle = themeVars.longTask;
        fpsContext2d.lineWidth = 1;
        fpsContext2d.beginPath();
        fpsContext2d.moveTo(x, plotTop);
        fpsContext2d.lineTo(x, plotBottom);
        fpsContext2d.stroke();

        if (task.duration >= 80) {
          fpsContext2d.fillStyle = themeVars.longTask;
          fpsContext2d.font = "10px Consolas, monospace";
          fpsContext2d.fillText(`${Math.round(task.duration)}ms`, Math.min(plotRight - 38, x + 2), 10);
        }
      }
    }

    fpsContext2d.beginPath();
    fpsSamples.forEach((sample, index) => {
      const value = Math.max(0, Math.min(sample, fpsScaleMax));
      const x = xFromIndex(index);
      const y = plotBottom - (value / fpsScaleMax) * plotHeight;
      if (index === 0) fpsContext2d.moveTo(x, y);
      else fpsContext2d.lineTo(x, y);
    });

    fpsContext2d.strokeStyle = themeVars.fpsLine;
    fpsContext2d.lineWidth = 2;
    fpsContext2d.stroke();
    fpsContext2d.lineTo(plotRight, plotBottom);
    fpsContext2d.lineTo(plotLeft, plotBottom);
    fpsContext2d.closePath();

    const gradient = fpsContext2d.createLinearGradient(0, plotTop, 0, plotBottom);
    gradient.addColorStop(0, themeVars.fpsFillTop);
    gradient.addColorStop(1, themeVars.fpsFillBottom);
    fpsContext2d.fillStyle = gradient;
    fpsContext2d.fill();

    fpsSamples.forEach((sample, index) => {
      if (sample >= 30) return;
      const barWidth = Math.max(1, plotWidth / sampleCount);
      const x = xFromIndex(index) - barWidth * 0.5;
      const y = plotBottom - (Math.max(0, Math.min(sample, fpsScaleMax)) / fpsScaleMax) * plotHeight;
      fpsContext2d.fillStyle = themeVars.lowFps;
      fpsContext2d.fillRect(x, y, barWidth, plotBottom - y);
    });
  }
  function drawMemGraph(memory: MemoryInfoLike | null): void {
    const currentDims = getDims(state);
    const width = currentDims.graphWidth;
    const height = currentDims.memHeight;
    const startTime = sampleTimes[0];
    const endTime = sampleTimes[sampleTimes.length - 1];

    memContext2d.clearRect(0, 0, width, height);
    memContext2d.strokeStyle = themeVars.grid;
    memContext2d.lineWidth = 1;
    const { plotBottom, plotHeight, plotLeft, plotRight, plotTop, plotWidth } = drawTimeAxis(
      memContext2d,
      width,
      height,
      startTime,
      endTime,
    );
    const sampleCount = Math.max(1, memSamples.length);
    const xFromIndex = (index: number): number =>
      plotLeft + (sampleCount <= 1 ? 0 : (index / (sampleCount - 1)) * plotWidth);

    for (let index = 0; index < 3; index += 1) {
      const y = plotTop + (plotHeight / 2) * index;
      memContext2d.beginPath();
      memContext2d.moveTo(plotLeft, y);
      memContext2d.lineTo(plotRight, y);
      memContext2d.stroke();
    }

    if (!memory || !memory.jsHeapSizeLimit) {
      memContext2d.fillStyle = themeVars.muted;
      memContext2d.font = "11px Consolas, monospace";
      memContext2d.fillText(localeCopy.memUnavailable, plotLeft + 8, plotTop + plotHeight / 2 + 4);
      return;
    }

    const recentAvgMemUsed = averageRecentNullableNumbers(memSamples, sampleTimes, 1000, memory.usedJSHeapSize);
    const recentMaxMemUsed = maxRecentNullableNumbers(memSamples, sampleTimes, 1000, memory.usedJSHeapSize);
    const scaleMax = Math.max(1, recentMaxMemUsed * 1.1, recentAvgMemUsed * 1.2);

    memContext2d.fillStyle = themeVars.muted;
    memContext2d.font = "10px Consolas, monospace";
    memContext2d.textBaseline = "middle";
    memContext2d.textAlign = "left";
    memContext2d.fillText(`${formatMBValue(scaleMax)}MB`, 4, plotTop + 8);
    memContext2d.fillText(`${formatMBValue(scaleMax * 0.5)}MB`, 4, plotTop + plotHeight * 0.5);
    memContext2d.fillText("0MB", 4, plotBottom - 2);

    memContext2d.beginPath();

    memSamples.forEach((sample, index) => {
      if (sample === null) return;
      const ratio = Math.max(0, Math.min(sample / scaleMax, 1));
      const x = xFromIndex(index);
      const y = plotBottom - ratio * plotHeight;
      if (index === 0 || memSamples[index - 1] === null) memContext2d.moveTo(x, y);
      else memContext2d.lineTo(x, y);
    });

    memContext2d.strokeStyle = themeVars.memLine;
    memContext2d.lineWidth = 2;
    memContext2d.stroke();
    memContext2d.lineTo(plotRight, plotBottom);
    memContext2d.lineTo(plotLeft, plotBottom);
    memContext2d.closePath();

    const gradient = memContext2d.createLinearGradient(0, plotTop, 0, plotBottom);
    gradient.addColorStop(0, themeVars.memFillTop);
    gradient.addColorStop(1, themeVars.memFillBottom);
    memContext2d.fillStyle = gradient;
    memContext2d.fill();
  }

  function render(delta: number, memory: MemoryInfoLike | null, drawCharts = true): void {
    const avgFrame = average(frameTimes);
    const p95FrameMs = percentile(frameTimes, 95);
    const p99FrameMs = percentile(frameTimes, 99);
    const onePercentLowFps = p99FrameMs > 0 ? 1000 / p99FrameMs : 0;
    const avgFps = avgFrame ? 1000 / avgFrame : 0;
    const minFps = Math.min(...fpsSamples).toFixed(1);
    const maxFps = Math.max(...fpsSamples).toFixed(1);
    const longTaskCount = longTasks.length;
    const fpsColor = avgFps >= 50 ? themeVars.good : avgFps >= 30 ? themeVars.warn : themeVars.bad;
    const onePercentLowColor =
      onePercentLowFps >= 50 ? themeVars.good : onePercentLowFps >= 30 ? themeVars.warn : themeVars.bad;
    const memUsed = memory ? formatMBValue(memory.usedJSHeapSize) : "N/A";
    const memTotal = memory ? formatMBValue(memory.totalJSHeapSize) : "N/A";
    const heapGrowthMbPerMin = computeHeapGrowthMbPerMin(memSamples, sampleTimes);
    const heapGrowthText =
      heapGrowthMbPerMin === null ? "N/A" : `${heapGrowthMbPerMin >= 0 ? "+" : ""}${heapGrowthMbPerMin.toFixed(2)}`;
    const memColor =
      memory && memory.jsHeapSizeLimit
        ? memory.usedJSHeapSize / memory.jsHeapSizeLimit > 0.8
          ? themeVars.bad
          : themeVars.good
        : themeVars.muted;
    memTitle.textContent = getMemTitleText(memory);

    if (state.viewMode === "concise") {
      stats.innerHTML =
        stat(localeCopy.statAvgFps, avgFps.toFixed(1), fpsColor) +
        stat(localeCopy.statAvgFrameMs, avgFrame.toFixed(2)) +
        stat(localeCopy.statP95FrameMs, p95FrameMs.toFixed(2)) +
        stat(localeCopy.statP99FrameMs, p99FrameMs.toFixed(2)) +
        stat(localeCopy.statOnePercentLowFps, onePercentLowFps.toFixed(1), onePercentLowColor);
    } else if (state.viewMode === "detailed") {
      stats.innerHTML =
        stat(localeCopy.statAvgFps, avgFps.toFixed(1), fpsColor) +
        stat(localeCopy.statAvgFrameMs, avgFrame.toFixed(2)) +
        stat(localeCopy.statFpsRange, `${minFps} / ${maxFps}`) +
        stat(localeCopy.statDroppedFrames, String(droppedFrames), droppedFrames ? themeVars.bad : themeVars.good) +
        stat(localeCopy.statP95FrameMs, p95FrameMs.toFixed(2)) +
        stat(localeCopy.statP99FrameMs, p99FrameMs.toFixed(2)) +
        stat(localeCopy.statOnePercentLowFps, onePercentLowFps.toFixed(1), onePercentLowColor) +
        stat(localeCopy.statCurrentFrameMs, delta.toFixed(2));
    } else {
      stats.innerHTML =
        stat(localeCopy.statAvgFps, avgFps.toFixed(1), fpsColor) +
        stat(localeCopy.statAvgFrameMs, avgFrame.toFixed(2)) +
        stat(localeCopy.statP95FrameMs, p95FrameMs.toFixed(2)) +
        stat(localeCopy.statP99FrameMs, p99FrameMs.toFixed(2)) +
        stat(localeCopy.statOnePercentLowFps, onePercentLowFps.toFixed(1), onePercentLowColor) +
        stat(localeCopy.statFpsRange, `${minFps} / ${maxFps}`) +
        stat(localeCopy.statDroppedFrames, String(droppedFrames), droppedFrames ? themeVars.bad : themeVars.good) +
        stat(localeCopy.statCurrentFrameMs, delta.toFixed(2)) +
        stat(localeCopy.statLongTasks, String(longTaskCount), longTaskCount ? themeVars.bad : themeVars.good) +
        stat(localeCopy.statMemUsedMb, memUsed, memColor) +
        stat(localeCopy.statMemTotalMb, memTotal) +
        stat(
          localeCopy.statHeapGrowthRateMbMin,
          heapGrowthText,
          heapGrowthMbPerMin === null ? undefined : heapGrowthMbPerMin > 0 ? themeVars.warn : themeVars.good,
        );
    }

    if (state.dockMode === "top") {
      title.textContent = localeCopy.titleMain;
      summary.textContent = `${avgFps.toFixed(1)} FPS | P99 ${p99FrameMs.toFixed(2)} ms | ${localeCopy.summaryLongTasks} ${longTaskCount}`;
    } else if (state.minimized) {
      title.textContent = localeCopy.titleMinimized;
      summary.textContent = `${avgFps.toFixed(1)} FPS`;
    } else {
      title.textContent = localeCopy.titleMain;
      summary.textContent = "";
    }

    updateScreenReaderStatus(
      avgFps,
      avgFrame,
      p95FrameMs,
      p99FrameMs,
      onePercentLowFps,
      longTaskCount,
      memUsed,
      heapGrowthText,
    );

    if (drawCharts && shouldShowMonitorBody() && state.viewMode !== "concise") {
      drawFpsGraph();
      if (state.viewMode === "advanced") drawMemGraph(memory);
    }
  }

  function update(nowValue: number, delta: number): void {
    const memory = performance.memory ?? null;
    const fps = 1000 / delta;
    lastDeltaValue = delta;

    fpsSamples.push(fps);
    fpsSamples.shift();
    sampleTimes.push(nowValue);
    sampleTimes.shift();
    memSamples.push(memory ? memory.usedJSHeapSize : null);
    memSamples.shift();
    frameTimes.push(delta);
    if (frameTimes.length > 120) frameTimes.shift();
    if (delta > (1000 / 50) * 1.5) droppedFrames += 1;

    const oldestVisibleTime = sampleTimes[0];
    longTasks = longTasks.filter((task) => task.start >= oldestVisibleTime - 500);

    // Draw charts every frame for smooth horizontal scrolling.
    if (shouldShowMonitorBody() && state.viewMode !== "concise") {
      const drawStart = performance.now();
      drawFpsGraph();
      if (state.viewMode === "advanced") drawMemGraph(memory);
      const drawCost = performance.now() - drawStart;
      if (Number.isFinite(drawCost)) {
        drawCostTotalMs += drawCost;
        drawCostFrames += 1;
      }
    }

    if (window.__PERF_MONITOR_DEBUG__ === true && nowValue - lastPerfLogAt >= 1000) {
      const drawAvgMs = drawCostFrames > 0 ? drawCostTotalMs / drawCostFrames : 0;
      console.log("[PerfMonitor:perf]", {
        drawAvgMs: Number(drawAvgMs.toFixed(3)),
        drawFrames: drawCostFrames,
        viewMode: state.viewMode,
        graphWidth: getDims(state).graphWidth,
      });
      drawCostTotalMs = 0;
      drawCostFrames = 0;
      lastPerfLogAt = nowValue;
    }

    if (nowValue - lastUpdate >= UPDATE_INTERVAL) {
      // Keep text/DOM updates throttled to reduce layout/reflow cost.
      render(delta, memory, false);
      lastUpdate = nowValue;
    }
  }

  function loop(nowValue: number): void {
    if (destroyed) return;
    const delta = nowValue - lastTime;
    lastTime = nowValue;
    update(nowValue, delta);
    rafId = window.requestAnimationFrame(loop);
  }

  function setMinimized(nextValue: boolean): void {
    if (state.dockMode !== "free") return;
    state.minimized = nextValue;
    withAnimation(true);
    applyLayout();
    render(lastDeltaValue, performance.memory ?? null);
    saveState(state);
  }

  function toggleTheme(): void {
    state.theme = state.theme === "dark" ? "light" : "dark";
    applyTheme();
    applyLayout();
    render(lastDeltaValue, performance.memory ?? null);
    saveState(state);
  }

  function toggleViewMode(): void {
    const currentFpsHeight = getDims(state).fpsHeight;
    if (state.viewMode === "detailed") {
      state.totalGraphHeight = findDetailedTotalHeightByFpsHeight(currentFpsHeight);
    } else if (state.viewMode === "advanced") {
      state.compactGraphHeight = clamp(currentFpsHeight, MIN_COMPACT_GRAPH_HEIGHT, MAX_TOTAL_GRAPH_HEIGHT);
    }
    state.viewMode = getNextViewMode(state.viewMode);
    applyTheme();
    applyLayout();
    render(lastDeltaValue, performance.memory ?? null);
    saveState(state);
  }

  function toggleLanguage(): void {
    state.locale = state.locale === "zh-CN" ? "en-US" : "zh-CN";
    applyTheme();
    applyLayout();
    render(lastDeltaValue, performance.memory ?? null);
    saveState(state);
  }

  function exitDockMode(): void {
    if (state.dockMode === "free") return;
    const currentLeft = state.left + 24;
    const currentTop = TOP_DOCK_MARGIN + 8;
    undockToFree(currentLeft, currentTop);
    withAnimation(true);
    applyLayout();
    render(lastDeltaValue, performance.memory ?? null);
    saveState(state);
  }

  function onPanelPointerDown(event: PointerEvent): void {
    const target = event.target instanceof Element ? event.target : null;
    // Hit target priority: interactive controls (buttons/resize handle) > panel drag.
    if (target?.closest("[data-perf-interactive='true']")) return;
    withAnimation(false);

    if (state.dockMode !== "free") {
      const rect = panel.getBoundingClientRect();
      undockToFree(rect.left, rect.top);
      applyLayout();
      render(lastDeltaValue, performance.memory ?? null);
    }

    const rect = panel.getBoundingClientRect();
    dragState = {
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      pointerId: event.pointerId,
    };

    panel.setPointerCapture(event.pointerId);
    event.preventDefault();
  }

  function onHeaderDoubleClick(event: MouseEvent): void {
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest("button")) return;
    withAnimation(true);
    if (state.dockMode !== "free") exitDockMode();
    else setMinimized(!state.minimized);
    event.preventDefault();
  }

  function onResizePointerDown(event: PointerEvent): void {
    if (state.minimized || state.dockMode !== "free") return;
    withAnimation(false);
    const activeGraphHeight = getActiveGraphHeight();
    resizeState = {
      pointerId: event.pointerId,
      startGraphHeight: activeGraphHeight,
      startWidth: state.width,
      startX: event.clientX,
      startY: event.clientY,
    };
    logResizeDebug(
      "resize-start",
      {
        pointer: { x: event.clientX, y: event.clientY },
        activeGraphHeight,
        maxGraphHeight: getMaxResizableGraphHeight(),
      },
      true,
    );
    resizeHandle.setPointerCapture(event.pointerId);
    event.preventDefault();
    event.stopPropagation();
  }

  function nudgeResize(deltaWidth: number, deltaGraphHeight: number): void {
    if (state.minimized || state.dockMode !== "free") return;
    const maxWidth = Math.min(MAX_PANEL_WIDTH, window.innerWidth - state.left);
    state.width = clamp(state.width + deltaWidth, MIN_PANEL_WIDTH, maxWidth);
    if (state.viewMode !== "concise") {
      const minGraphHeight = getMinGraphHeightForMode();
      const maxGraphHeight = getMaxResizableGraphHeight();
      setActiveGraphHeight(clamp(getActiveGraphHeight() + deltaGraphHeight, minGraphHeight, maxGraphHeight));
    }
    withAnimation(true);
    applyLayout();
    render(lastDeltaValue, performance.memory ?? null);
    saveState(state);
  }

  function onResizeKeyDown(event: KeyboardEvent): void {
    const step = event.shiftKey ? 24 : 8;
    if (event.key === "ArrowLeft") {
      nudgeResize(-step, 0);
      event.preventDefault();
    } else if (event.key === "ArrowRight") {
      nudgeResize(step, 0);
      event.preventDefault();
    } else if (event.key === "ArrowUp" && state.viewMode !== "concise") {
      nudgeResize(0, -step);
      event.preventDefault();
    } else if (event.key === "ArrowDown" && state.viewMode !== "concise") {
      nudgeResize(0, step);
      event.preventDefault();
    }
  }

  function onPointerMove(event: PointerEvent): void {
    if (dragState && event.pointerId === dragState.pointerId) {
      const panelWidth = getCurrentPanelWidth(state);
      const maxLeft = Math.max(0, window.innerWidth - panelWidth);
      const maxTop = Math.max(0, window.innerHeight - panel.offsetHeight);
      state.left = clamp(event.clientX - dragState.offsetX, 0, maxLeft);
      state.top = clamp(event.clientY - dragState.offsetY, 0, maxTop);
      panel.style.left = `${state.left}px`;
      panel.style.top = `${state.top}px`;
      if (helpButton.getAttribute("aria-expanded") === "true") positionHelpPopover();
      return;
    }

    if (resizeState && event.pointerId === resizeState.pointerId) {
      const maxWidth = Math.min(MAX_PANEL_WIDTH, window.innerWidth - state.left);
      const nextWidth = clamp(resizeState.startWidth + (event.clientX - resizeState.startX), MIN_PANEL_WIDTH, maxWidth);
      const minGraphHeight = getMinGraphHeightForMode();
      const maxGraphHeight = getMaxResizableGraphHeight();
      const nextGraphHeight =
        state.viewMode === "concise"
          ? resizeState.startGraphHeight
          : clamp(resizeState.startGraphHeight + (event.clientY - resizeState.startY), minGraphHeight, maxGraphHeight);
      logResizeDebug("resize-step-input", {
        pointer: { x: event.clientX, y: event.clientY },
        start: {
          x: resizeState.startX,
          y: resizeState.startY,
          width: resizeState.startWidth,
          graphHeight: resizeState.startGraphHeight,
        },
        computed: { nextWidth, nextGraphHeight, minGraphHeight, maxGraphHeight },
      });
      state.width = nextWidth;
      setActiveGraphHeight(nextGraphHeight);

      // Re-anchor continuously to avoid "drag drift" when clamped at min/max limits.
      resizeState.startX = event.clientX;
      resizeState.startY = event.clientY;
      resizeState.startWidth = nextWidth;
      resizeState.startGraphHeight = nextGraphHeight;

      applyLayout();

      // Hard safety: never allow monitor bottom to exceed viewport while resizing.
      if (state.viewMode !== "concise") {
        const viewportBottom = window.innerHeight - 8;
        const overflowBottom = panel.getBoundingClientRect().bottom - viewportBottom;
        if (overflowBottom > 0) {
          logResizeDebug("overflow-detected", { overflowBottom }, true);
          const correctedHeight = clamp(
            getActiveGraphHeight() - Math.ceil(overflowBottom),
            minGraphHeight,
            MAX_TOTAL_GRAPH_HEIGHT,
          );
          if (correctedHeight !== getActiveGraphHeight()) {
            setActiveGraphHeight(correctedHeight);
            resizeState.startGraphHeight = correctedHeight;
            applyLayout();
            logResizeDebug("overflow-corrected-height", { correctedHeight }, true);
          }
        }
      }

      const maxTopWithinViewport = Math.max(0, window.innerHeight - panel.offsetHeight - 8);
      if (state.top > maxTopWithinViewport) {
        state.top = maxTopWithinViewport;
        applyLayout();
        logResizeDebug("overflow-corrected-top", { correctedTop: state.top, maxTopWithinViewport }, true);
      }

      logResizeDebug("resize-step-output");
      render(lastDeltaValue, performance.memory ?? null);
    }
  }

  function onPointerUp(event: PointerEvent): void {
    if (dragState && event.pointerId === dragState.pointerId) {
      try {
        panel.releasePointerCapture(event.pointerId);
      } catch {}
      dragState = null;
      finalizePositionAfterDrag();
      render(lastDeltaValue, performance.memory ?? null);
    }

    if (resizeState && event.pointerId === resizeState.pointerId) {
      try {
        resizeHandle.releasePointerCapture(event.pointerId);
      } catch {}
      resizeState = null;
      withAnimation(true);
      applyLayout();
      logResizeDebug("resize-end", {}, true);
      render(lastDeltaValue, performance.memory ?? null);
      saveState(state);
    }
  }

  function onWindowResize(): void {
    withAnimation(true, state.dockMode === "top" ? "top" : "auto");
    if (state.dockMode === "top") dockToTop();
    else clampFreePanelToViewport();
    applyLayout();
    if (helpButton.getAttribute("aria-expanded") === "true") positionHelpPopover();
    render(lastDeltaValue, performance.memory ?? null);
    saveState(state);
  }

  function setupLongTaskObserver(): void {
    if (!("PerformanceObserver" in window)) return;
    try {
      observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          longTasks.push({ duration: entry.duration, start: entry.startTime });
        }
      });
      observer.observe({ entryTypes: ["longtask"] });
    } catch {}
  }

  function destroy(): void {
    if (destroyed) return;
    destroyed = true;
    window.cancelAnimationFrame(rafId);
    observer?.disconnect();
    clearHelpPopoverHideTimer();
    panel.removeEventListener("pointerdown", onPanelPointerDown);
    header.removeEventListener("dblclick", onHeaderDoubleClick);
    resizeHandle.removeEventListener("pointerdown", onResizePointerDown);
    resizeHandle.removeEventListener("keydown", onResizeKeyDown);
    helpButton.removeEventListener("click", onHelpButtonClick);
    helpButton.removeEventListener("pointerenter", onHelpButtonPointerEnter);
    helpButton.removeEventListener("pointerleave", onHelpButtonPointerLeave);
    helpButton.removeEventListener("focus", onHelpButtonFocus);
    helpButton.removeEventListener("blur", onHelpButtonBlur);
    helpPopover.removeEventListener("pointerenter", onHelpPopoverPointerEnter);
    helpPopover.removeEventListener("pointerleave", onHelpPopoverPointerLeave);
    window.removeEventListener("pointerdown", onWindowPointerDown, true);
    window.removeEventListener("keydown", onWindowKeyDown, true);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
    window.removeEventListener("pointercancel", onPointerUp);
    window.removeEventListener("resize", onWindowResize);
    panel.remove();
    helpPopover.remove();
    if (window.__PERF_MONITOR__ === api) delete window.__PERF_MONITOR__;
  }

  themeButton.onclick = toggleTheme;
  languageButton.onclick = toggleLanguage;
  viewModeButton.onclick = toggleViewMode;
  minimizeButton.onclick = () => {
    withAnimation(true);
    if (state.dockMode !== "free") exitDockMode();
    else setMinimized(!state.minimized);
  };
  closeButton.onclick = destroy;

  panel.addEventListener("pointerdown", onPanelPointerDown);
  header.addEventListener("dblclick", onHeaderDoubleClick);
  resizeHandle.addEventListener("pointerdown", onResizePointerDown);
  resizeHandle.addEventListener("keydown", onResizeKeyDown);
  helpButton.addEventListener("click", onHelpButtonClick);
  helpButton.addEventListener("pointerenter", onHelpButtonPointerEnter);
  helpButton.addEventListener("pointerleave", onHelpButtonPointerLeave);
  helpButton.addEventListener("focus", onHelpButtonFocus);
  helpButton.addEventListener("blur", onHelpButtonBlur);
  helpPopover.addEventListener("pointerenter", onHelpPopoverPointerEnter);
  helpPopover.addEventListener("pointerleave", onHelpPopoverPointerLeave);
  window.addEventListener("pointerdown", onWindowPointerDown, true);
  window.addEventListener("keydown", onWindowKeyDown, true);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointercancel", onPointerUp);
  window.addEventListener("resize", onWindowResize);

  applyTheme();
  withAnimation(true, state.dockMode === "top" ? "top" : "auto");
  if (state.dockMode === "top") dockToTop();
  applyLayout();
  render(0, performance.memory ?? null);
  setupLongTaskObserver();

  const api: PerformanceMonitorApi = {
    destroy,
    dockTop: () => {
      withAnimation(true, "top");
      dockToTop();
      applyLayout();
      render(lastDeltaValue, performance.memory ?? null);
      saveState(state);
    },
    maximize: () => {
      if (state.dockMode !== "free") exitDockMode();
      setMinimized(false);
    },
    minimize: () => {
      setMinimized(true);
    },
    toggle: () => {
      if (state.dockMode !== "free") exitDockMode();
      else setMinimized(!state.minimized);
    },
    toggleTheme,
    undock: exitDockMode,
  };

  window.__PERF_MONITOR__ = api;
  rafId = window.requestAnimationFrame(loop);
  return api;
}

function boot(): void {
  initPerformanceMonitor();
}

if (document.body) {
  boot();
} else {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
}
