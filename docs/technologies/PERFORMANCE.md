# Performance Optimizations

Project-specific performance patterns implemented in E-Storefront.

---

## 1. React.memo

Prevents re-renders when props haven't changed.

**Applied to:** ProductCard, ProductSlider, LazyImage, CartItem

```tsx
const ProductCardComponent: React.FC<ProductCardProps> = ({ product }) => {
  /* ... */
};
export const ProductCard = React.memo(ProductCardComponent);
```

---

## 2. useMemo

Memoizes expensive computations.

```tsx
// ProductCard
const isOutOfStock = useMemo(() => product.stock === 0, [product.stock]);
const isInCart = useMemo(() => items.some((item) => item.id === product.id), [items, product.id]);

// ProductSlider
const maxIndex = useMemo(
  () => Math.max(0, Math.ceil(totalItems / responsive) - 1),
  [totalItems, responsive]
);

// Header
const cartItemCount = useMemo(() => (items.length > 9 ? '9+' : items.length), [items.length]);

// Products Page
const CATEGORIES = useMemo(
  () => [
    { value: 'All', label: 'All Categories' },
    ...categoryList.map((cat) => ({ value: cat.name, label: cat.name })),
  ],
  [categoryList]
);
```

---

## 3. useCallback

Memoizes callback functions to prevent child re-renders.

```tsx
// Header
const handleSearch = useCallback(
  (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  },
  [searchQuery, router]
);

const handleLogout = useCallback(() => {
  clearAuthCookies();
  setUser(null);
  router.push('/');
}, [router]);

// Products Page
const handleAddToCart = useCallback(
  (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.imageUrl || '/placeholder.png',
      productId: product.id,
    });
    showToast(`${product.name} added to cart!`, 'success');
  },
  [addItem, showToast]
);

// ProductSlider
const goToNext = useCallback(
  () => setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1)),
  [maxIndex]
);
```

---

## 4. Debouncing

Delays execution until after user stops typing.

```tsx
// lib/hooks/useDebounce.ts
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// Usage in Products Page
const [tempSearch, setTempSearch] = useState('');
const search = useDebounce(tempSearch, 500); // Auto-updates after 500ms
```

---

## 5. Throttling

Limits execution frequency for high-frequency events.

```tsx
// lib/hooks/useThrottle.ts
export function useThrottle<T extends (...args: any[]) => any>(callback: T, limit: number = 300) {
  const inThrottle = useRef(false);
  return useCallback(
    (...args: Parameters<T>) => {
      if (!inThrottle.current) {
        callback(...args);
        inThrottle.current = true;
        setTimeout(() => {
          inThrottle.current = false;
        }, limit);
      }
    },
    [callback, limit]
  );
}

// Infinite scroll with throttled scroll detection
export function useScrollToBottom(
  callback: () => void,
  threshold: number = 300,
  throttleMs: number = 300
) {
  const throttledScroll = useThrottle(() => {
    if (
      document.documentElement.scrollHeight - (window.scrollY + window.innerHeight) <=
      threshold
    ) {
      callback();
    }
  }, throttleMs);

  useEffect(() => {
    window.addEventListener('scroll', throttledScroll);
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [throttledScroll]);
}
```

---

## 6. Code Splitting

Dynamic imports for on-demand loading.

```tsx
// app/page.tsx
import dynamic from 'next/dynamic';

const ProductSlider = dynamic(
  () => import('@/components').then((mod) => ({ default: mod.ProductSlider })),
  { loading: () => <LoadingProductGrid count={4} />, ssr: true }
);

// Other candidates
const ProductAnalytics = dynamic(() => import('@/components/ProductAnalytics'), { ssr: false });
const CheckoutModal = dynamic(() => import('@/components/CheckoutModal'));
```

---

## 7. Lazy Loading Images

```tsx
// components/LazyImage.tsx
export const LazyImage: React.FC<LazyImageProps> = React.memo(
  ({ src, alt, fallback, threshold = 0.1, ...props }) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
      if (!imgRef.current) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setImageSrc(src);
              observer.disconnect();
            }
          });
        },
        { rootMargin: '50px', threshold }
      );
      observer.observe(imgRef.current);
      return () => observer.disconnect();
    }, [src, threshold]);

    return (
      <img
        ref={imgRef}
        src={imageSrc || undefined}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        {...props}
      />
    );
  }
);

// Native lazy loading
<img src={product.imageUrl} alt={product.name} loading="lazy" />;
```

---

## File Structure

```
lib/
├── hooks/
│   ├── useDebounce.ts
│   ├── useThrottle.ts
│   └── useScrollToBottom.ts
├── utils/
│   ├── debounce.ts
│   └── throttle.ts
components/
├── LazyImage.tsx
├── ProductCard.tsx      # memo + callbacks
├── ProductSlider.tsx    # memo + callbacks
└── Header.tsx           # callbacks
app/
├── page.tsx             # code splitting
└── products/page.tsx    # debouncing
```

---

## Quick Reference

| Technique   | Use Case                     | Hook/Method                     |
| ----------- | ---------------------------- | ------------------------------- |
| React.memo  | Prevent component re-renders | `React.memo()`                  |
| useMemo     | Expensive calculations       | `useMemo(() => calc, [deps])`   |
| useCallback | Event handlers               | `useCallback(() => fn, [deps])` |
| Debounce    | Search input                 | `useDebounce(value, 300)`       |
| Throttle    | Scroll events                | `useThrottle(fn, 100)`          |
| Code Split  | Routes, modals               | `dynamic(() => import())`       |
| Lazy Load   | Images, off-screen           | `loading="lazy"`                |

---

## Do's and Don'ts

### ✅ Do

- Use React.memo for frequently re-rendered list items
- Debounce search/filter inputs
- Throttle scroll/resize handlers
- Code split large components
- Lazy load below-fold images

### ❌ Don't

- Memoize everything (has overhead)
- Use useMemo/useCallback for simple operations
- Forget dependencies in hooks
- Code split critical above-fold content
- Lazy load hero images

---

## Related

- [REACT.md](REACT.md) - React patterns
- [NEXTJS.md](NEXTJS.md) - Next.js optimizations
- [Web Vitals](https://web.dev/vitals/)
