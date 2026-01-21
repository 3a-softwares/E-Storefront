# Node.js

## Overview

**Version:** 20.x LTS  
**Website:** [https://nodejs.org](https://nodejs.org)  
**Category:** JavaScript Runtime

Node.js is a JavaScript runtime built on Chrome's V8 engine that enables server-side JavaScript execution.

---

## Why Node.js?

### Benefits

| Benefit                   | Description                                  |
| ------------------------- | -------------------------------------------- |
| **JavaScript Everywhere** | Same language for frontend and backend       |
| **Non-blocking I/O**      | Handles concurrent requests efficiently      |
| **NPM Ecosystem**         | World's largest package registry             |
| **Event-driven**          | Perfect for real-time applications           |
| **Fast Execution**        | V8 engine compiles JS to native machine code |
| **Microservices Ready**   | Lightweight and perfect for microservices    |

### Why We Chose Node.js

1. **Full-Stack JavaScript** - Unified language across frontend and backend
2. **Performance** - Excellent for I/O-heavy operations like API servers
3. **Real-time Support** - Native support for WebSockets and streaming
4. **Team Expertise** - Leveraging existing JavaScript/TypeScript skills
5. **Ecosystem** - Rich ecosystem for e-commerce (payment, email, etc.)

---

## How to Use Node.js

### Project Setup

```bash
# Check Node.js version
node --version  # Should be v20.x

# Initialize project
npm init -y

# Install TypeScript
npm install typescript @types/node ts-node -D

# Create tsconfig.json
npx tsc --init
```

### Service Structure

```
services/auth-service/
├── src/
│   ├── index.ts          # Entry point
│   ├── controllers/      # Request handlers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   ├── services/         # Business logic
│   └── utils/            # Utilities
├── tests/                # Test files
├── package.json
└── tsconfig.json
```

### Entry Point Example

```typescript
// src/index.ts
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { authRoutes } from './routes/authRoutes';

const app = express();
const PORT = process.env.PORT || 3011;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'auth-service' });
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(console.error);
```

### Scripts Configuration

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest",
    "lint": "eslint src"
  }
}
```

---

## How Node.js Helps Our Project

### Microservices Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Node.js Microservices                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Auth        │  │ Product     │  │ Order       │         │
│  │ Service     │  │ Service     │  │ Service     │         │
│  │ :3011       │  │ :3012       │  │ :3013       │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Category    │  │ Coupon      │  │ Ticket      │         │
│  │ Service     │  │ Service     │  │ Service     │         │
│  │ :3014       │  │ :3015       │  │ :3016       │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                              │
│  ┌────────────────────────────────────────────────┐        │
│  │            GraphQL Gateway :3000                │        │
│  └────────────────────────────────────────────────┘        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Key Use Cases

| Use Case          | Implementation                         |
| ----------------- | -------------------------------------- |
| REST APIs         | Express routes for each microservice   |
| GraphQL Gateway   | Apollo Server aggregating all services |
| Real-time Updates | Socket.IO for live notifications       |
| Background Jobs   | Node worker threads for processing     |
| File Uploads      | Multer middleware for handling files   |

### Environment Configuration

```bash
# .env
NODE_ENV=development
PORT=3011
MONGODB_URI=mongodb://localhost:27017/auth
JWT_SECRET=your-secret-key
REDIS_URL=redis://localhost:6379
```

---

## Best Practices

### Error Handling

```typescript
// Async error wrapper
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});
```

### Graceful Shutdown

```typescript
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down...');
  await mongoose.connection.close();
  process.exit(0);
});
```

### Security

```typescript
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests
  })
);
```

---

## Related Documentation

- [EXPRESS.md](EXPRESS.md) - Express.js framework
- [TYPESCRIPT.md](TYPESCRIPT.md) - TypeScript configuration
- [MONGODB.md](MONGODB.md) - Database integration
