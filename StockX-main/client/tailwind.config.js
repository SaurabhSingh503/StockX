/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mlsa-light-blue': '#0378CF',
        'mlsa-dark-blue': '#203A61',
        'mlsa-sky-blue': '#4CECEC',
        'mlsa-bg': '#393939'
      }
    },
  },
  plugins: [],
};