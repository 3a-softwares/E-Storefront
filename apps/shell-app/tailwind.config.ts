import type { Config } from 'tailwindcss';

const baseConfig = require('3a-ecommerce-utils/config/tailwind');

const config: Config = {
  ...baseConfig,
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './public/index.html',
    '../../packages/ui-library/src/**/*.{js,ts,jsx,tsx}',
  ],
};

export default config;
