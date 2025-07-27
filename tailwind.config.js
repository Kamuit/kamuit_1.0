/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: {
          DEFAULT: '#000000',
        },
        primary: {
          50: '#e6f9f0',
          100: '#b8f2d8',
          200: '#7beec2',
          300: '#2edfa0',
          400: '#00c875',
          500: '#00b060',
          600: '#00994d',
          700: '#007a3a',
          800: '#005c29',
          900: '#003d18',
        },
        twitterBlue: {
          DEFAULT: '#1da1f2',
        },
      },
    },
  },
  
  plugins: [],
}
