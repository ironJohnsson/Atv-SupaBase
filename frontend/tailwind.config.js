/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cimatec: {
          blue: '#0047BA',
          dark: '#002B7A',
          light: '#E6EFFD',
          accent: '#FF6600',
        }
      }
    },
  },
  plugins: [],
}

