export default {
  plugins: {
    tailwindcss: {},
    "postcss-preset-env": {},
    ...(process.env.NODE_ENV == 777 ? { cssnano: { preset: "default" } } : {}),
  },
};
