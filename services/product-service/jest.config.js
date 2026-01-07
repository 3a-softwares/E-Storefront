/** @type {import('jest').Config} */
const baseConfig = require('3a-ecommerce-utils/config/jest.backend');

module.exports = {
  ...baseConfig,
  moduleNameMapper: {
    ...baseConfig.moduleNameMapper,
    '^3a-ecommerce-types$': '<rootDir>/../../packages/types/src/index.ts',
  },
};
