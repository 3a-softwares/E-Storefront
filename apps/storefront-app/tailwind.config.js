/** @type {import('tailwindcss').Config} */
const baseConfig = require('3a-ecommerce-utils/config/tailwind');

module.exports = {
  ...baseConfig,
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui-library/src/**/*.{js,ts,jsx,tsx}',
  ],
};
