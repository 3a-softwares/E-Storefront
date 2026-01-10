# 🚀 CI/CD Pipeline Documentation

## Overview

The 3A Softwares E-Commerce Platform uses **GitHub Actions** for continuous integration and continuous deployment. This document covers the complete CI/CD setup, workflows, and best practices.

---

## 📋 Pipeline Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         GitHub Actions Workflow                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌───────┐ │
│  │  Push   │───▶│  Lint   │───▶│  Test   │───▶│  Build  │───▶│Deploy │ │
│  │  / PR   │    │         │    │         │    │         │    │       │ │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘    └───────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Workflow Files

### Directory Structure

```
.github/
├── workflows/
│   ├── ci.yml                 # Main CI pipeline
│   ├── deploy-frontend.yml    # Frontend deployment
│   ├── deploy-backend.yml     # Backend deployment
│   ├── test.yml               # Test runner
│   └── release.yml            # Release automation
└── CODEOWNERS                 # Code review rules
```

---

## 📝 Main CI Workflow

### `.github/workflows/ci.yml`

```yaml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  NODE_VERSION: '20.x'
  YARN_VERSION: '1.22.x'

jobs:
  # ============================================
  # LINT JOB
  # ============================================
  lint:
    name: 🔍 Lint Code
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'yarn'

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Run ESLint
        run: yarn lint

      - name: Run Prettier check
        run: yarn format:check

  # ============================================
  # TEST JOB
  # ============================================
  test:
    name: 🧪 Run Tests
    runs-on: ubuntu-latest
    needs: lint
    strategy:
      matrix:
        project:
          - admin-app
          - seller-app
          - shell-app
          - storefront-app
          - auth-service
          - product-service
          - order-service
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'yarn'

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Build shared packages
        run: yarn build:packages

      - name: Run tests with coverage
        run: yarn workspace @3asoftwares/${{ matrix.project }} test --coverage
        continue-on-error: true

      - name: Upload coverage report
        uses: codecov/codecov-action@v3
        with:
          files: ./apps/${{ matrix.project }}/coverage/lcov.info,./services/${{ matrix.project }}/coverage/lcov.info
          flags: ${{ matrix.project }}
          fail_ci_if_error: false

  # ============================================
  # BUILD JOB
  # ============================================
  build:
    name: 🏗️ Build Applications
    runs-on: ubuntu-latest
    needs: test
    strategy:
      matrix:
        include:
          - name: admin-app
            type: frontend
          - name: seller-app
            type: frontend
          - name: shell-app
            type: frontend
          - name: storefront-app
            type: frontend
          - name: auth-service
            type: backend
          - name: graphql-gateway
            type: backend
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'yarn'

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Build shared packages
        run: yarn build:packages

      - name: Build application
        run: yarn build:${{ matrix.name }}

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: ${{ matrix.name }}-build
          path: |
            apps/${{ matrix.name }}/dist
            apps/${{ matrix.name }}/.next
            services/${{ matrix.name }}/dist
          retention-days: 7

  # ============================================
  # DEPLOY JOB (Production)
  # ============================================
  deploy:
    name: 🚀 Deploy to Vercel
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    environment: production
    strategy:
      matrix:
        project:
          - admin-app
          - seller-app
          - storefront-app
          - auth-service
          - graphql-gateway
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID_${{ matrix.project }} }}
          working-directory: ./apps/${{ matrix.project }}
          vercel-args: '--prod'
```

---

## 🧪 Test Workflow

### `.github/workflows/test.yml`

```yaml
name: Test Suite

on:
  push:
    branches: [main, develop, 'feature/**']
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  unit-tests:
    name: Unit Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'yarn'

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Build packages
        run: yarn build:packages

      - name: Run unit tests
        run: yarn test:unit --coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}

  integration-tests:
    name: Integration Tests
    runs-on: ubuntu-latest
    services:
      mongodb:
        image: mongo:7
        ports:
          - 27017:27017
      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'yarn'

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Run integration tests
        run: yarn test:integration
        env:
          MONGODB_URL: mongodb://localhost:27017/test
          REDIS_URL: redis://localhost:6379

  e2e-tests:
    name: E2E Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'yarn'

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: yarn test:e2e

      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 🚢 Deployment Workflows

### Frontend Deployment

```yaml
# .github/workflows/deploy-frontend.yml
name: Deploy Frontend

on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Deployment environment'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production

jobs:
  deploy-frontend:
    name: Deploy Frontend Apps
    runs-on: ubuntu-latest
    environment: ${{ github.event.inputs.environment }}
    strategy:
      matrix:
        app: [admin-app, seller-app, shell-app, storefront-app]
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'yarn'

      - name: Install Vercel CLI
        run: npm install -g vercel

      - name: Pull Vercel Environment
        run: vercel pull --yes --environment=${{ github.event.inputs.environment }} --token=${{ secrets.VERCEL_TOKEN }}
        working-directory: ./apps/${{ matrix.app }}

      - name: Build Project
        run: vercel build ${{ github.event.inputs.environment == 'production' && '--prod' || '' }} --token=${{ secrets.VERCEL_TOKEN }}
        working-directory: ./apps/${{ matrix.app }}

      - name: Deploy
        run: vercel deploy --prebuilt ${{ github.event.inputs.environment == 'production' && '--prod' || '' }} --token=${{ secrets.VERCEL_TOKEN }}
        working-directory: ./apps/${{ matrix.app }}
```

### Backend Deployment

```yaml
# .github/workflows/deploy-backend.yml
name: Deploy Backend

on:
  push:
    branches: [main]
    paths:
      - 'services/**'
  workflow_dispatch:

jobs:
  deploy-services:
    name: Deploy Backend Services
    runs-on: ubuntu-latest
    environment: production
    strategy:
      matrix:
        service:
          - auth-service
          - category-service
          - coupon-service
          - product-service
          - order-service
          - graphql-gateway
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets[format('VERCEL_PROJECT_ID_{0}', matrix.service)] }}
          working-directory: ./services/${{ matrix.service }}
          vercel-args: '--prod'
```

---

## 🔐 Secrets Configuration

### Required Secrets

| Secret Name | Description | Where to Get |
|-------------|-------------|--------------|
| `VERCEL_TOKEN` | Vercel API token | Vercel Dashboard → Settings → Tokens |
| `VERCEL_ORG_ID` | Vercel organization ID | Vercel Dashboard → Settings |
| `VERCEL_PROJECT_ID_*` | Project-specific IDs | Each project's settings |
| `CODECOV_TOKEN` | Codecov upload token | Codecov.io |
| `MONGODB_URL` | Production MongoDB URI | MongoDB Atlas |
| `REDIS_URL` | Production Redis URI | Redis Labs |
| `JWT_SECRET` | JWT signing secret | Generate securely |

### Setting Secrets

```bash
# Using GitHub CLI
gh secret set VERCEL_TOKEN --body "your-token"
gh secret set VERCEL_ORG_ID --body "your-org-id"
```

---

## 📊 Workflow Status Badges

Add these badges to your README.md:

```markdown
![CI](https://github.com/your-org/e-commerce/actions/workflows/ci.yml/badge.svg)
![Tests](https://github.com/your-org/e-commerce/actions/workflows/test.yml/badge.svg)
![Deploy](https://github.com/your-org/e-commerce/actions/workflows/deploy.yml/badge.svg)
[![codecov](https://codecov.io/gh/your-org/e-commerce/branch/main/graph/badge.svg)](https://codecov.io/gh/your-org/e-commerce)
```

---

## 🔄 Branch Strategy

```
main (production)
  │
  ├── develop (staging)
  │     │
  │     ├── feature/new-feature
  │     ├── feature/another-feature
  │     └── bugfix/fix-something
  │
  └── hotfix/critical-fix
```

### Branch Protection Rules

```yaml
# Recommended branch protection for 'main'
- Require pull request reviews: 1
- Require status checks to pass:
  - lint
  - test
  - build
- Require branches to be up to date
- Include administrators: false
- Restrict who can push: maintainers only
```

---

## 🎯 Deployment Environments

### Environment Configuration

| Environment | Branch | Auto Deploy | Approval Required |
|-------------|--------|-------------|-------------------|
| Development | `feature/*` | No | No |
| Staging | `develop` | Yes | No |
| Production | `main` | Yes | Yes |

### Environment Variables

```yaml
# GitHub Environment: production
VERCEL_ENV: production
NODE_ENV: production
MONGODB_URL: ${{ secrets.PROD_MONGODB_URL }}
REDIS_URL: ${{ secrets.PROD_REDIS_URL }}

# GitHub Environment: staging
VERCEL_ENV: preview
NODE_ENV: staging
MONGODB_URL: ${{ secrets.STAGING_MONGODB_URL }}
REDIS_URL: ${{ secrets.STAGING_REDIS_URL }}
```

---

## 📈 Performance Optimization

### Caching Strategies

```yaml
# Cache node_modules
- uses: actions/cache@v3
  with:
    path: |
      node_modules
      */*/node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('**/yarn.lock') }}
    restore-keys: |
      ${{ runner.os }}-node-

# Cache Yarn
- uses: actions/cache@v3
  with:
    path: .yarn/cache
    key: ${{ runner.os }}-yarn-${{ hashFiles('**/yarn.lock') }}

# Cache Next.js
- uses: actions/cache@v3
  with:
    path: apps/storefront-app/.next/cache
    key: ${{ runner.os }}-nextjs-${{ hashFiles('**/yarn.lock') }}-${{ hashFiles('apps/storefront-app/**/*.[jt]s', 'apps/storefront-app/**/*.[jt]sx') }}
```

### Parallel Jobs

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
  
  test:
    runs-on: ubuntu-latest
    needs: lint  # Sequential dependency
  
  build-frontend:
    runs-on: ubuntu-latest
    needs: lint  # Parallel with test
  
  build-backend:
    runs-on: ubuntu-latest
    needs: lint  # Parallel with test and build-frontend
```

---

## 🔔 Notifications

### Slack Integration

```yaml
- name: Notify Slack on Success
  if: success()
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "✅ Deployment successful!",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*${{ github.repository }}*\n${{ github.event.head_commit.message }}"
            }
          }
        ]
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}

- name: Notify Slack on Failure
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "❌ Deployment failed!",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*${{ github.repository }}* - Build Failed\n<${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}|View Logs>"
            }
          }
        ]
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

---

## 🛠️ Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Cache miss | Clear cache via GitHub Actions UI |
| Build timeout | Increase timeout or optimize build |
| Flaky tests | Add retry logic or fix test isolation |
| Deploy fails | Check Vercel logs and secrets |

### Debug Mode

```yaml
- name: Debug step
  run: |
    echo "GitHub Context:"
    echo '${{ toJSON(github) }}'
    echo "Environment:"
    env | sort
```

---

## 📚 Related Documentation

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Deployment Guide](DEPLOYMENT.md)
- [Test Coverage Reports](TEST_COVERAGE.md)

---

**Last Updated**: January 10, 2026
**Version**: 1.0.0
