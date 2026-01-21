# Vite

## Overview

**Version:** 5.0  
**Website:** [https://vitejs.dev](https://vitejs.dev)  
**Category:** Build Tool

Vite is a next-generation frontend build tool that provides an extremely fast development experience. It leverages native ES modules and modern browser capabilities.

---

## Why Vite?

### Benefits

| Benefit                  | Description                            |
| ------------------------ | -------------------------------------- |
| **Instant Server Start** | No bundling needed during development  |
| **Lightning Fast HMR**   | Hot Module Replacement in milliseconds |
| **Optimized Build**      | Rollup-based production builds         |
| **Native ESM**           | Leverages browser's native ES modules  |
| **Rich Plugin System**   | Rollup-compatible plugin ecosystem     |
| **TypeScript Ready**     | Built-in TypeScript support            |

### Why We Chose Vite

1. **Development Speed** - Instant startup, fast HMR for admin/seller apps
2. **Modern Stack** - Works great with React 18 and TypeScript
3. **Production Optimized** - Efficient code splitting and tree shaking
4. **Plugin Ecosystem** - Easy integration with Tailwind, testing tools
5. **Simpler Configuration** - Less config compared to Webpack
6. **Better DX** - Faster feedback loop during development

---

## How to Use Vite

### Project Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  // Path aliases
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@store': path.resolve(__dirname, './src/store'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },

  // Development server
  server: {
    port: 3001,
    open: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/graphql': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },

  // Build options
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          ui: ['@headlessui/react', '@heroicons/react'],
        },
      },
    },
  },

  // Environment variables prefix
  envPrefix: 'VITE_',

  // CSS configuration
  css: {
    devSourcemap: true,
  },
});
```

### Environment Variables

```bash
# .env.development
VITE_APP_NAME=E-Storefront Admin
VITE_API_URL=http://localhost:4000
VITE_GRAPHQL_URL=http://localhost:4000/graphql
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=unsigned-preset

# .env.production
VITE_APP_NAME=E-Storefront Admin
VITE_API_URL=https://api.estorefront.com
VITE_GRAPHQL_URL=https://api.estorefront.com/graphql
```

```typescript
// Using environment variables in code
const apiUrl = import.meta.env.VITE_API_URL;
const appName = import.meta.env.VITE_APP_NAME;

// Type-safe env variables
// src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_API_URL: string;
  readonly VITE_GRAPHQL_URL: string;
  readonly VITE_CLOUDINARY_CLOUD_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

### Entry Point

```typescript
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import App from './App';
import { store } from './store';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
          <Toaster position="top-right" />
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
```

### Code Splitting with React.lazy

```typescript
// src/App.tsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LoadingSpinner } from '@components/common/LoadingSpinner';
import { ProtectedRoute } from '@components/auth/ProtectedRoute';
import Layout from '@components/layout/Layout';

// Lazy load pages
const Dashboard = lazy(() => import('@pages/Dashboard'));
const Products = lazy(() => import('@pages/Products'));
const ProductForm = lazy(() => import('@pages/ProductForm'));
const Orders = lazy(() => import('@pages/Orders'));
const OrderDetail = lazy(() => import('@pages/OrderDetail'));
const Categories = lazy(() => import('@pages/Categories'));
const Users = lazy(() => import('@pages/Users'));
const Settings = lazy(() => import('@pages/Settings'));
const Login = lazy(() => import('@pages/Login'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/:id/edit" element={<ProductForm />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="categories" element={<Categories />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
```

---

## How Vite Helps Our Project

### 1. Admin App Configuration

```typescript
// apps/admin-app/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Shared packages from monorepo
      '@3asoftwares/types': path.resolve(__dirname, '../../packages/types/src'),
      '@3asoftwares/utils': path.resolve(__dirname, '../../packages/utils/src'),
      '@3asoftwares/ui-library': path.resolve(__dirname, '../../packages/ui-library/src'),
    },
  },

  server: {
    port: 3001,
    proxy: {
      '/api': 'http://localhost:4000',
      '/graphql': 'http://localhost:4000',
    },
  },

  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          query: ['@tanstack/react-query'],
          table: ['@tanstack/react-table'],
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
        },
      },
    },
  },
});
```

### 2. Seller App Configuration

```typescript
// apps/seller-app/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@3asoftwares/types': path.resolve(__dirname, '../../packages/types/src'),
      '@3asoftwares/utils': path.resolve(__dirname, '../../packages/utils/src'),
      '@3asoftwares/ui-library': path.resolve(__dirname, '../../packages/ui-library/src'),
    },
  },

  server: {
    port: 3002,
    proxy: {
      '/api': 'http://localhost:4000',
      '/graphql': 'http://localhost:4000',
    },
  },

  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          charts: ['chart.js', 'react-chartjs-2'],
        },
      },
    },
  },
});
```

### 3. TailwindCSS Integration

```typescript
// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    // Shared UI library
    '../../packages/ui-library/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
```

### 4. Testing Configuration

```typescript
// vite.config.ts with Vitest
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/'],
    },
  },
});

// src/test/setup.ts
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
```

---

## Development Workflow

### Available Scripts

```json
// package.json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives",
    "lint:fix": "eslint src --ext ts,tsx --fix",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

### Hot Module Replacement

```typescript
// Vite HMR works automatically with React Fast Refresh
// Just save your file and see changes instantly!

// For custom HMR handling
if (import.meta.hot) {
  import.meta.hot.accept('./store', (newStore) => {
    // Handle store updates
  });
}
```

### Asset Handling

```typescript
// Import static assets
import logo from '@/assets/logo.svg';
import heroImage from '@/assets/hero.png';

function Header() {
  return (
    <header>
      <img src={logo} alt="Logo" />
    </header>
  );
}

// URL imports
const imageUrl = new URL('./image.png', import.meta.url).href;

// Public directory assets (served at root)
// public/favicon.ico -> /favicon.ico
```

---

## Build Optimization

### Chunk Strategy

```typescript
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: (id) => {
        // Vendor chunk for node_modules
        if (id.includes('node_modules')) {
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react-vendor';
          }
          if (id.includes('@tanstack')) {
            return 'tanstack';
          }
          if (id.includes('chart.js') || id.includes('recharts')) {
            return 'charts';
          }
          return 'vendor';
        }
      },
    },
  },
  // Chunk size warnings
  chunkSizeWarningLimit: 500,
},
```

### Bundle Analysis

```bash
# Install rollup-plugin-visualizer
npm install -D rollup-plugin-visualizer

# Add to vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      gzipSize: true,
    }),
  ],
});
```

---

## Related Documentation

- [React](./REACT.md) - UI library
- [Redux Toolkit](./REDUX_TOOLKIT.md) - State management
- [Tailwind CSS](../../../E-Storefront-Web/docs/technologies/TAILWIND_CSS.md) - Styling
- [TypeScript](../../../E-Storefront-Web/docs/technologies/TYPESCRIPT.md) - Type safety
