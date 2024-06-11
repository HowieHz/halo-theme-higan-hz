/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./templates/*.html",
    "./templates/fragments/*.html",
    "./templates/error/*.html",
    "./index.html",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
