# GitHub Copilot

## Overview

**Tool:** GitHub Copilot  
**Category:** AI-Powered Development  
**Integration:** VS Code, JetBrains, Neovim

GitHub Copilot is an AI pair programmer that helps write code faster with contextual suggestions.

---

## Why GitHub Copilot?

### Benefits

| Benefit           | Description                            |
| ----------------- | -------------------------------------- |
| **Productivity**  | Write code faster with AI suggestions  |
| **Learning**      | Discover new patterns and APIs         |
| **Boilerplate**   | Generate repetitive code automatically |
| **Documentation** | Generate comments and docs             |
| **Testing**       | Suggest test cases                     |

### Why We Use Copilot

1. **Speed** - Faster development cycles
2. **Consistency** - Similar patterns across codebase
3. **Onboarding** - Helps new developers understand codebase
4. **Focus** - Spend time on logic, not syntax
5. **Quality** - Suggests best practices

---

## Using Copilot Effectively

### Inline Suggestions

```typescript
// Type a comment describing what you want
// Function to calculate cart total with discount

// Copilot suggests:
function calculateCartTotal(items: CartItem[], discountPercent: number): number {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = subtotal * (discountPercent / 100);
  return subtotal - discount;
}
```

### Comment-Driven Development

```typescript
// Create a custom hook for fetching products with pagination
// Copilot generates:
export function useProducts(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ['products', page, limit],
    queryFn: () => fetchProducts({ page, limit }),
    keepPreviousData: true,
  });
}
```

### Function Completion

```typescript
// Start typing function signature
async function sendPasswordResetEmail(email: string) {
  // Copilot completes:
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('User not found');
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetExpiry = Date.now() + 3600000; // 1 hour

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpiry = resetExpiry;
  await user.save();

  await emailService.send({
    to: email,
    subject: 'Password Reset',
    template: 'password-reset',
    data: { resetToken },
  });
}
```

---

## Copilot Chat

### Ask Questions

```
// In Copilot Chat:
"How do I implement infinite scroll in React?"

"Explain what this regex does: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/"

"What's the best way to handle form validation in Next.js?"
```

### Generate Code

```
// Prompt:
"Create a MongoDB schema for a Product with name, price, category, and timestamps"

// Response:
import mongoose, { Schema, Document } from 'mongoose';

interface IProduct extends Document {
  name: string;
  price: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
```

### Explain Code

```
// Select code and ask:
"Explain this code"
"What does this function do?"
"Are there any bugs in this code?"
```

### Refactor Code

```
// Prompt:
"Refactor this to use async/await instead of promises"
"Convert this to TypeScript"
"Make this more readable"
```

---

## Copilot for Testing

### Generate Tests

```typescript
// Write function, then ask Copilot to generate tests
function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Ask: "Generate unit tests for validateEmail"
describe('validateEmail', () => {
  it('should return true for valid email', () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });

  it('should return false for email without @', () => {
    expect(validateEmail('testexample.com')).toBe(false);
  });

  it('should return false for email without domain', () => {
    expect(validateEmail('test@')).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(validateEmail('')).toBe(false);
  });
});
```

### Test Data Generation

```typescript
// Ask: "Generate mock data for product testing"
const mockProducts: Product[] = [
  { id: '1', name: 'Laptop', price: 999.99, category: 'Electronics', stock: 50 },
  { id: '2', name: 'Headphones', price: 199.99, category: 'Electronics', stock: 100 },
  { id: '3', name: 'T-Shirt', price: 29.99, category: 'Clothing', stock: 200 },
];
```

---

## Copilot for Documentation

### Generate JSDoc

```typescript
// Type /** and press Enter
/**
 * Calculates the total price of items in the cart
 * @param items - Array of cart items
 * @param coupon - Optional discount coupon
 * @returns The total price after applying discounts
 * @example
 * const total = calculateTotal([{ price: 100, quantity: 2 }], { discount: 10 });
 * // Returns 180
 */
function calculateTotal(items: CartItem[], coupon?: Coupon): number {
  // ...
}
```

### Generate README

```
// Prompt:
"Generate a README for a React component library"
```

---

## Best Practices

### Do's

```typescript
// ✅ Use descriptive comments
// Create a debounced search function with 300ms delay

// ✅ Provide context
// Using Zustand store
// Update user profile in the database

// ✅ Review suggestions
// Always review and test generated code

// ✅ Iterate
// Refine prompts for better suggestions
```

### Don'ts

```typescript
// ❌ Don't blindly accept
// Always review security implications

// ❌ Don't use for sensitive logic
// Manually write authentication/authorization

// ❌ Don't skip testing
// Generated code still needs tests

// ❌ Don't ignore context
// Ensure suggestions fit your codebase patterns
```

---

## Keyboard Shortcuts

| Action              | Shortcut (VS Code)      |
| ------------------- | ----------------------- |
| Accept suggestion   | `Tab`                   |
| Dismiss suggestion  | `Esc`                   |
| Next suggestion     | `Alt + ]`               |
| Previous suggestion | `Alt + [`               |
| Open Copilot panel  | `Ctrl + Enter`          |
| Open Copilot Chat   | `Ctrl + I`              |
| Explain selection   | `Ctrl + /` then explain |

---

## Security Considerations

1. **Review Generated Code** - Don't accept blindly
2. **No Secrets** - Never use for passwords/keys
3. **License Awareness** - Understand code origins
4. **Sensitive Logic** - Write security code manually
5. **Validate Input** - Always sanitize user input

---

## Related Documentation

- [CODE_REVIEWS.md](CODE_REVIEWS.md) - Review process
- [TDD.md](TDD.md) - Test-driven development
- [TYPESCRIPT.md](TYPESCRIPT.md) - TypeScript patterns
