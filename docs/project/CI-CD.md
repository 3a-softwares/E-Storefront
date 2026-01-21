# CI/CD Documentation

## 📑 Table of Contents

- [Overview](#overview)
- [Pipeline Architecture](#pipeline-architecture)
- [GitHub Actions Workflows](#github-actions-workflows)
- [Environment Setup](#environment-setup)
- [Deployment Flow](#deployment-flow)
- [Secrets Management](#secrets-management)

## 🌐 Overview

E-Storefront uses **GitHub Actions** for CI/CD automation with the following workflows:

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `ci.yml` | Push/PR to main, develop | Build, test, lint |
| `deploy-vercel.yml` | Push to main | Deploy frontend to Vercel |
| `deploy-railway.yml` | Push to main | Deploy backend to Railway |
| `publish-packages.yml` | Tag push | Publish packages to npm |

## 🏗️ Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CI/CD PIPELINE                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐                                                           │
│  │   PR Created │                                                           │
│  │   or Updated │                                                           │
│  └──────┬───────┘                                                           │
│         │                                                                    │
│         ▼                                                                    │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                        CI PIPELINE                                    │  │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐    │  │
│  │  │   Setup &   │ │    Lint     │ │    Test     │ │    Build    │    │  │
│  │  │   Install   │ │             │ │             │ │             │    │  │
│  │  └──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └──────┬──────┘    │  │
│  │         │               │               │               │            │  │
│  │         ▼               ▼               ▼               ▼            │  │
│  │  [Dependencies]   [ESLint]        [Jest]          [TypeScript]       │  │
│  │  [Cache]          [Prettier]      [Coverage]      [Bundle]           │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                     │                                        │
│                                     ▼                                        │
│                          ┌─────────────────────┐                            │
│                          │   All Checks Pass?  │                            │
│                          └──────────┬──────────┘                            │
│                                     │                                        │
│              ┌──────────────────────┴──────────────────────┐                │
│              │                                             │                │
│              ▼                                             ▼                │
│  ┌───────────────────┐                        ┌───────────────────┐        │
│  │   PR Approved &   │                        │    PR Blocked     │        │
│  │     Merged        │                        │                   │        │
│  └─────────┬─────────┘                        └───────────────────┘        │
│            │                                                                 │
│            ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                        CD PIPELINE                                    │  │
│  │                                                                       │  │
│  │  ┌─────────────────────┐         ┌─────────────────────┐            │  │
│  │  │   Deploy Frontend   │         │   Deploy Backend    │            │  │
│  │  │   (Vercel)          │         │   (Railway)         │            │  │
│  │  │                     │         │                     │            │  │
│  │  │ • Shell App         │         │ • Auth Service      │            │  │
│  │  │ • Admin App         │         │ • Product Service   │            │  │
│  │  │ • Seller App        │         │ • Order Service     │            │  │
│  │  │                     │         │ • Gateway           │            │  │
│  │  └─────────────────────┘         └─────────────────────┘            │  │
│  │                                                                       │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 🔄 GitHub Actions Workflows

### CI Pipeline (`ci.yml`)

```yaml
# Runs on all pushes and PRs
name: CI Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main, develop]

jobs:
  setup:
    # Detect changes and cache dependencies
    
  lint-packages:
    needs: setup
    # Lint shared packages
    
  lint-frontend:
    needs: setup
    # Lint frontend apps (parallel)
    
  test-packages:
    needs: lint-packages
    # Test shared packages
    
  test-frontend:
    needs: lint-frontend
    # Test frontend apps (parallel)
    
  test-backend:
    needs: setup
    # Test backend services (parallel)
    
  build:
    needs: [test-packages, test-frontend, test-backend]
    # Build all artifacts
```

### Deployment Workflow

#### Frontend (Vercel)

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
    paths:
      - 'apps/**'
      - 'packages/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

#### Backend (Railway)

```yaml
name: Deploy to Railway

on:
  push:
    branches: [main]
    paths:
      - 'services/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        service:
          - auth-service
          - product-service
          - order-service
          - graphql-gateway
    steps:
      - uses: actions/checkout@v4
      - uses: railwayapp/railway-deploy@v1
        with:
          service: ${{ matrix.service }}
          token: ${{ secrets.RAILWAY_TOKEN }}
```

## 🌍 Environment Setup

### Required Secrets

| Secret | Description | Where |
|--------|-------------|-------|
| `VERCEL_TOKEN` | Vercel API token | GitHub Secrets |
| `VERCEL_ORG_ID` | Vercel organization ID | GitHub Secrets |
| `VERCEL_PROJECT_ID` | Vercel project ID | GitHub Secrets |
| `RAILWAY_TOKEN` | Railway API token | GitHub Secrets |
| `NPM_TOKEN` | npm publish token | GitHub Secrets |
| `SONAR_TOKEN` | SonarCloud token | GitHub Secrets |
| `MONGODB_URI` | MongoDB connection | Railway Variables |
| `REDIS_URL` | Redis connection | Railway Variables |
| `JWT_SECRET` | JWT signing secret | Railway Variables |

### Environment Variables by Stage

#### Development

```env
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ecommerce
REDIS_URL=redis://localhost:6379
JWT_SECRET=dev-secret-key
GRAPHQL_URL=http://localhost:4000/graphql
```

#### Staging

```env
NODE_ENV=staging
MONGODB_URI=mongodb+srv://staging-cluster/ecommerce
REDIS_URL=redis://staging-redis:6379
JWT_SECRET=${STAGING_JWT_SECRET}
GRAPHQL_URL=https://staging-api.3asoftwares.com/graphql
```

#### Production

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://prod-cluster/ecommerce
REDIS_URL=redis://prod-redis:6379
JWT_SECRET=${PROD_JWT_SECRET}
GRAPHQL_URL=https://api.3asoftwares.com/graphql
```

## 🚀 Deployment Flow

### Automatic Deployment

```
┌─────────────────────────────────────────────────────────────┐
│                    Merge to Main                             │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │            Path Detection               │
        └─────────────────────┬───────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  apps/* changed │ │services/* changed│ │packages/* changed│
│                 │ │                 │ │                 │
│  → Deploy to    │ │  → Deploy to    │ │  → Publish to   │
│    Vercel       │ │    Railway      │ │    npm          │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

### Manual Deployment

```bash
# Frontend to Vercel
vercel --prod

# Backend to Railway
railway up -s auth-service
railway up -s product-service
railway up -s order-service
railway up -s graphql-gateway

# Packages to npm
yarn build:packages
npm publish --workspace packages/types
npm publish --workspace packages/utils
npm publish --workspace packages/ui
```

## 📊 Pipeline Metrics

### Target Metrics

| Metric | Target | Current |
|--------|--------|---------|
| CI Duration | < 10 min | ~8 min |
| Test Coverage | ≥ 80% | 85% |
| Build Success Rate | ≥ 99% | 99.5% |
| Deploy Frequency | Daily | 3-4/day |
| Mean Time to Recovery | < 1 hour | 45 min |

### Monitoring

- **GitHub Actions** - Pipeline execution
- **Vercel Dashboard** - Frontend deployments
- **Railway Dashboard** - Backend deployments
- **SonarCloud** - Code quality

## 🔐 Secrets Management

### Adding Secrets

```bash
# GitHub CLI
gh secret set VERCEL_TOKEN --body "your-token"
gh secret set RAILWAY_TOKEN --body "your-token"

# Or via GitHub UI
# Settings → Secrets and variables → Actions → New repository secret
```

### Rotating Secrets

1. Generate new secret/token
2. Update GitHub Secrets
3. Update Railway Variables (if applicable)
4. Verify deployment works
5. Revoke old secret/token

---

See also:
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment details
- [ENVIRONMENT.md](./ENVIRONMENT.md) - Environment configuration
