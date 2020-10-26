module.exports = {
  variants: ['responsive', 'hover', 'focus', 'active'],
  purge: [
    './pages/**/*.tsx',
    './pages/**/*.jsx',
    './src/**/*.tsx',
    './src/**/*.jsx',
  ],
  future: {
    removeDeprecatedGapUtilities: true,
  },
  theme: {
    extend: {
      colors: {
        wrapper: '#edf2f7',
      },
    },
  },
};
