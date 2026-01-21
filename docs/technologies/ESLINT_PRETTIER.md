# ESLint & Prettier

## Overview

**ESLint Version:** 8.x  
**Prettier Version:** 3.2.0  
**Category:** Code Quality Tools

ESLint is a static code analysis tool for identifying problematic patterns in JavaScript/TypeScript. Prettier is an opinionated code formatter that ensures consistent code style.

---

## Why ESLint & Prettier?

### ESLint Benefits

| Benefit                | Description                   |
| ---------------------- | ----------------------------- |
| **Error Prevention**   | Catch bugs before they happen |
| **Code Quality**       | Enforce best practices        |
| **Consistency**        | Team-wide coding standards    |
| **Customizable**       | Extensive rule configuration  |
| **TypeScript Support** | Full TS integration           |
| **Auto-fix**           | Automatically fix many issues |

### Prettier Benefits

| Benefit                   | Description                       |
| ------------------------- | --------------------------------- |
| **Consistent Formatting** | Same style across entire codebase |
| **No Debates**            | Ends formatting discussions       |
| **Save Time**             | Auto-format on save               |
| **Multi-language**        | JS, TS, CSS, JSON, Markdown       |
| **IDE Integration**       | Works with all major editors      |

### Why We Use Both

- **ESLint** → Code quality and error detection
- **Prettier** → Code formatting and style
- **Together** → Clean, consistent, bug-free code

---

## How to Use ESLint

### Configuration

```javascript
// eslint.config.mjs
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
  {
    rules: {
      // React rules
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // TypeScript rules
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',

      // General rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
];

export default eslintConfig;
```

### Running ESLint

```bash
# Lint specific directories
npm run lint

# Lint with auto-fix
npm run lint:fix

# Lint for CI (max warnings limit)
npm run lint:ci

# Lint specific files
npx eslint app/page.tsx

# Check specific rule
npx eslint --rule 'no-console: error' app/
```

### Common ESLint Rules

```javascript
rules: {
  // ===== Errors (will fail build) =====

  // Prevent unused variables (except _prefixed)
  "@typescript-eslint/no-unused-vars": ["error", {
    argsIgnorePattern: "^_",
    varsIgnorePattern: "^_"
  }],

  // Enforce hooks rules
  "react-hooks/rules-of-hooks": "error",

  // No var, use const/let
  "no-var": "error",
  "prefer-const": "error",

  // ===== Warnings (won't fail build) =====

  // Warn about any type
  "@typescript-eslint/no-explicit-any": "warn",

  // Warn about missing dependencies
  "react-hooks/exhaustive-deps": "warn",

  // Warn about console logs
  "no-console": ["warn", { allow: ["warn", "error"] }],

  // ===== Off (disabled) =====

  // Not needed in Next.js
  "react/react-in-jsx-scope": "off",

  // TypeScript handles this
  "react/prop-types": "off",
}
```

### Ignoring Files

```javascript
// eslint.config.mjs
const eslintConfig = [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'coverage/**',
      'public/**',
      '*.config.js',
      '*.config.mjs',
    ],
  },
  // ... other config
];
```

---

## How to Use Prettier

### Configuration

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### Ignoring Files

```gitignore
# .prettierignore
node_modules
.next
coverage
public
*.min.js
package-lock.json
yarn.lock
pnpm-lock.yaml
```

### Running Prettier

```bash
# Format all files
npm run format

# Check formatting (CI)
npm run format:check

# Format specific files
npx prettier --write "app/**/*.tsx"

# Check single file
npx prettier --check app/page.tsx
```

### Prettier Options Explained

```json
{
  // Add semicolons at end of statements
  "semi": true,

  // Use single quotes instead of double
  "singleQuote": true,

  // 2 spaces for indentation
  "tabWidth": 2,

  // Trailing commas where valid in ES5
  "trailingComma": "es5",

  // Line width before wrapping
  "printWidth": 100,

  // Spaces inside { object brackets }
  "bracketSpacing": true,

  // Always wrap arrow function params: (x) => x
  "arrowParens": "always",

  // Unix line endings
  "endOfLine": "lf"
}
```

---

## ESLint + Prettier Integration

### Configuration

```javascript
// eslint.config.mjs
// Include "prettier" in extends to disable conflicting rules
const eslintConfig = [
  ...compat.extends(
    'next/core-web-vitals',
    'next/typescript',
    'prettier' // Must be last to override other configs
  ),
];
```

### How They Work Together

```
┌─────────────────┐     ┌─────────────────┐
│     ESLint      │     │    Prettier     │
│   Code Quality  │     │   Formatting    │
├─────────────────┤     ├─────────────────┤
│ • Unused vars   │     │ • Indentation   │
│ • Missing deps  │     │ • Quotes        │
│ • Type errors   │     │ • Line length   │
│ • Bad patterns  │     │ • Trailing commas│
│ • React rules   │     │ • Spacing       │
└─────────────────┘     └─────────────────┘
         │                       │
         └───────────┬───────────┘
                     │
              ┌──────▼──────┐
              │ Clean Code  │
              └─────────────┘
```

---

## How These Tools Help Our Project

### 1. Consistent Codebase

```typescript
// Before Prettier - inconsistent style
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// After Prettier - consistent style
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

### 2. Catch Bugs Early

```typescript
// ESLint catches unused variables
const [data, setData] = useState([]); // 'data' is assigned but never used

// ESLint catches missing dependencies
useEffect(() => {
  fetchData(userId); // React Hook useEffect has a missing dependency: 'userId'
}, []);

// ESLint catches bad patterns
const result = await fetch(url);
console.log(result); // Unexpected console statement
```

### 3. TypeScript Quality

```typescript
// ESLint warns about 'any'
function processData(data: any) {
  // Avoid using 'any'
  return data.map((item) => item.value);
}

// Better with proper typing
function processData(data: DataItem[]) {
  return data.map((item) => item.value);
}
```

### 4. React Best Practices

```typescript
// ESLint enforces hooks rules
function Component() {
  // ❌ Error: Hook inside condition
  if (condition) {
    const [state, setState] = useState(false);
  }

  // ✅ Correct: Hook at top level
  const [state, setState] = useState(false);
}
```

### 5. Tailwind Class Sorting

```tsx
// Before (Prettier + Tailwind plugin)
<div className="text-white p-4 flex bg-blue-500 items-center justify-between">

// After - classes sorted consistently
<div className="flex items-center justify-between bg-blue-500 p-4 text-white">
```

---

## VS Code Integration

### Settings

```json
// .vscode/settings.json
{
  // Format on save
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",

  // ESLint auto-fix on save
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },

  // File-specific formatters
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },

  // ESLint validation
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"]
}
```

### Recommended Extensions

```json
// .vscode/extensions.json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss"
  ]
}
```

---

## CI/CD Integration

```yaml
# .github/workflows/lint.yml
name: Lint

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci

      # Check formatting
      - name: Check Prettier
        run: npm run format:check

      # Run linting
      - name: Run ESLint
        run: npm run lint:ci
```

---

## Common Commands

| Command                | Description                  |
| ---------------------- | ---------------------------- |
| `npm run lint`         | Run ESLint                   |
| `npm run lint:fix`     | ESLint with auto-fix         |
| `npm run lint:ci`      | ESLint for CI (max warnings) |
| `npm run format`       | Format with Prettier         |
| `npm run format:check` | Check formatting             |

---

## Best Practices

### 1. Run Before Commit

```json
// package.json - with husky
{
  "scripts": {
    "pre-commit": "npm run lint:fix && npm run format"
  }
}
```

### 2. Fix Errors, Don't Disable

```typescript
// ❌ Bad - disabling rule
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data: any = response;

// ✅ Good - fix the issue
const data: ApiResponse = response;
```

### 3. Document Exceptions

```typescript
// When you must disable a rule, explain why
// eslint-disable-next-line no-console -- Debug logging for production monitoring
console.log('Payment processed:', paymentId);
```

---

## Resources

- [ESLint Documentation](https://eslint.org/docs/latest/)
- [Prettier Documentation](https://prettier.io/docs/en/)
- [Next.js ESLint](https://nextjs.org/docs/app/building-your-application/configuring/eslint)
- [TypeScript ESLint](https://typescript-eslint.io/)
