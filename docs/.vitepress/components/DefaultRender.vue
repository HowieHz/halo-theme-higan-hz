<script setup>
import { ref } from "vue";

/* oxlint-disable eslint(no-undef) */
/**
 * 组件属性定义：
 * @prop {String} src - 要渲染的 iframe 源地址，默认为 "/halo-theme-higan-hz/frames/default.html"
 * @prop {String} height - iframe 的高度，默认为 "100px"
 */
defineProps({
  src: {
    type: String,
    default: "/halo-theme-higan-hz/frames/default.html",
  },
  height: {
    type: String,
    default: "100px",
  },
});
/* oxlint-enable eslint(no-undef) */

const loading = ref(true);
</script>

<template>
  <div :class="[$style.frame, { [$style.loading]: loading }]">
    <iframe data-why :src="src" :style="{ height }" @load="loading = false">
      <slot />
    </iframe>
  </div>
</template>

<style module>
.frame {
  /* 虽然说块级已经默认 100% 宽度了，但加上更保险 */
  width: 100%;
}

/* 加载状态：隐藏 iframe，显示 spinner */
.frame.loading {
  /* 相对定位以便 ::before 伪元素绝对定位 */
  position: relative;

  /* 隐藏 iframe */
  & > iframe {
    opacity: 0;
  }
}

/* 使用 ::before 伪元素创建 spinner */
.frame.loading::before {
  content: "";
  position: absolute;
  width: 40px;
  aspect-ratio: 1;
  inset: 0;
  margin: auto;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top-color: var(--vp-c-brand-1);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
