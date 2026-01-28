/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0B1026',
        secondary: '#C9B56A',
      },
      fontFamily: {
          'baijamjuree': ['Bai Jamjuree', 'sans-serif'],
          'josefin':['Josefin Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
