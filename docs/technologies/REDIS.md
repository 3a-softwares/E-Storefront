# Redis

**Version:** 7.x  
**Category:** In-Memory Cache & Session Storage

---

## Connection

```typescript
// config/redis.ts
import Redis from 'ioredis';

export const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => (times > 3 ? null : Math.min(times * 200, 2000)),
});

redis.on('connect', () => console.log('Redis connected'));
redis.on('error', (err) => console.error('Redis error:', err));
```

---

## Cache Utilities

```typescript
// utils/cache.ts
export const cache = {
  async set(key: string, value: any, ttl?: number) {
    const data = JSON.stringify(value);
    ttl ? await redis.setex(key, ttl, data) : await redis.set(key, data);
  },

  async get<T>(key: string): Promise<T | null> {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  },

  async del(key: string) {
    await redis.del(key);
  },

  async delPattern(pattern: string) {
    const keys = await redis.keys(pattern);
    if (keys.length) await redis.del(...keys);
  },
};
```

---

## Product Caching

```typescript
// services/productService.ts
const TTL = 300; // 5 minutes

export async function getProducts(query: ProductQuery) {
  const cacheKey = `products:${JSON.stringify(query)}`;

  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  const products = await Product.find(query.filter)
    .sort(query.sort)
    .skip((query.page - 1) * query.limit)
    .limit(query.limit)
    .lean();

  const total = await Product.countDocuments(query.filter);
  const result = { products, page: query.page, totalPages: Math.ceil(total / query.limit), total };

  await cache.set(cacheKey, result, TTL);
  return result;
}

export async function invalidateProducts(productId?: string) {
  if (productId) await cache.del(`product:${productId}`);
  await cache.delPattern('products:*');
}
```

---

## Cache Middleware

```typescript
// middleware/cache.ts
export const cacheMiddleware = (ttl: number, keyFn?: (req: Request) => string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') return next();

    const key = keyFn ? keyFn(req) : `cache:${req.originalUrl}`;
    const cached = await cache.get(key);
    if (cached) return res.json(cached);

    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
      cache.set(key, body, ttl);
      return originalJson(body);
    };
    next();
  };
};

// Usage
router.get('/products', cacheMiddleware(300), productController.list);
```

---

## Rate Limiting

```typescript
// middleware/rateLimiter.ts
export const rateLimiter = (windowMs: number, max: number) => {
  const windowSec = Math.floor(windowMs / 1000);

  return async (req: Request, res: Response, next: NextFunction) => {
    const key = `ratelimit:${req.ip}`;
    const current = await redis.incr(key);
    if (current === 1) await redis.expire(key, windowSec);

    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - current));
    if (current > max) return res.status(429).json({ message: 'Too many requests' });
    next();
  };
};

// Usage
app.use('/api/auth/login', rateLimiter(15 * 60 * 1000, 5)); // 5 per 15 min
app.use('/api', rateLimiter(60 * 1000, 100)); // 100 per min
```

---

## Session Storage

```typescript
const SESSION_TTL = 24 * 60 * 60; // 24 hours

export const sessions = {
  async create(sessionId: string, data: { userId: string; role: string }) {
    await redis.setex(`session:${sessionId}`, SESSION_TTL, JSON.stringify(data));
    await redis.sadd(`user_sessions:${data.userId}`, sessionId);
  },

  async get(sessionId: string) {
    const data = await redis.get(`session:${sessionId}`);
    return data ? JSON.parse(data) : null;
  },

  async deleteAll(userId: string) {
    const ids = await redis.smembers(`user_sessions:${userId}`);
    if (ids.length) await redis.del(...ids.map((id) => `session:${id}`));
    await redis.del(`user_sessions:${userId}`);
  },
};
```

---

## Pub/Sub

```typescript
// services/pubsub.ts
const publisher = new Redis(process.env.REDIS_URL!);
const subscriber = new Redis(process.env.REDIS_URL!);

export const CHANNELS = {
  ORDER_STATUS: 'order:status',
  NEW_ORDER: 'order:new',
  LOW_STOCK: 'product:low-stock',
};

export const publish = (channel: string, data: any) =>
  publisher.publish(channel, JSON.stringify(data));

export const subscribe = (channel: string, callback: (data: any) => void) => {
  subscriber.subscribe(channel);
  subscriber.on('message', (ch, msg) => {
    if (ch === channel) callback(JSON.parse(msg));
  });
};
```

---

## Cache Key Patterns

```typescript
const KEYS = {
  product: (id: string) => `product:${id}`,
  products: (query: object) => `products:${JSON.stringify(query)}`,
  categories: () => 'categories:all',
  session: (id: string) => `session:${id}`,
  rateLimit: (ip: string) => `ratelimit:${ip}`,
};
```

---

## Related

- [MONGODB.md](MONGODB.md) - Primary database
- [SOCKETIO.md](SOCKETIO.md) - Real-time with Redis pub/sub
