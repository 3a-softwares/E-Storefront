# JWT (JSON Web Tokens)

**Library:** jsonwebtoken | **Category:** Authentication

---

## Token Generation

```typescript
// utils/jwt.ts
import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

interface TokenPayload {
  userId: string;
  email: string;
  role: 'customer' | 'seller' | 'admin';
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '15m',
    issuer: 'e-storefront',
    audience: 'e-storefront-api',
  });
};

export const generateRefreshToken = (payload: { userId: string }): string => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: '7d',
    issuer: 'e-storefront',
  });
};

export const generateTokens = (payload: TokenPayload) => ({
  accessToken: generateAccessToken(payload),
  refreshToken: generateRefreshToken({ userId: payload.userId }),
  expiresIn: 15 * 60,
});

export const verifyAccessToken = (token: string): TokenPayload => {
  const decoded = jwt.verify(token, JWT_SECRET, {
    issuer: 'e-storefront',
    audience: 'e-storefront-api',
  }) as TokenPayload & JwtPayload;
  return { userId: decoded.userId, email: decoded.email, role: decoded.role };
};

export const verifyRefreshToken = (token: string): { userId: string } => {
  const decoded = jwt.verify(token, JWT_REFRESH_SECRET, {
    issuer: 'e-storefront',
  }) as { userId: string } & JwtPayload;
  return { userId: decoded.userId };
};
```

---

## Auth Service Implementation

```typescript
// services/auth-service/src/controllers/authController.ts
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { RefreshToken } from '../models/RefreshToken';
import { generateTokens, verifyRefreshToken } from '../utils/jwt';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const tokens = generateTokens({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  await RefreshToken.create({
    token: tokens.refreshToken,
    userId: user._id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  res.json({ user: { id: user._id, email: user.email, name: user.name, role: user.role }, ...tokens });
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken: token } = req.body;
  const decoded = verifyRefreshToken(token);

  const storedToken = await RefreshToken.findOne({
    token,
    userId: decoded.userId,
    expiresAt: { $gt: new Date() },
  });

  if (!storedToken) return res.status(401).json({ message: 'Invalid refresh token' });

  const user = await User.findById(decoded.userId);
  if (!user) return res.status(401).json({ message: 'User not found' });

  await RefreshToken.deleteOne({ _id: storedToken._id });

  const tokens = generateTokens({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  await RefreshToken.create({
    token: tokens.refreshToken,
    userId: user._id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  res.json(tokens);
};

export const logout = async (req: Request, res: Response) => {
  await RefreshToken.deleteOne({ token: req.body.refreshToken });
  res.json({ message: 'Logged out successfully' });
};
```

---

## Auth Middleware

```typescript
// middleware/auth.ts
import { verifyAccessToken } from '../utils/jwt';

export interface AuthRequest extends Request {
  user?: { userId: string; email: string; role: string };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    req.user = verifyAccessToken(authHeader.substring(7));
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: 'Authentication required' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};

// Usage
router.get('/products', optionalAuth, getProducts);
router.post('/products', authenticate, authorize('seller', 'admin'), createProduct);
```

---

## Frontend Token Management

```typescript
// lib/auth.ts
const AUTH_API = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL;

export const setTokens = (data: { accessToken: string; refreshToken: string; expiresIn: number }) => {
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  localStorage.setItem('tokenExpiry', String(Date.now() + data.expiresIn * 1000));
};

export const getAccessToken = (): string | null => localStorage.getItem('accessToken');

export const isTokenExpired = (): boolean => {
  const expiry = localStorage.getItem('tokenExpiry');
  return !expiry || Date.now() > parseInt(expiry) - 60000;
};

export const refreshTokens = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${AUTH_API}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    const tokens = await response.json();
    setTokens(tokens);
    return tokens;
  } catch {
    clearTokens();
    return null;
  }
};

export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('tokenExpiry');
};
```

---

## Token Flow

```
1. LOGIN
   Client → Auth Service → MongoDB (verify) → Access + Refresh tokens

2. API REQUEST
   Client (Bearer token) → Gateway → Service (validate) → Response

3. TOKEN REFRESH
   Client (refresh token) → Auth Service → New tokens
```

---

## Security Best Practices

1. **Short Access Token Expiry** - 15 minutes
2. **Rotate Refresh Tokens** - Single use
3. **Validate All Claims** - Issuer, audience, expiry
4. **Use Strong Secrets** - At least 256 bits
5. **HTTPS Only** - Never transmit over HTTP
6. **Store Refresh Tokens in DB** - Enable revocation

---

## Related Documentation

- [Express](./EXPRESS.md) - Auth middleware integration
- [GraphQL](./GRAPHQL.md) - Context authentication
- [MongoDB](./MONGODB.md) - User & token storage
