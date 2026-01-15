---
outline: deep
---

<!-- This documentation is AI-generated. You can help improve it by submitting an [Issue](https://github.com/HowieHz/halo-theme-higan-hz/issues/new). -->

<!-- markdownlint-disable MD033 -->

# Performance Reference

<script setup lang="ts">
import { ref, onMounted, computed, watch, h, defineComponent } from 'vue'
import { defineClientComponent, useData } from 'vitepress'

const { isDark } = useData()

// Page URL mapping
const pageUrls = {
  home: '/',
  archives: '/archives',
  post: '/archives/hello-halo',
  tags: '/tags',
  tagDetail: '/tags/halo',
  categories: '/categories',
  categoryDetail: '/categories/default',
  author: '/authors/admin',
  about: '/about'
}

// Page Chinese names
const pageNames = {
  average: '平均每个页面',
  home: '首页',
  archives: '文章归档',
  post: '文章详情',
  tags: '标签集合',
  tagDetail: '标签详情',
  categories: '分类集合',
  categoryDetail: '分类详情',
  author: '作者详情',
  about: '独立页面'
}

// Resource type configuration
const resourceTypes = ['document', 'font', 'script', 'stylesheet', 'image', 'fetch', 'other', 'total']

// Responsive color configuration (adapts to light/dark theme)
const resourceColors = computed(() => isDark.value ? {
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
  document: '文档',
  font: '字体',
  script: '脚本',
  stylesheet: '样式表',
  image: '图片',
  fetch: '数据请求',
  other: '其他',
  total: '总计'
}

// Store all chart data
const chartDatasets = ref({})
const rawDatasets = ref({}) // Store raw data for theme switching

// Loading progress state
const loadingProgress = ref(0)
const isLoading = ref(false)
const loadingStage = ref('')
const stageProgress = ref({
  dataLoading: 0,
  dataProcessing: 0,
  chartCreation: 0
})

// Loading status for each chart
const chartLoadingStatus = ref({})

// Progress bar component
const ProgressBar = defineComponent({
  props: {
    isLoading: Boolean,
    stage: String,
    progress: Number
  },
  setup(props) {
    const stageNames = {
      dataLoading: '数据加载',
      dataProcessing: '数据排序与处理',
      chartCreation: '图表数据创建'
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
        }, `正在${stageNames[props.stage]}...`),
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
        }, `进度: ${props.progress}%`)
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
        text: '版本',
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
    console.timeEnd('📊 图表初始化总耗时')
    console.timeEnd('  1️⃣ 数据加载')
    console.timeEnd('  2️⃣ 数据排序与处理')
    console.timeEnd('  3️⃣ 图表数据创建')
  } catch (e) {
    // Ignore non-existent timer errors
  }
  
  console.time('📊 图表初始化总耗时')
  isLoading.value = true
  loadingProgress.value = 0
  
  // Initialize all chart loading status to true
  const pageKeys = Object.keys(pageUrls).concat(['average'])
  for (const pageKey of pageKeys) {
    chartLoadingStatus.value[pageKey] = {
      themeGzipped: true,
      themeRaw: true,
      resourcesGzipped: true,
      resourcesRaw: true
    }
  }
  
  try {
    console.time('  1️⃣ 数据加载')
    loadingStage.value = 'dataLoading'

    // Dynamically import all JSON files
    const jsonFiles = import.meta.glob('../../.github/page_size_audit_results/*.json')

    const allData = []
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
      stageProgress.value.dataLoading = progress
      loadingProgress.value = progress

      if (version && module.default) {
        return {
          version,
          data: module.default
        }
      }
      return null
    })

    const results = await Promise.all(loadPromises)
    allData.push(...results.filter(item => item !== null))
    stageProgress.value.dataLoading = 100

    console.timeEnd('  1️⃣ 数据加载')

    console.time('  2️⃣ 数据排序与处理')
    loadingStage.value = 'dataProcessing'
    loadingProgress.value = 0
    // Sort by version
    allData.sort((a, b) => {
      const parseVersion = (v) => v.replace('v', '').split('.').map(Number)
      const [aMajor, aMinor, aPatch] = parseVersion(a.version)
      const [bMajor, bMinor, bPatch] = parseVersion(b.version)

      if (aMajor !== bMajor) return aMajor - bMajor
      if (aMinor !== bMinor) return aMinor - bMinor
      return aPatch - bPatch
    })

    const versions = allData.map(d => d.version)

    // Create datasets for each page type
    const datasets = {}

    // Process each specific page
    for (const [key, url] of Object.entries(pageUrls)) {
      datasets[key] = {
        themeGzipped: {},
        themeRaw: {},
        resourcesGzipped: {},
        resourcesRaw: {}
      }

      // Initialize arrays for each resource type
      for (const type of resourceTypes) {
        datasets[key].themeGzipped[type] = []
        datasets[key].themeRaw[type] = []
        datasets[key].resourcesGzipped[type] = []
        datasets[key].resourcesRaw[type] = []
      }

      allData.forEach(({ data }) => {
        const pageData = data.results?.find(r => r.url === url)
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
      })
    }

    // Calculate averages
    datasets.average = {
      themeGzipped: {},
      themeRaw: {},
      resourcesGzipped: {},
      resourcesRaw: {}
    }

    // Initialize arrays for each resource type
    for (const type of resourceTypes) {
      datasets.average.themeGzipped[type] = []
      datasets.average.themeRaw[type] = []
      datasets.average.resourcesGzipped[type] = []
      datasets.average.resourcesRaw[type] = []
    }

    for (let i = 0; i < versions.length; i++) {
      for (const type of resourceTypes) {
        let themeGzippedSum = 0, themeRawSum = 0, resourcesGzippedSum = 0, resourcesRawSum = 0
        let count = 0

        for (const key of Object.keys(pageUrls)) {
          if (datasets[key].themeGzipped[type][i] !== null) {
            themeGzippedSum += datasets[key].themeGzipped[type][i]
            themeRawSum += datasets[key].themeRaw[type][i]
            resourcesGzippedSum += datasets[key].resourcesGzipped[type][i]
            resourcesRawSum += datasets[key].resourcesRaw[type][i]
            count++
          }
        }

        datasets.average.themeGzipped[type].push(count > 0 ? themeGzippedSum / count : null)
        datasets.average.themeRaw[type].push(count > 0 ? themeRawSum / count : null)
        datasets.average.resourcesGzipped[type].push(count > 0 ? resourcesGzippedSum / count : null)
        datasets.average.resourcesRaw[type].push(count > 0 ? resourcesRawSum / count : null)
      }
    }

    stageProgress.value.dataProcessing = 100
    loadingProgress.value = 100
    console.timeEnd('  2️⃣ 数据排序与处理')

    // Save raw data
    rawDatasets.value = { datasets, versions }

    console.time('  3️⃣ 图表数据创建')
    loadingStage.value = 'chartCreation'
    loadingProgress.value = 0

    // Function to create chart data format
    function createChartDatasets() {
      const colors = resourceColors.value
      let processedCount = 0
      const totalCharts = Object.keys(rawDatasets.value.datasets).length * 4 // 4 charts per page

      for (const [pageKey, pageData] of Object.entries(rawDatasets.value.datasets)) {
        chartDatasets.value[pageKey] = {
          themeGzipped: {
            labels: rawDatasets.value.versions,
            datasets: resourceTypes.map(type => ({
              label: resourceLabels[type],
              data: pageData.themeGzipped[type],
              borderColor: colors[type],
              backgroundColor: colors[type],
              tension: 0.1,
              borderWidth: type === 'total' ? 3 : 2
            }))
          }
        }
        chartLoadingStatus.value[pageKey].themeGzipped = false
        processedCount++
        loadingProgress.value = Math.round((processedCount / totalCharts) * 100)

        chartDatasets.value[pageKey].themeRaw = {
          labels: rawDatasets.value.versions,
          datasets: resourceTypes.map(type => ({
            label: resourceLabels[type],
            data: pageData.themeRaw[type],
            borderColor: colors[type],
            backgroundColor: colors[type],
            tension: 0.1,
            borderWidth: type === 'total' ? 3 : 2
          }))
        }
        chartLoadingStatus.value[pageKey].themeRaw = false
        processedCount++
        loadingProgress.value = Math.round((processedCount / totalCharts) * 100)

        chartDatasets.value[pageKey].resourcesGzipped = {
          labels: rawDatasets.value.versions,
          datasets: resourceTypes.map(type => ({
            label: resourceLabels[type],
            data: pageData.resourcesGzipped[type],
            borderColor: colors[type],
            backgroundColor: colors[type],
            tension: 0.1,
            borderWidth: type === 'total' ? 3 : 2
          }))
        }
        chartLoadingStatus.value[pageKey].resourcesGzipped = false
        processedCount++
        loadingProgress.value = Math.round((processedCount / totalCharts) * 100)

        chartDatasets.value[pageKey].resourcesRaw = {
          labels: rawDatasets.value.versions,
          datasets: resourceTypes.map(type => ({
            label: resourceLabels[type],
            data: pageData.resourcesRaw[type],
            borderColor: colors[type],
            backgroundColor: colors[type],
            tension: 0.1,
            borderWidth: type === 'total' ? 3 : 2
          }))
        }
        chartLoadingStatus.value[pageKey].resourcesRaw = false
        processedCount++
        loadingProgress.value = Math.round((processedCount / totalCharts) * 100)
      }
    }

    // Initial chart data creation
    createChartDatasets()
    stageProgress.value.chartCreation = 100
    loadingProgress.value = 100
    console.timeEnd('  3️⃣ 图表数据创建')

    console.timeEnd('📊 图表初始化总耗时')

    // Watch theme changes, recreate chart data
    watch(isDark, () => {
      createChartDatasets()
    })
  } catch (error) {
    console.error('加载数据失败:', error)
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
    Chart,
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

## Lighthouse

[![Lighthouse CI](https://img.shields.io/github/actions/workflow/status/HowieHz/halo-theme-higan-hz/page-audit.yml?branch=main&label=Lighthouse%20CI)](https://github.com/HowieHz/halo-theme-higan-hz/actions/workflows/page-audit.yml?query=branch%3Amain)

![Lighthouse](/lighthouse-score.svg)

## Size Monitoring

### Average Per Page

::: details Theme Resources (gzipped)

<ProgressBar :isLoading="chartLoadingStatus.average?.themeGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.average?.themeGzipped">
  <LineChart :data="chartDatasets.average.themeGzipped" :options="chartOptions" />
</div>
:::

::: details Theme Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.average?.themeRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.average?.themeRaw">
  <LineChart :data="chartDatasets.average.themeRaw" :options="chartOptions" />
</div>
:::

::: details Page Resources (gzipped)

<ProgressBar :isLoading="chartLoadingStatus.average?.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.average?.resourcesGzipped">
  <LineChart :data="chartDatasets.average.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details Page Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.average?.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.average?.resourcesRaw">
  <LineChart :data="chartDatasets.average.resourcesRaw" :options="chartOptions" />
</div>
:::

### Home Page

::: details Theme Resources (gzipped)

<ProgressBar :isLoading="chartLoadingStatus.home?.themeGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.home?.themeGzipped">
  <LineChart :data="chartDatasets.home.themeGzipped" :options="chartOptions" />
</div>
:::

::: details Theme Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.home?.themeRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.home?.themeRaw">
  <LineChart :data="chartDatasets.home.themeRaw" :options="chartOptions" />
</div>
:::

::: details Page Resources (gzipped)

<ProgressBar :isLoading="chartLoadingStatus.home?.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.home?.resourcesGzipped">
  <LineChart :data="chartDatasets.home.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details Page Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.home?.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.home?.resourcesRaw">
  <LineChart :data="chartDatasets.home.resourcesRaw" :options="chartOptions" />
</div>
:::

### Archives

::: details Theme Resources (gzipped)

<ProgressBar :isLoading="chartLoadingStatus.archives?.themeGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.archives?.themeGzipped">
  <LineChart :data="chartDatasets.archives.themeGzipped" :options="chartOptions" />
</div>
:::

::: details Theme Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.archives?.themeRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.archives?.themeRaw">
  <LineChart :data="chartDatasets.archives.themeRaw" :options="chartOptions" />
</div>
:::

::: details Page Resources (gzipped)

<ProgressBar :isLoading="chartLoadingStatus.archives?.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.archives?.resourcesGzipped">
  <LineChart :data="chartDatasets.archives.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details Page Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.archives?.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.archives?.resourcesRaw">
  <LineChart :data="chartDatasets.archives.resourcesRaw" :options="chartOptions" />
</div>
:::

### Post Detail

::: details Theme Resources (gzipped)

<ProgressBar :isLoading="chartLoadingStatus.post?.themeGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.post?.themeGzipped">
  <LineChart :data="chartDatasets.post.themeGzipped" :options="chartOptions" />
</div>
:::

::: details Theme Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.post?.themeRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.post?.themeRaw">
  <LineChart :data="chartDatasets.post.themeRaw" :options="chartOptions" />
</div>
:::

::: details Page Resources (gzipped)

<ProgressBar :isLoading="chartLoadingStatus.post?.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.post?.resourcesGzipped">
  <LineChart :data="chartDatasets.post.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details Page Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.post?.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.post?.resourcesRaw">
  <LineChart :data="chartDatasets.post.resourcesRaw" :options="chartOptions" />
</div>
:::

### Tags Collection

::: details Theme Resources (gzipped)

<ProgressBar :isLoading="chartLoadingStatus.tags?.themeGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.tags?.themeGzipped">
  <LineChart :data="chartDatasets.tags.themeGzipped" :options="chartOptions" />
</div>
:::

::: details Theme Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.tags?.themeRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.tags?.themeRaw">
  <LineChart :data="chartDatasets.tags.themeRaw" :options="chartOptions" />
</div>
:::

::: details Page Resources (gzipped)

<ProgressBar :isLoading="chartLoadingStatus.tags?.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.tags?.resourcesGzipped">
  <LineChart :data="chartDatasets.tags.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details Page Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.tags?.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.tags?.resourcesRaw">
  <LineChart :data="chartDatasets.tags.resourcesRaw" :options="chartOptions" />
</div>
:::

### Tag Detail

::: details Theme Resources (gzipped)

<ProgressBar :isLoading="chartLoadingStatus.tagDetail?.themeGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.tagDetail?.themeGzipped">
  <LineChart :data="chartDatasets.tagDetail.themeGzipped" :options="chartOptions" />
</div>
:::

::: details Theme Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.tagDetail?.themeRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.tagDetail?.themeRaw">
  <LineChart :data="chartDatasets.tagDetail.themeRaw" :options="chartOptions" />
</div>
:::

::: details Page Resources (gzipped)

<ProgressBar :isLoading="chartLoadingStatus.tagDetail?.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.tagDetail?.resourcesGzipped">
  <LineChart :data="chartDatasets.tagDetail.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details Page Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.tagDetail?.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.tagDetail?.resourcesRaw">
  <LineChart :data="chartDatasets.tagDetail.resourcesRaw" :options="chartOptions" />
</div>
:::

### Categories Collection

::: details Theme Resources (gzipped)

<ProgressBar :isLoading="chartLoadingStatus.categories?.themeGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.categories?.themeGzipped">
  <LineChart :data="chartDatasets.categories.themeGzipped" :options="chartOptions" />
</div>
:::

::: details Theme Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.categories?.themeRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.categories?.themeRaw">
  <LineChart :data="chartDatasets.categories.themeRaw" :options="chartOptions" />
</div>
:::

::: details Page Resources (gzipped)

<ProgressBar :isLoading="chartLoadingStatus.categories?.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.categories?.resourcesGzipped">
  <LineChart :data="chartDatasets.categories.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details Page Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.categories?.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.categories?.resourcesRaw">
  <LineChart :data="chartDatasets.categories.resourcesRaw" :options="chartOptions" />
</div>
:::

### Category Detail

::: details Theme Resources (gzipped)

<ProgressBar :isLoading="chartLoadingStatus.categoryDetail?.themeGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.categoryDetail?.themeGzipped">
  <LineChart :data="chartDatasets.categoryDetail.themeGzipped" :options="chartOptions" />
</div>
:::

::: details Theme Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.categoryDetail?.themeRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.categoryDetail?.themeRaw">
  <LineChart :data="chartDatasets.categoryDetail.themeRaw" :options="chartOptions" />
</div>
:::

::: details Page Resources (gzipped)

<ProgressBar :isLoading="chartLoadingStatus.categoryDetail?.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.categoryDetail?.resourcesGzipped">
  <LineChart :data="chartDatasets.categoryDetail.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details Page Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.categoryDetail?.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.categoryDetail?.resourcesRaw">
  <LineChart :data="chartDatasets.categoryDetail.resourcesRaw" :options="chartOptions" />
</div>
:::

### Author Detail

::: details Theme Resources (gzipped)

<ProgressBar :isLoading="chartLoadingStatus.author?.themeGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.author?.themeGzipped">
  <LineChart :data="chartDatasets.author.themeGzipped" :options="chartOptions" />
</div>
:::

::: details Theme Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.author?.themeRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.author?.themeRaw">
  <LineChart :data="chartDatasets.author.themeRaw" :options="chartOptions" />
</div>
:::

::: details Page Resources (gzipped)

<ProgressBar :isLoading="chartLoadingStatus.author?.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.author?.resourcesGzipped">
  <LineChart :data="chartDatasets.author.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details Page Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.author?.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.author?.resourcesRaw">
  <LineChart :data="chartDatasets.author.resourcesRaw" :options="chartOptions" />
</div>
:::

### Single Page

::: details Theme Resources (gzipped)

<ProgressBar :isLoading="chartLoadingStatus.about?.themeGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.about?.themeGzipped">
  <LineChart :data="chartDatasets.about.themeGzipped" :options="chartOptions" />
</div>
:::

::: details Theme Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.about?.themeRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.about?.themeRaw">
  <LineChart :data="chartDatasets.about.themeRaw" :options="chartOptions" />
</div>
:::

::: details Page Resources (gzipped)

<ProgressBar :isLoading="chartLoadingStatus.about?.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.about?.resourcesGzipped">
  <LineChart :data="chartDatasets.about.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details Page Resources (raw)

<ProgressBar :isLoading="chartLoadingStatus.about?.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.about?.resourcesRaw">
  <LineChart :data="chartDatasets.about.resourcesRaw" :options="chartOptions" />
</div>
:::
