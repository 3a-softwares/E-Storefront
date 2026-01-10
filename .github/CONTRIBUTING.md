# Contributing to E-Commerce Platform

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Branch Naming Convention](#branch-naming-convention)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Code Review Guidelines](#code-review-guidelines)
- [Testing Requirements](#testing-requirements)

---

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

---

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- Yarn package manager
- Docker & Docker Compose
- Git

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR-ORG/E-Commerce.git
   cd E-Commerce
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Start development environment:
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   yarn dev
   ```

---

## Development Workflow

```
1. Create a feature branch from `develop`
2. Make your changes
3. Write/update tests
4. Run tests locally
5. Create a Pull Request
6. Address review feedback
7. Merge after approval
```

---

## Branch Naming Convention

Use the following format: `<type>/<ticket-id>-<short-description>`

### Types

| Type | Description |
|------|-------------|
| `feature/` | New feature development |
| `bugfix/` | Bug fixes |
| `hotfix/` | Urgent production fixes |
| `refactor/` | Code refactoring |
| `docs/` | Documentation updates |
| `test/` | Test additions/updates |
| `chore/` | Maintenance tasks |

### Examples

```
feature/EC-123-add-payment-gateway
bugfix/EC-456-fix-cart-total
hotfix/EC-789-security-patch
refactor/EC-101-optimize-queries
docs/EC-102-api-documentation
```

---

## Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation changes |
| `style` | Code style changes (formatting, semicolons, etc.) |
| `refactor` | Code refactoring |
| `perf` | Performance improvements |
| `test` | Adding or updating tests |
| `build` | Build system or dependencies |
| `ci` | CI/CD configuration |
| `chore` | Other changes |

### Scopes

| Scope | Description |
|-------|-------------|
| `storefront` | Storefront app changes |
| `admin` | Admin app changes |
| `seller` | Seller app changes |
| `auth` | Auth service changes |
| `product` | Product service changes |
| `order` | Order service changes |
| `gateway` | GraphQL gateway changes |
| `ui` | UI library changes |
| `types` | Type definitions |
| `utils` | Utility functions |

### Examples

```
feat(storefront): add product search functionality

fix(auth): resolve token refresh issue

docs(readme): update installation instructions

refactor(product): optimize database queries

test(order): add unit tests for checkout flow
```

---

## Pull Request Process

### Before Creating a PR

- [ ] Run all tests locally: `yarn test`
- [ ] Run linting: `yarn lint`
- [ ] Run type checking: `yarn tsc --noEmit`
- [ ] Update documentation if needed
- [ ] Rebase on latest `develop` branch

### PR Title Format

Same as commit message format:
```
<type>(<scope>): <description>
```

### PR Description

Use the provided PR template and fill in all sections:
- Description of changes
- Related issue/ticket
- Type of change
- Testing performed
- Screenshots (if UI changes)

### Review Process

1. Automated checks must pass
2. At least 1 approval from code owner
3. No unresolved conversations
4. Branch is up to date with target

---

## Code Review Guidelines

### For Reviewers

- ✅ Be constructive and respectful
- ✅ Focus on code quality, not personal preference
- ✅ Explain the "why" behind suggestions
- ✅ Approve if changes are acceptable with minor fixes
- ✅ Test the changes locally if needed

### For Authors

- ✅ Respond to all comments
- ✅ Don't take feedback personally
- ✅ Ask for clarification if needed
- ✅ Update PR description after significant changes

---

## Testing Requirements

### Minimum Coverage

| Type | Coverage |
|------|----------|
| New features | 80%+ |
| Bug fixes | Include regression test |
| Refactoring | Maintain existing coverage |

### Test Commands

```bash
# Run all tests
yarn test

# Run specific workspace tests
yarn workspace @3asoftwares/storefront-app test
yarn workspace @3asoftwares/auth-service test

# Run with coverage
yarn test --coverage
```

---

## Questions?

- Check existing [Issues](https://github.com/YOUR-ORG/E-Commerce/issues)
- Start a [Discussion](https://github.com/YOUR-ORG/E-Commerce/discussions)
- Contact the team leads

Thank you for contributing! 🎉
