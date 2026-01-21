# DaisyUI

## Overview

**Version:** 4.4  
**Website:** [https://daisyui.com](https://daisyui.com)  
**Category:** Tailwind CSS Component Library

DaisyUI is a component library for Tailwind CSS that provides pre-designed, customizable UI components using semantic class names.

---

## Why DaisyUI?

### Benefits

| Benefit              | Description                                    |
| -------------------- | ---------------------------------------------- |
| **Semantic Classes** | `btn-primary` instead of long utility chains   |
| **Themeable**        | 30+ built-in themes, easily customizable       |
| **Pure CSS**         | No JavaScript required for most components     |
| **Tailwind Native**  | Works seamlessly with Tailwind utilities       |
| **Small Bundle**     | Only CSS, no runtime overhead                  |
| **Accessible**       | Components follow accessibility best practices |

### Why We Chose DaisyUI

1. **Developer Productivity** - Pre-built components speed up development
2. **Consistency** - Unified design language across admin/seller apps
3. **Tailwind Compatible** - Extends rather than replaces Tailwind
4. **Theme Support** - Easy dark mode and theme switching
5. **Micro-frontends** - Consistent UI across shell, admin, seller apps

---

## How to Use DaisyUI

### Installation

```bash
# Install DaisyUI
npm install daisyui

# Add to Tailwind config
```

### Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light', 'dark', 'corporate'],
    darkTheme: 'dark',
    base: true,
    styled: true,
    utils: true,
  },
};
```

---

## Components We Use

### Buttons

```html
<!-- Basic buttons -->
<button class="btn">Default</button>
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-accent">Accent</button>
<button class="btn btn-ghost">Ghost</button>
<button class="btn btn-link">Link</button>

<!-- Sizes -->
<button class="btn btn-lg">Large</button>
<button class="btn btn-md">Medium</button>
<button class="btn btn-sm">Small</button>
<button class="btn btn-xs">Extra Small</button>

<!-- States -->
<button class="btn btn-primary loading">Loading</button>
<button class="btn btn-disabled">Disabled</button>
<button class="btn btn-outline btn-primary">Outline</button>
```

### Cards

```html
<div class="card bg-base-100 shadow-xl">
  <figure>
    <img src="product.jpg" alt="Product" />
  </figure>
  <div class="card-body">
    <h2 class="card-title">
      Product Name
      <div class="badge badge-secondary">NEW</div>
    </h2>
    <p>Product description goes here.</p>
    <div class="card-actions justify-end">
      <button class="btn btn-primary">Add to Cart</button>
    </div>
  </div>
</div>
```

### Forms

```html
<!-- Input with label -->
<div class="form-control w-full max-w-xs">
  <label class="label">
    <span class="label-text">Email</span>
  </label>
  <input type="email" placeholder="Enter email" class="input input-bordered w-full" />
  <label class="label">
    <span class="label-text-alt">We'll never share your email</span>
  </label>
</div>

<!-- Select -->
<select class="select select-bordered w-full max-w-xs">
  <option disabled selected>Pick a category</option>
  <option>Electronics</option>
  <option>Clothing</option>
  <option>Books</option>
</select>

<!-- Checkbox -->
<div class="form-control">
  <label class="label cursor-pointer">
    <span class="label-text">Remember me</span>
    <input type="checkbox" class="checkbox checkbox-primary" />
  </label>
</div>
```

### Navigation

```html
<!-- Navbar -->
<div class="navbar bg-base-100 shadow-lg">
  <div class="flex-1">
    <a class="btn btn-ghost text-xl">E-Storefront Admin</a>
  </div>
  <div class="flex-none">
    <ul class="menu menu-horizontal px-1">
      <li><a>Products</a></li>
      <li><a>Orders</a></li>
      <li>
        <details>
          <summary>Settings</summary>
          <ul class="bg-base-100 rounded-t-none p-2">
            <li><a>Profile</a></li>
            <li><a>Logout</a></li>
          </ul>
        </details>
      </li>
    </ul>
  </div>
</div>

<!-- Sidebar Menu -->
<ul class="menu bg-base-200 w-56 rounded-box">
  <li><a class="active">Dashboard</a></li>
  <li><a>Products</a></li>
  <li><a>Orders</a></li>
  <li class="menu-title">Settings</li>
  <li><a>Profile</a></li>
  <li><a>Preferences</a></li>
</ul>
```

### Modals

```html
<!-- Button to open modal -->
<button class="btn" onclick="my_modal.showModal()">Open Modal</button>

<!-- Modal -->
<dialog id="my_modal" class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Confirm Action</h3>
    <p class="py-4">Are you sure you want to delete this item?</p>
    <div class="modal-action">
      <form method="dialog">
        <button class="btn btn-ghost">Cancel</button>
        <button class="btn btn-error">Delete</button>
      </form>
    </div>
  </div>
</dialog>
```

### Tables

```html
<div class="overflow-x-auto">
  <table class="table table-zebra">
    <thead>
      <tr>
        <th></th>
        <th>Name</th>
        <th>Price</th>
        <th>Stock</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th>1</th>
        <td>Product A</td>
        <td>$99.00</td>
        <td><span class="badge badge-success">In Stock</span></td>
        <td>
          <button class="btn btn-xs btn-ghost">Edit</button>
          <button class="btn btn-xs btn-error btn-ghost">Delete</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### Alerts

```html
<div class="alert alert-success">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
  <span>Product added successfully!</span>
</div>

<div class="alert alert-warning">
  <span>Warning: Low stock on 5 products</span>
</div>

<div class="alert alert-error">
  <span>Error: Failed to save changes</span>
</div>
```

---

## How DaisyUI Helps Our Project

### Admin & Seller Apps

```
┌─────────────────────────────────────────────────────────────┐
│              DaisyUI in Micro-Frontends                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                   Shell App                          │   │
│  │              (Webpack Module Fed)                    │   │
│  │  ┌─────────────┐  ┌─────────────────────────────┐   │   │
│  │  │   Navbar    │  │        Content Area          │   │   │
│  │  │  (DaisyUI)  │  │                              │   │   │
│  │  └─────────────┘  │  ┌───────┐   ┌───────────┐  │   │   │
│  │  ┌─────────────┐  │  │ Admin │   │  Seller   │  │   │   │
│  │  │   Sidebar   │  │  │  App  │   │   App     │  │   │   │
│  │  │   Menu      │  │  │(Daisy)│   │  (Daisy)  │  │   │   │
│  │  │  (DaisyUI)  │  │  └───────┘   └───────────┘  │   │   │
│  │  └─────────────┘  └─────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Theme Configuration

```javascript
// Custom theme
daisyui: {
  themes: [
    {
      'e-storefront': {
        'primary': '#4f46e5',
        'secondary': '#6b7280',
        'accent': '#10b981',
        'neutral': '#1f2937',
        'base-100': '#ffffff',
        'info': '#3b82f6',
        'success': '#10b981',
        'warning': '#f59e0b',
        'error': '#ef4444',
      },
    },
    'dark',
  ],
}
```

---

## Best Practices

### Combine with Tailwind

```html
<!-- DaisyUI + Tailwind utilities -->
<button class="btn btn-primary gap-2 hover:scale-105 transition-transform">
  <svg class="h-5 w-5" />
  Add to Cart
</button>

<div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"></div>
```

### Responsive Design

```html
<!-- Responsive drawer -->
<div class="drawer lg:drawer-open">
  <input id="drawer" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content">
    <!-- Page content -->
  </div>
  <div class="drawer-side">
    <label for="drawer" class="drawer-overlay"></label>
    <ul class="menu bg-base-200 w-80">
      <!-- Sidebar content -->
    </ul>
  </div>
</div>
```

---

## Related Documentation

- [STYLING.md](STYLING.md) - Tailwind CSS patterns
- [VITE.md](VITE.md) - Build configuration
- [REACT.md](REACT.md) - React components
