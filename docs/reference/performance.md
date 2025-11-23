---
outline: deep
---

<!-- markdownlint-disable MD033 -->

# 性能参考

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
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
  console.time('📊 图表初始化总耗时')
  
  try {
    console.time('  1️⃣ 数据加载')
    // 动态导入所有 JSON 文件
    const jsonFiles = import.meta.glob('../../.github/page_size_audit_results/*.json')

    const allData = []

    // 读取所有/JSON/文件读取所有 JSON 文件
    for (const path in jsonFiles) {
      const module = await jsonFiles[path]()
      const version = path.match(/v\d+\.\d+\.\d+/)?.[0]
      if (version && module.default) {
        allData.push({
          version,
          data: module.default
        })
      }
    }

    console.timeEnd('  1️⃣ 数据加载')

    console.time('  2️⃣ 数据排序与处理')
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

    console.timeEnd('  2️⃣ 数据排序与处理')

    // 保存原始数据
    rawDatasets.value = { datasets, versions }

    console.time('  3️⃣ 图表数据创建')
    // 创建图表数据格式的函数
    function createChartDatasets() {
      const colors = resourceColors.value
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
          },
          themeRaw: {
            labels: rawDatasets.value.versions,
            datasets: resourceTypes.map(type => ({
              label: resourceLabels[type],
              data: pageData.themeRaw[type],
              borderColor: colors[type],
              backgroundColor: colors[type],
              tension: 0.1,
              borderWidth: type === 'total' ? 3 : 2
            }))
          },
          resourcesGzipped: {
            labels: rawDatasets.value.versions,
            datasets: resourceTypes.map(type => ({
              label: resourceLabels[type],
              data: pageData.resourcesGzipped[type],
              borderColor: colors[type],
              backgroundColor: colors[type],
              tension: 0.1,
              borderWidth: type === 'total' ? 3 : 2
            }))
          },
          resourcesRaw: {
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
        }
      }
    }

    // 初始创建图表数据
    createChartDatasets()
    console.timeEnd('  3️⃣ 图表数据创建')

    console.timeEnd('📊 图表初始化总耗时')

    // 监听主题变化，重新创建图表数据
    watch(isDark, () => {
      createChartDatasets()
    })
  } catch (error) {
    console.error('加载数据失败:', error)
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

<div style="position: relative; height: 400px;" v-if="chartDatasets.average?.themeGzipped">
  <LineChart :data="chartDatasets.average.themeGzipped" :options="chartOptions" />
</div>
:::

::: details 主题资源（raw）

<div style="position: relative; height: 400px;" v-if="chartDatasets.average?.themeRaw">
  <LineChart :data="chartDatasets.average.themeRaw" :options="chartOptions" />
</div>
:::

::: details 页面资源（gzipped）

<div style="position: relative; height: 400px;" v-if="chartDatasets.average?.resourcesGzipped">
  <LineChart :data="chartDatasets.average.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details 页面资源（raw）

<div style="position: relative; height: 400px;" v-if="chartDatasets.average?.resourcesRaw">
  <LineChart :data="chartDatasets.average.resourcesRaw" :options="chartOptions" />
</div>
:::

### 首页

::: details 主题资源（gzipped）

<div style="position: relative; height: 400px;" v-if="chartDatasets.home?.themeGzipped">
  <LineChart :data="chartDatasets.home.themeGzipped" :options="chartOptions" />
</div>
:::

::: details 主题资源（raw）

<div style="position: relative; height: 400px;" v-if="chartDatasets.home?.themeRaw">
  <LineChart :data="chartDatasets.home.themeRaw" :options="chartOptions" />
</div>
:::

::: details 页面资源（gzipped）

<div style="position: relative; height: 400px;" v-if="chartDatasets.home?.resourcesGzipped">
  <LineChart :data="chartDatasets.home.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details 页面资源（raw）

<div style="position: relative; height: 400px;" v-if="chartDatasets.home?.resourcesRaw">
  <LineChart :data="chartDatasets.home.resourcesRaw" :options="chartOptions" />
</div>
:::

### 文章归档

::: details 主题资源（gzipped）

<div style="position: relative; height: 400px;" v-if="chartDatasets.archives?.themeGzipped">
  <LineChart :data="chartDatasets.archives.themeGzipped" :options="chartOptions" />
</div>
:::

::: details 主题资源（raw）

<div style="position: relative; height: 400px;" v-if="chartDatasets.archives?.themeRaw">
  <LineChart :data="chartDatasets.archives.themeRaw" :options="chartOptions" />
</div>
:::

::: details 页面资源（gzipped）

<div style="position: relative; height: 400px;" v-if="chartDatasets.archives?.resourcesGzipped">
  <LineChart :data="chartDatasets.archives.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details 页面资源（raw）

<div style="position: relative; height: 400px;" v-if="chartDatasets.archives?.resourcesRaw">
  <LineChart :data="chartDatasets.archives.resourcesRaw" :options="chartOptions" />
</div>
:::

### 文章详情

::: details 主题资源（gzipped）

<div style="position: relative; height: 400px;" v-if="chartDatasets.post?.themeGzipped">
  <LineChart :data="chartDatasets.post.themeGzipped" :options="chartOptions" />
</div>
:::

::: details 主题资源（raw）

<div style="position: relative; height: 400px;" v-if="chartDatasets.post?.themeRaw">
  <LineChart :data="chartDatasets.post.themeRaw" :options="chartOptions" />
</div>
:::

::: details 页面资源（gzipped）

<div style="position: relative; height: 400px;" v-if="chartDatasets.post?.resourcesGzipped">
  <LineChart :data="chartDatasets.post.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details 页面资源（raw）

<div style="position: relative; height: 400px;" v-if="chartDatasets.post?.resourcesRaw">
  <LineChart :data="chartDatasets.post.resourcesRaw" :options="chartOptions" />
</div>
:::

### 标签集合

::: details 主题资源（gzipped）

<div style="position: relative; height: 400px;" v-if="chartDatasets.tags?.themeGzipped">
  <LineChart :data="chartDatasets.tags.themeGzipped" :options="chartOptions" />
</div>
:::

::: details 主题资源（raw）

<div style="position: relative; height: 400px;" v-if="chartDatasets.tags?.themeRaw">
  <LineChart :data="chartDatasets.tags.themeRaw" :options="chartOptions" />
</div>
:::

::: details 页面资源（gzipped）

<div style="position: relative; height: 400px;" v-if="chartDatasets.tags?.resourcesGzipped">
  <LineChart :data="chartDatasets.tags.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details 页面资源（raw）

<div style="position: relative; height: 400px;" v-if="chartDatasets.tags?.resourcesRaw">
  <LineChart :data="chartDatasets.tags.resourcesRaw" :options="chartOptions" />
</div>
:::

### 标签详情

::: details 主题资源（gzipped）

<div style="position: relative; height: 400px;" v-if="chartDatasets.tagDetail?.themeGzipped">
  <LineChart :data="chartDatasets.tagDetail.themeGzipped" :options="chartOptions" />
</div>
:::

::: details 主题资源（raw）

<div style="position: relative; height: 400px;" v-if="chartDatasets.tagDetail?.themeRaw">
  <LineChart :data="chartDatasets.tagDetail.themeRaw" :options="chartOptions" />
</div>
:::

::: details 页面资源（gzipped）

<div style="position: relative; height: 400px;" v-if="chartDatasets.tagDetail?.resourcesGzipped">
  <LineChart :data="chartDatasets.tagDetail.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details 页面资源（raw）

<div style="position: relative; height: 400px;" v-if="chartDatasets.tagDetail?.resourcesRaw">
  <LineChart :data="chartDatasets.tagDetail.resourcesRaw" :options="chartOptions" />
</div>
:::

### 分类集合

::: details 主题资源（gzipped）

<div style="position: relative; height: 400px;" v-if="chartDatasets.categories?.themeGzipped">
  <LineChart :data="chartDatasets.categories.themeGzipped" :options="chartOptions" />
</div>
:::

::: details 主题资源（raw）

<div style="position: relative; height: 400px;" v-if="chartDatasets.categories?.themeRaw">
  <LineChart :data="chartDatasets.categories.themeRaw" :options="chartOptions" />
</div>
:::

::: details 页面资源（gzipped）

<div style="position: relative; height: 400px;" v-if="chartDatasets.categories?.resourcesGzipped">
  <LineChart :data="chartDatasets.categories.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details 页面资源（raw）

<div style="position: relative; height: 400px;" v-if="chartDatasets.categories?.resourcesRaw">
  <LineChart :data="chartDatasets.categories.resourcesRaw" :options="chartOptions" />
</div>
:::

### 分类详情

::: details 主题资源（gzipped）

<div style="position: relative; height: 400px;" v-if="chartDatasets.categoryDetail?.themeGzipped">
  <LineChart :data="chartDatasets.categoryDetail.themeGzipped" :options="chartOptions" />
</div>
:::

::: details 主题资源（raw）

<div style="position: relative; height: 400px;" v-if="chartDatasets.categoryDetail?.themeRaw">
  <LineChart :data="chartDatasets.categoryDetail.themeRaw" :options="chartOptions" />
</div>
:::

::: details 页面资源（gzipped）

<div style="position: relative; height: 400px;" v-if="chartDatasets.categoryDetail?.resourcesGzipped">
  <LineChart :data="chartDatasets.categoryDetail.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details 页面资源（raw）

<div style="position: relative; height: 400px;" v-if="chartDatasets.categoryDetail?.resourcesRaw">
  <LineChart :data="chartDatasets.categoryDetail.resourcesRaw" :options="chartOptions" />
</div>
:::

### 作者详情

::: details 主题资源（gzipped）

<div style="position: relative; height: 400px;" v-if="chartDatasets.author?.themeGzipped">
  <LineChart :data="chartDatasets.author.themeGzipped" :options="chartOptions" />
</div>
:::

::: details 主题资源（raw）

<div style="position: relative; height: 400px;" v-if="chartDatasets.author?.themeRaw">
  <LineChart :data="chartDatasets.author.themeRaw" :options="chartOptions" />
</div>
:::

::: details 页面资源（gzipped）

<div style="position: relative; height: 400px;" v-if="chartDatasets.author?.resourcesGzipped">
  <LineChart :data="chartDatasets.author.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details 页面资源（raw）

<div style="position: relative; height: 400px;" v-if="chartDatasets.author?.resourcesRaw">
  <LineChart :data="chartDatasets.author.resourcesRaw" :options="chartOptions" />
</div>
:::

### 独立页面

::: details 主题资源（gzipped）

<div style="position: relative; height: 400px;" v-if="chartDatasets.about?.themeGzipped">
  <LineChart :data="chartDatasets.about.themeGzipped" :options="chartOptions" />
</div>
:::

::: details 主题资源（raw）

<div style="position: relative; height: 400px;" v-if="chartDatasets.about?.themeRaw">
  <LineChart :data="chartDatasets.about.themeRaw" :options="chartOptions" />
</div>
:::

::: details 页面资源（gzipped）

<div style="position: relative; height: 400px;" v-if="chartDatasets.about?.resourcesGzipped">
  <LineChart :data="chartDatasets.about.resourcesGzipped" :options="chartOptions" />
</div>
:::

::: details 页面资源（raw）

<div style="position: relative; height: 400px;" v-if="chartDatasets.about?.resourcesRaw">
  <LineChart :data="chartDatasets.about.resourcesRaw" :options="chartOptions" />
</div>
:::
