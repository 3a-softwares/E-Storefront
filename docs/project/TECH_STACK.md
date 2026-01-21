# Technology Stack

## 📑 Table of Contents

- [Overview](#overview)
- [Frontend Technologies](#frontend-technologies)
- [Backend Technologies](#backend-technologies)
- [Infrastructure](#infrastructure)
- [Testing](#testing)
- [CI/CD](#cicd)
- [Shared Packages](#shared-packages)

---

## 🌐 Overview

E-Storefront is a full-stack e-commerce platform built with modern technologies across multiple applications.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           E-STOREFRONT TECH STACK                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  FRONTEND                           BACKEND                                  │
│  ┌───────────────────────┐         ┌───────────────────────┐               │
│  │ Next.js 15           │         │ Node.js + Express     │               │
│  │ React 19 / React 18  │         │ GraphQL Gateway       │               │
│  │ TypeScript 5.0+      │         │ MongoDB + Mongoose    │               │
│  │ Tailwind CSS         │         │ Redis                 │               │
│  │ Zustand              │         │ Socket.IO             │               │
│  │ React Query          │         │ JWT Authentication    │               │
│  └───────────────────────┘         └───────────────────────┘               │
│                                                                              │
│  MOBILE                             INFRASTRUCTURE                          │
│  ┌───────────────────────┐         ┌───────────────────────┐               │
│  │ React Native / Expo  │         │ Docker + Compose      │               │
│  │ TypeScript           │         │ Kubernetes            │               │
│  │ NativeWind           │         │ GitHub Actions        │               │
│  │ Zustand              │         │ Vercel / AWS          │               │
│  └───────────────────────┘         └───────────────────────┘               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Frontend Technologies

### Web Application (E-Storefront-Web)

| Technology      | Version | Purpose                  |
| --------------- | ------- | ------------------------ |
| Next.js         | 15.x    | React framework with SSR |
| React           | 19.x    | UI library               |
| TypeScript      | 5.0+    | Type-safe JavaScript     |
| Tailwind CSS    | 4.x     | Utility-first CSS        |
| Zustand         | 5.x     | Client state management  |
| TanStack Query  | 5.x     | Server state management  |
| GraphQL Request | 7.x     | GraphQL client           |
| next-pwa        | 5.x     | PWA support              |

### Mobile Application (E-Storefront-Mobile)

| Technology       | Version | Purpose               |
| ---------------- | ------- | --------------------- |
| React Native     | 0.76+   | Cross-platform mobile |
| Expo             | 52.x    | Development platform  |
| TypeScript       | 5.0+    | Type-safe JavaScript  |
| NativeWind       | 4.x     | Tailwind for RN       |
| Zustand          | 5.x     | State management      |
| Expo Router      | 4.x     | File-based routing    |
| Expo SecureStore | 14.x    | Secure storage        |

### Admin/Seller Apps (Micro-Frontends)

| Technology | Version | Purpose                    |
| ---------- | ------- | -------------------------- |
| React      | 18.x    | UI library                 |
| Vite       | 6.x     | Build tool                 |
| TypeScript | 5.0+    | Type-safe JavaScript       |
| Webpack    | 5.x     | Module Federation (shell)  |
| Tailwind   | 4.x     | Styling                    |
| DaisyUI    | 4.x     | Tailwind component library |

### Support Portal (E-Storefront-Support)

| Technology     | Version | Purpose            |
| -------------- | ------- | ------------------ |
| JavaScript     | ES6+    | Core scripting     |
| HTML5          | -       | Page structure     |
| CSS3           | -       | Base styling       |
| SCSS           | 1.69    | CSS preprocessor   |
| Bootstrap      | 5.0     | UI framework       |
| Material Icons | -       | Icon library       |
| Fetch API      | -       | HTTP requests      |
| live-server    | 1.2     | Development server |

#### Design Patterns

| Pattern    | Purpose                   |
| ---------- | ------------------------- |
| MVC        | Application architecture  |
| Singleton  | Service instances         |
| Debouncing | Search input optimization |
| Throttling | Scroll event handling     |

---

## ⚙️ Backend Technologies

### Microservices

| Technology | Version | Purpose               |
| ---------- | ------- | --------------------- |
| Node.js    | 20.x    | JavaScript runtime    |
| Express    | 4.x     | Web framework         |
| TypeScript | 5.0+    | Type-safe development |
| MongoDB    | 8.x     | Primary database      |
| Mongoose   | 8.x     | MongoDB ODM           |
| Redis      | 5.x     | Caching & sessions    |

### API Gateway

| Technology    | Version | Purpose            |
| ------------- | ------- | ------------------ |
| Apollo Server | 4.x     | GraphQL server     |
| GraphQL       | 16.x    | Query language     |
| DataLoader    | 2.x     | Batching & caching |

### Authentication

| Technology | Version | Purpose                    |
| ---------- | ------- | -------------------------- |
| JWT        | 9.x     | Token-based authentication |
| bcryptjs   | 2.x     | Password hashing           |
| Passport   | 0.7+    | Authentication middleware  |
| OAuth 2.0  | -       | Google/Social login        |

### Real-time

| Technology | Version | Purpose                 |
| ---------- | ------- | ----------------------- |
| Socket.IO  | 4.x     | WebSocket connections   |
| Redis Pub  | -       | Cross-service messaging |

---

## 🏗️ Infrastructure

### Containerization

| Technology     | Version | Purpose                 |
| -------------- | ------- | ----------------------- |
| Docker         | 24.x    | Containerization        |
| Docker Compose | 2.x     | Multi-container setup   |
| Kubernetes     | 1.28+   | Container orchestration |

### Cloud & Hosting

| Service       | Purpose            |
| ------------- | ------------------ |
| Vercel        | Web app hosting    |
| AWS EKS       | Kubernetes hosting |
| AWS ECR       | Docker registry    |
| MongoDB Atlas | Managed MongoDB    |
| Redis Cloud   | Managed Redis      |

### CI/CD

| Technology       | Purpose               |
| ---------------- | --------------------- |
| GitHub Actions   | CI/CD pipelines       |
| SonarCloud       | Code quality analysis |
| Docker Hub       | Image registry        |
| Semantic Release | Automated versioning  |

---

## 🧪 Testing

| Tool      | Purpose                           |
| --------- | --------------------------------- |
| Jest      | Unit testing (services)           |
| Vitest    | Unit testing (packages)           |
| Cypress   | E2E testing (Web/Mobile)          |
| Storybook | Component documentation & testing |

### Coverage Targets

| Metric     | Target |
| ---------- | ------ |
| Lines      | ≥80%   |
| Branches   | ≥70%   |
| Functions  | ≥80%   |
| Statements | ≥80%   |

---

## 📦 Shared Packages

| Package            | Version | Purpose                     |
| ------------------ | ------- | --------------------------- |
| @3asoftwares/types | 1.0.6   | TypeScript type definitions |
| @3asoftwares/utils | 1.0.10  | Shared utility functions    |
| @3asoftwares/ui    | 1.0.4   | React component library     |

### Types Package (@3asoftwares/types)

| Technology | Version | Purpose                |
| ---------- | ------- | ---------------------- |
| TypeScript | 5.0+    | Type definitions       |
| tsup       | 8.x     | Build tool (CJS + ESM) |
| Vitest     | 2.x     | Unit testing           |

#### Exports

- User, UserRole, AuthPayload
- Product, ProductInput, ProductFilter
- Order, OrderStatus, OrderItem
- Category, CategoryTree
- ApiResponse, PaginatedResult, ErrorResponse

### Utils Package (@3asoftwares/utils)

| Technology | Version | Purpose                |
| ---------- | ------- | ---------------------- |
| TypeScript | 5.0+    | Type-safe utilities    |
| tsup       | 8.x     | Build tool (CJS + ESM) |
| Vitest     | 2.x     | Unit testing           |

#### Exports

| Export      | Purpose                     |
| ----------- | --------------------------- |
| `.`         | Main utilities (formatters) |
| `./client`  | Client-side utilities       |
| `./server`  | Server-side utilities       |
| `./backend` | Backend-specific utilities  |
| `./config`  | Shared tsconfig.base.json   |

### UI Library (@3asoftwares/ui)

| Technology      | Version | Purpose                    |
| --------------- | ------- | -------------------------- |
| React           | 18.2    | Component framework        |
| TypeScript      | 5.9+    | Type-safe components       |
| Storybook       | 8.6     | Component documentation    |
| Vite            | 5.4     | Build tool                 |
| Vitest          | 1.6     | Unit testing               |
| Tailwind CSS    | 3.4     | Styling                    |
| DaisyUI         | 4.4     | Tailwind component library |
| PostCSS         | 8.4     | CSS processing             |
| Testing Library | 16.3    | Component testing          |

#### Storybook Addons

| Addon        | Version | Purpose                       |
| ------------ | ------- | ----------------------------- |
| essentials   | 8.6     | Core Storybook features       |
| interactions | 8.6     | Component interaction testing |
| a11y         | 8.6     | Accessibility testing         |
| docs         | 8.6     | Documentation generation      |
| links        | 8.6     | Story navigation              |
| chromatic    | 3.2     | Visual regression testing     |

#### Component Categories

| Category | Components                        |
| -------- | --------------------------------- |
| Buttons  | Button, IconButton                |
| Forms    | Input, Select, Checkbox, TextArea |
| Layout   | Card, Modal, Container, Grid      |
| Feedback | Alert, Toast, Spinner, Badge      |
| Icons    | FontAwesome integration           |

---

## 🔧 Development Tools

| Tool       | Purpose                      |
| ---------- | ---------------------------- |
| VS Code    | Primary IDE                  |
| ESLint     | Code linting                 |
| Prettier   | Code formatting              |
| Husky      | Git hooks                    |
| Commitlint | Commit message linting       |
| Turborepo  | Monorepo build orchestration |

---

## Related Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
- [PACKAGES.md](PACKAGES.md) - Shared packages details
- [ENVIRONMENT.md](ENVIRONMENT.md) - Environment setup
