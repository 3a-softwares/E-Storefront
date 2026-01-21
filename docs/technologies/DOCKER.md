# Docker

**Version:** Docker 24.x, Compose 2.x  
**Category:** Containerization

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                   Multi-Stage Build                       │
├──────────────────────────────────────────────────────────┤
│  deps (~500MB)  →  builder (~1.5GB)  →  runner (~100MB)  │
│  Install deps      Build app            Production only   │
└──────────────────────────────────────────────────────────┘
```

---

## Dockerfiles

### Development

```dockerfile
FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3004
ENV NODE_ENV=development NEXT_TELEMETRY_DISABLED=1
CMD ["npm", "run", "dev"]
```

### Production (Multi-Stage)

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG NEXT_PUBLIC_ENV=production
ARG NEXT_PUBLIC_GRAPHQL_URL
ARG NEXT_PUBLIC_AUTH_SERVICE_URL
ENV NEXT_PUBLIC_ENV=${NEXT_PUBLIC_ENV}
ENV NEXT_PUBLIC_GRAPHQL_URL=${NEXT_PUBLIC_GRAPHQL_URL}
ENV NEXT_PUBLIC_AUTH_SERVICE_URL=${NEXT_PUBLIC_AUTH_SERVICE_URL}
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
RUN mkdir .next && chown nextjs:nodejs .next
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3004
ENV PORT=3004 HOSTNAME="0.0.0.0"
HEALTHCHECK --interval=30s --timeout=3s CMD wget --spider -q http://localhost:3004/ || exit 1
CMD ["node", "server.js"]
```

---

## Docker Compose

### Development

```yaml
version: '3.8'
services:
  storefront-dev:
    build: .
    ports: ['3004:3004']
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
    environment:
      - NODE_ENV=development
      - NEXT_PUBLIC_GRAPHQL_URL=${NEXT_PUBLIC_GRAPHQL_URL:-http://host.docker.internal:4000/graphql}
      - WATCHPACK_POLLING=true
    restart: unless-stopped
```

### Production

```yaml
version: '3.8'
services:
  storefront-prod:
    build:
      context: .
      dockerfile: Dockerfile.prod
      args:
        - NEXT_PUBLIC_ENV=production
        - NEXT_PUBLIC_GRAPHQL_URL=${NEXT_PUBLIC_GRAPHQL_URL}
    ports: ['3004:3004']
    environment: [NODE_ENV=production]
    restart: always
    deploy:
      resources:
        limits: { cpus: '1', memory: 512M }
    healthcheck:
      test: ['CMD', 'wget', '--spider', '-q', 'http://localhost:3004']
      interval: 30s
      timeout: 10s
      retries: 3
```

### Full Stack

```yaml
version: '3.8'
services:
  storefront:
    build: .
    ports: ['3004:3004']
    depends_on: [graphql-gateway, auth-service]
    environment:
      - NEXT_PUBLIC_GRAPHQL_URL=http://graphql-gateway:4000/graphql
      - NEXT_PUBLIC_AUTH_SERVICE_URL=http://auth-service:3011

  graphql-gateway:
    image: ghcr.io/3asoftwares/graphql-gateway:latest
    ports: ['4000:4000']

  auth-service:
    image: ghcr.io/3asoftwares/auth-service:latest
    ports: ['3011:3011']

  redis:
    image: redis:7-alpine
    ports: ['6379:6379']
```

---

## Commands

### Build

```bash
docker build -t storefront:dev .                              # Development
docker build -f Dockerfile.prod -t storefront:prod .          # Production
docker build --build-arg NEXT_PUBLIC_ENV=prod -t storefront . # With args
docker build --no-cache -t storefront:dev .                   # Clean build
```

### Run

```bash
docker run -d -p 3004:3004 --name storefront storefront:dev
docker run -d -p 3004:3004 --env-file .env.prod storefront:prod
docker-compose up storefront-dev
docker-compose -f docker-compose.prod.yml up -d
```

### Manage

```bash
docker logs -f storefront          # View logs
docker exec -it storefront sh      # Shell access
docker images storefront           # List images
docker system prune -a             # Clean up
```

---

## Best Practices

### .dockerignore

```
node_modules
.next
.git
*.md
.env*
coverage
cypress/videos
```

### Layer Caching

```dockerfile
# ✅ Good - deps cached separately
COPY package*.json ./
RUN npm ci
COPY . .

# ❌ Bad - rebuilds deps on any change
COPY . .
RUN npm ci
```

### Security

```dockerfile
# Non-root user
RUN addgroup --system nodejs && adduser --system nextjs
USER nextjs
```

---

## CI/CD Integration

```yaml
# GitHub Actions
- name: Build and Push
  uses: docker/build-push-action@v5
  with:
    file: ./Dockerfile.prod
    push: true
    tags: ghcr.io/3asoftwares/storefront:${{ github.sha }}
    build-args: |
      NEXT_PUBLIC_GRAPHQL_URL=${{ secrets.GRAPHQL_URL }}
```

---

## Related

- [CI_CD.md](CI_CD.md) - Pipeline configuration
- [NEXTJS.md](NEXTJS.md) - Next.js configuration
