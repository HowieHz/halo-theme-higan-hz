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
import { ref, onMounted, computed, watch, h, defineComponent } from 'vue'
import { defineClientComponent, useData } from 'vitepress'
import { decodeAuditFile, type AuditFile, type AuditPageResult, type ResourceType } from '../../.vitepress/utils/page-size-audit-schema'

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
type LoadedAuditEntry = {
  version: string
  data: AuditFile
}
type IndexedAuditEntry = {
  version: string
  resultsByUrl: Map<string, AuditPageResult>
}

type DatasetKind = 'themeGzipped' | 'themeRaw' | 'resourcesGzipped' | 'resourcesRaw'
const datasetKinds = ['themeGzipped', 'themeRaw', 'resourcesGzipped', 'resourcesRaw'] as const satisfies readonly DatasetKind[]
type NumericSeries = Record<ResourceType, Array<number | null>>
type PageDatasets = Record<DatasetKind, NumericSeries>
type DatasetCollection = Record<PageKey, PageDatasets>

type ChartSeries = {
  labels: string[]
  datasets: Array<{
    label: string
    data: Array<number | null>
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
}
type ChartLoadingFlags = Record<DatasetKind, boolean>
type ChartLoadingState = Record<PageKey, ChartLoadingFlags>

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
  // Dark theme: use brighter colors for better contrast
  document: '#b794f4',
  font: '#4fd1c5',
  script: '#fc8181',
  stylesheet: '#63b3ed',
  image: '#f6ad55',
  fetch: '#68d391',
  other: '#cbd5e0',
  total: '#e2e8f0'
} : {
  // Light theme: use deeper colors
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
const rawDatasets = ref<RawDatasetsState | null>(null) // Store raw data for theme switching

// Loading progress state
const loadingProgress = ref(0)
const isLoading = ref(false)
const loadingStage = ref('')

// Loading status for each chart
const chartLoadingStatus = ref<ChartLoadingState>(createChartLoadingState())

// Progress bar component
const ProgressBar = defineComponent({
  props: {
    isLoading: Boolean,
    stage: String,
    progress: Number
  },
  setup(props) {
    // @ts-expect-error TS6133: vue-tsc false positive in VitePress Markdown; stage labels are used by the render function below.
    const stageNames = {
      dataLoading: 'Loading Data',
      dataProcessing: 'Sorting and Processing Data',
      chartCreation: 'Creating Chart Data'
    }

    return () => {
      if (!props.isLoading) return null

      // Adapt colors based on theme
      const textColor = isDark.value ? '#cbd5e0' : '#4a5568'
      const bgColor = isDark.value ? '#374151' : '#e5e7eb'
      const progressGradient = isDark.value
        ? 'linear-gradient(90deg, #60a5fa 0%, #a78bfa 100%)'
        : 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)'

      return h('div', {
        style: {
          textAlign: 'center',
          padding: '1.5rem',
          color: textColor
        }
      }, [
        h('div', {
          style: {
            fontSize: '1rem',
            fontWeight: '600',
            marginBottom: '0.5rem',
            color: textColor
          }
        }, `${stageNames[props.stage]}...`),
        h('div', {
          style: {
            width: '100%',
            height: '4px',
            background: bgColor,
            borderRadius: '2px',
            overflow: 'hidden',
            marginTop: '0.75rem'
          }
        }, [
          h('div', {
            style: {
              width: `${props.progress}%`,
              height: '100%',
              background: progressGradient,
              transition: 'width 0.3s ease'
            }
          })
        ]),
        h('div', {
          style: {
            fontSize: '0.875rem',
            marginTop: '0.5rem',
            color: textColor
          }
        }, `Progress: ${props.progress}%`)
      ])
    }
  }
})

// Chart options configuration (responsive, adapts theme text color)
const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  // parsing: false, can only be used after converting to internal format
  normalized: true, // Provided data indexes are unique, sorted, and consistent across datasets, skip validation and sorting
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
      title: {
        display: true,
        text: 'Version',
        color: isDark.value ? '#e2e8f0' : '#2c3e50'
      },
      ticks: {
        color: isDark.value ? '#cbd5e0' : '#4a5568'
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
      borderWidth: 1
    }
  },
  interaction: {
    mode: 'nearest',
    axis: 'x',
    intersect: false
  }
}))

// Load and process data
onMounted(async () => {
  // Clear possible existing timers (handling hot reload cases)
  try {
    console.timeEnd('📊 Chart Initialization Total Time')
    console.timeEnd('  1️⃣ Data Loading')
    console.timeEnd('  2️⃣ Data Sorting and Processing')
    console.timeEnd('  3️⃣ Chart Data Creation')
  } catch (e) {
    // Ignore non-existent timer errors
  }
  
  console.time('📊 Chart Initialization Total Time')
  isLoading.value = true
  loadingProgress.value = 0

  // Initialize all chart loading status to true
  chartLoadingStatus.value = createChartLoadingState(true)
  
  try {
    console.time('  1️⃣ Data Loading')
    loadingStage.value = 'dataLoading'

    // Dynamically import all JSON files
    const jsonFiles = import.meta.glob<{ default: unknown }>('../../.github/page_size_audit_results/*.json')

    const paths = Object.keys(jsonFiles)
    const totalFiles = paths.length
    let completedCount = 0

    // Load all JSON files concurrently
    const loadPromises = paths.map(async (path) => {
      const module = await jsonFiles[path]()
      const version = path.match(/v\d+\.\d+\.\d+/)?.[0]

      // Update progress (using atomic operation for accuracy)
      completedCount++
      const progress = Math.round((completedCount / totalFiles) * 100)
      loadingProgress.value = progress

      if (version && module.default) {
        return {
          version,
          data: decodeAuditFile(module.default) // compact schema fields are decoded back to original names here
        }
      }
      return null
    })

    const allData = (await Promise.all(loadPromises)).filter((item): item is LoadedAuditEntry => item !== null)

    console.timeEnd('  1️⃣ Data Loading')

    console.time('  2️⃣ Data Sorting and Processing')
    loadingStage.value = 'dataProcessing'
    loadingProgress.value = 0
    // Sort by version
    allData.sort((a, b) => {
      const parseVersion = (v: string) => v.replace('v', '').split('.').map(Number)
      const [aMajor, aMinor, aPatch] = parseVersion(a.version)
      const [bMajor, bMinor, bPatch] = parseVersion(b.version)

      if (aMajor !== bMajor) return aMajor - bMajor
      if (aMinor !== bMinor) return aMinor - bMinor
      return aPatch - bPatch
    })

    const indexedData: IndexedAuditEntry[] = allData.map(({ version, data }) => ({
      version,
      resultsByUrl: new Map<string, AuditPageResult>(data.results.map((result: AuditPageResult) => [result.url, result]))
    }))
    const versions = indexedData.map(({ version }) => version)

    // Create datasets for each page type
    const datasets = createDatasetCollection()

    // Process each specific page
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

    // Calculate averages
    const hasCompleteDatasetValues = (
      values: Record<DatasetKind, number | null>
    ): values is Record<DatasetKind, number> => datasetKinds.every((kind) => values[kind] !== null)

    for (let i = 0; i < versions.length; i++) {
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
            themeGzipped: datasets[key].themeGzipped[type][i],
            themeRaw: datasets[key].themeRaw[type][i],
            resourcesGzipped: datasets[key].resourcesGzipped[type][i],
            resourcesRaw: datasets[key].resourcesRaw[type][i]
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

    // Save raw data
    rawDatasets.value = { datasets, versions }

    console.time('  3️⃣ Chart Data Creation')
    loadingStage.value = 'chartCreation'
    loadingProgress.value = 0

    // Function to create chart data format
    function createChartDatasets() {
      if (!rawDatasets.value) return
      const currentRawDatasets = rawDatasets.value
      const colors = resourceColors.value
      let processedCount = 0
      const totalCharts = (pageEntries.length + 1) * 4 // 4 charts per page
      const labels = currentRawDatasets.versions
      const createChartSeries = (series: NumericSeries): ChartSeries => ({
        labels,
        datasets: resourceTypes.map((type) => ({
          label: resourceLabels[type],
          data: series[type],
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
          chartLoadingStatus.value[pageKey][kind] = false
          processedCount++
          loadingProgress.value = Math.round((processedCount / totalCharts) * 100)
        }

        chartDatasets.value[pageKey] = pageCharts
      }

      for (const { key } of pageEntries) {
        updateChartData(key, currentRawDatasets.datasets[key])
      }
      updateChartData('average', currentRawDatasets.datasets.average)
    }

    // Initial chart data creation
    createChartDatasets()
    loadingProgress.value = 100
    console.timeEnd('  3️⃣ Chart Data Creation')

    console.timeEnd('📊 Chart Initialization Total Time')

    // Watch theme changes, recreate chart data
    watch(isDark, () => {
      createChartDatasets()
    })
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
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  } = chartjs

  const ChartJS = chartjs.Chart
  
  ChartJS.register(
    CategoryScale,
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

## Size Monitoring

### Average Per Page

::: details Theme Resources (compressed)

<ProgressBar :isLoading="chartLoadingStatus.average.themeGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.average?.themeGzipped">
  <LineChart :data="chartDatasets.average.themeGzipped" :options="chartOptions" />
</div>
:::

::: details Theme Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.average.themeRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.average?.themeRaw">
  <LineChart :data="chartDatasets.average.themeRaw" :options="chartOptions" />
</div>
:::

::: details Page Resources (compressed)

<ProgressBar :isLoading="chartLoadingStatus.average.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.average?.resourcesGzipped">
  <LineChart :data="chartDatasets.average.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details Page Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.average.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.average?.resourcesRaw">
  <LineChart :data="chartDatasets.average.resourcesRaw" :options="chartOptions" />
</div>
:::

### Home Page

::: details Theme Resources (compressed)

<ProgressBar :isLoading="chartLoadingStatus.home.themeGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.home?.themeGzipped">
  <LineChart :data="chartDatasets.home.themeGzipped" :options="chartOptions" />
</div>
:::

::: details Theme Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.home.themeRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.home?.themeRaw">
  <LineChart :data="chartDatasets.home.themeRaw" :options="chartOptions" />
</div>
:::

::: details Page Resources (compressed)

<ProgressBar :isLoading="chartLoadingStatus.home.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.home?.resourcesGzipped">
  <LineChart :data="chartDatasets.home.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details Page Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.home.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.home?.resourcesRaw">
  <LineChart :data="chartDatasets.home.resourcesRaw" :options="chartOptions" />
</div>
:::

### Archives

::: details Theme Resources (compressed)

<ProgressBar :isLoading="chartLoadingStatus.archives.themeGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.archives?.themeGzipped">
  <LineChart :data="chartDatasets.archives.themeGzipped" :options="chartOptions" />
</div>
:::

::: details Theme Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.archives.themeRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.archives?.themeRaw">
  <LineChart :data="chartDatasets.archives.themeRaw" :options="chartOptions" />
</div>
:::

::: details Page Resources (compressed)

<ProgressBar :isLoading="chartLoadingStatus.archives.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.archives?.resourcesGzipped">
  <LineChart :data="chartDatasets.archives.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details Page Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.archives.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.archives?.resourcesRaw">
  <LineChart :data="chartDatasets.archives.resourcesRaw" :options="chartOptions" />
</div>
:::

### Post Detail

::: details Theme Resources (compressed)

<ProgressBar :isLoading="chartLoadingStatus.post.themeGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.post?.themeGzipped">
  <LineChart :data="chartDatasets.post.themeGzipped" :options="chartOptions" />
</div>
:::

::: details Theme Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.post.themeRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.post?.themeRaw">
  <LineChart :data="chartDatasets.post.themeRaw" :options="chartOptions" />
</div>
:::

::: details Page Resources (compressed)

<ProgressBar :isLoading="chartLoadingStatus.post.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.post?.resourcesGzipped">
  <LineChart :data="chartDatasets.post.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details Page Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.post.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.post?.resourcesRaw">
  <LineChart :data="chartDatasets.post.resourcesRaw" :options="chartOptions" />
</div>
:::

### Tags Collection

::: details Theme Resources (compressed)

<ProgressBar :isLoading="chartLoadingStatus.tags.themeGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.tags?.themeGzipped">
  <LineChart :data="chartDatasets.tags.themeGzipped" :options="chartOptions" />
</div>
:::

::: details Theme Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.tags.themeRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.tags?.themeRaw">
  <LineChart :data="chartDatasets.tags.themeRaw" :options="chartOptions" />
</div>
:::

::: details Page Resources (compressed)

<ProgressBar :isLoading="chartLoadingStatus.tags.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.tags?.resourcesGzipped">
  <LineChart :data="chartDatasets.tags.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details Page Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.tags.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.tags?.resourcesRaw">
  <LineChart :data="chartDatasets.tags.resourcesRaw" :options="chartOptions" />
</div>
:::

### Tag Detail

::: details Theme Resources (compressed)

<ProgressBar :isLoading="chartLoadingStatus.tagDetail.themeGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.tagDetail?.themeGzipped">
  <LineChart :data="chartDatasets.tagDetail.themeGzipped" :options="chartOptions" />
</div>
:::

::: details Theme Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.tagDetail.themeRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.tagDetail?.themeRaw">
  <LineChart :data="chartDatasets.tagDetail.themeRaw" :options="chartOptions" />
</div>
:::

::: details Page Resources (compressed)

<ProgressBar :isLoading="chartLoadingStatus.tagDetail.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.tagDetail?.resourcesGzipped">
  <LineChart :data="chartDatasets.tagDetail.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details Page Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.tagDetail.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.tagDetail?.resourcesRaw">
  <LineChart :data="chartDatasets.tagDetail.resourcesRaw" :options="chartOptions" />
</div>
:::

### Categories Collection

::: details Theme Resources (compressed)

<ProgressBar :isLoading="chartLoadingStatus.categories.themeGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.categories?.themeGzipped">
  <LineChart :data="chartDatasets.categories.themeGzipped" :options="chartOptions" />
</div>
:::

::: details Theme Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.categories.themeRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.categories?.themeRaw">
  <LineChart :data="chartDatasets.categories.themeRaw" :options="chartOptions" />
</div>
:::

::: details Page Resources (compressed)

<ProgressBar :isLoading="chartLoadingStatus.categories.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.categories?.resourcesGzipped">
  <LineChart :data="chartDatasets.categories.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details Page Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.categories.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.categories?.resourcesRaw">
  <LineChart :data="chartDatasets.categories.resourcesRaw" :options="chartOptions" />
</div>
:::

### Category Detail

::: details Theme Resources (compressed)

<ProgressBar :isLoading="chartLoadingStatus.categoryDetail.themeGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.categoryDetail?.themeGzipped">
  <LineChart :data="chartDatasets.categoryDetail.themeGzipped" :options="chartOptions" />
</div>
:::

::: details Theme Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.categoryDetail.themeRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.categoryDetail?.themeRaw">
  <LineChart :data="chartDatasets.categoryDetail.themeRaw" :options="chartOptions" />
</div>
:::

::: details Page Resources (compressed)

<ProgressBar :isLoading="chartLoadingStatus.categoryDetail.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.categoryDetail?.resourcesGzipped">
  <LineChart :data="chartDatasets.categoryDetail.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details Page Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.categoryDetail.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.categoryDetail?.resourcesRaw">
  <LineChart :data="chartDatasets.categoryDetail.resourcesRaw" :options="chartOptions" />
</div>
:::

### Author Detail

::: details Theme Resources (compressed)

<ProgressBar :isLoading="chartLoadingStatus.author.themeGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.author?.themeGzipped">
  <LineChart :data="chartDatasets.author.themeGzipped" :options="chartOptions" />
</div>
:::

::: details Theme Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.author.themeRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.author?.themeRaw">
  <LineChart :data="chartDatasets.author.themeRaw" :options="chartOptions" />
</div>
:::

::: details Page Resources (compressed)

<ProgressBar :isLoading="chartLoadingStatus.author.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.author?.resourcesGzipped">
  <LineChart :data="chartDatasets.author.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details Page Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.author.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.author?.resourcesRaw">
  <LineChart :data="chartDatasets.author.resourcesRaw" :options="chartOptions" />
</div>
:::

### Single Page

::: details Theme Resources (compressed)

<ProgressBar :isLoading="chartLoadingStatus.about.themeGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.about?.themeGzipped">
  <LineChart :data="chartDatasets.about.themeGzipped" :options="chartOptions" />
</div>
:::

::: details Theme Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.about.themeRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.about?.themeRaw">
  <LineChart :data="chartDatasets.about.themeRaw" :options="chartOptions" />
</div>
:::

::: details Page Resources (compressed)

<ProgressBar :isLoading="chartLoadingStatus.about.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.about?.resourcesGzipped">
  <LineChart :data="chartDatasets.about.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details Page Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.about.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.about?.resourcesRaw">
  <LineChart :data="chartDatasets.about.resourcesRaw" :options="chartOptions" />
</div>
:::
