# TypeScript

## Overview

**Version:** 5.x  
**Website:** [https://www.typescriptlang.org](https://www.typescriptlang.org)  
**Category:** Programming Language

TypeScript is a strongly typed superset of JavaScript that compiles to plain JavaScript. It adds optional static typing and class-based object-oriented programming.

---

## Why TypeScript?

### Benefits

| Benefit                    | Description                                |
| -------------------------- | ------------------------------------------ |
| **Type Safety**            | Catch errors at compile time, not runtime  |
| **Better IDE Support**     | IntelliSense, auto-completion, refactoring |
| **Self-Documenting**       | Types serve as inline documentation        |
| **Refactoring Confidence** | Safe large-scale code changes              |
| **Team Scalability**       | Easier onboarding and code sharing         |
| **Early Bug Detection**    | Find bugs before they reach production     |

### Why We Chose TypeScript

1. **Complex Domain** - E-commerce has complex data models (products, orders, users)
2. **Team Collaboration** - Multiple developers working on the same codebase
3. **API Contracts** - Type-safe integration with GraphQL backend
4. **Maintainability** - Long-term project requires maintainable code
5. **React Integration** - Excellent TypeScript support in React ecosystem

---

## How to Use TypeScript

### Basic Types

```typescript
// Primitive types
const productName: string = 'Laptop';
const price: number = 999.99;
const inStock: boolean = true;
const tags: string[] = ['electronics', 'computers'];

// Object type
const product: {
  id: string;
  name: string;
  price: number;
} = {
  id: '1',
  name: 'Laptop',
  price: 999.99,
};
```

### Interfaces

```typescript
// Define reusable object shapes
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: Category;
  stock: number;
  rating?: number; // Optional property
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

// Using the interface
function displayProduct(product: Product): void {
  console.log(`${product.name} - $${product.price}`);
}
```

### Type Aliases

```typescript
// Simple type alias
type ProductId = string;

// Union type
type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

// Intersection type
type ProductWithReviews = Product & {
  reviews: Review[];
  averageRating: number;
};

// Generic type
type ApiResponse<T> = {
  data: T;
  error: string | null;
  loading: boolean;
};
```

### Functions

```typescript
// Function with types
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// Arrow function with generics
const findById = <T extends { id: string }>(items: T[], id: string): T | undefined => {
  return items.find((item) => item.id === id);
};

// Optional and default parameters
function formatPrice(amount: number, currency: string = 'USD', locale?: string): string {
  return new Intl.NumberFormat(locale || 'en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}
```

### React Components

```typescript
// Component props interface
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  showWishlist?: boolean;
}

// Functional component with props
export function ProductCard({
  product,
  onAddToCart,
  showWishlist = true,
}: ProductCardProps) {
  return (
    <div>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={() => onAddToCart(product)}>Add to Cart</button>
    </div>
  );
}

// With React.FC (alternative)
const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  // ...
};
```

### Hooks with Types

```typescript
// useState with type
const [products, setProducts] = useState<Product[]>([]);
const [selectedId, setSelectedId] = useState<string | null>(null);

// useReducer with types
type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_CART' };

interface CartState {
  items: CartItem[];
  total: number;
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.id !== action.payload) };
    case 'CLEAR_CART':
      return { items: [], total: 0 };
  }
}
```

### Generics

```typescript
// Generic function
function getFirstItem<T>(items: T[]): T | undefined {
  return items[0];
}

// Generic interface
interface PaginatedResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
  total: number;
}

// Usage
const productResponse: PaginatedResponse<Product> = {
  data: products,
  page: 1,
  totalPages: 10,
  total: 100,
};
```

---

## How TypeScript Helps Our Project

### 1. Type-Safe API Integration

```typescript
// lib/apollo/queries/queries.ts
interface ProductsQueryVariables {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}

interface ProductsQueryResult {
  products: {
    products: Product[];
    total: number;
    page: number;
    totalPages: number;
  };
}

// Type-safe query usage
const { data } = useQuery<ProductsQueryResult, ProductsQueryVariables>(GET_PRODUCTS_QUERY, {
  variables: {
    page: 1,
    limit: 12,
    category: 'electronics',
  },
});

// data.products is fully typed!
```

### 2. Store Type Safety

```typescript
// store/cartStore.ts
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()((set, get) => ({
  items: [],
  addItem: (item) =>
    set((state) => ({
      items: [...state.items, item],
    })),
  // ... fully typed methods
}));
```

### 3. Component Prop Validation

```typescript
// components/ProductCard.tsx
interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact' | 'featured';
  onAddToCart?: (product: Product) => void;
  onWishlistToggle?: (productId: string) => void;
  showRating?: boolean;
  className?: string;
}

// TypeScript ensures correct usage:
// ✅ <ProductCard product={product} />
// ❌ <ProductCard product="invalid" /> // Type error!
// ❌ <ProductCard product={product} variant="unknown" /> // Type error!
```

### 4. Safer Refactoring

```typescript
// When you rename a property, TypeScript finds all usages:
interface Product {
  id: string;
  name: string; // ← Rename to 'title'
  price: number;
}

// TypeScript will show errors everywhere 'name' is used
// Making refactoring safe and complete
```

---

## Configuration

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Key Configuration Options

| Option   | Value      | Purpose                       |
| -------- | ---------- | ----------------------------- |
| `strict` | `true`     | Enable all strict type checks |
| `noEmit` | `true`     | Next.js handles compilation   |
| `paths`  | `@/*`      | Path aliases for imports      |
| `jsx`    | `preserve` | Let Next.js handle JSX        |

---

## Best Practices

### 1. Prefer Interfaces for Objects

```typescript
// ✅ Good - extensible
interface User {
  id: string;
  name: string;
}

interface Admin extends User {
  role: 'admin';
  permissions: string[];
}

// ❌ Less preferred for object shapes
type User = {
  id: string;
  name: string;
};
```

### 2. Use Type for Unions

```typescript
// ✅ Good for unions
type Status = 'pending' | 'active' | 'completed';
type Id = string | number;
```

### 3. Avoid `any`

```typescript
// ❌ Bad - defeats TypeScript's purpose
function process(data: any) {
  return data.something;
}

// ✅ Good - use unknown and type guards
function process(data: unknown) {
  if (typeof data === 'object' && data !== null && 'something' in data) {
    return (data as { something: string }).something;
  }
  throw new Error('Invalid data');
}
```

### 4. Use Strict Null Checks

```typescript
// With strict mode, null must be handled
function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

const product = getProduct('123');
// product might be undefined, must check!
if (product) {
  console.log(product.name); // Safe
}
```

### 5. Export Types from Components

```typescript
// Export props type for reuse
export interface ButtonProps {
  variant: 'primary' | 'secondary';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({ variant, size, children, onClick }: ButtonProps) {
  // ...
}
```

---

## Common Commands

| Command              | Description                  |
| -------------------- | ---------------------------- |
| `npm run type-check` | Check types without building |
| `npx tsc --noEmit`   | Manual type check            |
| `npx tsc --init`     | Initialize tsconfig.json     |

---

## Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
