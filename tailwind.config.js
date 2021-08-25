const colors = require('tailwindcss/colors')

module.exports = {
  darkMode: false, // or 'media' or 'class'
  purge: {
    content: ['./src/**/*.html', './src/**/*.js'],
  },
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      primary: 'var(--color-primary)',
      blue1: 'var(--color-blue-1)',
      blue2: 'var(--color-blue-2)',
      blue3: 'var(--color-blue-3)',
      black: colors.black,
      white: colors.white,
      white1: 'var(--color-white-1)',
      gray: colors.trueGray,
      indigo: colors.indigo,
      red: colors.red,
      rose: colors.rose,
      yellow: colors.amber,
      green: colors.green,
    },
    fontSize: {
      sm: '12px',
      'sm-md': '14px',
      md: '16px',
      base: '18px',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
      '7xl': '5rem',
      '8xl': '6rem',
      '9xl': '8rem',
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    fontFamily: false,
  },
}
