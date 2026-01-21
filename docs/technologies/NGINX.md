# NGINX

## Overview

**Version:** 1.24+  
**Category:** Web Server / Reverse Proxy  
**Deployment:** Docker, Kubernetes

NGINX is a high-performance HTTP server, reverse proxy, and load balancer.

---

## Why NGINX?

### Benefits

| Benefit               | Description                                        |
| --------------------- | -------------------------------------------------- |
| **Performance**       | Handles thousands of concurrent connections        |
| **Reverse Proxy**     | Route traffic to backend services                  |
| **Load Balancing**    | Distribute traffic across instances                |
| **SSL Termination**   | Handle HTTPS at the edge                           |
| **Static Files**      | Efficiently serve static assets                    |
| **Caching**           | Cache responses for faster delivery               |

### Why We Use NGINX

1. **API Gateway** - Single entry point for all services
2. **SSL** - Handle HTTPS termination
3. **Static Assets** - Serve frontend builds
4. **Load Balancing** - Distribute traffic
5. **Microservices** - Route to correct service

---

## Configuration

### Basic Server Block

```nginx
# devops/nginx/nginx.conf
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript 
               application/rss+xml application/atom+xml image/svg+xml;

    include /etc/nginx/conf.d/*.conf;
}
```

### Reverse Proxy Configuration

```nginx
# devops/nginx/conf.d/default.conf
upstream graphql_gateway {
    server graphql-gateway:3000;
    keepalive 32;
}

upstream web_app {
    server web-app:3000;
    keepalive 32;
}

server {
    listen 80;
    server_name www.3asoftwares.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name www.3asoftwares.com;

    # SSL Configuration
    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;

    # Modern SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;

    # HSTS
    add_header Strict-Transport-Security "max-age=63072000" always;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # GraphQL API
    location /graphql {
        proxy_pass http://graphql_gateway;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 90;
    }

    # Next.js App
    location / {
        proxy_pass http://web_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files with caching
    location /_next/static {
        proxy_pass http://web_app;
        proxy_cache_valid 60m;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Health check
    location /health {
        access_log off;
        return 200 "OK\n";
        add_header Content-Type text/plain;
    }
}
```

---

## Load Balancing

```nginx
# Round-robin (default)
upstream api_servers {
    server api-1:3000;
    server api-2:3000;
    server api-3:3000;
}

# Least connections
upstream api_servers {
    least_conn;
    server api-1:3000;
    server api-2:3000;
    server api-3:3000;
}

# IP hash (sticky sessions)
upstream api_servers {
    ip_hash;
    server api-1:3000;
    server api-2:3000;
    server api-3:3000;
}

# Weighted
upstream api_servers {
    server api-1:3000 weight=5;
    server api-2:3000 weight=3;
    server api-3:3000 weight=2;
}

# With health checks
upstream api_servers {
    server api-1:3000 max_fails=3 fail_timeout=30s;
    server api-2:3000 max_fails=3 fail_timeout=30s;
    server api-3:3000 backup;
}
```

---

## Caching

```nginx
# Cache zone configuration
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m 
                 max_size=1g inactive=60m use_temp_path=off;

server {
    # API caching
    location /api/products {
        proxy_pass http://api_servers;
        proxy_cache api_cache;
        proxy_cache_valid 200 10m;
        proxy_cache_valid 404 1m;
        proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
        proxy_cache_background_update on;
        proxy_cache_lock on;
        
        add_header X-Cache-Status $upstream_cache_status;
    }

    # Bypass cache for authenticated requests
    location /api/user {
        proxy_pass http://api_servers;
        proxy_cache_bypass $http_authorization;
        proxy_no_cache $http_authorization;
    }
}
```

---

## Rate Limiting

```nginx
# Define rate limit zones
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=login_limit:10m rate=1r/s;

server {
    # API rate limiting
    location /api {
        limit_req zone=api_limit burst=20 nodelay;
        limit_req_status 429;
        proxy_pass http://api_servers;
    }

    # Stricter limit for login
    location /api/auth/login {
        limit_req zone=login_limit burst=5 nodelay;
        limit_req_status 429;
        proxy_pass http://api_servers;
    }
}
```

---

## WebSocket Support

```nginx
# WebSocket configuration
map $http_upgrade $connection_upgrade {
    default upgrade;
    '' close;
}

server {
    location /ws {
        proxy_pass http://websocket_servers;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_set_header Host $host;
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
    }
}
```

---

## Docker Integration

```yaml
# docker-compose.yml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./devops/nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./devops/nginx/conf.d:/etc/nginx/conf.d:ro
      - ./devops/nginx/ssl:/etc/nginx/ssl:ro
      - nginx-cache:/var/cache/nginx
    depends_on:
      - graphql-gateway
      - web-app
    networks:
      - e-storefront
    healthcheck:
      test: ["CMD", "nginx", "-t"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  nginx-cache:

networks:
  e-storefront:
    driver: bridge
```

---

## Kubernetes Ingress

```yaml
# k8s/ingress/nginx-ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: e-storefront-ingress
  namespace: e-storefront
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/proxy-body-size: "10m"
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/rate-limit-window: "1m"
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
    - hosts:
        - www.3asoftwares.com
        - api.3asoftwares.com
      secretName: e-storefront-tls
  rules:
    - host: www.3asoftwares.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: web-app
                port:
                  number: 3000
    - host: api.3asoftwares.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: graphql-gateway
                port:
                  number: 3000
```

---

## Debugging

```bash
# Test configuration
nginx -t

# Reload configuration
nginx -s reload

# View logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Debug logging
error_log /var/log/nginx/error.log debug;
```

---

## Best Practices

1. **Test Before Reload** - Always run `nginx -t`
2. **Security Headers** - Add security headers
3. **SSL Best Practices** - Use modern TLS
4. **Rate Limiting** - Protect from abuse
5. **Caching** - Cache static assets
6. **Health Checks** - Monitor upstream servers

---

## Related Documentation

- [DOCKER.md](DOCKER.md) - Container deployment
- [KUBERNETES.md](KUBERNETES.md) - K8s ingress
- [PERFORMANCE.md](PERFORMANCE.md) - Optimization
