# Order Service Testing Guide

## 🧪 Unit Testing

```typescript
// tests/unit/orderService.test.ts
describe('OrderService', () => {
  describe('createOrder', () => {
    it('creates order with valid data', async () => {
      const orderData = {
        items: [{ productId: '123', quantity: 2 }],
        shippingAddress: { city: 'New York' },
      };

      const result = await OrderService.createOrder('user-id', orderData);

      expect(result.orderNumber).toMatch(/^ORD-/);
      expect(result.status).toBe('pending');
    });

    it('throws error for out of stock items', async () => {
      await expect(
        OrderService.createOrder('user-id', { items: [{ productId: 'out-of-stock' }] })
      ).rejects.toThrow('Insufficient stock');
    });
  });

  describe('updateOrderStatus', () => {
    it('validates status transitions', async () => {
      const order = { status: 'pending' };

      expect(OrderService.canTransition(order, 'confirmed')).toBe(true);
      expect(OrderService.canTransition(order, 'delivered')).toBe(false);
    });
  });

  describe('calculateTotals', () => {
    it('calculates correct totals', () => {
      const items = [
        { price: 100, quantity: 2 },
        { price: 50, quantity: 1 },
      ];

      const totals = OrderService.calculateTotals(items);

      expect(totals.subtotal).toBe(250);
    });

    it('applies coupon discount', () => {
      const items = [{ price: 100, quantity: 1 }];
      const coupon = { type: 'percentage', value: 10 };

      const totals = OrderService.calculateTotals(items, coupon);

      expect(totals.discount).toBe(10);
      expect(totals.total).toBe(90);
    });
  });
});
```

## 🔗 Integration Testing

```typescript
describe('POST /orders', () => {
  it('creates order successfully', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        items: [{ productId: productId, quantity: 1 }],
        shippingAddress: validAddress,
        paymentMethod: 'stripe',
      });

    expect(res.status).toBe(201);
    expect(res.body.order.orderNumber).toBeDefined();
  });

  it('rejects without authentication', async () => {
    const res = await request(app).post('/api/orders').send({});

    expect(res.status).toBe(401);
  });
});

describe('PUT /orders/:id/status', () => {
  it('updates status with valid transition', async () => {
    const res = await request(app)
      .put(`/api/orders/${orderId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'confirmed' });

    expect(res.status).toBe(200);
    expect(res.body.order.status).toBe('confirmed');
  });
});
```

## 🏃 Running Tests

```bash
yarn test
yarn test:coverage
```

---

See also:

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Service architecture
