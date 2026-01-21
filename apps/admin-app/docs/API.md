# Admin App API Integration

## 📑 Table of Contents

- [Overview](#overview)
- [API Client Setup](#api-client-setup)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
- [Error Handling](#error-handling)

## 🌐 Overview

Admin App communicates with the backend via GraphQL Gateway and REST APIs.

| API             | Base URL      | Purpose              |
| --------------- | ------------- | -------------------- |
| GraphQL Gateway | `/graphql`    | Main data operations |
| Auth Service    | `/api/auth`   | Authentication       |
| Upload Service  | `/api/upload` | File uploads         |

## 🔧 API Client Setup

### Axios Instance

```typescript
// services/apiClient.ts
import axios from 'axios';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

## 🔐 Authentication

### Login Flow

```typescript
// services/authService.ts
import apiClient from './apiClient';

export const authService = {
  async login(email: string, password: string) {
    const response = await apiClient.post('/api/auth/login', {
      email,
      password,
    });

    const { accessToken, refreshToken, user } = response.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    return user;
  },

  async logout() {
    await apiClient.post('/api/auth/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await apiClient.post('/api/auth/refresh', {
      refreshToken,
    });

    localStorage.setItem('accessToken', response.data.accessToken);
    return response.data.accessToken;
  },
};
```

## 🔌 Endpoints

### Products API

| Method | Endpoint            | Description       |
| ------ | ------------------- | ----------------- |
| GET    | `/api/products`     | List all products |
| GET    | `/api/products/:id` | Get product by ID |
| POST   | `/api/products`     | Create product    |
| PUT    | `/api/products/:id` | Update product    |
| DELETE | `/api/products/:id` | Delete product    |

```typescript
// services/productService.ts
export const productService = {
  async getProducts(params?: ProductQueryParams) {
    const response = await apiClient.get('/api/products', { params });
    return response.data;
  },

  async getProduct(id: string) {
    const response = await apiClient.get(`/api/products/${id}`);
    return response.data;
  },

  async createProduct(data: CreateProductInput) {
    const response = await apiClient.post('/api/products', data);
    return response.data;
  },

  async updateProduct(id: string, data: UpdateProductInput) {
    const response = await apiClient.put(`/api/products/${id}`, data);
    return response.data;
  },

  async deleteProduct(id: string) {
    await apiClient.delete(`/api/products/${id}`);
  },
};
```

### Categories API

| Method | Endpoint               | Description       |
| ------ | ---------------------- | ----------------- |
| GET    | `/api/categories`      | List categories   |
| GET    | `/api/categories/tree` | Get category tree |
| POST   | `/api/categories`      | Create category   |
| PUT    | `/api/categories/:id`  | Update category   |
| DELETE | `/api/categories/:id`  | Delete category   |

### Orders API

| Method | Endpoint                 | Description       |
| ------ | ------------------------ | ----------------- |
| GET    | `/api/orders`            | List orders       |
| GET    | `/api/orders/:id`        | Get order details |
| PUT    | `/api/orders/:id/status` | Update status     |

### Users API

| Method | Endpoint              | Description |
| ------ | --------------------- | ----------- |
| GET    | `/api/users`          | List users  |
| GET    | `/api/users/:id`      | Get user    |
| PUT    | `/api/users/:id`      | Update user |
| PUT    | `/api/users/:id/role` | Update role |

### Coupons API

| Method | Endpoint           | Description   |
| ------ | ------------------ | ------------- |
| GET    | `/api/coupons`     | List coupons  |
| POST   | `/api/coupons`     | Create coupon |
| PUT    | `/api/coupons/:id` | Update coupon |
| DELETE | `/api/coupons/:id` | Delete coupon |

## ⚠️ Error Handling

### Error Types

```typescript
// types/errors.ts
export interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: Record<string, string[]>;
}

// Status codes
export const ErrorCodes = {
  VALIDATION_ERROR: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500,
};
```

### Error Handler

```typescript
// utils/errorHandler.ts
export function handleApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || 'An error occurred',
      code: error.response?.data?.code,
      details: error.response?.data?.details,
    };
  }

  return {
    status: 500,
    message: 'An unexpected error occurred',
  };
}
```

---

See also:

- [ARCHITECTURE.md](./ARCHITECTURE.md) - App architecture
- [../../api/API.md](../../api/API.md) - GraphQL API docs
