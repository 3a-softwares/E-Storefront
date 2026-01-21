# REST APIs

## Overview

**Category:** API Design  
**Protocol:** HTTP/HTTPS  
**Format:** JSON

REST (Representational State Transfer) is an architectural style for designing networked applications using stateless HTTP requests.

---

## Why REST APIs?

### Benefits

| Benefit        | Description                                    |
| -------------- | ---------------------------------------------- |
| **Simplicity** | Standard HTTP methods (GET, POST, PUT, DELETE) |
| **Stateless**  | Each request is independent                    |
| **Cacheable**  | HTTP caching for performance                   |
| **Scalable**   | Easy to scale horizontally                     |
| **Flexible**   | Multiple formats (JSON, XML)                   |

### Why We Use REST

1. **Inter-Service** - Communication between microservices
2. **External APIs** - Third-party integrations
3. **Simple CRUD** - Straightforward data operations
4. **Caching** - HTTP caching for performance
5. **Tooling** - Wide ecosystem support

---

## HTTP Methods

### CRUD Operations

| Method | Purpose          | Idempotent | Safe |
| ------ | ---------------- | ---------- | ---- |
| GET    | Read resource    | Yes        | Yes  |
| POST   | Create resource  | No         | No   |
| PUT    | Update (full)    | Yes        | No   |
| PATCH  | Update (partial) | No         | No   |
| DELETE | Remove resource  | Yes        | No   |

---

## API Design

### Route Structure

```
GET     /api/products           # List all products
GET     /api/products/:id       # Get single product
POST    /api/products           # Create product
PUT     /api/products/:id       # Update product (full)
PATCH   /api/products/:id       # Update product (partial)
DELETE  /api/products/:id       # Delete product

# Nested resources
GET     /api/products/:id/reviews    # Get product reviews
POST    /api/products/:id/reviews    # Add review to product

# Query parameters
GET     /api/products?category=electronics&sort=price&order=asc&page=1&limit=10
```

### Controller Implementation

```typescript
// services/product-service/src/controllers/product.controller.ts
import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';

export class ProductController {
  constructor(private productService: ProductService) {}

  async getAll(req: Request, res: Response) {
    try {
      const { category, sort, order, page = 1, limit = 10 } = req.query;

      const products = await this.productService.findAll({
        filter: category ? { category: String(category) } : {},
        sort: sort ? { [String(sort)]: order === 'desc' ? -1 : 1 } : {},
        pagination: { page: Number(page), limit: Number(limit) },
      });

      res.json({
        data: products.items,
        meta: {
          total: products.total,
          page: products.page,
          limit: products.limit,
          totalPages: products.totalPages,
        },
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const product = await this.productService.findById(req.params.id);

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json({ data: product });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const product = await this.productService.create(req.body);
      res.status(201).json({ data: product });
    } catch (error) {
      res.status(400).json({ error: 'Failed to create product' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const product = await this.productService.update(req.params.id, req.body);

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json({ data: product });
    } catch (error) {
      res.status(400).json({ error: 'Failed to update product' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const deleted = await this.productService.delete(req.params.id);

      if (!deleted) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  }
}
```

### Route Registration

```typescript
// services/product-service/src/routes/product.routes.ts
import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createProductSchema, updateProductSchema } from '../schemas/product.schema';

const router = Router();
const controller = new ProductController(new ProductService());

router.get('/', controller.getAll.bind(controller));
router.get('/:id', controller.getById.bind(controller));

router.post(
  '/',
  authenticate,
  authorize(['admin', 'seller']),
  validate(createProductSchema),
  controller.create.bind(controller)
);

router.put(
  '/:id',
  authenticate,
  authorize(['admin', 'seller']),
  validate(updateProductSchema),
  controller.update.bind(controller)
);

router.delete('/:id', authenticate, authorize(['admin']), controller.delete.bind(controller));

export default router;
```

---

## Response Format

### Success Response

```typescript
// Single resource
{
  "data": {
    "id": "123",
    "name": "Product Name",
    "price": 99.99
  }
}

// Collection
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

### Error Response

```typescript
// Error format
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### HTTP Status Codes

| Code | Meaning               | Usage                    |
| ---- | --------------------- | ------------------------ |
| 200  | OK                    | Successful GET/PUT/PATCH |
| 201  | Created               | Successful POST          |
| 204  | No Content            | Successful DELETE        |
| 400  | Bad Request           | Validation error         |
| 401  | Unauthorized          | Missing/invalid auth     |
| 403  | Forbidden             | Insufficient permissions |
| 404  | Not Found             | Resource doesn't exist   |
| 409  | Conflict              | Duplicate resource       |
| 422  | Unprocessable Entity  | Business logic error     |
| 500  | Internal Server Error | Server error             |

---

## Client Implementation

### Axios Client

```typescript
// lib/api.ts
import axios, { AxiosInstance, AxiosError } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API methods
export const productApi = {
  getAll: (params?: ProductQueryParams) => api.get<ProductListResponse>('/products', { params }),

  getById: (id: string) => api.get<ProductResponse>(`/products/${id}`),

  create: (data: CreateProductInput) => api.post<ProductResponse>('/products', data),

  update: (id: string, data: UpdateProductInput) =>
    api.put<ProductResponse>(`/products/${id}`, data),

  delete: (id: string) => api.delete(`/products/${id}`),
};
```

### React Query Integration

```typescript
// hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi } from '@/lib/api';

export function useProducts(params?: ProductQueryParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productApi.getAll(params),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => productApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
```

---

## Best Practices

1. **Consistent Naming** - Use plural nouns for resources
2. **Versioning** - `/api/v1/products`
3. **Pagination** - Always paginate collections
4. **Filtering** - Query params for filters
5. **Error Handling** - Consistent error format
6. **Documentation** - OpenAPI/Swagger specs

---

## Related Documentation

- [GRAPHQL.md](GRAPHQL.md) - GraphQL alternative
- [EXPRESS.md](EXPRESS.md) - Express.js framework
- [MIDDLEWARE.md](MIDDLEWARE.md) - Middleware patterns
