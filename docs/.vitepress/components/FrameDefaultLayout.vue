<script setup>
import { onMounted, ref } from "vue";
// Special api to mount the app
import { createApp } from "whyframe:app";

import { trackColorScheme } from "./utils";

const el = ref();

onMounted(async () => {
  trackColorScheme();
  // Mount the app to the ref
  createApp(el.value);
});
</script>

<template>
  <article class="post" itemscope itemtype="http://schema.org/BlogPosting">
    <div id="vp-app" ref="el" class="content" itemprop="articleBody"></div>
  </article>
</template>

<style src="./default.css" scoped></style>
<!-- 导入 post 页样式 -->
<style src="../../../src/styles/mixins/colors/theme.styl"></style>
<style src="../../../src/styles/main.css" scoped></style>
<style src="../../../src/styles/pages/post.css" scoped></style>
