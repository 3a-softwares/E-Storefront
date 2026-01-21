# Lighthouse

## Overview

**Tool:** Google Lighthouse  
**Category:** Performance Auditing  
**Scope:** Web & PWA

Lighthouse is an open-source tool for auditing web pages for performance, accessibility, SEO, and best practices.

---

## Why Lighthouse?

### Benefits

| Benefit               | Description                       |
| --------------------- | --------------------------------- |
| **Performance Score** | Objective metrics for page speed  |
| **Accessibility**     | WCAG compliance checking          |
| **SEO**               | Search engine optimization audit  |
| **Best Practices**    | Security and modern web standards |
| **PWA**               | Progressive Web App requirements  |

### Why We Use Lighthouse

1. **Performance Tracking** - Monitor Core Web Vitals
2. **CI Integration** - Automated audits in pipeline
3. **Benchmarking** - Compare against competitors
4. **Regression Detection** - Catch performance issues early
5. **Accessibility** - Ensure WCAG compliance

---

## Core Web Vitals

### Key Metrics

```
┌─────────────────────────────────────────────────────────────┐
│                    Core Web Vitals                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  LCP (Largest Contentful Paint)                      │   │
│  │  • Good: ≤ 2.5s                                      │   │
│  │  • Needs Improvement: 2.5s - 4s                      │   │
│  │  • Poor: > 4s                                        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  FID (First Input Delay) / INP (Interaction to Next)│   │
│  │  • Good: ≤ 100ms                                     │   │
│  │  • Needs Improvement: 100ms - 300ms                  │   │
│  │  • Poor: > 300ms                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  CLS (Cumulative Layout Shift)                       │   │
│  │  • Good: ≤ 0.1                                       │   │
│  │  • Needs Improvement: 0.1 - 0.25                     │   │
│  │  • Poor: > 0.25                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Running Lighthouse

### Chrome DevTools

1. Open Chrome DevTools (F12)
2. Go to "Lighthouse" tab
3. Select categories to audit
4. Click "Analyze page load"

### CLI

```bash
# Install
npm install -g lighthouse

# Run audit
lighthouse https://www.3asoftwares.com --output html --output-path ./report.html

# With specific categories
lighthouse https://www.3asoftwares.com --only-categories=performance,accessibility

# Mobile emulation
lighthouse https://www.3asoftwares.com --emulated-form-factor=mobile
```

### Programmatic Usage

```typescript
// scripts/lighthouse-audit.ts
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

async function runAudit(url: string) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });

  const options = {
    logLevel: 'info',
    output: 'json',
    port: chrome.port,
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
  };

  const result = await lighthouse(url, options);

  await chrome.kill();

  const { categories } = result.lhr;

  return {
    performance: categories.performance.score * 100,
    accessibility: categories.accessibility.score * 100,
    bestPractices: categories['best-practices'].score * 100,
    seo: categories.seo.score * 100,
  };
}

// Run
const scores = await runAudit('https://www.3asoftwares.com');
console.log('Scores:', scores);
```

---

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Start server
        run: npm start &
        env:
          PORT: 3000

      - name: Wait for server
        run: npx wait-on http://localhost:3000

      - name: Run Lighthouse
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            http://localhost:3000
            http://localhost:3000/products
            http://localhost:3000/cart
          budgetPath: ./lighthouse-budget.json
          uploadArtifacts: true

      - name: Check scores
        run: |
          if [ $(cat .lighthouseci/performance.json | jq '.score') -lt 0.9 ]; then
            echo "Performance score below 90%"
            exit 1
          fi
```

### Lighthouse Budget

```json
// lighthouse-budget.json
[
  {
    "path": "/*",
    "timings": [
      {
        "metric": "interactive",
        "budget": 3000
      },
      {
        "metric": "first-contentful-paint",
        "budget": 1500
      }
    ],
    "resourceSizes": [
      {
        "resourceType": "script",
        "budget": 300
      },
      {
        "resourceType": "total",
        "budget": 1000
      }
    ],
    "resourceCounts": [
      {
        "resourceType": "third-party",
        "budget": 10
      }
    ]
  }
]
```

---

## Performance Optimization

### Image Optimization

```typescript
// Next.js Image component
import Image from 'next/image';

<Image
  src={product.image}
  alt={product.name}
  width={400}
  height={300}
  priority={isAboveFold}
  loading={isAboveFold ? 'eager' : 'lazy'}
/>
```

### Code Splitting

```typescript
// Dynamic imports
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false,
});
```

### Font Optimization

```typescript
// next.config.ts
export default {
  optimizeFonts: true,
};

// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});
```

---

## Accessibility Checks

### Common Issues & Fixes

| Issue               | Fix                                      |
| ------------------- | ---------------------------------------- |
| Missing alt text    | Add `alt` to all images                  |
| Low contrast        | Increase text/background contrast        |
| Missing form labels | Add `<label>` for all inputs             |
| Missing skip link   | Add "Skip to content" link               |
| Missing landmarks   | Use semantic HTML (header, main, footer) |
| Focus not visible   | Add `:focus-visible` styles              |

### Focus Styles

```css
/* Ensure visible focus */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Remove outline only for mouse users */
:focus:not(:focus-visible) {
  outline: none;
}
```

---

## Score Targets

| Category       | Target | Current |
| -------------- | ------ | ------- |
| Performance    | 90+    | 85      |
| Accessibility  | 100    | 98      |
| Best Practices | 100    | 100     |
| SEO            | 100    | 100     |

---

## Best Practices

1. **Run Regularly** - Audit on every deployment
2. **Set Budgets** - Define performance budgets
3. **Fix High Impact** - Address largest issues first
4. **Monitor Trends** - Track scores over time
5. **Real User Data** - Combine with RUM tools
6. **Mobile First** - Test mobile performance

---

## Related Documentation

- [PERFORMANCE.md](PERFORMANCE.md) - Optimization techniques
- [CI_CD.md](CI_CD.md) - CI integration
- [NEXTJS.md](NEXTJS.md) - Next.js optimizations
