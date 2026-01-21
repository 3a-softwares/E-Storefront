# Docker Guide - E-Storefront Platform

## 📑 Table of Contents

- [Overview](#overview)
- [Local Development](#local-development)
- [Services Architecture](#services-architecture)
- [Docker Compose](#docker-compose)
- [Kubernetes Deployment](#kubernetes-deployment)

## 🌐 Overview

E-Storefront uses Docker for local development and Kubernetes for production deployment.

| Environment | Tool           | Purpose              |
| ----------- | -------------- | -------------------- |
| Local Dev   | Docker Compose | Run MongoDB, Redis   |
| Production  | Kubernetes     | Orchestrate services |

## 🚀 Local Development

### Prerequisites

- Docker Desktop 4.x+
- Docker Compose 2.x+

### Quick Start

```bash
# Start databases (MongoDB + Redis)
docker-compose up -d

# Verify services running
docker-compose ps

# View logs
docker-compose logs -f mongodb
docker-compose logs -f redis
```

### Accessing Services

| Service       | URL                         | Credentials    |
| ------------- | --------------------------- | -------------- |
| MongoDB       | `mongodb://localhost:27017` | admin/password |
| Redis         | `redis://localhost:6379`    | -              |
| Mongo Express | `http://localhost:8081`     | (if enabled)   |

## 🏗️ Services Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DOCKER CONTAINERS                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        DATABASES                                     │   │
│  │                                                                      │   │
│  │  ┌─────────────────────┐        ┌─────────────────────┐            │   │
│  │  │     MongoDB 7.0     │        │    Redis 7 Alpine   │            │   │
│  │  │                     │        │                     │            │   │
│  │  │  Port: 27017        │        │   Port: 6379        │            │   │
│  │  │  Data: mongodb_data │        │   Data: redis_data  │            │   │
│  │  └─────────────────────┘        └─────────────────────┘            │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                     │                                        │
│                                     │ ecommerce-network                     │
│                                     ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    LOCAL SERVICES (npm run dev)                      │   │
│  │                                                                      │   │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ │   │
│  │  │  Auth  │ │Product │ │ Order  │ │Category│ │ Coupon │ │ Ticket │ │   │
│  │  │  4001  │ │  4005  │ │  4004  │ │  4002  │ │  4003  │ │  4006  │ │   │
│  │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ │   │
│  │                              │                                       │   │
│  │                              ▼                                       │   │
│  │                     ┌────────────────┐                              │   │
│  │                     │ GraphQL Gateway│                              │   │
│  │                     │     4000       │                              │   │
│  │                     └────────────────┘                              │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 📦 Docker Compose

### docker-compose.yml

```yaml
version: '3.8'

services:
  # MongoDB Database
  mongodb:
    image: mongo:7.0
    container_name: ecommerce-mongodb
    restart: unless-stopped
    ports:
      - '27017:27017'
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
      MONGO_INITDB_DATABASE: ecommerce
    volumes:
      - mongodb_data:/data/db
      - ./devops/mongo-init:/docker-entrypoint-initdb.d
    networks:
      - ecommerce-network
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: ecommerce-redis
    restart: unless-stopped
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data
    networks:
      - ecommerce-network
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  mongodb_data:
  redis_data:

networks:
  ecommerce-network:
    driver: bridge
```

### Commands

| Command                          | Description              |
| -------------------------------- | ------------------------ |
| `docker-compose up -d`           | Start all services       |
| `docker-compose down`            | Stop all services        |
| `docker-compose down -v`         | Stop and remove volumes  |
| `docker-compose logs -f`         | Follow logs              |
| `docker-compose ps`              | List running services    |
| `docker-compose restart mongodb` | Restart specific service |

### Data Persistence

```bash
# Volumes are persisted at:
# - mongodb_data: MongoDB data
# - redis_data: Redis data

# To reset data:
docker-compose down -v
docker-compose up -d
```

## ☸️ Kubernetes Deployment

### Directory Structure

```
devops/k8s/
├── base/
│   ├── namespace.yaml
│   ├── configmap.yaml
│   └── secrets.yaml
├── databases/
│   ├── mongodb-deployment.yaml
│   └── redis-deployment.yaml
├── services/
│   ├── auth-service.yaml
│   ├── product-service.yaml
│   ├── order-service.yaml
│   └── graphql-gateway.yaml
└── ingress/
    └── ingress.yaml
```

### Sample Deployment

```yaml
# devops/k8s/services/auth-service.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-service
  namespace: ecommerce
spec:
  replicas: 2
  selector:
    matchLabels:
      app: auth-service
  template:
    metadata:
      labels:
        app: auth-service
    spec:
      containers:
        - name: auth-service
          image: 3asoftwares/auth-service:latest
          ports:
            - containerPort: 4001
          env:
            - name: NODE_ENV
              value: production
            - name: MONGODB_URI
              valueFrom:
                secretKeyRef:
                  name: db-secrets
                  key: mongodb-uri
          resources:
            requests:
              memory: '128Mi'
              cpu: '100m'
            limits:
              memory: '256Mi'
              cpu: '200m'
---
apiVersion: v1
kind: Service
metadata:
  name: auth-service
  namespace: ecommerce
spec:
  selector:
    app: auth-service
  ports:
    - port: 4001
      targetPort: 4001
```

### Deploy to Kubernetes

```bash
# Apply all configurations
kubectl apply -f devops/k8s/

# Check deployments
kubectl get deployments -n ecommerce

# Check pods
kubectl get pods -n ecommerce

# View logs
kubectl logs -f deployment/auth-service -n ecommerce
```

## 🔧 Troubleshooting

### MongoDB Connection Issues

```bash
# Check if MongoDB is running
docker-compose ps mongodb

# View MongoDB logs
docker-compose logs mongodb

# Connect directly to MongoDB
docker exec -it ecommerce-mongodb mongosh -u admin -p password
```

### Redis Connection Issues

```bash
# Check if Redis is running
docker-compose ps redis

# Test Redis connection
docker exec -it ecommerce-redis redis-cli ping
```

### Reset Everything

```bash
# Stop containers and remove volumes
docker-compose down -v

# Remove unused Docker resources
docker system prune -a

# Start fresh
docker-compose up -d
```

---

See also:

- [DEPLOYMENT](./DEPLOYMENT.md) - Deployment guide
- [ENVIRONMENT](./ENVIRONMENT.md) - Environment configuration
