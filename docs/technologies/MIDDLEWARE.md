# Middleware

## Overview

**Framework:** Express.js  
**Category:** Request Processing  
**Pattern:** Chain of Responsibility

Middleware functions have access to request and response objects, and the next middleware function in the request-response cycle.

---

## Why Middleware?

### Benefits

| Benefit             | Description                               |
| ------------------- | ----------------------------------------- |
| **Modularity**      | Separate concerns into reusable functions |
| **Reusability**     | Apply same logic across routes            |
| **Composability**   | Chain multiple operations                 |
| **Maintainability** | Easier to test and modify                 |
| **Cross-Cutting**   | Handle logging, auth, errors globally     |

### Why We Use Middleware

1. **Authentication** - Verify JWT tokens
2. **Authorization** - Check user permissions
3. **Validation** - Validate request data
4. **Logging** - Request/response logging
5. **Error Handling** - Centralized error handling

---

## Middleware Types

```
┌─────────────────────────────────────────────────────────────┐
│                   Middleware Pipeline                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   Request                                                    │
│      │                                                       │
│      ▼                                                       │
│  ┌──────────────┐                                           │
│  │    CORS      │  1. Cross-origin handling                 │
│  └──────┬───────┘                                           │
│         ▼                                                    │
│  ┌──────────────┐                                           │
│  │   Logging    │  2. Request logging                       │
│  └──────┬───────┘                                           │
│         ▼                                                    │
│  ┌──────────────┐                                           │
│  │  Body Parser │  3. Parse JSON/form data                  │
│  └──────┬───────┘                                           │
│         ▼                                                    │
│  ┌──────────────┐                                           │
│  │    Auth      │  4. Verify JWT token                      │
│  └──────┬───────┘                                           │
│         ▼                                                    │
│  ┌──────────────┐                                           │
│  │  Validation  │  5. Validate request data                 │
│  └──────┬───────┘                                           │
│         ▼                                                    │
│  ┌──────────────┐                                           │
│  │   Handler    │  6. Route handler                         │
│  └──────┬───────┘                                           │
│         ▼                                                    │
│  ┌──────────────┐                                           │
│  │Error Handler │  7. Handle errors                         │
│  └──────┬───────┘                                           │
│         ▼                                                    │
│   Response                                                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Authentication Middleware

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

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      role: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Optional auth (doesn't fail if no token)
export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      req.user = decoded as AuthRequest['user'];
    }
  } catch {
    // Ignore token errors for optional auth
  }

  next();
}
```

## Authorization Middleware

```typescript
// middleware/authorize.ts
import { Request, Response, NextFunction } from 'express';

type Role = 'admin' | 'seller' | 'customer';

export function authorize(allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
}

// Usage
router.delete(
  '/products/:id',
  authenticate,
  authorize(['admin', 'seller']),
  productController.delete
);
```

---

## Validation Middleware

```typescript
// middleware/validate.ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        });
      }
      next(error);
    }
  };
}

// Schema definition
import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    price: z.number().positive('Price must be positive'),
    description: z.string().optional(),
    category: z.string().min(1, 'Category is required'),
  }),
});

// Usage
router.post('/products', authenticate, validate(createProductSchema), productController.create);
```

---

## Logging Middleware

```typescript
// middleware/logging.ts
import { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        method: req.method,
        path: req.path,
        status: res.statusCode,
        duration: `${duration}ms`,
        userAgent: req.headers['user-agent'],
        ip: req.ip,
        userId: (req as any).user?.id,
      })
    );
  });

  next();
}
```

---

## Error Handling Middleware

```typescript
// middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error('Error:', err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code || 'ERROR',
        message: err.message,
      },
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: err.message,
      },
    });
  }

  // MongoDB duplicate key
  if ((err as any).code === 11000) {
    return res.status(409).json({
      error: {
        code: 'DUPLICATE_ERROR',
        message: 'Resource already exists',
      },
    });
  }

  // Default error
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    },
  });
}

// Usage in controller
throw new AppError(404, 'Product not found', 'PRODUCT_NOT_FOUND');
```

---

## Rate Limiting Middleware

```typescript
// middleware/rateLimit.ts
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

const redisClient = new Redis(process.env.REDIS_URL);

export const apiLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.call(...args),
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limit for auth routes
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 failed attempts
  message: {
    error: {
      code: 'AUTH_RATE_LIMIT',
      message: 'Too many login attempts',
    },
  },
});
```

---

## Applying Middleware

```typescript
// app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { requestLogger } from './middleware/logging';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimit';

const app = express();

// Global middleware (order matters!)
app.use(helmet()); // Security headers
app.use(cors()); // CORS
app.use(requestLogger); // Logging
app.use(express.json({ limit: '10kb' })); // Body parser with size limit
app.use(apiLimiter); // Rate limiting

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;
```

---

## Best Practices

1. **Order Matters** - Apply middleware in correct order
2. **Early Exit** - Return after sending response
3. **Call next()** - Always call next or send response
4. **Error Handling** - Pass errors to next(error)
5. **Keep Focused** - One responsibility per middleware
6. **Type Safety** - Extend Request type for custom properties

---

## Related Documentation

- [EXPRESS.md](EXPRESS.md) - Express.js framework
- [JWT.md](JWT.md) - Token authentication
- [CORS.md](CORS.md) - CORS configuration
