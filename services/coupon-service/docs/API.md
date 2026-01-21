# Coupon Service API

## 📡 Endpoints

### Coupons

#### Validate Coupon

```http
POST /coupons/validate
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "code": "SAVE20",
  "cartTotal": 150.0,
  "items": [{ "productId": "...", "quantity": 2, "price": 75 }]
}
```

**Response (200):**

```json
{
  "success": true,
  "coupon": {
    "code": "SAVE20",
    "type": "percentage",
    "value": 20,
    "discount": 30.0,
    "description": "20% off your order"
  }
}
```

#### List Coupons (Admin)

```http
GET /coupons
Authorization: Bearer <token>
```

#### Create Coupon (Admin)

```http
POST /coupons
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "code": "SUMMER2026",
  "type": "percentage",
  "value": 25,
  "description": "Summer sale 25% off",
  "minPurchase": 50,
  "maxDiscount": 100,
  "usageLimit": 1000,
  "userLimit": 1,
  "startDate": "2026-06-01",
  "endDate": "2026-08-31"
}
```

#### Update Coupon (Admin)

```http
PUT /coupons/:id
Authorization: Bearer <token>
```

#### Delete Coupon (Admin)

```http
DELETE /coupons/:id
Authorization: Bearer <token>
```

#### Get Coupon Analytics (Admin)

```http
GET /coupons/:id/analytics
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "success": true,
  "analytics": {
    "totalUsage": 450,
    "totalDiscount": 4500,
    "usageByDay": [...],
    "topUsers": [...]
  }
}
```

---

See also:

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Service architecture
