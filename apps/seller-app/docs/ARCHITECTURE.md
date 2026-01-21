# Seller App Architecture

## 📑 Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Application Structure](#application-structure)
- [State Management](#state-management)
- [Key Features](#key-features)

## 🌐 Overview

Seller App is the dashboard for sellers to manage their products, orders, and analytics.

### Key Responsibilities

| Responsibility   | Description                        |
| ---------------- | ---------------------------------- |
| Product Listing  | Create and manage product listings |
| Inventory        | Stock management                   |
| Order Processing | Handle incoming orders             |
| Analytics        | Sales reports and insights         |
| Profile          | Seller profile management          |

## 🛠️ Technology Stack

| Category      | Technology      | Version |
| ------------- | --------------- | ------- |
| Framework     | React           | 18.2    |
| Language      | TypeScript      | 5.0+    |
| Bundler       | Vite            | 5.0     |
| Styling       | Tailwind CSS    | 3.0     |
| UI Kit        | DaisyUI         | Latest  |
| State         | Redux Toolkit   | 2.0     |
| Data Fetching | TanStack Query  | 5.x     |
| HTTP          | Axios           | 1.x     |
| Forms         | React Hook Form | 7.x     |
| Tables        | TanStack Table  | 8.x     |
| Media         | Cloudinary      | Latest  |

## 🏗️ Application Structure

```
apps/seller-app/
├── src/
│   ├── main.tsx               # Entry point
│   ├── App.tsx                # Root component
│   ├── components/            # Reusable components
│   │   ├── common/            # Shared components
│   │   ├── layout/            # Layout components
│   │   ├── forms/             # Form components
│   │   └── charts/            # Chart components
│   ├── pages/                 # Page components
│   │   ├── Dashboard.tsx
│   │   ├── products/
│   │   │   ├── ProductList.tsx
│   │   │   ├── ProductCreate.tsx
│   │   │   └── ProductEdit.tsx
│   │   ├── orders/
│   │   │   ├── OrderList.tsx
│   │   │   └── OrderDetail.tsx
│   │   ├── inventory/
│   │   └── analytics/
│   ├── store/                 # Redux store
│   │   ├── index.ts
│   │   └── slices/
│   ├── hooks/                 # Custom hooks
│   ├── services/              # API services
│   └── utils/                 # Utilities
├── public/                    # Static assets
└── vite.config.ts
```

## 📦 State Management

### Redux Store Structure

```typescript
// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productsReducer from './slices/productsSlice';
import ordersReducer from './slices/ordersSlice';
import { api } from '../services/api';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    orders: ordersReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});
```

## ✨ Key Features

### Product Management

```typescript
// features/products/ProductForm.tsx
interface ProductFormData {
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  sku: string;
  quantity: number;
  categoryId: string;
  images: File[];
  variants?: ProductVariant[];
}
```

### Order Processing

| Status    | Actions        |
| --------- | -------------- |
| Pending   | Accept, Reject |
| Accepted  | Mark Shipped   |
| Shipped   | Track, Update  |
| Delivered | Complete       |

### Analytics Dashboard

```
┌──────────────────────────────────────────────────────────────┐
│                    SELLER DASHBOARD                           │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐│
│  │ Total Sales │ │   Orders    │ │  Products   │ │ Revenue ││
│  │   $12,450   │ │     156     │ │     42      │ │  $8,230 ││
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘│
│                                                               │
│  ┌────────────────────────────────┐ ┌───────────────────────┐│
│  │       Sales Chart (7 days)     │ │     Top Products      ││
│  │   ▄   ▄▄                       │ │  1. Product A - $2,100││
│  │  ▄█▄ ▄██▄   ▄                  │ │  2. Product B - $1,850││
│  │ ▄███▄████▄ ▄█▄                 │ │  3. Product C - $1,200││
│  │ ███████████████                │ │  4. Product D - $980  ││
│  └────────────────────────────────┘ └───────────────────────┘│
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

See also:

- [TESTING.md](./TESTING.md) - Testing guide
- [API.md](./API.md) - API integration
