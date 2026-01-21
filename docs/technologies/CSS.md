# CSS

## Overview

**Category:** Styling  
**Scope:** All Projects  
**Approach:** Utility-First (Tailwind), CSS Modules, Global CSS

CSS (Cascading Style Sheets) defines the visual presentation of web applications, including layout, colors, fonts, and responsive design.

---

## Why CSS?

### Benefits

| Benefit         | Description                   |
| --------------- | ----------------------------- |
| **Separation**  | Style separate from structure |
| **Cascading**   | Styles inherit and cascade    |
| **Responsive**  | Media queries for all devices |
| **Performance** | Browser-optimized rendering   |
| **Standards**   | Universal web standard        |

### Why CSS Matters

1. **User Experience** - Visual appeal increases engagement
2. **Accessibility** - Proper styling aids accessibility
3. **Branding** - Consistent visual identity
4. **Performance** - Optimized CSS improves load times
5. **Maintainability** - Organized styles are easier to update

---

## CSS Approaches We Use

### 1. Tailwind CSS (Primary)

```html
<!-- Utility classes -->
<button class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
  Add to Cart
</button>

<!-- Responsive -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <!-- Cards -->
</div>
```

### 2. CSS Modules (Component-Scoped)

```typescript
// ProductCard.module.css
.card {
  @apply bg-base-100 rounded-lg shadow-md overflow-hidden;
}

.card:hover {
  @apply shadow-lg;
}

.image {
  @apply w-full h-48 object-cover;
}

// ProductCard.tsx
import styles from './ProductCard.module.css';

export function ProductCard({ product }) {
  return (
    <div className={styles.card}>
      <img className={styles.image} src={product.image} alt={product.name} />
    </div>
  );
}
```

### 3. Global CSS

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom base styles */
@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    @apply bg-base-100 text-base-content;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    @apply font-bold leading-tight;
  }

  a {
    @apply text-primary hover:underline;
  }
}

/* Reusable components */
@layer components {
  .btn-loading {
    @apply relative text-transparent;
  }

  .btn-loading::after {
    @apply absolute inset-0 flex items-center justify-center;
    content: '';
    border: 2px solid transparent;
    border-top-color: currentColor;
    border-radius: 50%;
    width: 1em;
    height: 1em;
    animation: spin 0.6s linear infinite;
  }
}

/* Custom utilities */
@layer utilities {
  .text-gradient {
    @apply bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary;
  }
}
```

---

## Modern CSS Features

### CSS Variables

```css
:root {
  --color-primary: 79 70 229;
  --color-secondary: 107 114 128;
  --spacing-unit: 0.25rem;
  --border-radius: 0.5rem;
}

.button {
  background: rgb(var(--color-primary));
  padding: calc(var(--spacing-unit) * 4);
  border-radius: var(--border-radius);
}
```

### CSS Grid

```css
/* Product grid */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

/* Dashboard layout */
.dashboard {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    'sidebar header'
    'sidebar main'
    'sidebar footer';
  min-height: 100vh;
}

.sidebar {
  grid-area: sidebar;
}
.header {
  grid-area: header;
}
.main {
  grid-area: main;
}
.footer {
  grid-area: footer;
}
```

### Flexbox

```css
/* Card layout */
.card {
  display: flex;
  flex-direction: column;
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-actions {
  margin-top: auto;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

/* Center content */
.hero {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
```

### Container Queries

```css
/* Modern container queries */
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    flex-direction: row;
  }
}
```

### Logical Properties

```css
/* RTL-compatible properties */
.card {
  padding-inline: 1rem; /* left/right or right/left in RTL */
  padding-block: 0.5rem; /* top/bottom */
  margin-inline-start: 1rem; /* left in LTR, right in RTL */
  border-inline-end: 1px solid #e5e7eb;
}
```

---

## Responsive Design

### Mobile-First Approach

```css
/* Base (mobile) */
.container {
  padding: 1rem;
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    padding: 3rem;
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

### Tailwind Breakpoints

```html
<!-- Mobile first -->
<div class="text-sm md:text-base lg:text-lg">Responsive text</div>

<div class="flex flex-col md:flex-row gap-4">
  <!-- Stack on mobile, row on tablet+ -->
</div>
```

---

## Animations

### Transitions

```css
.button {
  transition: all 0.2s ease-in-out;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

### Keyframe Animations

```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-spinner {
  animation: spin 1s linear infinite;
}
```

### Tailwind Animation Classes

```html
<div class="animate-pulse">Loading skeleton</div>
<div class="animate-spin">Loading spinner</div>
<div class="animate-bounce">Attention</div>
<div class="transition-transform hover:scale-105">Hover effect</div>
```

---

## Performance

### Critical CSS

```typescript
// next.config.ts
export default {
  experimental: {
    optimizeCss: true,
  },
};
```

### Purging Unused CSS

```typescript
// tailwind.config.ts
export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  // Unused classes are removed in production
};
```

### CSS-in-JS Alternatives

```typescript
// Use CSS variables for dynamic styles
<div
  style={{
    '--progress': `${percentage}%`
  } as React.CSSProperties}
  className="progress-bar"
/>

// CSS
.progress-bar::after {
  width: var(--progress);
}
```

---

## Best Practices

1. **Mobile-First** - Start with mobile styles
2. **Semantic Naming** - Use meaningful class names
3. **Avoid !important** - Fix specificity instead
4. **Use Variables** - For colors, spacing, fonts
5. **Minimize Nesting** - Keep specificity low
6. **Logical Properties** - For RTL support

---

## Related Documentation

- [STYLING.md](STYLING.md) - Tailwind patterns
- [SCSS.md](SCSS.md) - SCSS preprocessor
- [DAISYUI.md](DAISYUI.md) - Component library
- [THEMING.md](THEMING.md) - Theme system
