# Product Service Architecture

## 📑 Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Service Structure](#service-structure)
- [Database Schema](#database-schema)
- [Search & Filtering](#search--filtering)

## 🌐 Overview

Product Service manages all product-related operations including CRUD, search, filtering, and inventory.

### Key Responsibilities

| Responsibility | Description                           |
| -------------- | ------------------------------------- |
| Product CRUD   | Create, read, update, delete products |
| Search         | Full-text and filtered search         |
| Variants       | Product variants (size, color)        |
| Inventory      | Stock management                      |
| Reviews        | Product reviews and ratings           |
| Media          | Image management via Cloudinary       |

## 🛠️ Technology Stack

| Category   | Technology           | Version  |
| ---------- | -------------------- | -------- |
| Runtime    | Node.js              | 20.x LTS |
| Framework  | Express.js           | 4.x      |
| Language   | TypeScript           | 5.0+     |
| Database   | MongoDB              | 7.0      |
| ODM        | Mongoose             | 8.x      |
| Search     | MongoDB Atlas Search | -        |
| Media      | Cloudinary           | Latest   |
| Cache      | Redis                | 7.x      |
| Validation | Zod                  | 3.x      |

## 🏗️ Service Structure

```
services/product-service/
├── src/
│   ├── index.ts              # Entry point
│   ├── app.ts                # Express app
│   ├── config/               # Configuration
│   │   ├── db.ts
│   │   ├── redis.ts
│   │   └── cloudinary.ts
│   ├── controllers/          # Route handlers
│   │   ├── productController.ts
│   │   ├── reviewController.ts
│   │   └── inventoryController.ts
│   ├── models/               # Mongoose models
│   │   ├── Product.ts
│   │   ├── Review.ts
│   │   └── Inventory.ts
│   ├── routes/               # API routes
│   │   ├── productRoutes.ts
│   │   └── reviewRoutes.ts
│   ├── middleware/           # Express middleware
│   │   ├── auth.ts
│   │   ├── upload.ts
│   │   └── cache.ts
│   ├── services/             # Business logic
│   │   ├── productService.ts
│   │   ├── searchService.ts
│   │   └── cacheService.ts
│   └── utils/                # Utilities
├── tests/
└── package.json
```

## 💾 Database Schema

### Product Model

```typescript
// models/Product.ts
const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: 'text',
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    comparePrice: {
      type: Number,
      min: 0,
    },
    sku: {
      type: String,
      unique: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    images: [
      {
        url: String,
        publicId: String,
        alt: String,
      },
    ],
    variants: [
      {
        name: String,
        options: [String],
        price: Number,
        sku: String,
        quantity: Number,
      },
    ],
    attributes: {
      type: Map,
      of: String,
    },
    quantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'archived'],
      default: 'draft',
    },
    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    tags: [String],
    featured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Indexes
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1, status: 1 });
ProductSchema.index({ seller: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ 'ratings.average': -1 });
```

### Review Model

```typescript
// models/Review.ts
const ReviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: String,
    comment: String,
    images: [String],
    verified: { type: Boolean, default: false },
    helpful: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// One review per user per product
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });
```

## 🔍 Search & Filtering

### Search Implementation

```typescript
// services/searchService.ts
export async function searchProducts(query: SearchQuery) {
  const { q, category, minPrice, maxPrice, rating, sort, page = 1, limit = 20 } = query;

  const filter: any = { status: 'active' };

  // Text search
  if (q) {
    filter.$text = { $search: q };
  }

  // Category filter
  if (category) {
    filter.category = category;
  }

  // Price range
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = minPrice;
    if (maxPrice) filter.price.$lte = maxPrice;
  }

  // Rating filter
  if (rating) {
    filter['ratings.average'] = { $gte: rating };
  }

  // Sort options
  const sortOptions: Record<string, any> = {
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    rating: { 'ratings.average': -1 },
    newest: { createdAt: -1 },
    popular: { 'ratings.count': -1 },
  };

  const products = await Product.find(filter)
    .sort(sortOptions[sort] || { createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('category', 'name slug')
    .lean();

  const total = await Product.countDocuments(filter);

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}
```

### Cache Strategy

| Data           | TTL    | Invalidation          |
| -------------- | ------ | --------------------- |
| Product Detail | 5 min  | On update             |
| Product List   | 2 min  | On any product change |
| Categories     | 1 hour | On category change    |
| Search Results | 1 min  | Time-based            |

---

See also:

- [API.md](./API.md) - API endpoints
- [TESTING.md](./TESTING.md) - Testing guide
