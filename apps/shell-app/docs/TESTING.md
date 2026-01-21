# Shell App Testing Guide

## 📑 Table of Contents

- [Overview](#overview)
- [Testing Stack](#testing-stack)
- [Unit Testing](#unit-testing)
- [Component Testing](#component-testing)
- [Integration Testing](#integration-testing)
- [Running Tests](#running-tests)

## 🌐 Overview

Shell App uses Jest and React Testing Library for comprehensive testing.

| Test Type   | Framework             | Purpose                  |
| ----------- | --------------------- | ------------------------ |
| Unit        | Jest                  | Functions, hooks, stores |
| Component   | React Testing Library | UI components            |
| Integration | Jest + MSW            | API integration          |

## 🛠️ Testing Stack

| Tool                      | Purpose           |
| ------------------------- | ----------------- |
| Jest                      | Test runner       |
| React Testing Library     | Component testing |
| MSW (Mock Service Worker) | API mocking       |
| jest-dom                  | DOM matchers      |

## 🧪 Unit Testing

### Testing Zustand Stores

```typescript
// store/__tests__/cartStore.test.ts
import { renderHook, act } from '@testing-library/react';
import { useCartStore } from '../cartStore';

describe('cartStore', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it('adds item to cart', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addItem({
        id: '1',
        name: 'Test Product',
        price: 99.99,
        quantity: 1,
      });
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].name).toBe('Test Product');
  });

  it('removes item from cart', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addItem({ id: '1', name: 'Product', price: 10, quantity: 1 });
      result.current.removeItem('1');
    });

    expect(result.current.items).toHaveLength(0);
  });

  it('calculates total price', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addItem({ id: '1', name: 'A', price: 100, quantity: 2 });
      result.current.addItem({ id: '2', name: 'B', price: 50, quantity: 1 });
    });

    expect(result.current.totalPrice).toBe(250);
  });
});
```

### Testing Utility Functions

```typescript
// utils/__tests__/formatters.test.ts
import { formatPrice, formatDate } from '../formatters';

describe('formatters', () => {
  describe('formatPrice', () => {
    it('formats USD correctly', () => {
      expect(formatPrice(99.99)).toBe('$99.99');
    });

    it('handles zero', () => {
      expect(formatPrice(0)).toBe('$0.00');
    });

    it('formats large numbers', () => {
      expect(formatPrice(1234567.89)).toBe('$1,234,567.89');
    });
  });

  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2026-01-20');
      expect(formatDate(date)).toBe('January 20, 2026');
    });
  });
});
```

## 🧩 Component Testing

### Testing ProductCard

```typescript
// components/__tests__/ProductCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '../product/ProductCard';

const mockProduct = {
  id: '1',
  name: 'Test Product',
  price: 99.99,
  image: '/test-image.jpg',
  description: 'A test product',
};

describe('ProductCard', () => {
  it('renders product information', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('renders product image', () => {
    render(<ProductCard product={mockProduct} />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', '/test-image.jpg');
    expect(image).toHaveAttribute('alt', 'Test Product');
  });

  it('calls onAddToCart when button clicked', () => {
    const onAddToCart = jest.fn();
    render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />);

    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(onAddToCart).toHaveBeenCalledWith(mockProduct);
  });

  it('navigates to product detail on click', () => {
    const onNavigate = jest.fn();
    render(<ProductCard product={mockProduct} onNavigate={onNavigate} />);

    fireEvent.click(screen.getByText('Test Product'));
    expect(onNavigate).toHaveBeenCalledWith('/products/1');
  });
});
```

### Testing Cart Components

```typescript
// components/__tests__/CartItem.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { CartItem } from '../cart/CartItem';

const mockItem = {
  id: '1',
  name: 'Test Product',
  price: 99.99,
  quantity: 2,
  image: '/test.jpg',
};

describe('CartItem', () => {
  it('renders item details', () => {
    render(<CartItem item={mockItem} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
  });

  it('calls onUpdateQuantity when quantity changed', () => {
    const onUpdate = jest.fn();
    render(<CartItem item={mockItem} onUpdateQuantity={onUpdate} />);

    fireEvent.change(screen.getByDisplayValue('2'), { target: { value: '3' } });
    expect(onUpdate).toHaveBeenCalledWith('1', 3);
  });

  it('calls onRemove when remove button clicked', () => {
    const onRemove = jest.fn();
    render(<CartItem item={mockItem} onRemove={onRemove} />);

    fireEvent.click(screen.getByRole('button', { name: /remove/i }));
    expect(onRemove).toHaveBeenCalledWith('1');
  });
});
```

## 🔗 Integration Testing

### API Mocking with MSW

```typescript
// mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/products', (req, res, ctx) => {
    return res(
      ctx.json({
        products: [
          { id: '1', name: 'Product 1', price: 99.99 },
          { id: '2', name: 'Product 2', price: 149.99 },
        ],
      })
    );
  }),

  rest.post('/api/cart', (req, res, ctx) => {
    return res(ctx.json({ success: true }));
  }),
];
```

### Integration Test Example

```typescript
// pages/__tests__/Products.integration.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { handlers } from '../../mocks/handlers';
import { Products } from '../Products';

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Products Page Integration', () => {
  it('loads and displays products', async () => {
    render(<Products />);

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
    });
  });
});
```

## 🏃 Running Tests

### Commands

```bash
# Run all tests
yarn test

# Watch mode
yarn test:watch

# With coverage
yarn test:coverage

# Run specific file
yarn test CartStore
```

### Coverage Requirements

| Metric     | Threshold |
| ---------- | --------- |
| Statements | 70%       |
| Branches   | 70%       |
| Functions  | 70%       |
| Lines      | 70%       |

---

See also:

- [ARCHITECTURE.md](./ARCHITECTURE.md) - App architecture
