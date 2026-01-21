# @3asoftwares/utils

[![npm version](https://img.shields.io/npm/v/@3asoftwares/utils.svg)](https://www.npmjs.com/package/@3asoftwares/utils)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Shared utility functions for E-Storefront platform with client, server, and backend-specific exports.

## 🛠️ Tech Stack

| Technology      | Purpose             |
| --------------- | ------------------- |
| TypeScript 5.0+ | Type-safe utilities |
| tsup            | Build tool          |
| Vitest          | Testing             |

## 📦 Installation

```bash
# npm
npm install @3asoftwares/utils

# yarn
yarn add @3asoftwares/utils
```

## 📁 Project Structure

```
packages/utils/
├── src/
│   ├── index.ts         # Main exports
│   ├── client.ts        # Client-side utils
│   ├── server.ts        # Server-side utils
│   ├── backend.ts       # Backend-specific utils
│   ├── formatters.ts    # Formatting utilities
│   ├── validators.ts    # Validation utilities
│   └── config/          # Shared configs
├── dist/                # Build output
└── package.json
```

## 📋 Usage

### Main Import

```typescript
import { formatPrice, formatDate, slugify } from '@3asoftwares/utils';
```

### Client-Specific

```typescript
import { useDebounce, throttle, storage } from '@3asoftwares/utils/client';
```

### Server-Specific

```typescript
import { hashPassword, verifyToken, logger } from '@3asoftwares/utils/server';
```

### Backend-Specific

```typescript
import { dbConnect, cacheGet, cacheSet } from '@3asoftwares/utils/backend';
```

### Shared TSConfig

```json
{
  "extends": "@3asoftwares/utils/config/tsconfig.base.json"
}
```

## 🔧 Available Utilities

### Formatters

| Function                        | Description       |
| ------------------------------- | ----------------- |
| `formatPrice(amount, currency)` | Format currency   |
| `formatDate(date, format)`      | Format dates      |
| `slugify(text)`                 | Generate URL slug |
| `truncate(text, length)`        | Truncate text     |

### Validators

| Function         | Description    |
| ---------------- | -------------- |
| `isEmail(value)` | Validate email |
| `isPhone(value)` | Validate phone |
| `isUrl(value)`   | Validate URL   |

### Helpers

| Function          | Description        |
| ----------------- | ------------------ |
| `generateId()`    | Generate unique ID |
| `omit(obj, keys)` | Omit object keys   |
| `pick(obj, keys)` | Pick object keys   |

## 💻 Scripts

| Command              | Description         |
| -------------------- | ------------------- |
| `yarn build`         | Build with tsup     |
| `yarn build:backend` | Build backend utils |
| `yarn test`          | Run tests           |
| `yarn test:coverage` | Run with coverage   |

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
cd packages/utils

# 2. Build package (client + backend)
yarn build
yarn build:backend

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

- [ ] All exports work (client/server/backend)
- [ ] TypeScript compiles without errors
- [ ] All tests pass
- [ ] Coverage maintained (≥80%)
- [ ] Version bumped if needed
- [ ] CHANGELOG updated

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/utils-new-helper`
3. Add utility with tests
4. Run validation: `yarn build && yarn test`
5. Commit with conventional format: `git commit -m "feat(utils): add formatPhone helper"`
6. Push and create PR

See [CONTRIBUTING.md](../../docs/project/CONTRIBUTING.md) for full guidelines.

---

Part of the [E-Storefront Monorepo](../../README.md)
