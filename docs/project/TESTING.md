# Testing Guide

## 📑 Table of Contents

- [Overview](#overview)
- [Testing Strategy](#testing-strategy)
- [Unit Testing](#unit-testing)
- [Integration Testing](#integration-testing)
- [E2E Testing](#e2e-testing)
- [Coverage Requirements](#coverage-requirements)
- [Running Tests](#running-tests)

## 🌐 Overview

E-Storefront uses a comprehensive testing strategy with multiple levels of testing:

| Test Type | Framework | Purpose |
|-----------|-----------|---------|
| Unit | Jest | Individual functions/components |
| Integration | Jest + Supertest | API endpoints, service interactions |
| E2E | Cypress | User flows, browser testing |
| Component | React Testing Library | React components |

## 🎯 Testing Strategy

### Testing Pyramid

```
                    ┌─────────┐
                   │   E2E   │          Few, Slow, Expensive
                   │ Cypress │
                  ─┴─────────┴─
                 │ Integration │        Some, Medium, Moderate
                 │  Jest + API │
                ─┴─────────────┴─
               │      Unit       │      Many, Fast, Cheap
               │   Jest + RTL    │
              ─┴─────────────────┴─
```

### Test Distribution

| Layer | Coverage Target | Tests |
|-------|----------------|-------|
| Unit | 80%+ | ~500 |
| Integration | 60%+ | ~100 |
| E2E | Critical paths | ~20 |

## 🧪 Unit Testing

### Backend Unit Tests

```typescript
// services/product-service/src/__tests__/productService.test.ts
import { ProductService } from '../services/productService';
import { ProductRepository } from '../repositories/productRepository';

// Mock repository
jest.mock('../repositories/productRepository');

describe('ProductService', () => {
  let service: ProductService;
  let mockRepo: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    mockRepo = new ProductRepository() as jest.Mocked<ProductRepository>;
    service = new ProductService(mockRepo);
  });

  describe('getProduct', () => {
    it('should return product by id', async () => {
      const mockProduct = {
        id: '123',
        name: 'Test Product',
        price: 99.99
      };
      mockRepo.findById.mockResolvedValue(mockProduct);

      const result = await service.getProduct('123');

      expect(result).toEqual(mockProduct);
      expect(mockRepo.findById).toHaveBeenCalledWith('123');
    });

    it('should throw NotFoundError when product not found', async () => {
      mockRepo.findById.mockResolvedValue(null);

      await expect(service.getProduct('invalid'))
        .rejects
        .toThrow('Product not found');
    });
  });

  describe('createProduct', () => {
    it('should create product with generated slug', async () => {
      const input = {
        name: 'New Product',
        price: 49.99,
        description: 'Description'
      };

      mockRepo.create.mockResolvedValue({
        id: 'new-id',
        ...input,
        slug: 'new-product'
      });

      const result = await service.createProduct(input);

      expect(result.slug).toBe('new-product');
      expect(mockRepo.create).toHaveBeenCalled();
    });

    it('should validate price is positive', async () => {
      const input = {
        name: 'Product',
        price: -10,
        description: 'Desc'
      };

      await expect(service.createProduct(input))
        .rejects
        .toThrow('Price must be positive');
    });
  });
});
```

### Frontend Unit Tests

```typescript
// apps/admin-app/src/__tests__/ProductCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '../components/ProductCard';

describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 99.99,
    compareAtPrice: 129.99,
    images: [{ url: '/test.jpg', isPrimary: true }],
    rating: { average: 4.5, count: 10 }
  };

  it('should render product information', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('should show discount badge when compareAtPrice exists', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText(/-\d+%/)).toBeInTheDocument();
  });

  it('should call onAddToCart when button clicked', () => {
    const onAddToCart = jest.fn();
    render(
      <ProductCard 
        product={mockProduct} 
        onAddToCart={onAddToCart} 
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));

    expect(onAddToCart).toHaveBeenCalledWith('1');
  });

  it('should be accessible', () => {
    const { container } = render(<ProductCard product={mockProduct} />);

    expect(container.querySelector('article')).toHaveAttribute('role', 'article');
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Test Product');
  });
});
```

### Hook Testing

```typescript
// apps/shell-app/src/__tests__/useAuth.test.tsx
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../hooks/useAuth';
import { AuthProvider } from '../contexts/AuthContext';

const wrapper = ({ children }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('useAuth', () => {
  it('should return initial unauthenticated state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('should login user and update state', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password123'
      });
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toBeDefined();
  });

  it('should logout and clear state', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    // Login first
    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password123'
      });
    });

    // Then logout
    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });
});
```

## 🔗 Integration Testing

### API Integration Tests

```typescript
// services/auth-service/src/__tests__/auth.integration.test.ts
import request from 'supertest';
import { app } from '../app';
import { connectDB, closeDB, clearDB } from './helpers/db';

describe('Auth API Integration', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await closeDB();
  });

  afterEach(async () => {
    await clearDB();
  });

  describe('POST /auth/register', () => {
    it('should register new user', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
          firstName: 'Test',
          lastName: 'User'
        });

      expect(response.status).toBe(201);
      expect(response.body.user.email).toBe('test@example.com');
      expect(response.body.accessToken).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();
    });

    it('should reject duplicate email', async () => {
      // Create first user
      await request(app)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
          firstName: 'Test',
          lastName: 'User'
        });

      // Try duplicate
      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password456!',
          firstName: 'Another',
          lastName: 'User'
        });

      expect(response.status).toBe(409);
      expect(response.body.error.code).toBe('CONFLICT');
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      // Create test user
      await request(app)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
          firstName: 'Test',
          lastName: 'User'
        });
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!'
        });

      expect(response.status).toBe(200);
      expect(response.body.accessToken).toBeDefined();
    });

    it('should reject invalid password', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword!'
        });

      expect(response.status).toBe(401);
    });
  });
});
```

### GraphQL Integration Tests

```typescript
// services/graphql-gateway/src/__tests__/products.integration.test.ts
import { createTestClient } from 'apollo-server-testing';
import { server } from '../server';
import { gql } from 'apollo-server';

const { query, mutate } = createTestClient(server);

describe('Products GraphQL API', () => {
  describe('Query: products', () => {
    it('should return paginated products', async () => {
      const PRODUCTS_QUERY = gql`
        query Products($pagination: PaginationInput) {
          products(pagination: $pagination) {
            edges {
              node {
                id
                name
                price
              }
            }
            pageInfo {
              totalCount
              hasNextPage
            }
          }
        }
      `;

      const response = await query({
        query: PRODUCTS_QUERY,
        variables: { pagination: { page: 1, limit: 10 } }
      });

      expect(response.errors).toBeUndefined();
      expect(response.data.products.edges).toBeDefined();
    });
  });
});
```

## 🌐 E2E Testing

### Cypress E2E Tests

```typescript
// cypress/e2e/checkout.cy.ts
describe('Checkout Flow', () => {
  beforeEach(() => {
    cy.login('customer@example.com', 'password123');
    cy.visit('/products');
  });

  it('should complete checkout successfully', () => {
    // Add product to cart
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.get('[data-testid="add-to-cart"]').click();
    });

    // Verify cart badge
    cy.get('[data-testid="cart-badge"]').should('contain', '1');

    // Go to cart
    cy.get('[data-testid="cart-icon"]').click();
    cy.url().should('include', '/cart');

    // Proceed to checkout
    cy.get('[data-testid="checkout-btn"]').click();
    cy.url().should('include', '/checkout');

    // Fill shipping info
    cy.get('[data-testid="shipping-form"]').within(() => {
      cy.get('input[name="fullName"]').type('John Doe');
      cy.get('input[name="address1"]').type('123 Main St');
      cy.get('input[name="city"]').type('New York');
      cy.get('input[name="postalCode"]').type('10001');
      cy.get('select[name="country"]').select('US');
    });

    // Select payment
    cy.get('[data-testid="payment-card"]').click();

    // Complete order
    cy.get('[data-testid="place-order"]').click();

    // Verify success
    cy.url().should('include', '/orders/');
    cy.get('[data-testid="order-success"]').should('be.visible');
  });

  it('should show error for empty cart checkout', () => {
    cy.visit('/checkout');
    cy.get('[data-testid="empty-cart-message"]').should('be.visible');
  });
});
```

### Cypress Custom Commands

```typescript
// cypress/support/commands.ts
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('API_URL')}/auth/login`,
    body: { email, password }
  }).then((response) => {
    window.localStorage.setItem('accessToken', response.body.accessToken);
    window.localStorage.setItem('refreshToken', response.body.refreshToken);
  });
});

Cypress.Commands.add('addToCart', (productId: string) => {
  cy.get(`[data-testid="product-${productId}"]`)
    .find('[data-testid="add-to-cart"]')
    .click();
});
```

## 📊 Coverage Requirements

### Coverage Thresholds

```javascript
// jest.config.js
module.exports = {
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    './src/services/': {
      branches: 90,
      functions: 90,
      lines: 90
    }
  }
};
```

### Coverage by Area

| Area | Min Coverage |
|------|-------------|
| Services (Business Logic) | 90% |
| Controllers | 80% |
| Components | 80% |
| Hooks | 85% |
| Utils | 90% |
| E2E Critical Paths | 100% |

## 🏃 Running Tests

### All Tests

```bash
# Run all tests
yarn test:all

# Run with coverage
yarn test:coverage:all

# Watch mode (development)
yarn test:watch
```

### By Area

```bash
# Frontend tests
yarn test:frontend

# Backend tests
yarn test:backend

# Specific service
yarn test:product
yarn test:auth
yarn test:order

# Specific app
yarn test:admin
yarn test:shell
yarn test:seller
```

### E2E Tests

```bash
# Open Cypress UI
yarn cy:open

# Run headless
yarn cy:run

# Run specific spec
yarn cy:run --spec "cypress/e2e/checkout.cy.ts"
```

### CI/CD Test Commands

```bash
# CI environment tests
CI=true yarn test:all --coverage --reporters=default --reporters=jest-junit

# With SonarQube report
yarn test:coverage:all && sonar-scanner
```

### Test Reports

```bash
# Generate coverage report
yarn test:coverage:all

# View HTML report
open coverage/lcov-report/index.html

# JUnit report (for CI)
yarn test:all --reporters=jest-junit
```

---

See also:
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Development workflow
- [CI-CD.md](./CI-CD.md) - CI/CD pipeline
