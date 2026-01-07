// Mock for 3a-ecommerce-types
export interface User {
  id: string;
  _id?: string;
  email: string;
  name: string;
  role: 'customer' | 'seller' | 'admin';
  emailVerified?: boolean;
}

export interface SellerAuthStoreState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearAuth: () => void;
  hydrate: () => void;
}

export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  sellerId: string;
  status: 'active' | 'inactive' | 'draft';
}

export interface Order {
  _id: string;
  customerId: string;
  sellerId: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

export default {};
