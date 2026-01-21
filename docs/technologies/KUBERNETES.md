# Kubernetes

## Overview

**Version:** 1.28+  
**Website:** [https://kubernetes.io](https://kubernetes.io)  
**Category:** Container Orchestration

Kubernetes (K8s) is an open-source container orchestration platform that automates deployment, scaling, and management of containerized applications.

---

## Why Kubernetes?

### Benefits

| Benefit               | Description                                      |
| --------------------- | ------------------------------------------------ |
| **Auto-scaling**      | Scale pods based on CPU/memory or custom metrics |
| **Self-healing**      | Automatically restarts failed containers         |
| **Load Balancing**    | Distributes traffic across pods                  |
| **Rolling Updates**   | Zero-downtime deployments                        |
| **Service Discovery** | Built-in DNS for service communication           |
| **Secret Management** | Secure storage for sensitive data                |

### Why We Chose Kubernetes

1. **Microservices** - Perfect for managing our 7+ microservices
2. **Scalability** - Handle traffic spikes during sales events
3. **Reliability** - Self-healing ensures high availability
4. **Cloud Agnostic** - Works on AWS, GCP, Azure, or on-prem
5. **DevOps Culture** - Infrastructure as code with GitOps

---

## How to Use Kubernetes

### Deployment Structure

```
devops/k8s/
├── base/
│   ├── namespace.yaml
│   ├── configmap.yaml
│   └── secrets.yaml
├── services/
│   ├── auth-service/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── hpa.yaml
│   ├── product-service/
│   ├── order-service/
│   └── graphql-gateway/
├── ingress/
│   └── ingress.yaml
└── monitoring/
    ├── prometheus.yaml
    └── grafana.yaml
```

### Deployment Manifest

```yaml
# services/auth-service/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-service
  namespace: e-storefront
  labels:
    app: auth-service
spec:
  replicas: 3
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
            - containerPort: 3011
          env:
            - name: NODE_ENV
              value: production
            - name: MONGODB_URI
              valueFrom:
                secretKeyRef:
                  name: mongodb-secret
                  key: uri
            - name: JWT_SECRET
              valueFrom:
                secretKeyRef:
                  name: jwt-secret
                  key: secret
          resources:
            requests:
              memory: '256Mi'
              cpu: '250m'
            limits:
              memory: '512Mi'
              cpu: '500m'
          livenessProbe:
            httpGet:
              path: /health
              port: 3011
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /health
              port: 3011
            initialDelaySeconds: 5
            periodSeconds: 5
```

### Service Manifest

```yaml
# services/auth-service/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: auth-service
  namespace: e-storefront
spec:
  selector:
    app: auth-service
  ports:
    - port: 3011
      targetPort: 3011
  type: ClusterIP
```

### Horizontal Pod Autoscaler

```yaml
# services/auth-service/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: auth-service-hpa
  namespace: e-storefront
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: auth-service
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

---

## How Kubernetes Helps Our Project

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      Kubernetes Cluster (AWS EKS)                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                          Ingress Controller                      │   │
│  │                     (NGINX / AWS ALB Ingress)                    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                   │                                     │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      e-storefront namespace                      │   │
│  │                                                                  │   │
│  │  ┌─────────────────────────────────────────────────────────┐   │   │
│  │  │                  GraphQL Gateway                         │   │   │
│  │  │              (3 replicas, LoadBalancer)                  │   │   │
│  │  └─────────────────────────────────────────────────────────┘   │   │
│  │                              │                                  │   │
│  │    ┌─────────┬─────────┬─────────┬─────────┬─────────┐        │   │
│  │    ▼         ▼         ▼         ▼         ▼         │        │   │
│  │  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐       │        │   │
│  │  │Auth │  │Prod │  │Order│  │Categ│  │Coup │       │        │   │
│  │  │ x3  │  │ x3  │  │ x3  │  │ x2  │  │ x2  │       │        │   │
│  │  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘       │        │   │
│  │                                                     │        │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      Data Layer (StatefulSets)                   │   │
│  │  ┌───────────────┐      ┌───────────────┐                       │   │
│  │  │   MongoDB     │      │     Redis     │                       │   │
│  │  │   Cluster     │      │    Cluster    │                       │   │
│  │  └───────────────┘      └───────────────┘                       │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Common Commands

```bash
# Apply manifests
kubectl apply -f devops/k8s/

# Check pods
kubectl get pods -n e-storefront

# Check services
kubectl get svc -n e-storefront

# View logs
kubectl logs -f deployment/auth-service -n e-storefront

# Scale deployment
kubectl scale deployment auth-service --replicas=5 -n e-storefront

# Rollout status
kubectl rollout status deployment/auth-service -n e-storefront

# Rollback
kubectl rollout undo deployment/auth-service -n e-storefront
```

### Ingress Configuration

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: e-storefront-ingress
  namespace: e-storefront
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
    - hosts:
        - api.3asoftwares.com
      secretName: api-tls
  rules:
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

## Best Practices

### Resource Management

```yaml
resources:
  requests:
    memory: '256Mi'
    cpu: '250m'
  limits:
    memory: '512Mi'
    cpu: '500m'
```

### Health Checks

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 3011
  initialDelaySeconds: 30
  periodSeconds: 10
readinessProbe:
  httpGet:
    path: /ready
    port: 3011
  initialDelaySeconds: 5
  periodSeconds: 5
```

### ConfigMaps and Secrets

```yaml
# Never hardcode secrets
env:
  - name: JWT_SECRET
    valueFrom:
      secretKeyRef:
        name: jwt-secret
        key: secret
```

---

## Related Documentation

- [DOCKER.md](DOCKER.md) - Container creation
- [CI_CD.md](CI_CD.md) - Deployment pipelines
