/** @type {import('tailwindcss').Config} */

import { lightColors, darkColors } from './src/utils/colors';

module.exports = {
  content: ['./index.{js,ts,tsx}', './src/**/*.{js,ts,tsx}'],

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
