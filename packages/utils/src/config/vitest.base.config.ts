import { defineConfig, UserConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import * as path from 'path';

/**
 * Base Vitest configuration for browser/React testing
 */
export function createBrowserVitestConfig(rootDir: string, options?: {
  setupFiles?: string[];
  include?: string[];
  coverageInclude?: string[];
  coverageExclude?: string[];
}): UserConfig {
  return defineConfig({
    plugins: [react()],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: options?.setupFiles || ['./vitest.setup.ts'],
      include: options?.include || ['src/**/*.test.{ts,tsx}', 'tests/**/*.test.{ts,tsx}'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html', 'lcov'],
        include: options?.coverageInclude || ['src/**/*.{ts,tsx}'],
        exclude: options?.coverageExclude || [
          'src/**/*.test.{ts,tsx}',
          'src/**/*.d.ts',
          'src/main.tsx',
          'src/bootstrap.tsx',
          'src/vite-env.d.ts',
        ],
        thresholds: {
          lines: 80,
          functions: 80,
          branches: 70,
          statements: 80,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(rootDir, './src'),
        '3a-ecommerce-ui-library': path.resolve(rootDir, '../../packages/ui-library/src'),
        '3a-ecommerce-utils': path.resolve(rootDir, '../../packages/utils/src'),
        '3a-ecommerce-types': path.resolve(rootDir, '../../packages/types/src'),
      },
    },
  });
}

/**
 * Base Vitest configuration for Node.js/backend testing
 */
export function createNodeVitestConfig(rootDir: string, options?: {
  include?: string[];
  coverageInclude?: string[];
  coverageExclude?: string[];
}): UserConfig {
  return defineConfig({
    test: {
      globals: true,
      environment: 'node',
      include: options?.include || ['tests/**/*.test.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        include: options?.coverageInclude || ['src/**/*.ts'],
        exclude: options?.coverageExclude || ['src/**/*.d.ts'],
      },
    },
  });
}

export { defineConfig };
