export default {
  plugins: {
    // "tailwindcss/nesting": "postcss-nesting",
    autoprefixer: {},
    ...(process.env.NODE_ENV == 777 ? { cssnano: { preset: "default" } } : {}),
  },
};
