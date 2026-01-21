# Bootstrap

## Overview

**Version:** 5.0  
**Website:** [https://getbootstrap.com](https://getbootstrap.com)  
**Category:** CSS Framework

Bootstrap is a powerful, extensible, and feature-packed frontend toolkit for building responsive, mobile-first websites.

---

## Why Bootstrap?

### Benefits

| Benefit                  | Description                                  |
| ------------------------ | -------------------------------------------- |
| **Responsive Grid**      | 12-column grid system for all screen sizes   |
| **Pre-built Components** | Buttons, modals, cards, navbars ready to use |
| **Utility Classes**      | Spacing, colors, display utilities           |
| **JavaScript Plugins**   | Interactive components (dropdowns, tooltips) |
| **Browser Support**      | Consistent across all modern browsers        |
| **Customizable**         | SCSS variables for theming                   |

### Why We Chose Bootstrap

1. **Rapid Development** - Pre-built components speed up development
2. **Support Portal** - Perfect for admin-style interfaces
3. **Familiarity** - Widely known, easy to maintain
4. **No Build Step** - Works with vanilla JavaScript
5. **Documentation** - Excellent docs and community support

---

## How to Use Bootstrap

### Installation

```html
<!-- Via CDN -->
<link
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
  rel="stylesheet"
/>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

<!-- Or via npm -->
npm install bootstrap
```

### Project Structure (E-Storefront-Support)

```
E-Storefront-Support/
├── index.html           # Main entry
├── css/
│   └── main.css         # Compiled CSS
├── scss/
│   ├── main.scss        # Main SCSS file
│   ├── _variables.scss  # Bootstrap overrides
│   └── _components.scss # Custom components
├── js/
│   └── app.js           # Application logic
└── images/
```

### SCSS Integration

```scss
// scss/_variables.scss
// Override Bootstrap variables before importing
$primary: #4f46e5;
$secondary: #6b7280;
$success: #10b981;
$danger: #ef4444;
$warning: #f59e0b;
$info: #3b82f6;

$border-radius: 0.5rem;
$font-family-sans-serif: 'Inter', system-ui, sans-serif;

// scss/main.scss
@import 'variables';
@import 'bootstrap/scss/bootstrap';
@import 'components';
```

---

## Components We Use

### Grid System

```html
<div class="container">
  <div class="row">
    <div class="col-md-4">
      <div class="card">Ticket 1</div>
    </div>
    <div class="col-md-4">
      <div class="card">Ticket 2</div>
    </div>
    <div class="col-md-4">
      <div class="card">Ticket 3</div>
    </div>
  </div>
</div>
```

### Cards

```html
<div class="card shadow-sm">
  <div class="card-header bg-primary text-white">
    <h5 class="mb-0">Support Ticket #123</h5>
  </div>
  <div class="card-body">
    <p class="card-text">Ticket description here...</p>
    <span class="badge bg-warning">Pending</span>
  </div>
  <div class="card-footer text-muted">Created: Jan 20, 2025</div>
</div>
```

### Forms

```html
<form>
  <div class="mb-3">
    <label for="email" class="form-label">Email address</label>
    <input type="email" class="form-control" id="email" required />
  </div>
  <div class="mb-3">
    <label for="message" class="form-label">Message</label>
    <textarea class="form-control" id="message" rows="4"></textarea>
  </div>
  <button type="submit" class="btn btn-primary">Submit Ticket</button>
</form>
```

### Modals

```html
<!-- Button trigger -->
<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#ticketModal">
  View Details
</button>

<!-- Modal -->
<div class="modal fade" id="ticketModal" tabindex="-1">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Ticket Details</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <!-- Content -->
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Update Status</button>
      </div>
    </div>
  </div>
</div>
```

### Navigation

```html
<nav class="navbar navbar-expand-lg navbar-dark bg-primary">
  <div class="container">
    <a class="navbar-brand" href="#">E-Storefront Support</a>
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNav"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
          <a class="nav-link active" href="#">Dashboard</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Tickets</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">FAQ</a>
        </li>
      </ul>
    </div>
  </div>
</nav>
```

---

## How Bootstrap Helps Our Project

### Support Portal Layout

```
┌─────────────────────────────────────────────────────────────┐
│  E-Storefront Support Portal (Bootstrap 5)                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    Navbar (navbar)                      │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌─────────────────────┐  ┌────────────────────────────┐   │
│  │                     │  │                            │   │
│  │   Sidebar           │  │   Main Content             │   │
│  │   (col-md-3)        │  │   (col-md-9)               │   │
│  │                     │  │                            │   │
│  │   • Dashboard       │  │   ┌────────────────────┐   │   │
│  │   • My Tickets      │  │   │   Ticket Cards     │   │   │
│  │   • FAQ             │  │   │   (card grid)      │   │   │
│  │   • Contact         │  │   │                    │   │   │
│  │                     │  │   └────────────────────┘   │   │
│  │                     │  │                            │   │
│  └─────────────────────┘  └────────────────────────────┘   │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    Footer                               │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Utility Classes

```html
<!-- Spacing: m-{size}, p-{size}, mt-3, px-4, etc. -->
<div class="p-4 mb-3">Content</div>

<!-- Display: d-flex, d-none, d-md-block -->
<div class="d-flex justify-content-between align-items-center">
  <!-- Colors: text-primary, bg-light, border-danger -->
  <span class="text-success">Active</span>
  <span class="text-danger">Closed</span>

  <!-- Shadows: shadow-sm, shadow, shadow-lg -->
  <div class="card shadow-sm"></div>
</div>
```

---

## Best Practices

### Responsive Design

```html
<!-- Mobile-first approach -->
<div class="col-12 col-md-6 col-lg-4">
  <!-- Full width on mobile, half on tablet, third on desktop -->
</div>
```

### Custom Theming

```scss
// Override before importing Bootstrap
$theme-colors: (
  'primary': #4f46e5,
  'secondary': #6b7280,
  'success': #10b981,
  'danger': #ef4444,
);

@import 'bootstrap/scss/bootstrap';
```

### JavaScript Components

```javascript
// Initialize tooltips
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map((el) => new bootstrap.Tooltip(el));

// Programmatic modal control
const modal = new bootstrap.Modal(document.getElementById('myModal'));
modal.show();
```

---

## Related Documentation

- [STYLING.md](STYLING.md) - CSS patterns
- [SCSS.md](SCSS.md) - SCSS preprocessor
