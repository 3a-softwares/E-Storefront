# 🏗️ Architecture Documentation

## Overview

The 3A Softwares E-Commerce Platform is built using a **Micro-Frontend Architecture** combined with **Microservices Backend**. This document provides a comprehensive overview of the system architecture, design decisions, and component interactions.

---

## 📐 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  Shell App   │  │  Admin App   │  │  Seller App  │  │  Storefront  │    │
│  │  (Host)      │  │  (Remote)    │  │  (Remote)    │  │  (Standalone)│    │
│  │  Port: 3000  │  │  Port: 3001  │  │  Port: 3002  │  │  Port: 3003  │    │
│  │  Webpack 5   │  │  Vite        │  │  Vite        │  │  Next.js 16  │    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │
│         │                  │                  │                  │           │
│         └──────────────────┴────────┬─────────┴──────────────────┘           │
│                                     │                                        │
└─────────────────────────────────────┼────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API GATEWAY                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                    ┌──────────────────────────────┐                         │
│                    │     GraphQL Gateway          │                         │
│                    │     Port: 4000               │                         │
│                    │     Apollo Server            │                         │
│                    └──────────────┬───────────────┘                         │
│                                   │                                          │
└───────────────────────────────────┼──────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           MICROSERVICES LAYER                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │Auth Service │  │Category Svc │  │Coupon Svc   │  │Product Svc  │        │
│  │Port: 3011   │  │Port: 3012   │  │Port: 3013   │  │Port: 3014   │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                                              │
│  ┌─────────────┐                                                            │
│  │Order Service│                                                            │
│  │Port: 3015   │                                                            │
│  │+ WebSocket  │                                                            │
│  └─────────────┘                                                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATA LAYER                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│         ┌──────────────────┐           ┌──────────────────┐                 │
│         │     MongoDB      │           │      Redis       │                 │
│         │   Port: 27017    │           │   Port: 6379     │                 │
│         │   (Primary DB)   │           │   (Cache/Queue)  │                 │
│         └──────────────────┘           └──────────────────┘                 │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Micro-Frontend Architecture

### Module Federation

The platform uses **Webpack 5 Module Federation** for micro-frontend architecture:

| App | Role | Build Tool | Port |
|-----|------|------------|------|
| Shell App | Host Container | Webpack 5 | 3000 |
| Admin App | Remote Module | Vite | 3001 |
| Seller App | Remote Module | Vite | 3002 |
| Storefront | Standalone | Next.js 16 | 3003 |

### Shared Dependencies

```javascript
// Shared across all micro-frontends
{
  react: { singleton: true, requiredVersion: '^18.2.0' },
  'react-dom': { singleton: true, requiredVersion: '^18.2.0' },
  'react-router-dom': { singleton: true, requiredVersion: '^6.20.0' }
}
```

### Communication Flow

```
Shell App (Host)
    │
    ├── Loads AdminApp remotely at runtime
    │   └── adminApp@http://localhost:3001/remoteEntry.js
    │
    └── Loads SellerApp remotely at runtime
        └── sellerApp@http://localhost:3002/remoteEntry.js
```

---

## 🔧 Microservices Architecture

### Service Responsibilities

| Service | Port | Responsibilities |
|---------|------|------------------|
| **Auth Service** | 3011 | User authentication, JWT tokens, OAuth, password management |
| **Category Service** | 3012 | Product categories, hierarchical structure |
| **Coupon Service** | 3013 | Discount codes, promotions, validation |
| **Product Service** | 3014 | Product CRUD, inventory, reviews |
| **Order Service** | 3015 | Order management, payments, real-time updates |
| **GraphQL Gateway** | 4000 | API aggregation, schema stitching |

### Service Communication

```
┌─────────────────┐
│ GraphQL Gateway │
└────────┬────────┘
         │
    REST API Calls
         │
    ┌────┴────┬────────┬────────┬────────┐
    ▼         ▼        ▼        ▼        ▼
┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐
│ Auth  │ │ Cat.  │ │Coupon │ │Product│ │ Order │
└───────┘ └───────┘ └───────┘ └───────┘ └───────┘
```

---

## 📦 Shared Packages

### Monorepo Structure

```
packages/
├── types/          # TypeScript type definitions
├── utils/          # Shared utilities, constants, configs
│   ├── src/
│   │   ├── api/           # GraphQL client, API helpers
│   │   ├── config/        # Webpack, Vite, Tailwind configs
│   │   ├── constants/     # App constants, ports, URLs
│   │   ├── graphql/       # GraphQL queries & mutations
│   │   └── validation/    # Zod schemas, validators
│   └── dist/              # Compiled output
└── ui-library/     # Shared UI components
    ├── src/
    │   ├── components/    # Reusable React components
    │   └── theme/         # DaisyUI theme configuration
    └── dist/
```

### Package Exports

```typescript
// @3asoftwares/utils
export { PORT_CONFIG, DEFAULT_CORS_ORIGINS } from './constants';
export { Logger } from './server';
export { getAccessToken, clearAuth } from './client';

// @3asoftwares/utils/client (browser-safe)
export { GraphQLClient, createGraphQLClient } from './api';
export * from './graphql/queries';
export * from './graphql/mutations';

// @3asoftwares/ui
export { Button, Input, Card, Modal } from './components';
```

---

## 🔐 Authentication Flow

```
┌──────────┐     ┌──────────────┐     ┌─────────────┐
│  Client  │────▶│ Auth Service │────▶│  MongoDB    │
└──────────┘     └──────────────┘     └─────────────┘
     │                  │
     │                  │ JWT Tokens
     │                  ▼
     │           ┌──────────────┐
     │           │ Access Token │ (1 hour)
     │           │Refresh Token │ (7 days)
     │           └──────────────┘
     │                  │
     ▼                  ▼
┌──────────────────────────────────┐
│        Protected Routes          │
│   (Token in Authorization Header)│
└──────────────────────────────────┘
```

### Token Storage

- **Access Token**: httpOnly cookie / localStorage
- **Refresh Token**: httpOnly cookie
- **Token Refresh**: Automatic via interceptors

---

## 🗄️ Database Schema

### MongoDB Collections

```
ecommerce/
├── users              # User accounts, profiles
├── addresses          # User shipping addresses
├── categories         # Product categories
├── products           # Product catalog
├── reviews            # Product reviews
├── orders             # Customer orders
├── orderitems         # Order line items
└── coupons            # Discount codes
```

### Data Relationships

```
User ─┬─▶ Orders ──▶ OrderItems ──▶ Products
      │
      └─▶ Addresses
      │
      └─▶ Reviews ──▶ Products

Categories ──▶ Products
Coupons ──▶ Orders
```

---

## 🚀 Deployment Architecture

### Local Development

```
┌─────────────────────────────────────────┐
│           Docker Compose                 │
├─────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │ MongoDB │  │  Redis  │  │   App   │ │
│  │ :27017  │  │  :6379  │  │:3000-15 │ │
│  └─────────┘  └─────────┘  └─────────┘ │
└─────────────────────────────────────────┘
```

### Production (Vercel + Cloud)

```
┌─────────────────────────────────────────┐
│              Vercel Edge                 │
├─────────────────────────────────────────┤
│  Frontend Apps (Serverless Functions)   │
│  ├── Shell App                          │
│  ├── Admin App                          │
│  ├── Seller App                         │
│  └── Storefront                         │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│         Vercel Serverless               │
├─────────────────────────────────────────┤
│  Backend Services (API Routes)          │
│  ├── Auth Service                       │
│  ├── GraphQL Gateway                    │
│  └── Other Services                     │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│           Cloud Databases               │
├─────────────────────────────────────────┤
│  ┌─────────────────┐  ┌───────────────┐│
│  │  MongoDB Atlas  │  │  Redis Labs   ││
│  │  (M0 Free Tier) │  │  (Free Tier)  ││
│  └─────────────────┘  └───────────────┘│
└─────────────────────────────────────────┘
```

---

## 📡 API Design

### GraphQL Schema Structure

```graphql
type Query {
  # Auth
  me: User
  getUserById(id: ID!): User
  
  # Products
  products(filter: ProductFilter, pagination: Pagination): ProductConnection
  product(id: ID!): Product
  
  # Orders
  orders(customerId: ID): [Order]
  order(id: ID!): Order
  
  # Categories
  categories: [Category]
  category(id: ID!): Category
}

type Mutation {
  # Auth
  register(input: RegisterInput!): AuthPayload
  login(input: LoginInput!): AuthPayload
  
  # Products
  createProduct(input: ProductInput!): Product
  updateProduct(id: ID!, input: ProductInput!): Product
  
  # Orders
  createOrder(input: OrderInput!): Order
  updateOrderStatus(id: ID!, status: OrderStatus!): Order
}

type Subscription {
  orderStatusChanged(orderId: ID!): Order
}
```

### REST API Endpoints (Per Service)

```
Auth Service (3011):
  POST   /api/auth/register
  POST   /api/auth/login
  POST   /api/auth/refresh
  GET    /api/users/:id
  PUT    /api/users/:id

Product Service (3014):
  GET    /api/products
  GET    /api/products/:id
  POST   /api/products
  PUT    /api/products/:id
  DELETE /api/products/:id

Order Service (3015):
  GET    /api/orders
  GET    /api/orders/:id
  POST   /api/orders
  PUT    /api/orders/:id/status
  WS     /ws (Real-time updates)
```

---

## 🔄 State Management

### Frontend State

| App | State Solution | Use Case |
|-----|----------------|----------|
| Shell App | React Context | Auth, Theme |
| Admin App | React Query | Server State |
| Seller App | React Query | Server State |
| Storefront | Apollo Client | GraphQL Cache |

### Caching Strategy

```
┌─────────────────────────────────────────┐
│           Browser Cache                  │
│  ├── Apollo InMemoryCache               │
│  └── React Query Cache                  │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│              Redis Cache                 │
│  ├── Session data                       │
│  ├── Rate limiting                      │
│  └── Frequently accessed data           │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│              MongoDB                     │
│  └── Persistent data storage            │
└─────────────────────────────────────────┘
```

---

## 📊 Monitoring & Observability

### Logging

- **Logger**: Custom Logger utility (`@3asoftwares/utils/server`)
- **Log Levels**: debug, info, warn, error
- **Output**: Console + File (configurable)

### Health Checks

Each service exposes:
- `GET /health` - Service health status
- `GET /api-docs` - Swagger documentation

---

## 🔐 Security Measures

1. **Authentication**: JWT with refresh tokens
2. **Authorization**: Role-based access control (RBAC)
3. **CORS**: Configurable allowed origins
4. **Helmet**: HTTP security headers
5. **Rate Limiting**: Redis-based rate limiting
6. **Input Validation**: Zod schemas on all inputs
7. **Password Hashing**: bcrypt with salt rounds

---

## 📚 Related Documentation

- [Technology Stack](TECHNOLOGY_STACK.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Docker Setup](DOCKER_SETUP.md)
- [CI/CD Pipeline](CI_CD_PIPELINE.md)
- [API Documentation](API_DOCUMENTATION.md)
- [Security Best Practices](SECURITY.md)

---

**Last Updated**: January 10, 2026
**Version**: 1.0.0
