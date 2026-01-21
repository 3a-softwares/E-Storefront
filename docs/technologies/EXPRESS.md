# Express.js

## Overview

**Version:** 4.18  
**Website:** [https://expressjs.com](https://expressjs.com)  
**Category:** Web Framework

Express is a minimal and flexible Node.js web application framework that provides a robust set of features for building web and mobile applications.

---

## Why Express?

### Benefits

| Benefit                | Description                                    |
| ---------------------- | ---------------------------------------------- |
| **Minimal & Flexible** | Unopinionated, gives freedom to structure apps |
| **Middleware System**  | Powerful request/response pipeline             |
| **Large Ecosystem**    | Thousands of middleware packages               |
| **Performance**        | Fast, efficient handling of HTTP requests      |
| **Easy to Learn**      | Simple API, quick to get started               |
| **Industry Standard**  | Most popular Node.js web framework             |

### Why We Chose Express

1. **Microservices Architecture** - Perfect for building lightweight REST APIs
2. **Flexibility** - Structure services according to domain needs
3. **Middleware** - Easy integration of auth, validation, logging
4. **TypeScript Support** - Great typing with @types/express
5. **Apollo Integration** - Works seamlessly with Apollo Server
6. **Team Familiarity** - Widely known, easy onboarding

---

## How to Use Express

### Basic Server Setup

```typescript
// src/index.ts
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app: Express = express();
const PORT = process.env.PORT || 4001;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // CORS handling
app.use(morgan('combined')); // Request logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Routing

```typescript
// routes/productRoutes.ts
import { Router } from 'express';
import * as productController from '../controllers/productController';
import { authenticate } from '../middleware/auth';
import { validateProduct } from '../middleware/validation';

const router = Router();

// Public routes
router.get('/', productController.getAllProducts);
router.get('/search', productController.searchProducts);
router.get('/:id', productController.getProductById);

// Protected routes (require authentication)
router.post('/', authenticate, validateProduct, productController.createProduct);
router.put('/:id', authenticate, validateProduct, productController.updateProduct);
router.delete('/:id', authenticate, productController.deleteProduct);

export default router;

// Register routes in app
import productRoutes from './routes/productRoutes';
app.use('/api/products', productRoutes);
```

### Controllers

```typescript
// controllers/productController.ts
import { Request, Response, NextFunction } from 'express';
import { Product } from '../models/Product';

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, category, sort } = req.query;

    const query: any = {};
    if (category) query.category = category;

    const products = await Product.find(query)
      .sort((sort as string) || '-createdAt')
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .populate('category');

    const total = await Product.countDocuments(query);

    res.json({
      products,
      page: +page,
      totalPages: Math.ceil(total / +limit),
      total,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};
```

### Middleware

```typescript
// middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};

// middleware/validation.ts
import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateProduct = [
  body('name').notEmpty().withMessage('Name is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('description').optional().isLength({ max: 1000 }),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
```

### Error Handling

```typescript
// middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log error
  console.error(`[Error] ${statusCode} - ${message}`, {
    path: req.path,
    method: req.method,
    stack: err.stack,
  });

  // Send response
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// middleware/notFound.ts
export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};

// Register in app
app.use(notFound);
app.use(errorHandler);
```

---

## How Express Helps Our Project

### 1. Microservices Architecture

```typescript
// Each service is a standalone Express app
// services/auth-service/src/index.ts
const app = express();
app.use('/api/auth', authRoutes);
app.listen(4001);

// services/product-service/src/index.ts
const app = express();
app.use('/api/products', productRoutes);
app.listen(4005);

// services/order-service/src/index.ts
const app = express();
app.use('/api/orders', orderRoutes);
app.listen(4004);
```

### 2. GraphQL Gateway Integration

```typescript
// services/graphql-gateway/src/index.ts
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

await server.start();

app.use(
  '/graphql',
  cors(),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => ({
      token: req.headers.authorization,
    }),
  })
);

app.listen(4000);
```

### 3. Service-Specific Middleware

```typescript
// Auth Service - Rate limiting for security
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts, please try again later',
});

app.use('/api/auth/login', authLimiter);

// Product Service - Response caching
import { cacheMiddleware } from './middleware/cache';

app.get('/api/products', cacheMiddleware('products', 300), getAllProducts);

// Order Service - WebSocket integration
import { createServer } from 'http';
import { Server } from 'socket.io';

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });
```

### 4. Swagger Documentation

```typescript
// swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Product Service API',
      version: '1.0.0',
      description: 'Product management microservice',
    },
    servers: [{ url: 'http://localhost:4005' }],
  },
  apis: ['./src/routes/*.ts'],
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
```

---

## Service Architecture

### Request Flow

```
Client Request
    ↓
Express App
    ↓
Middleware Stack (helmet, cors, morgan, json)
    ↓
Route Handler
    ↓
Controller
    ↓
Service Layer (Business Logic)
    ↓
Database (MongoDB via Mongoose)
    ↓
Response
```

### Service Ports

| Service          | Port | Endpoint Prefix   |
| ---------------- | ---- | ----------------- |
| Auth Service     | 4001 | `/api/auth`       |
| Category Service | 4002 | `/api/categories` |
| Coupon Service   | 4003 | `/api/coupons`    |
| Order Service    | 4004 | `/api/orders`     |
| Product Service  | 4005 | `/api/products`   |
| Ticket Service   | 4006 | `/api/tickets`    |
| GraphQL Gateway  | 4000 | `/graphql`        |

---

## Best Practices

### Project Structure

```
src/
├── controllers/       # Request handlers
├── routes/           # Route definitions
├── middleware/       # Custom middleware
├── models/           # Database models
├── services/         # Business logic
├── utils/            # Utility functions
├── config/           # Configuration
├── types/            # TypeScript types
└── index.ts          # Entry point
```

### Environment Configuration

```typescript
// config/index.ts
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 4001,
  mongoUri: process.env.MONGODB_URI!,
  jwtSecret: process.env.JWT_SECRET!,
  nodeEnv: process.env.NODE_ENV || 'development',
  redis: {
    url: process.env.REDIS_URL,
  },
};
```

---

## Related Documentation

- [MongoDB](./MONGODB.md) - Database integration
- [JWT](./JWT.md) - Authentication tokens
- [GraphQL](./GRAPHQL.md) - Apollo Server integration
- [Socket.IO](./SOCKETIO.md) - Real-time features
- [Redis](./REDIS.md) - Caching layer
