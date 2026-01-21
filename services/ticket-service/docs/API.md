# Ticket Service API

## 📡 Endpoints

### Tickets

#### Create Ticket

```http
POST /tickets
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "subject": "Order not received",
  "description": "My order #ORD-123 was supposed to arrive yesterday",
  "category": "shipping",
  "priority": "high",
  "orderId": "order-id"
}
```

**Response (201):**

```json
{
  "success": true,
  "ticket": {
    "id": "...",
    "ticketNumber": "TKT-2026-001234",
    "subject": "Order not received",
    "status": "open",
    "priority": "high"
  }
}
```

#### List User Tickets

```http
GET /tickets
Authorization: Bearer <token>
```

#### Get Ticket Details

```http
GET /tickets/:id
Authorization: Bearer <token>
```

#### Add Message to Ticket

```http
POST /tickets/:id/messages
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "content": "Thank you for your response. Here is additional info...",
  "attachments": ["https://..."]
}
```

#### Close Ticket

```http
POST /tickets/:id/close
Authorization: Bearer <token>
```

### Admin Endpoints

#### List All Tickets

```http
GET /admin/tickets
Authorization: Bearer <token>
```

#### Assign Ticket

```http
PUT /tickets/:id/assign
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "agentId": "agent-user-id"
}
```

#### Update Status

```http
PUT /tickets/:id/status
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "status": "resolved"
}
```

---

See also:

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Service architecture
