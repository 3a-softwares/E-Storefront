/** @type {import('jest').Config} */
const baseConfig = require('3a-ecommerce-utils/config/jest.frontend');

module.exports = {
  ...baseConfig,
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
        useESM: true,
      },
    ],
  },
  moduleNameMapper: {
    '^3a-ecommerce-utils$': '<rootDir>/tests/__mocks__/utils.ts',
    '^3a-ecommerce-ui-library$': '<rootDir>/tests/__mocks__/ui-library.tsx',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transformIgnorePatterns: ['node_modules/(?!(zustand|@fortawesome)/)'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/bootstrap.tsx',
  ],
};
