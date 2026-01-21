# GraphQL Gateway Architecture

## 📑 Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Service Structure](#service-structure)
- [Schema Design](#schema-design)
- [Federation](#federation)

## 🌐 Overview

GraphQL Gateway is the unified API layer that aggregates all microservices into a single GraphQL endpoint.

### Key Responsibilities

| Responsibility   | Description        |
| ---------------- | ------------------ |
| API Gateway      | Single entry point |
| Schema Stitching | Unified schema     |
| Authentication   | Token validation   |
| Rate Limiting    | Request throttling |
| Caching          | Response caching   |

## 🛠️ Technology Stack

| Category  | Technology    | Version      |
| --------- | ------------- | ------------ |
| Runtime   | Node.js       | 20.x LTS     |
| Framework | Express.js    | 4.x          |
| GraphQL   | Apollo Server | 4.x          |
| Language  | TypeScript    | 5.0+         |
| Cache     | Redis         | 7.x          |
| Auth      | JWT           | jsonwebtoken |

## 🏗️ Service Structure

```
services/graphql-gateway/
├── src/
│   ├── index.ts              # Entry point
│   ├── app.ts                # Express + Apollo
│   ├── config/
│   │   ├── env.ts
│   │   └── redis.ts
│   ├── schema/
│   │   ├── index.ts          # Schema stitching
│   │   ├── typeDefs/
│   │   │   ├── user.graphql
│   │   │   ├── product.graphql
│   │   │   ├── category.graphql
│   │   │   ├── order.graphql
│   │   │   └── coupon.graphql
│   │   └── resolvers/
│   │       ├── userResolvers.ts
│   │       ├── productResolvers.ts
│   │       ├── categoryResolvers.ts
│   │       ├── orderResolvers.ts
│   │       └── couponResolvers.ts
│   ├── dataSources/
│   │   ├── AuthAPI.ts
│   │   ├── ProductAPI.ts
│   │   ├── CategoryAPI.ts
│   │   ├── OrderAPI.ts
│   │   └── CouponAPI.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── rateLimiter.ts
│   ├── plugins/
│   │   └── cachePlugin.ts
│   └── utils/
├── tests/
└── package.json
```

## 📋 Schema Design

### Type Definitions

```graphql
# typeDefs/user.graphql
type User {
  id: ID!
  email: String!
  firstName: String
  lastName: String
  role: UserRole!
  avatar: String
  addresses: [Address!]!
  orders: [Order!]!
  createdAt: DateTime!
}

enum UserRole {
  USER
  SELLER
  ADMIN
}

type Address {
  id: ID!
  street: String!
  city: String!
  state: String!
  zipCode: String!
  country: String!
  isDefault: Boolean!
}

type AuthPayload {
  accessToken: String!
  refreshToken: String!
  user: User!
}

type Query {
  me: User
  user(id: ID!): User
  users(page: Int, limit: Int): UserConnection!
}

type Mutation {
  register(input: RegisterInput!): AuthPayload!
  login(input: LoginInput!): AuthPayload!
  refreshToken(token: String!): TokenPayload!
  updateProfile(input: UpdateProfileInput!): User!
  changePassword(input: ChangePasswordInput!): Boolean!
}
```

```graphql
# typeDefs/product.graphql
type Product {
  id: ID!
  name: String!
  slug: String!
  description: String!
  price: Float!
  comparePrice: Float
  images: [ProductImage!]!
  category: Category!
  seller: User!
  variants: [ProductVariant!]!
  quantity: Int!
  ratings: ProductRatings!
  reviews: [Review!]!
  createdAt: DateTime!
}

type ProductImage {
  url: String!
  alt: String
}

type ProductVariant {
  name: String!
  options: [String!]!
  price: Float
  sku: String
  quantity: Int
}

type ProductRatings {
  average: Float!
  count: Int!
}

type ProductConnection {
  products: [Product!]!
  pagination: Pagination!
}

input ProductFilterInput {
  q: String
  category: ID
  minPrice: Float
  maxPrice: Float
  rating: Float
  sort: ProductSort
}

enum ProductSort {
  PRICE_ASC
  PRICE_DESC
  RATING
  NEWEST
  POPULAR
}

type Query {
  products(filter: ProductFilterInput, page: Int, limit: Int): ProductConnection!
  product(id: ID, slug: String): Product
  featuredProducts(limit: Int): [Product!]!
}

type Mutation {
  createProduct(input: CreateProductInput!): Product!
  updateProduct(id: ID!, input: UpdateProductInput!): Product!
  deleteProduct(id: ID!): Boolean!
}
```

## 🔗 Federation

### Data Sources

```typescript
// dataSources/ProductAPI.ts
import { RESTDataSource } from '@apollo/datasource-rest';

export class ProductAPI extends RESTDataSource {
  override baseURL = process.env.PRODUCT_SERVICE_URL;

  async getProducts(filter: ProductFilterInput, page: number, limit: number) {
    return this.get('/products', {
      params: { ...filter, page, limit },
    });
  }

  async getProduct(id: string) {
    return this.get(`/products/${id}`, {
      cacheOptions: { ttl: 300 }, // 5 min cache
    });
  }

  async createProduct(input: CreateProductInput) {
    return this.post('/products', { body: input });
  }

  async updateProduct(id: string, input: UpdateProductInput) {
    return this.put(`/products/${id}`, { body: input });
  }

  async deleteProduct(id: string) {
    return this.delete(`/products/${id}`);
  }
}
```

### Resolvers

```typescript
// resolvers/productResolvers.ts
export const productResolvers = {
  Query: {
    products: async (_, { filter, page, limit }, { dataSources }) => {
      return dataSources.productAPI.getProducts(filter, page, limit);
    },
    product: async (_, { id, slug }, { dataSources }) => {
      if (id) return dataSources.productAPI.getProduct(id);
      if (slug) return dataSources.productAPI.getProductBySlug(slug);
    },
  },
  Mutation: {
    createProduct: async (_, { input }, { dataSources, user }) => {
      if (!user || !['seller', 'admin'].includes(user.role)) {
        throw new ForbiddenError('Not authorized');
      }
      return dataSources.productAPI.createProduct({ ...input, seller: user.id });
    },
  },
  Product: {
    category: async (product, _, { dataSources }) => {
      return dataSources.categoryAPI.getCategory(product.category);
    },
    seller: async (product, _, { dataSources }) => {
      return dataSources.authAPI.getUser(product.seller);
    },
    reviews: async (product, _, { dataSources }) => {
      return dataSources.productAPI.getProductReviews(product.id);
    },
  },
};
```

### Authentication Context

```typescript
// context.ts
export async function buildContext({ req }) {
  const token = req.headers.authorization?.replace('Bearer ', '');

  let user = null;
  if (token) {
    try {
      user = verifyToken(token);
    } catch (error) {
      // Token invalid or expired
    }
  }

  return {
    user,
    dataSources: {
      authAPI: new AuthAPI(),
      productAPI: new ProductAPI(),
      categoryAPI: new CategoryAPI(),
      orderAPI: new OrderAPI(),
      couponAPI: new CouponAPI(),
    },
  };
}
```

---

See also:

- [API.md](./API.md) - GraphQL API
- [TESTING.md](./TESTING.md) - Testing guide
