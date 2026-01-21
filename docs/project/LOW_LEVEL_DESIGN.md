# Low-Level Design (LLD)

## 📑 Table of Contents

- [Database Schema Design](#database-schema-design)
- [API Contracts](#api-contracts)
- [Service Internals](#service-internals)
- [Component Design](#component-design)
- [State Management](#state-management)
- [Error Handling](#error-handling)

## 🗄️ Database Schema Design

### User Schema (Auth Service)

```javascript
// models/User.js
const UserSchema = new Schema(
  {
    // Identity
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // Never returned in queries
    },

    // Profile
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    avatar: { type: String },
    phone: { type: String },

    // Authentication
    role: {
      type: String,
      enum: ['customer', 'seller', 'admin', 'super_admin'],
      default: 'customer',
    },
    isEmailVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },

    // OAuth
    googleId: { type: String, sparse: true },

    // Security
    refreshTokens: [
      {
        token: String,
        expiresAt: Date,
        device: String,
      },
    ],
    passwordResetToken: String,
    passwordResetExpires: Date,

    // Timestamps
    lastLogin: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ googleId: 1 });
UserSchema.index({ role: 1 });
```

### Product Schema (Product Service)

```javascript
// models/Product.js
const ProductSchema = new Schema(
  {
    // Basic Info
    name: { type: String, required: true, index: 'text' },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true, index: 'text' },
    shortDescription: { type: String },

    // Pricing
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    costPrice: { type: Number, min: 0 },

    // Inventory
    sku: { type: String, required: true, unique: true },
    barcode: { type: String },
    quantity: { type: Number, default: 0, min: 0 },
    trackInventory: { type: Boolean, default: true },
    allowBackorder: { type: Boolean, default: false },

    // Categorization
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
    },
    tags: [{ type: String }],

    // Media
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String },
        isPrimary: { type: Boolean, default: false },
      },
    ],

    // Variants
    variants: [
      {
        name: String,
        sku: String,
        price: Number,
        quantity: Number,
        attributes: Map,
      },
    ],

    // SEO
    seo: {
      title: String,
      description: String,
      keywords: [String],
    },

    // Status
    status: {
      type: String,
      enum: ['draft', 'active', 'archived'],
      default: 'draft',
    },
    isVisible: { type: Boolean, default: true },

    // Seller
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // Analytics
    views: { type: Number, default: 0 },
    sales: { type: Number, default: 0 },
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Compound Indexes
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1, status: 1 });
ProductSchema.index({ seller: 1, status: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ createdAt: -1 });
```

### Order Schema (Order Service)

```javascript
// models/Order.js
const OrderSchema = new Schema(
  {
    // Order ID
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // Customer
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // Items
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        sku: String,
        price: Number,
        quantity: Number,
        variant: String,
        subtotal: Number,
      },
    ],

    // Pricing
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },

    // Coupon
    coupon: {
      code: String,
      discount: Number,
      type: String,
    },

    // Addresses
    shippingAddress: {
      fullName: String,
      address1: String,
      address2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
      phone: String,
    },
    billingAddress: {
      fullName: String,
      address1: String,
      address2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },

    // Payment
    payment: {
      method: String,
      status: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending',
      },
      transactionId: String,
      paidAt: Date,
    },

    // Shipping
    shipping: {
      method: String,
      carrier: String,
      trackingNumber: String,
      estimatedDelivery: Date,
      shippedAt: Date,
      deliveredAt: Date,
    },

    // Status
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
      default: 'pending',
    },

    // Notes
    customerNotes: String,
    internalNotes: String,

    // History
    statusHistory: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
        note: String,
        updatedBy: Schema.Types.ObjectId,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
OrderSchema.index({ customer: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ 'payment.status': 1 });
OrderSchema.index({ orderNumber: 1 });
```

### Category Schema (Category Service)

```javascript
// models/Category.js
const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },

    // Hierarchy
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
      index: true,
    },
    ancestors: [
      {
        _id: Schema.Types.ObjectId,
        name: String,
        slug: String,
      },
    ],
    level: { type: Number, default: 0 },

    // Media
    image: { type: String },
    icon: { type: String },

    // Display
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },

    // SEO
    seo: {
      title: String,
      description: String,
      keywords: [String],
    },

    // Stats
    productCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Indexes
CategorySchema.index({ parent: 1 });
CategorySchema.index({ slug: 1 });
CategorySchema.index({ isActive: 1, order: 1 });
```

## 📋 API Contracts

### GraphQL Schema

```graphql
# User Types
type User {
  id: ID!
  email: String!
  firstName: String!
  lastName: String!
  fullName: String!
  avatar: String
  role: UserRole!
  isEmailVerified: Boolean!
  createdAt: DateTime!
}

enum UserRole {
  CUSTOMER
  SELLER
  ADMIN
  SUPER_ADMIN
}

# Product Types
type Product {
  id: ID!
  name: String!
  slug: String!
  description: String!
  price: Float!
  compareAtPrice: Float
  images: [ProductImage!]!
  category: Category!
  seller: User!
  quantity: Int!
  status: ProductStatus!
  rating: Rating!
  createdAt: DateTime!
}

type ProductImage {
  url: String!
  alt: String
  isPrimary: Boolean!
}

enum ProductStatus {
  DRAFT
  ACTIVE
  ARCHIVED
}

type Rating {
  average: Float!
  count: Int!
}

# Order Types
type Order {
  id: ID!
  orderNumber: String!
  customer: User!
  items: [OrderItem!]!
  subtotal: Float!
  discount: Float!
  shipping: Float!
  tax: Float!
  total: Float!
  status: OrderStatus!
  payment: PaymentInfo!
  shippingAddress: Address!
  createdAt: DateTime!
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}

# Queries
type Query {
  # Auth
  me: User

  # Products
  products(
    filter: ProductFilterInput
    pagination: PaginationInput
    sort: ProductSortInput
  ): ProductConnection!
  product(id: ID, slug: String): Product

  # Categories
  categories(parentId: ID): [Category!]!
  category(id: ID, slug: String): Category

  # Orders
  orders(filter: OrderFilterInput, pagination: PaginationInput): OrderConnection!
  order(id: ID!): Order
}

# Mutations
type Mutation {
  # Auth
  register(input: RegisterInput!): AuthPayload!
  login(input: LoginInput!): AuthPayload!
  logout: Boolean!
  refreshToken: AuthPayload!

  # Products
  createProduct(input: CreateProductInput!): Product!
  updateProduct(id: ID!, input: UpdateProductInput!): Product!
  deleteProduct(id: ID!): Boolean!

  # Orders
  createOrder(input: CreateOrderInput!): Order!
  updateOrderStatus(id: ID!, status: OrderStatus!): Order!

  # Cart
  addToCart(productId: ID!, quantity: Int!): Cart!
  updateCartItem(productId: ID!, quantity: Int!): Cart!
  removeFromCart(productId: ID!): Cart!
}

# Subscriptions
type Subscription {
  orderStatusChanged(orderId: ID!): Order!
}
```

### Input Types

```graphql
input RegisterInput {
  email: String!
  password: String!
  firstName: String!
  lastName: String!
}

input LoginInput {
  email: String!
  password: String!
}

input CreateProductInput {
  name: String!
  description: String!
  price: Float!
  compareAtPrice: Float
  sku: String!
  quantity: Int!
  categoryId: ID!
  images: [ProductImageInput!]!
  tags: [String!]
}

input ProductFilterInput {
  search: String
  categoryId: ID
  minPrice: Float
  maxPrice: Float
  status: ProductStatus
  sellerId: ID
}

input PaginationInput {
  page: Int = 1
  limit: Int = 20
}

input ProductSortInput {
  field: ProductSortField!
  order: SortOrder!
}

enum ProductSortField {
  CREATED_AT
  PRICE
  NAME
  RATING
  SALES
}

enum SortOrder {
  ASC
  DESC
}
```

## ⚙️ Service Internals

### Auth Service Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Auth Service                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                 │
│  │  Controller │───▶│   Service   │───▶│ Repository  │                 │
│  └─────────────┘    └──────┬──────┘    └──────┬──────┘                 │
│                            │                  │                         │
│                            ▼                  ▼                         │
│                    ┌─────────────┐    ┌─────────────┐                  │
│                    │    JWT      │    │   MongoDB   │                  │
│                    │   Utils     │    │             │                  │
│                    └─────────────┘    └─────────────┘                  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

Login Flow:
1. Controller receives credentials
2. Service validates input
3. Repository fetches user by email
4. Service verifies password (bcrypt)
5. JWT Utils generates access + refresh tokens
6. Service stores refresh token in DB
7. Controller returns tokens
```

### Product Service Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       Product Service                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Create Product Flow:                                                    │
│                                                                          │
│  Request ──▶ Validate ──▶ Authorize ──▶ Process ──▶ Save ──▶ Response  │
│                 │            │             │          │                  │
│                 ▼            ▼             ▼          ▼                  │
│             ┌──────┐    ┌──────┐     ┌─────────┐ ┌─────────┐           │
│             │ Joi  │    │ RBAC │     │ Slugify │ │ MongoDB │           │
│             │ Schema│    │Check │     │ Images  │ │         │           │
│             └──────┘    └──────┘     └─────────┘ └─────────┘           │
│                                                                          │
│  Search Flow:                                                            │
│                                                                          │
│  Query ──▶ Parse ──▶ Cache Check ──▶ DB Query ──▶ Cache Set ──▶ Return │
│                          │              │             │                  │
│                          ▼              ▼             ▼                  │
│                      ┌──────┐      ┌─────────┐   ┌─────────┐           │
│                      │Redis │      │MongoDB  │   │ Redis   │           │
│                      │ GET  │      │ Agg/Find│   │ SETEX   │           │
│                      └──────┘      └─────────┘   └─────────┘           │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## 🎨 Component Design

### React Component Structure

```typescript
// components/ProductCard/ProductCard.tsx

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact' | 'featured';
  showQuickAdd?: boolean;
  onAddToCart?: (productId: string) => void;
  onAddToWishlist?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  variant = 'default',
  showQuickAdd = true,
  onAddToCart,
  onAddToWishlist
}) => {
  // Hooks
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useCart();

  // Memoized values
  const discountPercentage = useMemo(() => {
    if (!product.compareAtPrice) return 0;
    return Math.round(
      ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
    );
  }, [product.price, product.compareAtPrice]);

  // Callbacks
  const handleAddToCart = useCallback(async () => {
    setIsLoading(true);
    try {
      await addToCart(product.id, 1);
      onAddToCart?.(product.id);
    } finally {
      setIsLoading(false);
    }
  }, [product.id, addToCart, onAddToCart]);

  // Render
  return (
    <article className={`product-card product-card--${variant}`}>
      <ProductImage
        src={product.images[0]?.url}
        alt={product.name}
      />
      {discountPercentage > 0 && (
        <Badge variant="sale">-{discountPercentage}%</Badge>
      )}
      <ProductInfo product={product} />
      {showQuickAdd && (
        <Button
          onClick={handleAddToCart}
          loading={isLoading}
        >
          Add to Cart
        </Button>
      )}
    </article>
  );
};
```

## 📦 State Management

### Zustand Store Design

```typescript
// store/cartStore.ts

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;

  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;

  // Computed
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isLoading: false,

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.productId !== productId)
              : state.items.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
        })),

      clearCart: () => set({ items: [] }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
```

## ⚠️ Error Handling

### Backend Error Handling

```typescript
// utils/errors.ts

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Permission denied') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

// Error Handler Middleware
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }

  // Log unexpected errors
  console.error('Unexpected error:', err);

  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
  });
};
```

### Frontend Error Handling

```typescript
// lib/errorHandler.ts

export const handleApiError = (error: unknown): string => {
  if (error instanceof ApolloError) {
    const graphQLError = error.graphQLErrors[0];
    if (graphQLError) {
      return graphQLError.message;
    }
    if (error.networkError) {
      return 'Network error. Please check your connection.';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
};

// React Query Error Boundary
export const queryErrorHandler = (error: unknown) => {
  const message = handleApiError(error);
  toast.error(message);
};
```

---

See also:

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture overview
- [API.md](./API.md) - Full API documentation
- [TESTING.md](./TESTING.md) - Testing strategies
