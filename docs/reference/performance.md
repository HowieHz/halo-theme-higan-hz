---
outline: deep
---

<!-- markdownlint-disable MD033 -->

# 性能参考

<!-- markdownlint-disable MD011 -->
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { defineClientComponent, useData } from 'vitepress'
import { decodeAuditFile, type AuditFile, type AuditPageResult, type ResourceType } from '../.vitepress/utils/page-size-audit-schema'
import ProgressBar from '../.vitepress/components/ProgressBar.vue'

const { isDark } = useData()

// 页面定义
const pageEntries = [
  { key: 'home', url: '/' },
  { key: 'archives', url: '/archives' },
  { key: 'post', url: '/archives/hello-halo' },
  { key: 'tags', url: '/tags' },
  { key: 'tagDetail', url: '/tags/halo' },
  { key: 'categories', url: '/categories' },
  { key: 'categoryDetail', url: '/categories/default' },
  { key: 'author', url: '/authors/admin' },
  { key: 'about', url: '/about' }
] as const

// 资源类型配置
const resourceTypes = ['document', 'font', 'script', 'stylesheet', 'image', 'fetch', 'other', 'total'] as const
type ContentPage = (typeof pageEntries)[number]
type ContentPageKey = ContentPage['key']
type PageKey = ContentPageKey | 'average'
type AxisMode = 'version' | 'time'
type TimelineEntry = {
  version: string
  publishedAt: number
  index: number
}
type ChartPoint = {
  x: number
  y: number | null
  version: string
  publishedAt: number
}
type LoadedAuditEntry = {
  version: string
  publishedAt: number
  data: AuditFile
}
type IndexedAuditEntry = {
  version: string
  publishedAt: number
  resultsByUrl: Map<string, AuditPageResult>
}

type DatasetKind = 'themeGzipped' | 'themeRaw' | 'resourcesGzipped' | 'resourcesRaw'
type ProgressStage = 'dataLoading' | 'dataProcessing' | 'chartCreation'
const datasetKinds = ['themeGzipped', 'themeRaw', 'resourcesGzipped', 'resourcesRaw'] as const satisfies readonly DatasetKind[]
type NumericSeries = Record<ResourceType, Array<number | null>>
type PageDatasets = Record<DatasetKind, NumericSeries>
type DatasetCollection = Record<PageKey, PageDatasets>

type ChartSeries = {
  labels: string[]
  datasets: Array<{
    label: string
    data: ChartPoint[]
    borderColor: string
    backgroundColor: string
    tension: number
    borderWidth: number
  }>
}
type ChartPageData = Record<DatasetKind, ChartSeries>
type ChartDatasetCollection = Partial<Record<PageKey, ChartPageData>>

type RawDatasetsState = {
  datasets: DatasetCollection
  versions: string[]
  publishedAts: number[]
}
type ChartLoadingFlags = Record<DatasetKind, boolean>
type ChartLoadingState = Record<PageKey, ChartLoadingFlags>

const axisMode = ref<AxisMode>('version')

function pad2(value: number): string {
  return String(value).padStart(2, '0')
}

function formatUtcOffset(date: Date): string {
  const totalMinutes = -date.getTimezoneOffset()
  const sign = totalMinutes >= 0 ? '+' : '-'
  const absoluteMinutes = Math.abs(totalMinutes)
  const hours = Math.floor(absoluteMinutes / 60)
  const minutes = absoluteMinutes % 60
  return minutes === 0 ? `UTC${sign}${hours}` : `UTC${sign}${hours}:${pad2(minutes)}`
}

function formatLocalDate(timestamp: number, includeYear: boolean): string {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = pad2(date.getMonth() + 1)
  const day = pad2(date.getDate())
  return includeYear ? `${year}-${month}-${day}` : `${month}-${day}`
}

function formatLocalDateTime(timestamp: number): string {
  const date = new Date(timestamp)
  return `${formatLocalDate(timestamp, true)} ${pad2(date.getHours())}:${pad2(date.getMinutes())} ${formatUtcOffset(date)}`
}

function formatPublishedTime(timestamp: number): string {
  return timestamp > 0 ? formatLocalDateTime(timestamp) : '未记录发布时间'
}

function formatTimeAxisTick(timestamp: number, includeYear: boolean): string {
  if (timestamp <= 0) return ''
  return formatLocalDate(timestamp, includeYear)
}

function shouldShowYearOnTick(timestamp: number, previousTimestamp: number | null): boolean {
  if (timestamp <= 0) return false
  if (previousTimestamp === null || previousTimestamp <= 0) return true
  return new Date(timestamp).getFullYear() !== new Date(previousTimestamp).getFullYear()
}

function parseTickTimestamp(value: number | string): number | null {
  const numericValue = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(numericValue) ? numericValue : null
}

function createEmptyNumericSeries(): NumericSeries {
  return {
    document: [],
    font: [],
    script: [],
    stylesheet: [],
    image: [],
    fetch: [],
    other: [],
    total: []
  }
}

function createEmptyPageDatasets(): PageDatasets {
  return {
    themeGzipped: createEmptyNumericSeries(),
    themeRaw: createEmptyNumericSeries(),
    resourcesGzipped: createEmptyNumericSeries(),
    resourcesRaw: createEmptyNumericSeries()
  }
}

function createDatasetCollection(): DatasetCollection {
  const datasets = { average: createEmptyPageDatasets() } as DatasetCollection

  for (const { key } of pageEntries) {
    datasets[key] = createEmptyPageDatasets()
  }

  return datasets
}

function createChartLoadingState(isLoading = false): ChartLoadingState {
  const flags: ChartLoadingFlags = {
    themeGzipped: isLoading,
    themeRaw: isLoading,
    resourcesGzipped: isLoading,
    resourcesRaw: isLoading
  }
  const state = { average: { ...flags } } as ChartLoadingState

  for (const { key } of pageEntries) {
    state[key] = { ...flags }
  }

  return state
}

// 响应式颜色配置（适配明暗主题）
const resourceColors = computed<Record<ResourceType, string>>(() => isDark.value ? {
  document: '#b794f4',
  font: '#4fd1c5',
  script: '#fc8181',
  stylesheet: '#63b3ed',
  image: '#f6ad55',
  fetch: '#68d391',
  other: '#cbd5e0',
  total: '#e2e8f0'
} : {
  document: '#8e44ad',
  font: '#16a085',
  script: '#e74c3c',
  stylesheet: '#3498db',
  image: '#f39c12',
  fetch: '#27ae60',
  other: '#95a5a6',
  total: '#2c3e50'
})

const resourceLabels = {
  document: '文档',
  font: '字体',
  script: '脚本',
  stylesheet: '样式表',
  image: '图片',
  fetch: '数据请求',
  other: '其他',
  total: '总计'
} satisfies Record<ResourceType, string>

// 存储所有图表数据
const chartDatasets = ref<ChartDatasetCollection>({})
const rawDatasets = ref<RawDatasetsState | null>(null)

// 加载进度状态
const loadingProgress = ref(0)
const isLoading = ref(false)
const loadingStage = ref<ProgressStage>('dataLoading')

// 每个图表的加载状态
const chartLoadingStatus = ref<ChartLoadingState>(createChartLoadingState())

const labels = {
  dataLoading: '加载数据',
  dataProcessing: '数据排序与处理',
  chartCreation: '图表数据创建'
} as const satisfies Record<ProgressStage, string>

const xAxisRange = computed(() => {
  if (!rawDatasets.value) {
    return { min: 0, max: 0 }
  }

  if (axisMode.value === 'version') {
    const lastIndex = Math.max(rawDatasets.value.versions.length - 1, 0)
    return { min: 0, max: lastIndex }
  }

  const validPublishedAts = rawDatasets.value.publishedAts.filter((timestamp) => timestamp > 0)
  if (validPublishedAts.length === 0) {
    return { min: 0, max: 0 }
  }

  return {
    min: validPublishedAts[0],
    max: validPublishedAts[validPublishedAts.length - 1]
  }
})

function buildChartPoints(series: Array<number | null>, timelineEntries: TimelineEntry[]): ChartPoint[] {
  const points = timelineEntries
    .map(({ version, publishedAt, index }) => ({
      x: axisMode.value === 'version' ? index : publishedAt,
      y: series[index] ?? null,
      version,
      publishedAt
    }))
    .filter((point) => axisMode.value !== 'time' || point.x > 0)

  if (axisMode.value === 'time') {
    points.sort((a, b) => a.x - b.x)
  }

  return points
}

function buildChartDatasets(source: RawDatasetsState, updateLoading = false): ChartDatasetCollection {
  const colors = resourceColors.value
  const timelineEntries = source.versions.map((version, index) => ({
    version,
    publishedAt: source.publishedAts[index] ?? 0,
    index
  }))
  let processedCount = 0
  const totalCharts = (pageEntries.length + 1) * datasetKinds.length
  const currentChartDatasets = {} as ChartDatasetCollection

  const createChartSeries = (series: NumericSeries): ChartSeries => ({
    labels: source.versions,
    datasets: resourceTypes.map((type) => ({
      label: resourceLabels[type],
      data: buildChartPoints(series[type], timelineEntries),
      borderColor: colors[type],
      backgroundColor: colors[type],
      tension: 0.1,
      borderWidth: type === 'total' ? 3 : 2
    }))
  })

  const updateChartData = (pageKey: PageKey, pageData: PageDatasets) => {
    const pageCharts = {} as ChartPageData

    for (const kind of datasetKinds) {
      pageCharts[kind] = createChartSeries(pageData[kind])
      if (updateLoading) {
        chartLoadingStatus.value[pageKey][kind] = false
        processedCount++
        loadingProgress.value = Math.round((processedCount / totalCharts) * 100)
      }
    }

    currentChartDatasets[pageKey] = pageCharts
  }

  for (const { key } of pageEntries) {
    updateChartData(key, source.datasets[key])
  }
  updateChartData('average', source.datasets.average)

  return currentChartDatasets
}

// 图表选项配置（响应式，适配主题文字颜色）
const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  elements: {
    point: {
      radius: 0,
      hitRadius: 5,
      hoverRadius: 5
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'KiB',
        color: isDark.value ? '#e2e8f0' : '#2c3e50'
      },
      ticks: {
        color: isDark.value ? '#cbd5e0' : '#4a5568'
      },
      grid: {
        color: isDark.value ? '#4a5568' : '#e2e8f0'
      }
    },
    x: {
      type: 'linear',
      bounds: 'data',
      offset: false,
      grace: 0,
      min: xAxisRange.value.min,
      max: xAxisRange.value.max,
      title: {
        display: true,
        text: axisMode.value === 'version' ? '版本' : '发布时间',
        color: isDark.value ? '#e2e8f0' : '#2c3e50'
      },
      ticks: {
        autoSkip: true,
        maxRotation: axisMode.value === 'version' ? 45 : 0,
        minRotation: axisMode.value === 'version' ? 45 : 0,
        stepSize: axisMode.value === 'version' ? 1 : undefined,
        color: isDark.value ? '#cbd5e0' : '#4a5568',
        callback: (value: number | string, index: number, ticks: Array<{ value: number | string }>) => {
          const numericValue = parseTickTimestamp(value)
          if (numericValue === null) return ''

          if (axisMode.value === 'version') {
            const index = Math.round(numericValue)
            if (Math.abs(numericValue - index) > Number.EPSILON) return ''
            return rawDatasets.value?.versions[index] ?? ''
          }

          const previousTimestamp = index > 0 ? parseTickTimestamp(ticks[index - 1]?.value) : null
          return formatTimeAxisTick(numericValue, shouldShowYearOnTick(numericValue, previousTimestamp))
        }
      },
      grid: {
        color: isDark.value ? '#4a5568' : '#e2e8f0'
      }
    }
  },
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        color: isDark.value ? '#e2e8f0' : '#2c3e50'
      }
    },
    tooltip: {
      mode: 'x',
      intersect: false,
      backgroundColor: isDark.value ? '#2d3748' : '#ffffff',
      titleColor: isDark.value ? '#e2e8f0' : '#2c3e50',
      bodyColor: isDark.value ? '#cbd5e0' : '#4a5568',
      borderColor: isDark.value ? '#4a5568' : '#e2e8f0',
      borderWidth: 1,
      callbacks: {
        title: (items: Array<{ raw?: unknown }>) => {
          const point = items[0]?.raw as ChartPoint | undefined
          if (!point) return ''
          return [point.version, formatPublishedTime(point.publishedAt)]
        }
      }
    }
  },
  interaction: {
    mode: 'nearest',
    axis: 'x',
    intersect: false
  }
}))

watch([isDark, axisMode], () => {
  if (!rawDatasets.value) return
  chartDatasets.value = buildChartDatasets(rawDatasets.value)
})

// 加载并处理数据
onMounted(async () => {
  try {
    console.timeEnd('📊 图表初始化总耗时')
    console.timeEnd('  1️⃣ 数据加载')
    console.timeEnd('  2️⃣ 数据排序与处理')
    console.timeEnd('  3️⃣ 图表数据创建')
  } catch {
    // 忽略不存在的计时器错误
  }

  console.time('📊 图表初始化总耗时')
  isLoading.value = true
  loadingProgress.value = 0
  chartLoadingStatus.value = createChartLoadingState(true)

  try {
    console.time('  1️⃣ 数据加载')
    loadingStage.value = 'dataLoading'

    const jsonFiles = import.meta.glob<{ default: unknown }>('../../.github/page_size_audit_results/*.json')
    const paths = Object.keys(jsonFiles)
    const totalFiles = paths.length
    let completedCount = 0

    const loadPromises = paths.map(async (path) => {
      const module = await jsonFiles[path]()
      const version = path.match(/v\d+\.\d+\.\d+/)?.[0]

      completedCount++
      loadingProgress.value = Math.round((completedCount / totalFiles) * 100)

      if (version && module.default) {
        const data = decodeAuditFile(module.default)
        return {
          version,
          publishedAt: data.metadata.publishedAt,
          data
        }
      }
      return null
    })

    const allData = (await Promise.all(loadPromises)).filter((item): item is LoadedAuditEntry => item !== null)

    console.timeEnd('  1️⃣ 数据加载')

    console.time('  2️⃣ 数据排序与处理')
    loadingStage.value = 'dataProcessing'
    loadingProgress.value = 0

    allData.sort((a, b) => {
      const parseVersion = (version: string) => version.replace('v', '').split('.').map(Number)
      const [aMajor, aMinor, aPatch] = parseVersion(a.version)
      const [bMajor, bMinor, bPatch] = parseVersion(b.version)

      if (aMajor !== bMajor) return aMajor - bMajor
      if (aMinor !== bMinor) return aMinor - bMinor
      return aPatch - bPatch
    })

    const indexedData: IndexedAuditEntry[] = allData.map(({ version, publishedAt, data }) => ({
      version,
      publishedAt,
      resultsByUrl: new Map<string, AuditPageResult>(data.results.map((result: AuditPageResult) => [result.url, result]))
    }))
    const versions = indexedData.map(({ version }) => version)
    const publishedAts = indexedData.map(({ publishedAt }) => publishedAt)
    const datasets = createDatasetCollection()

    for (const { key, url } of pageEntries) {
      for (const { resultsByUrl } of indexedData) {
        const pageData = resultsByUrl.get(url)
        if (pageData) {
          for (const type of resourceTypes) {
            datasets[key].themeGzipped[type].push(pageData.themeResources[type].transferSize / 1024)
            datasets[key].themeRaw[type].push(pageData.themeResources[type].resourceSize / 1024)
            datasets[key].resourcesGzipped[type].push(pageData.resources[type].transferSize / 1024)
            datasets[key].resourcesRaw[type].push(pageData.resources[type].resourceSize / 1024)
          }
        } else {
          for (const type of resourceTypes) {
            datasets[key].themeGzipped[type].push(null)
            datasets[key].themeRaw[type].push(null)
            datasets[key].resourcesGzipped[type].push(null)
            datasets[key].resourcesRaw[type].push(null)
          }
        }
      }
    }

    const hasCompleteDatasetValues = (
      values: Record<DatasetKind, number | null>
    ): values is Record<DatasetKind, number> => datasetKinds.every((kind) => values[kind] !== null)

    for (let index = 0; index < versions.length; index++) {
      for (const type of resourceTypes) {
        const sums = {
          themeGzipped: 0,
          themeRaw: 0,
          resourcesGzipped: 0,
          resourcesRaw: 0
        } satisfies Record<DatasetKind, number>
        let count = 0

        for (const { key } of pageEntries) {
          const values = {
            themeGzipped: datasets[key].themeGzipped[type][index],
            themeRaw: datasets[key].themeRaw[type][index],
            resourcesGzipped: datasets[key].resourcesGzipped[type][index],
            resourcesRaw: datasets[key].resourcesRaw[type][index]
          } satisfies Record<DatasetKind, number | null>

          if (hasCompleteDatasetValues(values)) {
            for (const kind of datasetKinds) {
              sums[kind] += values[kind]
            }
            count++
          }
        }

        for (const kind of datasetKinds) {
          datasets.average[kind][type].push(count > 0 ? sums[kind] / count : null)
        }
      }
    }

    loadingProgress.value = 100
    console.timeEnd('  2️⃣ 数据排序与处理')

    rawDatasets.value = {
      datasets,
      versions,
      publishedAts
    }

    console.time('  3️⃣ 图表数据创建')
    loadingStage.value = 'chartCreation'
    loadingProgress.value = 0
    chartDatasets.value = buildChartDatasets(rawDatasets.value, true)
    loadingProgress.value = 100
    console.timeEnd('  3️⃣ 图表数据创建')
    console.timeEnd('📊 图表初始化总耗时')
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    isLoading.value = false
    loadingProgress.value = 100
  }
})

// 使用 defineClientComponent 创建 Line 图表组件
const LineChart = defineClientComponent(async () => {
  const chartjs = await import('chart.js')
  const { Line } = await import('vue-chartjs')

  const {
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  } = chartjs

  const ChartJS = chartjs.Chart

  ChartJS.register(
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  )

  return Line
})
</script>
<!-- markdownlint-enable MD011 -->

## Lighthouse

[![Lighthouse CI](https://img.shields.io/github/actions/workflow/status/HowieHz/halo-theme-higan-hz/run-page-size-audit.yml?branch=main&label=Lighthouse%20CI)](https://github.com/HowieHz/halo-theme-higan-hz/actions/workflows/run-page-size-audit.yml?query=branch%3Amain)

![Lighthouse](/lighthouse-score.svg)

## 体积监测

<div class="axis-mode-switch">
  <span class="axis-mode-switch__label">横轴模式</span>
  <label class="axis-mode-switch__control">
    <input v-model="axisMode" type="checkbox" true-value="time" false-value="version" aria-label="切换横轴模式" />
    <span class="axis-mode-switch__track">
      <span class="axis-mode-switch__thumb"></span>
    </span>
  </label>
  <span class="axis-mode-switch__value">{{ axisMode === 'version' ? '版本均分' : '时间均分' }}</span>
</div>

### 平均每个页面

::: details 主题资源（压缩）

<ProgressBar :isLoading="chartLoadingStatus.average.themeGzipped" :stage="loadingStage" :labels="labels" :progress="loadingProgress" label="进度" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.average?.themeGzipped">
  <LineChart :data="chartDatasets.average.themeGzipped" :options="chartOptions" />
</div>
:::

::: details 主题资源（原始）

<ProgressBar :isLoading="chartLoadingStatus.average.themeRaw" :stage="loadingStage" :labels="labels" :progress="loadingProgress" label="进度" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.average?.themeRaw">
  <LineChart :data="chartDatasets.average.themeRaw" :options="chartOptions" />
</div>
:::

::: details 页面资源（压缩）

<ProgressBar :isLoading="chartLoadingStatus.average.resourcesGzipped" :stage="loadingStage" :labels="labels" :progress="loadingProgress" label="进度" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.average?.resourcesGzipped">
  <LineChart :data="chartDatasets.average.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details 页面资源（原始）

<ProgressBar :isLoading="chartLoadingStatus.average.resourcesRaw" :stage="loadingStage" :labels="labels" :progress="loadingProgress" label="进度" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.average?.resourcesRaw">
  <LineChart :data="chartDatasets.average.resourcesRaw" :options="chartOptions" />
</div>
:::

### 首页

::: details 主题资源（压缩）

<ProgressBar :isLoading="chartLoadingStatus.home.themeGzipped" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="进度" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.home?.themeGzipped">
  <LineChart :data="chartDatasets.home.themeGzipped" :options="chartOptions" />
</div>
:::

::: details 主题资源（原始）

<ProgressBar :isLoading="chartLoadingStatus.home.themeRaw" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="进度" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.home?.themeRaw">
  <LineChart :data="chartDatasets.home.themeRaw" :options="chartOptions" />
</div>
:::

::: details 页面资源（压缩）

<ProgressBar :isLoading="chartLoadingStatus.home.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="进度" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.home?.resourcesGzipped">
  <LineChart :data="chartDatasets.home.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details 页面资源（原始）

<ProgressBar :isLoading="chartLoadingStatus.home.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="进度" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.home?.resourcesRaw">
  <LineChart :data="chartDatasets.home.resourcesRaw" :options="chartOptions" />
</div>
:::

### 文章归档

::: details 主题资源（压缩）

<ProgressBar :isLoading="chartLoadingStatus.archives.themeGzipped" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="进度" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.archives?.themeGzipped">
  <LineChart :data="chartDatasets.archives.themeGzipped" :options="chartOptions" />
</div>
:::

::: details 主题资源（原始）

<ProgressBar :isLoading="chartLoadingStatus.archives.themeRaw" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="进度" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.archives?.themeRaw">
  <LineChart :data="chartDatasets.archives.themeRaw" :options="chartOptions" />
</div>
:::

::: details 页面资源（压缩）

<ProgressBar :isLoading="chartLoadingStatus.archives.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="进度" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.archives?.resourcesGzipped">
  <LineChart :data="chartDatasets.archives.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details 页面资源（原始）

<ProgressBar :isLoading="chartLoadingStatus.archives.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="进度" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.archives?.resourcesRaw">
  <LineChart :data="chartDatasets.archives.resourcesRaw" :options="chartOptions" />
</div>
:::

### 文章详情

::: details 主题资源（压缩）

<ProgressBar :isLoading="chartLoadingStatus.post.themeGzipped" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="进度" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.post?.themeGzipped">
  <LineChart :data="chartDatasets.post.themeGzipped" :options="chartOptions" />
</div>
:::

::: details 主题资源（原始）

<ProgressBar :isLoading="chartLoadingStatus.post.themeRaw" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="进度" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.post?.themeRaw">
  <LineChart :data="chartDatasets.post.themeRaw" :options="chartOptions" />
</div>
:::

::: details 页面资源（压缩）

<ProgressBar :isLoading="chartLoadingStatus.post.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="进度" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.post?.resourcesGzipped">
  <LineChart :data="chartDatasets.post.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details 页面资源（原始）

<ProgressBar :isLoading="chartLoadingStatus.post.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="进度" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.post?.resourcesRaw">
  <LineChart :data="chartDatasets.post.resourcesRaw" :options="chartOptions" />
</div>
:::

### 标签集合

::: details 主题资源（压缩）

<ProgressBar :isLoading="chartLoadingStatus.tags.themeGzipped" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="进度" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.tags?.themeGzipped">
  <LineChart :data="chartDatasets.tags.themeGzipped" :options="chartOptions" />
</div>
:::

::: details 主题资源（原始）

<ProgressBar :isLoading="chartLoadingStatus.tags.themeRaw" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="进度" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.tags?.themeRaw">
  <LineChart :data="chartDatasets.tags.themeRaw" :options="chartOptions" />
</div>
:::

::: details 页面资源（压缩）

<ProgressBar :isLoading="chartLoadingStatus.tags.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="进度" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.tags?.resourcesGzipped">
  <LineChart :data="chartDatasets.tags.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details 页面资源（原始）

<ProgressBar :isLoading="chartLoadingStatus.tags.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="进度" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.tags?.resourcesRaw">
  <LineChart :data="chartDatasets.tags.resourcesRaw" :options="chartOptions" />
</div>
:::

### 标签详情

::: details 主题资源（压缩）

<ProgressBar :isLoading="chartLoadingStatus.tagDetail.themeGzipped" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="进度" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.tagDetail?.themeGzipped">
  <LineChart :data="chartDatasets.tagDetail.themeGzipped" :options="chartOptions" />
</div>
:::

::: details 主题资源（原始）

<ProgressBar :isLoading="chartLoadingStatus.tagDetail.themeRaw" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="进度" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.tagDetail?.themeRaw">
  <LineChart :data="chartDatasets.tagDetail.themeRaw" :options="chartOptions" />
</div>
:::

::: details 页面资源（压缩）

<ProgressBar :isLoading="chartLoadingStatus.tagDetail.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="进度" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.tagDetail?.resourcesGzipped">
  <LineChart :data="chartDatasets.tagDetail.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details 页面资源（原始）

<ProgressBar :isLoading="chartLoadingStatus.tagDetail.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="进度" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.tagDetail?.resourcesRaw">
  <LineChart :data="chartDatasets.tagDetail.resourcesRaw" :options="chartOptions" />
</div>
:::

### 分类集合

::: details 主题资源（压缩）

<ProgressBar :isLoading="chartLoadingStatus.categories.themeGzipped" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="进度" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.categories?.themeGzipped">
  <LineChart :data="chartDatasets.categories.themeGzipped" :options="chartOptions" />
</div>
:::

::: details 主题资源（原始）

<ProgressBar :isLoading="chartLoadingStatus.categories.themeRaw" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="进度" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.categories?.themeRaw">
  <LineChart :data="chartDatasets.categories.themeRaw" :options="chartOptions" />
</div>
:::

::: details 页面资源（压缩）

<ProgressBar :isLoading="chartLoadingStatus.categories.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="进度" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.categories?.resourcesGzipped">
  <LineChart :data="chartDatasets.categories.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details 页面资源（原始）

<ProgressBar :isLoading="chartLoadingStatus.categories.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="进度" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.categories?.resourcesRaw">
  <LineChart :data="chartDatasets.categories.resourcesRaw" :options="chartOptions" />
</div>
:::

### 分类详情

::: details 主题资源（压缩）

<ProgressBar :isLoading="chartLoadingStatus.categoryDetail.themeGzipped" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="进度" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.categoryDetail?.themeGzipped">
  <LineChart :data="chartDatasets.categoryDetail.themeGzipped" :options="chartOptions" />
</div>
:::

::: details 主题资源（原始）

<ProgressBar :isLoading="chartLoadingStatus.categoryDetail.themeRaw" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="进度" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.categoryDetail?.themeRaw">
  <LineChart :data="chartDatasets.categoryDetail.themeRaw" :options="chartOptions" />
</div>
:::

::: details 页面资源（压缩）

<ProgressBar :isLoading="chartLoadingStatus.categoryDetail.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="进度" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.categoryDetail?.resourcesGzipped">
  <LineChart :data="chartDatasets.categoryDetail.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details 页面资源（原始）

<ProgressBar :isLoading="chartLoadingStatus.categoryDetail.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="进度" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.categoryDetail?.resourcesRaw">
  <LineChart :data="chartDatasets.categoryDetail.resourcesRaw" :options="chartOptions" />
</div>
:::

### 作者详情

::: details 主题资源（压缩）

<ProgressBar :isLoading="chartLoadingStatus.author.themeGzipped" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="进度" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.author?.themeGzipped">
  <LineChart :data="chartDatasets.author.themeGzipped" :options="chartOptions" />
</div>
:::

::: details 主题资源（原始）

<ProgressBar :isLoading="chartLoadingStatus.author.themeRaw" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="进度" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.author?.themeRaw">
  <LineChart :data="chartDatasets.author.themeRaw" :options="chartOptions" />
</div>
:::

::: details 页面资源（压缩）

<ProgressBar :isLoading="chartLoadingStatus.author.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="进度" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.author?.resourcesGzipped">
  <LineChart :data="chartDatasets.author.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details 页面资源（原始）

<ProgressBar :isLoading="chartLoadingStatus.author.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="进度" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.author?.resourcesRaw">
  <LineChart :data="chartDatasets.author.resourcesRaw" :options="chartOptions" />
</div>
:::

### 独立页面

::: details 主题资源（压缩）

<ProgressBar :isLoading="chartLoadingStatus.about.themeGzipped" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="进度" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.about?.themeGzipped">
  <LineChart :data="chartDatasets.about.themeGzipped" :options="chartOptions" />
</div>
:::

::: details 主题资源（原始）

<ProgressBar :isLoading="chartLoadingStatus.about.themeRaw" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="进度" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.about?.themeRaw">
  <LineChart :data="chartDatasets.about.themeRaw" :options="chartOptions" />
</div>
:::

::: details 页面资源（压缩）

<ProgressBar :isLoading="chartLoadingStatus.about.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="进度" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.about?.resourcesGzipped">
  <LineChart :data="chartDatasets.about.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details 页面资源（原始）

<ProgressBar :isLoading="chartLoadingStatus.about.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="进度" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.about?.resourcesRaw">
  <LineChart :data="chartDatasets.about.resourcesRaw" :options="chartOptions" />
</div>
:::

<style scoped>
.axis-mode-switch {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  margin: 1rem 0 1.5rem;
  padding: 0.85rem 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
}

.axis-mode-switch__label,
.axis-mode-switch__value {
  font-weight: 600;
}

.axis-mode-switch__control {
  display: inline-flex;
  cursor: pointer;
}

.axis-mode-switch__control input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.axis-mode-switch__track {
  position: relative;
  display: inline-flex;
  width: 3.5rem;
  height: 1.9rem;
  border-radius: 999px;
  background: var(--vp-c-divider);
  transition: background-color 0.2s ease;
}

.axis-mode-switch__thumb {
  position: absolute;
  top: 0.2rem;
  left: 0.2rem;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background: var(--vp-c-bg);
  box-shadow: 0 2px 8px rgb(15 23 42 / 0.15);
  transition: transform 0.2s ease;
}

.axis-mode-switch__control input:checked + .axis-mode-switch__track {
  background: var(--vp-c-brand-1);
}

.axis-mode-switch__control input:checked + .axis-mode-switch__track .axis-mode-switch__thumb {
  transform: translateX(1.6rem);
}
</style>
