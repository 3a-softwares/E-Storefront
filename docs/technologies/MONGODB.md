# MongoDB

**Version:** 8.0 (Mongoose 8.0) | **Category:** Database

---

## Connection Setup

```typescript
// config/database.ts
import mongoose from 'mongoose';

export const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGODB_URI!, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
  console.log(`MongoDB Connected: ${conn.connection.host}`);

  mongoose.connection.on('error', (err) => console.error('MongoDB error:', err));
  mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'));
};
```

---

## Schema Definition

```typescript
// models/Product.ts
import mongoose, { Schema, Document } from 'mongoose';

interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  category: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
  images: string[];
  stock: number;
  sku: string;
  variants?: { name: string; sku: string; price: number; stock: number; attributes: Map<string, string> }[];
  attributes: Map<string, string>;
  rating: number;
  reviewCount: number;
  status: 'active' | 'draft' | 'archived';
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String, maxlength: 5000 },
    price: { type: Number, required: true, min: 0 },
    comparePrice: { type: Number, min: 0 },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    images: [String],
    stock: { type: Number, default: 0, min: 0 },
    sku: { type: String, unique: true, sparse: true },
    variants: [{ name: String, sku: String, price: Number, stock: Number, attributes: { type: Map, of: String } }],
    attributes: { type: Map, of: String },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'draft', 'archived'], default: 'draft' },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

// Indexes
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ seller: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

// Auto-generate slug
productSchema.pre('save', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

// Virtual for discount
productSchema.virtual('discountPercent').get(function () {
  return this.comparePrice && this.comparePrice > this.price
    ? Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100)
    : 0;
});

export const Product = mongoose.model<IProduct>('Product', productSchema);
```

---

## CRUD Operations

```typescript
// services/productService.ts
export const getProducts = async (options: QueryOptions) => {
  const { page = 1, limit = 10, category, search, sort = '-createdAt' } = options;
  const query: any = { status: 'active' };

  if (category) query.category = category;
  if (search) query.$text = { $search: search };

  const [products, total] = await Promise.all([
    Product.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('category', 'name slug')
      .populate('seller', 'name'),
    Product.countDocuments(query),
  ]);

  return { products, page, totalPages: Math.ceil(total / limit), total };
};

export const updateProduct = async (id: string, data: UpdateProductDTO) => {
  return Product.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
};

export const deleteProduct = async (id: string) => {
  return Product.findByIdAndUpdate(id, { status: 'archived' }, { new: true });
};
```

---

## Aggregation Examples

```typescript
// Sales report
export const getSalesReport = async (startDate: Date, endDate: Date) => {
  return Order.aggregate([
    { $match: { createdAt: { $gte: startDate, $lte: endDate }, status: 'completed' } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' }, day: { $dayOfMonth: '$createdAt' } },
        totalSales: { $sum: '$total' },
        orderCount: { $sum: 1 },
        avgOrderValue: { $avg: '$total' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
  ]);
};

// Product analytics by category
export const getProductAnalytics = async (sellerId: string) => {
  return Product.aggregate([
    { $match: { seller: new mongoose.Types.ObjectId(sellerId) } },
    {
      $group: {
        _id: '$category',
        totalProducts: { $sum: 1 },
        avgPrice: { $avg: '$price' },
        totalStock: { $sum: '$stock' },
      },
    },
    { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
    { $project: { category: { $arrayElemAt: ['$category.name', 0] }, totalProducts: 1, avgPrice: { $round: ['$avgPrice', 2] }, totalStock: 1 } },
  ]);
};
```

---

## Schema Patterns

### Order with Embedded Items
```typescript
const orderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    name: String, price: Number, quantity: Number, image: String,
  }],
  shippingAddress: { street: String, city: String, state: String, zipCode: String, country: String },
  subtotal: Number, shipping: Number, tax: Number, total: Number,
  status: { type: String, enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] },
  timeline: [{ status: String, timestamp: Date, note: String }],
});
```

### Hierarchical Categories
```typescript
const categorySchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true },
  parent: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
  ancestors: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  level: { type: Number, default: 0 },
});
```

### Reviews with Rating Update
```typescript
const reviewSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
});

reviewSchema.post('save', async function () {
  const stats = await this.constructor.aggregate([
    { $match: { product: this.product } },
    { $group: { _id: '$product', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  if (stats.length > 0) {
    await Product.findByIdAndUpdate(this.product, { rating: stats[0].avgRating, reviewCount: stats[0].count });
  }
});
```

---

## Best Practices

### Indexing
```typescript
productSchema.index({ category: 1, status: 1 }); // Compound for common queries
productSchema.index({ name: 'text', description: 'text' }); // Full-text search
productSchema.index({ seller: 1, status: 1 }); // Seller dashboard
```

### Validation
```typescript
price: {
  type: Number,
  required: [true, 'Price is required'],
  min: [0, 'Price cannot be negative'],
  validate: { validator: (v) => v <= 100000, message: 'Price cannot exceed 100,000' },
}
```

---

## Related Documentation

- [Express](./EXPRESS.md) - Web framework integration
- [Redis](./REDIS.md) - Caching layer
- [GraphQL](./GRAPHQL.md) - API layer
