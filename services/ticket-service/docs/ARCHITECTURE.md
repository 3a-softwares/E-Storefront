# Ticket Service Architecture

## 📑 Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Service Structure](#service-structure)
- [Database Schema](#database-schema)
- [Ticket Workflow](#ticket-workflow)

## 🌐 Overview

Ticket Service manages customer support tickets and communication.

### Key Responsibilities

| Responsibility  | Description                  |
| --------------- | ---------------------------- |
| Ticket CRUD     | Create, read, update tickets |
| Messaging       | Ticket replies and comments  |
| Assignment      | Agent assignment             |
| Status Tracking | Ticket lifecycle             |
| Notifications   | Status updates               |

## 🛠️ Technology Stack

| Category  | Technology  |
| --------- | ----------- |
| Runtime   | Node.js 20  |
| Framework | Express.js  |
| Language  | TypeScript  |
| Database  | MongoDB 7.0 |
| Real-time | Socket.io   |

## 🏗️ Service Structure

```
services/ticket-service/
├── src/
│   ├── index.ts
│   ├── app.ts
│   ├── config/
│   ├── controllers/
│   │   └── ticketController.ts
│   ├── models/
│   │   ├── Ticket.ts
│   │   └── Message.ts
│   ├── routes/
│   ├── services/
│   │   └── ticketService.ts
│   ├── sockets/
│   │   └── ticketSocket.ts
│   └── utils/
├── tests/
└── package.json
```

## 💾 Database Schema

### Ticket Model

```typescript
// models/Ticket.ts
const TicketSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      unique: true,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    description: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
    category: {
      type: String,
      enum: ['order', 'product', 'payment', 'shipping', 'account', 'other'],
      required: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'waiting', 'resolved', 'closed'],
      default: 'open',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    messages: [
      {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: String,
        attachments: [String],
        isInternal: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    tags: [String],
    resolvedAt: Date,
    closedAt: Date,
  },
  {
    timestamps: true,
  }
);
```

## 📊 Ticket Workflow

### Status Transitions

```
┌────────┐     ┌─────────────┐     ┌─────────┐
│  Open  │────>│ In Progress │────>│ Waiting │
└────────┘     └─────────────┘     └────┬────┘
                      │                  │
                      ▼                  ▼
               ┌───────────┐      ┌───────────┐
               │ Resolved  │      │   Open    │
               └─────┬─────┘      └───────────┘
                     │
                     ▼
               ┌───────────┐
               │  Closed   │
               └───────────┘
```

### Priority SLA

| Priority | First Response | Resolution |
| -------- | -------------- | ---------- |
| Urgent   | 1 hour         | 4 hours    |
| High     | 4 hours        | 24 hours   |
| Medium   | 8 hours        | 48 hours   |
| Low      | 24 hours       | 72 hours   |

---

See also:

- [API.md](./API.md) - API endpoints
- [TESTING.md](./TESTING.md) - Testing guide
