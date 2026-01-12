# Deployment Guide

This guide covers deploying the E-Commerce platform:
- **Frontend Apps** → Vercel
- **Microservices** → Railway
- **Local Development** → Docker Compose

---

## 🚀 Railway Deployment (Microservices)

### Prerequisites
1. Create a Railway account: https://railway.app
2. Install Railway CLI: `npm install -g @railway/cli`
3. Login: `railway login`

### Step 1: Create Railway Project

```bash
# Login to Railway
railway login

# Create a new project
railway init
```

### Step 2: Create Services

In Railway Dashboard, create a service for each microservice:
1. **auth-service**
2. **category-service**
3. **coupon-service**
4. **graphql-gateway**
5. **order-service**
6. **product-service**

### Step 3: Configure Each Service

For each service, set these in Railway Dashboard:

**Settings → Build:**
- Root Directory: `services/<service-name>` (e.g., `services/auth-service`)
- Build Command: `cd ../.. && yarn install && yarn build:types && yarn build:utils && cd services/auth-service && yarn build`
- Start Command: `yarn start`

**Settings → Environment Variables:**
```
NODE_ENV=production
PORT=3000
MONGODB_URL=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
REDIS_URL=<your-redis-url>
```

### Step 4: Add MongoDB (Railway Plugin)

1. In your Railway project, click "New" → "Database" → "MongoDB"
2. Copy the connection string
3. Add to each service's environment variables as `MONGODB_URL`

### Step 5: Deploy via CLI

```bash
# Deploy a specific service
cd services/auth-service
railway up

# Or deploy from root with service name
railway up --service auth-service
```

### Step 6: Get Service URLs

After deployment, Railway provides URLs like:
- `https://auth-service-xxxx.railway.app`
- `https://graphql-gateway-xxxx.railway.app`

Update `graphql-gateway` environment variables with service URLs:
```
AUTH_SERVICE_URL=https://auth-service-xxxx.railway.app
CATEGORY_SERVICE_URL=https://category-service-xxxx.railway.app
COUPON_SERVICE_URL=https://coupon-service-xxxx.railway.app
ORDER_SERVICE_URL=https://order-service-xxxx.railway.app
PRODUCT_SERVICE_URL=https://product-service-xxxx.railway.app
```

---

## 🌐 Vercel Deployment (Frontend Apps)

### Prerequisites
1. Create a Vercel account: https://vercel.com
2. Install Vercel CLI: `npm install -g vercel`
3. Login: `vercel login`

### Step 1: Link Repository

1. Go to Vercel Dashboard
2. Click "Add New" → "Project"
3. Import your GitHub repository

### Step 2: Configure Each App

Deploy each app separately:

#### Admin App
1. Click "Add New" → "Project"
2. Select repository
3. Configure:
   - **Root Directory**: `apps/admin-app`
   - **Framework Preset**: Vite
   - **Build Command**: `cd ../.. && yarn install && yarn build:types && yarn build:utils && yarn build:ui && cd apps/admin-app && yarn build`
   - **Output Directory**: `dist`
4. Add Environment Variables:
   ```
   VITE_API_URL=https://graphql-gateway-xxxx.railway.app/graphql
   ```

#### Seller App
Same steps with:
- **Root Directory**: `apps/seller-app`

#### Shell App
Same steps with:
- **Root Directory**: `apps/shell-app`
- **Framework Preset**: Other (Webpack)

### Step 3: Deploy via CLI

```bash
# Deploy admin app
cd apps/admin-app
vercel

# Deploy to production
vercel --prod
```

### Step 4: Custom Domains (Optional)

In Vercel Dashboard → Project → Settings → Domains:
- Add your custom domain
- Configure DNS records as instructed

---

## 🐳 Local Development with Docker

### Start Databases

```bash
# Start MongoDB and Redis
docker-compose up -d

# Check status
docker-compose ps
```

### Environment Variables

Create `.env` in the root:
```env
NODE_ENV=development
MONGODB_URL=mongodb://admin:password@localhost:27017/ecommerce?authSource=admin
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-local-secret
```

### Run Services

```bash
# Install dependencies
yarn install

# Build packages
yarn build:types && yarn build:utils

# Run all backend services
yarn dev:backend

# Run all frontend apps
yarn dev:frontend

# Run everything
yarn dev:all
```

### Service Ports

| Service | Port |
|---------|------|
| Admin App | 3001 |
| Seller App | 3002 |
| Shell App | 3000 |
| Auth Service | 3011 |
| Category Service | 3012 |
| Coupon Service | 3013 |
| Product Service | 3014 |
| Order Service | 3015 |
| GraphQL Gateway | 4000 |
| Storybook | 6006 |

---

## 🔑 GitHub Secrets for CI/CD

Add these secrets in GitHub → Settings → Secrets:

### For Vercel:
- `VERCEL_TOKEN` - Your Vercel API token
- `VERCEL_ORG_ID` - Your Vercel Organization ID
- `VERCEL_PROJECT_ID_ADMIN` - Admin app project ID
- `VERCEL_PROJECT_ID_SELLER` - Seller app project ID
- `VERCEL_PROJECT_ID_SHELL` - Shell app project ID

### For Railway:
- `RAILWAY_TOKEN` - Your Railway API token

### Get Vercel IDs:
```bash
cd apps/admin-app
vercel link
# Check .vercel/project.json for projectId and orgId
```

### Get Railway Token:
1. Go to Railway Dashboard → Account Settings → Tokens
2. Create a new token

---

## 🔄 CI/CD Workflows

### Automatic (on push):
- **CI Pipeline**: Builds and tests on every push

### Manual Triggers:
- **Deploy to Vercel**: GitHub Actions → Deploy to Vercel → Run workflow
- **Deploy to Railway**: GitHub Actions → Deploy to Railway → Run workflow

---

## 📋 Quick Deploy Checklist

### Railway (Microservices):
- [ ] Create Railway project
- [ ] Add MongoDB plugin
- [ ] Create 6 services (auth, category, coupon, order, product, gateway)
- [ ] Configure build/start commands for each
- [ ] Set environment variables
- [ ] Deploy and get URLs
- [ ] Update gateway with service URLs

### Vercel (Frontend):
- [ ] Create 3 Vercel projects (admin, seller, shell)
- [ ] Configure root directories
- [ ] Set API URL environment variable
- [ ] Deploy to production
- [ ] (Optional) Add custom domains

### GitHub:
- [ ] Add RAILWAY_TOKEN secret
- [ ] Add VERCEL_TOKEN secret
- [ ] Add VERCEL_ORG_ID secret
- [ ] Add VERCEL_PROJECT_ID_* secrets
