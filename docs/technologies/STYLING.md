# Styling

**Libraries:** Tailwind CSS 3.4, DaisyUI 4.4, Bootstrap 5.3, SCSS  
**Category:** CSS Frameworks & Preprocessors

---

## Usage by Application

| Application              | Framework              | Description                   |
| ------------------------ | ---------------------- | ----------------------------- |
| **E-Storefront-Web**     | Tailwind CSS + DaisyUI | Utility-first with components |
| **Admin App**            | Tailwind CSS           | Dashboard styling             |
| **Seller App**           | Tailwind CSS           | Portal styling                |
| **E-Storefront-Support** | Bootstrap + SCSS       | Quick static site             |

---

## Tailwind CSS (Web & Admin Apps)

### Configuration

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';
import daisyui from 'daisyui';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#6366f1',
        accent: '#f59e0b',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ['light', 'dark'],
  },
};

export default config;
```

### Common Patterns

```tsx
// Layout
<div className="container mx-auto px-4 py-8">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {/* Cards */}
  </div>
</div>

// Responsive
<div className="text-sm md:text-base lg:text-lg">Responsive text</div>
<div className="hidden md:block">Show on medium+</div>
<div className="block md:hidden">Show on mobile only</div>

// Flexbox
<div className="flex items-center justify-between gap-4">
  <span>Left</span>
  <span>Right</span>
</div>

// Dark Mode
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  Adapts to theme
</div>
```

### DaisyUI Components

```tsx
// Button
<button className="btn btn-primary">Primary</button>
<button className="btn btn-outline btn-secondary">Outline</button>
<button className="btn btn-sm">Small</button>

// Card
<div className="card bg-base-100 shadow-xl">
  <figure><img src="/product.jpg" alt="Product" /></figure>
  <div className="card-body">
    <h2 className="card-title">Product Name</h2>
    <p>Description</p>
    <div className="card-actions justify-end">
      <button className="btn btn-primary">Buy Now</button>
    </div>
  </div>
</div>

// Modal
<dialog id="my_modal" className="modal">
  <div className="modal-box">
    <h3 className="font-bold text-lg">Hello!</h3>
    <p className="py-4">Modal content</p>
  </div>
</dialog>

// Form
<input type="text" className="input input-bordered w-full" placeholder="Search" />
<select className="select select-bordered">
  <option>Option 1</option>
</select>

// Badge
<span className="badge badge-success">In Stock</span>
<span className="badge badge-error">Sold Out</span>
```

---

## Bootstrap + SCSS (Support Portal)

### HTML Setup

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="css/main.css" />
  </head>
  <body>
    <!-- Content -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/app.js" type="module"></script>
  </body>
</html>
```

### Grid System

```html
<div class="container">
  <div class="row">
    <div class="col-12 col-md-6 col-lg-4">
      <div class="card h-100">
        <div class="card-body">
          <h5 class="card-title">Order Issues</h5>
          <p class="card-text">Track orders, returns, refunds</p>
        </div>
      </div>
    </div>
  </div>
</div>
```

### SCSS Variables

```scss
// scss/_variables.scss
$primary: #3b82f6;
$secondary: #64748b;
$success: #22c55e;
$danger: #ef4444;

$font-family-sans: 'Inter', sans-serif;
$spacer: 1rem;

$breakpoints: (
  'sm': 576px,
  'md': 768px,
  'lg': 992px,
  'xl': 1200px,
);
```

### SCSS Mixins

```scss
// scss/_mixins.scss
@mixin respond-to($breakpoint) {
  @media (min-width: map-get($breakpoints, $breakpoint)) {
    @content;
  }
}

@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

// Usage
.hero {
  padding: $spacer * 2;
  @include respond-to('md') {
    padding: $spacer * 4;
  }
}
```

### Bootstrap Components

```html
<!-- Navbar -->
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container">
    <a class="navbar-brand" href="#">Support</a>
    <button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#nav">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="nav">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item"><a class="nav-link" href="#faq">FAQ</a></li>
        <li class="nav-item"><a class="nav-link" href="#contact">Contact</a></li>
      </ul>
    </div>
  </div>
</nav>

<!-- Accordion -->
<div class="accordion" id="faqAccordion">
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button" data-bs-toggle="collapse" data-bs-target="#q1">
        How do I track my order?
      </button>
    </h2>
    <div id="q1" class="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
      <div class="accordion-body">Use the order tracking page...</div>
    </div>
  </div>
</div>
```

---

## Best Practices

### Tailwind

```tsx
// ✅ Use component extraction for repetitive patterns
const buttonStyles = "px-4 py-2 rounded-lg font-medium transition-colors";

// ✅ Use @apply for complex reusable styles
// globals.css
@layer components {
  .btn-primary {
    @apply bg-primary text-white hover:bg-primary/90 px-4 py-2 rounded-lg;
  }
}

// ✅ Mobile-first responsive
<div className="text-sm md:text-base lg:text-lg" />
```

### Bootstrap + SCSS

```scss
// ✅ Use variables for consistency
.custom-button {
  background-color: $primary;
  padding: $spacer;
}

// ✅ Use mixins for responsive
.section {
  @include respond-to('md') {
    padding: $spacer * 2;
  }
}

// ✅ Override Bootstrap variables before import
$primary: #3b82f6;
@import 'bootstrap/scss/bootstrap';
```

---

## Related

- [TYPESCRIPT.md](TYPESCRIPT.md) - Component typing
- [NEXTJS.md](NEXTJS.md) - Next.js styling integration
- [MOBILE.md](MOBILE.md) - React Native StyleSheet
