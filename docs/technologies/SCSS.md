# SCSS (Sass)

## Overview

**Version:** 1.69  
**Website:** [https://sass-lang.com](https://sass-lang.com)  
**Category:** CSS Preprocessor

SCSS (Sassy CSS) is a CSS preprocessor that adds features like variables, nesting, mixins, and functions to make stylesheets more maintainable.

---

## Why SCSS?

### Benefits

| Benefit         | Description                                    |
| --------------- | ---------------------------------------------- |
| **Variables**   | Reusable values for colors, fonts, spacing     |
| **Nesting**     | Write CSS that mirrors HTML structure          |
| **Mixins**      | Reusable blocks of CSS declarations            |
| **Partials**    | Split CSS into modular files                   |
| **Functions**   | Built-in and custom functions for calculations |
| **Inheritance** | Extend existing styles with @extend            |

### Why We Chose SCSS

1. **No Build Complexity** - Works with simple node-sass compilation
2. **Bootstrap Integration** - Bootstrap is built with SCSS
3. **Code Organization** - Partials keep styles modular
4. **Maintainability** - Variables make global changes easy
5. **Vanilla JS Project** - Perfect for non-React projects

---

## How to Use SCSS

### Installation

```bash
# Install Sass
npm install sass -D

# Watch and compile
sass --watch scss/main.scss:css/main.css

# Production build (minified)
sass scss/main.scss css/main.css --style=compressed
```

### Project Structure

```
E-Storefront-Support/
├── scss/
│   ├── main.scss           # Main entry file
│   ├── _variables.scss     # Variables and settings
│   ├── _mixins.scss        # Reusable mixins
│   ├── _base.scss          # Reset and base styles
│   ├── _layout.scss        # Layout and grid
│   ├── _components.scss    # UI components
│   ├── _utilities.scss     # Utility classes
│   └── _responsive.scss    # Media queries
└── css/
    └── main.css            # Compiled output
```

### Main SCSS File

```scss
// main.scss
// 1. Variables and settings
@import 'variables';

// 2. Bootstrap (with overrides)
@import 'bootstrap/scss/bootstrap';

// 3. Mixins
@import 'mixins';

// 4. Base styles
@import 'base';

// 5. Layout
@import 'layout';

// 6. Components
@import 'components';

// 7. Utilities
@import 'utilities';

// 8. Responsive
@import 'responsive';
```

---

## Features

### Variables

```scss
// _variables.scss
$primary-color: #4f46e5;
$secondary-color: #6b7280;
$success-color: #10b981;
$danger-color: #ef4444;
$warning-color: #f59e0b;

$font-family-base: 'Inter', system-ui, sans-serif;
$font-size-base: 1rem;

$spacing-xs: 0.25rem;
$spacing-sm: 0.5rem;
$spacing-md: 1rem;
$spacing-lg: 1.5rem;
$spacing-xl: 2rem;

$border-radius: 0.5rem;
$box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
```

### Nesting

```scss
// _components.scss
.ticket-card {
  background: white;
  border-radius: $border-radius;
  box-shadow: $box-shadow;

  &__header {
    padding: $spacing-md;
    border-bottom: 1px solid #e5e7eb;

    h3 {
      margin: 0;
      font-size: 1.125rem;
    }
  }

  &__body {
    padding: $spacing-md;
  }

  &__footer {
    padding: $spacing-md;
    background: #f9fafb;
  }

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  &--urgent {
    border-left: 4px solid $danger-color;
  }
}
```

### Mixins

```scss
// _mixins.scss
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

@mixin flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@mixin truncate($lines: 1) {
  @if $lines == 1 {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  } @else {
    display: -webkit-box;
    -webkit-line-clamp: $lines;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

@mixin responsive($breakpoint) {
  @if $breakpoint == 'sm' {
    @media (min-width: 576px) {
      @content;
    }
  } @else if $breakpoint == 'md' {
    @media (min-width: 768px) {
      @content;
    }
  } @else if $breakpoint == 'lg' {
    @media (min-width: 992px) {
      @content;
    }
  } @else if $breakpoint == 'xl' {
    @media (min-width: 1200px) {
      @content;
    }
  }
}

// Usage
.card {
  padding: $spacing-sm;

  @include responsive('md') {
    padding: $spacing-lg;
  }
}

.hero {
  @include flex-center;
  min-height: 400px;
}
```

### Functions

```scss
// _functions.scss
@function rem($pixels) {
  @return ($pixels / 16) * 1rem;
}

@function shade($color, $percentage) {
  @return mix(black, $color, $percentage);
}

@function tint($color, $percentage) {
  @return mix(white, $color, $percentage);
}

// Usage
.element {
  font-size: rem(18); // 1.125rem
  color: shade($primary, 20%); // Darker primary
  background: tint($primary, 80%); // Lighter primary
}
```

### Extend/Inheritance

```scss
// Base button styles
%btn-base {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-sm $spacing-md;
  border-radius: $border-radius;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  @extend %btn-base;
  background: $primary-color;
  color: white;

  &:hover {
    background: shade($primary-color, 10%);
  }
}

.btn-secondary {
  @extend %btn-base;
  background: $secondary-color;
  color: white;
}
```

---

## How SCSS Helps Our Project

### Support Portal Styling

```
┌─────────────────────────────────────────────────────────────┐
│                    SCSS Architecture                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  main.scss (entry)                                          │
│       │                                                      │
│       ├── _variables.scss  (colors, spacing, fonts)         │
│       ├── _mixins.scss     (reusable patterns)              │
│       ├── _base.scss       (reset, typography)              │
│       ├── _layout.scss     (header, footer, sidebar)        │
│       ├── _components.scss (cards, buttons, forms)          │
│       └── _responsive.scss (media queries)                  │
│                                                              │
│       ▼                                                      │
│  css/main.css (compiled output)                             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Scripts

```json
{
  "scripts": {
    "sass": "sass --watch scss/main.scss:css/main.css",
    "build:css": "sass scss/main.scss css/main.css --style=compressed",
    "dev": "concurrently \"yarn sass\" \"yarn start\""
  }
}
```

---

## Best Practices

### File Organization

```scss
// Use underscore prefix for partials (not compiled separately)
_variables.scss  ✓
_mixins.scss     ✓
main.scss        // Entry point (no underscore)
```

### Variable Naming

```scss
// Use semantic names
$color-primary: #4f46e5;
$color-text: #1f2937;
$color-background: #f9fafb;

// Spacing scale
$space-1: 0.25rem;
$space-2: 0.5rem;
$space-3: 0.75rem;
$space-4: 1rem;
```

### BEM Naming with SCSS

```scss
// Block__Element--Modifier
.card {
  &__header {
  } // .card__header
  &__body {
  } // .card__body
  &--featured {
  } // .card--featured
}
```

---

## Related Documentation

- [BOOTSTRAP.md](BOOTSTRAP.md) - Bootstrap framework
- [STYLING.md](STYLING.md) - CSS patterns
