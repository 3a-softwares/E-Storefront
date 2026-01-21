# Socket.IO

**Version:** 4.6  
**Category:** Real-Time Communication

---

## Server Setup

```typescript
// services/graphql-gateway/src/socket.ts
import { Server } from 'socket.io';
import http from 'http';
import { verifyToken } from './utils/auth';

export function initSocketIO(httpServer: http.Server) {
  const io = new Server(httpServer, {
    cors: { origin: process.env.CORS_ORIGINS?.split(','), credentials: true },
    transports: ['websocket', 'polling'],
  });

  // Auth middleware
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication required'));

    const user = await verifyToken(token);
    if (!user) return next(new Error('Invalid token'));

    socket.data.user = user;
    next();
  });

  io.on('connection', (socket) => {
    const { user } = socket.data;
    socket.join(`user:${user.id}`);
    if (user.role === 'seller') socket.join(`seller:${user.id}`);

    socket.on('disconnect', () => console.log(`User ${user.id} disconnected`));
  });

  return io;
}
```

---

## Event Emitters

```typescript
// services/socket/emitters.ts
import { io } from './socket';

export const socketEmitters = {
  // Order status update
  orderStatusUpdate(userId: string, order: { id: string; status: string; orderNumber: string }) {
    io.to(`user:${userId}`).emit('order:status', order);
  },

  // New order for seller
  newOrderForSeller(sellerId: string, order: any) {
    io.to(`seller:${sellerId}`).emit('order:new', order);
  },

  // Low stock alert
  lowStockAlert(sellerId: string, product: { id: string; name: string; stock: number }) {
    io.to(`seller:${sellerId}`).emit('inventory:low-stock', product);
  },

  // Notification
  sendNotification(userId: string, notification: { title: string; message: string; type: string }) {
    io.to(`user:${userId}`).emit('notification', notification);
  },
};
```

---

## Order Service Integration

```typescript
// services/order-service/src/controllers/orderController.ts
import { socketEmitters } from '../socket/emitters';

export const updateOrderStatus = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true }).populate(
    'user seller'
  );

  // Emit to customer
  socketEmitters.orderStatusUpdate(order.user._id.toString(), {
    id: order._id.toString(),
    orderNumber: order.orderNumber,
    status: order.status,
  });

  // Emit to seller
  socketEmitters.newOrderForSeller(order.seller._id.toString(), order);

  res.json(order);
};
```

---

## Client Setup (React)

```typescript
// lib/socket.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initSocket = (token: string) => {
  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
    auth: { token },
    transports: ['websocket'],
  });

  socket.on('connect', () => console.log('Socket connected'));
  socket.on('disconnect', () => console.log('Socket disconnected'));

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};
```

### React Hook

```tsx
// hooks/useSocket.ts
import { useEffect } from 'react';
import { getSocket, initSocket } from '@/lib/socket';
import { useAuthStore } from '@/store/authStore';

export function useSocket() {
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (!token) return;
    initSocket(token);
    return () => disconnectSocket();
  }, [token]);

  return getSocket();
}

// hooks/useOrderUpdates.ts
export function useOrderUpdates(orderId: string, onUpdate: (order: any) => void) {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;
    socket.on('order:status', (order) => {
      if (order.id === orderId) onUpdate(order);
    });
    return () => {
      socket.off('order:status');
    };
  }, [socket, orderId, onUpdate]);
}
```

---

## Redis Pub/Sub Integration

```typescript
// For scaling across multiple server instances
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';

const pubClient = createClient({ url: process.env.REDIS_URL });
const subClient = pubClient.duplicate();

await Promise.all([pubClient.connect(), subClient.connect()]);
io.adapter(createAdapter(pubClient, subClient));
```

---

## Events Reference

| Event                 | Direction       | Payload                       |
| --------------------- | --------------- | ----------------------------- |
| `order:status`        | Server → Client | `{ id, orderNumber, status }` |
| `order:new`           | Server → Seller | Full order object             |
| `inventory:low-stock` | Server → Seller | `{ id, name, stock }`         |
| `notification`        | Server → Client | `{ title, message, type }`    |

---

## Related

- [REDIS.md](REDIS.md) - Pub/Sub for scaling
- [GRAPHQL.md](GRAPHQL.md) - Subscriptions alternative
