<script setup>
import { onMounted, ref } from "vue";
// Special api to mount the app
import { createApp } from "whyframe:app";

import { initHeadingAnchors } from "../../../src/templates/page-components/utils/heading-anchor";
import { extendStylesScope, trackColorScheme } from "./utils";

const el = ref();

onMounted(async () => {
  trackColorScheme();
  // Mount the app to the ref
  createApp(el.value).then(() => {
    initHeadingAnchors("article > .content");
    // initHeadingAnchors 需在 extendStylesScope 之前调用，确保 JS 动态插入的元素（如 .heading-anchor）
    // 也能被 extendStylesScope 的 BFS 遍历覆盖，从而获得 scoped CSS 所需的 data-v-* 属性。
    extendStylesScope(el.value);
  });
});
</script>

<template>
  <article id="article-tag" class="post">
    <div id="vp-app" ref="el" class="content loading" />
  </article>
</template>

<style src="./default.css" scoped></style>
<!-- 导入主题样式 -->
<style src="../../../src/templates/components/theme-dark/styles.less" scoped></style>
<style src="../../../src/templates/components/theme-light/styles.less" scoped></style>
<style src="../../../src/templates/page-components/shared/main.css" scoped></style>
<style src="../../../src/templates/components/text-size-normal/styles.css" scoped></style>
<!-- 导入 post 页样式 -->
<style src="../../../src/templates/page-components/post/styles.css" scoped></style>
<style src="../../../src/templates/page-components/utils/article.css" scoped></style>
<style src="../../../src/templates/page-components/utils/article-metadata.css" scoped></style>
