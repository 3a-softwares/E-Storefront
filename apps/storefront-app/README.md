# Storefront App

## Overview

Customer-facing e-commerce storefront with product browsing, cart management, and checkout functionality - the main shopping experience for end users.

## Tech Stack

### Frontend Framework

- **Next.js 16** - React framework with SSR/SSG
- **React 18** - UI library
- **TypeScript 5** - Type-safe development

### State Management

- **Zustand** - Cart and UI state
- **TanStack React Query** - Server state and caching
- **Recoil** - Additional state management

### API

- **Apollo Client** - GraphQL client
- **Axios** - REST API calls
- **GraphQL** - Query language

### Styling

- **Tailwind CSS 3.4** - Utility-first CSS
- **DaisyUI 4** - Component library

### Testing

- **Jest 29** - Test runner
- **React Testing Library 14** - Component testing

### Icons

- **FontAwesome** - Icon library

## Features

- ✅ Product catalog with search and filters
- ✅ Category-based browsing
- ✅ Product detail pages with reviews
- ✅ Shopping cart management
- ✅ User authentication
- ✅ Order placement
- ✅ Address management
- ✅ Order history
- ✅ Coupon/discount application
- ✅ Responsive design
- ✅ Dark/Light theme

## Project Structure

```
app/              # Next.js App Router pages
├── page.tsx      # Home page
├── products/     # Product pages
├── cart/         # Cart page
├── checkout/     # Checkout flow
├── orders/       # Order history
└── profile/      # User profile
components/       # Reusable components
├── Header.tsx
├── Footer.tsx
├── ProductCard.tsx
├── ProductReviews.tsx
└── ...
lib/              # Utilities and API clients
store/            # State management
public/           # Static assets
```

## Scripts

```bash
yarn dev         # Start development server (port 3003)
yarn build       # Build for production
yarn start       # Start production server
yarn lint        # Run ESLint
yarn test        # Run tests
yarn test:watch  # Run tests in watch mode
yarn test:coverage # Run tests with coverage
```

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
```

## Port

- Development: `3003`

## Dependencies on Shared Packages

- `3a-ecommerce-types` - Shared TypeScript types
- `3a-ecommerce-ui-library` - Shared UI components
- `3a-ecommerce-utils` - Shared utilities
