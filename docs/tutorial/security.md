---
outline: deep
---

# 安全防护

<script setup>
import { ref, computed } from 'vue'

const urlToEncode = ref('') // 用户输入的URL，用于base64编码

const encodedUrl = computed(() => {
  const url = urlToEncode.value.trim()
  if (!url) return ''
  try {
    return btoa(url) // 将URL编码为base64
  } catch (e) {
    return '无效URL'
  }
})
</script>

## 开启 CSP:upgrade-insecure-requests

开启 [CSP:upgrade-insecure-requests](/guide/theme-configuration#csp-upgrade-insecure-requests)，确保所有资源通过加密连接加载，减少中间人攻击风险。
也可避免 HTTPS 协议网页引用 HTTP 资源时报错。

相关文档：[CSP: upgrade-insecure-requests - HTTP | MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy/upgrade-insecure-requests)

## 开启仅允许使用指定域名访问

有许多博主的站点被恶意镜像站克隆。恶意克隆站替换页面中原本的站点链接，分走站点流量，影响站点 SEO。  
因此我开发了[仅允许使用指定域名访问](/guide/theme-configuration#仅允许使用指定域名访问)这个功能以应对这个问题。

::: info URL 转 Base64

<input v-model="urlToEncode" placeholder="请输入 URL 进行 Base64编码。例：https://howiehz.top" style="width:100%" />
<p v-if="encodedUrl">Base64 编码结果: {{ encodedUrl }}</p>

:::

将你的站点完整链接输入上方输入框，即可生成 Base64 编码结果。  
开启[仅允许使用指定域名访问](/guide/theme-configuration#仅允许使用指定域名访问)后，在“域名白名单列表”和“Base64 编码后的目标链接”输入 Base64 编码后的结果，即可防御恶意克隆。
