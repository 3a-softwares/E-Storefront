import { defineConfig } from 'tsup';

export default defineConfig([
  // Main library exports - build together, clean once
  {
    entry: {
      index: 'src/index.ts',
      client: 'src/client.ts',
      server: 'src/validation/server.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    splitting: false,
    external: ['express', 'express-validator', '@3asoftwares/types'],
  },
  // Config files - must externalize dependencies to avoid bundling issues
  {
    entry: {
      'config/webpack.base.config': 'src/config/webpack.base.config.ts',
      'config/vite.config': 'src/config/vite.config.ts',
      'config/tailwind.config': 'src/config/tailwind.config.ts',
      'config/vitest.base.config': 'src/config/vitest.base.config.ts',
    },
    format: ['cjs', 'esm'],
    dts: false, // Disabled due to vite version mismatch between root and package
    clean: false, // Don't clean, main build already cleaned
    splitting: false,
    external: [
      // Webpack externals
      'webpack',
      'webpack-dev-server',
      'html-webpack-plugin',
      'mini-css-extract-plugin',
      // Vite externals
      'vite',
      '@vitejs/plugin-react',
      'vite-plugin-dts',
      // Vitest externals
      'vitest',
      'vitest/config',
      '@testing-library/jest-dom/vitest',
      // Tailwind externals
      'tailwindcss',
      'daisyui',
      // Common
      'path',
      '@3asoftwares/types',
    ],
  },
]);
