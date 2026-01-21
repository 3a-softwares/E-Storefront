# React

## Overview

**Version:** 18.2  
**Website:** [https://react.dev](https://react.dev)  
**Category:** UI Library

React is a JavaScript library for building user interfaces. It lets you compose complex UIs from small, isolated pieces of code called "components."

---

## Why React?

### Benefits

| Benefit                      | Description                                       |
| ---------------------------- | ------------------------------------------------- |
| **Component-Based**          | Build encapsulated components that manage state   |
| **Declarative**              | Design simple views for each state                |
| **Virtual DOM**              | Efficient updates and rendering                   |
| **Rich Ecosystem**           | Huge library of packages and tools                |
| **Large Community**          | Extensive documentation and support               |
| **Learn Once, Use Anywhere** | Use React for web, mobile (React Native), desktop |

### Why We Chose React

1. **Industry Standard** - Most popular frontend library with proven track record
2. **Component Reusability** - Share components across shell, admin, and seller apps
3. **TypeScript Support** - Excellent TypeScript integration for type safety
4. **Module Federation** - Works seamlessly with Webpack Module Federation
5. **Team Expertise** - Strong community knowledge and hiring pool
6. **Ecosystem** - Rich selection of state management, routing, and UI libraries

---

## How to Use React

### Functional Components

```tsx
// Basic component with props
interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  onAddToCart: (id: string) => void;
}

export function ProductCard({ id, name, price, image, onAddToCart }: ProductCardProps) {
  return (
    <div className="product-card">
      <img src={image} alt={name} />
      <h3>{name}</h3>
      <p className="price">${price.toFixed(2)}</p>
      <button onClick={() => onAddToCart(id)}>Add to Cart</button>
    </div>
  );
}
```

### useState Hook

```tsx
import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState<string[]>([]);

  const increment = () => setCount((prev) => prev + 1);
  const addItem = (item: string) => setItems((prev) => [...prev, item]);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```

### useEffect Hook

```tsx
import { useState, useEffect } from 'react';

export function ProductList({ categoryId }: { categoryId: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products?category=${categoryId}`);
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]); // Re-fetch when categoryId changes

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
}
```

### Custom Hooks

```tsx
// hooks/useProducts.ts
import { useState, useEffect } from 'react';

interface UseProductsOptions {
  category?: string;
  limit?: number;
}

export function useProducts({ category, limit = 10 }: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({ limit: String(limit) });
        if (category) params.append('category', category);

        const response = await fetch(`/api/products?${params}`, {
          signal: controller.signal,
        });
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, [category, limit]);

  return { products, loading, error };
}

// Usage
function ProductPage() {
  const { products, loading, error } = useProducts({ category: 'electronics' });
  // ...
}
```

### Context API

```tsx
// context/CartContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
```

---

## How React Helps Our Project

### 1. Shared Component Library

```tsx
// packages/ui-library/src/Button.tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({
  variant,
  size = 'md',
  loading,
  disabled,
  children,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
}

// Used in shell-app, admin-app, and seller-app
import { Button } from '@3asoftwares/ui-library';
```

### 2. Module Federation Integration

```tsx
// shell-app loads remote components from admin/seller apps
// webpack.config.js
new ModuleFederationPlugin({
  name: 'shell',
  remotes: {
    admin: 'admin@http://localhost:3001/remoteEntry.js',
    seller: 'seller@http://localhost:3002/remoteEntry.js',
  },
  shared: {
    react: { singleton: true, requiredVersion: '^18.2.0' },
    'react-dom': { singleton: true, requiredVersion: '^18.2.0' },
  },
});

// Lazy load remote component
const AdminDashboard = React.lazy(() => import('admin/Dashboard'));
```

### 3. E-commerce UI Patterns

```tsx
// Product grid with responsive layout
export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={handleAddToCart}
          onWishlist={handleWishlist}
        />
      ))}
    </div>
  );
}

// Shopping cart with quantity controls
export function CartItem({ item, onUpdate, onRemove }: CartItemProps) {
  return (
    <div className="cart-item flex items-center gap-4">
      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover" />
      <div className="flex-1">
        <h4>{item.name}</h4>
        <p>${item.price}</p>
      </div>
      <QuantitySelector
        value={item.quantity}
        onChange={(qty) => onUpdate(item.id, qty)}
        min={1}
        max={item.stock}
      />
      <button onClick={() => onRemove(item.id)}>Remove</button>
    </div>
  );
}
```

### 4. Role-Based Components

```tsx
// Admin-only component wrapper
interface AdminOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AdminOnly({ children, fallback = null }: AdminOnlyProps) {
  const { user } = useAuth();

  if (user?.role !== 'admin') {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Usage
<AdminOnly fallback={<AccessDenied />}>
  <ProductManagement />
</AdminOnly>;
```

---

## Project-Specific Usage

### Shell App (Consumer)

| Pattern             | Usage                        |
| ------------------- | ---------------------------- |
| Product Catalog     | Browse and search products   |
| Shopping Cart       | Cart management with Zustand |
| User Authentication | Login/register flows         |
| Checkout Flow       | Multi-step checkout process  |

### Admin App

| Pattern     | Usage                           |
| ----------- | ------------------------------- |
| Dashboard   | Analytics and metrics display   |
| Data Tables | Product/order/user management   |
| Forms       | CRUD operations with validation |
| Modals      | Confirmation and edit dialogs   |

### Seller App

| Pattern            | Usage                     |
| ------------------ | ------------------------- |
| Product Management | Add/edit/delete products  |
| Order Processing   | View and manage orders    |
| Analytics          | Sales and revenue reports |
| Inventory          | Stock management          |

---

## Best Practices

### Component Organization

```
src/
├── components/
│   ├── common/          # Shared components (Button, Input, Modal)
│   ├── layout/          # Layout components (Header, Footer, Sidebar)
│   ├── product/         # Product-related components
│   ├── cart/            # Cart components
│   └── order/           # Order components
├── hooks/               # Custom hooks
├── context/             # Context providers
├── pages/               # Page components
└── utils/               # Utility functions
```

### Performance Optimization

```tsx
// Memoize expensive components
import { memo, useMemo, useCallback } from 'react';

const ProductCard = memo(function ProductCard({ product, onAddToCart }: Props) {
  // Only re-renders when props change
  return <div>...</div>;
});

// Memoize expensive calculations
function ProductList({ products, filter }: Props) {
  const filteredProducts = useMemo(
    () => products.filter((p) => p.category === filter),
    [products, filter]
  );

  // Memoize callbacks
  const handleAddToCart = useCallback(
    (id: string) => {
      addToCart(id);
    },
    [addToCart]
  );

  return filteredProducts.map((p) => (
    <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} />
  ));
}
```

---

## Related Documentation

- [TypeScript](./TYPESCRIPT.md) - Type safety with React
- [Redux Toolkit](./REDUX_TOOLKIT.md) - State management for admin/seller
- [Zustand](./ZUSTAND.md) - State management for shell app
- [Webpack](./WEBPACK.md) - Build tool and Module Federation
- [Vite](./VITE.md) - Build tool for admin/seller apps
