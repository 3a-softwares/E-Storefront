# CORS (Cross-Origin Resource Sharing)

## Overview

**Category:** Security  
**Scope:** All APIs  
**Purpose:** Control cross-origin HTTP requests

CORS is a security mechanism that allows servers to specify which origins can access their resources.

---

## Why CORS?

### Benefits

| Benefit         | Description                                 |
| --------------- | ------------------------------------------- |
| **Security**    | Prevents unauthorized cross-origin requests |
| **Flexibility** | Allow specific origins to access API        |
| **Control**     | Fine-grained access control                 |
| **Standard**    | Browser-enforced security                   |

### Why We Configure CORS

1. **Frontend Access** - Web app needs to call API
2. **Multi-Origin** - Multiple apps accessing same API
3. **Security** - Block unauthorized origins
4. **Credentials** - Support authenticated requests
5. **Methods** - Control allowed HTTP methods

---

## How CORS Works

```
┌─────────────────────────────────────────────────────────────┐
│                    CORS Flow                                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Browser (example.com)           API Server (api.com)        │
│  ┌──────────────────┐           ┌──────────────────┐        │
│  │                  │           │                  │        │
│  │  1. Preflight    │           │                  │        │
│  │  OPTIONS /api    │──────────▶│                  │        │
│  │                  │           │                  │        │
│  │  2. CORS Headers │◀──────────│                  │        │
│  │  (Allowed)       │           │                  │        │
│  │                  │           │                  │        │
│  │  3. Actual       │           │                  │        │
│  │  POST /api       │──────────▶│                  │        │
│  │                  │           │                  │        │
│  │  4. Response     │◀──────────│                  │        │
│  │                  │           │                  │        │
│  └──────────────────┘           └──────────────────┘        │
│                                                              │
│  CORS Headers:                                               │
│  ├── Access-Control-Allow-Origin: https://example.com       │
│  ├── Access-Control-Allow-Methods: GET, POST, PUT, DELETE   │
│  ├── Access-Control-Allow-Headers: Content-Type, Auth...    │
│  └── Access-Control-Allow-Credentials: true                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation

### Express CORS Middleware

```typescript
// services/graphql-gateway/src/middleware/cors.ts
import cors from 'cors';

const allowedOrigins = [
  process.env.WEB_APP_URL, // https://www.3asoftwares.com
  process.env.ADMIN_APP_URL, // https://admin.3asoftwares.com
  process.env.SELLER_APP_URL, // https://seller.3asoftwares.com
  'http://localhost:3000', // Local development
  'http://localhost:3001',
  'http://localhost:3002',
];

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['X-Total-Count', 'X-Page', 'X-Per-Page'],
  maxAge: 86400, // 24 hours
});
```

### Apply to Express App

```typescript
// services/graphql-gateway/src/index.ts
import express from 'express';
import { corsMiddleware } from './middleware/cors';

const app = express();

// Apply CORS before other middleware
app.use(corsMiddleware);

// Handle preflight requests
app.options('*', corsMiddleware);

// Routes
app.use('/graphql', graphqlHandler);
```

### Dynamic Origins

```typescript
// Dynamic origin based on environment
const getCorsOrigins = (): string[] => {
  const origins: string[] = [];

  if (process.env.NODE_ENV === 'development') {
    origins.push(
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:4000'
    );
  }

  if (process.env.NODE_ENV === 'production') {
    origins.push(
      'https://www.3asoftwares.com',
      'https://admin.3asoftwares.com',
      'https://seller.3asoftwares.com'
    );
  }

  return origins;
};
```

---

## Next.js API Routes

### next.config.ts

```typescript
// next.config.ts
export default {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.ALLOWED_ORIGIN || '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
};
```

### API Route Handler

```typescript
// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}

export async function GET(request: NextRequest) {
  const response = NextResponse.json({ products: [] });

  response.headers.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');

  return response;
}
```

---

## Common CORS Headers

| Header                             | Purpose                   |
| ---------------------------------- | ------------------------- |
| `Access-Control-Allow-Origin`      | Allowed origins           |
| `Access-Control-Allow-Methods`     | Allowed HTTP methods      |
| `Access-Control-Allow-Headers`     | Allowed request headers   |
| `Access-Control-Allow-Credentials` | Allow cookies/auth        |
| `Access-Control-Expose-Headers`    | Headers client can access |
| `Access-Control-Max-Age`           | Preflight cache duration  |

---

## Troubleshooting

### Common Errors

```typescript
// Error: Origin not allowed
// Solution: Add origin to allowedOrigins

// Error: Credentials not working
// Solution: Set credentials: true and specific origin (not *)

// Error: Custom headers blocked
// Solution: Add headers to allowedHeaders

// Error: Method not allowed
// Solution: Add method to allowed methods
```

### Debug CORS Issues

```typescript
// Add logging
app.use((req, res, next) => {
  console.log('CORS Request:', {
    origin: req.headers.origin,
    method: req.method,
    path: req.path,
  });
  next();
});
```

---

## Security Considerations

1. **Never Use `*` with Credentials** - Specify exact origins
2. **Validate Origins** - Check against whitelist
3. **Limit Methods** - Only allow needed methods
4. **Limit Headers** - Only allow needed headers
5. **Short Max-Age** - Don't cache preflight too long

---

## Best Practices

```typescript
// Production CORS config
export const productionCors = cors({
  origin: (origin, callback) => {
    // Strict origin validation
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`Blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 600, // 10 minutes
});
```

---

## Related Documentation

- [MIDDLEWARE.md](MIDDLEWARE.md) - Express middleware
- [OAUTH.md](OAUTH.md) - OAuth authentication
- [JWT.md](JWT.md) - Token authentication
