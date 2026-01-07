/** @type {import('jest').Config} */
const baseConfig = require('3a-ecommerce-utils/config/jest.frontend');

module.exports = {
  ...baseConfig,
  moduleNameMapper: {
    ...baseConfig.moduleNameMapper,
    // Additional app-specific mocks
    '^\\.\\./store/store$': '<rootDir>/tests/__mocks__/store.ts',
    '^\\.\\./(\\.\\./)store/store$': '<rootDir>/tests/__mocks__/store.ts',
  },
};
