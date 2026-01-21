# Next.js

## Overview

**Version:** 16.1.1  
**Website:** [https://nextjs.org](https://nextjs.org)  
**Category:** React Framework

Next.js is a React framework that enables server-side rendering, static site generation, and modern web application features out of the box.

---

## Why Next.js?

### Benefits

| Benefit                         | Description                                       |
| ------------------------------- | ------------------------------------------------- |
| **Server-Side Rendering (SSR)** | Improved SEO and faster initial page loads        |
| **App Router**                  | File-based routing with layouts and nested routes |
| **Automatic Code Splitting**    | Only loads JavaScript needed for each page        |
| **Image Optimization**          | Automatic image optimization with `next/image`    |
| **API Routes**                  | Build API endpoints within the same project       |
| **TypeScript Support**          | First-class TypeScript integration                |
| **Fast Refresh**                | Instant feedback during development               |
| **Built-in CSS Support**        | CSS Modules, Tailwind, and global styles          |

### Why We Chose Next.js

1. **SEO Requirements** - E-commerce sites need excellent SEO for product discoverability
2. **Performance** - Fast page loads directly impact conversion rates
3. **Developer Experience** - Rapid development with hot reloading
4. **Scalability** - Handles high traffic with edge caching
5. **Ecosystem** - Large community and extensive plugin support

---

## How to Use Next.js

### App Router Structure

```
app/
├── layout.tsx          # Root layout (applies to all pages)
├── page.tsx            # Home page (/)
├── globals.css         # Global styles
│
├── products/
│   ├── layout.tsx      # Products layout
│   ├── page.tsx        # /products
│   └── [id]/
│       └── page.tsx    # /products/:id (dynamic route)
│
├── cart/
│   └── page.tsx        # /cart
│
└── api/
    └── health/
        └── route.ts    # API route /api/health
```

### Page Component

```tsx
// app/products/page.tsx
import { Metadata } from 'next';

// Static metadata
export const metadata: Metadata = {
  title: 'Products',
  description: 'Browse our product catalog',
};

// Server Component (default)
export default async function ProductsPage() {
  // This runs on the server
  const products = await fetchProducts();

  return (
    <div>
      <h1>Products</h1>
      <ProductGrid products={products} />
    </div>
  );
}
```

### Dynamic Routes

```tsx
// app/products/[id]/page.tsx
interface Props {
  params: { id: string };
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await fetchProduct(params.id);

  return <ProductDetail product={product} />;
}

// Generate static params for SSG
export async function generateStaticParams() {
  const products = await fetchAllProducts();
  return products.map((product) => ({
    id: product.id,
  }));
}
```

### Client Components

```tsx
// components/AddToCartButton.tsx
'use client'; // Mark as client component

import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';

export function AddToCartButton({ product }) {
  const [loading, setLoading] = useState(false);
  const { addItem } = useCartStore();

  const handleClick = () => {
    setLoading(true);
    addItem(product);
    setLoading(false);
  };

  return (
    <button onClick={handleClick} disabled={loading}>
      {loading ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
```

### Layouts

```tsx
// app/layout.tsx
import { Providers } from './providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
```

### Image Optimization

```tsx
import Image from 'next/image';

export function ProductImage({ src, alt }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={400}
      height={400}
      placeholder="blur"
      blurDataURL="/placeholder.jpg"
      loading="lazy"
    />
  );
}
```

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:4000  # Exposed to browser
DATABASE_URL=postgresql://...               # Server-only
```

```tsx
// Access in code
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

---

## How Next.js Helps Our Project

### 1. SEO Optimization

```tsx
// app/products/[id]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await fetchProduct(params.id);

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      images: [product.image],
    },
  };
}
```

**Impact:** Product pages are indexed by search engines, driving organic traffic.

### 2. Performance

| Feature                  | Benefit                                   |
| ------------------------ | ----------------------------------------- |
| Automatic code splitting | Only loads code needed for current page   |
| Image optimization       | Serves WebP, lazy loads, responsive sizes |
| Prefetching              | Prefetches linked pages on hover          |
| Edge caching             | Static pages served from CDN              |

### 3. Developer Productivity

```bash
# Start development with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### 4. E-commerce Features

- **Dynamic Product Pages** - `/products/[id]` for each product
- **Category Pages** - `/products?category=electronics`
- **Cart Persistence** - Client-side state management
- **Checkout Flow** - Multi-step checkout with layouts

---

## Configuration

### next.config.ts

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Standalone output for Docker
  output: 'standalone',

  // Transpile shared packages
  transpilePackages: ['@3asoftwares/ui', '@3asoftwares/types'],

  // Image optimization domains
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com' }],
  },

  // Turbopack for faster development
  turbopack: {
    resolveAlias: {
      '@3asoftwares/ui': './node_modules/@3asoftwares/ui/dist/index.js',
    },
  },
};

export default nextConfig;
```

---

## Best Practices

### 1. Server vs Client Components

```tsx
// ✅ Server Component (default) - for data fetching
export default async function ProductList() {
  const products = await fetchProducts(); // Direct database access
  return <ProductGrid products={products} />;
}

// ✅ Client Component - for interactivity
('use client');
export function SearchInput() {
  const [query, setQuery] = useState('');
  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```

### 2. Data Fetching Patterns

```tsx
// Server Component with caching
async function getProducts() {
  const res = await fetch('https://api.example.com/products', {
    next: { revalidate: 3600 }, // Revalidate every hour
  });
  return res.json();
}
```

### 3. Error Handling

```tsx
// app/products/error.tsx
'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

### 4. Loading States

```tsx
// app/products/loading.tsx
export default function Loading() {
  return <ProductGridSkeleton />;
}
```

---

## Common Commands

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start development server (port 3004) |
| `npm run build` | Build for production                 |
| `npm start`     | Start production server              |
| `npm run lint`  | Run ESLint                           |

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
- [Next.js Examples](https://github.com/vercel/next.js/tree/canary/examples)
- [Learn Next.js](https://nextjs.org/learn)
