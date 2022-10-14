/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,css,md,mdx,html,json,scss}',
  ],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        'white-dark': 'rgb(208, 214, 224)',
        'white-light': '#E6EBF8',
        black: 'rgb(0, 2, 18)',
        'black-100': '#242B3E',
        'black-200': '#191E2B',
        'black-300': '#060609',
      },
      container: {
        center: true,
        padding: '2rem'
      }
    },
  },
  plugins: [],
};
