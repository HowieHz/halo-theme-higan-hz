---
outline: deep
---

<!-- markdownlint-disable MD033 MD013 -->

# Security Protection

::: info Info

This documentation is AI-generated. You can help improve it by submitting an [Issue](https://github.com/HowieHz/halo-theme-higan-hz/issues/new).

:::

::: tip

If the issue remains unresolved, visit [GitHub Issues](https://github.com/HowieHz/halo-theme-higan-hz/issues) to search or submit new feedback, or join QQ group `694413711` for community support.

Contributions to this tutorial are always welcome.

:::

<script setup>
import { ref, computed } from 'vue'

const urlToEncode = ref('') // User input URL for base64 encoding

const encodedUrl = computed(() => {
  const url = urlToEncode.value.trim()
  if (!url) return ''
  try {
    return btoa(url) // Encode URL to base64
  } catch (e) {
    return 'Invalid URL'
  }
})
</script>

## Enable CSP:upgrade-insecure-requests

Enable [CSP:upgrade-insecure-requests](/en/guide/theme-configuration#csp-upgrade-insecure-requests) to ensure all resources are loaded over encrypted connections, reducing man-in-the-middle attack risks.
This also avoids errors when HTTPS pages reference HTTP resources.

Related documentation: [CSP: upgrade-insecure-requests - HTTP | MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/upgrade-insecure-requests)

## Enable Domain Whitelist Access Only

Many bloggers' sites have been cloned by malicious mirror sites. These malicious clones replace original site links, diverting site traffic and affecting SEO.  
Therefore, I developed the [Domain Whitelist Access Only](/en/guide/theme-configuration#only-allow-access-from-specified-domains) feature to address this issue.

::: info URL to Base64

<input v-model="urlToEncode" placeholder="Enter URL for Base64 encoding. Example: https://howiehz.top" style="width:100%" />
<p v-if="encodedUrl">Base64 encoded result: {{ encodedUrl }}</p>

:::

Enter your complete site URL in the input box above to generate the Base64 encoded result.  
After enabling [Domain Whitelist Access Only](/en/guide/theme-configuration#only-allow-access-from-specified-domains), enter the Base64 encoded result in "Domain Whitelist List" and "Base64 Encoded Target URL" to defend against malicious cloning.
