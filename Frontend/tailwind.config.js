/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#223B7D',
        indigo: {
          100: '#e8edf5',
          200: '#c5d0e5',
          300: '#a2b3d5',
          400: '#5c7ab5',
          500: '#223B7D',
          600: '#1a2e63',
          700: '#122249',
          800: '#09152f',
          900: '#040a16',
        },
      },
    },
  },
  plugins: [],
}