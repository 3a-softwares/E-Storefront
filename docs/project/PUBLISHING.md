# Package Publishing Guide

## 📑 Table of Contents

- [Overview](#overview)
- [Packages](#packages)
- [Publishing Workflow](#publishing-workflow)
- [Manual Publishing](#manual-publishing)
- [Versioning Strategy](#versioning-strategy)
- [Troubleshooting](#troubleshooting)

## 🌐 Overview

E-Storefront publishes three npm packages under the `@3asoftwares` scope:

| Package              | npm                                                                                                         | Description                 |
| -------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------- |
| `@3asoftwares/types` | [![npm](https://img.shields.io/npm/v/@3asoftwares/types)](https://www.npmjs.com/package/@3asoftwares/types) | TypeScript type definitions |
| `@3asoftwares/utils` | [![npm](https://img.shields.io/npm/v/@3asoftwares/utils)](https://www.npmjs.com/package/@3asoftwares/utils) | Utility functions           |
| `@3asoftwares/ui`    | [![npm](https://img.shields.io/npm/v/@3asoftwares/ui)](https://www.npmjs.com/package/@3asoftwares/ui)       | React UI component library  |

## 📦 Packages

### @3asoftwares/types

Shared TypeScript type definitions for the entire platform.

```bash
# Install
npm install @3asoftwares/types

# Usage
import { User, Product, Order } from '@3asoftwares/types';
```

**Location:** `packages/types/`

**Exports:**

- User types (User, UserRole, AuthTokens)
- Product types (Product, ProductVariant, Category)
- Order types (Order, OrderItem, OrderStatus)
- Common types (Pagination, ApiResponse, GraphQLContext)

---

### @3asoftwares/utils

Utility functions for client and server-side usage.

```bash
# Install
npm install @3asoftwares/utils

# Client-side usage
import { formatPrice, formatDate } from '@3asoftwares/utils/client';

# Server-side usage
import { validateEmail, hashPassword } from '@3asoftwares/utils/server';

# Backend utilities
import { createLogger, errorHandler } from '@3asoftwares/utils/backend';
```

**Location:** `packages/utils/`

**Exports:**

- `/client` - Browser-safe utilities (formatting, validation)
- `/server` - Node.js utilities (hashing, encryption)
- `/backend` - Express middleware, logging

---

### @3asoftwares/ui

React UI component library built with Tailwind CSS and DaisyUI.

```bash
# Install
npm install @3asoftwares/ui

# Import components
import { Button, Input, Modal, ProductCard } from '@3asoftwares/ui';

# Import styles (required)
import '@3asoftwares/ui/styles.css';
```

**Location:** `packages/ui-library/`

**Components:**

- Form components (Button, Input, Select, Checkbox)
- Layout components (Container, Grid, Card)
- E-commerce components (ProductCard, CartItem, PriceTag)
- Feedback components (Modal, Toast, Alert)

**Storybook:** Run `yarn storybook` in `packages/ui-library/`

---

## 🔄 Publishing Workflow

### Automatic Publishing (CI/CD)

Packages are automatically published when:

1. CI pipeline passes on `main` branch
2. Changes detected in package source files

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Push to main  │────▶│   CI Pipeline   │────▶│ Detect Changes  │
└─────────────────┘     │   (passes)      │     └────────┬────────┘
                        └─────────────────┘              │
                                                         ▼
                                              ┌─────────────────────┐
                                              │  Changed Packages?  │
                                              └──────────┬──────────┘
                                                         │
                              ┌───────────────┬──────────┼──────────┐
                              │               │          │          │
                              ▼               ▼          ▼          ▼
                        ┌──────────┐   ┌──────────┐ ┌──────────┐   │
                        │  types   │   │  utils   │ │    ui    │   │
                        └────┬─────┘   └────┬─────┘ └────┬─────┘   │
                             │              │            │         │
                             ▼              ▼            ▼         ▼
                        ┌─────────────────────────────────────┐   No
                        │        Version Bump (patch)         │ Changes
                        │              Build                  │    │
                        │         Publish to npm              │    │
                        └─────────────────────────────────────┘    │
                                         │                         │
                                         ▼                         ▼
                                  ┌─────────────┐           ┌─────────┐
                                  │  Published  │           │  Skip   │
                                  └─────────────┘           └─────────┘
```

### Change Detection

The workflow monitors these paths:

| Package | Watched Paths                                                    |
| ------- | ---------------------------------------------------------------- |
| types   | `packages/types/src/**`, `packages/types/package.json`           |
| utils   | `packages/utils/src/**`, `packages/utils/package.json`           |
| ui      | `packages/ui-library/src/**`, `packages/ui-library/package.json` |

---

## 🖐️ Manual Publishing

### Via GitHub Actions (Recommended)

1. Go to **Actions** → **Publish Packages (NPM)**
2. Click **Run workflow**
3. Select options:

| Option       | Values                                | Description                 |
| ------------ | ------------------------------------- | --------------------------- |
| Package      | `auto`, `all`, `types`, `utils`, `ui` | Which package(s) to publish |
| Version bump | `patch`, `minor`, `major`             | Semantic version increment  |
| Dry run      | `true/false`                          | Test without publishing     |

### Via Command Line

```bash
# 1. Navigate to package directory
cd packages/types  # or utils, ui-library

# 2. Ensure you're logged in to npm
npm login

# 3. Verify npm scope access
npm whoami
npm access ls-packages @3asoftwares

# 4. Build the package
npm run build

# 5. Bump version
npm version patch  # or minor, major

# 6. Publish
npm publish --access public

# 7. Push version bump commit
git push && git push --tags
```

### Publishing All Packages

```bash
# From root directory
yarn publish:packages

# Or individually
yarn workspace @3asoftwares/types publish
yarn workspace @3asoftwares/utils publish
yarn workspace @3asoftwares/ui publish
```

---

## 📊 Versioning Strategy

### Semantic Versioning

We follow [Semantic Versioning](https://semver.org/):

| Change Type     | Version Bump | Example       | When to Use                    |
| --------------- | ------------ | ------------- | ------------------------------ |
| Bug fix         | `patch`      | 1.0.0 → 1.0.1 | Backwards-compatible fixes     |
| New feature     | `minor`      | 1.0.0 → 1.1.0 | Backwards-compatible additions |
| Breaking change | `major`      | 1.0.0 → 2.0.0 | API changes, removals          |

### Version Examples

```bash
# Patch: Bug fix in formatPrice function
npm version patch  # 1.0.4 → 1.0.5

# Minor: Add new useDebounce hook
npm version minor  # 1.0.5 → 1.1.0

# Major: Change function signature
npm version major  # 1.1.0 → 2.0.0
```

### Pre-release Versions

```bash
# Beta release
npm version prerelease --preid=beta  # 1.0.0 → 1.0.1-beta.0

# Release candidate
npm version prerelease --preid=rc    # 1.0.0 → 1.0.1-rc.0

# Publish with tag
npm publish --tag beta
npm publish --tag next
```

---

## 🔐 NPM Authentication

### GitHub Actions (Automatic)

The `NPM_TOKEN` secret is configured in GitHub repository settings.

### Local Development

```bash
# Login to npm
npm login

# Verify authentication
npm whoami

# Check access to @3asoftwares scope
npm access ls-packages @3asoftwares
```

### Setting Up NPM Token

1. Generate token at https://www.npmjs.com/settings/tokens
2. Select **Automation** token type
3. Add to GitHub Secrets as `NPM_TOKEN`

---

## 🔍 Pre-Publish Checklist

Before publishing, ensure:

- [ ] All tests pass: `yarn test:packages`
- [ ] Build succeeds: `yarn build:packages`
- [ ] No lint errors: `yarn lint`
- [ ] CHANGELOG updated
- [ ] Version bumped appropriately
- [ ] README updated (if API changed)
- [ ] TypeScript types exported correctly

### Quick Validation

```bash
# Run full validation
cd packages/types  # or utils, ui-library

# Build
npm run build

# Test
npm test

# Check what will be published
npm pack --dry-run

# Verify exports
node -e "console.log(require('./dist/index.js'))"
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "You must be logged in to publish"

```bash
npm login
npm whoami  # Verify logged in
```

#### 2. "Cannot publish over existing version"

```bash
# Bump version first
npm version patch
```

#### 3. "Package name too similar to existing"

This shouldn't happen with scoped packages. Ensure using `@3asoftwares/` scope.

#### 4. "Missing required field: types"

```bash
# Rebuild to generate .d.ts files
npm run build
```

#### 5. Build fails with TypeScript errors

```bash
# Clear dist and rebuild
rm -rf dist
npm run build
```

### Verify Published Package

```bash
# Check npm registry
npm view @3asoftwares/types

# Check all versions
npm view @3asoftwares/types versions

# Test installation
npm pack @3asoftwares/types
```

---

## 📋 Package Dependencies

### Dependency Chain

```
@3asoftwares/types (no dependencies)
         ↓
@3asoftwares/utils (depends on types)
         ↓
@3asoftwares/ui (depends on utils, types)
```

### Publishing Order

When making cross-package changes:

1. **First:** Publish `@3asoftwares/types`
2. **Second:** Publish `@3asoftwares/utils`
3. **Last:** Publish `@3asoftwares/ui`

The CI workflow handles this automatically.

---

## 🔗 Related Documentation

- [CI-CD.md](./CI-CD.md) - Full CI/CD pipeline documentation
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Development workflow
- [TESTING.md](./TESTING.md) - Testing packages

---

© 2026 3A Softwares
