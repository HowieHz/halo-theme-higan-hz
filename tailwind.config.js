/** @type {import('tailwindcss').Config} */
export default {
  corePlugins: {
    preflight: false,
  },
  content: ["./src/**/*.{js,ts}", "./src/templates/**/*.html"],
  theme: {
    fontSize: {
      sm: ["0.875rem", "1.5rem"],
      base: ["1rem", "1.75rem"],
    },
  },
};
