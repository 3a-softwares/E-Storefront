# Coupon Service Architecture

## 📑 Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Service Structure](#service-structure)
- [Database Schema](#database-schema)
- [Coupon Types](#coupon-types)

## 🌐 Overview

Coupon Service manages discount codes, promotions, and coupon validation.

### Key Responsibilities

| Responsibility | Description            |
| -------------- | ---------------------- |
| Coupon CRUD    | Create, manage coupons |
| Validation     | Validate coupon usage  |
| Application    | Calculate discounts    |
| Tracking       | Usage analytics        |

## 🛠️ Technology Stack

| Category  | Technology  |
| --------- | ----------- |
| Runtime   | Node.js 20  |
| Framework | Express.js  |
| Language  | TypeScript  |
| Database  | MongoDB 7.0 |
| Cache     | Redis       |

## 🏗️ Service Structure

```
services/coupon-service/
├── src/
│   ├── index.ts
│   ├── app.ts
│   ├── config/
│   ├── controllers/
│   │   └── couponController.ts
│   ├── models/
│   │   └── Coupon.ts
│   ├── routes/
│   ├── services/
│   │   └── couponService.ts
│   └── utils/
├── tests/
└── package.json
```

## 💾 Database Schema

### Coupon Model

```typescript
// models/Coupon.ts
const CouponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    type: {
      type: String,
      enum: ['percentage', 'fixed', 'free_shipping'],
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    description: String,
    minPurchase: {
      type: Number,
      default: 0,
    },
    maxDiscount: Number,
    usageLimit: Number,
    usageCount: {
      type: Number,
      default: 0,
    },
    userLimit: {
      type: Number,
      default: 1,
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    excludedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    startDate: Date,
    endDate: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
    usedBy: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        usedAt: Date,
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
      },
    ],
  },
  {
    timestamps: true,
  }
);
```

## 🎫 Coupon Types

| Type          | Description      | Example     |
| ------------- | ---------------- | ----------- |
| percentage    | Percentage off   | 20% off     |
| fixed         | Fixed amount off | $10 off     |
| free_shipping | Free shipping    | $0 shipping |

### Validation Rules

```typescript
// services/couponService.ts
export async function validateCoupon(
  code: string,
  userId: string,
  cartTotal: number,
  items: CartItem[]
) {
  const coupon = await Coupon.findOne({ code: code.toUpperCase() });

  if (!coupon) {
    throw new Error('Invalid coupon code');
  }

  // Check if active
  if (!coupon.isActive) {
    throw new Error('Coupon is no longer active');
  }

  // Check dates
  const now = new Date();
  if (coupon.startDate && now < coupon.startDate) {
    throw new Error('Coupon is not yet valid');
  }
  if (coupon.endDate && now > coupon.endDate) {
    throw new Error('Coupon has expired');
  }

  // Check usage limit
  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
    throw new Error('Coupon usage limit reached');
  }

  // Check user limit
  const userUsage = coupon.usedBy.filter((u) => u.user.toString() === userId).length;
  if (userUsage >= coupon.userLimit) {
    throw new Error('You have already used this coupon');
  }

  // Check minimum purchase
  if (cartTotal < coupon.minPurchase) {
    throw new Error(`Minimum purchase of $${coupon.minPurchase} required`);
  }

  return coupon;
}
```

### Discount Calculation

```typescript
export function calculateDiscount(coupon: Coupon, cartTotal: number) {
  let discount = 0;

  switch (coupon.type) {
    case 'percentage':
      discount = (cartTotal * coupon.value) / 100;
      break;
    case 'fixed':
      discount = coupon.value;
      break;
    case 'free_shipping':
      return { type: 'free_shipping', amount: 0 };
  }

  // Apply max discount cap
  if (coupon.maxDiscount && discount > coupon.maxDiscount) {
    discount = coupon.maxDiscount;
  }

  return { type: coupon.type, amount: discount };
}
```

---

See also:

- [API.md](./API.md) - API endpoints
- [TESTING.md](./TESTING.md) - Testing guide
