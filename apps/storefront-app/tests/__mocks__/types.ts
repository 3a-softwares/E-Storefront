// Mock for 3a-ecommerce-types

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  imageUrl?: string;
  addedAt: number;
}

export interface RecentlyViewedItem {
  productId: string;
  name: string;
  price: number;
  imageUrl?: string;
  viewedAt: number;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  addresses: Address[];
  defaultAddressId?: string;
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export interface CartStore {
  items: CartItem[];
  wishlist: WishlistItem[];
  recentlyViewed: RecentlyViewedItem[];
  userProfile: UserProfile | null;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  addToWishlist: (item: Omit<WishlistItem, 'addedAt'>) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  addRecentlyViewed: (item: Omit<RecentlyViewedItem, 'viewedAt'>) => void;
  clearRecentlyViewed: () => void;
  setUserProfile: (profile: UserProfile | null) => void;
  loadUserFromStorage: () => void;
  addAddress: (address: Address) => void;
  updateAddress: (address: Address) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  images?: string[];
  stock: number;
  rating?: number;
  reviewCount?: number;
  category: string;
  sellerId: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

export interface Order {
  id: string;
  customerId: string;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  shippingAddress: Address;
  createdAt: string;
}

export default {};
