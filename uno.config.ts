import { defineConfig, presetIcons } from "unocss";

export default defineConfig({
  content: {
    filesystem: [
      './src/**/*.{html,js,ts,jsx,tsx,vue,svelte,astro}',
      './templates/**/*.html',
      './templates/*.html',
    ],
  },
  presets: [
    presetIcons({
      // collections: {
      //   "ant-design": () => import('@iconify-json/ant-design/icons.json').then(i => i.default),
      //   "fa-solid": () => import('@iconify-json/fa-solid/icons.json').then(i => i.default),
      //   "heroicons-outline": () => import('@iconify-json/heroicons-outline/icons.json').then(i => i.default),
      //   // @ts-expect-error idk
      //   "material-symbols": () => import('@iconify-json/material-symbols/icons.json').then(i => i.default),
      //   // @ts-expect-error idk
      //   "simple-icons": () => import('@iconify-json/simple-icons/icons.json').then(i => i.default),
      //   mdi: () => import('@iconify-json/mdi/icons.json').then(i => i.default),
      //   cib: () => import('@iconify-json/cib/icons.json').then(i => i.default),
      //   // @ts-expect-error idk
      //   ic: () => import('@iconify-json/ic/icons.json').then(i => i.default),
      //   // @ts-expect-error idk
      //   ph: () => import('@iconify-json/ph/icons.json').then(i => i.default),
      //   ri: () => import('@iconify-json/ri/icons.json').then(i => i.default),
      //   typcn: () => import('@iconify-json/typcn/icons.json').then(i => i.default),
      // }
      cdn: 'https://esm.sh/'
    }),
    // ...other presets
  ],
});
