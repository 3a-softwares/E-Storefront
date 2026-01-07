# Product Service

## Overview

Product catalog service providing CRUD operations for products, search functionality, and inventory management.

## Tech Stack

### Runtime & Framework

- **Node.js** - JavaScript runtime
- **Express 4** - Web framework
- **TypeScript 5** - Type-safe development

### Database

- **MongoDB 8** (via Mongoose) - NoSQL database

### Caching

- **Redis** (via ioredis) - In-memory caching

### Security

- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **express-validator** - Input validation

### Logging

- **Morgan** - HTTP request logging
- **Custom Logger** - Application logging

### Testing

- **Jest 29** - Test runner
- **ts-jest** - TypeScript support

## Features

- ✅ Product CRUD operations
- ✅ Product search and filtering
- ✅ Category-based filtering
- ✅ Seller-specific product management
- ✅ Inventory tracking
- ✅ Product images management
- ✅ Product ratings and reviews
- ✅ Price management
- ✅ Redis caching for performance
- ✅ Pagination support

## API Endpoints

### Public

- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/search` - Search products
- `GET /api/products/category/:categoryId` - Get products by category

### Protected (Seller/Admin)

- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/seller/:sellerId` - Get seller's products

## Project Structure

```
src/
├── controllers/  # Route handlers
├── middleware/   # Auth & validation middleware
├── models/       # Mongoose models
├── routes/       # Express routes
├── services/     # Business logic
└── index.ts      # Entry point
```

## Scripts

```bash
yarn dev         # Start development server with nodemon
yarn start       # Start production server
yarn build       # Compile TypeScript
yarn test        # Run tests
yarn test:watch  # Run tests in watch mode
yarn test:coverage # Run tests with coverage
```

## Environment Variables

```env
PORT=4002
MONGODB_URI=mongodb://localhost:27017/ecommerce_products
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-jwt-secret
```

## Port

- Development: `4002`

## Dependencies on Shared Packages

- `3a-ecommerce-utils` - Shared utilities and Logger
