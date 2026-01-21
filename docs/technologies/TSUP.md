# tsup

## Overview

**Version:** 8.x  
**Website:** [https://tsup.egoist.dev](https://tsup.egoist.dev)  
**Category:** TypeScript Build Tool

tsup is a zero-config TypeScript bundler powered by esbuild, designed for building TypeScript libraries with minimal configuration.

---

## Why tsup?

### Benefits

| Benefit               | Description                                      |
| --------------------- | ------------------------------------------------ |
| **Zero Config**       | Works out of the box for TypeScript projects     |
| **Blazing Fast**      | Powered by esbuild (10-100x faster than webpack) |
| **Multiple Formats**  | Outputs CJS, ESM, and IIFE in one command        |
| **Type Declarations** | Generates .d.ts files automatically              |
| **Tree Shaking**      | Removes unused code for smaller bundles          |
| **Watch Mode**        | Fast rebuilds during development                 |

### Why We Chose tsup

1. **Package Development** - Perfect for building our shared npm packages
2. **Speed** - Significantly faster than alternatives
3. **Simplicity** - Minimal configuration needed
4. **Dual Formats** - Outputs both CommonJS and ES Modules
5. **TypeScript First** - Native TypeScript support with declarations

---

## How to Use tsup

### Installation

```bash
npm install tsup -D
```

### Basic Configuration

```typescript
// tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  minify: false,
  splitting: false,
});
```

### Package.json Configuration

```json
{
  "name": "@3asoftwares/types",
  "version": "1.0.6",
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch"
  }
}
```

---

## Package Configurations

### Types Package

```typescript
// packages/types/tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  outDir: 'dist',
});
```

### Utils Package (Multiple Entry Points)

```typescript
// packages/utils/tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    client: 'src/client.ts',
    server: 'src/server.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  splitting: true,
  treeshake: true,
});
```

### Utils Backend Config

```typescript
// packages/utils/tsup.backend.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/backend.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: false, // Don't clean to preserve other outputs
  outDir: 'dist',
  external: ['mongoose', 'redis', 'ioredis'],
});
```

---

## How tsup Helps Our Project

### Package Build Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│                    tsup Build Pipeline                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Source Files                    Output                      │
│  ┌─────────────────┐            ┌─────────────────┐         │
│  │ src/            │            │ dist/           │         │
│  │   index.ts      │   tsup     │   index.js      │ (CJS)   │
│  │   user.ts       │  ──────▶   │   index.mjs     │ (ESM)   │
│  │   product.ts    │            │   index.d.ts    │ (Types) │
│  │   order.ts      │            │                 │         │
│  └─────────────────┘            └─────────────────┘         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Scripts

```json
{
  "scripts": {
    "build": "tsup",
    "build:watch": "tsup --watch",
    "prepublishOnly": "npm run build"
  }
}
```

### Output Structure

```
dist/
├── index.js       # CommonJS (for require())
├── index.mjs      # ES Module (for import)
├── index.d.ts     # TypeScript declarations
├── client.js
├── client.mjs
├── client.d.ts
├── server.js
├── server.mjs
└── server.d.ts
```

---

## Configuration Options

### Common Options

```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  // Entry points
  entry: ['src/index.ts'],
  // or multiple entries
  entry: {
    index: 'src/index.ts',
    utils: 'src/utils.ts',
  },

  // Output formats
  format: ['cjs', 'esm', 'iife'],

  // Generate .d.ts files
  dts: true,

  // Clean dist folder before build
  clean: true,

  // Generate sourcemaps
  sourcemap: true,

  // Minify output
  minify: false, // or 'terser'

  // Code splitting for ESM
  splitting: true,

  // Tree shaking
  treeshake: true,

  // External dependencies (not bundled)
  external: ['react', 'react-dom'],

  // Output directory
  outDir: 'dist',

  // Target environment
  target: 'node18',

  // Banner/Footer
  banner: {
    js: '/* @3asoftwares/utils */',
  },
});
```

### Watch Mode

```bash
# Watch for changes
tsup --watch

# Watch specific files
tsup src/index.ts --watch src
```

### CLI Usage

```bash
# Basic build
tsup src/index.ts

# With options
tsup src/index.ts --format cjs,esm --dts --clean

# Minified production build
tsup src/index.ts --minify
```

---

## Best Practices

### Package Exports

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    },
    "./client": {
      "types": "./dist/client.d.ts",
      "import": "./dist/client.mjs",
      "require": "./dist/client.js"
    }
  }
}
```

### External Dependencies

```typescript
// Don't bundle peer dependencies
export default defineConfig({
  external: ['react', 'react-dom'],
  // For Node.js packages
  external: ['mongoose', 'express', 'redis'],
});
```

### Conditional Builds

```typescript
export default defineConfig(({ watch }) => ({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: !watch, // Don't clean in watch mode
  minify: !watch, // Only minify for production
  sourcemap: watch, // Sourcemaps in dev only
}));
```

---

## Related Documentation

- [TYPESCRIPT.md](TYPESCRIPT.md) - TypeScript configuration
- [NODEJS.md](NODEJS.md) - Node.js runtime
