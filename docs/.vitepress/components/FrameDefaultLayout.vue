<script setup>
import { ref, onMounted } from 'vue'
// Special api to mount the app
import { createApp } from 'whyframe:app'
import { trackColorScheme } from './utils'

const el = ref()

onMounted(() => {
  trackColorScheme()
  // Mount the app to the ref
  createApp(el.value)
})

</script>

<template>
  <article class="post" itemscope itemtype="http://schema.org/BlogPosting">
    <div id="vp-app" ref="el" class="content flex-auto" itemprop="articleBody"></div>
  </article>
</template>

<style src="./default.css" scoped>
</style>
