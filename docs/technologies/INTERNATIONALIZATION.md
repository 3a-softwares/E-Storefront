# Internationalization (i18n)

## Overview

**Libraries:** next-intl, react-i18next, expo-localization  
**Category:** Localization  
**Languages:** English, Arabic (RTL support)

Internationalization enables applications to support multiple languages and regional preferences.

---

## Why Internationalization?

### Benefits

| Benefit              | Description                            |
| -------------------- | -------------------------------------- |
| **Global Reach**     | Serve users in their native language   |
| **User Experience**  | Users prefer apps in their language    |
| **Market Expansion** | Enter new markets without code changes |
| **Cultural Fit**     | Respect date/number/currency formats   |
| **RTL Support**      | Proper layout for Arabic, Hebrew, etc. |

### Why We Implement i18n

1. **Regional Markets** - Target Arabic-speaking countries
2. **User Preference** - Better engagement in native language
3. **Accessibility** - Language is part of accessibility
4. **Scalability** - Easy to add new languages
5. **Professional** - Shows commitment to global users

---

## Web App Implementation (Next.js)

### Setup with next-intl

```bash
npm install next-intl
```

### Configuration

```typescript
// next.config.ts
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

export default withNextIntl({
  // other Next.js config
});
```

### Message Files

```
messages/
├── en.json
└── ar.json
```

```json
// messages/en.json
{
  "common": {
    "welcome": "Welcome to E-Storefront",
    "login": "Login",
    "signup": "Sign Up",
    "logout": "Logout"
  },
  "products": {
    "title": "Products",
    "addToCart": "Add to Cart",
    "price": "Price: {price}",
    "outOfStock": "Out of Stock"
  },
  "cart": {
    "title": "Shopping Cart",
    "empty": "Your cart is empty",
    "total": "Total: {total}",
    "checkout": "Proceed to Checkout"
  }
}
```

```json
// messages/ar.json
{
  "common": {
    "welcome": "مرحباً بك في E-Storefront",
    "login": "تسجيل الدخول",
    "signup": "إنشاء حساب",
    "logout": "تسجيل الخروج"
  },
  "products": {
    "title": "المنتجات",
    "addToCart": "أضف إلى السلة",
    "price": "السعر: {price}",
    "outOfStock": "غير متوفر"
  },
  "cart": {
    "title": "سلة التسوق",
    "empty": "سلة التسوق فارغة",
    "total": "المجموع: {total}",
    "checkout": "إتمام الطلب"
  }
}
```

### i18n Request Configuration

```typescript
// i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = cookieStore.get('locale')?.value || 'en';

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

### Usage in Components

```typescript
// app/products/page.tsx
import { useTranslations } from 'next-intl';

export default function ProductsPage() {
  const t = useTranslations('products');

  return (
    <div>
      <h1>{t('title')}</h1>
      {products.map(product => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>{t('price', { price: product.price })}</p>
          <button>{t('addToCart')}</button>
        </div>
      ))}
    </div>
  );
}
```

### Language Switcher

```typescript
// components/LanguageSwitcher.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  const switchLanguage = (newLocale: string) => {
    document.cookie = `locale=${newLocale}; path=/`;
    router.refresh();
  };

  return (
    <select
      value={locale}
      onChange={(e) => switchLanguage(e.target.value)}
      className="select select-bordered"
    >
      <option value="en">English</option>
      <option value="ar">العربية</option>
    </select>
  );
}
```

---

## Mobile App Implementation (Expo)

### Setup

```bash
npx expo install expo-localization i18next react-i18next
```

### Configuration

```typescript
// src/lib/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from '../locales/en.json';
import ar from '../locales/ar.json';

const resources = {
  en: { translation: en },
  ar: { translation: ar },
};

const initI18n = async () => {
  const savedLanguage = await AsyncStorage.getItem('language');
  const deviceLanguage = Localization.locale.split('-')[0];

  i18n.use(initReactI18next).init({
    resources,
    lng: savedLanguage || deviceLanguage || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();

export default i18n;
```

### Usage in Components

```typescript
// app/products.tsx
import { useTranslation } from 'react-i18next';
import { View, Text, Button } from 'react-native';

export default function ProductsScreen() {
  const { t } = useTranslation();

  return (
    <View>
      <Text style={styles.title}>{t('products.title')}</Text>
      {products.map(product => (
        <View key={product.id}>
          <Text>{product.name}</Text>
          <Text>{t('products.price', { price: product.price })}</Text>
          <Button title={t('products.addToCart')} />
        </View>
      ))}
    </View>
  );
}
```

---

## RTL Support

### CSS for RTL

```css
/* globals.css */
[dir='rtl'] {
  text-align: right;
}

[dir='rtl'] .flex-row {
  flex-direction: row-reverse;
}

/* Use logical properties */
.card {
  padding-inline-start: 1rem; /* left in LTR, right in RTL */
  margin-inline-end: 0.5rem; /* right in LTR, left in RTL */
}
```

### RTL Detection

```typescript
// hooks/useDirection.ts
import { useLocale } from 'next-intl';

const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

export function useDirection() {
  const locale = useLocale();
  const isRTL = RTL_LANGUAGES.includes(locale);

  return {
    direction: isRTL ? 'rtl' : 'ltr',
    isRTL,
  };
}
```

### HTML Direction

```typescript
// app/layout.tsx
import { useDirection } from '@/hooks/useDirection';

export default function RootLayout({ children }) {
  const { direction } = useDirection();

  return (
    <html lang={locale} dir={direction}>
      <body>{children}</body>
    </html>
  );
}
```

---

## Date & Number Formatting

### Date Formatting

```typescript
import { useFormatter } from 'next-intl';

function OrderDate({ date }: { date: Date }) {
  const format = useFormatter();

  return (
    <time dateTime={date.toISOString()}>
      {format.dateTime(date, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}
    </time>
  );
}
```

### Currency Formatting

```typescript
function ProductPrice({ price }: { price: number }) {
  const format = useFormatter();

  return (
    <span>
      {format.number(price, {
        style: 'currency',
        currency: 'USD',
      })}
    </span>
  );
}
```

---

## Best Practices

1. **Extract All Strings** - No hardcoded text
2. **Use Placeholders** - For dynamic content
3. **Logical CSS** - Use `start/end` instead of `left/right`
4. **Test RTL** - Regularly test in RTL mode
5. **Professional Translation** - Use native speakers
6. **Context Comments** - Help translators understand context

---

## Related Documentation

- [THEMING.md](THEMING.md) - Theme system
- [NEXTJS.md](NEXTJS.md) - Next.js configuration
- [MOBILE.md](MOBILE.md) - Mobile implementation
