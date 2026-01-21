# E-Storefront Documentation

Welcome to the E-Storefront documentation. This guide covers everything you need to develop, deploy, and maintain the platform.

## 📚 Documentation Index

### 🚀 Getting Started

| Document                                       | Description                        |
| ---------------------------------------------- | ---------------------------------- |
| [Getting Started](./guides/GETTING-STARTED.md) | Setup your development environment |
| [Troubleshooting](./guides/TROUBLESHOOTING.md) | Common issues and solutions        |

### 🏗️ Architecture

| Document                                                | Description                               |
| ------------------------------------------------------- | ----------------------------------------- |
| [Architecture Overview](./architecture/ARCHITECTURE.md) | System architecture and design principles |
| [High-Level Design (HLD)](./architecture/HLD.md)        | C4 diagrams, container architecture       |
| [Low-Level Design (LLD)](./architecture/LLD.md)         | Database schemas, service internals       |

### 🔌 API

| Document                      | Description                                         |
| ----------------------------- | --------------------------------------------------- |
| [API Reference](./api/API.md) | GraphQL API documentation, authentication, examples |

### 💻 Development

| Document                                              | Description                                 |
| ----------------------------------------------------- | ------------------------------------------- |
| [Coding Standards](./development/CODING-STANDARDS.md) | TypeScript, React, Node.js best practices   |
| [Testing Guide](./development/TESTING.md)             | Unit, integration, E2E testing strategies   |
| [Packages Guide](./development/PACKAGES.md)           | @3asoftwares/types, utils, ui documentation |
| [Publishing Guide](./development/PUBLISHING.md)       | How to publish packages to npm              |

### ⚙️ Operations

| Document                                          | Description                        |
| ------------------------------------------------- | ---------------------------------- |
| [CI/CD Pipeline](./operations/CI-CD.md)           | GitHub Actions workflows           |
| [Deployment Guide](./operations/DEPLOYMENT.md)    | Vercel, Railway, Docker deployment |
| [Docker Guide](./operations/DOCKER.md)            | Docker Compose & Kubernetes        |
| [Environment Config](./operations/ENVIRONMENT.md) | Environment variables reference    |
| [Security](./operations/SECURITY.md)              | Security practices & guidelines    |
| [Runbook](./operations/RUNBOOK.md)                | Operations, incident response      |

### 🖥️ Frontend Apps

| App                                        | Description                           | Docs                                                                                                                                    |
| ------------------------------------------ | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| [Shell App](../apps/shell-app/README.md)   | Consumer storefront (React + Webpack) | [Architecture](./apps/shell-app/ARCHITECTURE.md) &#124; [Testing](./apps/shell-app/TESTING.md)                                          |
| [Admin App](../apps/admin-app/README.md)   | Admin dashboard (React + Vite)        | [Architecture](./apps/admin-app/ARCHITECTURE.md) &#124; [API](./apps/admin-app/API.md) &#124; [Testing](./apps/admin-app/TESTING.md)    |
| [Seller App](../apps/seller-app/README.md) | Seller dashboard (React + Vite)       | [Architecture](./apps/seller-app/ARCHITECTURE.md) &#124; [API](./apps/seller-app/API.md) &#124; [Testing](./apps/seller-app/TESTING.md) |

### 🔧 Backend Services

| Service                                                    | Description                    | Docs                                                                                                                                                                  |
| ---------------------------------------------------------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Auth Service](../services/auth-service/README.md)         | Authentication & authorization | [Architecture](./services/auth-service/ARCHITECTURE.md) &#124; [API](./services/auth-service/API.md) &#124; [Testing](./services/auth-service/TESTING.md)             |
| [Product Service](../services/product-service/README.md)   | Product management & search    | [Architecture](./services/product-service/ARCHITECTURE.md) &#124; [API](./services/product-service/API.md) &#124; [Testing](./services/product-service/TESTING.md)    |
| [Category Service](../services/category-service/README.md) | Category hierarchy             | [Architecture](./services/category-service/ARCHITECTURE.md) &#124; [API](./services/category-service/API.md) &#124; [Testing](./services/category-service/TESTING.md) |
| [Order Service](../services/order-service/README.md)       | Order processing & payments    | [Architecture](./services/order-service/ARCHITECTURE.md) &#124; [API](./services/order-service/API.md) &#124; [Testing](./services/order-service/TESTING.md)          |
| [Coupon Service](../services/coupon-service/README.md)     | Discounts & promotions         | [Architecture](./services/coupon-service/ARCHITECTURE.md) &#124; [API](./services/coupon-service/API.md) &#124; [Testing](./services/coupon-service/TESTING.md)       |
| [GraphQL Gateway](../services/graphql-gateway/README.md)   | Unified GraphQL API            | [Architecture](./services/graphql-gateway/ARCHITECTURE.md) &#124; [API](./services/graphql-gateway/API.md) &#124; [Testing](./services/graphql-gateway/TESTING.md)    |
| [Ticket Service](../services/ticket-service/README.md)     | Customer support tickets       | [Architecture](./services/ticket-service/ARCHITECTURE.md) &#124; [API](./services/ticket-service/API.md) &#124; [Testing](./services/ticket-service/TESTING.md)       |

---

## 📁 Folder Structure

```
docs/
├── README.md                    # This file
├── architecture/                # System design docs
│   ├── ARCHITECTURE.md         # Architecture overview
│   ├── HLD.md                  # High-level design
│   └── LLD.md                  # Low-level design
├── api/                         # API documentation
│   └── API.md                  # GraphQL API reference
├── development/                 # Developer guides
│   ├── CODING-STANDARDS.md     # Coding conventions
│   ├── TESTING.md              # Testing strategies
│   ├── PACKAGES.md             # Shared packages docs
│   └── PUBLISHING.md           # NPM publishing guide
├── operations/                  # DevOps & operations
│   ├── CI-CD.md                # CI/CD pipelines
│   ├── DEPLOYMENT.md           # Deployment procedures
│   ├── DOCKER.md               # Docker & Kubernetes
│   ├── ENVIRONMENT.md          # Environment config
│   ├── SECURITY.md             # Security guidelines
│   └── RUNBOOK.md              # Operations runbook
├── guides/                      # How-to guides
│   ├── GETTING-STARTED.md      # Quick start guide
│   └── TROUBLESHOOTING.md      # Problem solving
├── apps/                        # Frontend app docs
│   ├── shell-app/              # Shell App docs
│   │   ├── ARCHITECTURE.md
│   │   └── TESTING.md
│   ├── admin-app/              # Admin App docs
│   │   ├── ARCHITECTURE.md
│   │   ├── API.md
│   │   └── TESTING.md
│   └── seller-app/             # Seller App docs
│       ├── ARCHITECTURE.md
│       ├── API.md
│       └── TESTING.md
└── services/                    # Backend service docs
    ├── auth-service/           # Auth Service docs
    │   ├── ARCHITECTURE.md
    │   ├── API.md
    │   └── TESTING.md
    ├── product-service/        # Product Service docs
    │   ├── ARCHITECTURE.md
    │   ├── API.md
    │   └── TESTING.md
    ├── category-service/       # Category Service docs
    │   ├── ARCHITECTURE.md
    │   ├── API.md
    │   └── TESTING.md
    ├── order-service/          # Order Service docs
    │   ├── ARCHITECTURE.md
    │   ├── API.md
    │   └── TESTING.md
    ├── coupon-service/         # Coupon Service docs
    │   ├── ARCHITECTURE.md
    │   ├── API.md
    │   └── TESTING.md
    ├── graphql-gateway/        # GraphQL Gateway docs
    │   ├── ARCHITECTURE.md
    │   ├── API.md
    │   └── TESTING.md
    └── ticket-service/         # Ticket Service docs
        ├── ARCHITECTURE.md
        ├── API.md
        └── TESTING.md
```

---

## 🔗 Quick Links

| Resource         | Link                                  |
| ---------------- | ------------------------------------- |
| **Main README**  | [README.md](../README.md)             |
| **Contributing** | [CONTRIBUTING.md](../CONTRIBUTING.md) |
| **Security**     | [SECURITY.md](../SECURITY.md)         |
| **Changelog**    | [CHANGELOG.md](../CHANGELOG.md)       |
| **License**      | [LICENSE](../LICENSE)                 |

---

## 📖 Reading Order for New Developers

1. **[Getting Started](./guides/GETTING-STARTED.md)** - Setup your environment
2. **[Architecture](./architecture/ARCHITECTURE.md)** - Understand the system
3. **[Packages](./development/PACKAGES.md)** - Learn about shared code
4. **[API Reference](./api/API.md)** - Explore the GraphQL API
5. **[Coding Standards](./development/CODING-STANDARDS.md)** - Follow conventions
6. **[Contributing](../CONTRIBUTING.md)** - Start contributing

---

## 🆘 Need Help?

- **Issues:** [GitHub Issues](https://github.com/3asoftwares/E-Storefront/issues)
- **Discussions:** [GitHub Discussions](https://github.com/3asoftwares/E-Storefront/discussions)
- **Email:** devteam@3asoftwares.com

---

© 2026 3A Softwares
