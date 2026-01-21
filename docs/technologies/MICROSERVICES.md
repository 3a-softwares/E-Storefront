# Microservices Architecture

## Overview

**Category:** Backend Architecture  
**Services:** 7 Microservices  
**Communication:** GraphQL Federation, REST, WebSockets

Microservices architecture structures an application as a collection of loosely coupled, independently deployable services.

---

## Why Microservices?

### Benefits

| Benefit                | Description                               |
| ---------------------- | ----------------------------------------- |
| **Independent Deploy** | Deploy services without affecting others  |
| **Technology Freedom** | Each service can use best-fit technology  |
| **Scalability**        | Scale individual services based on demand |
| **Fault Isolation**    | Failures don't cascade to entire system   |
| **Team Autonomy**      | Teams own services end-to-end             |
| **Maintainability**    | Smaller, focused codebases                |

### Why We Chose Microservices

1. **E-commerce Domains** - Natural separation (auth, products, orders)
2. **Scalability** - Scale order service during sales events
3. **Team Structure** - Different teams for different services
4. **Technology Fit** - Right tool for each service
5. **Resilience** - One service down doesn't break everything

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      E-Storefront Microservices                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      API Gateway                                 │   │
│  │                  (GraphQL Federation)                            │   │
│  │                     Port: 3000                                   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                   │                                     │
│         ┌────────────┬────────────┼────────────┬────────────┐          │
│         ▼            ▼            ▼            ▼            ▼          │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐│
│  │   Auth    │ │  Product  │ │   Order   │ │ Category  │ │  Coupon   ││
│  │  Service  │ │  Service  │ │  Service  │ │  Service  │ │  Service  ││
│  │  :3011    │ │   :3012   │ │   :3013   │ │   :3014   │ │   :3015   ││
│  └─────┬─────┘ └─────┬─────┘ └─────┬─────┘ └─────┬─────┘ └─────┬─────┘│
│        │             │             │             │             │       │
│        └─────────────┴─────────────┴─────────────┴─────────────┘       │
│                                   │                                     │
│                         ┌─────────┴─────────┐                          │
│                         │                   │                          │
│                    ┌────▼────┐        ┌─────▼────┐                     │
│                    │ MongoDB │        │  Redis   │                     │
│                    │ :27017  │        │  :6379   │                     │
│                    └─────────┘        └──────────┘                     │
│                                                                          │
│  ┌───────────┐                                                          │
│  │  Ticket   │   (Support tickets, separate concerns)                  │
│  │  Service  │                                                          │
│  │  :3016    │                                                          │
│  └───────────┘                                                          │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Service Structure

### Standard Service Layout

```
services/[service-name]/
├── src/
│   ├── index.ts           # Entry point
│   ├── config/
│   │   └── index.ts       # Environment config
│   ├── models/
│   │   └── [Model].ts     # Mongoose models
│   ├── resolvers/
│   │   └── index.ts       # GraphQL resolvers
│   ├── schema/
│   │   └── index.ts       # GraphQL type definitions
│   ├── services/
│   │   └── [Service].ts   # Business logic
│   ├── middleware/
│   │   └── auth.ts        # Auth middleware
│   └── utils/
│       └── helpers.ts     # Utility functions
├── tests/
│   ├── unit/
│   └── integration/
├── package.json
├── tsconfig.json
└── Dockerfile
```

### Service Template

```typescript
// services/product-service/src/index.ts
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { buildSubgraphSchema } from '@apollo/subgraph';
import mongoose from 'mongoose';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { config } from './config';

async function startServer() {
  const app = express();

  // Connect to MongoDB
  await mongoose.connect(config.mongoUri);
  console.log('Connected to MongoDB');

  // Create Apollo Server (Subgraph)
  const server = new ApolloServer({
    schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
  });

  await server.start();

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'product-service' });
  });

  // GraphQL endpoint
  app.use(
    '/graphql',
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({
        user: req.headers['x-user'] ? JSON.parse(req.headers['x-user']) : null,
      }),
    })
  );

  app.listen(config.port, () => {
    console.log(`Product service running on port ${config.port}`);
  });
}

startServer();
```

---

## Service Communication

### GraphQL Federation

```typescript
// services/graphql-gateway/src/index.ts
import { ApolloServer } from '@apollo/server';
import { ApolloGateway, IntrospectAndCompose } from '@apollo/gateway';

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: 'auth', url: 'http://auth-service:3011/graphql' },
      { name: 'product', url: 'http://product-service:3012/graphql' },
      { name: 'order', url: 'http://order-service:3013/graphql' },
      { name: 'category', url: 'http://category-service:3014/graphql' },
      { name: 'coupon', url: 'http://coupon-service:3015/graphql' },
    ],
  }),
});

const server = new ApolloServer({ gateway });
```

### Inter-Service HTTP

```typescript
// services/order-service/src/services/ProductClient.ts
import axios from 'axios';

class ProductClient {
  private baseUrl = process.env.PRODUCT_SERVICE_URL || 'http://product-service:3012';

  async getProduct(id: string): Promise<Product> {
    const response = await axios.get(`${this.baseUrl}/api/products/${id}`);
    return response.data;
  }

  async updateStock(id: string, quantity: number): Promise<void> {
    await axios.patch(`${this.baseUrl}/api/products/${id}/stock`, { quantity });
  }
}

export const productClient = new ProductClient();
```

### Event-Driven (Redis Pub/Sub)

```typescript
// services/order-service/src/events/publisher.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export async function publishEvent(channel: string, data: any) {
  await redis.publish(channel, JSON.stringify(data));
}

// When order is created
await publishEvent('order:created', {
  orderId: order._id,
  userId: order.userId,
  products: order.products,
});

// services/product-service/src/events/subscriber.ts
const subscriber = new Redis(process.env.REDIS_URL);

subscriber.subscribe('order:created');

subscriber.on('message', async (channel, message) => {
  if (channel === 'order:created') {
    const order = JSON.parse(message);
    // Update product stock
    for (const item of order.products) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }
  }
});
```

---

## Service Discovery

### Docker Compose (Development)

```yaml
# docker-compose.yml
services:
  auth-service:
    build: ./services/auth-service
    ports:
      - '3011:3011'
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/auth
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mongodb
      - redis

  product-service:
    build: ./services/product-service
    ports:
      - '3012:3012'
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/products
      - AUTH_SERVICE_URL=http://auth-service:3011
```

### Kubernetes (Production)

```yaml
# k8s/services/product-service/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: product-service
  namespace: e-storefront
spec:
  selector:
    app: product-service
  ports:
    - port: 3012
      targetPort: 3012
  type: ClusterIP

# Access via: http://product-service:3012
```

---

## Data Management

### Database per Service

| Service  | Database    | Collections          |
| -------- | ----------- | -------------------- |
| auth     | auth_db     | users, sessions      |
| product  | product_db  | products, reviews    |
| order    | order_db    | orders, order_items  |
| category | category_db | categories           |
| coupon   | coupon_db   | coupons, redemptions |
| ticket   | ticket_db   | tickets, messages    |

### Saga Pattern (Distributed Transactions)

```typescript
// services/order-service/src/sagas/createOrderSaga.ts
async function createOrderSaga(orderData: CreateOrderInput) {
  const saga = new Saga();

  try {
    // Step 1: Reserve products
    const reservation = await productClient.reserveProducts(orderData.products);
    saga.addCompensation(() => productClient.releaseReservation(reservation.id));

    // Step 2: Process payment
    const payment = await paymentClient.charge(orderData.userId, orderData.total);
    saga.addCompensation(() => paymentClient.refund(payment.id));

    // Step 3: Create order
    const order = await Order.create({ ...orderData, status: 'confirmed' });
    saga.addCompensation(() => Order.findByIdAndDelete(order._id));

    // Step 4: Confirm reservation (deduct stock)
    await productClient.confirmReservation(reservation.id);

    return order;
  } catch (error) {
    await saga.rollback();
    throw error;
  }
}
```

---

## Best Practices

1. **Single Responsibility** - One service, one business domain
2. **API Gateway** - Single entry point for clients
3. **Health Checks** - `/health` endpoint on every service
4. **Circuit Breaker** - Prevent cascade failures
5. **Centralized Logging** - Aggregate logs from all services
6. **Distributed Tracing** - Track requests across services
7. **API Versioning** - Support backward compatibility

---

## Related Documentation

- [GRAPHQL.md](GRAPHQL.md) - API Gateway
- [DOCKER.md](DOCKER.md) - Containerization
- [KUBERNETES.md](KUBERNETES.md) - Orchestration
- [REDIS.md](REDIS.md) - Pub/Sub messaging
