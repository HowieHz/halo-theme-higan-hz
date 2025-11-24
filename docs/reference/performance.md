---
outline: deep
---

<!-- markdownlint-disable MD013 MD033 -->

# 性能参考

<script setup lang="ts">
import { ref, onMounted, computed, watch, h, defineComponent } from 'vue'
import { defineClientComponent, useData } from 'vitepress'

const { isDark } = useData()

// 页面 URL 映射
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

// 页面中文名称
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

// 资源类型配置
const resourceTypes = ['document', 'font', 'script', 'stylesheet', 'image', 'fetch', 'other', 'total']

// 响应式颜色配置（适配明暗主题）
const resourceColors = computed(() => isDark.value ? {
  // 暗色主题：使用更亮的颜色以提高对比度
  document: '#b794f4',
  font: '#4fd1c5',
  script: '#fc8181',
  stylesheet: '#63b3ed',
  image: '#f6ad55',
  fetch: '#68d391',
  other: '#cbd5e0',
  total: '#e2e8f0'
} : {
  // 亮色主题：使用较深的颜色
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

// 存储所有图表数据
const chartDatasets = ref({})
const rawDatasets = ref({}) // 存储原始数据用于主题切换

// 加载进度状态
const loadingProgress = ref(0)
const isLoading = ref(false)
const loadingStage = ref('')
const stageProgress = ref({
  dataLoading: 0,
  dataProcessing: 0,
  chartCreation: 0
})

// 每个图表的加载状态
const chartLoadingStatus = ref({})

// 进度条组件
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

      // 根据主题适配颜色
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

// 图表选项配置（响应式，适配主题文字颜色）
const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  // parsing: false, 化为内部格式才能用
  normalized: true, // 提供的数据索引唯一、已排序且在数据集之间一致，跳过验证和排序
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

// 加载并处理数据
onMounted(async () => {
  // 清除可能存在的计时器（处理热重载情况）
  try {
    console.timeEnd('📊 图表初始化总耗时')
    console.timeEnd('  1️⃣ 数据加载')
    console.timeEnd('  2️⃣ 数据排序与处理')
    console.timeEnd('  3️⃣ 图表数据创建')
  } catch (e) {
    // 忽略不存在的计时器错误
  }
  
  console.time('📊 图表初始化总耗时')
  isLoading.value = true
  loadingProgress.value = 0
  
  // 初始化所有图表的加载状态为 true
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

    // 动态导入所有 JSON 文件
    const jsonFiles = import.meta.glob('../../.github/page_size_audit_results/*.json')

    const allData = []
    const paths = Object.keys(jsonFiles)
    const totalFiles = paths.length
    let completedCount = 0

    // 并发加载所有 JSON 文件
    const loadPromises = paths.map(async (path) => {
      const module = await jsonFiles[path]()
      const version = path.match(/v\d+\.\d+\.\d+/)?.[0]

      // 更新进度（使用原子操作确保准确）
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
    // 按版本排序
    allData.sort((a, b) => {
      const parseVersion = (v) => v.replace('v', '').split('.').map(Number)
      const [aMajor, aMinor, aPatch] = parseVersion(a.version)
      const [bMajor, bMinor, bPatch] = parseVersion(b.version)

      if (aMajor !== bMajor) return aMajor - bMajor
      if (aMinor !== bMinor) return aMinor - bMinor
      return aPatch - bPatch
    })

    const versions = allData.map(d => d.version)

    // 为每个页面类型创建数据集
    const datasets = {}

    // 处理每个具体页面
    for (const [key, url] of Object.entries(pageUrls)) {
      datasets[key] = {
        themeGzipped: {},
        themeRaw: {},
        resourcesGzipped: {},
        resourcesRaw: {}
      }

      // 为每种资源类型初始化数组
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

    // 计算平均值
    datasets.average = {
      themeGzipped: {},
      themeRaw: {},
      resourcesGzipped: {},
      resourcesRaw: {}
    }

    // 为每种资源类型初始化数组
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

    // 保存原始数据
    rawDatasets.value = { datasets, versions }

    console.time('  3️⃣ 图表数据创建')
    loadingStage.value = 'chartCreation'
    loadingProgress.value = 0

    // 创建图表数据格式的函数
    function createChartDatasets() {
      const colors = resourceColors.value
      let processedCount = 0
      const totalCharts = Object.keys(rawDatasets.value.datasets).length * 4 // 每个页面4个图表

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

    // 初始创建图表数据
    createChartDatasets()
    stageProgress.value.chartCreation = 100
    loadingProgress.value = 100
    console.timeEnd('  3️⃣ 图表数据创建')

    console.timeEnd('📊 图表初始化总耗时')

    // 监听主题变化,重新创建图表数据
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

// 使用 defineClientComponent 创建 Line 图表组件
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

::: details Lighthouse 测试结果

![Lighthouse](/Lighthouse-result-2024-04-15-post.png)

:::

## 体积监测

### 平均每个页面

::: details 主题资源（gzipped）

<ProgressBar :isLoading="chartLoadingStatus.average?.themeGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.average?.themeGzipped">
  <LineChart :data="chartDatasets.average.themeGzipped" :options="chartOptions" />
</div>
:::

::: details 主题资源（raw）

<ProgressBar :isLoading="chartLoadingStatus.average?.themeRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.average?.themeRaw">
  <LineChart :data="chartDatasets.average.themeRaw" :options="chartOptions" />
</div>
:::

::: details 页面资源（gzipped）

<ProgressBar :isLoading="chartLoadingStatus.average?.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.average?.resourcesGzipped">
  <LineChart :data="chartDatasets.average.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details 页面资源（raw）

<ProgressBar :isLoading="chartLoadingStatus.average?.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.average?.resourcesRaw">
  <LineChart :data="chartDatasets.average.resourcesRaw" :options="chartOptions" />
</div>
:::

### 首页

::: details 主题资源（gzipped）

<ProgressBar :isLoading="chartLoadingStatus.home?.themeGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.home?.themeGzipped">
  <LineChart :data="chartDatasets.home.themeGzipped" :options="chartOptions" />
</div>
:::

::: details 主题资源（raw）

<ProgressBar :isLoading="chartLoadingStatus.home?.themeRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.home?.themeRaw">
  <LineChart :data="chartDatasets.home.themeRaw" :options="chartOptions" />
</div>
:::

::: details 页面资源（gzipped）

<ProgressBar :isLoading="chartLoadingStatus.home?.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.home?.resourcesGzipped">
  <LineChart :data="chartDatasets.home.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details 页面资源（raw）

<ProgressBar :isLoading="chartLoadingStatus.home?.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.home?.resourcesRaw">
  <LineChart :data="chartDatasets.home.resourcesRaw" :options="chartOptions" />
</div>
:::

### 文章归档

::: details 主题资源（gzipped）

<ProgressBar :isLoading="chartLoadingStatus.archives?.themeGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.archives?.themeGzipped">
  <LineChart :data="chartDatasets.archives.themeGzipped" :options="chartOptions" />
</div>
:::

::: details 主题资源（raw）

<ProgressBar :isLoading="chartLoadingStatus.archives?.themeRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.archives?.themeRaw">
  <LineChart :data="chartDatasets.archives.themeRaw" :options="chartOptions" />
</div>
:::

::: details 页面资源（gzipped）

<ProgressBar :isLoading="chartLoadingStatus.archives?.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.archives?.resourcesGzipped">
  <LineChart :data="chartDatasets.archives.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details 页面资源（raw）

<ProgressBar :isLoading="chartLoadingStatus.archives?.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.archives?.resourcesRaw">
  <LineChart :data="chartDatasets.archives.resourcesRaw" :options="chartOptions" />
</div>
:::

### 文章详情

::: details 主题资源（gzipped）

<ProgressBar :isLoading="chartLoadingStatus.post?.themeGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.post?.themeGzipped">
  <LineChart :data="chartDatasets.post.themeGzipped" :options="chartOptions" />
</div>
:::

::: details 主题资源（raw）

<ProgressBar :isLoading="chartLoadingStatus.post?.themeRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.post?.themeRaw">
  <LineChart :data="chartDatasets.post.themeRaw" :options="chartOptions" />
</div>
:::

::: details 页面资源（gzipped）

<ProgressBar :isLoading="chartLoadingStatus.post?.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.post?.resourcesGzipped">
  <LineChart :data="chartDatasets.post.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details 页面资源（raw）

<ProgressBar :isLoading="chartLoadingStatus.post?.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.post?.resourcesRaw">
  <LineChart :data="chartDatasets.post.resourcesRaw" :options="chartOptions" />
</div>
:::

### 标签集合

::: details 主题资源（gzipped）

<ProgressBar :isLoading="chartLoadingStatus.tags?.themeGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.tags?.themeGzipped">
  <LineChart :data="chartDatasets.tags.themeGzipped" :options="chartOptions" />
</div>
:::

::: details 主题资源（raw）

<ProgressBar :isLoading="chartLoadingStatus.tags?.themeRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.tags?.themeRaw">
  <LineChart :data="chartDatasets.tags.themeRaw" :options="chartOptions" />
</div>
:::

::: details 页面资源（gzipped）

<ProgressBar :isLoading="chartLoadingStatus.tags?.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.tags?.resourcesGzipped">
  <LineChart :data="chartDatasets.tags.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details 页面资源（raw）

<ProgressBar :isLoading="chartLoadingStatus.tags?.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.tags?.resourcesRaw">
  <LineChart :data="chartDatasets.tags.resourcesRaw" :options="chartOptions" />
</div>
:::

### 标签详情

::: details 主题资源（gzipped）

<ProgressBar :isLoading="chartLoadingStatus.tagDetail?.themeGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.tagDetail?.themeGzipped">
  <LineChart :data="chartDatasets.tagDetail.themeGzipped" :options="chartOptions" />
</div>
:::

::: details 主题资源（raw）

<ProgressBar :isLoading="chartLoadingStatus.tagDetail?.themeRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.tagDetail?.themeRaw">
  <LineChart :data="chartDatasets.tagDetail.themeRaw" :options="chartOptions" />
</div>
:::

::: details 页面资源（gzipped）

<ProgressBar :isLoading="chartLoadingStatus.tagDetail?.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.tagDetail?.resourcesGzipped">
  <LineChart :data="chartDatasets.tagDetail.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details 页面资源（raw）

<ProgressBar :isLoading="chartLoadingStatus.tagDetail?.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.tagDetail?.resourcesRaw">
  <LineChart :data="chartDatasets.tagDetail.resourcesRaw" :options="chartOptions" />
</div>
:::

### 分类集合

::: details 主题资源（gzipped）

<ProgressBar :isLoading="chartLoadingStatus.categories?.themeGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.categories?.themeGzipped">
  <LineChart :data="chartDatasets.categories.themeGzipped" :options="chartOptions" />
</div>
:::

::: details 主题资源（raw）

<ProgressBar :isLoading="chartLoadingStatus.categories?.themeRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.categories?.themeRaw">
  <LineChart :data="chartDatasets.categories.themeRaw" :options="chartOptions" />
</div>
:::

::: details 页面资源（gzipped）

<ProgressBar :isLoading="chartLoadingStatus.categories?.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.categories?.resourcesGzipped">
  <LineChart :data="chartDatasets.categories.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details 页面资源（raw）

<ProgressBar :isLoading="chartLoadingStatus.categories?.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.categories?.resourcesRaw">
  <LineChart :data="chartDatasets.categories.resourcesRaw" :options="chartOptions" />
</div>
:::

### 分类详情

::: details 主题资源（gzipped）

<ProgressBar :isLoading="chartLoadingStatus.categoryDetail?.themeGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.categoryDetail?.themeGzipped">
  <LineChart :data="chartDatasets.categoryDetail.themeGzipped" :options="chartOptions" />
</div>
:::

::: details 主题资源（raw）

<ProgressBar :isLoading="chartLoadingStatus.categoryDetail?.themeRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.categoryDetail?.themeRaw">
  <LineChart :data="chartDatasets.categoryDetail.themeRaw" :options="chartOptions" />
</div>
:::

::: details 页面资源（gzipped）

<ProgressBar :isLoading="chartLoadingStatus.categoryDetail?.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.categoryDetail?.resourcesGzipped">
  <LineChart :data="chartDatasets.categoryDetail.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details 页面资源（raw）

<ProgressBar :isLoading="chartLoadingStatus.categoryDetail?.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.categoryDetail?.resourcesRaw">
  <LineChart :data="chartDatasets.categoryDetail.resourcesRaw" :options="chartOptions" />
</div>
:::

### 作者详情

::: details 主题资源（gzipped）

<ProgressBar :isLoading="chartLoadingStatus.author?.themeGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.author?.themeGzipped">
  <LineChart :data="chartDatasets.author.themeGzipped" :options="chartOptions" />
</div>
:::

::: details 主题资源（raw）

<ProgressBar :isLoading="chartLoadingStatus.author?.themeRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.author?.themeRaw">
  <LineChart :data="chartDatasets.author.themeRaw" :options="chartOptions" />
</div>
:::

::: details 页面资源（gzipped）

<ProgressBar :isLoading="chartLoadingStatus.author?.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.author?.resourcesGzipped">
  <LineChart :data="chartDatasets.author.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details 页面资源（raw）

<ProgressBar :isLoading="chartLoadingStatus.author?.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.author?.resourcesRaw">
  <LineChart :data="chartDatasets.author.resourcesRaw" :options="chartOptions" />
</div>
:::

### 独立页面

::: details 主题资源（gzipped）

<ProgressBar :isLoading="chartLoadingStatus.about?.themeGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.about?.themeGzipped">
  <LineChart :data="chartDatasets.about.themeGzipped" :options="chartOptions" />
</div>
:::

::: details 主题资源（raw）

<ProgressBar :isLoading="chartLoadingStatus.about?.themeRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.about?.themeRaw">
  <LineChart :data="chartDatasets.about.themeRaw" :options="chartOptions" />
</div>
:::

::: details 页面资源（gzipped）

<ProgressBar :isLoading="chartLoadingStatus.about?.resourcesGzipped" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.about?.resourcesGzipped">
  <LineChart :data="chartDatasets.about.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details 页面资源（raw）

<ProgressBar :isLoading="chartLoadingStatus.about?.resourcesRaw" :stage="loadingStage" :progress="loadingProgress" />

<div style="position: relative; height: 400px;" v-if="chartDatasets.about?.resourcesRaw">
  <LineChart :data="chartDatasets.about.resourcesRaw" :options="chartOptions" />
</div>
:::
