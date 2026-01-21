# GraphQL Gateway Testing Guide

## 🧪 Unit Testing

### Testing Resolvers

```typescript
// tests/unit/productResolvers.test.ts
import { productResolvers } from '../../src/schema/resolvers/productResolvers';

describe('productResolvers', () => {
  const mockDataSources = {
    productAPI: {
      getProducts: jest.fn(),
      getProduct: jest.fn(),
    },
  };

  describe('Query.products', () => {
    it('calls productAPI with correct params', async () => {
      mockDataSources.productAPI.getProducts.mockResolvedValue({
        products: [],
        pagination: { page: 1, total: 0 },
      });

      await productResolvers.Query.products(
        null,
        { filter: { category: 'cat-id' }, page: 1, limit: 10 },
        { dataSources: mockDataSources }
      );

      expect(mockDataSources.productAPI.getProducts).toHaveBeenCalledWith(
        { category: 'cat-id' },
        1,
        10
      );
    });
  });

  describe('Mutation.createProduct', () => {
    it('throws if user not authorized', async () => {
      const context = { user: { role: 'user' }, dataSources: mockDataSources };

      await expect(
        productResolvers.Mutation.createProduct(null, { input: {} }, context)
      ).rejects.toThrow('Not authorized');
    });

    it('creates product for seller', async () => {
      mockDataSources.productAPI.createProduct = jest.fn().mockResolvedValue({
        id: '123',
        name: 'New Product',
      });

      const context = {
        user: { id: 'seller-id', role: 'seller' },
        dataSources: mockDataSources,
      };

      const result = await productResolvers.Mutation.createProduct(
        null,
        { input: { name: 'New Product', price: 99 } },
        context
      );

      expect(result.name).toBe('New Product');
    });
  });
});
```

## 🔗 Integration Testing

```typescript
// tests/integration/graphql.test.ts
import { createTestClient } from 'apollo-server-testing';
import { constructTestServer } from '../utils/testServer';

const GET_PRODUCTS = `
  query Products($filter: ProductFilterInput) {
    products(filter: $filter) {
      products {
        id
        name
        price
      }
      pagination {
        total
      }
    }
  }
`;

describe('GraphQL Integration', () => {
  let query, mutate;

  beforeAll(() => {
    const { server } = constructTestServer();
    const testClient = createTestClient(server);
    query = testClient.query;
    mutate = testClient.mutate;
  });

  describe('Query.products', () => {
    it('returns products list', async () => {
      const res = await query({
        query: GET_PRODUCTS,
        variables: { filter: {} },
      });

      expect(res.errors).toBeUndefined();
      expect(res.data.products.products).toBeDefined();
    });
  });
});
```

## 🏃 Running Tests

```bash
yarn test
yarn test:coverage
```

---

See also:

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Service architecture
