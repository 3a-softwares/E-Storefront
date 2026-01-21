# Coupon Service Testing Guide

## 🧪 Unit Testing

```typescript
// tests/unit/couponService.test.ts
describe('CouponService', () => {
  describe('validateCoupon', () => {
    it('validates active coupon', async () => {
      const coupon = await CouponService.validateCoupon('SAVE20', 'user-id', 100, []);

      expect(coupon).toBeDefined();
      expect(coupon.code).toBe('SAVE20');
    });

    it('rejects expired coupon', async () => {
      await expect(CouponService.validateCoupon('EXPIRED', 'user-id', 100, [])).rejects.toThrow(
        'expired'
      );
    });

    it('rejects below minimum purchase', async () => {
      await expect(CouponService.validateCoupon('MIN50', 'user-id', 30, [])).rejects.toThrow(
        'Minimum purchase'
      );
    });

    it('rejects exceeded user limit', async () => {
      await expect(CouponService.validateCoupon('ONEUSE', 'used-user', 100, [])).rejects.toThrow(
        'already used'
      );
    });
  });

  describe('calculateDiscount', () => {
    it('calculates percentage discount', () => {
      const result = CouponService.calculateDiscount({ type: 'percentage', value: 20 }, 100);
      expect(result.amount).toBe(20);
    });

    it('calculates fixed discount', () => {
      const result = CouponService.calculateDiscount({ type: 'fixed', value: 15 }, 100);
      expect(result.amount).toBe(15);
    });

    it('applies max discount cap', () => {
      const result = CouponService.calculateDiscount(
        { type: 'percentage', value: 50, maxDiscount: 25 },
        100
      );
      expect(result.amount).toBe(25);
    });
  });
});
```

## 🔗 Integration Testing

```typescript
describe('POST /coupons/validate', () => {
  it('validates coupon successfully', async () => {
    const res = await request(app)
      .post('/api/coupons/validate')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        code: 'SAVE20',
        cartTotal: 100,
        items: [],
      });

    expect(res.status).toBe(200);
    expect(res.body.coupon.discount).toBe(20);
  });

  it('returns error for invalid code', async () => {
    const res = await request(app)
      .post('/api/coupons/validate')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ code: 'INVALID', cartTotal: 100 });

    expect(res.status).toBe(400);
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
