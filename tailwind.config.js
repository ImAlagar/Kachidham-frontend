/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#ECE7F9",
      },
      fontFamily: {
        heading: ['"Cormorant Garamond"', "serif"],
        subheading: ['"Playfair Display"', "serif"],
        body: ['"Manrope"', "sans-serif"],
        ui: ['"Lexend"', "sans-serif"],
      },
    },
  },
  plugins: [],
}