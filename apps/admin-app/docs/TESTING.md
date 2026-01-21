# Admin App Testing Guide

## 📑 Table of Contents

- [Overview](#overview)
- [Testing Stack](#testing-stack)
- [Unit Testing](#unit-testing)
- [Component Testing](#component-testing)
- [Running Tests](#running-tests)

## 🌐 Overview

Admin App uses Jest and React Testing Library with Redux testing utilities.

| Test Type   | Framework             | Purpose                 |
| ----------- | --------------------- | ----------------------- |
| Unit        | Jest                  | Redux slices, utilities |
| Component   | React Testing Library | UI components           |
| Integration | Jest + MSW            | API integration         |

## 🛠️ Testing Stack

| Tool                         | Purpose           |
| ---------------------------- | ----------------- |
| Jest                         | Test runner       |
| React Testing Library        | Component testing |
| @testing-library/react-hooks | Hook testing      |
| MSW                          | API mocking       |
| @reduxjs/toolkit             | Redux testing     |

## 🧪 Unit Testing

### Testing Redux Slices

```typescript
// store/__tests__/authSlice.test.ts
import authReducer, { setUser, logout } from '../slices/authSlice';

describe('authSlice', () => {
  const initialState = {
    user: null,
    isAuthenticated: false,
    loading: true,
  };

  it('should return initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setUser', () => {
    const user = { id: '1', name: 'Admin', email: 'admin@test.com', role: 'admin' };
    const actual = authReducer(initialState, setUser(user));

    expect(actual.user).toEqual(user);
    expect(actual.isAuthenticated).toBe(true);
    expect(actual.loading).toBe(false);
  });

  it('should handle logout', () => {
    const loggedInState = {
      user: { id: '1', name: 'Admin' },
      isAuthenticated: true,
      loading: false,
    };

    const actual = authReducer(loggedInState, logout());

    expect(actual.user).toBeNull();
    expect(actual.isAuthenticated).toBe(false);
  });
});
```

### Testing RTK Query

```typescript
// services/__tests__/api.test.ts
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../store';
import { useGetProductsQuery } from '../api';

const mockProducts = [
  { id: '1', name: 'Product 1', price: 99.99 },
  { id: '2', name: 'Product 2', price: 149.99 },
];

const server = setupServer(
  rest.get('/api/products', (req, res, ctx) => {
    return res(ctx.json(mockProducts));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Products API', () => {
  it('fetches products successfully', async () => {
    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useGetProductsQuery(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockProducts);
  });
});
```

## 🧩 Component Testing

### Testing Form Components

```typescript
// components/__tests__/ProductForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '../../store';
import { ProductForm } from '../forms/ProductForm';

const wrapper = ({ children }) => (
  <Provider store={store}>{children}</Provider>
);

describe('ProductForm', () => {
  it('renders form fields', () => {
    render(<ProductForm onSubmit={jest.fn()} />, { wrapper });

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<ProductForm onSubmit={jest.fn()} />, { wrapper });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const onSubmit = jest.fn();
    render(<ProductForm onSubmit={onSubmit} />, { wrapper });

    await userEvent.type(screen.getByLabelText(/name/i), 'Test Product');
    await userEvent.type(screen.getByLabelText(/price/i), '99.99');
    await userEvent.type(screen.getByLabelText(/description/i), 'A test product');

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Test Product',
        price: 99.99,
        description: 'A test product',
      });
    });
  });
});
```

### Testing Table Components

```typescript
// components/__tests__/ProductTable.test.tsx
import { render, screen } from '@testing-library/react';
import { ProductTable } from '../tables/ProductTable';

const mockProducts = [
  { id: '1', name: 'Product 1', price: 99.99, category: 'Electronics' },
  { id: '2', name: 'Product 2', price: 149.99, category: 'Clothing' },
];

describe('ProductTable', () => {
  it('renders table headers', () => {
    render(<ProductTable products={mockProducts} />);

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
  });

  it('renders product rows', () => {
    render(<ProductTable products={mockProducts} />);

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });

  it('renders empty state when no products', () => {
    render(<ProductTable products={[]} />);

    expect(screen.getByText(/no products found/i)).toBeInTheDocument();
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
yarn test ProductForm
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
