# Order Service API

## 📡 Endpoints

### Orders

#### Create Order

```http
POST /orders
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "items": [{ "productId": "...", "quantity": 2, "variant": "M" }],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA",
    "phone": "+1234567890"
  },
  "paymentMethod": "stripe",
  "couponCode": "SAVE10"
}
```

**Response (201):**

```json
{
  "success": true,
  "order": {
    "id": "...",
    "orderNumber": "ORD-2026-001234",
    "status": "pending",
    "total": 199.98,
    "paymentIntent": "pi_..."
  }
}
```

#### List User Orders

```http
GET /orders
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | Filter by status |
| page | number | Page number |
| limit | number | Items per page |

#### Get Order Details

```http
GET /orders/:id
Authorization: Bearer <token>
```

#### Cancel Order

```http
POST /orders/:id/cancel
Authorization: Bearer <token>
```

### Admin/Seller Endpoints

#### Update Order Status

```http
PUT /orders/:id/status
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "status": "shipped",
  "trackingNumber": "1Z999AA10123456784",
  "note": "Shipped via UPS"
}
```

#### List All Orders (Admin)

```http
GET /admin/orders
Authorization: Bearer <token>
```

### Payments

#### Confirm Payment

```http
POST /orders/:id/payment/confirm
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "paymentIntentId": "pi_..."
}
```

#### Request Refund

```http
POST /orders/:id/refund
Authorization: Bearer <token>
```

---

See also:

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Service architecture
