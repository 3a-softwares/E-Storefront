# Webpack

## Overview

**Version:** 5.88  
**Website:** [https://webpack.js.org](https://webpack.js.org)  
**Category:** Module Bundler

Webpack is a static module bundler for JavaScript applications. It builds a dependency graph of modules and generates optimized bundles for production.

---

## Why Webpack?

### Benefits

| Benefit               | Description                                |
| --------------------- | ------------------------------------------ |
| **Module Federation** | Share code between applications at runtime |
| **Code Splitting**    | Load code on demand                        |
| **Loaders**           | Transform files (TypeScript, CSS, images)  |
| **Plugins**           | Extend functionality (HMR, optimization)   |
| **Tree Shaking**      | Remove unused code                         |
| **Rich Ecosystem**    | Extensive plugin and loader library        |

### Why We Chose Webpack

1. **Module Federation** - Share code between shell, admin, and seller apps
2. **Microfrontend Architecture** - Load remote modules at runtime
3. **Mature Ecosystem** - Proven solution with extensive tooling
4. **Fine-Grained Control** - Customize every aspect of the build
5. **Production Optimization** - Advanced code splitting and caching

---

## How to Use Webpack

### Basic Configuration

```javascript
// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/index.tsx',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    publicPath: 'auto',
    clean: true,
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
  },

  module: {
    rules: [
      // TypeScript/JavaScript
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-typescript',
            ],
          },
        },
      },
      // CSS
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      // Images
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset/resource',
      },
      // Fonts
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
  ],

  devServer: {
    port: 3000,
    hot: true,
    historyApiFallback: true,
    proxy: {
      '/api': 'http://localhost:4000',
      '/graphql': 'http://localhost:4000',
    },
  },
};
```

### Development vs Production

```javascript
// webpack.dev.js
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',

  devServer: {
    port: 3000,
    hot: true,
    open: true,
    historyApiFallback: true,
  },
});

// webpack.prod.js
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',

  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
});
```

---

## How Webpack Helps Our Project

### 1. Module Federation (Shell App)

```javascript
// apps/shell-app/webpack.config.js
const { ModuleFederationPlugin } = require('webpack').container;
const deps = require('./package.json').dependencies;

module.exports = {
  // ... base config

  plugins: [
    new ModuleFederationPlugin({
      name: 'shell',

      // Expose components from shell to other apps
      exposes: {
        './Header': './src/components/Header',
        './Footer': './src/components/Footer',
        './CartContext': './src/context/CartContext',
      },

      // Consume remote modules from other apps
      remotes: {
        admin: 'admin@http://localhost:3001/remoteEntry.js',
        seller: 'seller@http://localhost:3002/remoteEntry.js',
      },

      // Share dependencies to avoid duplicates
      shared: {
        react: {
          singleton: true,
          requiredVersion: deps.react,
          eager: true,
        },
        'react-dom': {
          singleton: true,
          requiredVersion: deps['react-dom'],
          eager: true,
        },
        'react-router-dom': {
          singleton: true,
          requiredVersion: deps['react-router-dom'],
        },
        zustand: {
          singleton: true,
          requiredVersion: deps.zustand,
        },
        // Shared packages from monorepo
        '@3asoftwares/types': {
          singleton: true,
          requiredVersion: '*',
        },
        '@3asoftwares/utils': {
          singleton: true,
          requiredVersion: '*',
        },
        '@3asoftwares/ui-library': {
          singleton: true,
          requiredVersion: '*',
        },
      },
    }),
  ],
};
```

### 2. Loading Remote Modules

```typescript
// src/App.tsx - Loading federated modules
import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';

// Local pages
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';

// Remote modules (loaded at runtime from other apps)
const AdminDashboard = lazy(() => import('admin/Dashboard'));
const AdminProducts = lazy(() => import('admin/Products'));
const SellerDashboard = lazy(() => import('seller/Dashboard'));
const SellerProducts = lazy(() => import('seller/Products'));

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Consumer routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products/*" element={<Products />} />
          <Route path="/cart" element={<Cart />} />

          {/* Admin routes (federated from admin-app) */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />

          {/* Seller routes (federated from seller-app) */}
          <Route path="/seller" element={<SellerDashboard />} />
          <Route path="/seller/products" element={<SellerProducts />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
```

### 3. Type Definitions for Remote Modules

```typescript
// src/types/remotes.d.ts
declare module 'admin/Dashboard' {
  const Dashboard: React.ComponentType;
  export default Dashboard;
}

declare module 'admin/Products' {
  const Products: React.ComponentType;
  export default Products;
}

declare module 'seller/Dashboard' {
  const Dashboard: React.ComponentType;
  export default Dashboard;
}

declare module 'seller/Products' {
  const Products: React.ComponentType;
  export default Products;
}
```

### 4. Exposing Modules (Admin App)

```javascript
// apps/admin-app/webpack.config.js
const { ModuleFederationPlugin } = require('webpack').container;
const deps = require('./package.json').dependencies;

module.exports = {
  output: {
    publicPath: 'http://localhost:3001/',
  },

  plugins: [
    new ModuleFederationPlugin({
      name: 'admin',
      filename: 'remoteEntry.js',

      // Expose components to shell
      exposes: {
        './Dashboard': './src/pages/Dashboard',
        './Products': './src/pages/Products',
        './ProductForm': './src/pages/ProductForm',
        './Orders': './src/pages/Orders',
        './Categories': './src/pages/Categories',
        './Users': './src/pages/Users',
      },

      // Consume shared context from shell
      remotes: {
        shell: 'shell@http://localhost:3000/remoteEntry.js',
      },

      shared: {
        react: { singleton: true, requiredVersion: deps.react },
        'react-dom': { singleton: true, requiredVersion: deps['react-dom'] },
        'react-router-dom': { singleton: true },
        '@reduxjs/toolkit': { singleton: true },
        'react-redux': { singleton: true },
        '@3asoftwares/types': { singleton: true },
        '@3asoftwares/utils': { singleton: true },
        '@3asoftwares/ui-library': { singleton: true },
      },
    }),
  ],
};
```

---

## Architecture: Microfrontends

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    Shell App (:3000)                     │    │
│  │  ┌─────────────┐  ┌────────────────────────────────────┐│    │
│  │  │   Header    │  │         Dynamic Content            ││    │
│  │  │   Footer    │  │  ┌────────────┐  ┌────────────┐   ││    │
│  │  │   Cart      │  │  │ Admin App  │  │ Seller App │   ││    │
│  │  │   Context   │  │  │  (:3001)   │  │  (:3002)   │   ││    │
│  │  └─────────────┘  │  │ [remote]   │  │ [remote]   │   ││    │
│  │                   │  └────────────┘  └────────────┘   ││    │
│  │                   └────────────────────────────────────┘│    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

Shared Dependencies (loaded once):
- React & React DOM
- React Router DOM
- Zustand (shell) / Redux (admin/seller)
- @3asoftwares/types
- @3asoftwares/utils
- @3asoftwares/ui-library
```

---

## Code Splitting

```javascript
// Automatic code splitting with dynamic imports
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderHistory = lazy(() => import('./pages/OrderHistory'));

// Prefetch important routes
import(/* webpackPrefetch: true */ './pages/Checkout');

// Preload critical resources
import(/* webpackPreload: true */ './components/HeroSection');

// Named chunks
const Analytics = lazy(() => import(/* webpackChunkName: "analytics" */ './pages/Analytics'));
```

---

## Optimization Strategies

```javascript
// webpack.prod.js
module.exports = {
  optimization: {
    // Minimize JS
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            drop_console: true,
            dead_code: true,
          },
        },
      }),
    ],

    // Split chunks
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 25,
      minSize: 20000,
      cacheGroups: {
        default: false,
        vendors: false,

        // React framework
        framework: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
          name: 'framework',
          chunks: 'all',
          priority: 40,
        },

        // Other vendors
        lib: {
          test: /[\\/]node_modules[\\/]/,
          name: 'lib',
          chunks: 'all',
          priority: 30,
        },

        // Common modules
        common: {
          minChunks: 2,
          priority: 20,
          reuseExistingChunk: true,
        },
      },
    },

    // Runtime chunk
    runtimeChunk: 'single',
  },
};
```

---

## Related Documentation

- [React](./REACT.md) - UI library
- [Module Federation](https://webpack.js.org/concepts/module-federation/) - Webpack docs
- [Vite](./VITE.md) - Alternative build tool for admin/seller
