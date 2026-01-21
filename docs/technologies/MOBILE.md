# Mobile Development

**Versions:** React Native 0.74.5, Expo SDK 51, Expo Router 3.5  
**Category:** Cross-Platform Mobile

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Mobile App Structure                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Expo (Development Platform)                                 │
│  ├── React Native (UI Framework)                            │
│  │   └── Native Components (iOS/Android)                    │
│  └── Expo Router (File-based Navigation)                    │
│                                                              │
│  app/                                                        │
│  ├── _layout.tsx        # Root layout                       │
│  ├── (tabs)/            # Tab navigation                    │
│  │   ├── index.tsx      # Home                              │
│  │   ├── categories.tsx # Categories                        │
│  │   ├── cart.tsx       # Cart                              │
│  │   └── profile.tsx    # Profile                           │
│  ├── product/[id].tsx   # Dynamic route                     │
│  └── orders/[id].tsx    # Order detail                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Project Configuration

### app.json

```json
{
  "expo": {
    "name": "E-Storefront",
    "slug": "e-storefront-mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#3b82f6"
    },
    "ios": {
      "bundleIdentifier": "com.3asoftwares.estorefront",
      "supportsTablet": true
    },
    "android": {
      "package": "com.estorefront.mobile",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#3b82f6"
      }
    },
    "plugins": ["expo-router", "expo-secure-store", "expo-notifications"],
    "scheme": "estorefront"
  }
}
```

### eas.json

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": { "EXPO_PUBLIC_API_URL": "http://localhost:4000" }
    },
    "preview": {
      "distribution": "internal",
      "env": { "EXPO_PUBLIC_API_URL": "https://staging-api.estorefront.com" }
    },
    "production": {
      "env": { "EXPO_PUBLIC_API_URL": "https://api.estorefront.com" }
    }
  }
}
```

---

## Navigation (Expo Router)

### Root Layout

```tsx
// app/_layout.tsx
import { Stack } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../src/context/AuthContext';

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ presentation: 'modal' }} />
          <Stack.Screen name="product/[id]" options={{ title: 'Product' }} />
          <Stack.Screen name="checkout" />
        </Stack>
      </AuthProvider>
    </QueryClientProvider>
  );
}
```

### Tab Layout

```tsx
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useCartStore } from '../../src/store/cartStore';

export default function TabLayout() {
  const cartCount = useCartStore((s) => s.items.length);

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#3b82f6' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <FontAwesome name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="th-large" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="shopping-cart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <FontAwesome name="user" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
```

### Dynamic Routes

```tsx
// app/product/[id].tsx
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id),
  });

  if (isLoading) return <LoadingSpinner />;
  return <ProductDetail product={product} />;
}
```

### Navigation

```tsx
import { router, Link } from 'expo-router';

// Programmatic navigation
router.push('/product/123');
router.replace('/login');
router.back();

// Link component
<Link href="/product/123">View Product</Link>
<Link href={{ pathname: '/product/[id]', params: { id: '123' } }}>View Product</Link>
```

---

## Components

### Product Card

```tsx
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export function ProductCard({ product, onPress, onAddToCart }) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(product.id)}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>${product.price}</Text>
        <TouchableOpacity style={styles.button} onPress={() => onAddToCart(product.id)}>
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', marginBottom: 16 },
  image: { width: '100%', height: 160 },
  content: { padding: 12 },
  name: { fontSize: 16, fontWeight: '600' },
  price: { fontSize: 18, fontWeight: '700', color: '#3b82f6' },
  button: { backgroundColor: '#3b82f6', padding: 10, borderRadius: 8, marginTop: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
});
```

### Product List (FlatList)

```tsx
import { FlatList, RefreshControl } from 'react-native';

export function ProductList({ products, onRefresh, onEndReached, refreshing }) {
  return (
    <FlatList
      data={products}
      renderItem={({ item }) => <ProductCard product={item} />}
      keyExtractor={(item) => item.id}
      numColumns={2}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
    />
  );
}
```

---

## Native Features

### Secure Storage

```typescript
import * as SecureStore from 'expo-secure-store';

export const authStorage = {
  async saveToken(token: string) {
    await SecureStore.setItemAsync('auth_token', token);
  },
  async getToken() {
    return SecureStore.getItemAsync('auth_token');
  },
  async clear() {
    await SecureStore.deleteItemAsync('auth_token');
  },
};
```

### Push Notifications

```typescript
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

export async function registerForPushNotifications() {
  if (!Device.isDevice) return null;

  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return null;

  const token = await Notifications.getExpoPushTokenAsync();
  return token.data;
}

// Handle incoming notifications
Notifications.addNotificationReceivedListener((notification) => {
  console.log('Notification:', notification);
});
```

### Image Picker

```typescript
import * as ImagePicker from 'expo-image-picker';

export async function pickImage() {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (!result.canceled) {
    return result.assets[0].uri;
  }
  return null;
}
```

---

## Commands

```bash
# Development
npx expo start              # Start dev server
npx expo start --ios        # Start iOS simulator
npx expo start --android    # Start Android emulator

# Build
eas build --platform ios --profile development
eas build --platform android --profile production

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

---

## Protected Routes

```tsx
// app/(tabs)/_layout.tsx
import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function TabLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (!user) return <Redirect href="/login" />;

  return <Tabs>{/* ... */}</Tabs>;
}
```

---

## Related

- [GRAPHQL.md](GRAPHQL.md) - API queries
- [ZUSTAND.md](ZUSTAND.md) - State management
- [TYPESCRIPT.md](TYPESCRIPT.md) - Type definitions
