/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App{,.tsx}",
    "./assets/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./screens/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('nativewind/tailwind'),
  ],
}