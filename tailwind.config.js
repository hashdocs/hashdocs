/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,md,mdx}',
    './components/**/*.{js,ts,jsx,tsx,md,mdx}',
    './app/**/*.{js,ts,jsx,tsx,md,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        grid: "url('/grid.svg')",
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
      fontSize: {
        xs13: [
          '0.840rem',
          {
            fontWeight: '450',
            letterSpacing: '-0.01em',
          },
        ],
        xs11: '11px',
      },
      colors: {
        blue: {
          50: '#f2f2ff',
          100: '#e6e6ff',
          200: '#ccccff',
          300: '#b3b3ff',
          400: '#9999ff',
          500: '#8080ff',
          600: '#6666ff',
          700: '#0010ff',
          800: '#0000e6',
          900: '#0000cc',
        },
      },
      keyframes: {
        rotateBorder: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        skeleton: {
          '0%': {
            backgroundPosition: '200% 0',
          },
          '100%': {
            backgroundPosition: '-200% 0',
          },
        },
      },
      animation: {
        rotateBorder: 'rotateBorder 4s linear infinite',
        skeleton: 'skeleton 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [
    require('prettier-plugin-tailwindcss'),
    require('tailwind-scrollbar')({ nocompatible: true }),
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
};
