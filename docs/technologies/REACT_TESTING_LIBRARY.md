# React Testing Library

## Overview

**Version:** 14.x  
**Website:** [https://testing-library.com/react](https://testing-library.com/react)  
**Category:** Testing

React Testing Library is a lightweight testing utility that encourages testing components the way users interact with them.

---

## Why React Testing Library?

### Benefits

| Benefit                | Description                                 |
| ---------------------- | ------------------------------------------- |
| **User-Centric**       | Test behavior, not implementation           |
| **Accessible Queries** | Find elements by accessibility attributes   |
| **Simple API**         | Minimal, intuitive testing utilities        |
| **Framework Agnostic** | Works with Jest, Vitest, or any test runner |
| **Best Practices**     | Encourages accessible component design      |

### Why We Chose React Testing Library

1. **User Perspective** - Tests reflect real user interactions
2. **Refactor-Friendly** - Tests don't break on implementation changes
3. **Accessibility** - Promotes accessible component design
4. **Industry Standard** - Widely adopted, excellent docs
5. **Integration** - Works seamlessly with Jest/Vitest

---

## Installation

```bash
# With Jest
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event

# With Vitest
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest
```

### Setup

```typescript
// jest.setup.ts or vitest.setup.ts
import '@testing-library/jest-dom';
```

---

## Query Priority

### Recommended Order

```typescript
// 1. Accessible by Everyone
getByRole; // Best - queries accessible elements
getByLabelText; // Form inputs
getByPlaceholderText;
getByText; // Non-interactive content
getByDisplayValue;

// 2. Semantic Queries
getByAltText; // Images
getByTitle; // Tooltips

// 3. Test IDs (Last Resort)
getByTestId; // Only when others don't work
```

### Query Types

```typescript
// getBy - Throws if not found (single element)
const button = screen.getByRole('button', { name: /submit/i });

// queryBy - Returns null if not found
const error = screen.queryByText('Error message');

// findBy - Async, waits for element
const modal = await screen.findByRole('dialog');

// getAllBy - Returns array
const items = screen.getAllByRole('listitem');
```

---

## Basic Testing Patterns

### Component Render

```typescript
// components/__tests__/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);

    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('applies variant class', () => {
    render(<Button variant="primary">Submit</Button>);

    expect(screen.getByRole('button')).toHaveClass('btn-primary');
  });

  it('renders as disabled', () => {
    render(<Button disabled>Disabled</Button>);

    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### User Events

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from '../Counter';

describe('Counter', () => {
  it('increments count when button clicked', async () => {
    const user = userEvent.setup();
    render(<Counter />);

    expect(screen.getByText('Count: 0')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /increment/i }));

    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });

  it('handles keyboard interaction', async () => {
    const user = userEvent.setup();
    render(<Counter />);

    const button = screen.getByRole('button', { name: /increment/i });
    button.focus();

    await user.keyboard('{Enter}');

    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });
});
```

### Form Testing

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '../LoginForm';

describe('LoginForm', () => {
  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    render(<LoginForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('shows validation errors', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={jest.fn()} />);

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  it('clears error when user types', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={jest.fn()} />);

    await user.click(screen.getByRole('button', { name: /sign in/i }));
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');

    expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument();
  });
});
```

---

## Testing Async Components

### Loading States

```typescript
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { ProductList } from '../ProductList';

describe('ProductList', () => {
  it('shows loading state then products', async () => {
    render(<ProductList />);

    // Loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for loading to disappear
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

    // Products loaded
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('shows error state on fetch failure', async () => {
    // Mock failed fetch
    server.use(
      rest.get('/api/products', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<ProductList />);

    expect(await screen.findByText(/error loading products/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });
});
```

### Mocking API Calls

```typescript
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const products = [
  { id: '1', name: 'Product 1', price: 100 },
  { id: '2', name: 'Product 2', price: 200 },
];

const server = setupServer(
  rest.get('/api/products', (req, res, ctx) => {
    return res(ctx.json(products));
  }),

  rest.post('/api/cart', (req, res, ctx) => {
    return res(ctx.json({ success: true }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

---

## Testing with Context

### Wrapper Function

```typescript
// test-utils.tsx
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

interface WrapperProps {
  children: React.ReactNode;
}

function AllProviders({ children }: WrapperProps) {
  const queryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}

const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

### Using Custom Render

```typescript
import { render, screen } from '../test-utils';
import { ProductCard } from '../ProductCard';

it('works with providers', () => {
  render(<ProductCard product={mockProduct} />);
  // All providers are available
});
```

---

## Custom Matchers

### jest-dom Matchers

```typescript
// Common matchers
expect(element).toBeInTheDocument();
expect(element).toBeVisible();
expect(element).toBeDisabled();
expect(element).toBeEnabled();
expect(element).toHaveClass('btn-primary');
expect(element).toHaveTextContent('Hello');
expect(element).toHaveValue('test@example.com');
expect(element).toHaveFocus();
expect(element).toBeChecked();
expect(element).toHaveAttribute('href', '/products');
```

---

## Best Practices

### Query by Role

```typescript
// ✅ Good - Uses accessible role
screen.getByRole('button', { name: /submit/i });
screen.getByRole('textbox', { name: /email/i });
screen.getByRole('heading', { level: 1 });

// ❌ Avoid - Implementation details
screen.getByClassName('submit-btn');
screen.getByTestId('submit-button');
```

### Use userEvent over fireEvent

```typescript
// ✅ Good - Simulates real user
const user = userEvent.setup();
await user.click(button);
await user.type(input, 'text');

// ❌ Avoid - Low-level events
fireEvent.click(button);
fireEvent.change(input, { target: { value: 'text' } });
```

### Async Assertions

```typescript
// ✅ Good - Wait for element
expect(await screen.findByText(/success/i)).toBeInTheDocument();

// ✅ Good - Use waitFor
await waitFor(() => {
  expect(screen.getByText(/success/i)).toBeInTheDocument();
});

// ❌ Avoid - Synchronous assertion for async UI
expect(screen.getByText(/success/i)).toBeInTheDocument();
```

---

## Related Documentation

- [JEST.md](JEST.md) - Jest test runner
- [VITEST.md](VITEST.md) - Vitest test runner
- [TDD.md](TDD.md) - Test-Driven Development
- [REACT.md](REACT.md) - React patterns
