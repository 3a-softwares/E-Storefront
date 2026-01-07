# E-Commerce - Deployment Guide

> **100% Free Deployment** - No credit card required

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              VERCEL                                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐   │
│  │  Shell App  │ │  Admin App  │ │ Seller App  │ │  Storefront App │   │
│  │   (React)   │ │   (React)   │ │   (React)   │ │    (Next.js)    │   │
│  └──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └────────┬────────┘   │
│         │               │               │                  │            │
│         └───────────────┴───────┬───────┴──────────────────┘            │
│                                 │                                        │
│  ┌──────────────────────────────▼──────────────────────────────────┐   │
│  │                    VERCEL SERVERLESS FUNCTIONS                   │   │
│  │  ┌────────┐ ┌─────────┐ ┌───────┐ ┌────────┐ ┌──────────────┐  │   │
│  │  │  Auth  │ │ Product │ │ Order │ │ Coupon │ │   Category   │  │   │
│  │  │  API   │ │   API   │ │  API  │ │  API   │ │     API      │  │   │
│  │  └────────┘ └─────────┘ └───────┘ └────────┘ └──────────────┘  │   │
│  │  ┌──────────────────────────────────────────────────────────┐  │   │
│  │  │                    GraphQL Gateway                        │  │   │
│  │  └──────────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
           ┌────────▼────────┐            ┌────────▼────────┐
           │  MongoDB Atlas  │            │  Upstash Redis  │
           │   (Free M0)     │            │   (Free Tier)   │
           └─────────────────┘            └─────────────────┘
```

## 📋 Prerequisites

- GitHub account
- Vercel account (free)
- MongoDB Atlas account (free)
- Upstash account (free) - optional, for caching
- npm account (free) - for publishing packages

---

## 🚀 Step 1: Database Setup (MongoDB Atlas)

### 1.1 Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new project: `E-Commerce`

### 1.2 Create Free Cluster

1. Click **"Build a Database"**
2. Select **"M0 FREE"** tier
3. Choose a cloud provider (AWS recommended)
4. Select a region close to your users
5. Name your cluster: `Cluster0`
6. Click **"Create"**

### 1.3 Configure Database Access

1. Go to **Database Access** → **Add New Database User**
2. Create user with credentials:
   - Username: `admin`
   - Password: `admin` (use a stronger password in production!)
   - Role: `Atlas admin`
3. Click **"Add User"**

### 1.4 Configure Network Access

1. Go to **Network Access** → **Add IP Address**
2. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
3. Click **"Confirm"**

### 1.5 Get Connection String

1. Go to **Database** → **Connect**
2. Choose **"Connect your application"**
3. Copy the connection string:
   ```
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password

### 1.6 Seed the Database

```bash
cd sample-data
npm install
npm run setup
```

This will:

- Generate 100 users, 300 products, 20 categories, 20 coupons, 50 orders, 100 addresses, 100 reviews
- Seed all data to MongoDB Atlas with proper indexes

---

## 🔴 Step 2: Redis Setup (Upstash) - Optional

### 2.1 Create Upstash Account

1. Go to [Upstash](https://upstash.com/)
2. Sign up for free
3. Create a new Redis database

### 2.2 Get Connection Details

1. Copy the **REST URL** and **REST Token**
2. Or use the **Redis URL** for direct connection

---

## 📦 Step 3: Deploy Backend Services to Vercel

Each service has a `vercel.json` and `api/index.ts` for serverless deployment.

### 3.1 Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

### 3.2 Deploy Services via Vercel Dashboard

#### For each service (auth, product, order, category, coupon, graphql-gateway):

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure the project:

   - **Root Directory**: `services/auth-service` (change for each service)
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add Environment Variables:

**Auth Service:**

```
MONGODB_URI=mongodb+srv://admin:admin@cluster0.xxxxx.mongodb.net/ecommerce
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-chars
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=10
NODE_ENV=production
```

**Product Service:**

```
MONGODB_URI=mongodb+srv://admin:admin@cluster0.xxxxx.mongodb.net/ecommerce
NODE_ENV=production
```

**Order Service:**

```
MONGODB_URI=mongodb+srv://admin:admin@cluster0.xxxxx.mongodb.net/ecommerce
NODE_ENV=production
```

**Category Service:**

```
MONGODB_URI=mongodb+srv://admin:admin@cluster0.xxxxx.mongodb.net/ecommerce
NODE_ENV=production
```

**Coupon Service:**

```
MONGODB_URI=mongodb+srv://admin:admin@cluster0.xxxxx.mongodb.net/ecommerce
NODE_ENV=production
```

**GraphQL Gateway:**

```
AUTH_SERVICE_URL=https://your-auth-service.vercel.app
PRODUCT_SERVICE_URL=https://your-product-service.vercel.app
ORDER_SERVICE_URL=https://your-order-service.vercel.app
CATEGORY_SERVICE_URL=https://your-category-service.vercel.app
COUPON_SERVICE_URL=https://your-coupon-service.vercel.app
NODE_ENV=production
```

6. Click **"Deploy"**

### 3.3 Service URLs After Deployment

Note down your deployed service URLs:

- Auth: `https://auth-service-xxx.vercel.app`
- Product: `https://product-service-xxx.vercel.app`
- Order: `https://order-service-xxx.vercel.app`
- Category: `https://category-service-xxx.vercel.app`
- Coupon: `https://coupon-service-xxx.vercel.app`
- GraphQL: `https://graphql-gateway-xxx.vercel.app`

---

## 🖥️ Step 4: Deploy Frontend Apps to Vercel

### 4.1 Storefront App (Next.js)

1. Import from GitHub
2. **Root Directory**: `apps/storefront-app`
3. **Framework Preset**: Next.js (auto-detected)
4. Add Environment Variables:
   ```
   NEXT_PUBLIC_GRAPHQL_URL=https://graphql-gateway-xxx.vercel.app/graphql
   NEXT_PUBLIC_AUTH_URL=https://auth-service-xxx.vercel.app
   ```
5. Deploy

### 4.2 Admin App (React/Vite)

1. Import from GitHub
2. **Root Directory**: `apps/admin-app`
3. **Framework Preset**: Vite
4. Add Environment Variables:
   ```
   VITE_GRAPHQL_URL=https://graphql-gateway-xxx.vercel.app/graphql
   VITE_AUTH_URL=https://auth-service-xxx.vercel.app
   ```
5. Deploy

### 4.3 Seller App (React/Vite)

1. Import from GitHub
2. **Root Directory**: `apps/seller-app`
3. **Framework Preset**: Vite
4. Add Environment Variables:
   ```
   VITE_GRAPHQL_URL=https://graphql-gateway-xxx.vercel.app/graphql
   VITE_AUTH_URL=https://auth-service-xxx.vercel.app
   ```
5. Deploy

### 4.4 Shell App (React/Webpack Module Federation)

1. Import from GitHub
2. **Root Directory**: `apps/shell-app`
3. **Framework Preset**: Other
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. Add Environment Variables:
   ```
   ADMIN_APP_URL=https://admin-app-xxx.vercel.app
   SELLER_APP_URL=https://seller-app-xxx.vercel.app
   STOREFRONT_URL=https://storefront-xxx.vercel.app
   ```
7. Deploy

---

## 📚 Step 5: Publish NPM Packages

### 5.1 Login to NPM

```bash
npm login
```

### 5.2 Publish Packages Manually

```bash
# Types package
cd packages/types
npm run build
npm publish --access public

# Utils package
cd ../utils
npm run build
npm publish --access public

# UI Library
cd ../ui-library
npm run build
npm publish --access public
```

### 5.3 Automated Publishing (GitHub Actions)

Packages are automatically published on GitHub Release. See `.github/workflows/publish-packages.yml`.

To trigger:

1. Go to GitHub → Releases
2. Create new release with tag `v1.0.0`
3. Packages will be published automatically

---

## 📖 Step 6: Deploy Storybook (UI Library Docs)

Storybook is automatically deployed to GitHub Pages on push to main.

### Manual Deployment:

```bash
cd packages/ui-library
npm run build-storybook
# Deploy storybook-static folder to any static hosting
```

### Access Storybook:

`https://<username>.github.io/E-Commerce-Microservices-Platform/`

---

## 🔧 Environment Variables Reference

### Backend Services

| Variable                 | Description                           | Required  |
| ------------------------ | ------------------------------------- | --------- |
| `MONGODB_URI`            | MongoDB Atlas connection string       | Yes       |
| `JWT_SECRET`             | Secret for JWT signing (32+ chars)    | Auth only |
| `JWT_REFRESH_SECRET`     | Secret for refresh tokens             | Auth only |
| `JWT_EXPIRES_IN`         | JWT expiration (e.g., `1h`)           | Auth only |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration (e.g., `7d`) | Auth only |
| `BCRYPT_SALT_ROUNDS`     | Password hashing rounds (10)          | Auth only |
| `NODE_ENV`               | Environment (`production`)            | Yes       |
| `REDIS_URL`              | Upstash Redis URL                     | Optional  |

### Frontend Apps

| Variable                  | Description      | App           |
| ------------------------- | ---------------- | ------------- |
| `NEXT_PUBLIC_GRAPHQL_URL` | GraphQL endpoint | Storefront    |
| `NEXT_PUBLIC_AUTH_URL`    | Auth service URL | Storefront    |
| `VITE_GRAPHQL_URL`        | GraphQL endpoint | Admin, Seller |
| `VITE_AUTH_URL`           | Auth service URL | Admin, Seller |

---

## 🧪 Test Credentials

After seeding the database:

| Role     | Email                   | Password   |
| -------- | ----------------------- | ---------- |
| Admin    | admin1@ecommerce.com    | Admin@123  |
| Seller   | seller1@marketplace.com | Seller@123 |
| Customer | customer1@email.com     | User@123   |

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflows

| Workflow               | Trigger         | Purpose                          |
| ---------------------- | --------------- | -------------------------------- |
| `publish-packages.yml` | Release created | Publish npm packages             |
| `deploy-storybook.yml` | Push to main    | Deploy Storybook to GitHub Pages |

### Vercel Auto-Deployments

- **Production**: Deploys on push to `main` branch
- **Preview**: Deploys on every pull request

---

## 📊 Monitoring & Logs

### Vercel

- Go to Project → Functions → View logs
- Real-time function invocation logs

### MongoDB Atlas

- Database → Metrics → View performance
- Real-time queries, connections, operations

---

## 🚨 Troubleshooting

### Common Issues

**1. MongoDB Connection Failed**

```
Error: MongoNetworkError
```

- Check IP whitelist in MongoDB Atlas (allow 0.0.0.0/0)
- Verify connection string format
- Check username/password

**2. CORS Errors**

```
Access-Control-Allow-Origin
```

- Add frontend URLs to `ALLOWED_ORIGINS` env variable
- Update CORS configuration in services

**3. JWT Token Invalid**

```
JsonWebTokenError: invalid signature
```

- Ensure `JWT_SECRET` matches across services
- Check token expiration

**4. Cold Start Latency**

- First request to serverless function may be slow (2-5s)
- Subsequent requests are fast
- Consider Vercel Pro for always-on functions

---

## 💰 Cost Summary

| Service       | Tier   | Monthly Cost |
| ------------- | ------ | ------------ |
| Vercel        | Hobby  | FREE         |
| MongoDB Atlas | M0     | FREE         |
| Upstash Redis | Free   | FREE         |
| GitHub        | Free   | FREE         |
| npm Registry  | Public | FREE         |
| **Total**     |        | **$0/month** |

### Free Tier Limits

| Service       | Limit                                |
| ------------- | ------------------------------------ |
| Vercel        | 100GB bandwidth, 100 deployments/day |
| MongoDB Atlas | 512MB storage, shared RAM            |
| Upstash Redis | 10,000 commands/day                  |

---

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Upstash Documentation](https://docs.upstash.com/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

## 📝 Deployment Checklist

- [ ] MongoDB Atlas cluster created and configured
- [ ] Database seeded with sample data
- [ ] Upstash Redis configured (optional)
- [ ] Auth service deployed
- [ ] Product service deployed
- [ ] Order service deployed
- [ ] Category service deployed
- [ ] Coupon service deployed
- [ ] GraphQL Gateway deployed
- [ ] Storefront app deployed
- [ ] Admin app deployed
- [ ] Seller app deployed
- [ ] Shell app deployed
- [ ] Environment variables configured
- [ ] CORS settings verified
- [ ] Test login working
- [ ] NPM packages published
- [ ] Storybook deployed

---

**Last Updated**: January 2026
