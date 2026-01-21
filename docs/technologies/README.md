# E-Storefront Technology Stack

Comprehensive technology documentation for all E-Storefront projects.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          E-Storefront Platform                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │   Web App   │  │ Mobile App  │  │  Admin App  │  │ Seller App  │   │
│  │   Next.js   │  │ React Native│  │    Vite     │  │    Vite     │   │
│  │  Tailwind   │  │    Expo     │  │   Redux TK  │  │   Redux TK  │   │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘   │
│         │                │                │                │           │
│         └────────────────┴────────────────┴────────────────┘           │
│                                   │                                     │
│                         ┌─────────▼─────────┐                          │
│                         │  GraphQL Gateway  │                          │
│                         │   Apollo Server   │                          │
│                         └─────────┬─────────┘                          │
│                                   │                                     │
│         ┌────────────┬────────────┼────────────┬────────────┐          │
│         ▼            ▼            ▼            ▼            ▼          │
│    ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐        │
│    │  Auth   │ │ Product │ │  Order  │ │Category │ │ Coupon  │        │
│    │ Service │ │ Service │ │ Service │ │ Service │ │ Service │        │
│    └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘        │
│         └───────────┴───────────┴───────────┴───────────┘              │
│                              │       │                                  │
│                        ┌─────▼─┐ ┌───▼───┐                             │
│                        │MongoDB│ │ Redis │                             │
│                        └───────┘ └───────┘                             │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                     E-Storefront-Support                          │  │
│  │                    Bootstrap + SCSS + JS                          │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Documentation Index

### Core Technologies

| Document                       | Description                         |
| ------------------------------ | ----------------------------------- |
| [NODEJS.md](NODEJS.md)         | Node.js runtime & microservices     |
| [GRAPHQL.md](GRAPHQL.md)       | GraphQL API, Apollo Server & Client |
| [TYPESCRIPT.md](TYPESCRIPT.md) | TypeScript configuration & patterns |
| [NEXTJS.md](NEXTJS.md)         | Next.js 16 App Router               |
| [REACT.md](REACT.md)           | React patterns & components         |
| [MOBILE.md](MOBILE.md)         | React Native, Expo, Expo Router     |

### State Management

| Document                                   | Description                      |
| ------------------------------------------ | -------------------------------- |
| [STATE_MANAGEMENT.md](STATE_MANAGEMENT.md) | Zustand & Redux Toolkit          |
| [REACT_QUERY.md](REACT_QUERY.md)           | TanStack Query for data fetching |

### Backend

| Document                   | Description                    |
| -------------------------- | ------------------------------ |
| [EXPRESS.md](EXPRESS.md)   | Express.js microservices       |
| [MONGODB.md](MONGODB.md)   | MongoDB with Mongoose          |
| [REDIS.md](REDIS.md)       | Caching & session storage      |
| [JWT.md](JWT.md)           | Authentication & authorization |
| [SOCKETIO.md](SOCKETIO.md) | Real-time communication        |

### Styling

| Document                     | Description               |
| ---------------------------- | ------------------------- |
| [STYLING.md](STYLING.md)     | Tailwind CSS patterns     |
| [DAISYUI.md](DAISYUI.md)     | DaisyUI component library |
| [BOOTSTRAP.md](BOOTSTRAP.md) | Bootstrap 5 framework     |
| [SCSS.md](SCSS.md)           | SCSS preprocessor         |

### Build Tools

| Document                       | Description                   |
| ------------------------------ | ----------------------------- |
| [VITE.md](VITE.md)             | Vite for Admin/Seller apps    |
| [WEBPACK.md](WEBPACK.md)       | Webpack Module Federation     |
| [TSUP.md](TSUP.md)             | TypeScript package bundler    |
| [DOCKER.md](DOCKER.md)         | Containerization & deployment |
| [KUBERNETES.md](KUBERNETES.md) | Container orchestration       |

### Testing & Quality

| Document                                             | Description                     |
| ---------------------------------------------------- | ------------------------------- |
| [JEST.md](JEST.md)                                   | Unit & integration testing      |
| [VITEST.md](VITEST.md)                               | Vitest for UI Library testing   |
| [CYPRESS.md](CYPRESS.md)                             | End-to-end testing              |
| [REACT_TESTING_LIBRARY.md](REACT_TESTING_LIBRARY.md) | React component testing         |
| [TDD.md](TDD.md)                                     | Test-Driven Development         |
| [STORYBOOK.md](STORYBOOK.md)                         | Component development & testing |
| [ESLINT_PRETTIER.md](ESLINT_PRETTIER.md)             | Linting & formatting            |
| [SONARCLOUD.md](SONARCLOUD.md)                       | Code quality analysis           |
| [LIGHTHOUSE.md](LIGHTHOUSE.md)                       | Performance auditing            |

### DevOps & Infrastructure

| Document                         | Description               |
| -------------------------------- | ------------------------- |
| [CI_CD.md](CI_CD.md)             | GitHub Actions pipelines  |
| [NGINX.md](NGINX.md)             | Web server & reverse proxy|
| [PERFORMANCE.md](PERFORMANCE.md) | Optimization techniques   |

### Security & APIs

| Document                     | Description                      |
| ---------------------------- | -------------------------------- |
| [REST_API.md](REST_API.md)   | RESTful API design               |
| [OAUTH.md](OAUTH.md)         | OAuth 2.0 authentication         |
| [CORS.md](CORS.md)           | Cross-Origin Resource Sharing    |
| [MIDDLEWARE.md](MIDDLEWARE.md)| Express middleware patterns     |

### Architecture & Patterns

| Document                               | Description                    |
| -------------------------------------- | ------------------------------ |
| [MICROSERVICES.md](MICROSERVICES.md)   | Microservices architecture     |
| [MICROFRONTEND.md](MICROFRONTEND.md)   | Micro-frontend with Module Fed |
| [DESIGN_PATTERNS.md](DESIGN_PATTERNS.md)| MVC, Factory, Singleton, etc. |
| [INTERNATIONALIZATION.md](INTERNATIONALIZATION.md) | i18n & localization |
| [THEMING.md](THEMING.md)               | Dark mode & theme system       |
| [CSS.md](CSS.md)                       | Modern CSS techniques          |

### Development Practices

| Document                                     | Description                      |
| -------------------------------------------- | -------------------------------- |
| [GIT.md](GIT.md)                             | Git, GitHub, GitLab              |
| [CODE_REVIEWS.md](CODE_REVIEWS.md)           | PR reviews & best practices      |
| [AGILE_SCRUM.md](AGILE_SCRUM.md)             | Agile methodology & Scrum        |
| [PROJECT_MANAGEMENT.md](PROJECT_MANAGEMENT.md)| Planning & architecture oversight|
| [GITHUB_COPILOT.md](GITHUB_COPILOT.md)       | AI-powered development           |

---

## Technology by Project

### E-Storefront-Web

- **Framework:** Next.js 16.1.1
- **Styling:** Tailwind CSS, DaisyUI
- **State:** Zustand
- **Data:** Apollo Client, React Query
- **Testing:** Jest, Cypress

### E-Storefront-Mobile

- **Framework:** React Native 0.74.5
- **Platform:** Expo SDK 51
- **Navigation:** Expo Router 3.5
- **State:** Zustand
- **Data:** React Query

### Admin & Seller Apps

- **Build:** Vite
- **State:** Redux Toolkit + RTK Query
- **Styling:** Tailwind CSS

### Backend Services

- **Runtime:** Node.js
- **Framework:** Express.js
- **API:** Apollo Server (GraphQL Gateway)
- **Database:** MongoDB
- **Cache:** Redis
- **Auth:** JWT

### E-Storefront-Support

- **Styling:** Bootstrap 5, SCSS
- **JavaScript:** ES6+
- **Hosting:** Vercel

---

## Quick Links

- [TECHNOLOGY-STACK.md](../TECHNOLOGY-STACK.md) - Complete platform overview
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines
- [CHANGELOG.md](../CHANGELOG.md) - Version history
