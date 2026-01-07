# Types Package

## Overview

Shared TypeScript type definitions used across all frontend and backend applications in the e-commerce platform.

## Tech Stack

- **TypeScript 5** - Type definitions
- **Vitest** - Testing

## Installation

This package is consumed as a workspace dependency:

```json
{
  "dependencies": {
    "3a-ecommerce-types": "^1.0.0"
  }
}
```

## Type Categories

### User Types

- `User` - User entity
- `UserRole` - Role enumeration (ADMIN, SELLER, CUSTOMER)
- `AuthTokens` - JWT token structure
- `LoginCredentials` - Login request
- `RegisterData` - Registration request

### Product Types

- `Product` - Product entity
- `ProductFilter` - Filter options
- `ProductSort` - Sort options
- `ProductImage` - Image structure

### Order Types

- `Order` - Order entity
- `OrderItem` - Order line item
- `OrderStatus` - Status enumeration
- `PaymentStatus` - Payment status

### Category Types

- `Category` - Category entity

### Coupon Types

- `Coupon` - Coupon entity
- `CouponType` - PERCENTAGE | FIXED
- `DiscountResult` - Applied discount

### Address Types

- `Address` - Shipping/billing address

### Review Types

- `Review` - Product review

### API Types

- `ApiResponse<T>` - Standard API response wrapper
- `PaginatedResponse<T>` - Paginated list response
- `ErrorResponse` - Error structure

### Utility Types

- `LogLevel` - Logging levels (DEBUG, INFO, WARN, ERROR)

## Usage

```typescript
import { User, Product, Order, ApiResponse } from '3a-ecommerce-types';

const user: User = {
  id: '123',
  email: 'user@example.com',
  name: 'John Doe',
  role: 'CUSTOMER',
};
```

## Project Structure

```
src/
├── index.ts      # Main exports
├── user.ts       # User types
├── product.ts    # Product types
├── order.ts      # Order types
├── category.ts   # Category types
├── coupon.ts     # Coupon types
├── address.ts    # Address types
├── review.ts     # Review types
└── api.ts        # API response types
```

## Scripts

```bash
yarn test        # Run tests
yarn test:coverage # Run tests with coverage
```
