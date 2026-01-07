import type { Config } from 'tailwindcss';

const baseConfig = require('3a-ecommerce-utils/config/tailwind');

const config: Config = {
  ...baseConfig,
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui-library/src/**/*.{js,ts,jsx,tsx}',
  ],
};

export default config;
