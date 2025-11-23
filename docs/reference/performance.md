---
outline: deep
---

# 性能参考

<script lang="ts">
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default {
  name: 'App',
  components: {
    Bar
  },
  data() {
    return {
      data: {
        labels: ['January', 'February', 'March'],
        datasets: [{ data: [40, 20, 12] }]
      },
      options: {
        responsive: true
      }
    }
  }
}
</script>

## Lighthouse

::: details Lighthouse 测试结果

![Lighthouse](/Lighthouse-result-2024-04-15-post.png)

:::

## 体积监测

<template>
  <Bar :data="data" :options="options" />
</template>
