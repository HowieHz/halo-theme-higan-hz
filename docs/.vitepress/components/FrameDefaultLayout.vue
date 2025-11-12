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
  <div id="vp-app" ref="el"></div>
</template>

<!-- <style src="../../../src/styles/main.css" scoped>
</style>
<style src="../../../src/styles/tailwind.css" scoped>
</style>
<style src="../../../tmp/styles/theme.css" scoped>
</style> -->
<style src="./default.css" scoped>
</style>
