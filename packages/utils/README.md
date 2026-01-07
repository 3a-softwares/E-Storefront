# Utils Package

## Overview

Shared utility functions and helpers used across all frontend and backend applications in the e-commerce platform.

## Tech Stack

- **TypeScript 5** - Type-safe utilities
- **Vitest** - Testing

## Installation

This package is consumed as a workspace dependency:

```json
{
  "dependencies": {
    "3a-ecommerce-utils": "^1.0.0"
  }
}
```

## Exports

### Main Export (`3a-ecommerce-utils`)

For frontend applications - browser-safe utilities only.

### Server Export (`3a-ecommerce-utils/server`)

For backend services - includes file system Logger and Express middleware.

## Utility Categories

### String Utilities

- `capitalize` - Capitalize first letter
- `capitalizeWords` - Capitalize all words
- `toTitleCase` - Convert to title case
- `slugify` - Create URL-safe slug
- `truncate` - Truncate with ellipsis
- `generateRandomCode` - Generate random string

### Number Utilities

- `formatCurrency` - Format as currency
- `formatNumber` - Round to decimals
- `formatIndianCompact` - Format in Lakhs/Crores
- `formatPrice` - Format as Indian Rupees
- `calculatePercentage` - Calculate percentage
- `calculateDiscount` - Apply discount
- `calculateTax` - Calculate tax amount

### Array Utilities

- `chunk` - Split array into chunks
- `unique` - Remove duplicates
- `removeDuplicates` - Remove by key
- `groupBy` - Group by property
- `sortBy` - Sort by property
- `flatten` - Flatten nested arrays
- `difference` - Array difference
- `intersection` - Array intersection

### Object Utilities

- `pick` - Pick properties
- `omit` - Omit properties
- `deepClone` - Deep clone object
- `deepMerge` - Deep merge objects
- `isEmpty` - Check if empty

### Date Utilities

- `formatDate` - Format date
- `formatDateTime` - Format date + time
- `formatRelativeTime` - Relative time (e.g., "2 hours ago")
- `isToday` - Check if today
- `addDays` - Add days to date
- `daysBetween` - Days between dates

### Auth Utilities

- `storeAuth` - Store auth tokens
- `getStoredAuth` - Get stored auth
- `clearAuth` - Clear auth data
- `isTokenExpired` - Check token expiration
- `validateUserRole` - Role validation
- `setupAutoRefresh` - Auto token refresh

### Cookie Utilities

- `setCookie` - Set cookie
- `getCookie` - Get cookie
- `removeCookie` - Remove cookie
- `areCookiesEnabled` - Check cookie support

### Validation (Client)

- `validateEmail` - Email validation
- `validatePassword` - Password validation
- `validatePhone` - Phone validation
- `validateRequired` - Required field

### Validation (Server - Express)

- `validate` - Express validator middleware

### Logging

- `Logger` (Client) - Browser console logging
- `Logger` (Server) - File + console logging

## Logger Usage

### Frontend

```typescript
import { Logger } from '3a-ecommerce-utils';

Logger.info('User logged in', { userId: '123' }, 'Auth');
Logger.error('API call failed', error, 'API');
```

### Backend

```typescript
import { Logger } from '3a-ecommerce-utils/server';

Logger.configure({
  enableFile: true,
  logFilePath: './logs/app.log',
});

Logger.info('Server started', { port: 4000 }, 'Startup');
```

## Project Structure

```
src/
├── api/
│   ├── logger.ts         # Server Logger
│   ├── logger.client.ts  # Client Logger
│   └── *.queries.ts      # API query builders
├── auth.ts               # Auth utilities
├── cookies.ts            # Cookie utilities
├── helpers.ts            # General helpers
├── constants/            # Constants
├── config/               # Configuration
├── validation/
│   ├── client.ts         # Client validation
│   └── server.ts         # Server validation + middleware
└── index.ts              # Main exports
```

## Scripts

```bash
yarn test        # Run tests
yarn test:coverage # Run tests with coverage
```
