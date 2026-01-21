# Theming

## Overview

**Libraries:** next-themes, Tailwind CSS, DaisyUI  
**Category:** UI/UX  
**Modes:** Light, Dark, System

Theming enables consistent visual styles across the application with support for multiple color schemes.

---

## Why Theming?

### Benefits

| Benefit                | Description                           |
| ---------------------- | ------------------------------------- |
| **User Preference**    | Respect user's dark/light mode choice |
| **Consistency**        | Unified look across all components    |
| **Accessibility**      | Better contrast options               |
| **Brand Identity**     | Consistent brand colors               |
| **Reduced Eye Strain** | Dark mode for low-light environments  |

### Why We Implement Theming

1. **User Experience** - Users expect dark mode support
2. **Modern Standards** - Industry standard feature
3. **Accessibility** - WCAG compliance
4. **Professional** - Polished, modern appearance
5. **Battery Saving** - Dark mode saves battery on OLED

---

## Web App Implementation

### Setup with next-themes

```bash
npm install next-themes
```

### Theme Provider

```typescript
// app/providers.tsx
'use client';

import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="system"
      themes={['light', 'dark', 'corporate']}
    >
      {children}
    </ThemeProvider>
  );
}
```

### Theme Switcher

```typescript
// components/ThemeSwitcher.tsx
'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="dropdown dropdown-end">
      <button className="btn btn-ghost btn-circle">
        {theme === 'dark' ? <Moon /> : <Sun />}
      </button>
      <ul className="dropdown-content menu bg-base-100 rounded-box w-52 p-2 shadow">
        <li>
          <button onClick={() => setTheme('light')}>
            <Sun /> Light
          </button>
        </li>
        <li>
          <button onClick={() => setTheme('dark')}>
            <Moon /> Dark
          </button>
        </li>
        <li>
          <button onClick={() => setTheme('system')}>
            <Monitor /> System
          </button>
        </li>
      </ul>
    </div>
  );
}
```

---

## DaisyUI Theme Configuration

### tailwind.config.ts

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      'light',
      'dark',
      {
        'e-storefront': {
          primary: '#4f46e5',
          'primary-content': '#ffffff',
          secondary: '#6b7280',
          'secondary-content': '#ffffff',
          accent: '#10b981',
          'accent-content': '#ffffff',
          neutral: '#1f2937',
          'neutral-content': '#f3f4f6',
          'base-100': '#ffffff',
          'base-200': '#f9fafb',
          'base-300': '#e5e7eb',
          'base-content': '#1f2937',
          info: '#3b82f6',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
        },
        'e-storefront-dark': {
          primary: '#6366f1',
          'primary-content': '#ffffff',
          secondary: '#9ca3af',
          'secondary-content': '#1f2937',
          accent: '#34d399',
          'accent-content': '#1f2937',
          neutral: '#374151',
          'neutral-content': '#f3f4f6',
          'base-100': '#1f2937',
          'base-200': '#111827',
          'base-300': '#0f172a',
          'base-content': '#f3f4f6',
          info: '#60a5fa',
          success: '#34d399',
          warning: '#fbbf24',
          error: '#f87171',
        },
      },
    ],
    darkTheme: 'e-storefront-dark',
  },
};

export default config;
```

---

## CSS Variables Approach

### Define Theme Variables

```css
/* globals.css */
:root {
  /* Colors */
  --color-primary: 79 70 229; /* #4f46e5 */
  --color-secondary: 107 114 128; /* #6b7280 */
  --color-accent: 16 185 129; /* #10b981 */

  /* Background */
  --color-bg-primary: 255 255 255;
  --color-bg-secondary: 249 250 251;

  /* Text */
  --color-text-primary: 31 41 55;
  --color-text-secondary: 107 114 128;

  /* Spacing */
  --spacing-unit: 0.25rem;

  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
}

[data-theme='dark'] {
  --color-primary: 99 102 241;
  --color-secondary: 156 163 175;
  --color-accent: 52 211 153;

  --color-bg-primary: 31 41 55;
  --color-bg-secondary: 17 24 39;

  --color-text-primary: 243 244 246;
  --color-text-secondary: 156 163 175;
}
```

### Using Variables in Tailwind

```typescript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
      },
      backgroundColor: {
        'bg-primary': 'rgb(var(--color-bg-primary) / <alpha-value>)',
        'bg-secondary': 'rgb(var(--color-bg-secondary) / <alpha-value>)',
      },
      textColor: {
        'text-primary': 'rgb(var(--color-text-primary) / <alpha-value>)',
        'text-secondary': 'rgb(var(--color-text-secondary) / <alpha-value>)',
      },
    },
  },
};
```

---

## Mobile App Theming

### React Native Paper

```typescript
// src/theme/index.ts
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#4f46e5',
    secondary: '#6b7280',
    background: '#ffffff',
    surface: '#f9fafb',
    text: '#1f2937',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#6366f1',
    secondary: '#9ca3af',
    background: '#1f2937',
    surface: '#111827',
    text: '#f3f4f6',
  },
};
```

### Theme Context

```typescript
// src/context/ThemeContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemTheme = useColorScheme();
  const [theme, setThemeState] = useState<Theme>('system');

  useEffect(() => {
    AsyncStorage.getItem('theme').then(saved => {
      if (saved) setThemeState(saved as Theme);
    });
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    AsyncStorage.setItem('theme', newTheme);
  };

  const isDark = theme === 'system'
    ? systemTheme === 'dark'
    : theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
```

---

## Component Examples

### Theme-Aware Card

```typescript
// components/ProductCard.tsx
export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <figure>
        <img src={product.image} alt={product.name} />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-base-content">{product.name}</h2>
        <p className="text-base-content/70">{product.description}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Add to Cart</button>
        </div>
      </div>
    </div>
  );
}
```

### Status Badges

```typescript
// components/StatusBadge.tsx
const statusStyles = {
  pending: 'badge-warning',
  processing: 'badge-info',
  shipped: 'badge-primary',
  delivered: 'badge-success',
  cancelled: 'badge-error',
};

export function StatusBadge({ status }: { status: keyof typeof statusStyles }) {
  return (
    <span className={`badge ${statusStyles[status]}`}>
      {status}
    </span>
  );
}
```

---

## Best Practices

1. **System Preference** - Default to system theme
2. **Persist Choice** - Save user's theme preference
3. **Smooth Transition** - Add transition for theme changes
4. **Test Both Modes** - Always test in light and dark
5. **Semantic Colors** - Use semantic names (primary, error)
6. **Contrast Ratios** - Ensure WCAG compliance

---

## Related Documentation

- [STYLING.md](STYLING.md) - CSS patterns
- [DAISYUI.md](DAISYUI.md) - Component library
- [ACCESSIBILITY.md](ACCESSIBILITY.md) - A11y guidelines
