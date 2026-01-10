# 🛠️ Technology Stack - E-Commerce Platform

## 📊 Overview

| Layer               | Technology                                 |
| ------------------- | ------------------------------------------ |
| **Architecture**    | Microservices + Micro-frontends (Monorepo) |
| **Package Manager** | Yarn Workspaces                            |
| **Language**        | TypeScript 5.x                             |
| **Container**       | Docker + Docker Compose                    |
| **Orchestration**   | Kubernetes (K8s)                           |
| **Reverse Proxy**   | NGINX                                      |
| **CI/CD**           | GitHub Actions                             |
| **Deployment**      | Vercel (Frontend & Backend) / Kubernetes   |

---

## 🖥️ Frontend Applications

### 1. Storefront App (Customer-facing)

| Category             | Technology                        |
| -------------------- | --------------------------------- |
| **Framework**        | Next.js 16.1 (App Router)         |
| **UI Library**       | React 18.2                        |
| **Styling**          | Tailwind CSS 3.4 + DaisyUI 4.4    |
| **State Management** | Zustand 4.4, Recoil 0.7           |
| **Data Fetching**    | Apollo Client 3.8, TanStack Query 5.90 |
| **Icons**            | Font Awesome 7.1                  |
| **HTTP Client**      | Axios 1.6                         |
| **Testing**          | Jest 29.7 + React Testing Library 14.2 |

### 2. Admin App (Platform management)

| Category             | Technology                              |
| -------------------- | --------------------------------------- |
| **Build Tool**       | Vite 5.4 (resolved)                     |
| **UI Library**       | React 18.2                              |
| **Styling**          | Tailwind CSS 3.4 + DaisyUI 4.4          |
| **State Management** | Redux Toolkit 2.0, React Redux 9.0, Zustand 4.4 |
| **Data Fetching**    | TanStack Query 5.90                     |
| **Routing**          | React Router DOM 6.20                   |
| **Media**            | Cloudinary SDK 2.8                      |
| **Micro-frontend**   | Vite Plugin Federation 1.3              |
| **Icons**            | Font Awesome 7.1                        |
| **Testing**          | Jest 29.7 + React Testing Library 14.2  |

### 3. Seller App (Seller portal)

| Category             | Technology                              |
| -------------------- | --------------------------------------- |
| **Build Tool**       | Vite 5.4 (resolved)                     |
| **UI Library**       | React 18.2                              |
| **Styling**          | Tailwind CSS 3.4 + DaisyUI 4.4          |
| **State Management** | Redux Toolkit 2.0, React Redux 9.0      |
| **Data Fetching**    | TanStack Query 5.90                     |
| **Routing**          | React Router DOM 6.20                   |
| **Media**            | Cloudinary SDK 2.8                      |
| **Micro-frontend**   | Vite Plugin Federation 1.3              |
| **Icons**            | Font Awesome 7.1                        |
| **Testing**          | Jest 29.7 + React Testing Library 14.2  |

### 4. Shell App (Central launcher)

| Category             | Technology                           |
| -------------------- | ------------------------------------ |
| **Build Tool**       | Webpack 5.89                         |
| **Transpiler**       | Babel 7.23 (React + TypeScript presets) |
| **UI Library**       | React 18.2                           |
| **Styling**          | Tailwind CSS 3.4 + DaisyUI 4.4       |
| **State Management** | Zustand 4.4                          |
| **Routing**          | React Router DOM 6.20                |
| **Icons**            | Font Awesome 6.5                     |
| **Testing**          | Jest 29.7 + React Testing Library 14.2 |

---

## ⚙️ Backend Services

### Common Stack (All Services)

| Category        | Technology             |
| --------------- | ---------------------- |
| **Runtime**     | Node.js 20+            |
| **Framework**   | Express.js 4.18        |
| **Language**    | TypeScript 5.3         |
| **Database**    | MongoDB 8 (Mongoose 8.0) |
| **Security**    | Helmet 7.1, CORS 2.8   |
| **Logging**     | Morgan 1.10            |
| **Validation**  | Express Validator 7.0  |
| **Environment** | dotenv 16.3            |
| **Dev Server**  | Nodemon 3.0 + ts-node 10.9 |
| **Testing**     | Jest 29.7 + ts-jest 29.1 |

### Auth Service (Authentication & Authorization)

| Extra Feature        | Technology                                  |
| -------------------- | ------------------------------------------- |
| **Authentication**   | JWT (jsonwebtoken 9.0)                      |
| **Password Hashing** | bcryptjs 2.4                                |
| **Email**            | Nodemailer 6.10                             |
| **API Docs**         | Swagger (swagger-jsdoc 6.2, swagger-ui-express 5.0) |
| **Deployment**       | Vercel Serverless (@vercel/node)            |

### Product Service (Products & Inventory)

| Extra Feature | Technology           |
| ------------- | -------------------- |
| **Caching**   | Redis (ioredis 5.3)  |
| **Auth**      | JWT (jsonwebtoken 9.0) |
| **API Docs**  | Swagger (swagger-jsdoc 6.2, swagger-ui-express 5.0) |

### Order Service (Orders & Payments)

| Extra Feature    | Technology             |
| ---------------- | ---------------------- |
| **Real-time**    | Socket.IO 4.6          |
| **Auth**         | JWT (jsonwebtoken 9.0) |
| **API Docs**     | Swagger (swagger-jsdoc 6.2, swagger-ui-express 5.0) |

### Category Service (Product Categories)

| Extra Feature | Technology                                  |
| ------------- | ------------------------------------------- |
| **API Docs**  | Swagger (swagger-jsdoc 6.2, swagger-ui-express 5.0) |

### Coupon Service (Discounts & Promotions)

| Extra Feature | Technology             |
| ------------- | ---------------------- |
| **Auth**      | JWT (jsonwebtoken 9.0) |
| **API Docs**  | Swagger (swagger-jsdoc 6.2, swagger-ui-express 5.0) |

### GraphQL Gateway (API Aggregation)

| Extra Feature           | Technology              |
| ----------------------- | ----------------------- |
| **API Layer**           | Apollo Server 4.10      |
| **Query Language**      | GraphQL 16.8            |
| **HTTP Client**         | Axios 1.6               |
| **Next.js Integration** | @as-integrations/next 3.0 |

---

## 📦 Shared Packages

### @3asoftwares/types

| Category       | Technology                  |
| -------------- | --------------------------- |
| **Purpose**    | TypeScript type definitions |
| **Build Tool** | tsup 8.0                    |
| **Testing**    | Vitest 1.6 (resolved)       |

### @3asoftwares/utils

| Category       | Technology                           |
| -------------- | ------------------------------------ |
| **Purpose**    | Shared utilities, configs, constants |
| **Build Tool** | tsup 8.0                             |
| **Testing**    | Vitest 1.6 (resolved)                |
| **Exports**    | Client/Server split bundles          |
| **Configs**    | Jest, PostCSS, Tailwind, Vite, Vitest, Webpack |

### @3asoftwares/ui

| Category          | Technology                |
| ----------------- | ------------------------- |
| **Purpose**       | React component library   |
| **Build Tool**    | Vite 5.4 + tsup 8.0       |
| **Documentation** | Storybook 8.x             |
| **Testing**       | Vitest 1.6 (resolved)     |
| **Icons**         | Font Awesome 6.5          |

---

## 🧪 Testing Stack

| Layer              | Technology                         |
| ------------------ | ---------------------------------- |
| **Frontend Tests** | Jest 29 + React Testing Library 14 |
| **Backend Tests**  | Jest 29 + ts-jest                  |
| **Package Tests**  | Vitest 4                           |
| **Coverage**       | @vitest/coverage-v8                |

---

## 📐 Code Quality

| Tool                          | Purpose           |
| ----------------------------- | ----------------- |
| **ESLint 8**                  | Linting           |
| **TypeScript ESLint**         | TS-specific rules |
| **eslint-plugin-react**       | React rules       |
| **eslint-plugin-react-hooks** | Hooks rules       |
| **eslint-plugin-jsx-a11y**    | Accessibility     |
| **Prettier**                  | Code formatting   |

---

## 🏗️ Infrastructure & DevOps

### Container Orchestration

| Technology      | Purpose                                |
| --------------- | -------------------------------------- |
| **Docker**      | Containerization                       |
| **Docker Compose** | Local development & simple production |
| **Kubernetes**  | Production-grade orchestration         |
| **Helm**        | K8s package management (optional)      |

### NGINX (Reverse Proxy & Load Balancer)

| Feature              | Implementation                          |
| -------------------- | --------------------------------------- |
| **Reverse Proxy**    | Routes traffic to microservices         |
| **Load Balancing**   | Distributes load across service replicas |
| **Rate Limiting**    | API: 10 req/s, Auth: 5 req/s            |
| **Gzip Compression** | Reduces bandwidth, faster responses     |
| **Security Headers** | XSS, CSRF, Clickjacking protection      |
| **Static Serving**   | Admin & Seller app static files         |
| **WebSocket**        | GraphQL subscriptions support           |

### Kubernetes Features

| Feature                    | Purpose                              |
| -------------------------- | ------------------------------------ |
| **Deployments**            | Declarative pod management           |
| **Services**               | Internal networking & discovery      |
| **Ingress**                | External traffic routing             |
| **ConfigMaps**             | Configuration management             |
| **Secrets**                | Sensitive data storage               |
| **HPA**                    | Horizontal Pod Autoscaling           |
| **Network Policies**       | Pod-to-pod traffic control           |
| **PodDisruptionBudgets**   | High availability during updates     |
| **Resource Quotas**        | Namespace resource limits            |

### CI/CD Pipeline (GitHub Actions)

| Workflow               | Trigger                    | Purpose                           |
| ---------------------- | -------------------------- | --------------------------------- |
| **CI Pipeline**        | Push to any branch         | Build, test, lint all apps        |
| **Deploy to Vercel**   | Push to main (6hr throttle)| Deploy frontend apps              |
| **Deploy to K8s**      | Manual trigger             | Deploy to Kubernetes cluster      |
| **Manual Deploy**      | Manual trigger             | Deploy specific app to env        |
| **Team Notifications** | Workflow completion        | Notify team on success/failure    |
| **PR Labeler**         | PR opened                  | Auto-label based on files changed |
| **Stale Handler**      | Daily schedule             | Mark/close stale issues & PRs     |

### Deployment Options

| Option          | Use Case                    | Technology                    |
| --------------- | --------------------------- | ----------------------------- |
| **Vercel**      | Frontend apps (serverless)  | Automatic, edge deployment    |
| **Docker Compose** | Local dev, small production | Single-host deployment        |
| **Kubernetes**  | Large-scale production      | Multi-node, auto-scaling      |

---

## 📈 Technology Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                    E-COMMERCE PLATFORM                          │
├─────────────────────────────────────────────────────────────────┤
│  FRONTEND (4 Apps)           │  BACKEND (6 Services)           │
│  ─────────────────           │  ──────────────────             │
│  • Next.js 16.1 (Storefront) │  • Express.js 4.18              │
│  • Vite 5.4 (Admin, Seller)  │  • Apollo Server 4.10 (Gateway) │
│  • Webpack 5.89 (Shell)      │  • MongoDB 8 + Mongoose 8.0     │
│  • React 18.2 + TypeScript   │  • Redis (ioredis 5.3)          │
│  • Tailwind 3.4 + DaisyUI    │  • JWT Authentication           │
│  • Redux Toolkit / Zustand   │  • Socket.IO 4.6 (Real-time)    │
│  • TanStack Query / Apollo   │  • Swagger API Docs             │
├─────────────────────────────────────────────────────────────────┤
│  SHARED PACKAGES             │  INFRASTRUCTURE                 │
│  ────────────────            │  ──────────────                 │
│  • @3asoftwares/types        │  • Docker + Docker Compose      │
│  • @3asoftwares/utils        │  • Kubernetes (K8s)             │
│  • @3asoftwares/ui           │  • NGINX (Reverse Proxy/LB)     │
│  • Storybook 8.x             │  • GitHub Actions CI/CD         │
│  • tsup 8.0 Build Tool       │  • Vercel (Full Stack Deploy)   │
├─────────────────────────────────────────────────────────────────┤
│  TESTING STACK                                                  │
│  ─────────────                                                  │
│  • Jest 29.7 (Frontend & Backend)                               │
│  • Vitest 1.6 (Packages)                                        │
│  • React Testing Library 14.2                                   │
│  • ts-jest 29.1 (TypeScript)                                    │
│  • 833+ Test Cases                                              │
├─────────────────────────────────────────────────────────────────┤
│  DEVOPS & TEAM TOOLS                                            │
│  ───────────────────                                            │
│  • CODEOWNERS (Auto-assign reviewers)                           │
│  • PR Templates (Standardized PRs)                              │
│  • Issue Templates (Bug reports, Features)                      │
│  • Branch Protection Rules                                      │
│  • Deployment Environments (Staging, Production)                │
│  • Auto-labeling PRs                                            │
│  • Stale issue/PR management                                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
E-Commerce/
├── apps/                    # Frontend applications
│   ├── storefront-app/      # Next.js 16 (Customer store)
│   ├── admin-app/           # Vite + React (Platform admin)
│   ├── seller-app/          # Vite + React (Seller portal)
│   └── shell-app/           # Webpack + React (MFE container)
│
├── services/                # Backend microservices
│   ├── auth-service/        # Authentication & JWT
│   ├── product-service/     # Products & inventory
│   ├── order-service/       # Orders & checkout
│   ├── category-service/    # Product categories
│   ├── coupon-service/      # Discounts & coupons
│   └── graphql-gateway/     # Apollo GraphQL aggregator
│
├── packages/                # Shared libraries
│   ├── types/               # TypeScript definitions
│   ├── utils/               # Shared utilities
│   └── ui-library/          # React component library
│
├── k8s/                     # Kubernetes configurations
│   ├── apps/                # Frontend deployments
│   ├── services/            # Backend deployments
│   ├── database/            # MongoDB & Redis
│   ├── nginx/               # NGINX deployment
│   ├── ingress.yaml         # Ingress rules
│   ├── network-policies.yaml
│   └── deploy.ps1 / .sh     # Deploy scripts
│
├── nginx/                   # NGINX for Docker Compose
│   ├── Dockerfile
│   └── nginx.conf
│
├── .github/                 # GitHub configurations
│   ├── workflows/           # CI/CD pipelines
│   ├── CODEOWNERS           # Auto-assign reviewers
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── CONTRIBUTING.md
│   └── ISSUE_TEMPLATE/      # Bug & feature templates
│
└── docs/                    # Documentation
```

---

## 📊 Technology Count

| Category                   | Count                                       |
| -------------------------- | ------------------------------------------- |
| **Languages**              | 2 (TypeScript, JavaScript)                  |
| **Frontend Frameworks**    | 2 (React 18.2, Next.js 16.1)                |
| **Build Tools**            | 4 (Vite 5.4, Webpack 5.89, tsup 8.0, Next.js) |
| **State Management**       | 4 (Redux Toolkit, Zustand, Recoil, TanStack Query) |
| **Databases**              | 2 (MongoDB 8, Redis)                        |
| **Testing Frameworks**     | 2 (Jest 29.7, Vitest 1.6)                   |
| **Infrastructure**         | 4 (Docker, K8s, NGINX, Vercel)              |
| **CI/CD Workflows**        | 10                                          |
| **Test Cases**             | 833+                                        |
| **Total npm Dependencies** | ~120+ packages                              |
