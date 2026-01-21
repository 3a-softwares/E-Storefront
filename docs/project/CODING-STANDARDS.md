# Coding Standards

## 📑 Table of Contents

- [General Principles](#general-principles)
- [TypeScript Guidelines](#typescript-guidelines)
- [React Best Practices](#react-best-practices)
- [Node.js/Backend Standards](#nodejsbackend-standards)
- [File Naming Conventions](#file-naming-conventions)
- [Code Formatting](#code-formatting)
- [Comments & Documentation](#comments--documentation)

## 🎯 General Principles

### Core Values

| Principle       | Description                     |
| --------------- | ------------------------------- |
| **Readability** | Code should be self-documenting |
| **Consistency** | Follow established patterns     |
| **Simplicity**  | Prefer simple solutions         |
| **Testability** | Write testable code             |
| **Type Safety** | Leverage TypeScript fully       |

### DRY (Don't Repeat Yourself)

```typescript
// ❌ BAD: Repeated logic
const adminPrice = price * 0.9;
const sellerPrice = price * 0.85;

// ✅ GOOD: Reusable function
const applyDiscount = (price: number, discount: number) => price * (1 - discount);
const adminPrice = applyDiscount(price, 0.1);
const sellerPrice = applyDiscount(price, 0.15);
```

### KISS (Keep It Simple)

```typescript
// ❌ BAD: Over-engineered
const isActive = (() => {
  if (user.status === 'active') return true;
  if (user.status === 'inactive') return false;
  return false;
})();

// ✅ GOOD: Simple
const isActive = user.status === 'active';
```

---

## 📘 TypeScript Guidelines

### Use Strict Types

```typescript
// ❌ BAD: Using 'any'
function processData(data: any): any {
  return data.value;
}

// ✅ GOOD: Explicit types
interface ProcessedData {
  value: string;
  timestamp: Date;
}

function processData(data: RawData): ProcessedData {
  return {
    value: data.rawValue,
    timestamp: new Date(),
  };
}
```

### Prefer Interfaces for Objects

```typescript
// ✅ GOOD: Interface for object shapes
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

// ✅ GOOD: Type for unions/intersections
type UserRole = 'admin' | 'seller' | 'customer';
type AdminUser = User & { permissions: string[] };
```

### Use Readonly for Immutable Data

```typescript
// ✅ GOOD: Readonly props
interface ProductCardProps {
  readonly product: Product;
  readonly onAddToCart: (id: string) => void;
}

// ✅ GOOD: Readonly arrays
function processItems(items: readonly Item[]): void {
  // items.push() would error - good!
}
```

### Use Enums or Const Objects

```typescript
// ✅ GOOD: Const object for string enums
const OrderStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

// Usage
const status: OrderStatus = OrderStatus.PENDING;
```

### Null Safety

```typescript
// ❌ BAD: No null checking
const userName = user.name.toUpperCase();

// ✅ GOOD: Safe access
const userName = user?.name?.toUpperCase() ?? 'Unknown';

// ✅ GOOD: Type narrowing
if (user && user.name) {
  const userName = user.name.toUpperCase();
}
```

---

## ⚛️ React Best Practices

### Component Structure

```tsx
// components/ProductCard/ProductCard.tsx

// 1. Imports (React first, then third-party, then local)
import React, { useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

import { Product } from '@3asoftwares/types';
import { formatPrice } from '@3asoftwares/utils/client';
import { Button, Rating } from '@3asoftwares/ui';

import { useCartStore } from '@/store/cartStore';
import styles from './ProductCard.module.css';

// 2. Types/Interfaces
interface ProductCardProps {
  product: Product;
  showQuickAdd?: boolean;
  onSelect?: (product: Product) => void;
}

// 3. Component
export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showQuickAdd = true,
  onSelect,
}) => {
  // 3a. Hooks (state, store, refs)
  const [isHovered, setIsHovered] = useState(false);
  const addToCart = useCartStore((state) => state.addItem);

  // 3b. Memoized values
  const discountPercent = useMemo(() => {
    if (!product.compareAtPrice) return 0;
    return Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100);
  }, [product.price, product.compareAtPrice]);

  // 3c. Callbacks
  const handleAddToCart = useCallback(() => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]?.url,
    });
  }, [product, addToCart]);

  const handleSelect = useCallback(() => {
    onSelect?.(product);
  }, [product, onSelect]);

  // 3d. Early returns (guards)
  if (!product) return null;

  // 3e. Render
  return (
    <article
      className={styles.card}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleSelect}
    >
      {/* Content */}
    </article>
  );
};

// 4. Default export
export default ProductCard;
```

### Hooks Best Practices

```tsx
// ✅ GOOD: Custom hook for reusable logic
function useProductFilters(initialFilters: ProductFilter) {
  const [filters, setFilters] = useState(initialFilters);

  const updateFilter = useCallback((key: string, value: unknown) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  return { filters, updateFilter, resetFilters };
}

// ✅ GOOD: Memoize expensive computations
const sortedProducts = useMemo(() => products.sort((a, b) => a.price - b.price), [products]);

// ✅ GOOD: useCallback for stable references
const handleSubmit = useCallback(
  (data: FormData) => {
    submitForm(data);
  },
  [submitForm]
);
```

### Avoid Common Pitfalls

```tsx
// ❌ BAD: Object created on every render
<Button style={{ color: 'red' }} />;

// ✅ GOOD: Stable reference
const buttonStyle = useMemo(() => ({ color: 'red' }), []);
<Button style={buttonStyle} />;

// ❌ BAD: Missing dependencies
useEffect(() => {
  fetchUser(userId);
}, []); // Missing userId

// ✅ GOOD: All dependencies included
useEffect(() => {
  fetchUser(userId);
}, [userId]);

// ❌ BAD: Inline function in render
{
  items.map((item) => <Item onClick={() => handleClick(item.id)} />);
}

// ✅ GOOD: Callback with id
{
  items.map((item) => <Item onClick={handleClick} itemId={item.id} />);
}
```

---

## 🖥️ Node.js/Backend Standards

### Service Structure

```typescript
// services/product-service/src/services/productService.ts

import { Product, ProductInput } from '@3asoftwares/types';
import { createLogger } from '@3asoftwares/utils/backend';
import { ProductRepository } from '../repositories/productRepository';

const logger = createLogger('ProductService');

export class ProductService {
  constructor(private readonly repository: ProductRepository) {}

  async getProduct(id: string): Promise<Product | null> {
    logger.debug('Fetching product', { id });

    const product = await this.repository.findById(id);

    if (!product) {
      logger.warn('Product not found', { id });
      return null;
    }

    return product;
  }

  async createProduct(input: ProductInput): Promise<Product> {
    logger.info('Creating product', { name: input.name });

    // Validate input
    this.validateProductInput(input);

    // Create product
    const product = await this.repository.create(input);

    logger.info('Product created', { id: product.id });
    return product;
  }

  private validateProductInput(input: ProductInput): void {
    if (!input.name || input.name.trim().length === 0) {
      throw new Error('Product name is required');
    }
    if (input.price < 0) {
      throw new Error('Price cannot be negative');
    }
  }
}
```

### Error Handling

```typescript
// ✅ GOOD: Custom error classes
export class NotFoundError extends Error {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly errors: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Usage
if (!product) {
  throw new NotFoundError('Product', id);
}
```

### Async/Await Patterns

```typescript
// ✅ GOOD: Proper async error handling
async function fetchProducts(): Promise<Product[]> {
  try {
    const products = await productRepository.findAll();
    return products;
  } catch (error) {
    logger.error('Failed to fetch products', { error });
    throw error;
  }
}

// ✅ GOOD: Parallel async operations
async function getProductWithRelated(id: string) {
  const [product, reviews, related] = await Promise.all([
    productService.getProduct(id),
    reviewService.getProductReviews(id),
    productService.getRelatedProducts(id),
  ]);

  return { product, reviews, related };
}
```

---

## 📁 File Naming Conventions

### Files & Folders

| Type               | Convention               | Example                   |
| ------------------ | ------------------------ | ------------------------- |
| Components         | PascalCase               | `ProductCard.tsx`         |
| Pages (Next.js)    | lowercase                | `page.tsx`, `layout.tsx`  |
| Hooks              | camelCase + 'use' prefix | `useCart.ts`              |
| Utils/Helpers      | camelCase                | `formatPrice.ts`          |
| Types              | PascalCase + `.types`    | `product.types.ts`        |
| Tests              | same + `.test`           | `ProductCard.test.tsx`    |
| Stories            | same + `.stories`        | `ProductCard.stories.tsx` |
| Styles             | same + `.module`         | `ProductCard.module.css`  |
| Constants          | SCREAMING_SNAKE          | `ORDER_STATUS.ts`         |
| Services (backend) | camelCase + 'Service'    | `productService.ts`       |

### Folder Structure

```
# Frontend Component
components/
└── ProductCard/
    ├── index.ts              # Re-export
    ├── ProductCard.tsx       # Component
    ├── ProductCard.test.tsx  # Tests
    ├── ProductCard.stories.tsx
    └── ProductCard.module.css

# Backend Service
services/product-service/
└── src/
    ├── controllers/
    │   └── productController.ts
    ├── services/
    │   └── productService.ts
    ├── repositories/
    │   └── productRepository.ts
    ├── models/
    │   └── Product.ts
    └── __tests__/
        └── productService.test.ts
```

---

## 🎨 Code Formatting

### ESLint + Prettier

Configuration is shared across the monorepo.

```bash
# Format code
yarn format

# Fix lint issues
yarn lint:fix

# Check lint
yarn lint
```

### Import Order

```typescript
// 1. React/Framework
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 2. Third-party libraries
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

// 3. Internal packages
import { Product } from '@3asoftwares/types';
import { formatPrice } from '@3asoftwares/utils/client';
import { Button } from '@3asoftwares/ui';

// 4. Local imports (absolute paths)
import { useCartStore } from '@/store/cartStore';
import { ProductService } from '@/services/productService';

// 5. Relative imports
import { ProductImage } from './ProductImage';
import styles from './ProductCard.module.css';
```

---

## 📝 Comments & Documentation

### When to Comment

```typescript
// ✅ GOOD: Explain WHY, not WHAT
// Using a 15-minute cache because product data changes infrequently
// but we need to balance freshness with database load
const CACHE_TTL = 15 * 60 * 1000;

// ✅ GOOD: Document complex algorithms
/**
 * Calculates the optimal shipping route using Dijkstra's algorithm.
 * Time complexity: O((V + E) log V)
 */
function calculateShippingRoute(origin: Location, destination: Location) {
  // ...
}

// ❌ BAD: Obvious comments
// Increment counter by 1
counter++;
```

### JSDoc for Public APIs

```typescript
/**
 * Formats a price value as currency string.
 *
 * @param price - The numeric price value
 * @param currency - ISO 4217 currency code (default: 'USD')
 * @param locale - BCP 47 language tag (default: 'en-US')
 * @returns Formatted currency string
 *
 * @example
 * formatPrice(99.99)           // "$99.99"
 * formatPrice(99.99, 'EUR')    // "€99.99"
 * formatPrice(99.99, 'JPY')    // "¥100"
 */
export function formatPrice(
  price: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(price);
}
```

### TODO Comments

```typescript
// TODO(username): Implement pagination - #123
// FIXME: Memory leak in subscription handler
// HACK: Workaround for React 18 hydration issue
// NOTE: This is intentionally synchronous for SSR compatibility
```

---

## 🔗 Related Documentation

- [CONTRIBUTING.md](../CONTRIBUTING.md) - Development workflow
- [TESTING.md](./TESTING.md) - Testing guidelines
- [ARCHITECTURE.md](../architecture/ARCHITECTURE.md) - System architecture

---

© 2026 3A Softwares
