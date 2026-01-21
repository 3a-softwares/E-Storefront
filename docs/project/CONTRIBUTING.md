# Contributing to E-Storefront

Thank you for your interest in contributing to E-Storefront! This document provides guidelines and instructions for contributing.

## 📑 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [PR Checklist](#pr-checklist)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Branch Naming](#branch-naming)

## 📜 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## 🚀 Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/E-Storefront.git
   cd E-Storefront
   ```
3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/3asoftwares/E-Storefront.git
   ```
4. **Install dependencies**
   ```bash
   yarn install
   ```

## 🔄 Development Workflow

### Before Starting Work

```bash
# 1. Sync with upstream
git fetch upstream
git checkout main
git merge upstream/main

# 2. Create feature branch
git checkout -b feature/your-feature-name

# 3. Start development servers
yarn dev:all
```

### Before Creating PR - Checklist

Run these commands in order before creating a PR:

```bash
# Step 1: Format code
yarn format

# Step 2: Fix lint issues
yarn lint:fix:frontend

# Step 3: Run linter (must pass)
yarn lint:frontend

# Step 4: Run type check
yarn build:packages

# Step 5: Run all tests
yarn test:all

# Step 6: Run tests with coverage (optional but recommended)
yarn test:coverage:all
```

### Quick PR Prep Script

```bash
# One-liner to validate before PR
yarn lint:frontend && yarn test:all && echo "✅ Ready for PR!"
```

## ✅ PR Checklist

Before submitting a Pull Request, ensure:

### Code Quality

- [ ] Code follows project coding standards
- [ ] No ESLint errors (`yarn lint:frontend`)
- [ ] TypeScript compiles without errors
- [ ] Code is properly formatted

### Testing

- [ ] All existing tests pass (`yarn test:all`)
- [ ] New tests added for new features
- [ ] Test coverage maintained (≥80%)

### Documentation

- [ ] README updated if needed
- [ ] JSDoc comments added for public APIs
- [ ] CHANGELOG.md updated

### PR Requirements

- [ ] PR title follows conventional commits
- [ ] PR description explains changes
- [ ] Related issues linked
- [ ] Screenshots added (for UI changes)

## 📝 Coding Standards

### TypeScript

```typescript
// ✅ Good - Use explicit types
interface UserData {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): Promise<UserData> {
  // ...
}

// ❌ Bad - Avoid any
function getUser(id: any): any {
  // ...
}
```

### React Components

```tsx
// ✅ Good - Functional components with proper types
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ label, onClick, variant = 'primary' }) => {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {label}
    </button>
  );
};
```

### File Naming

| Type       | Convention           | Example                |
| ---------- | -------------------- | ---------------------- |
| Components | PascalCase           | `ProductCard.tsx`      |
| Hooks      | camelCase with 'use' | `useAuth.ts`           |
| Utils      | camelCase            | `formatPrice.ts`       |
| Types      | PascalCase           | `UserTypes.ts`         |
| Tests      | Same name + .test    | `ProductCard.test.tsx` |

### Folder Structure (Frontend)

```
src/
├── components/        # Reusable UI components
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   └── index.ts
├── hooks/            # Custom React hooks
├── pages/            # Page components
├── store/            # State management
├── utils/            # Utility functions
└── types/            # TypeScript types
```

### Folder Structure (Backend Service)

```
src/
├── controllers/      # Request handlers
├── models/          # Database models
├── routes/          # API routes
├── middleware/      # Express middleware
├── services/        # Business logic
├── utils/           # Utility functions
├── types/           # TypeScript types
└── __tests__/       # Test files
```

## 📋 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type       | Description             |
| ---------- | ----------------------- |
| `feat`     | New feature             |
| `fix`      | Bug fix                 |
| `docs`     | Documentation only      |
| `style`    | Code style (formatting) |
| `refactor` | Code refactoring        |
| `perf`     | Performance improvement |
| `test`     | Adding/updating tests   |
| `chore`    | Build/tooling changes   |
| `ci`       | CI/CD changes           |

### Scopes

| Scope     | Description        |
| --------- | ------------------ |
| `admin`   | Admin app changes  |
| `seller`  | Seller app changes |
| `shell`   | Shell app changes  |
| `auth`    | Auth service       |
| `product` | Product service    |
| `order`   | Order service      |
| `gateway` | GraphQL gateway    |
| `ui`      | UI library         |
| `types`   | Types package      |
| `utils`   | Utils package      |

### Examples

```bash
# Feature
git commit -m "feat(product): add product search filter"

# Bug fix
git commit -m "fix(auth): resolve token refresh issue"

# Documentation
git commit -m "docs(readme): update installation steps"

# Breaking change
git commit -m "feat(api)!: change response format for products"
```

## 🌿 Branch Naming

### Format

```
<type>/<ticket-id>-<short-description>
```

### Examples

```bash
feature/ECOM-123-product-search
bugfix/ECOM-456-cart-total-fix
hotfix/ECOM-789-security-patch
docs/ECOM-101-api-documentation
refactor/ECOM-202-auth-cleanup
```

### Types

| Type        | Description             |
| ----------- | ----------------------- |
| `feature/`  | New features            |
| `bugfix/`   | Bug fixes               |
| `hotfix/`   | Urgent production fixes |
| `docs/`     | Documentation           |
| `refactor/` | Code refactoring        |
| `test/`     | Test additions          |
| `chore/`    | Maintenance tasks       |

## 🔍 Code Review Guidelines

### For Authors

- Keep PRs small and focused
- Respond to feedback constructively
- Update PR based on review comments
- Request re-review after changes

### For Reviewers

- Review within 24 hours
- Provide constructive feedback
- Approve when ready, not perfect
- Use suggestions for small fixes

## 🆘 Getting Help

- Create an issue for bugs
- Use discussions for questions
- Tag maintainers for urgent issues

---

Thank you for contributing! 🎉
