import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetUno({
      preflight: false
    }),
    presetAttributify(),
    presetIcons()
  ],
  cli: {
    entry: {
      patterns: ['templates/**/*.html'],
      outFile: 'templates/assets/dist/uno.css'
    }
  }
})
