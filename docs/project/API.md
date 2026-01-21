# API Documentation

## 📑 Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [GraphQL API](#graphql-api)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Examples](#examples)

## 🌐 Overview

E-Storefront uses **GraphQL** as the primary API layer, accessible through a unified gateway.

### Base URLs

| Environment | URL                                           |
| ----------- | --------------------------------------------- |
| Development | `http://localhost:4000/graphql`               |
| Staging     | `https://staging-api.3asoftwares.com/graphql` |
| Production  | `https://api.3asoftwares.com/graphql`         |

### GraphQL Playground

Access the interactive GraphQL playground at:

- Development: `http://localhost:4000/graphql`

## 🔐 Authentication

### JWT Authentication

Include the JWT token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

### Token Lifecycle

| Token         | Duration   | Purpose              |
| ------------- | ---------- | -------------------- |
| Access Token  | 15 minutes | API authentication   |
| Refresh Token | 7 days     | Get new access token |

### Authentication Mutations

#### Register

```graphql
mutation Register($input: RegisterInput!) {
  register(input: $input) {
    user {
      id
      email
      firstName
      lastName
    }
    accessToken
    refreshToken
  }
}

# Variables
{
  "input": {
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### Login

```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) {
    user {
      id
      email
      role
    }
    accessToken
    refreshToken
  }
}

# Variables
{
  "input": {
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }
}
```

#### Refresh Token

```graphql
mutation RefreshToken {
  refreshToken {
    accessToken
    refreshToken
  }
}
```

#### Logout

```graphql
mutation Logout {
  logout
}
```

## 📝 GraphQL API

### Queries

#### Get Current User

```graphql
query Me {
  me {
    id
    email
    firstName
    lastName
    fullName
    role
    avatar
    isEmailVerified
    createdAt
  }
}
```

#### List Products

```graphql
query Products(
  $filter: ProductFilterInput
  $pagination: PaginationInput
  $sort: ProductSortInput
) {
  products(filter: $filter, pagination: $pagination, sort: $sort) {
    edges {
      node {
        id
        name
        slug
        price
        compareAtPrice
        images {
          url
          isPrimary
        }
        category {
          id
          name
          slug
        }
        rating {
          average
          count
        }
        quantity
        status
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      totalCount
      totalPages
      currentPage
    }
  }
}

# Variables
{
  "filter": {
    "search": "laptop",
    "categoryId": "cat_123",
    "minPrice": 500,
    "maxPrice": 2000,
    "status": "ACTIVE"
  },
  "pagination": {
    "page": 1,
    "limit": 20
  },
  "sort": {
    "field": "PRICE",
    "order": "ASC"
  }
}
```

#### Get Single Product

```graphql
query Product($id: ID, $slug: String) {
  product(id: $id, slug: $slug) {
    id
    name
    slug
    description
    shortDescription
    price
    compareAtPrice
    sku
    quantity
    images {
      url
      alt
      isPrimary
    }
    category {
      id
      name
      slug
      ancestors {
        id
        name
        slug
      }
    }
    seller {
      id
      firstName
      lastName
    }
    variants {
      name
      sku
      price
      quantity
    }
    rating {
      average
      count
    }
    seo {
      title
      description
      keywords
    }
    createdAt
    updatedAt
  }
}
```

#### List Categories

```graphql
query Categories($parentId: ID) {
  categories(parentId: $parentId) {
    id
    name
    slug
    description
    image
    icon
    level
    parent {
      id
      name
    }
    productCount
    isActive
    isFeatured
  }
}
```

#### List Orders

```graphql
query Orders($filter: OrderFilterInput, $pagination: PaginationInput) {
  orders(filter: $filter, pagination: $pagination) {
    edges {
      node {
        id
        orderNumber
        status
        subtotal
        discount
        shipping
        tax
        total
        items {
          product {
            id
            name
          }
          quantity
          price
          subtotal
        }
        payment {
          status
          method
        }
        shippingAddress {
          fullName
          city
          country
        }
        createdAt
      }
    }
    pageInfo {
      totalCount
      totalPages
      currentPage
    }
  }
}
```

### Mutations

#### Create Product

```graphql
mutation CreateProduct($input: CreateProductInput!) {
  createProduct(input: $input) {
    id
    name
    slug
    price
    status
  }
}

# Variables
{
  "input": {
    "name": "Wireless Bluetooth Headphones",
    "description": "Premium noise-cancelling headphones with 40-hour battery life",
    "price": 199.99,
    "compareAtPrice": 249.99,
    "sku": "WBH-001",
    "quantity": 100,
    "categoryId": "cat_electronics_audio",
    "images": [
      {
        "url": "https://cdn.example.com/headphones-1.jpg",
        "alt": "Black wireless headphones",
        "isPrimary": true
      }
    ],
    "tags": ["wireless", "bluetooth", "audio", "headphones"]
  }
}
```

#### Update Product

```graphql
mutation UpdateProduct($id: ID!, $input: UpdateProductInput!) {
  updateProduct(id: $id, input: $input) {
    id
    name
    price
    quantity
    status
    updatedAt
  }
}
```

#### Delete Product

```graphql
mutation DeleteProduct($id: ID!) {
  deleteProduct(id: $id)
}
```

#### Create Order

```graphql
mutation CreateOrder($input: CreateOrderInput!) {
  createOrder(input: $input) {
    id
    orderNumber
    status
    total
    payment {
      status
    }
  }
}

# Variables
{
  "input": {
    "items": [
      { "productId": "prod_123", "quantity": 2 },
      { "productId": "prod_456", "quantity": 1 }
    ],
    "shippingAddress": {
      "fullName": "John Doe",
      "address1": "123 Main St",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "US",
      "phone": "+1234567890"
    },
    "shippingMethod": "standard",
    "paymentMethod": "card",
    "couponCode": "SAVE10"
  }
}
```

#### Cart Operations

```graphql
# Add to Cart
mutation AddToCart($productId: ID!, $quantity: Int!) {
  addToCart(productId: $productId, quantity: $quantity) {
    id
    items {
      product {
        id
        name
        price
      }
      quantity
      subtotal
    }
    subtotal
    total
  }
}

# Update Cart Item
mutation UpdateCartItem($productId: ID!, $quantity: Int!) {
  updateCartItem(productId: $productId, quantity: $quantity) {
    id
    items {
      productId
      quantity
    }
    total
  }
}

# Remove from Cart
mutation RemoveFromCart($productId: ID!) {
  removeFromCart(productId: $productId) {
    id
    items {
      productId
    }
    total
  }
}
```

### Subscriptions

#### Order Status Updates

```graphql
subscription OrderStatusChanged($orderId: ID!) {
  orderStatusChanged(orderId: $orderId) {
    id
    orderNumber
    status
    statusHistory {
      status
      timestamp
      note
    }
    shipping {
      trackingNumber
      carrier
    }
  }
}
```

## ⚠️ Error Handling

### Error Response Format

```json
{
  "errors": [
    {
      "message": "Validation error message",
      "extensions": {
        "code": "VALIDATION_ERROR",
        "field": "email",
        "statusCode": 400
      },
      "path": ["register"]
    }
  ],
  "data": null
}
```

### Error Codes

| Code                   | HTTP Status | Description                   |
| ---------------------- | ----------- | ----------------------------- |
| `VALIDATION_ERROR`     | 400         | Invalid input data            |
| `AUTHENTICATION_ERROR` | 401         | Missing or invalid token      |
| `AUTHORIZATION_ERROR`  | 403         | Insufficient permissions      |
| `NOT_FOUND`            | 404         | Resource not found            |
| `CONFLICT`             | 409         | Resource conflict (duplicate) |
| `RATE_LIMIT_EXCEEDED`  | 429         | Too many requests             |
| `INTERNAL_ERROR`       | 500         | Server error                  |

## 🚦 Rate Limiting

### Limits

| Endpoint       | Limit | Window     |
| -------------- | ----- | ---------- |
| Mutations      | 100   | 15 minutes |
| Queries        | 1000  | 15 minutes |
| Auth endpoints | 10    | 15 minutes |

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

## 📋 Examples

### Apollo Client Setup

```typescript
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('accessToken');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
```

### React Query with GraphQL

```typescript
import { useQuery } from '@tanstack/react-query';
import { graphqlClient } from '@/lib/graphql';

const PRODUCTS_QUERY = `
  query Products($filter: ProductFilterInput) {
    products(filter: $filter) {
      edges {
        node {
          id
          name
          price
        }
      }
    }
  }
`;

export function useProducts(filter?: ProductFilterInput) {
  return useQuery({
    queryKey: ['products', filter],
    queryFn: () => graphqlClient.request(PRODUCTS_QUERY, { filter }),
  });
}
```

### cURL Examples

```bash
# Login
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { login(input: { email: \"user@example.com\", password: \"password123\" }) { accessToken } }"
  }'

# Get Products (authenticated)
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "query": "query { products { edges { node { id name price } } } }"
  }'
```

---

See also:

- [LLD.md](./LLD.md) - Low-Level Design
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture overview
