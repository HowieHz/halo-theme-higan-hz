<script setup>
import { useRoute } from 'vitepress'
import Theme from 'vitepress/theme'
// the default layout we'll create next
import FrameDefaultLayout from './FrameDefaultLayout.vue'

const route = useRoute()
</script>

<template>
  <!--
    replace with the layout entirely for `/halo-theme-higan-hz/frames/default`
    so we don't inherit from `Theme.Layout`
  -->
  <FrameDefaultLayout v-if="route.path.startsWith('/halo-theme-higan-hz/frames/default')" />
  <Theme.Layout v-else />
</template>
