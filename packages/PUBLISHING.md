# Publishing Packages to NPM

This document describes how to publish the shared packages (`@3asoftwares/types`, `@3asoftwares/utils`, `@3asoftwares/ui-library`) to the npm registry.

## Package Overview

| Package                   | Version | Description                        | Dependencies                               |
| ------------------------- | ------- | ---------------------------------- | ------------------------------------------ |
| `@3asoftwares/types`      | 1.0.1   | TypeScript type definitions        | None                                       |
| `@3asoftwares/utils`      | 1.0.2   | Utility functions & shared configs | `@3asoftwares/types`                       |
| `@3asoftwares/ui-library` | 1.0.0   | React UI Component Library         | `@3asoftwares/utils`, `react`, `react-dom` |

## Prerequisites

### 1. NPM Account Setup

```bash
# Create an npm account at https://www.npmjs.com/signup

# Login to npm from terminal
npm login

# Verify login
npm whoami
```

### 2. Organization Setup

Since packages use the `@3asoftwares` scope, you need to either:

- **Option A**: Create an npm organization named `3asoftwares` at https://www.npmjs.com/org/create
- **Option B**: Change the package scope to your own organization/username

### 3. Enable 2FA (Recommended)

For security, enable Two-Factor Authentication on your npm account:

- Go to https://www.npmjs.com/settings/~/tfa
- Enable 2FA for publishing packages

---

## Publishing Order

**Important**: Packages must be published in dependency order:

1. **@3asoftwares/types** (no dependencies)
2. **@3asoftwares/utils** (depends on types)
3. **@3asoftwares/ui-library** (depends on utils)

---

## Step-by-Step Publishing Guide

### Step 1: Publish @3asoftwares/types

```powershell
# Navigate to types package
cd packages/types

# Run tests
npm test

# Build the package
npm run build

# Verify build output
dir dist

# Dry run to preview what will be published
npm publish --dry-run

# Publish to npm
npm publish --access public
```

### Step 2: Publish @3asoftwares/utils

```powershell
# Navigate to utils package
cd packages/utils

# Run tests
npm test

# Build the package (includes config files)
npm run build

# Verify build output
dir dist
dir dist/config

# Dry run to preview what will be published
npm publish --dry-run

# Publish to npm
npm publish --access public
```

### Step 3: Publish @3asoftwares/ui-library

```powershell
# Navigate to ui-library package
cd packages/ui-library

# Run tests
npm test

# Build the library
npm run build:lib

# Verify build output
dir dist

# Dry run to preview what will be published
npm publish --dry-run

# Publish to npm
npm publish --access public
```

---

## Version Management

### Semantic Versioning

Follow [SemVer](https://semver.org/) for version updates:

- **MAJOR** (1.0.0 → 2.0.0): Breaking changes
- **MINOR** (1.0.0 → 1.1.0): New features, backward compatible
- **PATCH** (1.0.0 → 1.0.1): Bug fixes, backward compatible

### Update Version

```powershell
# Patch version (bug fixes)
npm version patch

# Minor version (new features)
npm version minor

# Major version (breaking changes)
npm version major

# Specific version
npm version 1.2.3
```

### Synchronized Publishing Script

Create a script to publish all packages in order:

```powershell
# publish-all.ps1
$ErrorActionPreference = "Stop"

Write-Host "Publishing @3asoftwares packages..." -ForegroundColor Cyan

# Types
Write-Host "`n📦 Publishing @3asoftwares/types..." -ForegroundColor Yellow
Set-Location packages/types
npm run build
npm publish --access public
Set-Location ../..

# Utils
Write-Host "`n📦 Publishing @3asoftwares/utils..." -ForegroundColor Yellow
Set-Location packages/utils
npm run build
npm publish --access public
Set-Location ../..

# UI Library
Write-Host "`n📦 Publishing @3asoftwares/ui-library..." -ForegroundColor Yellow
Set-Location packages/ui-library
npm run build:lib
npm publish --access public
Set-Location ../..

Write-Host "`n✅ All packages published successfully!" -ForegroundColor Green
```

---

## Package Contents

### @3asoftwares/types

**Exports:**

- Type definitions for User, Product, Order, Category, etc.
- API response types
- Common interfaces

**Files included:**

```
dist/
├── index.js       # CommonJS build
├── index.mjs      # ESM build
└── index.d.ts     # Type definitions
```

### @3asoftwares/utils

**Exports:**
| Export Path | Description |
|------------|-------------|
| `@3asoftwares/utils` | Main utilities (formatters, helpers) |
| `@3asoftwares/utils/client` | Client-side validation schemas |
| `@3asoftwares/utils/server` | Server-side Express validators |
| `@3asoftwares/utils/config/vite` | Vite configuration factory |
| `@3asoftwares/utils/config/webpack` | Webpack configuration factory |
| `@3asoftwares/utils/config/tailwind` | Tailwind CSS configuration |
| `@3asoftwares/utils/config/vitest` | Vitest configuration |
| `@3asoftwares/utils/config/jest.backend` | Jest config for backend |
| `@3asoftwares/utils/config/jest.frontend` | Jest config for frontend |
| `@3asoftwares/utils/config/postcss` | PostCSS configuration |

**Files included:**

```
dist/
├── index.js, index.mjs, index.d.ts
├── client.js, client.mjs, client.d.ts
├── server.js, server.mjs, server.d.ts
└── config/
    ├── vite.config.js, vite.config.mjs
    ├── webpack.base.config.js, webpack.base.config.mjs
    ├── tailwind.config.js, tailwind.config.mjs
    └── vitest.base.config.js, vitest.base.config.mjs
src/
└── config/
    ├── jest.backend.config.js
    ├── jest.frontend.config.js
    ├── postcss.config.js
    └── tsconfig.base.json
```

### @3asoftwares/ui-library

**Exports:**

- React components (Button, Input, Modal, Table, etc.)
- CSS styles

**Files included:**

```
dist/
├── index.js       # CommonJS build
├── index.mjs      # ESM build
├── index.d.ts     # Type definitions
└── styles.css     # Compiled CSS styles
```

---

## Usage After Publishing

### Installing Packages

```bash
# Install types
npm install @3asoftwares/types

# Install utils
npm install @3asoftwares/utils

# Install ui-library
npm install @3asoftwares/ui-library
```

### Using in Code

```typescript
// Types
import { User, Product, Order } from '@3asoftwares/types';

// Utils
import { formatCurrency, formatDate } from '@3asoftwares/utils';
import { userSchema, productSchema } from '@3asoftwares/utils/client';
import { validateUser } from '@3asoftwares/utils/server';

// UI Library
import { Button, Input, Modal } from '@3asoftwares/ui-library';
import '@3asoftwares/ui-library/styles.css';

// Config files (in vite.config.ts)
import { createLibraryViteConfig } from '@3asoftwares/utils/config/vite';
```

---

## Troubleshooting

### Common Issues

#### 1. "npm ERR! 403 Forbidden"

- Ensure you're logged in: `npm whoami`
- Verify organization membership
- Check if package name is already taken

#### 2. "npm ERR! 402 Payment Required"

- Private packages require npm Pro/Teams
- Use `--access public` for public scoped packages

#### 3. "Version already exists"

- Increment version before publishing: `npm version patch`

#### 4. "Missing prepublishOnly script"

- Run build manually before publishing: `npm run build`

### Verify Published Package

```bash
# View package info
npm info @3asoftwares/types
npm info @3asoftwares/utils
npm info @3asoftwares/ui-library

# Check latest version
npm show @3asoftwares/types version
```

---

## CI/CD Publishing (GitHub Actions)

For automated publishing, create `.github/workflows/publish.yml`:

```yaml
name: Publish Packages

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'

      - name: Install dependencies
        run: npm ci

      - name: Publish @3asoftwares/types
        working-directory: packages/types
        run: |
          npm run build
          npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

      - name: Publish @3asoftwares/utils
        working-directory: packages/utils
        run: |
          npm run build
          npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

      - name: Publish @3asoftwares/ui-library
        working-directory: packages/ui-library
        run: |
          npm run build:lib
          npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### Setup NPM Token

1. Generate token at https://www.npmjs.com/settings/~/tokens
2. Add to GitHub repository secrets as `NPM_TOKEN`

---

## Checklist Before Publishing

- [ ] All tests pass (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] Version is incremented
- [ ] CHANGELOG is updated
- [ ] Dependencies are correct in package.json
- [ ] Files array in package.json includes all needed files
- [ ] Dry run looks correct (`npm publish --dry-run`)

---

## Quick Reference

```powershell
# Login
npm login

# Build all packages
npm run build --workspaces

# Publish single package
cd packages/types && npm publish --access public

# Bump versions across all packages
npm version patch --workspaces

# View what will be published
npm pack --dry-run
```
