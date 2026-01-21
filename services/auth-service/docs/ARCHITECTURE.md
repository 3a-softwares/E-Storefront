# Auth Service Architecture

## Overview

The Auth Service handles user authentication, authorization, session management, and user profile operations for the E-Storefront platform.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Auth Service                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                        Express App                           │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────────┐ │   │
│  │  │ Helmet  │  │  CORS   │  │ Morgan  │  │ Express JSON    │ │   │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                         Routes                               │   │
│  │  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐     │   │
│  │  │ /api/auth     │ │ /api/users    │ │ /api/addresses│     │   │
│  │  └───────────────┘ └───────────────┘ └───────────────┘     │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                       Middleware                             │   │
│  │  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  │   │
│  │  │  authenticate  │  │    validate    │  │   authorize  │  │   │
│  │  │  (JWT verify)  │  │ (express-val.) │  │ (role check) │  │   │
│  │  └────────────────┘  └────────────────┘  └──────────────┘  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                      Controllers                             │   │
│  │  ┌────────────────┐ ┌────────────────┐ ┌──────────────────┐│   │
│  │  │ AuthController │ │ UserController │ │AddressController ││   │
│  │  └────────────────┘ └────────────────┘ └──────────────────┘│   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                       Services                               │   │
│  │  ┌────────────────┐  ┌─────────────────────────────────────┐│   │
│  │  │  emailService  │  │            JWT Utils                ││   │
│  │  │  (nodemailer)  │  │  generateTokens / verifyToken       ││   │
│  │  └────────────────┘  └─────────────────────────────────────┘│   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                        Models                                │   │
│  │  ┌────────────────┐  ┌────────────────┐                    │   │
│  │  │      User      │  │    Address     │                    │   │
│  │  │  (Mongoose)    │  │   (Mongoose)   │                    │   │
│  │  └────────────────┘  └────────────────┘                    │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                       Database                               │   │
│  │                    MongoDB (Mongoose)                        │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
auth-service/
├── src/
│   ├── config/
│   │   ├── database.ts      # MongoDB connection
│   │   └── swagger.ts       # Swagger/OpenAPI setup
│   ├── controllers/
│   │   ├── AuthController.ts
│   │   ├── UserController.ts
│   │   └── addressController.ts
│   ├── middleware/
│   │   ├── auth.ts          # JWT authentication
│   │   └── validator.ts     # Request validation
│   ├── models/
│   │   ├── User.ts          # User schema
│   │   └── Address.ts       # Address schema
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── userRoutes.ts
│   │   └── addressRoutes.ts
│   ├── services/
│   │   └── emailService.ts  # Nodemailer for emails
│   ├── utils/
│   │   └── jwt.ts           # Token generation/verification
│   └── index.ts             # App entry point
├── tests/
├── docs/
├── Dockerfile
├── package.json
└── tsconfig.json
```

---

## Authentication Flow

### Registration

```
Client → POST /register → Validate → Create User → Hash Password → Generate Tokens → Save → Response
```

### Login

```
Client → POST /login → Validate → Find User → Compare Password → Generate Tokens → Update lastLogin → Response
```

### Token Refresh

```
Client → POST /refresh → Verify Refresh Token → Find User → Validate Token Match → Generate New Tokens → Response
```

### JWT Token Structure

**Access Token (15 min):**

```json
{
  "userId": "user_id",
  "email": "user@example.com",
  "role": "customer",
  "type": "access",
  "iat": 1705750000,
  "exp": 1705750900
}
```

**Refresh Token (7 days):**

```json
{
  "userId": "user_id",
  "type": "refresh",
  "iat": 1705750000,
  "exp": 1706354800
}
```

---

## User Model

```typescript
interface User {
  _id: ObjectId;
  email: string;
  password: string; // bcrypt hashed
  name: string;
  role: 'customer' | 'seller' | 'admin';
  avatar?: string;
  phone?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationOTP?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  refreshToken?: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Security Features

| Feature          | Implementation             |
| ---------------- | -------------------------- |
| Password Hashing | bcryptjs (10 rounds)       |
| JWT Signing      | HS256 algorithm            |
| Token Expiry     | Access: 15min, Refresh: 7d |
| Rate Limiting    | Express middleware         |
| CORS             | Configurable origins       |
| Helmet           | Security headers           |
| Input Validation | express-validator          |

---

## Email Service

Uses Nodemailer for:

- Email verification (OTP + token link)
- Password reset emails
- Welcome emails

**Configuration:**

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=app-password
```

---

## Environment Variables

| Variable               | Description          | Default        |
| ---------------------- | -------------------- | -------------- |
| PORT                   | Service port         | 3011           |
| MONGODB_URI            | Database connection  | -              |
| JWT_SECRET             | Access token secret  | -              |
| JWT_REFRESH_SECRET     | Refresh token secret | -              |
| JWT_EXPIRES_IN         | Access token expiry  | 15m            |
| JWT_REFRESH_EXPIRES_IN | Refresh token expiry | 7d             |
| ALLOWED_ORIGINS        | CORS origins         | localhost:3000 |
| SMTP\_\*               | Email configuration  | -              |
| GOOGLE_CLIENT_ID       | Google OAuth         | -              |

---

## Cross-Service Authentication

Other services validate tokens by:

1. Including shared `@3asoftwares/utils` package
2. Using `verifyToken()` utility
3. Extracting user from decoded JWT

```typescript
// In other services
import { verifyAccessToken } from '@3asoftwares/utils/server';

const decoded = verifyAccessToken(token);
// { userId, email, role }
```

---

## Related

- [API.md](API.md) - API endpoints
- [TESTING.md](TESTING.md) - Test documentation
