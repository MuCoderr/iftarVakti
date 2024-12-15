import { lightColors, darkColors } from './src/utils/colors';
/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,ts,tsx}', './index.{js,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        light: lightColors,
        dark: darkColors,
      },
    },
  },
  plugins: [],
};
