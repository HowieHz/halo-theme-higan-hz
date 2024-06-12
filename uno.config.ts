import { defineConfig, presetMini, presetIcons  } from "unocss";

// mdi cib ic ph ri typcn "ant-design" "fa-solid" "heroicons-outline" "material-symbols" "simple-icons"

export default defineConfig({
  content: {
    filesystem: ["./src/**/*.{html,js,ts,jsx,tsx,vue,svelte,astro}", "./templates/**/*.html"]
  },
  presets: [
    presetMini({
      preflight: false
    }),
    presetIcons({})],
  cli: {
    entry: {
      patterns: ["./src/**/*.{html,js,ts,jsx,tsx,vue,svelte,astro}", "./templates/**/*.html", "./templates/*.html"],
      outFile: './tmp/styles/uno.css'
    }
  }
});
