/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        mobile: { max: '600px' },
        tablet: { min: '601px' },
        laptop: '1024px'
      },
      fontFamily: {
        Raleway: ['Raleway']
      },
      colors: {
        'error-message': '#fa755a'
      }
    }
  },
  plugins: []
}
