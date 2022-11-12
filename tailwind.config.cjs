/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,css,md,mdx,html,json,scss}',
  ],
  darkMode: 'class',
  theme: {
    fontFamily: {
      display: ['Varela Round', 'sans-serif'],
    },
    extend: {
      colors: {
        'primary': '#03045e',
        'gray-light': '#F5F5F7',
        'gray-background': '#f9f8f9',
        'white-dark': 'rgb(208, 214, 224)',
        'white-darker': '#C3C9D2',
        'white-light': '#E6EBF8',
        black: '#000212',
        'black-100': '#242B3E',
        'black-200': '#191E2B',
        'black-300': '#060609',
      },
      container: {
        center: true,
        padding: '2rem'
      },
      gridTemplateRows: {
        'layout': '1fr auto',
      }
    },
  },
  plugins: [],
};
