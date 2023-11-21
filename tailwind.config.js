/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#73C745',
        secondary: '#FF8181',
        secondaryHover: '#FF9A1B',
        accentCommon: '#B1B1B1',
        accentLegendary: '#FF8F01',
        accentDuo: '#D2FF61'
      }
    }
  },
  plugins: []
}
