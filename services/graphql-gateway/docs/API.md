# GraphQL Gateway API

## 📑 Table of Contents

- [Overview](#overview)
- [Endpoint](#endpoint)
- [Authentication](#authentication)
- [Queries](#queries)
- [Mutations](#mutations)

## 🌐 Overview

Unified GraphQL API for all E-Storefront operations.

## 🔗 Endpoint

| Environment | URL                               |
| ----------- | --------------------------------- |
| Development | `http://localhost:4000/graphql`   |
| Production  | `https://api.example.com/graphql` |

## 🔐 Authentication

Include JWT token in Authorization header:

```
Authorization: Bearer <access_token>
```

## 📖 Queries

### Users

```graphql
# Get current user
query Me {
  me {
    id
    email
    firstName
    lastName
    role
  }
}
```

### Products

```graphql
# List products with filters
query Products($filter: ProductFilterInput, $page: Int, $limit: Int) {
  products(filter: $filter, page: $page, limit: $limit) {
    products {
      id
      name
      price
      images {
        url
      }
      ratings {
        average
        count
      }
    }
    pagination {
      page
      limit
      total
      pages
    }
  }
}

# Get product by ID or slug
query Product($id: ID, $slug: String) {
  product(id: $id, slug: $slug) {
    id
    name
    description
    price
    comparePrice
    images {
      url
      alt
    }
    category {
      id
      name
    }
    variants {
      name
      options
    }
    quantity
  }
}
```

### Categories

```graphql
# Get category tree
query CategoryTree {
  categoryTree {
    id
    name
    slug
    children {
      id
      name
      slug
      children {
        id
        name
        slug
      }
    }
  }
}
```

### Orders

```graphql
# Get user orders
query MyOrders($page: Int, $limit: Int, $status: OrderStatus) {
  myOrders(page: $page, limit: $limit, status: $status) {
    orders {
      id
      orderNumber
      status
      total
      createdAt
      items {
        name
        quantity
        price
      }
    }
    pagination { ... }
  }
}
```

## ✏️ Mutations

### Authentication

```graphql
# Register
mutation Register($input: RegisterInput!) {
  register(input: $input) {
    accessToken
    refreshToken
    user {
      id
      email
    }
  }
}

# Login
mutation Login($input: LoginInput!) {
  login(input: $input) {
    accessToken
    refreshToken
    user {
      id
      email
      role
    }
  }
}
```

### Products

```graphql
# Create product (seller/admin)
mutation CreateProduct($input: CreateProductInput!) {
  createProduct(input: $input) {
    id
    name
    slug
  }
}
```

### Orders

```graphql
# Create order
mutation CreateOrder($input: CreateOrderInput!) {
  createOrder(input: $input) {
    id
    orderNumber
    status
    total
    paymentIntent
  }
}
```

### Reviews

```graphql
# Add review
mutation AddReview($productId: ID!, $input: ReviewInput!) {
  addReview(productId: $productId, input: $input) {
    id
    rating
    comment
  }
}
```

---

See also:

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Service architecture
