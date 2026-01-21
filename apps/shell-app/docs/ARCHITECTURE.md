# Shell App Architecture

## 📑 Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Application Structure](#application-structure)
- [State Management](#state-management)
- [Routing](#routing)
- [Component Architecture](#component-architecture)

## 🌐 Overview

Shell App is the main consumer-facing e-commerce storefront, built with React 18 and Webpack Module Federation for micro-frontend architecture.

### Key Responsibilities

| Responsibility  | Description                  |
| --------------- | ---------------------------- |
| Product Display | Browse and search products   |
| Shopping Cart   | Add, update, remove items    |
| User Auth       | Login, registration, profile |
| Checkout        | Order placement flow         |
| Navigation      | Main app shell and routing   |

## 🛠️ Technology Stack

| Category  | Technology       | Version |
| --------- | ---------------- | ------- |
| Framework | React            | 18.2    |
| Language  | TypeScript       | 5.0+    |
| Bundler   | Webpack          | 5.88    |
| Styling   | Tailwind CSS     | 3.0     |
| UI Kit    | DaisyUI          | Latest  |
| State     | Zustand          | 4.x     |
| Routing   | React Router DOM | 6.x     |
| HTTP      | Axios            | 1.x     |

## 🏗️ Application Structure

```
apps/shell-app/
├── src/
│   ├── index.tsx              # Entry point
│   ├── App.tsx                # Root component
│   ├── components/            # Reusable components
│   │   ├── common/            # Shared components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Modal.tsx
│   │   ├── layout/            # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── product/           # Product components
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   └── ProductDetail.tsx
│   │   └── cart/              # Cart components
│   │       ├── CartItem.tsx
│   │       ├── CartSummary.tsx
│   │       └── CartDrawer.tsx
│   ├── pages/                 # Page components
│   │   ├── Home.tsx
│   │   ├── Products.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   └── Profile.tsx
│   ├── store/                 # Zustand stores
│   │   ├── cartStore.ts
│   │   ├── authStore.ts
│   │   └── uiStore.ts
│   ├── hooks/                 # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   └── useProducts.ts
│   ├── services/              # API services
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   └── productService.ts
│   ├── utils/                 # Utilities
│   │   ├── formatters.ts
│   │   └── validators.ts
│   └── types/                 # TypeScript types
│       └── index.ts
├── public/                    # Static assets
├── webpack.config.js          # Webpack configuration
├── tailwind.config.js         # Tailwind configuration
└── package.json
```

## 📦 State Management

### Zustand Stores

```typescript
// store/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => ({
          items: [...state.items, item],
        })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),
      updateQuantity: (id, qty) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
        })),
      clearCart: () => set({ items: [] }),
      get totalItems() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },
      get totalPrice() {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      },
    }),
    { name: 'cart-storage' }
  )
);
```

### Store Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         ZUSTAND STORES                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │    authStore    │  │    cartStore    │  │     uiStore     │ │
│  │                 │  │                 │  │                 │ │
│  │ • user          │  │ • items         │  │ • theme         │ │
│  │ • isAuth        │  │ • totalItems    │  │ • sidebarOpen   │ │
│  │ • login()       │  │ • addItem()     │  │ • modalOpen     │ │
│  │ • logout()      │  │ • removeItem()  │  │ • toggleTheme() │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│           │                   │                     │           │
│           └───────────────────┼─────────────────────┘           │
│                               │                                  │
│                               ▼                                  │
│                    ┌─────────────────────┐                      │
│                    │   localStorage      │                      │
│                    │   (persistence)     │                      │
│                    └─────────────────────┘                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 🧭 Routing

### Route Structure

```typescript
// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

### Route Map

| Path            | Component     | Auth Required |
| --------------- | ------------- | ------------- |
| `/`             | Home          | No            |
| `/products`     | Products      | No            |
| `/products/:id` | ProductDetail | No            |
| `/cart`         | Cart          | No            |
| `/checkout`     | Checkout      | Yes           |
| `/profile`      | Profile       | Yes           |
| `/orders`       | Orders        | Yes           |

## 🧩 Component Architecture

### Component Hierarchy

```
App
├── Layout
│   ├── Header
│   │   ├── Logo
│   │   ├── Navigation
│   │   ├── SearchBar
│   │   └── CartIcon
│   ├── Main (Outlet)
│   │   └── [Page Components]
│   └── Footer
├── Home
│   ├── HeroBanner
│   ├── FeaturedProducts
│   └── CategoryGrid
├── Products
│   ├── FilterSidebar
│   ├── ProductGrid
│   │   └── ProductCard[]
│   └── Pagination
└── Cart
    ├── CartItemList
    │   └── CartItem[]
    └── CartSummary
```

### Component Guidelines

| Principle             | Implementation                      |
| --------------------- | ----------------------------------- |
| Single Responsibility | One component, one purpose          |
| Composition           | Build complex UIs from simple parts |
| Props Down            | Data flows from parent to child     |
| Events Up             | Actions bubble up via callbacks     |

---

See also:

- [TESTING.md](./TESTING.md) - Testing guide
- [../../README.md](../../README.md) - Main docs
