/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-navy': '#1e3a8a',
        'brand-emerald': '#10b981',
        'brand-slate': '#64748b'
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif']
      }
    }
  },
  plugins: []
}