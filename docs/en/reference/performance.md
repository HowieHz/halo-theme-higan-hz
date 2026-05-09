---
outline: deep
---

<!-- markdownlint-disable MD033 -->

# Performance Reference

::: info Info

This documentation is AI-generated. You can help improve it by submitting an [Issue](https://github.com/HowieHz/halo-theme-higan-hz/issues/new).

:::

<!-- markdownlint-disable MD011 -->
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { defineClientComponent, useData } from 'vitepress'
import { decodeAuditFile, type AuditFile, type AuditPageResult, type ResourceType } from '../../.vitepress/utils/page-size-audit-schema'
import ProgressBar from '../../.vitepress/components/ProgressBar.vue'

const { isDark } = useData()

// Page definitions
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

// Resource type configuration
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
type AxisRangeOption = {
  value: string
  label: string
  position: number
}
type ChartSettingsStatus = 'idle' | 'rendering' | 'done'
type ChartLoadingFlags = Record<DatasetKind, boolean>
type ChartLoadingState = Record<PageKey, ChartLoadingFlags>

const axisMode = ref<AxisMode>('version')
const activeCharts = new Set<any>()
const chartSettingsStatus = ref<ChartSettingsStatus>('idle')
const selectedRangeStart = ref('')
const selectedRangeEnd = ref('')
let chartSettingsTransitionToken = 0
let chartSettingsDoneTimer: ReturnType<typeof setTimeout> | null = null

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
  return timestamp > 0 ? formatLocalDateTime(timestamp) : 'Published time unavailable'
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

function formatRangeOptionLabel(version: string, publishedAt: number): string {
  return `${formatLocalDate(publishedAt, true)} · ${version}`
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

// Responsive color configuration (adapts to light/dark theme)
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
  document: 'Document',
  font: 'Font',
  script: 'Script',
  stylesheet: 'Stylesheet',
  image: 'Image',
  fetch: 'Fetch',
  other: 'Other',
  total: 'Total'
} satisfies Record<ResourceType, string>

// Store all chart data
const chartDatasets = ref<ChartDatasetCollection>({})
const rawDatasets = ref<RawDatasetsState | null>(null)

// Loading progress state
const loadingProgress = ref(0)
const isLoading = ref(false)
const loadingStage = ref<ProgressStage>('dataLoading')

// Loading status for each chart
const chartLoadingStatus = ref<ChartLoadingState>(createChartLoadingState())

const labels = {
  dataLoading: 'Loading Data',
  dataProcessing: 'Sorting and Processing Data',
  chartCreation: 'Creating Chart Data'
} as const satisfies Record<ProgressStage, string>

const rangeOptions = computed<AxisRangeOption[]>(() => {
  if (!rawDatasets.value) return []

  if (axisMode.value === 'version') {
    return rawDatasets.value.versions.map((version, index) => ({
      value: version,
      label: version,
      position: index
    }))
  }

  return rawDatasets.value.versions.flatMap((version, index) => {
    const publishedAt = rawDatasets.value?.publishedAts[index] ?? 0
    if (publishedAt <= 0) return []
    return [{
      value: version,
      label: formatRangeOptionLabel(version, publishedAt),
      position: publishedAt
    }]
  })
})

function getRangeOptionIndex(value: string, options: AxisRangeOption[]): number {
  return options.findIndex((option) => option.value === value)
}

function normalizeRangeSelection(changedField: 'start' | 'end' | 'auto' = 'auto') {
  const options = rangeOptions.value
  if (options.length === 0) {
    selectedRangeStart.value = ''
    selectedRangeEnd.value = ''
    return
  }

  if (getRangeOptionIndex(selectedRangeStart.value, options) === -1) {
    selectedRangeStart.value = options[0].value
  }

  if (getRangeOptionIndex(selectedRangeEnd.value, options) === -1) {
    selectedRangeEnd.value = options[options.length - 1].value
  }

  const startIndex = getRangeOptionIndex(selectedRangeStart.value, options)
  const endIndex = getRangeOptionIndex(selectedRangeEnd.value, options)

  if (startIndex === -1 || endIndex === -1) return
  if (startIndex <= endIndex) return

  if (changedField === 'end') {
    selectedRangeStart.value = selectedRangeEnd.value
    return
  }

  selectedRangeEnd.value = selectedRangeStart.value
}

const selectedRangeBounds = computed(() => {
  const options = rangeOptions.value
  if (options.length === 0) {
    return { min: 0, max: 0 }
  }

  const startIndex = getRangeOptionIndex(selectedRangeStart.value, options)
  const endIndex = getRangeOptionIndex(selectedRangeEnd.value, options)
  const safeStartIndex = startIndex === -1 ? 0 : startIndex
  const safeEndIndex = endIndex === -1 ? options.length - 1 : endIndex
  const minIndex = Math.min(safeStartIndex, safeEndIndex)
  const maxIndex = Math.max(safeStartIndex, safeEndIndex)

  return {
    min: options[minIndex].position,
    max: options[maxIndex].position
  }
})

const xAxisRange = computed(() => {
  if (!rawDatasets.value) {
    return { min: 0, max: 0 }
  }

  return selectedRangeBounds.value
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
    .filter((point) => point.x >= selectedRangeBounds.value.min && point.x <= selectedRangeBounds.value.max)

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

// Chart options configuration (responsive, adapts theme text color)
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
        text: axisMode.value === 'version' ? 'Version' : 'Published time',
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
      mode: 'index',
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
    mode: 'index',
    axis: 'x',
    intersect: false
  }
}))

function refreshChartDatasetsWithFeedback() {
  if (!rawDatasets.value) return

  if (chartSettingsDoneTimer) {
    clearTimeout(chartSettingsDoneTimer)
    chartSettingsDoneTimer = null
  }

  chartSettingsStatus.value = 'rendering'
  chartSettingsTransitionToken += 1
  const currentToken = chartSettingsTransitionToken
  chartDatasets.value = buildChartDatasets(rawDatasets.value)
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (currentToken === chartSettingsTransitionToken) {
        chartSettingsStatus.value = 'done'
        chartSettingsDoneTimer = setTimeout(() => {
          if (currentToken === chartSettingsTransitionToken) {
            chartSettingsStatus.value = 'idle'
          }
        }, 500)
      }
    })
  })
}

watch([rangeOptions, axisMode], () => {
  normalizeRangeSelection('auto')
}, { immediate: true })

watch(selectedRangeStart, () => {
  normalizeRangeSelection('start')
})

watch(selectedRangeEnd, () => {
  normalizeRangeSelection('end')
})

watch([isDark, axisMode, selectedRangeStart, selectedRangeEnd], () => {
  refreshChartDatasetsWithFeedback()
})

// Load and process data
onMounted(async () => {
  try {
    console.timeEnd('📊 Chart Initialization Total Time')
    console.timeEnd('  1️⃣ Data Loading')
    console.timeEnd('  2️⃣ Data Sorting and Processing')
    console.timeEnd('  3️⃣ Chart Data Creation')
  } catch {
    // Ignore non-existent timer errors
  }

  console.time('📊 Chart Initialization Total Time')
  isLoading.value = true
  loadingProgress.value = 0
  chartLoadingStatus.value = createChartLoadingState(true)

  try {
    console.time('  1️⃣ Data Loading')
    loadingStage.value = 'dataLoading'

    const jsonFiles = import.meta.glob<{ default: unknown }>('../../../.github/page_size_audit_results/*.json')
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

    console.timeEnd('  1️⃣ Data Loading')

    console.time('  2️⃣ Data Sorting and Processing')
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
    console.timeEnd('  2️⃣ Data Sorting and Processing')

    rawDatasets.value = {
      datasets,
      versions,
      publishedAts
    }
    normalizeRangeSelection('auto')

    console.time('  3️⃣ Chart Data Creation')
    loadingStage.value = 'chartCreation'
    loadingProgress.value = 0
    chartDatasets.value = buildChartDatasets(rawDatasets.value, true)
    loadingProgress.value = 100
    console.timeEnd('  3️⃣ Chart Data Creation')
    console.timeEnd('📊 Chart Initialization Total Time')
  } catch (error) {
    console.error('Failed to load data:', error)
  } finally {
    isLoading.value = false
    loadingProgress.value = 100
  }
})

// Use defineClientComponent to create Line chart component
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
  const exclusiveTooltipPlugin = {
    id: 'exclusiveTooltip',
    afterInit(chart: typeof ChartJS.prototype) {
      activeCharts.add(chart)
    },
    beforeEvent(chart: typeof ChartJS.prototype, args: { event?: { type?: string } }) {
      const eventType = args.event?.type
      if (!eventType || !['mousemove', 'mouseout', 'touchstart', 'touchmove', 'click'].includes(eventType)) {
        return
      }

      for (const otherChart of activeCharts) {
        if (otherChart === chart) continue
        if ((otherChart.tooltip?.getActiveElements().length ?? 0) === 0) continue
        otherChart.tooltip?.setActiveElements([], { x: 0, y: 0 })
        otherChart.update('none')
      }

      if (eventType === 'mouseout' && (chart.tooltip?.getActiveElements().length ?? 0) > 0) {
        chart.tooltip?.setActiveElements([], { x: 0, y: 0 })
        chart.update('none')
      }
    },
    afterDestroy(chart: typeof ChartJS.prototype) {
      activeCharts.delete(chart)
    }
  }
  
  ChartJS.register(
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    exclusiveTooltipPlugin
  )

  return Line
})
</script>
<!-- markdownlint-enable MD011 -->

## Lighthouse

[![Lighthouse CI](https://img.shields.io/github/actions/workflow/status/HowieHz/halo-theme-higan-hz/run-page-size-audit.yml?branch=main&label=Lighthouse%20CI)](https://github.com/HowieHz/halo-theme-higan-hz/actions/workflows/run-page-size-audit.yml?query=branch%3Amain)

![Lighthouse](/lighthouse-score.svg)

## Size Monitoring

<div class="chart-controls">
  <div class="chart-controls__header">
    <div class="chart-controls__title">Chart Settings</div>
    <span v-if="chartSettingsStatus !== 'idle'" class="axis-mode-switch__loading" aria-live="polite">
      <span
        class="axis-mode-switch__status-icon"
        :class="{ 'axis-mode-switch__status-icon--spinning': chartSettingsStatus === 'rendering' }"
      >
        {{ chartSettingsStatus === 'rendering' ? '' : '√' }}
      </span>
      {{ chartSettingsStatus === 'rendering' ? 'Rendering' : 'Rendered' }}
    </span>
  </div>
  <div class="axis-mode-switch">
    <span class="axis-mode-switch__label">Axis mode</span>
    <label class="axis-mode-switch__control">
      <select v-model="axisMode" class="axis-mode-switch__select" aria-label="Switch axis mode">
        <option value="version">Version spacing</option>
        <option value="time">Time spacing</option>
      </select>
    </label>
  </div>
  <div class="chart-range-controls">
    <span class="axis-mode-switch__label">{{ axisMode === 'version' ? 'Version range' : 'Time range' }}</span>
    <label class="axis-mode-switch__control">
      <select v-model="selectedRangeStart" class="axis-mode-switch__select axis-mode-switch__select--range" aria-label="Select range start">
        <option v-for="option in rangeOptions" :key="`start-${option.value}`" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </label>
    <span class="chart-range-controls__separator">to</span>
    <label class="axis-mode-switch__control">
      <select v-model="selectedRangeEnd" class="axis-mode-switch__select axis-mode-switch__select--range" aria-label="Select range end">
        <option v-for="option in rangeOptions" :key="`end-${option.value}`" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </label>
  </div>
</div>

### Average Per Page

::: details Theme Resources (compressed)

<ProgressBar :isLoading="chartLoadingStatus.average.themeGzipped" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="Progress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.average?.themeGzipped">
  <LineChart :data="chartDatasets.average.themeGzipped" :options="chartOptions" />
</div>
:::

::: details Theme Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.average.themeRaw" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="Progress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.average?.themeRaw">
  <LineChart :data="chartDatasets.average.themeRaw" :options="chartOptions" />
</div>
:::

::: details Page Resources (compressed)

<ProgressBar :isLoading="chartLoadingStatus.average.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="Progress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.average?.resourcesGzipped">
  <LineChart :data="chartDatasets.average.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details Page Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.average.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="Progress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.average?.resourcesRaw">
  <LineChart :data="chartDatasets.average.resourcesRaw" :options="chartOptions" />
</div>
:::

### Home Page

::: details Theme Resources (compressed)

<ProgressBar :isLoading="chartLoadingStatus.home.themeGzipped" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="Progress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.home?.themeGzipped">
  <LineChart :data="chartDatasets.home.themeGzipped" :options="chartOptions" />
</div>
:::

::: details Theme Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.home.themeRaw" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="Progress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.home?.themeRaw">
  <LineChart :data="chartDatasets.home.themeRaw" :options="chartOptions" />
</div>
:::

::: details Page Resources (compressed)

<ProgressBar :isLoading="chartLoadingStatus.home.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="Progress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.home?.resourcesGzipped">
  <LineChart :data="chartDatasets.home.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details Page Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.home.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="Progress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.home?.resourcesRaw">
  <LineChart :data="chartDatasets.home.resourcesRaw" :options="chartOptions" />
</div>
:::

### Archives

::: details Theme Resources (compressed)

<ProgressBar :isLoading="chartLoadingStatus.archives.themeGzipped" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="Progress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.archives?.themeGzipped">
  <LineChart :data="chartDatasets.archives.themeGzipped" :options="chartOptions" />
</div>
:::

::: details Theme Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.archives.themeRaw" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="Progress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.archives?.themeRaw">
  <LineChart :data="chartDatasets.archives.themeRaw" :options="chartOptions" />
</div>
:::

::: details Page Resources (compressed)

<ProgressBar :isLoading="chartLoadingStatus.archives.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="Progress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.archives?.resourcesGzipped">
  <LineChart :data="chartDatasets.archives.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details Page Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.archives.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="Progress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.archives?.resourcesRaw">
  <LineChart :data="chartDatasets.archives.resourcesRaw" :options="chartOptions" />
</div>
:::

### Post Detail

::: details Theme Resources (compressed)

<ProgressBar :isLoading="chartLoadingStatus.post.themeGzipped" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="Progress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.post?.themeGzipped">
  <LineChart :data="chartDatasets.post.themeGzipped" :options="chartOptions" />
</div>
:::

::: details Theme Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.post.themeRaw" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="Progress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.post?.themeRaw">
  <LineChart :data="chartDatasets.post.themeRaw" :options="chartOptions" />
</div>
:::

::: details Page Resources (compressed)

<ProgressBar :isLoading="chartLoadingStatus.post.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="Progress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.post?.resourcesGzipped">
  <LineChart :data="chartDatasets.post.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details Page Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.post.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="Progress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.post?.resourcesRaw">
  <LineChart :data="chartDatasets.post.resourcesRaw" :options="chartOptions" />
</div>
:::

### Tags Collection

::: details Theme Resources (compressed)

<ProgressBar :isLoading="chartLoadingStatus.tags.themeGzipped" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="Progress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.tags?.themeGzipped">
  <LineChart :data="chartDatasets.tags.themeGzipped" :options="chartOptions" />
</div>
:::

::: details Theme Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.tags.themeRaw" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="Progress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.tags?.themeRaw">
  <LineChart :data="chartDatasets.tags.themeRaw" :options="chartOptions" />
</div>
:::

::: details Page Resources (compressed)

<ProgressBar :isLoading="chartLoadingStatus.tags.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="Progress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.tags?.resourcesGzipped">
  <LineChart :data="chartDatasets.tags.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details Page Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.tags.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="Progress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.tags?.resourcesRaw">
  <LineChart :data="chartDatasets.tags.resourcesRaw" :options="chartOptions" />
</div>
:::

### Tag Detail

::: details Theme Resources (compressed)

<ProgressBar :isLoading="chartLoadingStatus.tagDetail.themeGzipped" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="Progress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.tagDetail?.themeGzipped">
  <LineChart :data="chartDatasets.tagDetail.themeGzipped" :options="chartOptions" />
</div>
:::

::: details Theme Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.tagDetail.themeRaw" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="Progress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.tagDetail?.themeRaw">
  <LineChart :data="chartDatasets.tagDetail.themeRaw" :options="chartOptions" />
</div>
:::

::: details Page Resources (compressed)

<ProgressBar :isLoading="chartLoadingStatus.tagDetail.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="Progress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.tagDetail?.resourcesGzipped">
  <LineChart :data="chartDatasets.tagDetail.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details Page Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.tagDetail.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="Progress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.tagDetail?.resourcesRaw">
  <LineChart :data="chartDatasets.tagDetail.resourcesRaw" :options="chartOptions" />
</div>
:::

### Categories Collection

::: details Theme Resources (compressed)

<ProgressBar :isLoading="chartLoadingStatus.categories.themeGzipped" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="Progress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.categories?.themeGzipped">
  <LineChart :data="chartDatasets.categories.themeGzipped" :options="chartOptions" />
</div>
:::

::: details Theme Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.categories.themeRaw" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="Progress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.categories?.themeRaw">
  <LineChart :data="chartDatasets.categories.themeRaw" :options="chartOptions" />
</div>
:::

::: details Page Resources (compressed)

<ProgressBar :isLoading="chartLoadingStatus.categories.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="Progress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.categories?.resourcesGzipped">
  <LineChart :data="chartDatasets.categories.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details Page Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.categories.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="Progress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.categories?.resourcesRaw">
  <LineChart :data="chartDatasets.categories.resourcesRaw" :options="chartOptions" />
</div>
:::

### Category Detail

::: details Theme Resources (compressed)

<ProgressBar :isLoading="chartLoadingStatus.categoryDetail.themeGzipped" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="Progress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.categoryDetail?.themeGzipped">
  <LineChart :data="chartDatasets.categoryDetail.themeGzipped" :options="chartOptions" />
</div>
:::

::: details Theme Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.categoryDetail.themeRaw" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="Progress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.categoryDetail?.themeRaw">
  <LineChart :data="chartDatasets.categoryDetail.themeRaw" :options="chartOptions" />
</div>
:::

::: details Page Resources (compressed)

<ProgressBar :isLoading="chartLoadingStatus.categoryDetail.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="Progress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.categoryDetail?.resourcesGzipped">
  <LineChart :data="chartDatasets.categoryDetail.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details Page Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.categoryDetail.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="Progress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.categoryDetail?.resourcesRaw">
  <LineChart :data="chartDatasets.categoryDetail.resourcesRaw" :options="chartOptions" />
</div>
:::

### Author Detail

::: details Theme Resources (compressed)

<ProgressBar :isLoading="chartLoadingStatus.author.themeGzipped" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="Progress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.author?.themeGzipped">
  <LineChart :data="chartDatasets.author.themeGzipped" :options="chartOptions" />
</div>
:::

::: details Theme Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.author.themeRaw" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="Progress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.author?.themeRaw">
  <LineChart :data="chartDatasets.author.themeRaw" :options="chartOptions" />
</div>
:::

::: details Page Resources (compressed)

<ProgressBar :isLoading="chartLoadingStatus.author.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="Progress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.author?.resourcesGzipped">
  <LineChart :data="chartDatasets.author.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details Page Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.author.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="Progress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.author?.resourcesRaw">
  <LineChart :data="chartDatasets.author.resourcesRaw" :options="chartOptions" />
</div>
:::

### Single Page

::: details Theme Resources (compressed)

<ProgressBar :isLoading="chartLoadingStatus.about.themeGzipped" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="Progress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.about?.themeGzipped">
  <LineChart :data="chartDatasets.about.themeGzipped" :options="chartOptions" />
</div>
:::

::: details Theme Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.about.themeRaw" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="Progress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.about?.themeRaw">
  <LineChart :data="chartDatasets.about.themeRaw" :options="chartOptions" />
</div>
:::

::: details Page Resources (compressed)

<ProgressBar :isLoading="chartLoadingStatus.about.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="Progress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.about?.resourcesGzipped">
  <LineChart :data="chartDatasets.about.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details Page Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.about.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" :labels="labels" label="Progress" />

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
}

.chart-range-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.85rem;
}

.chart-controls {
  margin: 1rem 0 1.5rem;
  padding: 0.85rem 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
}

.chart-controls__header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.85rem;
}

.chart-controls__title {
  color: var(--vp-c-text-1);
  font-weight: 600;
}

.axis-mode-switch__control {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.axis-mode-switch__select {
  min-width: 10rem;
  padding: 0.45rem 2.5rem 0.45rem 0.75rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2.5 4.5L6 8L9.5 4.5' stroke='%236b7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.8rem center;
  background-size: 0.75rem;
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
}

.axis-mode-switch__select--range {
  min-width: 13rem;
}

.chart-range-controls__separator {
  color: var(--vp-c-text-2);
}

.axis-mode-switch__loading {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
}

.axis-mode-switch__status-icon {
  width: 0.95rem;
  height: 0.95rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--vp-c-brand-1);
  font-weight: 700;
}

.axis-mode-switch__status-icon--spinning {
  border: 2px solid color-mix(in srgb, var(--vp-c-brand-1) 25%, transparent);
  border-top-color: var(--vp-c-brand-1);
  border-radius: 999px;
  animation: axis-mode-spin 0.8s linear infinite;
}

@keyframes axis-mode-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
