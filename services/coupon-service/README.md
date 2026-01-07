# Coupon Service

## Overview

Coupon and discount management service providing CRUD operations for promotional codes, discount calculations, and coupon validation.

## Tech Stack

### Runtime & Framework

- **Node.js** - JavaScript runtime
- **Express 4** - Web framework
- **TypeScript 5** - Type-safe development

### Database

- **MongoDB 8** (via Mongoose) - NoSQL database

### Documentation

- **Swagger/OpenAPI** - API documentation

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

- ✅ Coupon CRUD operations
- ✅ Percentage and fixed amount discounts
- ✅ Coupon code validation
- ✅ Usage limits (per user, total)
- ✅ Expiration dates
- ✅ Minimum order value requirements
- ✅ Category-specific coupons
- ✅ User-specific coupons
- ✅ Swagger API documentation

## API Endpoints

### Public

- `GET /api/coupons/validate/:code` - Validate coupon code
- `POST /api/coupons/apply` - Apply coupon to order

### Admin Only

- `GET /api/coupons` - Get all coupons
- `GET /api/coupons/:id` - Get coupon by ID
- `POST /api/coupons` - Create new coupon
- `PUT /api/coupons/:id` - Update coupon
- `DELETE /api/coupons/:id` - Delete coupon

## Coupon Types

- **PERCENTAGE** - Percentage off total
- **FIXED** - Fixed amount off

## Project Structure

```
src/
├── controllers/  # Route handlers
├── middleware/   # Auth & validation middleware
├── models/       # Mongoose models
├── routes/       # Express routes
├── swagger/      # API documentation
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
PORT=4005
MONGODB_URI=mongodb://localhost:27017/ecommerce_coupons
JWT_SECRET=your-jwt-secret
```

## Port

- Development: `4005`

## API Documentation

Swagger UI available at: `http://localhost:4005/api-docs`

## Dependencies on Shared Packages

- `3a-ecommerce-utils` - Shared utilities and Logger
