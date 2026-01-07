# Order Service

## Overview

Order management service handling order creation, payment processing, real-time updates, and order fulfillment tracking.

## Tech Stack

### Runtime & Framework

- **Node.js** - JavaScript runtime
- **Express 4** - Web framework
- **TypeScript 5** - Type-safe development

### Database

- **MongoDB 8** (via Mongoose) - NoSQL database

### Real-time

- **Socket.io** - Real-time order updates
- **WebSocket (ws)** - WebSocket support

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

- ✅ Order creation and management
- ✅ Order status tracking
- ✅ Payment integration
- ✅ Real-time order updates via WebSocket
- ✅ Order history for customers
- ✅ Seller order management
- ✅ Order fulfillment workflow
- ✅ Shipping address management
- ✅ Coupon application
- ✅ Order analytics
- ✅ Swagger API documentation

## API Endpoints

### Customer

- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders/:id/cancel` - Cancel order

### Seller

- `GET /api/orders/seller` - Get seller's orders
- `PUT /api/orders/:id/status` - Update order status
- `GET /api/orders/seller/stats` - Get seller statistics

### Admin

- `GET /api/orders/admin/all` - Get all orders
- `GET /api/orders/admin/stats` - Get platform statistics

### WebSocket Events

- `order:created` - New order notification
- `order:updated` - Order status change
- `order:cancelled` - Order cancellation

## Project Structure

```
src/
├── controllers/  # Route handlers
├── middleware/   # Auth & validation middleware
├── models/       # Mongoose models
├── routes/       # Express routes
├── services/     # Business logic
├── socket/       # WebSocket handlers
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
PORT=4003
MONGODB_URI=mongodb://localhost:27017/ecommerce_orders
JWT_SECRET=your-jwt-secret
SOCKET_CORS_ORIGIN=http://localhost:3000
```

## Port

- Development: `4003`
- WebSocket: Same port

## API Documentation

Swagger UI available at: `http://localhost:4003/api-docs`

## Dependencies on Shared Packages

- `3a-ecommerce-utils` - Shared utilities and Logger
