# Test-Driven Development (TDD)

## Overview

**Methodology:** Red-Green-Refactor  
**Category:** Development Practice  
**Scope:** All Projects

Test-Driven Development is a software development approach where tests are written before the actual code implementation.

---

## Why TDD?

### Benefits

| Benefit              | Description                               |
| -------------------- | ----------------------------------------- |
| **Better Design**    | Forces modular, testable architecture     |
| **Documentation**    | Tests document expected behavior          |
| **Confidence**       | Refactor without fear                     |
| **Fewer Bugs**       | Catch issues before they reach production |
| **Faster Debugging** | Know exactly what broke and where         |

### Why We Practice TDD

1. **Quality** - Reduce bugs in production
2. **Maintainability** - Easier to refactor
3. **Coverage** - Natural high test coverage
4. **Speed** - Faster development long-term
5. **Collaboration** - Tests clarify requirements

---

## The TDD Cycle

```
┌─────────────────────────────────────────────────────────────┐
│                    TDD Cycle: Red-Green-Refactor             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│        ┌─────────┐                                          │
│        │   RED   │  1. Write a failing test                 │
│        │  (Fail) │     for new functionality                │
│        └────┬────┘                                          │
│             │                                                │
│             ▼                                                │
│        ┌─────────┐                                          │
│        │  GREEN  │  2. Write minimal code to                │
│        │ (Pass)  │     make the test pass                   │
│        └────┬────┘                                          │
│             │                                                │
│             ▼                                                │
│        ┌─────────┐                                          │
│        │REFACTOR │  3. Clean up code while                  │
│        │(Improve)│     keeping tests passing                │
│        └────┬────┘                                          │
│             │                                                │
│             └──────────────────▶ Repeat                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## TDD in Practice

### Example: Cart Service

#### Step 1: RED - Write Failing Test

```typescript
// tests/cart.service.test.ts
import { CartService } from '../src/services/CartService';

describe('CartService', () => {
  describe('addItem', () => {
    it('should add item to empty cart', () => {
      const cart = new CartService();

      cart.addItem({ productId: '1', name: 'Product', price: 100, quantity: 1 });

      expect(cart.getItems()).toHaveLength(1);
      expect(cart.getTotal()).toBe(100);
    });
  });
});

// Run: npm test
// Result: ❌ FAIL - CartService is not defined
```

#### Step 2: GREEN - Write Minimal Code

```typescript
// src/services/CartService.ts
interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export class CartService {
  private items: CartItem[] = [];

  addItem(item: CartItem): void {
    this.items.push(item);
  }

  getItems(): CartItem[] {
    return this.items;
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}

// Run: npm test
// Result: ✅ PASS
```

#### Step 3: REFACTOR - Improve Code

```typescript
// Add more tests first
it('should increase quantity if item already exists', () => {
  const cart = new CartService();

  cart.addItem({ productId: '1', name: 'Product', price: 100, quantity: 1 });
  cart.addItem({ productId: '1', name: 'Product', price: 100, quantity: 2 });

  expect(cart.getItems()).toHaveLength(1);
  expect(cart.getItems()[0].quantity).toBe(3);
  expect(cart.getTotal()).toBe(300);
});

// Then update implementation
export class CartService {
  private items: Map<string, CartItem> = new Map();

  addItem(item: CartItem): void {
    const existing = this.items.get(item.productId);

    if (existing) {
      existing.quantity += item.quantity;
    } else {
      this.items.set(item.productId, { ...item });
    }
  }

  getItems(): CartItem[] {
    return Array.from(this.items.values());
  }

  getTotal(): number {
    return this.getItems().reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  removeItem(productId: string): void {
    this.items.delete(productId);
  }

  clear(): void {
    this.items.clear();
  }
}
```

---

## TDD for React Components

### Component Test First

```typescript
// tests/ProductCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '../components/ProductCard';

describe('ProductCard', () => {
  const product = {
    id: '1',
    name: 'Test Product',
    price: 99.99,
    image: '/test.jpg',
  };

  it('should render product details', () => {
    render(<ProductCard product={product} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('should call onAddToCart when button clicked', () => {
    const onAddToCart = jest.fn();

    render(<ProductCard product={product} onAddToCart={onAddToCart} />);

    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));

    expect(onAddToCart).toHaveBeenCalledWith(product);
  });

  it('should show out of stock badge when stock is 0', () => {
    render(<ProductCard product={{ ...product, stock: 0 }} />);

    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Implement Component

```typescript
// components/ProductCard.tsx
interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const isOutOfStock = product.stock === 0;

  return (
    <div className="card bg-base-100 shadow-xl">
      <figure>
        <img src={product.image} alt={product.name} />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{product.name}</h2>
        <p>${product.price.toFixed(2)}</p>

        {isOutOfStock && (
          <span className="badge badge-error">Out of Stock</span>
        )}

        <div className="card-actions justify-end">
          <button
            className="btn btn-primary"
            onClick={() => onAddToCart?.(product)}
            disabled={isOutOfStock}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## TDD for APIs

### API Test First

```typescript
// tests/api/products.test.ts
import request from 'supertest';
import { app } from '../src/app';
import { Product } from '../src/models/Product';

describe('GET /api/products', () => {
  beforeEach(async () => {
    await Product.deleteMany({});
  });

  it('should return empty array when no products', async () => {
    const response = await request(app).get('/api/products');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should return all products', async () => {
    await Product.create({ name: 'Product 1', price: 100 });
    await Product.create({ name: 'Product 2', price: 200 });

    const response = await request(app).get('/api/products');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  it('should filter by category', async () => {
    await Product.create({ name: 'Electronics', category: 'electronics' });
    await Product.create({ name: 'Clothing', category: 'clothing' });

    const response = await request(app).get('/api/products').query({ category: 'electronics' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].category).toBe('electronics');
  });
});
```

---

## TDD Best Practices

### Test Structure (AAA Pattern)

```typescript
it('should calculate discount correctly', () => {
  // Arrange - Set up test data
  const cart = new CartService();
  const coupon = { code: 'SAVE10', discount: 10 };
  cart.addItem({ productId: '1', price: 100, quantity: 2 });

  // Act - Perform the action
  cart.applyCoupon(coupon);

  // Assert - Verify the result
  expect(cart.getTotal()).toBe(180); // 200 - 10%
  expect(cart.getDiscount()).toBe(20);
});
```

### Test Naming Convention

```typescript
// Format: should [expected behavior] when [condition]
it('should return error when email is invalid', () => {});
it('should create user when data is valid', () => {});
it('should throw exception when product not found', () => {});
```

### One Assertion Per Test

```typescript
// ❌ Bad - Multiple assertions
it('should handle cart operations', () => {
  cart.addItem(item);
  expect(cart.getItems()).toHaveLength(1);
  cart.removeItem(item.id);
  expect(cart.getItems()).toHaveLength(0);
});

// ✅ Good - Separate tests
it('should add item to cart', () => {
  cart.addItem(item);
  expect(cart.getItems()).toHaveLength(1);
});

it('should remove item from cart', () => {
  cart.addItem(item);
  cart.removeItem(item.id);
  expect(cart.getItems()).toHaveLength(0);
});
```

---

## Test Coverage Goals

| Type       | Target | Description              |
| ---------- | ------ | ------------------------ |
| Statements | 80%+   | Lines of code executed   |
| Branches   | 75%+   | If/else paths covered    |
| Functions  | 85%+   | Functions called         |
| Lines      | 80%+   | Executable lines covered |

---

## Related Documentation

- [JEST.md](JEST.md) - Jest testing framework
- [VITEST.md](VITEST.md) - Vitest for Vite projects
- [CYPRESS.md](CYPRESS.md) - E2E testing
- [REACT_TESTING_LIBRARY.md](REACT_TESTING_LIBRARY.md) - Component testing
