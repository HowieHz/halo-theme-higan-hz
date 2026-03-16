<script setup>
import { onMounted, ref } from "vue";
// Special api to mount the app
import { createApp } from "whyframe:app";

import { extendStylesScope, trackColorScheme } from "./utils";

const el = ref();


onMounted(async () => {
  trackColorScheme();
  // Mount the app to the ref
  createApp(el.value).then(() => {
    extendStylesScope(el.value);
  });
});
</script>

<template>
  <div id="vp-app" ref="el" class="content loading" />
</template>

<style src="./default.css" scoped></style>
<!-- 导入主题样式 -->
<style src="../../../src/templates/components/theme-dark/styles.less" scoped></style>
<style src="../../../src/templates/components/theme-light/styles.less" scoped></style>
<style src="../../../src/templates/page-components/utils/main.css" scoped></style>
<style src="../../../src/templates/components/text-size-normal/styles.css" scoped></style>
