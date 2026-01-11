import { defineConfig } from 'tsup';

// Backend-only build - excludes:
// - Frontend config files that depend on ui-library
// - Client-side API code that requires axios
export default defineConfig([
  {
    entry: {
      index: 'src/backend.ts', // Uses backend.ts instead of index.ts to avoid axios
      server: 'src/validation/server.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    splitting: false,
    external: ['express', 'express-validator', '@3asoftwares/types'],
  },
]);
