# Troubleshooting Guide

## 📑 Table of Contents

- [Development Issues](#development-issues)
- [Build Issues](#build-issues)
- [Docker Issues](#docker-issues)
- [Database Issues](#database-issues)
- [Authentication Issues](#authentication-issues)
- [Package Issues](#package-issues)
- [CI/CD Issues](#cicd-issues)

---

## 💻 Development Issues

### "Port already in use"

**Problem:** Service fails to start because port is occupied.

```
Error: listen EADDRINUSE: address already in use :::4000
```

**Solution:**

```bash
# Find process using port (Windows PowerShell)
netstat -ano | findstr :4000
# Kill process
taskkill /PID <PID> /F

# Find process using port (Linux/Mac)
lsof -i :4000
kill -9 <PID>

# Or use different port
PORT=4001 yarn workspace @e-storefront/graphql-gateway dev
```

---

### "Module not found" Errors

**Problem:** Cannot resolve imports from shared packages.

```
Error: Cannot find module '@3asoftwares/types'
```

**Solution:**

```bash
# 1. Rebuild packages
yarn build:packages

# 2. If still failing, reinstall
rm -rf node_modules
yarn install
yarn build:packages
```

---

### Hot Reload Not Working

**Problem:** Changes don't appear without manual refresh.

**Solution:**

```bash
# 1. Check if watching
# Vite apps should show "watching for file changes"

# 2. Clear cache
rm -rf .next .vite node_modules/.cache

# 3. Restart dev server
yarn dev:all
```

---

### TypeScript Errors in IDE

**Problem:** VS Code shows type errors but build succeeds.

**Solution:**

1. Restart TypeScript server: `Cmd/Ctrl + Shift + P` → "TypeScript: Restart TS Server"
2. Rebuild packages: `yarn build:packages`
3. Check `tsconfig.json` paths are correct

---

## 🔨 Build Issues

### "Build failed" - TypeScript Errors

**Problem:** Build fails with TypeScript compilation errors.

```
error TS2307: Cannot find module '@3asoftwares/types'
```

**Solution:**

```bash
# Build in correct order
yarn build:packages     # First: shared packages
yarn build:services     # Then: backend services
yarn build:frontend     # Finally: frontend apps
```

---

### Out of Memory During Build

**Problem:** Node.js runs out of memory.

```
FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed - JavaScript heap out of memory
```

**Solution:**

```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# Then run build
yarn build
```

Or add to `package.json`:

```json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' your-build-command"
  }
}
```

---

### ESLint/Prettier Conflicts

**Problem:** Formatting conflicts between ESLint and Prettier.

**Solution:**

```bash
# Format first, then lint
yarn format
yarn lint:fix
```

---

## 🐳 Docker Issues

### Containers Not Starting

**Problem:** `docker-compose up` fails.

**Solution:**

```bash
# 1. Check Docker is running
docker info

# 2. Remove old containers and volumes
docker-compose down -v

# 3. Rebuild and start
docker-compose up --build

# 4. Check logs
docker-compose logs -f mongodb
docker-compose logs -f redis
```

---

### MongoDB Connection Refused

**Problem:** Services can't connect to MongoDB.

```
MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**

```bash
# 1. Check MongoDB is running
docker ps | grep mongo

# 2. Check MongoDB logs
docker-compose logs mongodb

# 3. Verify connection string
# Should be: mongodb://admin:password@localhost:27017/ecommerce?authSource=admin

# 4. Restart MongoDB
docker-compose restart mongodb
```

---

### Redis Connection Failed

**Problem:** Cache operations fail.

```
Error: Redis connection to localhost:6379 failed
```

**Solution:**

```bash
# 1. Check Redis is running
docker ps | grep redis

# 2. Test Redis
docker exec -it e-storefront-redis redis-cli ping
# Should return: PONG

# 3. Restart Redis
docker-compose restart redis
```

---

## 🗄️ Database Issues

### MongoDB Authentication Failed

**Problem:** Invalid credentials error.

```
MongoServerError: Authentication failed
```

**Solution:**

```bash
# 1. Check credentials in .env match docker-compose.yml
# Default: admin / password

# 2. Reset MongoDB (warning: deletes data)
docker-compose down -v
docker-compose up -d mongodb

# 3. Check connection string format
# mongodb://admin:password@localhost:27017/ecommerce?authSource=admin
```

---

### Data Not Persisting

**Problem:** Data is lost after restart.

**Solution:**

```bash
# Check volumes exist
docker volume ls | grep e-storefront

# If missing, they weren't created properly
# Recreate with:
docker-compose down -v
docker-compose up -d
```

---

### Seed Data Issues

**Problem:** Database is empty.

**Solution:**

```bash
# Run seed script
yarn workspace @e-storefront/generate-data run seed

# Or manually via MongoDB
docker exec -it e-storefront-mongodb mongosh -u admin -p password --authenticationDatabase admin
use ecommerce
db.products.countDocuments()
```

---

## 🔐 Authentication Issues

### JWT Token Expired

**Problem:** Getting 401 errors despite valid login.

**Solution:**

1. Access tokens expire in 15 minutes (by design)
2. Refresh token should automatically get new access token
3. Check refresh token endpoint is working

```bash
# Test refresh
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation { refreshToken { accessToken } }"}'
```

---

### Google OAuth Not Working

**Problem:** Google login fails.

**Solution:**

1. Verify `GOOGLE_CLIENT_ID` is set correctly
2. Check authorized redirect URIs in Google Console
3. Ensure callback URL matches exactly:
   - Dev: `http://localhost:4000/auth/google/callback`
   - Prod: `https://api.3asoftwares.com/auth/google/callback`

---

### CORS Errors

**Problem:** Browser blocks API requests.

```
Access to fetch at 'http://localhost:4000' has been blocked by CORS policy
```

**Solution:**

Check CORS configuration in GraphQL Gateway:

```typescript
// services/graphql-gateway/src/index.ts
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
    credentials: true,
  })
);
```

---

## 📦 Package Issues

### Publishing to npm Fails

**Problem:** `npm publish` returns error.

```
npm ERR! 403 Forbidden - You do not have permission to publish
```

**Solution:**

```bash
# 1. Check you're logged in
npm whoami

# 2. Verify access to scope
npm access ls-packages @3asoftwares

# 3. Check if version already exists
npm view @3asoftwares/types versions

# 4. Bump version if needed
npm version patch
npm publish --access public
```

---

### Package Version Conflicts

**Problem:** Dependency version mismatches.

**Solution:**

```bash
# 1. Check for conflicts
yarn why <package-name>

# 2. Update all instances
yarn upgrade <package-name>

# 3. Force resolution in package.json
{
  "resolutions": {
    "react": "18.2.0"
  }
}

# 4. Reinstall
rm -rf node_modules yarn.lock
yarn install
```

---

## 🔄 CI/CD Issues

### GitHub Actions Failing

**Problem:** CI pipeline fails.

**Solution:**

1. Check the failing job logs in GitHub Actions
2. Common causes:
   - Missing environment variables/secrets
   - Node version mismatch
   - Test failures
   - Lint errors

```yaml
# Ensure secrets are set in repository settings
secrets:
  - NPM_TOKEN
  - VERCEL_TOKEN
  - RAILWAY_TOKEN
```

---

### Vercel Deployment Fails

**Problem:** Frontend deployment to Vercel fails.

**Solution:**

```bash
# 1. Test build locally
cd apps/shell-app
yarn build

# 2. Check environment variables in Vercel dashboard

# 3. Check vercel.json configuration

# 4. Review build logs in Vercel dashboard
```

---

### Railway Deployment Fails

**Problem:** Backend deployment to Railway fails.

**Solution:**

```bash
# 1. Check Dockerfile builds locally
docker build -t test-service ./services/auth-service

# 2. Verify environment variables in Railway

# 3. Check Railway logs for specific errors

# 4. Ensure health check endpoint responds
curl http://localhost:4001/health
```

---

## 🆘 Still Stuck?

### Get Help

1. **Search existing issues:** [GitHub Issues](https://github.com/3asoftwares/E-Storefront/issues)
2. **Ask in discussions:** [GitHub Discussions](https://github.com/3asoftwares/E-Storefront/discussions)
3. **Contact team:** devteam@3asoftwares.com

### When Reporting Issues

Include:

- Operating system
- Node.js version (`node -v`)
- Yarn version (`yarn -v`)
- Docker version (`docker -v`)
- Full error message/stack trace
- Steps to reproduce

---

© 2026 3A Softwares
