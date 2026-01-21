# Micro-Frontend Architecture

## Overview

**Implementation:** Webpack Module Federation  
**Category:** Frontend Architecture  
**Scope:** Admin App, Seller App, Shell App

Micro-frontends extend microservices principles to the frontend, allowing independent teams to develop, deploy, and scale UI components separately.

---

## Why Micro-Frontends?

### Benefits

| Benefit                  | Description                              |
| ------------------------ | ---------------------------------------- |
| **Independent Deploy**   | Deploy features without full app release |
| **Team Autonomy**        | Teams own their domain end-to-end        |
| **Tech Flexibility**     | Different frameworks per micro-frontend  |
| **Scalable Teams**       | Multiple teams work without conflicts    |
| **Incremental Upgrades** | Update dependencies per module           |

### Why We Chose Micro-Frontends

1. **Admin/Seller Split** - Different teams, different release cycles
2. **Feature Isolation** - New features don't break existing ones
3. **Shared Components** - UI library consumed by all apps
4. **Performance** - Load only what's needed
5. **Maintainability** - Smaller, focused codebases

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     Micro-Frontend Architecture                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                         Shell Application                           │ │
│  │                    (Host - Webpack Module Fed)                      │ │
│  │  ┌────────────────────────────────────────────────────────────┐   │ │
│  │  │                      Shared Header/Nav                      │   │ │
│  │  └────────────────────────────────────────────────────────────┘   │ │
│  │                                                                    │ │
│  │  ┌─────────────────────┐      ┌─────────────────────┐            │ │
│  │  │                     │      │                     │            │ │
│  │  │     Admin App       │      │     Seller App      │            │ │
│  │  │     (Remote)        │      │     (Remote)        │            │ │
│  │  │                     │      │                     │            │ │
│  │  │  • Dashboard        │      │  • Dashboard        │            │ │
│  │  │  • Users            │      │  • Products         │            │ │
│  │  │  • Settings         │      │  • Orders           │            │ │
│  │  │  • Analytics        │      │  • Analytics        │            │ │
│  │  │                     │      │                     │            │ │
│  │  └─────────────────────┘      └─────────────────────┘            │ │
│  │                                                                    │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                       Shared Packages                               │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │ │
│  │  │  UI Library  │  │    Types     │  │    Utils     │             │ │
│  │  │  (DaisyUI)   │  │  (Shared)    │  │  (Helpers)   │             │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘             │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## How to Use Micro-Frontends

### Shell App (Host) Configuration

```javascript
// apps/shell-app/webpack.config.js
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'shell',
      remotes: {
        adminApp: 'adminApp@http://localhost:3001/remoteEntry.js',
        sellerApp: 'sellerApp@http://localhost:3002/remoteEntry.js',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
        'react-router-dom': { singleton: true },
        '@3asoftwares/ui-library': { singleton: true },
        '@3asoftwares/types': { singleton: true },
      },
    }),
  ],
};
```

### Admin App (Remote) Configuration

```javascript
// apps/admin-app/webpack.config.js
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'adminApp',
      filename: 'remoteEntry.js',
      exposes: {
        './Dashboard': './src/pages/Dashboard',
        './Users': './src/pages/Users',
        './Settings': './src/pages/Settings',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
        'react-router-dom': { singleton: true },
      },
    }),
  ],
};
```

### Dynamic Remote Loading

```typescript
// apps/shell-app/src/components/RemoteApp.tsx
import React, { Suspense, lazy } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface RemoteAppProps {
  remote: string;
  module: string;
  fallback?: React.ReactNode;
}

const loadRemote = (remote: string, module: string) => {
  return lazy(async () => {
    const container = await window[remote];
    const factory = await container.get(module);
    return factory();
  });
};

export function RemoteApp({ remote, module, fallback }: RemoteAppProps) {
  const Component = loadRemote(remote, module);

  return (
    <ErrorBoundary fallback={<div>Failed to load {module}</div>}>
      <Suspense fallback={fallback || <div>Loading...</div>}>
        <Component />
      </Suspense>
    </ErrorBoundary>
  );
}

// Usage
<RemoteApp remote="adminApp" module="./Dashboard" />
```

### Shell App Routing

```typescript
// apps/shell-app/src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RemoteApp } from './components/RemoteApp';
import { Layout } from './components/Layout';

export function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={<RemoteApp remote="adminApp" module="./Dashboard" />}
          />
          <Route
            path="/admin/users/*"
            element={<RemoteApp remote="adminApp" module="./Users" />}
          />

          {/* Seller Routes */}
          <Route
            path="/seller/dashboard"
            element={<RemoteApp remote="sellerApp" module="./Dashboard" />}
          />
          <Route
            path="/seller/products/*"
            element={<RemoteApp remote="sellerApp" module="./Products" />}
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
```

---

## Communication Patterns

### Shared State (Redux)

```typescript
// packages/shared-store/src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { userSlice } from './slices/userSlice';

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
});

// Shell provides store to remotes
<Provider store={store}>
  <RemoteApp remote="adminApp" module="./Dashboard" />
</Provider>
```

### Event Bus

```typescript
// packages/utils/src/eventBus.ts
type EventHandler = (...args: any[]) => void;

class EventBus {
  private events: Map<string, EventHandler[]> = new Map();

  on(event: string, handler: EventHandler): () => void {
    const handlers = this.events.get(event) || [];
    handlers.push(handler);
    this.events.set(event, handlers);

    return () => {
      const handlers = this.events.get(event) || [];
      this.events.set(
        event,
        handlers.filter((h) => h !== handler)
      );
    };
  }

  emit(event: string, ...args: any[]): void {
    const handlers = this.events.get(event) || [];
    handlers.forEach((handler) => handler(...args));
  }
}

export const eventBus = new EventBus();

// Usage in Admin App
eventBus.emit('user:updated', { id: '123', name: 'John' });

// Usage in Shell
eventBus.on('user:updated', (user) => {
  console.log('User updated:', user);
});
```

### Custom Events (Browser)

```typescript
// Cross-micro-frontend communication
window.dispatchEvent(
  new CustomEvent('mfe:navigate', {
    detail: { path: '/seller/products' },
  })
);

// Listen in Shell
window.addEventListener('mfe:navigate', (event: CustomEvent) => {
  router.navigate(event.detail.path);
});
```

---

## Deployment Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                    Deployment Pipeline                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐                                            │
│  │ Shell App   │  ──▶  CDN: shell.3asoftwares.com           │
│  └─────────────┘                                            │
│                                                              │
│  ┌─────────────┐                                            │
│  │ Admin App   │  ──▶  CDN: admin.3asoftwares.com           │
│  └─────────────┘       └── remoteEntry.js                   │
│                                                              │
│  ┌─────────────┐                                            │
│  │ Seller App  │  ──▶  CDN: seller.3asoftwares.com          │
│  └─────────────┘       └── remoteEntry.js                   │
│                                                              │
│  Each app deploys independently!                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Best Practices

1. **Share Dependencies** - Use singleton for React, Router
2. **Lazy Loading** - Load remotes on demand
3. **Error Boundaries** - Isolate failures
4. **Versioning** - SemVer for shared packages
5. **Consistent Styling** - Shared UI library

---

## Related Documentation

- [WEBPACK.md](WEBPACK.md) - Module Federation details
- [DESIGN_PATTERNS.md](DESIGN_PATTERNS.md) - Architecture patterns
- [STORYBOOK.md](STORYBOOK.md) - Shared component library
