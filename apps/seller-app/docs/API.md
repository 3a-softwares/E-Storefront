# Seller App API Integration

## 📑 Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Endpoints](#endpoints)

## 🌐 Overview

Seller App uses the GraphQL Gateway and REST APIs for backend communication.

## 🔐 Authentication

Sellers authenticate via the Auth Service and receive JWT tokens.

```typescript
// Only sellers with verified accounts can access
interface SellerAuth {
  userId: string;
  sellerId: string;
  role: 'seller';
  verified: boolean;
}
```

## 🔌 Endpoints

### Seller Products

| Method | Endpoint                   | Description            |
| ------ | -------------------------- | ---------------------- |
| GET    | `/api/seller/products`     | List seller's products |
| POST   | `/api/seller/products`     | Create product         |
| PUT    | `/api/seller/products/:id` | Update product         |
| DELETE | `/api/seller/products/:id` | Delete product         |

### Seller Orders

| Method | Endpoint                        | Description          |
| ------ | ------------------------------- | -------------------- |
| GET    | `/api/seller/orders`            | List seller's orders |
| GET    | `/api/seller/orders/:id`        | Get order details    |
| PUT    | `/api/seller/orders/:id/status` | Update order status  |

### Inventory

| Method | Endpoint                           | Description   |
| ------ | ---------------------------------- | ------------- |
| GET    | `/api/seller/inventory`            | Get inventory |
| PUT    | `/api/seller/inventory/:productId` | Update stock  |

### Analytics

| Method | Endpoint                         | Description         |
| ------ | -------------------------------- | ------------------- |
| GET    | `/api/seller/analytics/sales`    | Sales data          |
| GET    | `/api/seller/analytics/orders`   | Order stats         |
| GET    | `/api/seller/analytics/products` | Product performance |

---

See also:

- [ARCHITECTURE.md](./ARCHITECTURE.md) - App architecture
