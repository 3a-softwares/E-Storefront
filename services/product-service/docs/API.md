# Product Service API

## 📑 Table of Contents

- [Overview](#overview)
- [Base URL](#base-url)
- [Endpoints](#endpoints)

## 🌐 Overview

REST API for product management and search.

## 🔗 Base URL

| Environment | URL                                |
| ----------- | ---------------------------------- |
| Development | `http://localhost:4002/api`        |
| Production  | `https://api.example.com/products` |

## 📡 Endpoints

### Products

#### List Products

```http
GET /products
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| q | string | Search query |
| category | string | Category ID |
| minPrice | number | Minimum price |
| maxPrice | number | Maximum price |
| rating | number | Minimum rating (1-5) |
| sort | string | Sort option |
| page | number | Page number |
| limit | number | Items per page |

**Sort Options:**

- `price-asc` - Price low to high
- `price-desc` - Price high to low
- `rating` - Highest rated
- `newest` - Most recent
- `popular` - Most reviewed

**Response (200):**

```json
{
  "success": true,
  "products": [
    {
      "id": "64abc123...",
      "name": "Product Name",
      "slug": "product-name",
      "price": 99.99,
      "comparePrice": 149.99,
      "images": [{ "url": "https://..." }],
      "category": { "id": "...", "name": "Electronics" },
      "ratings": { "average": 4.5, "count": 128 }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "pages": 8
  }
}
```

#### Get Product

```http
GET /products/:id
```

**Response (200):**

```json
{
  "success": true,
  "product": {
    "id": "64abc123...",
    "name": "Product Name",
    "slug": "product-name",
    "description": "Product description...",
    "price": 99.99,
    "comparePrice": 149.99,
    "sku": "SKU-001",
    "images": [{ "url": "https://...", "alt": "Product image" }],
    "variants": [{ "name": "Size", "options": ["S", "M", "L"] }],
    "category": { "id": "...", "name": "Electronics" },
    "seller": { "id": "...", "name": "Store Name" },
    "quantity": 50,
    "ratings": { "average": 4.5, "count": 128 },
    "attributes": { "brand": "Brand X" }
  }
}
```

#### Create Product (Seller/Admin)

```http
POST /products
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**

```json
{
  "name": "Product Name",
  "description": "Description",
  "price": 99.99,
  "comparePrice": 149.99,
  "sku": "SKU-001",
  "category": "category-id",
  "quantity": 50,
  "images": [File],
  "variants": [{ "name": "Size", "options": ["S", "M", "L"] }]
}
```

#### Update Product (Seller/Admin)

```http
PUT /products/:id
Authorization: Bearer <token>
```

#### Delete Product (Seller/Admin)

```http
DELETE /products/:id
Authorization: Bearer <token>
```

### Reviews

#### List Product Reviews

```http
GET /products/:id/reviews
```

**Response (200):**

```json
{
  "success": true,
  "reviews": [
    {
      "id": "...",
      "user": { "id": "...", "firstName": "John" },
      "rating": 5,
      "title": "Great product!",
      "comment": "Really happy with this purchase",
      "verified": true,
      "createdAt": "2026-01-15T..."
    }
  ],
  "pagination": { ... }
}
```

#### Create Review

```http
POST /products/:id/reviews
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "rating": 5,
  "title": "Great product!",
  "comment": "Really happy with this purchase"
}
```

### Inventory (Seller/Admin)

#### Update Stock

```http
PUT /products/:id/inventory
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "quantity": 100
}
```

---

See also:

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Service architecture
- [TESTING.md](./TESTING.md) - Testing guide
