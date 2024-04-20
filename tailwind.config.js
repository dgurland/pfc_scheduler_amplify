/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          100: '#2a2b63',
          200: '#3d3683'
        },
        gold: {
          100: '#e5af06',
          200: '#f5be17'
        },
        green: '#015d29',
        red: '#ff0000',
        gray: 'rgba(0,0,0,0.6)'
      },
    },
  },
  plugins: [],
}

