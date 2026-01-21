# @3asoftwares/types

[![npm version](https://img.shields.io/npm/v/@3asoftwares/types.svg)](https://www.npmjs.com/package/@3asoftwares/types)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Shared TypeScript type definitions for E-Storefront platform.

## 🛠️ Tech Stack

| Technology      | Purpose          |
| --------------- | ---------------- |
| TypeScript 5.0+ | Type definitions |
| tsup            | Build tool       |
| Vitest          | Testing          |

## 📦 Installation

```bash
# npm
npm install @3asoftwares/types

# yarn
yarn add @3asoftwares/types
```

## 📁 Project Structure

```
packages/types/
├── src/
│   ├── index.ts         # Main exports
│   ├── user.ts          # User types
│   ├── product.ts       # Product types
│   ├── order.ts         # Order types
│   ├── category.ts      # Category types
│   ├── coupon.ts        # Coupon types
│   └── common.ts        # Common types
├── dist/                # Build output
└── package.json
```

## 📋 Available Types

### User Types

```typescript
import { User, UserRole, AuthPayload } from '@3asoftwares/types';
```

### Product Types

```typescript
import { Product, ProductInput, ProductFilter } from '@3asoftwares/types';
```

### Order Types

```typescript
import { Order, OrderStatus, OrderItem } from '@3asoftwares/types';
```

### Category Types

```typescript
import { Category, CategoryTree } from '@3asoftwares/types';
```

### Common Types

```typescript
import { ApiResponse, PaginatedResult, ErrorResponse } from '@3asoftwares/types';
```

## 💻 Scripts

| Command              | Description       |
| -------------------- | ----------------- |
| `yarn build`         | Build with tsup   |
| `yarn test`          | Run tests         |
| `yarn test:coverage` | Run with coverage |

## 📤 Publishing

```bash
# Bump version
npm version patch|minor|major

# Publish to npm
npm publish --access public
```

## 🔄 PR Workflow

### Before Creating a PR

```bash
# 1. Navigate to package
cd packages/types

# 2. Build package
yarn build

# 3. Run tests
yarn test

# 4. Run with coverage
yarn test:coverage
```

### From Monorepo Root

```bash
# Build all packages
yarn build:packages

# Run all tests
yarn test:all

# One-liner validation
yarn build:packages && yarn test:all && echo "✅ Ready for PR!"
```

### PR Checklist

- [ ] Types compile without errors
- [ ] All tests pass
- [ ] Coverage maintained (≥80%)
- [ ] Version bumped if needed
- [ ] CHANGELOG updated

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/types-new-type`
3. Make changes and add tests
4. Run validation: `yarn build && yarn test`
5. Commit with conventional format: `git commit -m "feat(types): add new type"`
6. Push and create PR

See [CONTRIBUTING.md](../../docs/project/CONTRIBUTING.md) for full guidelines.

---

Part of the [E-Storefront Monorepo](../../README.md)
