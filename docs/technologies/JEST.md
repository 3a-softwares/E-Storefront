# Jest

**Version:** 29.7.0 | **Category:** Testing Framework

---

## Configuration

```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/tests/setup.tsx'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@3asoftwares/utils$': '<rootDir>/tests/__mocks__/utils.ts',
    '^@3asoftwares/ui$': '<rootDir>/tests/__mocks__/ui-library.tsx',
  },
  testMatch: ['**/tests/**/*.test.ts', '**/tests/**/*.test.tsx'],
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'store/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    '!**/*.d.ts',
  ],
  coverageThreshold: {
    global: { branches: 10, functions: 15, lines: 15, statements: 15 },
  },
  testTimeout: 10000,
};

module.exports = createJestConfig(customJestConfig);
```

### Test Setup

```tsx
// tests/setup.tsx
import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as any;

afterEach(() => jest.clearAllMocks());
```

---

## Writing Tests

### Utility Functions

```typescript
// tests/lib/utils/formatPrice.test.ts
import { formatPrice } from '@/lib/utils/formatPrice';

describe('formatPrice', () => {
  it('should format price with 2 decimal places', () => {
    expect(formatPrice(99.9)).toBe('$99.90');
  });

  it('should handle zero', () => {
    expect(formatPrice(0)).toBe('$0.00');
  });

  it('should handle large numbers', () => {
    expect(formatPrice(1234567.89)).toBe('$1,234,567.89');
  });
});
```

### React Components

```tsx
// tests/components/ProductCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '@/components/ProductCard';

const mockProduct = {
  id: '1',
  name: 'Test Product',
  price: 99.99,
  image: '/test.jpg',
  stock: 10,
};

describe('ProductCard', () => {
  it('should render product name and price', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('should call onAddToCart when button is clicked', () => {
    const onAddToCart = jest.fn();
    render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />);
    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(onAddToCart).toHaveBeenCalledWith(mockProduct);
  });

  it('should disable button when out of stock', () => {
    render(<ProductCard product={{ ...mockProduct, stock: 0 }} />);
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeDisabled();
  });
});
```

### Custom Hooks

```typescript
// tests/hooks/useDebounce.test.ts
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '@/lib/hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'initial' },
    });

    rerender({ value: 'updated' });
    expect(result.current).toBe('initial');

    act(() => jest.advanceTimersByTime(500));
    expect(result.current).toBe('updated');
  });
});
```

### Zustand Store

```typescript
// tests/store/cartStore.test.ts
import { act, renderHook } from '@testing-library/react';
import { useCartStore } from '@/store/cartStore';

describe('useCartStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useCartStore());
    act(() => result.current.clearCart());
  });

  it('should start with empty cart', () => {
    const { result } = renderHook(() => useCartStore());
    expect(result.current.items).toHaveLength(0);
    expect(result.current.getTotalItems()).toBe(0);
  });

  it('should add item to cart', () => {
    const { result } = renderHook(() => useCartStore());
    const item = { id: '1', name: 'Product', price: 10, quantity: 1, image: '' };

    act(() => result.current.addItem(item));
    expect(result.current.items).toHaveLength(1);
  });

  it('should update quantity for existing item', () => {
    const { result } = renderHook(() => useCartStore());
    const item = { id: '1', name: 'Product', price: 10, quantity: 1, image: '' };

    act(() => {
      result.current.addItem(item);
      result.current.addItem({ ...item, quantity: 2 });
    });
    expect(result.current.items[0].quantity).toBe(3);
  });

  it('should calculate total price correctly', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addItem({ id: '1', name: 'A', price: 10, quantity: 2, image: '' });
      result.current.addItem({ id: '2', name: 'B', price: 15, quantity: 3, image: '' });
    });
    expect(result.current.getTotalPrice()).toBe(65);
  });
});
```

### Mocking

```typescript
// tests/__mocks__/utils.ts
export const getAccessToken = jest.fn(() => 'mock-token');
export const getCurrentUser = jest.fn(() => ({
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
}));

// tests/__mocks__/ui-library.tsx
import React from 'react';
export const Button = ({ children, onClick, disabled }: any) => (
  <button onClick={onClick} disabled={disabled}>{children}</button>
);
```

### Async Testing with Apollo

```typescript
// tests/hooks/useProducts.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { useProducts } from '@/lib/hooks/useProducts';

const mocks = [{
  request: { query: GET_PRODUCTS_QUERY, variables: { page: 1, limit: 12 } },
  result: { data: { products: { products: [{ id: '1', name: 'Product 1' }], total: 1 } } },
}];

describe('useProducts', () => {
  it('should fetch products', async () => {
    const wrapper = ({ children }) => (
      <MockedProvider mocks={mocks} addTypename={false}>{children}</MockedProvider>
    );

    const { result } = renderHook(() => useProducts({ page: 1, limit: 12 }), { wrapper });

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.products[0].name).toBe('Product 1');
  });
});
```

---

## Best Practices

### Test Behavior, Not Implementation

```typescript
// ✅ Good - tests behavior
it('should show error when email is invalid', () => {
  render(<LoginForm />);
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'invalid' } });
  fireEvent.click(screen.getByRole('button', { name: /submit/i }));
  expect(screen.getByText('Invalid email')).toBeInTheDocument();
});
```

### Descriptive Test Names

```typescript
describe('CartStore', () => {
  describe('addItem', () => {
    it('should add new item to empty cart');
    it('should increase quantity when item already exists');
    it('should not exceed max quantity limit');
  });
});
```

### Arrange-Act-Assert Pattern

```typescript
it('should remove item from cart', () => {
  // Arrange
  const { result } = renderHook(() => useCartStore());
  act(() => result.current.addItem(mockItem));

  // Act
  act(() => result.current.removeItem(mockItem.id));

  // Assert
  expect(result.current.items).toHaveLength(0);
});
```

### Parameterized Tests

```typescript
describe('validateEmail', () => {
  it.each([
    ['test@example.com', true],
    ['invalid', false],
    ['@example.com', false],
  ])('validateEmail(%s) should return %s', (email, expected) => {
    expect(validateEmail(email)).toBe(expected);
  });
});
```

---

## Commands

| Command                 | Description       |
| ----------------------- | ----------------- |
| `npm test`              | Run all tests     |
| `npm run test:watch`    | Watch mode        |
| `npm run test:coverage` | Generate coverage |
| `npm test -- -u`        | Update snapshots  |

---

## Related Documentation

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Cheatsheet](https://testing-library.com/docs/react-testing-library/cheatsheet)
