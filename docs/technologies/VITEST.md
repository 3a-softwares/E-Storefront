# Vitest

## Overview

**Version:** 2.x  
**Website:** [https://vitest.dev](https://vitest.dev)  
**Category:** Testing Framework

Vitest is a next-generation testing framework powered by Vite, providing fast unit testing with native ESM and TypeScript support.

---

## Why Vitest?

### Benefits

| Benefit                | Description                                     |
| ---------------------- | ----------------------------------------------- |
| **Blazing Fast**       | Uses Vite's transform pipeline for speed        |
| **Native ESM**         | First-class ES modules support                  |
| **TypeScript Support** | Out-of-the-box TypeScript without configuration |
| **Jest Compatible**    | Compatible with Jest's API                      |
| **Watch Mode**         | Smart file watching with instant feedback       |
| **Built-in Coverage**  | Integrated code coverage with c8/v8             |
| **UI Mode**            | Visual interface for running tests              |

### Why We Chose Vitest

1. **Vite Integration** - Perfect match for our Vite-based packages
2. **Speed** - Significantly faster than Jest for our packages
3. **ESM Native** - Works seamlessly with ES modules
4. **Jest Compatibility** - Easy migration, familiar API
5. **TypeScript** - Zero-config TypeScript support

---

## How to Use Vitest

### Installation

```bash
# Install Vitest
npm install vitest @vitest/coverage-v8 -D

# For React testing
npm install @testing-library/react @testing-library/jest-dom jsdom -D
```

### Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: ['node_modules/', 'dist/', '**/*.d.ts', '**/*.stories.tsx'],
      thresholds: {
        lines: 80,
        branches: 70,
        functions: 80,
        statements: 80,
      },
    },
  },
});
```

### Setup File

```typescript
// vitest.setup.ts
import '@testing-library/jest-dom';
import { expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })),
});
```

---

## Writing Tests

### Basic Unit Test

```typescript
// src/utils/formatters.test.ts
import { describe, it, expect } from 'vitest';
import { formatPrice, formatDate } from './formatters';

describe('formatPrice', () => {
  it('should format price with currency symbol', () => {
    expect(formatPrice(99.99)).toBe('$99.99');
  });

  it('should handle zero', () => {
    expect(formatPrice(0)).toBe('$0.00');
  });

  it('should round to 2 decimal places', () => {
    expect(formatPrice(10.999)).toBe('$11.00');
  });
});

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2025-01-20');
    expect(formatDate(date)).toBe('Jan 20, 2025');
  });
});
```

### React Component Test

```tsx
// src/components/Button/Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should apply variant class', () => {
    render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-primary');
  });
});
```

### Async Test

```typescript
import { describe, it, expect, vi } from 'vitest';
import { fetchProducts } from './api';

// Mock fetch
vi.mock('./api', () => ({
  fetchProducts: vi.fn(),
}));

describe('fetchProducts', () => {
  it('should fetch products successfully', async () => {
    const mockProducts = [{ id: 1, name: 'Product 1' }];
    vi.mocked(fetchProducts).mockResolvedValue(mockProducts);

    const result = await fetchProducts();
    expect(result).toEqual(mockProducts);
  });
});
```

---

## How Vitest Helps Our Project

### Package Testing

```
┌─────────────────────────────────────────────────────────────┐
│                    Vitest in Packages                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  @3asoftwares/types                                         │
│  └── vitest (type validation tests)                         │
│                                                              │
│  @3asoftwares/utils                                         │
│  └── vitest (utility function tests)                        │
│                                                              │
│  @3asoftwares/ui                                            │
│  └── vitest + @testing-library/react (component tests)      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage"
  }
}
```

### Coverage Report

```bash
# Run tests with coverage
yarn test:coverage

# Output:
# ----------------------|---------|----------|---------|---------|
# File                  | % Stmts | % Branch | % Funcs | % Lines |
# ----------------------|---------|----------|---------|---------|
# All files             |   92.5  |    85.3  |   95.2  |   91.8  |
#  src/                 |         |          |         |         |
#   formatters.ts       |   100   |    100   |   100   |   100   |
#   validators.ts       |   88.2  |    75.0  |   90.0  |   87.5  |
# ----------------------|---------|----------|---------|---------|
```

---

## Best Practices

### Test Organization

```
src/
├── components/
│   └── Button/
│       ├── Button.tsx
│       ├── Button.test.tsx    # Unit tests
│       └── Button.stories.tsx # Storybook
├── utils/
│   ├── formatters.ts
│   └── formatters.test.ts
└── __tests__/
    └── integration/           # Integration tests
```

### Mocking

```typescript
// Mock modules
vi.mock('./api');

// Mock specific exports
vi.mock('./utils', () => ({
  formatPrice: vi.fn(() => '$10.00'),
}));

// Spy on methods
const consoleSpy = vi.spyOn(console, 'log');

// Reset mocks between tests
beforeEach(() => {
  vi.clearAllMocks();
});
```

### Snapshot Testing

```typescript
import { render } from '@testing-library/react';

it('should match snapshot', () => {
  const { container } = render(<Button>Test</Button>);
  expect(container).toMatchSnapshot();
});
```

---

## Related Documentation

- [JEST.md](JEST.md) - Jest for services
- [CYPRESS.md](CYPRESS.md) - E2E testing
- [STORYBOOK.md](STORYBOOK.md) - Component documentation
