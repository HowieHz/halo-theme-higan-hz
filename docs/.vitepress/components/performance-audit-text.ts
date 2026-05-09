import type { ResourceType } from "../utils/page-size-audit-schema";
import type {
  PerformanceDatasetKind,
  PerformanceAuditSectionKey,
  PerformanceProgressStage,
} from "./performance-audit-constants";

export type LocaleKey = "zh-CN" | "en";

export interface PerformanceAuditLocaleText {
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
  loadingStages: Record<PerformanceProgressStage, string>;
  sectionTitles: Record<PerformanceAuditSectionKey, string>;
  datasetTitles: Record<PerformanceDatasetKind, string>;
  resourceLabels: Record<ResourceType, string>;
}

export const performanceAuditText = {
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
      average: "页面平均值",
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
} as const satisfies Record<LocaleKey, PerformanceAuditLocaleText>;
