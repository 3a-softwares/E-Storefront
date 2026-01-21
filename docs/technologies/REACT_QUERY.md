# React Query (TanStack Query)

## Overview

**Version:** 5.90.12  
**Website:** [https://tanstack.com/query](https://tanstack.com/query)  
**Category:** Server State Management

React Query (TanStack Query) is a powerful data-fetching and state management library for React applications. It handles caching, synchronization, and updates of server state.

---

## Why React Query?

### Benefits

| Benefit                | Description                                       |
| ---------------------- | ------------------------------------------------- |
| **Automatic Caching**  | Smart caching with stale-while-revalidate pattern |
| **Background Updates** | Automatic refetching in background                |
| **Deduplication**      | Multiple components share the same request        |
| **Optimistic Updates** | Instant UI feedback before server confirms        |
| **Infinite Queries**   | Built-in infinite scroll support                  |
| **DevTools**           | Powerful debugging tools                          |
| **Retry Logic**        | Automatic retry with exponential backoff          |

### Why We Chose React Query

1. **Server State Management** - Separates server state from client state
2. **Caching Strategy** - Reduces redundant API calls
3. **Loading States** - Unified loading/error handling
4. **Works with Apollo** - Complements Apollo Client for REST/other APIs
5. **DevTools** - Excellent debugging experience

---

## How to Use React Query

### Provider Setup

```tsx
// app/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false, // Don't refetch on tab focus
            retry: 1, // Retry failed requests once
            staleTime: 30000, // Data fresh for 30 seconds
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NEXT_PUBLIC_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
```

### Basic Query

```typescript
import { useQuery } from '@tanstack/react-query';

// Fetch function
async function fetchProducts(category?: string): Promise<Product[]> {
  const params = category ? `?category=${category}` : '';
  const response = await fetch(`/api/products${params}`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
}

// In component
function ProductList({ category }: { category?: string }) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['products', category], // Cache key
    queryFn: () => fetchProducts(category),
    staleTime: 60000, // Fresh for 1 minute
  });

  if (isLoading) return <Skeleton />;
  if (isError) return <Error message={error.message} />;

  return (
    <div>
      {data?.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Query with Parameters

```typescript
function useProduct(productId: string) {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) throw new Error('Product not found');
      return response.json();
    },
    enabled: !!productId, // Only fetch if productId exists
  });
}

// Usage
function ProductDetail({ productId }: { productId: string }) {
  const { data: product, isLoading } = useProduct(productId);

  if (isLoading) return <ProductSkeleton />;
  if (!product) return <NotFound />;

  return <ProductInfo product={product} />;
}
```

### Mutations

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: CartItem) => {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!response.ok) throw new Error('Failed to add to cart');
      return response.json();
    },

    // Optimistic update
    onMutate: async (newItem) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['cart'] });

      // Snapshot previous value
      const previousCart = queryClient.getQueryData(['cart']);

      // Optimistically update
      queryClient.setQueryData(['cart'], (old: CartItem[]) =>
        [...(old || []), newItem]
      );

      return { previousCart };
    },

    // Rollback on error
    onError: (err, newItem, context) => {
      queryClient.setQueryData(['cart'], context?.previousCart);
    },

    // Refetch after success or error
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

// Usage
function AddToCartButton({ product }: { product: Product }) {
  const addToCart = useAddToCart();

  return (
    <button
      onClick={() => addToCart.mutate(product)}
      disabled={addToCart.isPending}
    >
      {addToCart.isPending ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
```

### Infinite Queries

```typescript
import { useInfiniteQuery } from '@tanstack/react-query';

interface ProductsResponse {
  products: Product[];
  nextPage: number | null;
}

function useInfiniteProducts() {
  return useInfiniteQuery({
    queryKey: ['products', 'infinite'],
    queryFn: async ({ pageParam = 1 }): Promise<ProductsResponse> => {
      const response = await fetch(`/api/products?page=${pageParam}&limit=12`);
      return response.json();
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
}

// Usage with infinite scroll
function InfiniteProductList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteProducts();

  // Flatten pages into single array
  const products = data?.pages.flatMap(page => page.products) ?? [];

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
```

### Prefetching

```typescript
import { useQueryClient } from '@tanstack/react-query';

function ProductCard({ product }: { product: Product }) {
  const queryClient = useQueryClient();

  // Prefetch product details on hover
  const prefetchProduct = () => {
    queryClient.prefetchQuery({
      queryKey: ['product', product.id],
      queryFn: () => fetchProduct(product.id),
      staleTime: 60000,
    });
  };

  return (
    <Link
      href={`/products/${product.id}`}
      onMouseEnter={prefetchProduct}
    >
      {/* Product content */}
    </Link>
  );
}
```

---

## How React Query Helps Our Project

### 1. Product Data Caching

```typescript
// Products are cached and shared across components
const { data: products } = useQuery({
  queryKey: ['products', { category, search, sort }],
  queryFn: () => fetchProducts({ category, search, sort }),
  staleTime: 5 * 60 * 1000, // 5 minutes
});

// Benefits:
// - Same query key = shared cache
// - Different components reuse data
// - Automatic background refresh
```

### 2. Order Tracking

```typescript
function useOrderStatus(orderId: string) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => fetchOrder(orderId),
    refetchInterval: 30000, // Poll every 30 seconds
    enabled: !!orderId,
  });
}

// Real-time order status updates
function OrderTracking({ orderId }: { orderId: string }) {
  const { data: order } = useOrderStatus(orderId);

  return <OrderStatusDisplay status={order?.status} />;
}
```

### 3. Search with Debouncing

```typescript
function useProductSearch(searchTerm: string) {
  const debouncedSearch = useDebounce(searchTerm, 300);

  return useQuery({
    queryKey: ['products', 'search', debouncedSearch],
    queryFn: () => searchProducts(debouncedSearch),
    enabled: debouncedSearch.length > 2, // Only search 3+ chars
    staleTime: 60000,
  });
}
```

### 4. Categories Caching

```typescript
// Categories rarely change - cache aggressively
function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: Infinity, // Never stale
    gcTime: 24 * 60 * 60 * 1000, // Keep in cache 24 hours
  });
}
```

---

## Configuration Options

### Query Options

| Option                 | Description                           | Default |
| ---------------------- | ------------------------------------- | ------- |
| `staleTime`            | How long data is considered fresh     | 0       |
| `gcTime`               | How long inactive data stays in cache | 5 min   |
| `retry`                | Number of retries on failure          | 3       |
| `refetchOnWindowFocus` | Refetch when window regains focus     | true    |
| `refetchInterval`      | Polling interval                      | false   |
| `enabled`              | Whether query should run              | true    |

### Global Configuration

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000, // 30 seconds
      gcTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
```

---

## Best Practices

### 1. Structured Query Keys

```typescript
// Use arrays for structured keys
const queryKeys = {
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters: ProductFilters) => [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
  },
  orders: {
    all: ['orders'] as const,
    detail: (id: string) => [...queryKeys.orders.all, id] as const,
  },
};

// Usage
useQuery({
  queryKey: queryKeys.products.list({ category: 'electronics' }),
  // ...
});

// Invalidate all product lists
queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
```

### 2. Error Boundaries

```tsx
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

function App() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ resetErrorBoundary }) => (
            <div>
              <p>Something went wrong</p>
              <button onClick={resetErrorBoundary}>Try again</button>
            </div>
          )}
        >
          <Products />
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
```

### 3. Suspense Mode

```tsx
function ProductList() {
  // This will suspend while loading
  const { data } = useSuspenseQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  return <ProductGrid products={data} />;
}

// Wrap with Suspense
<Suspense fallback={<ProductSkeleton />}>
  <ProductList />
</Suspense>;
```

### 4. Parallel Queries

```typescript
import { useQueries } from '@tanstack/react-query';

function ProductComparison({ productIds }: { productIds: string[] }) {
  const results = useQueries({
    queries: productIds.map(id => ({
      queryKey: ['product', id],
      queryFn: () => fetchProduct(id),
    })),
  });

  const products = results.map(r => r.data).filter(Boolean);
  const isLoading = results.some(r => r.isLoading);

  if (isLoading) return <Loading />;

  return <ComparisonTable products={products} />;
}
```

---

## DevTools

```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  );
}
```

---

## Resources

- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [TanStack Query GitHub](https://github.com/TanStack/query)
- [React Query Examples](https://tanstack.com/query/latest/docs/react/examples)
- [Practical React Query](https://tkdodo.eu/blog/practical-react-query)
