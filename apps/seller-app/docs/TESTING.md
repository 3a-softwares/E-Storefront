# Seller App Testing Guide

## 📑 Table of Contents

- [Overview](#overview)
- [Testing Stack](#testing-stack)
- [Unit Testing](#unit-testing)
- [Component Testing](#component-testing)
- [Running Tests](#running-tests)

## 🌐 Overview

Seller App uses Jest and React Testing Library with Redux testing utilities.

| Test Type   | Framework             | Purpose                 |
| ----------- | --------------------- | ----------------------- |
| Unit        | Jest                  | Redux slices, utilities |
| Component   | React Testing Library | UI components           |
| Integration | Jest + MSW            | API integration         |

## 🛠️ Testing Stack

| Tool                  | Purpose           |
| --------------------- | ----------------- |
| Jest                  | Test runner       |
| React Testing Library | Component testing |
| MSW                   | API mocking       |
| @reduxjs/toolkit      | Redux testing     |

## 🧪 Unit Testing

### Testing Product Slice

```typescript
// store/__tests__/productsSlice.test.ts
import productsReducer, { addProduct, updateProduct, deleteProduct } from '../slices/productsSlice';

describe('productsSlice', () => {
  const initialState = {
    items: [],
    loading: false,
    error: null,
  };

  it('should add a product', () => {
    const product = { id: '1', name: 'Test Product', price: 99.99 };
    const actual = productsReducer(initialState, addProduct(product));
    expect(actual.items).toHaveLength(1);
    expect(actual.items[0]).toEqual(product);
  });

  it('should update a product', () => {
    const state = {
      ...initialState,
      items: [{ id: '1', name: 'Old Name', price: 99.99 }],
    };
    const actual = productsReducer(
      state,
      updateProduct({ id: '1', name: 'New Name', price: 149.99 })
    );
    expect(actual.items[0].name).toBe('New Name');
    expect(actual.items[0].price).toBe(149.99);
  });

  it('should delete a product', () => {
    const state = {
      ...initialState,
      items: [{ id: '1', name: 'Product', price: 99.99 }],
    };
    const actual = productsReducer(state, deleteProduct('1'));
    expect(actual.items).toHaveLength(0);
  });
});
```

## 🧩 Component Testing

### Testing Product Form

```typescript
// components/__tests__/ProductForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductForm } from '../ProductForm';
import { TestWrapper } from '../../test-utils';

describe('ProductForm', () => {
  it('renders all form fields', () => {
    render(<ProductForm onSubmit={jest.fn()} />, { wrapper: TestWrapper });

    expect(screen.getByLabelText(/product name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/sku/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/quantity/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<ProductForm onSubmit={jest.fn()} />, { wrapper: TestWrapper });

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/price is required/i)).toBeInTheDocument();
    });
  });

  it('submits valid form data', async () => {
    const onSubmit = jest.fn();
    render(<ProductForm onSubmit={onSubmit} />, { wrapper: TestWrapper });

    await userEvent.type(screen.getByLabelText(/product name/i), 'Test Product');
    await userEvent.type(screen.getByLabelText(/price/i), '99.99');
    await userEvent.type(screen.getByLabelText(/sku/i), 'SKU-001');
    await userEvent.type(screen.getByLabelText(/quantity/i), '10');

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
  });
});
```

### Testing Order List

```typescript
// pages/__tests__/OrderList.test.tsx
import { render, screen } from '@testing-library/react';
import { OrderList } from '../orders/OrderList';
import { TestWrapper } from '../../test-utils';

const mockOrders = [
  { id: '1', customer: 'John', total: 150, status: 'pending' },
  { id: '2', customer: 'Jane', total: 200, status: 'shipped' },
];

describe('OrderList', () => {
  it('renders order list', () => {
    render(<OrderList orders={mockOrders} />, { wrapper: TestWrapper });

    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Jane')).toBeInTheDocument();
  });

  it('shows correct order status', () => {
    render(<OrderList orders={mockOrders} />, { wrapper: TestWrapper });

    expect(screen.getByText('pending')).toBeInTheDocument();
    expect(screen.getByText('shipped')).toBeInTheDocument();
  });
});
```

## 🏃 Running Tests

```bash
# Run all tests
yarn test

# Watch mode
yarn test:watch

# Coverage
yarn test:coverage
```

---

See also:

- [ARCHITECTURE.md](./ARCHITECTURE.md) - App architecture
