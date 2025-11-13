<script setup>
import { onMounted, ref } from "vue";
// Special api to mount the app
import { createApp } from "whyframe:app";

import { trackColorScheme } from "./utils";

const el = ref();

onMounted(async () => {
  trackColorScheme();
  // Mount the app to the ref
  await createApp(el.value);

  // 获取所有 data-v- 开头的属性，排除 data-v-app
  const dataVAttrs = Array.from(el.value.attributes).filter(
    (attr) => attr.name.startsWith("data-v-") && attr.name !== "data-v-app",
  );

  if (dataVAttrs.length > 0) {
    // 递归函数：扫描子节点并添加属性
    const addDataVToChildren = (element) => {
      // 遍历子元素，给它们添加属性
      Array.from(element.children).forEach((child) => {
        dataVAttrs.forEach((attr) => {
          child.setAttribute(attr.name, attr.value);
        });
        // 递归处理子元素的子元素
        addDataVToChildren(child);
      });
    };

    // 从 el.value 开始递归，这样 el.value 本身不会被添加属性
    addDataVToChildren(el.value);
  }
});
</script>

<template>
  <article class="post" itemscope itemtype="http://schema.org/BlogPosting">
    <div id="vp-app" ref="el" class="content" itemprop="articleBody"></div>
  </article>
</template>

<style src="./default.css" scoped></style>
<style src="../../../tmp/styles/theme.css" scoped></style>
<style src="../../../src/styles/main.css" scoped></style>
<style src="../../../src/styles/pages/post.css" scoped></style>
