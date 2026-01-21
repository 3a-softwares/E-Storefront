# Getting Started Guide

## 📑 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Running Services](#running-services)
- [Next Steps](#next-steps)

## ✅ Prerequisites

### Required Software

| Software | Version | Installation                                          |
| -------- | ------- | ----------------------------------------------------- |
| Node.js  | 20+     | [nodejs.org](https://nodejs.org/) or `nvm install 20` |
| Yarn     | 1.22+   | `npm install -g yarn`                                 |
| Docker   | 24+     | [docker.com](https://docker.com/)                     |
| Git      | 2.40+   | [git-scm.com](https://git-scm.com/)                   |

### Recommended Tools

| Tool             | Purpose                     |
| ---------------- | --------------------------- |
| VS Code          | IDE with workspace settings |
| MongoDB Compass  | Database GUI                |
| Postman/Insomnia | API testing                 |
| Redis Insight    | Redis GUI                   |

### VS Code Extensions

```json
// Recommended extensions (install via Extensions panel)
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- GraphQL (GraphQL Foundation)
- Docker
- GitLens
```

---

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/3asoftwares/E-Storefront.git
cd E-Storefront
```

### 2. Install Dependencies

```bash
# Install all workspace dependencies
yarn install
```

### 3. Start Infrastructure (Docker)

```bash
# Start MongoDB and Redis
docker-compose up -d
```

This starts:

- MongoDB on `localhost:27017`
- Redis on `localhost:6379`

### 4. Build Packages

```bash
# Build shared packages first
yarn build:packages
```

### 5. Start Development Servers

```bash
# Start all services and apps
yarn dev:all
```

Or start specific workspaces:

```bash
# Backend services only
yarn dev:services

# Frontend apps only
yarn dev:frontend

# Specific app/service
yarn workspace @e-storefront/shell-app dev
yarn workspace @e-storefront/product-service dev
```

### 6. Access Applications

| Application     | URL                           | Description             |
| --------------- | ----------------------------- | ----------------------- |
| Shell App       | http://localhost:3000         | Main authentication app |
| Admin App       | http://localhost:3001         | Admin dashboard         |
| Seller App      | http://localhost:3002         | Seller portal           |
| GraphQL Gateway | http://localhost:4000/graphql | API + Playground        |

---

## 📁 Project Structure

```
E-Storefront/
├── apps/                          # Frontend applications
│   ├── admin-app/                # Admin dashboard (Vite)
│   ├── seller-app/               # Seller portal (Vite)
│   └── shell-app/                # Shell/Auth app (Webpack)
├── packages/                      # Shared packages (npm)
│   ├── types/                    # @3asoftwares/types
│   ├── utils/                    # @3asoftwares/utils
│   └── ui-library/               # @3asoftwares/ui
├── services/                      # Backend microservices
│   ├── auth-service/             # Authentication (Port 4001)
│   ├── product-service/          # Products (Port 4005)
│   ├── order-service/            # Orders (Port 4004)
│   ├── category-service/         # Categories (Port 4002)
│   ├── coupon-service/           # Coupons (Port 4003)
│   ├── ticket-service/           # Support (Port 4006)
│   └── graphql-gateway/          # GraphQL API (Port 4000)
├── devops/                        # DevOps configurations
│   ├── k8s/                      # Kubernetes manifests
│   ├── nginx/                    # Nginx configs
│   └── mongo-init/               # MongoDB init scripts
├── setup/                         # Setup utilities
│   ├── scripts/                  # Shell scripts
│   └── generate-data/            # Seed data generators
├── docs/                          # Documentation
├── docker-compose.yml            # Local infrastructure
├── package.json                  # Root workspace config
└── yarn.lock                     # Dependency lock file
```

---

## 🔄 Development Workflow

### Daily Development

```bash
# 1. Pull latest changes
git pull origin main

# 2. Install any new dependencies
yarn install

# 3. Rebuild packages (if changed)
yarn build:packages

# 4. Start development
yarn dev:all
```

### Before Committing

```bash
# 1. Format code
yarn format

# 2. Fix lint issues
yarn lint:fix

# 3. Run tests
yarn test

# 4. Type check
yarn build:packages
```

### Creating a Feature

```bash
# 1. Create feature branch
git checkout -b feature/your-feature-name

# 2. Make changes...

# 3. Test your changes
yarn test

# 4. Commit with conventional commits
git commit -m "feat(product): add product search"

# 5. Push and create PR
git push origin feature/your-feature-name
```

---

## 🏃 Running Services

### All Services

```bash
# Start everything
yarn dev:all

# Start with Docker (production-like)
docker-compose -f docker-compose.yml up
```

### Individual Services

```bash
# Frontend
yarn workspace @e-storefront/shell-app dev      # Port 3000
yarn workspace @e-storefront/admin-app dev      # Port 3001
yarn workspace @e-storefront/seller-app dev     # Port 3002

# Backend
yarn workspace @e-storefront/graphql-gateway dev  # Port 4000
yarn workspace @e-storefront/auth-service dev     # Port 4001
yarn workspace @e-storefront/product-service dev  # Port 4005
yarn workspace @e-storefront/order-service dev    # Port 4004
```

### Service Ports

| Service          | Port  | Description         |
| ---------------- | ----- | ------------------- |
| Shell App        | 3000  | Main frontend entry |
| Admin App        | 3001  | Admin dashboard     |
| Seller App       | 3002  | Seller portal       |
| GraphQL Gateway  | 4000  | API gateway         |
| Auth Service     | 4001  | Authentication      |
| Category Service | 4002  | Categories          |
| Coupon Service   | 4003  | Coupons/Discounts   |
| Order Service    | 4004  | Orders              |
| Product Service  | 4005  | Products            |
| Ticket Service   | 4006  | Support tickets     |
| MongoDB          | 27017 | Database            |
| Redis            | 6379  | Cache               |

---

## 🧪 Testing Your Setup

### 1. Check Services Health

```bash
# GraphQL Gateway
curl http://localhost:4000/health

# All services via gateway
curl http://localhost:4000/health/all
```

### 2. Test GraphQL API

Visit http://localhost:4000/graphql and run:

```graphql
query {
  products(first: 5) {
    edges {
      node {
        id
        name
        price
      }
    }
  }
}
```

### 3. Run Test Suite

```bash
# All tests
yarn test

# With coverage
yarn test:coverage

# Specific workspace
yarn workspace @3asoftwares/utils test
```

---

## 📚 Next Steps

### Learn More

| Topic         | Documentation                                                        |
| ------------- | -------------------------------------------------------------------- |
| Architecture  | [docs/architecture/ARCHITECTURE.md](../architecture/ARCHITECTURE.md) |
| API Reference | [docs/api/API.md](../api/API.md)                                     |
| Contributing  | [CONTRIBUTING.md](../../CONTRIBUTING.md)                             |
| Testing       | [docs/development/TESTING.md](../development/TESTING.md)             |
| Packages      | [docs/development/PACKAGES.md](../development/PACKAGES.md)           |

### Common Tasks

| Task                 | Command                                               |
| -------------------- | ----------------------------------------------------- |
| Add dependency       | `yarn workspace <name> add <package>`                 |
| Run tests            | `yarn test`                                           |
| Build for production | `yarn build`                                          |
| Generate seed data   | `yarn workspace @e-storefront/generate-data run seed` |
| Check lint           | `yarn lint`                                           |

### Getting Help

- **Issues:** [GitHub Issues](https://github.com/3asoftwares/E-Storefront/issues)
- **Discussions:** [GitHub Discussions](https://github.com/3asoftwares/E-Storefront/discussions)
- **Email:** devteam@3asoftwares.com

---

© 2026 3A Softwares
