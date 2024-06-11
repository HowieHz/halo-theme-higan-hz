export default {
  plugins: {
    "tailwindcss/nesting": "postcss-nesting",
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV == 777 ? { cssnano: { preset: "default" } } : {}),
  },
};
