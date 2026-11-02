/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: '#F8F0E9',
          50: '#FDFCFB',
          100: '#FAF5F1',
          200: '#F8F0E9',
          300: '#EFE2D6',
          400: '#E4CFBF',
        },
        wine: {
          DEFAULT: '#681B28',
          light: '#7F2232',
          dark: '#52141F',
          deep: '#3D0E16',
        },
        burgundy: {
          DEFAULT: '#4A1028',
          light: '#5D1534',
          dark: '#380B1E',
        },
        rose: {
          dusty: '#D8B4AD',
          light: '#EAD5D0',
          dark: '#C2938A',
        },
        charcoal: {
          DEFAULT: '#282124',
          light: '#3C3337',
          muted: '#6A5F64',
          subtle: '#8C8085',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 10px 30px -10px rgba(74, 16, 40, 0.08), 0 2px 6px rgba(104, 27, 40, 0.04)',
        'luxury-lg': '0 20px 45px -12px rgba(74, 16, 40, 0.14), 0 0 20px rgba(216, 180, 173, 0.2)',
        'wine-glow': '0 0 30px rgba(104, 27, 40, 0.28)',
      }
    },
  },
  plugins: [],
}
