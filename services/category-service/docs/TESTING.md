# Category Service Testing Guide

## 🧪 Unit Testing

```typescript
// tests/unit/categoryService.test.ts
describe('CategoryService', () => {
  describe('buildCategoryTree', () => {
    it('builds correct tree structure', async () => {
      const mockCategories = [
        { _id: '1', name: 'Electronics', parent: null },
        { _id: '2', name: 'Computers', parent: '1' },
        { _id: '3', name: 'Laptops', parent: '2' },
      ];

      (Category.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockCategories),
      });

      const tree = await CategoryService.buildCategoryTree();

      expect(tree).toHaveLength(1);
      expect(tree[0].name).toBe('Electronics');
      expect(tree[0].children[0].name).toBe('Computers');
    });
  });

  describe('getCategoryBreadcrumb', () => {
    it('returns correct breadcrumb', async () => {
      const mockCategory = {
        _id: '3',
        name: 'Laptops',
        slug: 'laptops',
        ancestors: [
          { name: 'Electronics', slug: 'electronics' },
          { name: 'Computers', slug: 'computers' },
        ],
      };

      (Category.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockCategory),
      });

      const breadcrumb = await CategoryService.getCategoryBreadcrumb('3');

      expect(breadcrumb).toHaveLength(3);
      expect(breadcrumb[0].name).toBe('Electronics');
      expect(breadcrumb[2].name).toBe('Laptops');
    });
  });
});
```

## 🔗 Integration Testing

```typescript
describe('GET /categories/tree', () => {
  it('returns category tree', async () => {
    const res = await request(app).get('/api/categories/tree');

    expect(res.status).toBe(200);
    expect(res.body.tree).toBeDefined();
    expect(Array.isArray(res.body.tree)).toBe(true);
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
