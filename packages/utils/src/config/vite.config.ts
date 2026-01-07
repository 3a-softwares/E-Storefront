import { defineConfig, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';

export function createBaseViteConfig(rootDir: string): UserConfig {
  return defineConfig({
    plugins: [react()],
    css: {
      postcss: path.resolve(rootDir, 'postcss.config.js'),
    },
    resolve: {
      alias: {
        '3a-ecommerce-ui-library': path.resolve(rootDir, '../../packages/ui-library/src'),
        '3a-ecommerce-types': path.resolve(rootDir, '../../packages/types/src'),
        '3a-ecommerce-utils': path.resolve(rootDir, '../../packages/utils/src'),
      },
    },
  });
}

export async function createLibraryViteConfig(rootDir: string): Promise<UserConfig> {
  const base = createBaseViteConfig(rootDir) as UserConfig;

  const config: any = Object.assign({}, base);

  config.build = config.build || {};
  config.build.lib = {
    entry: path.resolve(rootDir, 'src/index.ts'),
    name: 'ui-library',
    formats: ['es', 'cjs', 'umd'],
    fileName: (format: string) => `ui-library.${format}.js`,
  };
  config.build.rollupOptions = config.build.rollupOptions || {};
  config.build.rollupOptions.external = ['react', 'react-dom'];
  config.build.rollupOptions.output = {
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
  };

  const isVitest =
    Boolean(process.env.VITEST) ||
    Boolean(
      process.env.npm_lifecycle_event && process.env.npm_lifecycle_event.includes('vitest')
    ) ||
    process.argv.join(' ').includes('vitest');

  if (isVitest) {
    // @ts-ignore - Dynamic import with fallback, module may not exist
    const { storybookTest } = await import('@storybook/addon-vitest/vitest-plugin').catch(() => ({
      storybookTest: undefined,
    }));
    // @ts-ignore - Dynamic import with fallback, module may not exist
    const { playwright } = await import('@vitest/browser-playwright').catch(() => ({
      playwright: undefined,
    }));

    if (storybookTest) {
      config.test = {
        projects: [
          {
            extends: true,
            plugins: [
              storybookTest({
                configDir: path.join(rootDir, '.storybook'),
              }),
            ],
            test: {
              name: 'storybook',
              browser: {
                enabled: true,
                headless: true,
                provider: playwright ? playwright({}) : undefined,
                instances: [{ browser: 'chromium' }],
              },
              setupFiles: ['.storybook/vitest.setup.ts'],
            },
          },
        ],
      };
    }
  }

  return config;
}
