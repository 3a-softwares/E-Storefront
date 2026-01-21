# OAuth 2.0

## Overview

**Standard:** OAuth 2.0 / OpenID Connect  
**Category:** Authentication  
**Providers:** Google, GitHub, Apple

OAuth 2.0 is an authorization framework that enables third-party applications to obtain limited access to user accounts.

---

## Why OAuth?

### Benefits

| Benefit              | Description                                |
| -------------------- | ------------------------------------------ |
| **User Convenience** | No new password to remember                |
| **Security**         | No password sharing with third parties     |
| **Trust**            | Users trust known providers (Google, etc.) |
| **Profile Data**     | Access to verified user information        |
| **Less Friction**    | Faster signup/login flow                   |

### Why We Use OAuth

1. **Google Sign-In** - Most users have Google accounts
2. **Verified Emails** - No email verification needed
3. **Profile Data** - Pre-filled user information
4. **Security** - Reduce password-related vulnerabilities
5. **Conversion** - Lower signup friction

---

## OAuth 2.0 Flow

### Authorization Code Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    OAuth 2.0 Flow                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐                        ┌──────────────────┐   │
│  │   User   │                        │  Authorization   │   │
│  │ (Browser)│                        │     Server       │   │
│  └────┬─────┘                        │    (Google)      │   │
│       │                              └────────┬─────────┘   │
│       │  1. Click "Sign in with Google"       │             │
│       │ ────────────────────────────────────▶ │             │
│       │                                       │             │
│       │  2. Redirect to Google login          │             │
│       │ ◀──────────────────────────────────── │             │
│       │                                       │             │
│       │  3. User authenticates                │             │
│       │ ────────────────────────────────────▶ │             │
│       │                                       │             │
│       │  4. Redirect with auth code           │             │
│       │ ◀──────────────────────────────────── │             │
│       │                                       │             │
│  ┌────▼─────┐                                 │             │
│  │   Our    │  5. Exchange code for tokens    │             │
│  │  Server  │ ────────────────────────────────▶             │
│  │          │                                 │             │
│  │          │  6. Access token + ID token     │             │
│  │          │ ◀────────────────────────────────             │
│  │          │                                               │
│  │          │  7. Fetch user profile                        │
│  │          │ ────────────────────────────────▶             │
│  │          │                                               │
│  │          │  8. User info                                 │
│  │          │ ◀────────────────────────────────             │
│  └──────────┘                                               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation

### Google OAuth Setup

```typescript
// services/auth-service/src/config/oauth.ts
export const googleOAuthConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  redirectUri: `${process.env.API_URL}/auth/google/callback`,
  scopes: ['openid', 'email', 'profile'],
};
```

### OAuth Routes

```typescript
// services/auth-service/src/routes/oauth.routes.ts
import { Router } from 'express';
import { google } from 'googleapis';
import { User } from '../models/User';
import { generateTokens } from '../utils/jwt';

const router = Router();

// Initiate OAuth flow
router.get('/google', (req, res) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['openid', 'email', 'profile'],
    prompt: 'consent',
  });

  res.redirect(authUrl);
});

// OAuth callback
router.get('/google/callback', async (req, res) => {
  try {
    const { code } = req.query;

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);

    // Get user info
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data: googleUser } = await oauth2.userinfo.get();

    // Find or create user
    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
      user = await User.create({
        email: googleUser.email,
        name: googleUser.name,
        avatar: googleUser.picture,
        provider: 'google',
        providerId: googleUser.id,
        isEmailVerified: true,
      });
    }

    // Generate our tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Redirect to frontend with tokens
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/callback?token=${accessToken}&refresh=${refreshToken}`
    );
  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
  }
});

export default router;
```

### Frontend Integration

```typescript
// components/GoogleSignInButton.tsx
'use client';

export function GoogleSignInButton() {
  const handleGoogleSignIn = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="btn btn-outline w-full flex items-center justify-center gap-2"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        {/* Google icon */}
      </svg>
      Continue with Google
    </button>
  );
}
```

### Callback Handler

```typescript
// app/auth/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';

export default function AuthCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const token = searchParams.get('token');
    const refresh = searchParams.get('refresh');
    const error = searchParams.get('error');

    if (error) {
      router.push(`/login?error=${error}`);
      return;
    }

    if (token && refresh) {
      setAuth({ token, refreshToken: refresh });
      router.push('/');
    }
  }, [searchParams, router, setAuth]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="loading loading-spinner loading-lg" />
    </div>
  );
}
```

---

## Multiple Providers

### Provider Configuration

```typescript
// services/auth-service/src/config/oauth.ts
export const oauthProviders = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
    scopes: ['openid', 'email', 'profile'],
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    authUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    userInfoUrl: 'https://api.github.com/user',
    scopes: ['read:user', 'user:email'],
  },
  apple: {
    clientId: process.env.APPLE_CLIENT_ID!,
    teamId: process.env.APPLE_TEAM_ID!,
    keyId: process.env.APPLE_KEY_ID!,
    privateKey: process.env.APPLE_PRIVATE_KEY!,
    authUrl: 'https://appleid.apple.com/auth/authorize',
    tokenUrl: 'https://appleid.apple.com/auth/token',
    scopes: ['name', 'email'],
  },
};
```

### User Model with Providers

```typescript
// services/auth-service/src/models/User.ts
const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Nullable for OAuth users
  name: { type: String },
  avatar: { type: String },

  // OAuth
  provider: {
    type: String,
    enum: ['local', 'google', 'github', 'apple'],
    default: 'local',
  },
  providerId: { type: String },

  isEmailVerified: { type: Boolean, default: false },
});
```

---

## Security Considerations

### State Parameter

```typescript
// Prevent CSRF
router.get('/google', (req, res) => {
  const state = crypto.randomBytes(32).toString('hex');
  req.session.oauthState = state;

  const authUrl = oauth2Client.generateAuthUrl({
    state,
    // ... other options
  });

  res.redirect(authUrl);
});

router.get('/google/callback', (req, res) => {
  if (req.query.state !== req.session.oauthState) {
    return res.status(400).json({ error: 'Invalid state' });
  }
  // Continue with token exchange
});
```

### PKCE (for Mobile/SPA)

```typescript
// Generate code verifier and challenge
const codeVerifier = crypto.randomBytes(32).toString('base64url');
const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');

// Include in auth request
const authUrl = `${authEndpoint}?code_challenge=${codeChallenge}&code_challenge_method=S256`;
```

---

## Best Practices

1. **Use HTTPS** - Always use secure connections
2. **Validate State** - Prevent CSRF attacks
3. **Short-Lived Tokens** - Access tokens expire quickly
4. **Secure Storage** - Never expose client secrets
5. **Error Handling** - Graceful fallbacks
6. **Account Linking** - Allow linking multiple providers

---

## Related Documentation

- [JWT.md](JWT.md) - Token management
- [CORS.md](CORS.md) - Cross-origin security
- [MIDDLEWARE.md](MIDDLEWARE.md) - Auth middleware
