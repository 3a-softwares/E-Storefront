# Order Service Architecture

## 📑 Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Service Structure](#service-structure)
- [Database Schema](#database-schema)
- [Order Workflow](#order-workflow)

## 🌐 Overview

Order Service manages the complete order lifecycle from creation to delivery.

### Key Responsibilities

| Responsibility     | Description                 |
| ------------------ | --------------------------- |
| Order Creation     | Cart to order conversion    |
| Status Management  | Order status transitions    |
| Payment Processing | Payment gateway integration |
| Notifications      | Order status notifications  |
| History            | Order history tracking      |

## 🛠️ Technology Stack

| Category  | Technology | Version  |
| --------- | ---------- | -------- |
| Runtime   | Node.js    | 20.x LTS |
| Framework | Express.js | 4.x      |
| Language  | TypeScript | 5.0+     |
| Database  | MongoDB    | 7.0      |
| ODM       | Mongoose   | 8.x      |
| Queue     | Bull       | 4.x      |
| Cache     | Redis      | 7.x      |
| Payment   | Stripe     | Latest   |

## 🏗️ Service Structure

```
services/order-service/
├── src/
│   ├── index.ts
│   ├── app.ts
│   ├── config/
│   │   ├── db.ts
│   │   ├── redis.ts
│   │   └── stripe.ts
│   ├── controllers/
│   │   ├── orderController.ts
│   │   └── paymentController.ts
│   ├── models/
│   │   ├── Order.ts
│   │   └── Payment.ts
│   ├── routes/
│   ├── services/
│   │   ├── orderService.ts
│   │   ├── paymentService.ts
│   │   └── notificationService.ts
│   ├── jobs/
│   │   └── orderJobs.ts
│   └── utils/
├── tests/
└── package.json
```

## 💾 Database Schema

### Order Model

```typescript
// models/Order.ts
const OrderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        name: String,
        price: Number,
        quantity: Number,
        variant: String,
        image: String,
      },
    ],
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
      phone: String,
    },
    billingAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    subtotal: Number,
    shippingCost: Number,
    tax: Number,
    discount: Number,
    total: Number,
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coupon',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentMethod: String,
    paymentId: String,
    trackingNumber: String,
    notes: String,
    statusHistory: [
      {
        status: String,
        timestamp: Date,
        note: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ orderNumber: 1 }, { unique: true });
OrderSchema.index({ status: 1 });
```

## 📊 Order Workflow

### Status Transitions

```
┌─────────┐     ┌───────────┐     ┌────────────┐
│ Pending │────>│ Confirmed │────>│ Processing │
└─────────┘     └───────────┘     └─────┬──────┘
     │                                   │
     │                                   ▼
     │                            ┌───────────┐
     │                            │  Shipped  │
     │                            └─────┬─────┘
     │                                  │
     │                                  ▼
     │                            ┌───────────┐
     ▼                            │ Delivered │
┌───────────┐                     └───────────┘
│ Cancelled │
└───────────┘
```

### Status Rules

| Current Status | Allowed Transitions   |
| -------------- | --------------------- |
| pending        | confirmed, cancelled  |
| confirmed      | processing, cancelled |
| processing     | shipped, cancelled    |
| shipped        | delivered             |
| delivered      | refunded              |
| cancelled      | -                     |
| refunded       | -                     |

### Order Creation Flow

```typescript
// services/orderService.ts
export async function createOrder(userId: string, orderData: CreateOrderInput) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Validate cart items and check stock
    const validatedItems = await validateCartItems(orderData.items);

    // 2. Calculate totals
    const totals = calculateTotals(validatedItems, orderData.coupon);

    // 3. Create order
    const order = await Order.create(
      [
        {
          orderNumber: generateOrderNumber(),
          user: userId,
          items: validatedItems,
          ...orderData,
          ...totals,
          status: 'pending',
          paymentStatus: 'pending',
          statusHistory: [
            {
              status: 'pending',
              timestamp: new Date(),
              note: 'Order created',
            },
          ],
        },
      ],
      { session }
    );

    // 4. Update inventory
    await updateInventory(validatedItems, session);

    // 5. Apply coupon if exists
    if (orderData.coupon) {
      await applyCouponUsage(orderData.coupon, session);
    }

    await session.commitTransaction();

    // 6. Send confirmation email (async)
    notificationQueue.add('orderConfirmation', { orderId: order[0]._id });

    return order[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}
```

---

See also:

- [API.md](./API.md) - API endpoints
- [TESTING.md](./TESTING.md) - Testing guide
