# Environment Configuration

## 📑 Table of Contents

- [Overview](#overview)
- [Environment Files](#environment-files)
- [Variable Reference](#variable-reference)
- [Service Configuration](#service-configuration)
- [Secrets Management](#secrets-management)

## 🌐 Overview

E-Storefront uses environment variables for configuration management across different environments.

| Environment | Purpose | Configuration |
|-------------|---------|---------------|
| Development | Local development | `.env` files |
| Staging | Pre-production testing | Railway/Vercel Variables |
| Production | Live environment | Railway/Vercel Variables |

## 📁 Environment Files

### File Structure

```
E-Storefront/
├── .env.example              # Template for all variables
├── .env                      # Local development (git ignored)
├── apps/
│   ├── admin-app/
│   │   ├── .env.example
│   │   └── .env
│   ├── seller-app/
│   │   ├── .env.example
│   │   └── .env
│   └── shell-app/
│       ├── .env.example
│       └── .env
└── services/
    ├── auth-service/
    │   ├── .env.example
    │   └── .env
    ├── product-service/
    │   └── ...
    └── ...
```

### Root .env.example

```env
# ================================
# E-STOREFRONT ENVIRONMENT CONFIG
# ================================
# Copy this file to .env and update values

# ================================
# NODE ENVIRONMENT
# ================================
NODE_ENV=development

# ================================
# DATABASE
# ================================
MONGODB_URI=mongodb://admin:password@localhost:27017/ecommerce?authSource=admin
MONGODB_DB_NAME=ecommerce

# ================================
# REDIS
# ================================
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# ================================
# JWT AUTHENTICATION
# ================================
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# ================================
# OAUTH - GOOGLE
# ================================
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# ================================
# SERVICES PORTS
# ================================
GATEWAY_PORT=4000
AUTH_SERVICE_PORT=4001
CATEGORY_SERVICE_PORT=4002
COUPON_SERVICE_PORT=4003
ORDER_SERVICE_PORT=4004
PRODUCT_SERVICE_PORT=4005
TICKET_SERVICE_PORT=4006

# ================================
# SERVICE URLs (Internal)
# ================================
AUTH_SERVICE_URL=http://localhost:4001
CATEGORY_SERVICE_URL=http://localhost:4002
COUPON_SERVICE_URL=http://localhost:4003
ORDER_SERVICE_URL=http://localhost:4004
PRODUCT_SERVICE_URL=http://localhost:4005
TICKET_SERVICE_URL=http://localhost:4006

# ================================
# FRONTEND APPS PORTS
# ================================
SHELL_APP_PORT=3000
ADMIN_APP_PORT=3001
SELLER_APP_PORT=3002

# ================================
# FRONTEND URLS
# ================================
SHELL_APP_URL=http://localhost:3000
ADMIN_APP_URL=http://localhost:3001
SELLER_APP_URL=http://localhost:3002

# ================================
# API CONFIGURATION
# ================================
GRAPHQL_URL=http://localhost:4000/graphql
API_RATE_LIMIT=100
API_RATE_LIMIT_WINDOW=900000

# ================================
# CORS
# ================================
CORS_ORIGIN=http://localhost:3000,http://localhost:3001,http://localhost:3002

# ================================
# LOGGING
# ================================
LOG_LEVEL=debug
LOG_FORMAT=dev

# ================================
# FILE UPLOADS
# ================================
UPLOAD_MAX_SIZE=10485760
UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,image/webp

# ================================
# EXTERNAL SERVICES
# ================================
# Payment Gateway
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Email Service
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=noreply@3asoftwares.com
```

## 📋 Variable Reference

### Core Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment mode | Yes | `development` |
| `PORT` | Service port | No | Varies |

### Database Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB connection string | Yes | `mongodb://...` |
| `MONGODB_DB_NAME` | Database name | No | `ecommerce` |
| `REDIS_URL` | Redis connection string | Yes | `redis://...` |
| `REDIS_PASSWORD` | Redis password | No | - |

### Authentication Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `JWT_SECRET` | JWT signing secret | Yes | Random string |
| `JWT_EXPIRES_IN` | Access token expiry | No | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry | No | `7d` |
| `GOOGLE_CLIENT_ID` | Google OAuth ID | No | - |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | No | - |

### API Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `GRAPHQL_URL` | GraphQL endpoint | Yes | `http://...` |
| `API_RATE_LIMIT` | Requests per window | No | `100` |
| `API_RATE_LIMIT_WINDOW` | Window in ms | No | `900000` |
| `CORS_ORIGIN` | Allowed origins | Yes | `http://...` |

## ⚙️ Service Configuration

### Auth Service

```env
# services/auth-service/.env
NODE_ENV=development
PORT=4001

# Database
MONGODB_URI=mongodb://admin:password@localhost:27017/ecommerce?authSource=admin

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:4001/auth/google/callback

# Password Reset
PASSWORD_RESET_EXPIRES=3600000
PASSWORD_RESET_URL=http://localhost:3000/reset-password

# Email
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=your-user
SMTP_PASS=your-pass
```

### Product Service

```env
# services/product-service/.env
NODE_ENV=development
PORT=4005

# Database
MONGODB_URI=mongodb://admin:password@localhost:27017/ecommerce?authSource=admin

# Cache
REDIS_URL=redis://localhost:6379
CACHE_TTL=3600

# Search
SEARCH_MIN_SCORE=0.5
SEARCH_LIMIT=100

# Images
IMAGE_UPLOAD_PATH=/uploads/products
IMAGE_MAX_SIZE=5242880
```

### GraphQL Gateway

```env
# services/graphql-gateway/.env
NODE_ENV=development
PORT=4000

# Services
AUTH_SERVICE_URL=http://localhost:4001
CATEGORY_SERVICE_URL=http://localhost:4002
COUPON_SERVICE_URL=http://localhost:4003
ORDER_SERVICE_URL=http://localhost:4004
PRODUCT_SERVICE_URL=http://localhost:4005
TICKET_SERVICE_URL=http://localhost:4006

# JWT (for validation)
JWT_SECRET=your-secret-key

# Cache
REDIS_URL=redis://localhost:6379

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001,http://localhost:3002

# Playground
ENABLE_PLAYGROUND=true
```

### Frontend Apps

```env
# apps/shell-app/.env
VITE_APP_NAME=E-Storefront
VITE_GRAPHQL_URL=http://localhost:4000/graphql
VITE_GOOGLE_CLIENT_ID=your-client-id

# apps/admin-app/.env
VITE_APP_NAME=E-Storefront Admin
VITE_GRAPHQL_URL=http://localhost:4000/graphql
VITE_SHELL_URL=http://localhost:3000

# apps/seller-app/.env
VITE_APP_NAME=E-Storefront Seller
VITE_GRAPHQL_URL=http://localhost:4000/graphql
VITE_SHELL_URL=http://localhost:3000
```

## 🔐 Secrets Management

### Local Development

Secrets stored in `.env` files (git ignored).

### CI/CD (GitHub Actions)

```yaml
# Access secrets in workflows
env:
  JWT_SECRET: ${{ secrets.JWT_SECRET }}
  MONGODB_URI: ${{ secrets.MONGODB_URI }}
```

### Production (Railway)

```bash
# Set via CLI
railway variables set JWT_SECRET=your-secret
railway variables set MONGODB_URI=your-connection-string

# Or via Railway Dashboard
# Project → Service → Variables
```

### Production (Vercel)

```bash
# Set via CLI
vercel env add JWT_SECRET production
vercel env add GRAPHQL_URL production

# Or via Vercel Dashboard
# Project → Settings → Environment Variables
```

### Environment Variable Hierarchy

```
┌─────────────────────────────────────┐
│         PRIORITY (High → Low)       │
├─────────────────────────────────────┤
│                                     │
│  1. Runtime Environment Variables   │
│     (Set by platform)               │
│                                     │
│  2. .env.local                      │
│     (Local overrides)               │
│                                     │
│  3. .env.{environment}              │
│     (.env.production, .env.staging) │
│                                     │
│  4. .env                            │
│     (Default values)                │
│                                     │
└─────────────────────────────────────┘
```

## 🔄 Environment Sync

### Keeping Environments in Sync

```bash
# Export from Railway (production)
railway variables --json > .env.production.json

# Compare with local
diff .env.example .env

# Validate required variables
node scripts/validate-env.js
```

### Validation Script

```javascript
// scripts/validate-env.js
const required = [
  'NODE_ENV',
  'MONGODB_URI',
  'JWT_SECRET',
  'REDIS_URL'
];

const missing = required.filter(key => !process.env[key]);

if (missing.length > 0) {
  console.error('Missing required environment variables:');
  missing.forEach(key => console.error(`  - ${key}`));
  process.exit(1);
}

console.log('✅ All required environment variables are set');
```

---

See also:
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [SECURITY.md](../SECURITY.md) - Security policies
