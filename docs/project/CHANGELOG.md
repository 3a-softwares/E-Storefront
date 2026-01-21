# Changelog

All notable changes to the E-Storefront monorepo will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added

- Consolidated technology documentation
- Auth service comprehensive docs (API, Architecture, Testing)
- Shared packages documentation

### Changed

- Merged duplicate documentation files
- Updated package READMEs with PR workflow

### Removed

- Duplicate technology docs from individual projects

---

## [1.0.0] - 2025-01-20

### Added

#### Platform

- E-Storefront monorepo structure
- Microservices architecture
- GraphQL API gateway
- Real-time notifications with Socket.IO

#### Services

- **auth-service** - User authentication and authorization
- **product-service** - Product catalog management
- **order-service** - Order processing
- **category-service** - Category management
- **coupon-service** - Discount and coupon management
- **ticket-service** - Support ticket system
- **graphql-gateway** - Unified API gateway

#### Applications

- **shell-app** - Micro-frontend container
- **admin-app** - Admin dashboard
- **seller-app** - Seller portal

#### Shared Packages

- **@3asoftwares/types** - TypeScript type definitions
- **@3asoftwares/utils** - Shared utility functions
- **@3asoftwares/ui** - React component library

#### Infrastructure

- Docker Compose setup for development
- Kubernetes manifests for production
- GitHub Actions CI/CD pipelines
- SonarCloud integration

#### Documentation

- Comprehensive project documentation
- Technology stack documentation
- API documentation
- Architecture documentation

---

## Version History

| Version | Date       | Description     |
| ------- | ---------- | --------------- |
| 1.0.0   | 2025-01-20 | Initial release |

---

## Related Changelogs

- [E-Storefront-Web CHANGELOG](../../E-Storefront-Web/docs/CHANGELOG.md)
- [E-Storefront-Mobile CHANGELOG](../../E-Storefront-Mobile/docs/CHANGELOG.md)

---

## Versioning

We use [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backwards compatible)
- **PATCH**: Bug fixes (backwards compatible)

### Commit Types → Version Bumps

| Commit Type                  | Version Bump |
| ---------------------------- | ------------ |
| `fix:` / `perf:`             | PATCH        |
| `feat:`                      | MINOR        |
| `feat!:` / `BREAKING CHANGE` | MAJOR        |
