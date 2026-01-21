# Ticket Service Testing Guide

## 🧪 Unit Testing

```typescript
// tests/unit/ticketService.test.ts
describe('TicketService', () => {
  describe('createTicket', () => {
    it('creates ticket with auto-generated number', async () => {
      const result = await TicketService.createTicket({
        subject: 'Test ticket',
        category: 'order',
        userId: 'user-id',
      });

      expect(result.ticketNumber).toMatch(/^TKT-/);
      expect(result.status).toBe('open');
    });
  });

  describe('addMessage', () => {
    it('adds message to ticket', async () => {
      const result = await TicketService.addMessage('ticket-id', 'user-id', 'Message content');

      expect(result.messages).toHaveLength(1);
      expect(result.messages[0].content).toBe('Message content');
    });
  });

  describe('updateStatus', () => {
    it('validates status transitions', async () => {
      await expect(
        TicketService.updateStatus('ticket-id', 'closed', { currentStatus: 'open' })
      ).rejects.toThrow('Invalid status transition');
    });

    it('allows valid transitions', async () => {
      const result = await TicketService.updateStatus('ticket-id', 'in_progress', {
        currentStatus: 'open',
      });

      expect(result.status).toBe('in_progress');
    });
  });
});
```

## 🔗 Integration Testing

```typescript
describe('POST /tickets', () => {
  it('creates ticket successfully', async () => {
    const res = await request(app)
      .post('/api/tickets')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        subject: 'Test ticket',
        category: 'order',
        description: 'Test description',
      });

    expect(res.status).toBe(201);
    expect(res.body.ticket.ticketNumber).toBeDefined();
  });
});
```

## 🏃 Running Tests

```bash
yarn test
yarn test:coverage
```

---

See also:

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Service architecture
