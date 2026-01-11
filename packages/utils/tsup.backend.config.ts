import { defineConfig } from 'tsup';

// Backend-only build - excludes frontend config files that depend on ui-library
export default defineConfig([
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
]);
