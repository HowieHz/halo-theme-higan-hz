/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./templates/*.html",
    "./templates/fragments/*.html",
    "./templates/error/*.html",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
