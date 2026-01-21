# Cypress

**Version:** 13.6.0 | **Category:** End-to-End Testing Framework

---

## Configuration

```typescript
// cypress.config.ts
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3004',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    retries: { runMode: 2, openMode: 0 },
    defaultCommandTimeout: 10000,
  },
  component: {
    devServer: { framework: 'next', bundler: 'webpack' },
  },
});
```

### Support Setup

```typescript
// cypress/support/e2e.ts
import './commands';

beforeEach(() => {
  cy.clearLocalStorage();
});
```

### Custom Commands

```typescript
// cypress/support/commands.ts
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      mockGraphQL(operationName: string, response: any): Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.intercept('POST', '**/graphql', (req) => {
    if (req.body.operationName === 'Login') {
      req.reply({
        data: {
          login: {
            token: 'mock-jwt-token',
            user: { id: '1', email, name: 'Test User' },
          },
        },
      });
    }
  }).as('loginRequest');

  cy.visit('/login');
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="login-button"]').click();
  cy.wait('@loginRequest');
});

Cypress.Commands.add('mockGraphQL', (operationName: string, response: any) => {
  cy.intercept('POST', '**/graphql', (req) => {
    if (req.body.operationName === operationName) {
      req.reply({ data: response });
    }
  }).as(operationName);
});
```

---

## Test Examples

### Authentication Tests

```typescript
// cypress/e2e/auth.cy.ts
describe('Authentication', () => {
  beforeEach(() => cy.clearLocalStorage());

  it('should login successfully', () => {
    cy.intercept('POST', '**/graphql', (req) => {
      if (req.body.operationName === 'Login') {
        req.reply({
          data: { login: { token: 'mock-token', user: { id: '1', email: 'test@example.com' } } },
        });
      }
    }).as('loginRequest');

    cy.visit('/login');
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="login-button"]').click();
    cy.wait('@loginRequest');
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('should show error for invalid credentials', () => {
    cy.intercept('POST', '**/graphql', (req) => {
      if (req.body.operationName === 'Login') {
        req.reply({ errors: [{ message: 'Invalid credentials' }] });
      }
    });

    cy.visit('/login');
    cy.get('[data-testid="email-input"]').type('wrong@email.com');
    cy.get('[data-testid="password-input"]').type('wrongpassword');
    cy.get('[data-testid="login-button"]').click();
    cy.get('[data-testid="login-error"]').should('be.visible');
  });
});
```

### Cart Tests

```typescript
// cypress/e2e/cart.cy.ts
describe('Shopping Cart', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.intercept('POST', '**/graphql', (req) => {
      if (req.body.operationName === 'GetProducts') {
        req.reply({
          data: {
            products: {
              products: [
                { id: '1', name: 'Product 1', price: 99.99, stock: 10, images: ['/img.jpg'] },
              ],
              total: 1,
            },
          },
        });
      }
    });
    cy.visit('/products');
  });

  it('should add product to cart', () => {
    cy.get('[data-testid="product-card"]').first().find('[data-testid="add-to-cart"]').click();
    cy.get('[data-testid="cart-count"]').should('contain', '1');
  });

  it('should update quantity in cart', () => {
    cy.get('[data-testid="product-card"]').first().find('[data-testid="add-to-cart"]').click();
    cy.visit('/cart');
    cy.get('[data-testid="quantity-increase"]').click();
    cy.get('[data-testid="item-quantity"]').should('contain', '2');
  });

  it('should remove item from cart', () => {
    cy.get('[data-testid="product-card"]').first().find('[data-testid="add-to-cart"]').click();
    cy.visit('/cart');
    cy.get('[data-testid="remove-item"]').click();
    cy.get('[data-testid="empty-cart-message"]').should('be.visible');
  });
});
```

### Checkout Tests

```typescript
// cypress/e2e/checkout.cy.ts
describe('Checkout Flow', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.login('test@example.com', 'password123');
    cy.visit('/products');
    cy.get('[data-testid="product-card"]').first().find('[data-testid="add-to-cart"]').click();
  });

  it('should complete checkout successfully', () => {
    cy.intercept('POST', '**/graphql', (req) => {
      if (req.body.operationName === 'CreateOrder') {
        req.reply({
          data: {
            createOrder: { id: 'order-123', orderNumber: 'ORD-2026-001', status: 'PENDING' },
          },
        });
      }
    }).as('createOrder');

    cy.visit('/checkout');
    cy.get('[data-testid="address-select"]').click();
    cy.get('[data-testid="address-option"]').first().click();
    cy.get('[data-testid="payment-method-card"]').click();
    cy.get('[data-testid="place-order-button"]').click();
    cy.wait('@createOrder');
    cy.url().should('include', '/orders/order-123');
  });
});
```

### Product Search Tests

```typescript
// cypress/e2e/products.cy.ts
describe('Product Search and Filtering', () => {
  beforeEach(() => cy.visit('/products'));

  it('should search for products', () => {
    cy.get('[data-testid="search-input"]').type('laptop');
    cy.get('[data-testid="search-button"]').click();
    cy.url().should('include', 'search=laptop');
  });

  it('should filter by category', () => {
    cy.get('[data-testid="category-filter"]').click();
    cy.get('[data-testid="category-electronics"]').click();
    cy.url().should('include', 'category=electronics');
  });

  it('should sort products by price', () => {
    cy.get('[data-testid="sort-select"]').select('price-asc');
    cy.url().should('include', 'sortBy=price');
  });
});
```

---

## API Mocking Patterns

```typescript
// Mock successful response
cy.intercept('POST', '**/graphql', (req) => {
  if (req.body.operationName === 'GetProducts') {
    req.reply({ data: { products: [...] } });
  }
});

// Mock error response
cy.intercept('POST', '**/graphql', {
  statusCode: 500,
  body: { errors: [{ message: 'Internal server error' }] },
});

// Mock network error
cy.intercept('POST', '**/graphql', { forceNetworkError: true });
```

---

## Best Practices

### Use data-testid for Selection

```tsx
<button data-testid="submit-order">Place Order</button>
// Test: cy.get('[data-testid="submit-order"]').click();
```

### Avoid Arbitrary Waits

```typescript
// ❌ cy.wait(2000);
// ✅ cy.get('.result').should('exist'); // Auto-waits
```

### Keep Tests Independent

```typescript
// Each test should set up its own state
it('should delete an order', () => {
  cy.createOrder({ product: 'test' }); // Setup
  cy.get('[data-testid^="order-"]').first().find('.delete').click();
});
```

### Use Aliases

```typescript
cy.get('[data-testid="product-card"]').first().as('firstProduct');
cy.get('@firstProduct').find('.add-to-cart').click();
```

---

## Commands

| Command                                 | Description             |
| --------------------------------------- | ----------------------- |
| `npm run cy:open`                       | Open interactive runner |
| `npm run cy:run`                        | Run headlessly          |
| `npm run cy:e2e`                        | Run with dev server     |
| `npx cypress run --spec "path/to/spec"` | Run specific test       |
| `npx cypress run --browser chrome`      | Run in Chrome           |

---

## Related Documentation

- [Cypress Documentation](https://docs.cypress.io/)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Testing Library Cypress](https://testing-library.com/docs/cypress-testing-library/intro/)
