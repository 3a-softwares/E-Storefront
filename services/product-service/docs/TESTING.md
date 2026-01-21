# Product Service Testing Guide

## 📑 Table of Contents

- [Overview](#overview)
- [Unit Testing](#unit-testing)
- [Integration Testing](#integration-testing)
- [Running Tests](#running-tests)

## 🌐 Overview

Product Service testing with Jest and Supertest.

## 🧪 Unit Testing

### Testing Product Service

```typescript
// tests/unit/productService.test.ts
import { ProductService } from '../../src/services/productService';
import { Product } from '../../src/models/Product';

jest.mock('../../src/models/Product');

describe('ProductService', () => {
  describe('createProduct', () => {
    it('creates product with slug', async () => {
      const productData = {
        name: 'Test Product',
        price: 99.99,
        description: 'A test product',
        category: 'category-id',
        seller: 'seller-id',
      };

      (Product.create as jest.Mock).mockResolvedValue({
        _id: '123',
        ...productData,
        slug: 'test-product',
      });

      const result = await ProductService.createProduct(productData);

      expect(result.slug).toBe('test-product');
      expect(Product.create).toHaveBeenCalled();
    });
  });

  describe('searchProducts', () => {
    it('applies filters correctly', async () => {
      const mockFind = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([]),
      };

      (Product.find as jest.Mock).mockReturnValue(mockFind);
      (Product.countDocuments as jest.Mock).mockResolvedValue(0);

      await ProductService.searchProducts({
        category: 'cat-id',
        minPrice: 50,
        maxPrice: 100,
      });

      expect(Product.find).toHaveBeenCalledWith(
        expect.objectContaining({
          category: 'cat-id',
          price: { $gte: 50, $lte: 100 },
        })
      );
    });
  });
});
```

## 🔗 Integration Testing

```typescript
// tests/integration/products.test.ts
import request from 'supertest';
import app from '../../src/app';
import { Product } from '../../src/models/Product';

describe('GET /products', () => {
  it('returns paginated products', async () => {
    const res = await request(app).get('/api/products').query({ page: 1, limit: 10 });

    expect(res.status).toBe(200);
    expect(res.body.products).toBeDefined();
    expect(res.body.pagination).toBeDefined();
  });

  it('filters by category', async () => {
    const res = await request(app).get('/api/products').query({ category: 'electronics' });

    expect(res.status).toBe(200);
  });
});

describe('POST /products', () => {
  it('creates product with valid data', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({
        name: 'New Product',
        price: 99.99,
        description: 'Description',
        category: categoryId,
        quantity: 10,
      });

    expect(res.status).toBe(201);
    expect(res.body.product.name).toBe('New Product');
  });

  it('rejects without auth', async () => {
    const res = await request(app).post('/api/products').send({ name: 'Product' });

    expect(res.status).toBe(401);
  });
});
```

## 🏃 Running Tests

```bash
yarn test
yarn test:watch
yarn test:coverage
```

---

See also:

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Service architecture
