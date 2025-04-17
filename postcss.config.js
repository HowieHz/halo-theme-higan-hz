module.exports = {
  plugins: {
    "tailwindcss/nesting": "postcss-nesting",
    tailwindcss: {},
    "postcss-preset-env": {},
    ...(process.env.NODE_ENV == 777 ? { cssnano: { preset: "default" } } : {}),
  },
};

// postcss-import 插件不需要，因为 vite 最后会构建全部 css 到一个文件里，就不需要这个操作了
