# E-Storefront Project Documentation

## 📑 Table of Contents

This folder contains comprehensive documentation for the E-Storefront platform.

---

## 📚 Documentation Index

### Getting Started

| Document                                 | Description               |
| ---------------------------------------- | ------------------------- |
| [GETTING-STARTED.md](GETTING-STARTED.md) | Quick start guide         |
| [ENVIRONMENT.md](ENVIRONMENT.md)         | Environment configuration |
| [DOCKER.md](DOCKER.md)                   | Docker setup and commands |

### Architecture & Design

| Document                                     | Description                  |
| -------------------------------------------- | ---------------------------- |
| [ARCHITECTURE.md](ARCHITECTURE.md)           | System architecture overview |
| [HIGH_LEVEL_DESIGN.md](HIGH_LEVEL_DESIGN.md) | High-level design document   |
| [LOW_LEVEL_DESIGN.md](LOW_LEVEL_DESIGN.md)   | Low-level design document    |
| [TECH_STACK.md](TECH_STACK.md)               | Technology stack details     |

### Development

| Document                                   | Description                      |
| ------------------------------------------ | -------------------------------- |
| [CONTRIBUTING.md](CONTRIBUTING.md)         | Contribution guidelines          |
| [CODING-STANDARDS.md](CODING-STANDARDS.md) | Coding standards and conventions |
| [PACKAGES.md](PACKAGES.md)                 | Shared packages documentation    |
| [PUBLISHING.md](PUBLISHING.md)             | Package publishing guide         |

### API & Security

| Document                   | Description                     |
| -------------------------- | ------------------------------- |
| [API.md](API.md)           | API documentation               |
| [SECURITY.md](SECURITY.md) | Security policies and practices |

### Testing & Quality

| Document                 | Description                  |
| ------------------------ | ---------------------------- |
| [TESTING.md](TESTING.md) | Testing guide and strategies |
| [CI-CD.md](CI-CD.md)     | CI/CD pipeline documentation |

### Operations

| Document                                 | Description                 |
| ---------------------------------------- | --------------------------- |
| [DEPLOYMENT.md](DEPLOYMENT.md)           | Deployment guide            |
| [RUNBOOK.md](RUNBOOK.md)                 | Operations runbook          |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | Common issues and solutions |
| [CHANGELOG.md](CHANGELOG.md)             | Version history             |

---

## 🚀 Quick Links

### PR Workflow Commands

```bash
# Before creating a PR, run these commands:

# 1. Format and lint
yarn format && yarn lint:fix:frontend

# 2. Type check
yarn build:packages

# 3. Run tests
yarn test:all

# 4. Validate (all-in-one)
yarn lint:frontend && yarn test:all && echo "✅ Ready for PR!"
```

### Common Development Commands

```bash
# Start all services
yarn dev:all

# Start specific service
yarn dev:auth        # Auth service
yarn dev:products    # Product service
yarn dev:gateway     # GraphQL gateway

# Build all packages
yarn build:packages

# Run tests
yarn test:all
yarn test:coverage:all
```

### Docker Commands

```bash
# Start all containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down

# Rebuild
docker-compose up -d --build
```

---

## 📁 Related Documentation

### Technology Documentation

See [../technologies/README.md](../technologies/README.md) for detailed technology guides:

- React, Next.js, TypeScript
- GraphQL, Express, MongoDB
- Docker, Kubernetes, CI/CD
- Testing with Jest, Vitest, Cypress

### Service-Specific Documentation

Each service has its own docs folder:

- `services/auth-service/docs/` - Authentication service
- `services/product-service/docs/` - Product service
- (other services)

---

## 🤝 Contributing

1. Read [CONTRIBUTING.md](CONTRIBUTING.md)
2. Follow [CODING-STANDARDS.md](CODING-STANDARDS.md)
3. Submit PR with proper tests and documentation

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file.
