# Category Service Architecture

## 📑 Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Service Structure](#service-structure)
- [Database Schema](#database-schema)
- [Category Tree](#category-tree)

## 🌐 Overview

Category Service manages the hierarchical category structure for products.

### Key Responsibilities

| Responsibility | Description                  |
| -------------- | ---------------------------- |
| Category CRUD  | Create, read, update, delete |
| Hierarchy      | Parent-child relationships   |
| Navigation     | Category tree for menus      |
| Slugs          | SEO-friendly URLs            |

## 🛠️ Technology Stack

| Category  | Technology | Version  |
| --------- | ---------- | -------- |
| Runtime   | Node.js    | 20.x LTS |
| Framework | Express.js | 4.x      |
| Language  | TypeScript | 5.0+     |
| Database  | MongoDB    | 7.0      |
| ODM       | Mongoose   | 8.x      |
| Cache     | Redis      | 7.x      |

## 🏗️ Service Structure

```
services/category-service/
├── src/
│   ├── index.ts
│   ├── app.ts
│   ├── config/
│   ├── controllers/
│   │   └── categoryController.ts
│   ├── models/
│   │   └── Category.ts
│   ├── routes/
│   │   └── categoryRoutes.ts
│   ├── services/
│   │   └── categoryService.ts
│   └── utils/
├── tests/
└── package.json
```

## 💾 Database Schema

### Category Model

```typescript
// models/Category.ts
const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    description: String,
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    ancestors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
    image: String,
    icon: String,
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    productCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
CategorySchema.index({ parent: 1 });
CategorySchema.index({ slug: 1 }, { unique: true });
CategorySchema.index({ ancestors: 1 });
```

## 🌳 Category Tree

### Tree Structure

```
Electronics
├── Computers
│   ├── Laptops
│   ├── Desktops
│   └── Accessories
├── Phones
│   ├── Smartphones
│   └── Feature Phones
└── Audio
    ├── Headphones
    └── Speakers
Clothing
├── Men
│   ├── Shirts
│   └── Pants
└── Women
    ├── Dresses
    └── Tops
```

### Tree Building Algorithm

```typescript
// services/categoryService.ts
export async function buildCategoryTree() {
  const categories = await Category.find({ isActive: true }).sort({ order: 1 }).lean();

  const categoryMap = new Map();
  const tree: CategoryNode[] = [];

  // First pass: create map
  categories.forEach((cat) => {
    categoryMap.set(cat._id.toString(), {
      ...cat,
      children: [],
    });
  });

  // Second pass: build tree
  categories.forEach((cat) => {
    const node = categoryMap.get(cat._id.toString());
    if (cat.parent) {
      const parent = categoryMap.get(cat.parent.toString());
      if (parent) {
        parent.children.push(node);
      }
    } else {
      tree.push(node);
    }
  });

  return tree;
}
```

### Breadcrumb Generation

```typescript
export async function getCategoryBreadcrumb(categoryId: string) {
  const category = await Category.findById(categoryId).populate('ancestors', 'name slug').lean();

  if (!category) return [];

  const breadcrumb = [
    ...category.ancestors.map((a) => ({
      name: a.name,
      slug: a.slug,
    })),
    {
      name: category.name,
      slug: category.slug,
    },
  ];

  return breadcrumb;
}
```

---

See also:

- [API.md](./API.md) - API endpoints
- [TESTING.md](./TESTING.md) - Testing guide
