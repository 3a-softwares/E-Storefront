# Shared Packages Documentation

## 📑 Table of Contents

- [Overview](#overview)
- [@3asoftwares/types](#3asoftwarestypes)
- [@3asoftwares/utils](#3asoftwaresutils)
- [@3asoftwares/ui](#3asoftwaresui)
- [Development](#development)
- [Testing](#testing)

## 🌐 Overview

E-Storefront uses a monorepo structure with shared packages that are published to npm and consumed by all applications.

```
packages/
├── types/        → @3asoftwares/types
├── utils/        → @3asoftwares/utils
└── ui-library/   → @3asoftwares/ui
```

### Package Relationships

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PACKAGE ARCHITECTURE                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         @3asoftwares/types                           │   │
│  │                                                                      │   │
│  │  TypeScript interfaces and type definitions                         │   │
│  │  • No runtime dependencies                                          │   │
│  │  • Used by all other packages                                       │   │
│  └───────────────────────────────┬─────────────────────────────────────┘   │
│                                  │                                          │
│                    ┌─────────────┴─────────────┐                           │
│                    │                           │                           │
│                    ▼                           ▼                           │
│  ┌─────────────────────────────┐  ┌─────────────────────────────────────┐ │
│  │     @3asoftwares/utils      │  │         @3asoftwares/ui             │ │
│  │                             │  │                                     │ │
│  │  • formatPrice, formatDate  │  │  • Button, Input, Modal            │ │
│  │  • validation functions     │  │  • ProductCard, CartItem           │ │
│  │  • backend utilities        │  │  • Tailwind + DaisyUI              │ │
│  │  • client/server exports    │  │  • Storybook documentation         │ │
│  └─────────────────────────────┘  └─────────────────────────────────────┘ │
│                    │                           │                           │
│                    └─────────────┬─────────────┘                           │
│                                  │                                          │
│                                  ▼                                          │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                        CONSUMING APPS                                 │  │
│  │                                                                       │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │  │
│  │  │  Shell App   │  │  Admin App   │  │  Seller App  │               │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘               │  │
│  │                                                                       │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │  │
│  │  │   Web App    │  │  Mobile App  │  │   Services   │               │  │
│  │  │  (Next.js)   │  │   (Expo)     │  │  (Backend)   │               │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘               │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📦 @3asoftwares/types

TypeScript type definitions shared across all applications and services.

### Installation

```bash
npm install @3asoftwares/types
# or
yarn add @3asoftwares/types
```

### Usage

```typescript
import {
  User,
  UserRole,
  Product,
  Order,
  OrderStatus,
  ApiResponse,
  PaginationInput,
} from '@3asoftwares/types';

// Type a user object
const user: User = {
  id: '123',
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  role: UserRole.CUSTOMER,
};

// Type API responses
const response: ApiResponse<Product[]> = {
  success: true,
  data: products,
  message: 'Products fetched successfully',
};
```

### Available Types

| Category       | Types                                                           |
| -------------- | --------------------------------------------------------------- |
| **Auth**       | `User`, `UserRole`, `AuthTokens`, `LoginInput`, `RegisterInput` |
| **Products**   | `Product`, `ProductVariant`, `ProductInput`, `ProductFilter`    |
| **Categories** | `Category`, `CategoryInput`, `CategoryTree`                     |
| **Orders**     | `Order`, `OrderItem`, `OrderStatus`, `OrderInput`               |
| **Cart**       | `Cart`, `CartItem`, `CartInput`                                 |
| **Coupons**    | `Coupon`, `CouponType`, `CouponInput`                           |
| **Common**     | `ApiResponse`, `PaginationInput`, `PaginatedResponse`           |
| **GraphQL**    | `GraphQLContext`, `ResolverContext`                             |

### Directory Structure

```
packages/types/
├── src/
│   ├── index.ts           # Main exports
│   ├── auth.types.ts      # Authentication types
│   ├── product.types.ts   # Product types
│   ├── order.types.ts     # Order types
│   ├── category.types.ts  # Category types
│   ├── coupon.types.ts    # Coupon types
│   └── common.types.ts    # Shared/common types
├── package.json
└── tsconfig.json
```

---

## 🛠️ @3asoftwares/utils

Utility functions for both client and server-side usage.

### Installation

```bash
npm install @3asoftwares/utils
# or
yarn add @3asoftwares/utils
```

### Client Utilities

Browser-safe utilities for frontend applications:

```typescript
import {
  formatPrice,
  formatDate,
  truncateText,
  slugify,
  debounce,
  throttle,
} from '@3asoftwares/utils/client';

// Format currency
formatPrice(99.99); // "$99.99"
formatPrice(99.99, 'EUR'); // "€99.99"

// Format dates
formatDate(new Date()); // "Jan 20, 2026"
formatDate(date, 'full'); // "Monday, January 20, 2026"

// Debounce search
const debouncedSearch = debounce(search, 300);
```

### Server Utilities

Node.js utilities for backend services:

```typescript
import {
  validateEmail,
  validatePassword,
  hashPassword,
  comparePassword,
  generateToken,
} from '@3asoftwares/utils/server';

// Validation
validateEmail('user@example.com'); // true
validatePassword('Abc123!@#'); // { valid: true, errors: [] }

// Password hashing
const hash = await hashPassword('password123');
const isValid = await comparePassword('password123', hash);
```

### Backend Utilities

Express middleware and logging utilities:

```typescript
import {
  createLogger,
  errorHandler,
  rateLimiter,
  corsMiddleware,
} from '@3asoftwares/utils/backend';

// Create service logger
const logger = createLogger('product-service');
logger.info('Service started');
logger.error('Error occurred', { error });

// Express middleware
app.use(corsMiddleware());
app.use(rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(errorHandler());
```

### Directory Structure

```
packages/utils/
├── src/
│   ├── index.ts           # Combined exports
│   ├── client.ts          # Client-side utilities
│   ├── server.ts          # Server-side utilities
│   ├── backend.ts         # Express/backend utilities
│   ├── formatters/        # Formatting functions
│   ├── validators/        # Validation functions
│   ├── helpers/           # Helper functions
│   └── config/            # Shared configurations
├── package.json
└── tsconfig.json
```

---

## 🎨 @3asoftwares/ui

React UI component library with Tailwind CSS and DaisyUI.

### Installation

```bash
npm install @3asoftwares/ui
# or
yarn add @3asoftwares/ui
```

### Setup

```tsx
// 1. Import styles in your app's root
import '@3asoftwares/ui/styles.css';

// 2. Use components
import { Button, Input, Modal, ProductCard } from '@3asoftwares/ui';
```

### Components

#### Form Components

```tsx
import { Button, Input, Select, Checkbox, TextArea } from '@3asoftwares/ui';

<Button variant="primary" size="lg" onClick={handleClick}>
  Submit
</Button>

<Input
  label="Email"
  type="email"
  error={errors.email}
  {...register('email')}
/>

<Select
  label="Category"
  options={categories}
  value={selected}
  onChange={setSelected}
/>
```

#### E-commerce Components

```tsx
import { ProductCard, CartItem, PriceTag, Rating } from '@3asoftwares/ui';

<ProductCard
  product={product}
  onAddToCart={handleAddToCart}
  onWishlist={handleWishlist}
/>

<CartItem
  item={item}
  onQuantityChange={handleQuantity}
  onRemove={handleRemove}
/>

<PriceTag
  price={99.99}
  compareAtPrice={129.99}
  showDiscount
/>

<Rating value={4.5} count={128} />
```

#### Feedback Components

```tsx
import { Modal, Toast, Alert, Spinner } from '@3asoftwares/ui';

<Modal isOpen={isOpen} onClose={onClose} title="Confirm">
  <p>Are you sure?</p>
</Modal>

<Toast type="success" message="Item added to cart!" />

<Alert variant="warning">
  Stock is running low
</Alert>

<Spinner size="lg" />
```

### Storybook

Run Storybook to explore all components:

```bash
cd packages/ui-library
yarn storybook
```

Access at: http://localhost:6006

### Directory Structure

```
packages/ui-library/
├── src/
│   ├── index.ts              # Main exports
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── Button.stories.tsx
│   │   ├── Input/
│   │   ├── Modal/
│   │   ├── ProductCard/
│   │   └── ...
│   ├── hooks/                # Shared hooks
│   └── styles/               # Global styles
├── .storybook/               # Storybook config
├── package.json
└── tailwind.config.js
```

---

## 💻 Development

### Building Packages

```bash
# Build all packages
yarn build:packages

# Build specific package
yarn workspace @3asoftwares/types build
yarn workspace @3asoftwares/utils build
yarn workspace @3asoftwares/ui build

# Watch mode (for development)
cd packages/types && yarn dev
```

### Adding New Features

1. **Create the feature** in the appropriate package
2. **Export from index.ts**
3. **Add tests**
4. **Update documentation**
5. **Bump version** if publishing

### Local Development

Link packages locally for testing:

```bash
# Packages are automatically linked via yarn workspaces
# Changes are reflected immediately in consuming apps
yarn dev:all
```

---

## 🧪 Testing

### Run Package Tests

```bash
# All packages
yarn test:packages

# Specific package
yarn workspace @3asoftwares/types test
yarn workspace @3asoftwares/utils test
yarn workspace @3asoftwares/ui test

# With coverage
yarn workspace @3asoftwares/utils test:coverage
```

### Test Examples

```typescript
// packages/utils/src/__tests__/formatPrice.test.ts
import { formatPrice } from '../client';

describe('formatPrice', () => {
  it('formats USD correctly', () => {
    expect(formatPrice(99.99)).toBe('$99.99');
  });

  it('formats EUR correctly', () => {
    expect(formatPrice(99.99, 'EUR')).toBe('€99.99');
  });

  it('handles zero', () => {
    expect(formatPrice(0)).toBe('$0.00');
  });
});
```

---

## 🔗 Related Documentation

- [PUBLISHING.md](./PUBLISHING.md) - Package publishing guide
- [TESTING.md](./TESTING.md) - Testing strategies
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Development workflow

---

© 2026 3A Softwares
