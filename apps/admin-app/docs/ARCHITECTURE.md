# Admin App Architecture

## 📑 Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Application Structure](#application-structure)
- [State Management](#state-management)
- [Data Fetching](#data-fetching)
- [Authentication](#authentication)

## 🌐 Overview

Admin App is the administrative dashboard for managing the e-commerce platform, built with React 18 and Vite.

### Key Responsibilities

| Responsibility      | Description                   |
| ------------------- | ----------------------------- |
| Product Management  | CRUD operations for products  |
| Category Management | Category hierarchy management |
| Order Management    | Order processing & status     |
| User Management     | User accounts & roles         |
| Coupon Management   | Discount codes & promotions   |
| Analytics           | Sales reports & insights      |

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
apps/admin-app/
├── src/
│   ├── main.tsx               # Entry point
│   ├── App.tsx                # Root component
│   ├── components/            # Reusable components
│   │   ├── common/            # Shared components
│   │   ├── layout/            # Layout components
│   │   ├── forms/             # Form components
│   │   └── tables/            # Table components
│   ├── pages/                 # Page components
│   │   ├── Dashboard.tsx
│   │   ├── products/
│   │   ├── categories/
│   │   ├── orders/
│   │   ├── users/
│   │   └── coupons/
│   ├── store/                 # Redux store
│   │   ├── index.ts
│   │   └── slices/
│   ├── features/              # Feature modules
│   │   ├── products/
│   │   ├── categories/
│   │   └── orders/
│   ├── hooks/                 # Custom hooks
│   ├── services/              # API services
│   ├── utils/                 # Utilities
│   └── types/                 # TypeScript types
├── public/                    # Static assets
├── vite.config.ts             # Vite configuration
└── package.json
```

## 📦 State Management

### Redux Toolkit + RTK Query

```typescript
// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from '../services/api';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Feature Slice Example

```typescript
// store/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});
```

## 🔄 Data Fetching

### TanStack Query + RTK Query

```typescript
// services/api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Products', 'Categories', 'Orders', 'Users', 'Coupons'],
  endpoints: (builder) => ({
    // Products
    getProducts: builder.query<Product[], void>({
      query: () => '/products',
      providesTags: ['Products'],
    }),
    createProduct: builder.mutation<Product, CreateProductInput>({
      query: (body) => ({
        url: '/products',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Products'],
    }),
    // ... more endpoints
  }),
});

export const { useGetProductsQuery, useCreateProductMutation } = api;
```

## 🔐 Authentication

### Protected Routes

```typescript
// components/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export function ProtectedRoute({ requiredRole }: { requiredRole?: string }) {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
```

### Role-Based Access

| Route           | Required Role |
| --------------- | ------------- |
| `/dashboard`    | admin         |
| `/products/*`   | admin         |
| `/categories/*` | admin         |
| `/orders/*`     | admin         |
| `/users/*`      | admin         |
| `/coupons/*`    | admin         |

---

See also:

- [TESTING.md](./TESTING.md) - Testing guide
- [API.md](./API.md) - API integration
