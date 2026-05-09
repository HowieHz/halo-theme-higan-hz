---
outline: deep
---

# 性能参考

<script setup lang="ts">
import PerformanceAuditCharts from '../.vitepress/components/PerformanceAuditCharts.vue'
</script>

## Lighthouse

[![Lighthouse CI](https://img.shields.io/github/actions/workflow/status/HowieHz/halo-theme-higan-hz/run-page-size-audit.yml?branch=main&label=Lighthouse%20CI)](https://github.com/HowieHz/halo-theme-higan-hz/actions/workflows/run-page-size-audit.yml?query=branch%3Amain)

![Lighthouse](/lighthouse-score.svg)

## 体积监测

<PerformanceAuditCharts locale="zh-CN" />
