# Deployment Guide

## 📑 Table of Contents

- [Overview](#overview)
- [Infrastructure](#infrastructure)
- [Local Development](#local-development)
- [Staging Deployment](#staging-deployment)
- [Production Deployment](#production-deployment)
- [Rollback Procedures](#rollback-procedures)
- [Health Checks](#health-checks)

## 🌐 Overview

E-Storefront is deployed using the following platforms:

| Component | Platform | URL |
|-----------|----------|-----|
| Frontend Apps | Vercel | `*.vercel.app` |
| Backend Services | Railway | `*.railway.app` |
| Database | MongoDB Atlas | `mongodb+srv://` |
| Cache | Redis Cloud | `redis://` |
| CDN | Cloudflare | `cdn.3asoftwares.com` |

## 🏗️ Infrastructure

### Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLOUDFLARE                                      │
│                          (CDN & DDoS Protection)                            │
└─────────────────────────────────┬───────────────────────────────────────────┘
                                  │
          ┌───────────────────────┼───────────────────────┐
          │                       │                       │
          ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     VERCEL      │     │     RAILWAY     │     │  MONGODB ATLAS  │
│   (Frontend)    │     │   (Backend)     │     │   (Database)    │
│                 │     │                 │     │                 │
│ • shell-app     │     │ • gateway       │     │ • Replica Set   │
│ • admin-app     │────▶│ • auth-service  │────▶│ • Auto-scaling  │
│ • seller-app    │     │ • product-svc   │     │ • Backups       │
│                 │     │ • order-svc     │     │                 │
└─────────────────┘     │ • others...     │     └─────────────────┘
                        │                 │
                        │                 │     ┌─────────────────┐
                        │                 │────▶│   REDIS CLOUD   │
                        │                 │     │   (Caching)     │
                        └─────────────────┘     └─────────────────┘
```

### Resource Requirements

| Service | Memory | CPU | Instances |
|---------|--------|-----|-----------|
| GraphQL Gateway | 512MB | 0.5 | 2-4 |
| Auth Service | 256MB | 0.25 | 2 |
| Product Service | 512MB | 0.5 | 2-4 |
| Order Service | 512MB | 0.5 | 2-4 |
| Other Services | 256MB | 0.25 | 1-2 |

## 💻 Local Development

### Prerequisites

```bash
# Install Node.js 20+
nvm install 20
nvm use 20

# Install Yarn
npm install -g yarn

# Install Docker
# Download from https://docker.com
```

### Setup

```bash
# 1. Clone repository
git clone https://github.com/3asoftwares/E-Storefront.git
cd E-Storefront

# 2. Install dependencies
yarn install

# 3. Start infrastructure (MongoDB, Redis)
docker-compose up -d

# 4. Copy environment files
cp .env.example .env

# 5. Build packages
yarn build:packages

# 6. Start all services
yarn dev:all
```

### Access Points

| Service | URL |
|---------|-----|
| Shell App | http://localhost:3000 |
| Admin App | http://localhost:3001 |
| Seller App | http://localhost:3002 |
| GraphQL Gateway | http://localhost:4000/graphql |
| MongoDB | mongodb://localhost:27017 |
| Redis | redis://localhost:6379 |

## 🧪 Staging Deployment

### Prerequisites

- Access to Railway staging project
- Vercel staging project configured
- MongoDB Atlas staging cluster

### Deploy to Staging

```bash
# 1. Build all packages
yarn build:packages

# 2. Run tests
yarn test:all

# 3. Deploy frontend to Vercel staging
vercel --env staging

# 4. Deploy backend to Railway staging
railway link -e staging
railway up -s auth-service
railway up -s product-service
railway up -s order-service
railway up -s graphql-gateway
railway up -s category-service
railway up -s coupon-service
railway up -s ticket-service
```

### Staging URLs

| Component | URL |
|-----------|-----|
| Shell App | https://staging.3asoftwares.com |
| Admin App | https://admin-staging.3asoftwares.com |
| API | https://staging-api.3asoftwares.com/graphql |

## 🚀 Production Deployment

### Pre-Deployment Checklist

- [ ] All tests passing on main branch
- [ ] Code review completed and approved
- [ ] Staging tested and verified
- [ ] Database migrations prepared (if any)
- [ ] Rollback plan documented
- [ ] Team notified of deployment

### Automated Deployment

Production deployment is automated via GitHub Actions when pushing to `main`:

```bash
# Merge PR to main triggers:
# 1. CI Pipeline (build, test, lint)
# 2. If successful:
#    - Frontend → Vercel Production
#    - Backend → Railway Production
```

### Manual Deployment

```bash
# Frontend
vercel --prod

# Backend (one service at a time)
railway link -e production
railway up -s graphql-gateway
railway up -s auth-service
railway up -s product-service
railway up -s order-service
railway up -s category-service
railway up -s coupon-service
railway up -s ticket-service
```

### Zero-Downtime Deployment

Railway and Vercel both support zero-downtime deployments:

1. New version deployed alongside old
2. Health checks verified
3. Traffic gradually shifted
4. Old version terminated

## 🔙 Rollback Procedures

### Vercel Rollback

```bash
# List recent deployments
vercel ls

# Rollback to specific deployment
vercel rollback <deployment-url>

# Or via Vercel Dashboard
# Deployments → Select deployment → Promote to Production
```

### Railway Rollback

```bash
# List recent deployments
railway deployments

# Rollback to previous deployment
railway rollback -s <service-name>

# Or via Railway Dashboard
# Service → Deployments → Rollback
```

### Database Rollback

```bash
# MongoDB Atlas - Restore from backup
# 1. Go to MongoDB Atlas Dashboard
# 2. Clusters → Your Cluster → Backup
# 3. Select snapshot → Restore

# Or using mongorestore
mongorestore --uri="mongodb+srv://..." /path/to/backup
```

### Emergency Rollback

```bash
#!/bin/bash
# emergency-rollback.sh

echo "🚨 Emergency Rollback Initiated"

# 1. Rollback all backend services
railway rollback -s graphql-gateway
railway rollback -s auth-service
railway rollback -s product-service
railway rollback -s order-service

# 2. Rollback frontend
vercel rollback

echo "✅ Rollback complete. Verify services."
```

## ❤️ Health Checks

### Endpoints

| Service | Endpoint | Expected |
|---------|----------|----------|
| Gateway | `/health` | `{ status: 'ok' }` |
| Auth | `/health` | `{ status: 'ok' }` |
| Product | `/health` | `{ status: 'ok' }` |
| Order | `/health` | `{ status: 'ok' }` |

### Health Check Script

```bash
# Check all services
yarn health

# Check backend only
yarn health:backend

# Check frontend only
yarn health:frontend

# Verbose output
yarn health:verbose
```

### Monitoring

| Tool | Purpose |
|------|---------|
| Railway Metrics | Service health, logs |
| Vercel Analytics | Frontend performance |
| MongoDB Atlas | Database metrics |
| Uptime Robot | Availability monitoring |

### Alerts

Configure alerts for:
- Service downtime
- High error rates (> 1%)
- High latency (> 2s)
- Database connection issues
- Redis connection issues

## 📋 Deployment Commands Reference

```bash
# ===============================
# LOCAL
# ===============================
yarn dev:all              # Start everything
yarn dev:frontend         # Frontend only
yarn dev:backend          # Backend only
docker-compose up -d      # Start databases

# ===============================
# STAGING
# ===============================
vercel --env staging      # Deploy frontend
railway up -e staging     # Deploy backend

# ===============================
# PRODUCTION
# ===============================
vercel --prod             # Deploy frontend
railway up -e production  # Deploy backend

# ===============================
# ROLLBACK
# ===============================
vercel rollback           # Rollback frontend
railway rollback          # Rollback backend

# ===============================
# HEALTH
# ===============================
yarn health               # Check all
yarn health:verbose       # Detailed check
```

---

See also:
- [CI-CD.md](./CI-CD.md) - CI/CD configuration
- [ENVIRONMENT.md](./ENVIRONMENT.md) - Environment variables
- [RUNBOOK.md](./RUNBOOK.md) - Operations runbook
