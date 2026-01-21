# State Management

**Libraries:** Zustand 4.4.7, Redux Toolkit 2.0  
**Category:** State Management

---

## Usage by Application

| Application             | Library       | Reason                   |
| ----------------------- | ------------- | ------------------------ |
| **E-Storefront-Web**    | Zustand       | Simple, minimal bundle   |
| **E-Storefront-Mobile** | Zustand       | Works with React Native  |
| **Admin App**           | Redux Toolkit | Complex state, RTK Query |
| **Seller App**          | Redux Toolkit | Complex state, RTK Query |

---

## Zustand (Web & Mobile)

Simple, minimal state management without providers or boilerplate.

### Basic Store

```typescript
// store/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),

      removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity > 0
              ? state.items.map((i) => (i.id === id ? { ...i, quantity } : i))
              : state.items.filter((i) => i.id !== id),
        })),

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((t, i) => t + i.quantity, 0),
      totalPrice: () => get().items.reduce((t, i) => t + i.price * i.quantity, 0),
    }),
    { name: 'cart-storage' }
  )
);
```

### Usage

```tsx
'use client';
import { useCartStore } from '@/store/cartStore';

// Read single value (selective subscription)
function CartBadge() {
  const count = useCartStore((s) => s.items.length);
  return <span>{count}</span>;
}

// Read multiple values
function CartPage() {
  const { items, removeItem, totalPrice } = useCartStore();
  return (
    <div>
      {items.map((item) => (
        <CartItem key={item.id} item={item} onRemove={removeItem} />
      ))}
      <div>Total: ${totalPrice()}</div>
    </div>
  );
}

// Access outside React
import { useCartStore } from '@/store/cartStore';
const items = useCartStore.getState().items;
useCartStore.getState().addItem(newItem);
```

### Auth Store Example

```typescript
// store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: 'auth-storage' }
  )
);
```

---

## Redux Toolkit (Admin & Seller Apps)

For complex applications with interrelated state and RTK Query for data fetching.

### Store Setup

```typescript
// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from './api';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    ui: uiReducer,
  },
  middleware: (getDefault) => getDefault().concat(api.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Creating Slices

```typescript
// store/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null, isAuthenticated: false },
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
```

### RTK Query

```typescript
// store/api/index.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Products', 'Orders', 'Users'],
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, ProductsArgs>({
      query: (args) => ({ url: '/products', params: args }),
      providesTags: ['Products'],
    }),
    createProduct: builder.mutation<Product, CreateProductInput>({
      query: (body) => ({ url: '/products', method: 'POST', body }),
      invalidatesTags: ['Products'],
    }),
  }),
});

export const { useGetProductsQuery, useCreateProductMutation } = api;
```

### Usage

```tsx
// Using RTK Query hooks
function ProductList() {
  const { data, isLoading, error } = useGetProductsQuery({ page: 1, limit: 10 });
  const [createProduct] = useCreateProductMutation();

  if (isLoading) return <Loading />;
  return <Grid products={data.products} />;
}

// Using typed hooks
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T) =>
  useSelector(selector);
```

---

## When to Use Which

| Criteria           | Zustand     | Redux Toolkit      |
| ------------------ | ----------- | ------------------ |
| **Bundle Size**    | ~1KB        | ~30KB              |
| **Learning Curve** | Low         | Medium             |
| **Boilerplate**    | Minimal     | Moderate           |
| **DevTools**       | Plugin      | Built-in           |
| **Async**          | Manual      | RTK Query          |
| **Use Case**       | Simple apps | Complex admin apps |

---

## Related

- [GRAPHQL.md](GRAPHQL.md) - Alternative data fetching
- [REACT.md](REACT.md) - React patterns
- [TYPESCRIPT.md](TYPESCRIPT.md) - Type definitions
