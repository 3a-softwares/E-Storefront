# Design Patterns

## Overview

**Category:** Software Architecture  
**Scope:** All Projects  
**Purpose:** Reusable solutions for common programming problems

Design patterns are proven solutions to recurring software design problems that improve code maintainability, scalability, and readability.

---

## Why Design Patterns?

### Benefits

| Benefit              | Description                                        |
| -------------------- | -------------------------------------------------- |
| **Reusability**      | Proven solutions applied across projects           |
| **Maintainability**  | Code is easier to understand and modify            |
| **Scalability**      | Patterns support growth and complexity             |
| **Communication**    | Common vocabulary among developers                 |
| **Best Practices**   | Encapsulate industry-standard approaches           |

### Why We Use Design Patterns

1. **Consistency** - Same patterns across all services
2. **Onboarding** - New developers understand code faster
3. **Testability** - Patterns like DI make testing easier
4. **Flexibility** - Easy to extend without breaking code
5. **Quality** - Reduces bugs through proven solutions

---

## MVC Pattern

### Model-View-Controller

Separates application into three interconnected components.

```
┌─────────────────────────────────────────────────────────────┐
│                      MVC Architecture                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐    Updates    ┌─────────────┐             │
│  │             │ ───────────▶  │             │             │
│  │    Model    │               │    View     │             │
│  │   (Data)    │  ◀───────────  │    (UI)     │             │
│  │             │    Notifies   │             │             │
│  └──────┬──────┘               └──────┬──────┘             │
│         │                             │                     │
│         │         ┌─────────────┐     │                     │
│         └────────▶│ Controller  │◀────┘                     │
│                   │  (Logic)    │                           │
│                   └─────────────┘                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Implementation (Support Portal)

```javascript
// js/models/TicketModel.js
class TicketModel {
  constructor() {
    this.tickets = [];
    this.observers = [];
  }

  addTicket(ticket) {
    this.tickets.push(ticket);
    this.notify();
  }

  getTickets() {
    return this.tickets;
  }

  subscribe(observer) {
    this.observers.push(observer);
  }

  notify() {
    this.observers.forEach(observer => observer.update(this.tickets));
  }
}

// js/views/TicketView.js
class TicketView {
  constructor(container) {
    this.container = document.querySelector(container);
  }

  render(tickets) {
    this.container.innerHTML = tickets.map(ticket => `
      <div class="card mb-3">
        <div class="card-body">
          <h5>${ticket.subject}</h5>
          <span class="badge bg-${ticket.status === 'open' ? 'success' : 'secondary'}">
            ${ticket.status}
          </span>
        </div>
      </div>
    `).join('');
  }

  update(tickets) {
    this.render(tickets);
  }
}

// js/controllers/TicketController.js
class TicketController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.model.subscribe(this.view);
  }

  createTicket(subject, message) {
    const ticket = {
      id: Date.now(),
      subject,
      message,
      status: 'open',
      createdAt: new Date()
    };
    this.model.addTicket(ticket);
  }
}
```

---

## Factory Pattern

### Creates objects without specifying exact class

```typescript
// services/auth-service/src/factories/UserFactory.ts
interface User {
  id: string;
  email: string;
  role: string;
  permissions: string[];
}

interface UserFactory {
  create(data: Partial<User>): User;
}

class CustomerFactory implements UserFactory {
  create(data: Partial<User>): User {
    return {
      id: data.id || crypto.randomUUID(),
      email: data.email!,
      role: 'customer',
      permissions: ['read:products', 'create:orders', 'read:orders']
    };
  }
}

class SellerFactory implements UserFactory {
  create(data: Partial<User>): User {
    return {
      id: data.id || crypto.randomUUID(),
      email: data.email!,
      role: 'seller',
      permissions: ['read:products', 'write:products', 'read:orders', 'update:orders']
    };
  }
}

class AdminFactory implements UserFactory {
  create(data: Partial<User>): User {
    return {
      id: data.id || crypto.randomUUID(),
      email: data.email!,
      role: 'admin',
      permissions: ['*'] // Full access
    };
  }
}

// Factory selector
function getUserFactory(role: string): UserFactory {
  switch (role) {
    case 'seller':
      return new SellerFactory();
    case 'admin':
      return new AdminFactory();
    default:
      return new CustomerFactory();
  }
}

// Usage
const factory = getUserFactory('seller');
const seller = factory.create({ email: 'seller@example.com' });
```

---

## Singleton Pattern

### Ensures single instance throughout application

```typescript
// packages/utils/src/logger.ts
class Logger {
  private static instance: Logger;
  private logs: string[] = [];

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  log(message: string, level: 'info' | 'warn' | 'error' = 'info') {
    const timestamp = new Date().toISOString();
    const entry = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    this.logs.push(entry);
    console.log(entry);
  }

  getLogs(): string[] {
    return [...this.logs];
  }
}

// Usage - same instance everywhere
const logger = Logger.getInstance();
logger.log('Application started');

// In another file
const sameLogger = Logger.getInstance();
sameLogger.log('Processing order'); // Same instance
```

### Database Connection Singleton

```typescript
// services/shared/database.ts
import mongoose from 'mongoose';

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private connection: typeof mongoose | null = null;

  private constructor() {}

  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  async connect(uri: string): Promise<typeof mongoose> {
    if (this.connection) {
      return this.connection;
    }

    this.connection = await mongoose.connect(uri);
    console.log('Database connected');
    return this.connection;
  }

  getConnection(): typeof mongoose | null {
    return this.connection;
  }
}

export const db = DatabaseConnection.getInstance();
```

---

## Observer Pattern

### Notify subscribers of state changes

```typescript
// store/observers.ts
interface Observer<T> {
  update(data: T): void;
}

class Subject<T> {
  private observers: Observer<T>[] = [];

  subscribe(observer: Observer<T>): () => void {
    this.observers.push(observer);
    return () => {
      this.observers = this.observers.filter(o => o !== observer);
    };
  }

  notify(data: T): void {
    this.observers.forEach(observer => observer.update(data));
  }
}

// Usage with Cart
class CartSubject extends Subject<CartItem[]> {
  private items: CartItem[] = [];

  addItem(item: CartItem) {
    this.items.push(item);
    this.notify(this.items);
  }

  removeItem(id: string) {
    this.items = this.items.filter(item => item.id !== id);
    this.notify(this.items);
  }
}
```

---

## Repository Pattern

### Abstracts data access logic

```typescript
// services/product-service/src/repositories/ProductRepository.ts
interface Repository<T> {
  findById(id: string): Promise<T | null>;
  findAll(filter?: Partial<T>): Promise<T[]>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

class ProductRepository implements Repository<Product> {
  constructor(private model: typeof ProductModel) {}

  async findById(id: string): Promise<Product | null> {
    return this.model.findById(id);
  }

  async findAll(filter: Partial<Product> = {}): Promise<Product[]> {
    return this.model.find(filter);
  }

  async create(data: Partial<Product>): Promise<Product> {
    return this.model.create(data);
  }

  async update(id: string, data: Partial<Product>): Promise<Product | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }
}
```

---

## Patterns in Our Project

| Pattern       | Usage                                      |
| ------------- | ------------------------------------------ |
| **MVC**       | Support Portal structure                   |
| **Factory**   | User creation by role                      |
| **Singleton** | Logger, DB connections, Redis client       |
| **Observer**  | Zustand stores, event emitters             |
| **Repository**| Data access in microservices               |
| **Decorator** | Express middleware, HOCs                   |
| **Strategy**  | Payment processing, auth providers         |
| **Adapter**   | Third-party API integrations               |

---

## Best Practices

1. **Don't Overuse** - Apply patterns only when needed
2. **Document Patterns** - Comment which pattern is being used
3. **Consistency** - Use same patterns across similar problems
4. **SOLID Principles** - Patterns should support SOLID
5. **Testability** - Patterns should make testing easier

---

## Related Documentation

- [MICROSERVICES.md](MICROSERVICES.md) - Service architecture
- [TYPESCRIPT.md](TYPESCRIPT.md) - Type patterns
