/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false,
  },
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./templates/*.html",
    "./templates/fragments/*.html",
    "./templates/error/*.html",
  ],
  theme: {
    fontSize: {
      sm: ["0.875rem", "1.5rem"],
      base: ["1rem", "1.75rem"],
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [],
  },
};
