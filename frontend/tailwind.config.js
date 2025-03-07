/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'smart-green': '#334b35',
        'smart-yellow': '#f7c35f',
      }
    },
  },
  plugins: [],
  // Enable arbitrary values to support the exact hex colors
  safelist: [
    'bg-[#334b35]',
    'text-[#f7c35f]',
    'bg-[#f7c35f]',
  ]
}