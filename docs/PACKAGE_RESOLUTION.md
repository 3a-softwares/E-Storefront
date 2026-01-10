# Package Resolution Configuration Guide

## Overview

This guide explains how the E-Commerce platform handles package imports differently for **local development** and **production**:

- **LOCAL**: Imports from source packages in `/packages` and `/services`
- **PRODUCTION**: Imports pre-built packages from `node_modules`

---

## 📋 Configuration Files

### `.env.docker` (Local Development)
```dotenv
NODE_ENV=development
PACKAGE_MODE=local
RESOLVE_FROM_SOURCE=true
NODE_PATH=./packages:./services
```

**What this does:**
- Imports source files directly from package source directories
- Hot-reload enabled for development
- No build step required for shared packages
- Changes to packages are immediately reflected

### `.env.production` (Production)
```dotenv
NODE_ENV=production
PACKAGE_MODE=production
RESOLVE_FROM_SOURCE=false
```

**What this does:**
- Imports pre-built modules from `node_modules`
- Uses compiled/optimized versions
- Faster startup and smaller bundle size
- Requires pre-built packages in node_modules

---

## 🗂️ Package Resolution Paths

### Local Development (RESOLVE_FROM_SOURCE=true)

```
Imports:
  @3asoftwares/utils    → ./packages/utils/src
  @3asoftwares/types    → ./packages/types/src
  @3asoftwares/ui       → ./packages/ui-library/src
  @3asoftwares/utils/server → ./packages/utils/src/server.ts
```

### Production (RESOLVE_FROM_SOURCE=false)

```
Imports:
  @3asoftwares/utils    → node_modules/@3asoftwares/utils (dist)
  @3asoftwares/types    → node_modules/@3asoftwares/types (dist)
  @3asoftwares/ui       → node_modules/@3asoftwares/ui (dist)
  @3asoftwares/utils/server → node_modules/@3asoftwares/utils/server
```

---

## ⚙️ How to Use in Your Code

### In TypeScript Files

```typescript
// This import works the same in both local and production
import { someUtil } from '@3asoftwares/utils';
import type { SomeType } from '@3asoftwares/types';
import { Button } from '@3asoftwares/ui';

// Server-side utilities (local: src/server.ts, prod: dist/server.js)
import { serverHelper } from '@3asoftwares/utils/server';
```

### In Configuration Files

Use the `config/package-resolution.js` file:

```javascript
const { aliasConfig, resolveFromSource } = require('./config/package-resolution.js');

// Use in webpack/vite/etc
module.exports = {
  resolve: {
    alias: aliasConfig
  }
};
```

---

## 🔧 Build Tool Integration

### Webpack

```javascript
// webpack.config.js
const { aliasConfig } = require('./config/package-resolution.js');

module.exports = {
  resolve: {
    alias: aliasConfig,
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
};
```

### Vite

```typescript
// vite.config.ts
import { aliasConfig } from './config/package-resolution.js';

export default {
  resolve: {
    alias: aliasConfig,
  },
};
```

### TypeScript (tsconfig.json)

The tsconfig.json handles path mapping automatically based on NODE_ENV.

For custom resolution:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@3asoftwares/utils": ["packages/utils/src"],
      "@3asoftwares/utils/*": ["packages/utils/src/*"],
      "@3asoftwares/types": ["packages/types/src"],
      "@3asoftwares/types/*": ["packages/types/src/*"],
      "@3asoftwares/ui": ["packages/ui-library/src"],
      "@3asoftwares/ui/*": ["packages/ui-library/src/*"]
    }
  }
}
```

---

## 🚀 Running with Different Modes

### Local Development (Source Packages)

```bash
# Set environment
cp .env.docker .env.local

# Start services
docker-compose -f docker-compose.yml up -d

# Or without Docker
NODE_ENV=development RESOLVE_FROM_SOURCE=true yarn dev:all
```

**Features:**
- ✅ Hot-reload on package changes
- ✅ Direct source debugging
- ✅ No build step needed
- ✅ Immediate feedback

### Production (Pre-built Packages)

```bash
# Set environment
cp .env.production .env

# Build packages first
yarn build:package

# Start services
docker-compose -f docker-compose.production.yml up -d

# Or without Docker
NODE_ENV=production RESOLVE_FROM_SOURCE=false yarn start:all
```

**Features:**
- ✅ Optimized bundle sizes
- ✅ Faster startup time
- ✅ Pre-compiled code
- ✅ Production-ready

---

## 📦 Package Build Scripts

### Building Packages (Required for Production)

```bash
# Build all packages
yarn build:package

# Build specific package
yarn build:utils
yarn build:types
yarn build:storybook

# Build and watch (for development)
yarn dev:package
```

### Package Locations

```
packages/
├── utils/
│   ├── src/          ← Source files (local development)
│   ├── dist/         ← Built files (production)
│   └── package.json
├── types/
│   ├── src/          ← Source files (local development)
│   ├── dist/         ← Built files (production)
│   └── package.json
└── ui-library/
    ├── src/          ← Source files (local development)
    ├── dist/         ← Built files (production)
    └── package.json
```

---

## 🔄 Workflow

### Development Workflow

1. **Setup**
   ```bash
   cp .env.docker .env.local
   yarn install
   ```

2. **Modify package source**
   ```bash
   # Edit files in packages/utils/src, etc.
   # Changes auto-reload in running services
   ```

3. **Test changes**
   ```bash
   docker-compose logs -f
   # Changes are reflected immediately
   ```

### Production Workflow

1. **Build packages**
   ```bash
   yarn build:package
   ```

2. **Setup environment**
   ```bash
   cp .env.production .env
   ```

3. **Deploy**
   ```bash
   docker-compose -f docker-compose.production.yml up -d
   ```

---

## 🆘 Troubleshooting

### Local Development - Import Not Found

**Problem:** `Cannot find module '@3asoftwares/utils'`

**Solution:**
```bash
# Verify environment
echo $RESOLVE_FROM_SOURCE  # Should be "true"
echo $PACKAGE_MODE         # Should be "local"

# Check package exists
ls -la packages/utils/src

# Restart services
docker-compose down
docker-compose up -d
```

### Production - Import Fails

**Problem:** `Cannot find module '@3asoftwares/utils'`

**Solution:**
```bash
# Build packages first
yarn build:package

# Verify built files exist
ls -la packages/utils/dist
ls -la packages/types/dist
ls -la packages/ui-library/dist

# Deploy
docker-compose -f docker-compose.production.yml up -d
```

### Wrong Resolution Mode

**Problem:** Production environment using source files or vice versa

**Solution:**
```bash
# Check environment variables
docker-compose exec app env | grep -E "PACKAGE_MODE|RESOLVE_FROM_SOURCE|NODE_ENV"

# Should show:
# NODE_ENV=production
# PACKAGE_MODE=production
# RESOLVE_FROM_SOURCE=false

# Update .env file and restart
docker-compose down
docker-compose up -d
```

---

## 📊 Comparison

| Aspect | Local Development | Production |
|--------|------------------|-----------|
| Import Source | Source files | Built modules |
| Location | `/packages/*/src` | `node_modules/*/dist` |
| Hot Reload | Yes | No |
| Build Step | Not needed | Required |
| Performance | Debug-optimized | Optimized |
| Bundle Size | Larger (debug info) | Smaller |
| Startup Time | Slower (dev mode) | Faster |
| Changes | Immediate | Requires rebuild |

---

## 🎯 Best Practices

1. **Always use the correct environment**
   - Local: `RESOLVE_FROM_SOURCE=true`
   - Production: `RESOLVE_FROM_SOURCE=false`

2. **Build before production deployment**
   ```bash
   yarn build:package
   yarn build:all
   ```

3. **Don't commit built files**
   - Add `packages/*/dist` to `.gitignore`
   - Build in CI/CD pipeline

4. **Test both modes locally**
   ```bash
   # Test production mode locally
   NODE_ENV=production RESOLVE_FROM_SOURCE=false yarn dev:all
   ```

5. **Use separate .env files**
   - `.env.docker` for local
   - `.env.production` for production
   - Don't mix configurations

---

## 📚 Related Files

- `config/package-resolution.js` - Resolution configuration
- `.env.docker` - Local environment
- `.env.production` - Production environment
- `package.json` - Package scripts

---

**Last Updated:** January 10, 2026  
**Version:** 1.0.0
