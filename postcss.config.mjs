export default {
  plugins: {
    "tailwindcss/nesting": "postcss-nesting",
    tailwindcss: {},
    "postcss-preset-env": {},
    cssnano: { preset: "default" },
  },
};

// postcss-import 插件不需要，因为 vite 最后会构建全部 css 到一个文件里，就不需要这个操作了
