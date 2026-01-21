# Operations Runbook

## 📑 Table of Contents

- [Overview](#overview)
- [Service Health](#service-health)
- [Common Issues](#common-issues)
- [Incident Response](#incident-response)
- [Maintenance Tasks](#maintenance-tasks)
- [Monitoring & Alerts](#monitoring--alerts)

## 🌐 Overview

This runbook provides operational procedures for maintaining E-Storefront platform.

### Service URLs

| Service | Production | Staging |
|---------|------------|---------|
| Shell App | https://app.3asoftwares.com | https://staging.3asoftwares.com |
| Admin App | https://admin.3asoftwares.com | https://admin-staging.3asoftwares.com |
| API Gateway | https://api.3asoftwares.com | https://staging-api.3asoftwares.com |

### Contact Information

| Role | Contact |
|------|---------|
| On-Call Engineer | on-call@3asoftwares.com |
| Team Lead | lead@3asoftwares.com |
| DevOps | devops@3asoftwares.com |

## ❤️ Service Health

### Health Check Endpoints

```bash
# Check all services
curl https://api.3asoftwares.com/health

# Individual services
curl https://api.3asoftwares.com/health/auth
curl https://api.3asoftwares.com/health/product
curl https://api.3asoftwares.com/health/order
curl https://api.3asoftwares.com/health/gateway
```

### Expected Response

```json
{
  "status": "healthy",
  "timestamp": "2026-01-20T10:00:00Z",
  "services": {
    "auth": { "status": "healthy", "latency": 12 },
    "product": { "status": "healthy", "latency": 8 },
    "order": { "status": "healthy", "latency": 15 },
    "database": { "status": "healthy", "latency": 5 },
    "redis": { "status": "healthy", "latency": 2 }
  }
}
```

### Quick Health Check Script

```bash
#!/bin/bash
# health-check.sh

SERVICES=("auth" "product" "order" "category" "coupon" "ticket" "gateway")
API_URL="https://api.3asoftwares.com"

echo "🔍 Checking service health..."

for service in "${SERVICES[@]}"; do
  response=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/health/$service")
  if [ "$response" == "200" ]; then
    echo "✅ $service: healthy"
  else
    echo "❌ $service: unhealthy (HTTP $response)"
  fi
done
```

## 🔧 Common Issues

### Issue: Service Not Responding

**Symptoms:**
- 502/503 errors
- Timeout errors
- Health check failing

**Diagnosis:**
```bash
# Check Railway logs
railway logs -s <service-name>

# Check recent deployments
railway deployments -s <service-name>
```

**Resolution:**
```bash
# 1. Try restarting the service
railway restart -s <service-name>

# 2. If restart doesn't help, check for crashes
railway logs -s <service-name> --limit 100

# 3. Rollback if recent deployment
railway rollback -s <service-name>
```

---

### Issue: Database Connection Failed

**Symptoms:**
- "MongoDB connection error" in logs
- Services failing to start
- Timeout on database operations

**Diagnosis:**
```bash
# Check MongoDB Atlas status
# https://cloud.mongodb.com

# Test connection
mongosh "mongodb+srv://cluster.mongodb.net/ecommerce" --username admin
```

**Resolution:**
```bash
# 1. Check network access in Atlas
#    Network Access → IP Whitelist

# 2. Verify credentials
railway variables get MONGODB_URI -s <service>

# 3. Check connection pool
#    Clusters → Metrics → Connections

# 4. If IP issue, update whitelist
#    Network Access → Add IP → 0.0.0.0/0 (temporary)
```

---

### Issue: High Latency

**Symptoms:**
- Slow API responses (> 2s)
- Timeout errors
- Poor user experience

**Diagnosis:**
```bash
# Check service metrics in Railway
# Check Redis cache hit rate
redis-cli INFO stats | grep keyspace

# Check database slow queries
# MongoDB Atlas → Profiler
```

**Resolution:**
```bash
# 1. Scale up services
railway scale -s <service> --replicas 4

# 2. Clear Redis cache if corrupt
redis-cli FLUSHDB

# 3. Add database indexes
mongosh <connection-string> --eval "db.products.createIndex({name: 'text'})"

# 4. Check for N+1 queries in logs
```

---

### Issue: Memory Exhaustion

**Symptoms:**
- OOM (Out of Memory) errors
- Service restarts
- Degraded performance

**Diagnosis:**
```bash
# Check Railway metrics
# Service → Metrics → Memory

# Check for memory leaks in logs
railway logs -s <service> | grep -i "heap\|memory"
```

**Resolution:**
```bash
# 1. Restart service to free memory
railway restart -s <service>

# 2. Increase memory limit
railway scale -s <service> --memory 1024MB

# 3. Check for memory leaks in code
# Look for unclosed connections, large arrays
```

---

### Issue: Rate Limiting Triggered

**Symptoms:**
- 429 Too Many Requests
- API responses blocked
- Legitimate users affected

**Diagnosis:**
```bash
# Check rate limit logs
railway logs -s graphql-gateway | grep "rate limit"

# Check Redis rate limit keys
redis-cli KEYS "ratelimit:*"
```

**Resolution:**
```bash
# 1. Identify source of high traffic
railway logs -s graphql-gateway | grep "client-ip"

# 2. Temporarily increase limits (if legitimate)
railway variables set RATE_LIMIT_MAX=200 -s graphql-gateway

# 3. Block abusive IPs
# Add to Cloudflare firewall rules

# 4. Clear specific rate limit
redis-cli DEL "ratelimit:<ip>"
```

## 🚨 Incident Response

### Severity Levels

| Level | Description | Response Time | Examples |
|-------|-------------|---------------|----------|
| P1 | Critical | 15 min | Complete outage, data breach |
| P2 | High | 1 hour | Major feature broken, significant performance |
| P3 | Medium | 4 hours | Minor feature broken, degraded experience |
| P4 | Low | 24 hours | Cosmetic issues, minor bugs |

### Incident Response Procedure

```
1. ACKNOWLEDGE (5 min)
   □ Acknowledge alert
   □ Join incident channel (#incidents)
   □ Assign incident commander

2. ASSESS (10 min)
   □ Identify affected services
   □ Determine scope of impact
   □ Set severity level
   □ Notify stakeholders

3. MITIGATE (varies)
   □ Implement quick fix or rollback
   □ Scale up if needed
   □ Enable maintenance mode if necessary
   □ Update status page

4. RESOLVE
   □ Deploy fix
   □ Verify resolution
   □ Monitor for recurrence
   □ Update status page

5. POST-MORTEM (within 48 hours)
   □ Document timeline
   □ Identify root cause
   □ Create action items
   □ Share learnings
```

### Status Page Updates

```markdown
# Template for status updates

## [INVESTIGATING] Service Degradation
**Time:** 2026-01-20 10:00 UTC
**Affected:** Product API, Search
**Impact:** Slow product loading times

We are investigating reports of slow performance.
Updates will be provided every 30 minutes.

---

## [IDENTIFIED] Service Degradation  
**Time:** 2026-01-20 10:15 UTC

Root cause identified: Database connection pool exhaustion.
Working on fix. ETA: 30 minutes.

---

## [RESOLVED] Service Degradation
**Time:** 2026-01-20 10:45 UTC

Issue has been resolved. Connection pool limits increased.
All services operating normally.
```

## 🔄 Maintenance Tasks

### Daily

```bash
# Check health status
yarn health:verbose

# Review error logs
railway logs -s graphql-gateway | grep -i error | tail -50

# Check disk usage
# MongoDB Atlas → Metrics → Storage
```

### Weekly

```bash
# Review performance metrics
# Railway Dashboard → All Services → Metrics

# Check for dependency updates
yarn outdated

# Review security alerts
npm audit

# Database index optimization
# MongoDB Atlas → Performance Advisor
```

### Monthly

```bash
# Rotate secrets
# Update JWT_SECRET, API keys

# Test disaster recovery
# Restore from backup to test environment

# Review and archive logs
# Export old logs to cold storage

# Update documentation
# Review and update runbook
```

### Database Backup Verification

```bash
# Monthly backup test
# 1. Go to MongoDB Atlas → Backup
# 2. Select recent snapshot
# 3. Restore to test cluster
# 4. Verify data integrity

# Verify backup exists
mongosh <connection> --eval "db.adminCommand({listDatabases: 1})"
```

## 📊 Monitoring & Alerts

### Alert Thresholds

| Metric | Warning | Critical |
|--------|---------|----------|
| Response Time | > 1s | > 3s |
| Error Rate | > 1% | > 5% |
| CPU Usage | > 70% | > 90% |
| Memory Usage | > 70% | > 90% |
| Disk Usage | > 70% | > 90% |

### Alert Response

```
📧 ALERT: High Error Rate on product-service

Severity: Warning
Metric: Error Rate = 2.5%
Threshold: > 1%
Time: 2026-01-20 10:00 UTC

Actions:
1. Check recent deployments
2. Review error logs
3. Check downstream dependencies
4. Scale if under load
```

### Log Queries

```bash
# Find all errors in last hour
railway logs -s <service> --since 1h | grep -i error

# Find specific error type
railway logs -s <service> | grep "MongoError"

# Count errors by type
railway logs -s <service> | grep -i error | cut -d: -f1 | sort | uniq -c

# Find slow requests
railway logs -s graphql-gateway | grep "duration" | awk '$NF > 1000'
```

### Dashboard URLs

| Dashboard | URL |
|-----------|-----|
| Railway | https://railway.app/project/e-storefront |
| Vercel | https://vercel.com/3asoftwares |
| MongoDB Atlas | https://cloud.mongodb.com |
| Redis Cloud | https://app.redislabs.com |
| Uptime Robot | https://uptimerobot.com |

---

## 📞 Escalation Path

```
Level 1: On-Call Engineer
   ↓ (30 min no resolution)
Level 2: Team Lead
   ↓ (1 hour no resolution)
Level 3: Engineering Manager
   ↓ (2 hours for P1/P2)
Level 4: CTO
```

---

**Last Updated:** January 2026
**Owner:** DevOps Team
