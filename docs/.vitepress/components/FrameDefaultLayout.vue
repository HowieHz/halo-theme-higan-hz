<script setup>
import { onMounted, ref } from "vue";
// Special api to mount the app
import { createApp } from "whyframe:app";

import { trackColorScheme } from "./utils";

const el = ref();

onMounted(async () => {
  trackColorScheme();

  // 加载编译后的 post CSS
  const cssPath = import.meta.env.DEV ? "/__vite_post_css__" : await getProductionCssPath();

  if (cssPath) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = cssPath;
    document.head.appendChild(link);
  }

  // Mount the app to the ref
  createApp(el.value);
});

async function getProductionCssPath() {
  try {
    const baseUrl = import.meta.env.BASE_URL || "/";
    const manifest = await fetch(`${baseUrl}tmp/docs/styles/manifest.json`).then((r) => r.json());
    return `${baseUrl}tmp/docs/styles/${manifest.postCss}`;
  } catch {
    console.warn("Failed to load CSS manifest");
    return "";
  }
}
</script>

<template>
  <article class="post" itemscope itemtype="http://schema.org/BlogPosting">
    <div id="vp-app" ref="el" class="content flex-auto" itemprop="articleBody"></div>
  </article>
</template>

<style src="./default.css" scoped></style>
