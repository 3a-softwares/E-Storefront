# Category Service

## Overview

Category management service providing CRUD operations for product categories, hierarchical category structure, and category-based filtering.

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

- ✅ Category CRUD operations
- ✅ Hierarchical category structure
- ✅ Category images
- ✅ Category slug generation
- ✅ Active/Inactive status
- ✅ Featured categories
- ✅ Swagger API documentation

## API Endpoints

### Public

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `GET /api/categories/slug/:slug` - Get category by slug

### Admin Only

- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

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
PORT=4004
MONGODB_URI=mongodb://localhost:27017/ecommerce_categories
JWT_SECRET=your-jwt-secret
```

## Port

- Development: `4004`

## API Documentation

Swagger UI available at: `http://localhost:4004/api-docs`

## Dependencies on Shared Packages

- `3a-ecommerce-utils` - Shared utilities and Logger
