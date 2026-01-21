# E-Storefront

[![CI Pipeline](https://github.com/3asoftwares/E-Storefront/actions/workflows/ci.yml/badge.svg)](https://github.com/3asoftwares/E-Storefront/actions/workflows/ci.yml)
[![Deploy Vercel](https://github.com/3asoftwares/E-Storefront/actions/workflows/deploy-vercel.yml/badge.svg)](https://github.com/3asoftwares/E-Storefront/actions/workflows/deploy-vercel.yml)
[![Deploy Railway](https://github.com/3asoftwares/E-Storefront/actions/workflows/deploy-railway.yml/badge.svg)](https://github.com/3asoftwares/E-Storefront/actions/workflows/deploy-railway.yml)

A modern, scalable, and feature-rich e-commerce platform built with cutting-edge technologies.

## � Technology Stack Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        E-Storefront Technology Stack                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                         FRONTEND APPLICATIONS                          │ │
│  ├────────────────────────────────────────────────────────────────────────┤ │
│  │                                                                        │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │ │
│  │  │  Web App    │  │ Mobile App  │  │  Admin App  │  │ Seller App  │  │ │
│  │  │─────────────│  │─────────────│  │─────────────│  │─────────────│  │ │
│  │  │ Next.js 16  │  │React Native │  │    Vite     │  │    Vite     │  │ │
│  │  │ Tailwind    │  │  Expo 51    │  │  React 18   │  │  React 18   │  │ │
│  │  │ DaisyUI     │  │Expo Router  │  │ Redux TK    │  │ Redux TK    │  │ │
│  │  │ Zustand     │  │  Zustand    │  │ RTK Query   │  │ RTK Query   │  │ │
│  │  │ Apollo      │  │  Apollo     │  │ Tailwind    │  │ Tailwind    │  │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                      │                                       │
│                                      ▼                                       │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                          API GATEWAY                                   │ │
│  │                    GraphQL Federation (Apollo)                         │ │
│  │                         Node.js + Express                              │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                      │                                       │
│         ┌───────────────┬────────────┼────────────┬───────────────┐         │
│         ▼               ▼            ▼            ▼               ▼         │
│  ┌───────────┐  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐    │
│  │   Auth    │  │  Product  │ │   Order   │ │ Category  │ │  Coupon   │    │
│  │  Service  │  │  Service  │ │  Service  │ │  Service  │ │  Service  │    │
│  │───────────│  │───────────│ │───────────│ │───────────│ │───────────│    │
│  │ Express   │  │ Express   │ │ Express   │ │ Express   │ │ Express   │    │
│  │ JWT/OAuth │  │ Mongoose  │ │ Mongoose  │ │ Mongoose  │ │ Mongoose  │    │
│  └───────────┘  └───────────┘ └───────────┘ └───────────┘ └───────────┘    │
│                                      │                                       │
│                          ┌───────────┴───────────┐                          │
│                          ▼                       ▼                          │
│                   ┌────────────┐          ┌────────────┐                    │
│                   │  MongoDB   │          │   Redis    │                    │
│                   │ (Database) │          │  (Cache)   │                    │
│                   └────────────┘          └────────────┘                    │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                              DevOps                                    │ │
│  │  Docker │ Kubernetes │ GitHub Actions │ NGINX │ SonarCloud │ Vercel   │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                          Support Site                                  │ │
│  │              Bootstrap 5 │ SCSS │ Vanilla JS │ Vercel                 │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## �🏗️ Architecture

This is a monorepo managed with Yarn Workspaces containing:

### 📦 Packages
- `@3asoftwares/types` - Shared TypeScript types and interfaces
- `@3asoftwares/ui` - Shared UI component library
- `@3asoftwares/utils` - Shared utility functions

### 🖥️ Frontend Apps
- `admin-app` - Admin dashboard for platform management
- `seller-app` - Seller portal for product and order management
- `shell-app` - Main shell application and authentication
- `support-app` - Customer support interface

### ⚙️ Backend Services
- `auth-service` - Authentication and user management
- `category-service` - Category management
- `coupon-service` - Coupon and discount management
- `graphql-gateway` - GraphQL API gateway
- `order-service` - Order processing
- `product-service` - Product catalog management
- `ticket-service` - Support ticket management

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Yarn 1.22+
- MongoDB
- Redis

### Installation

```bash
# Install dependencies
yarn install

# Build packages
yarn build:packages

# Start development servers
yarn dev
```

## 🧪 Testing

```bash
# Run all tests
yarn test

# Run package tests
yarn test:packages

# Run frontend tests
yarn test:frontend

# Run backend tests
yarn test:backend
```

## 🔧 Development Scripts

| Command | Description |
|---------|-------------|
| `yarn build` | Build all packages, apps, and services |
| `yarn build:packages` | Build shared packages |
| `yarn build:frontend` | Build frontend applications |
| `yarn build:backend` | Build backend services |
| `yarn test` | Run all test suites |
| `yarn lint` | Lint all code |

## 📋 CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment:

- **CI Pipeline** - Runs on all pushes and pull requests
  - Builds and tests all packages
  - Builds and tests frontend apps
  - Builds and tests backend services
  
- **Deploy Vercel** - Deploys frontend apps to Vercel
- **Deploy Railway** - Deploys backend services to Railway
- **Publish Packages** - Publishes packages to npm

## � Documentation

Comprehensive documentation is available in the [`docs/`](docs/) folder:

| Category | Documents |
|----------|-----------|
| **Getting Started** | [Quick Start](docs/guides/GETTING-STARTED.md), [Troubleshooting](docs/guides/TROUBLESHOOTING.md) |
| **Architecture** | [Overview](docs/architecture/ARCHITECTURE.md), [HLD](docs/architecture/HLD.md), [LLD](docs/architecture/LLD.md) |
| **Technology Stack** | [TECHNOLOGY-STACK.md](docs/TECHNOLOGY-STACK.md), [Technologies Index](docs/technologies/README.md) |
| **API** | [GraphQL API](docs/api/API.md) |
| **Development** | [Coding Standards](docs/development/CODING-STANDARDS.md), [Testing](docs/development/TESTING.md), [Packages](docs/development/PACKAGES.md) |
| **Publishing** | [NPM Publishing Guide](docs/development/PUBLISHING.md) |
| **Operations** | [CI/CD](docs/operations/CI-CD.md), [Deployment](docs/operations/DEPLOYMENT.md), [Environment](docs/operations/ENVIRONMENT.md) |
| **Additional** | [CONTRIBUTING.md](docs/CONTRIBUTING.md), [CHANGELOG.md](docs/CHANGELOG.md), [SECURITY.md](docs/SECURITY.md) |

📖 See [docs/README.md](docs/README.md) for full documentation index.

## �📄 License

This project is licensed under the terms specified in the [LICENSE](LICENSE) file.

---

© 2026 3A Softwares. All rights reserved.
