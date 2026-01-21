# SonarCloud

## Overview

**Website:** [https://sonarcloud.io](https://sonarcloud.io)  
**Category:** Code Quality & Security Analysis

SonarCloud is a cloud-based code quality and security service that continuously inspects code to detect bugs, vulnerabilities, and code smells. It integrates seamlessly with GitHub for automatic analysis on every push and pull request.

---

## Why SonarCloud?

### Benefits

| Benefit                  | Description                                   |
| ------------------------ | --------------------------------------------- |
| **Bug Detection**        | Find bugs before they reach production        |
| **Security Analysis**    | Detect vulnerabilities and security hotspots  |
| **Code Smells**          | Identify maintainability issues               |
| **Technical Debt**       | Track and reduce technical debt               |
| **Coverage Tracking**    | Monitor test coverage trends                  |
| **Quality Gates**        | Block merging if quality standards aren't met |
| **PR Decoration**        | See issues directly in pull requests          |
| **Free for Open Source** | No cost for public repositories               |

### Why We Use SonarCloud

1. **Automated Code Review** - Catches issues human reviewers might miss
2. **Consistent Standards** - Enforces team coding standards
3. **Security** - Identifies vulnerabilities early
4. **Metrics Tracking** - Monitors code health over time
5. **GitHub Integration** - Seamless CI/CD integration

---

## How SonarCloud Helps Our Project

### 1. Continuous Code Quality

```
Every Push/PR → SonarCloud Analysis → Quality Report
     │                   │                   │
     ▼                   ▼                   ▼
  Code Changes    Analyze for:        Show Results:
                  • Bugs              • In Dashboard
                  • Vulnerabilities   • In PR Comments
                  • Code Smells       • In GitHub Checks
                  • Coverage
```

### 2. Quality Gate Enforcement

```yaml
# Quality Gate Conditions
- Coverage >= 10% on new code
- Duplicated lines < 3%
- Maintainability rating: A
- Reliability rating: A
- Security rating: A
- No new bugs
- No new vulnerabilities
```

### 3. PR Analysis

Every pull request gets:

- ✅/❌ Quality gate status
- List of new issues introduced
- Coverage change
- Security hotspots
- Direct links to issues in code

---

## Configuration

### sonar-project.properties

```properties
# sonar-project.properties

# Project identification
sonar.projectKey=3asoftwares_E-Storefront-Web
sonar.organization=3asoftwares
sonar.projectName=E-Storefront-Web

# Source and test directories
sonar.sources=app,components,lib,store,types
sonar.tests=tests,cypress

# Exclusions
sonar.exclusions=\
  **/node_modules/**,\
  **/.next/**,\
  **/coverage/**,\
  **/public/**,\
  **/*.config.js,\
  **/*.config.mjs,\
  **/*.config.ts,\
  **/tests/__mocks__/**,\
  **/*.d.ts

# Test file patterns
sonar.test.inclusions=\
  tests/**/*.test.ts,\
  tests/**/*.test.tsx,\
  cypress/**/*.cy.ts

# Coverage report path
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.typescript.lcov.reportPaths=coverage/lcov.info

# Language settings
sonar.language=ts
sonar.sourceEncoding=UTF-8
```

### GitHub Actions Workflow

```yaml
# .github/workflows/sonar.yml
name: SonarCloud Analysis

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  sonarcloud:
    name: SonarCloud Scan
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0 # Full history for accurate blame

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests with coverage
        run: npm run test:coverage

      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

---

## Setting Up SonarCloud

### Step 1: Create Account

1. Go to [sonarcloud.io](https://sonarcloud.io)
2. Sign in with GitHub
3. Authorize SonarCloud to access your repositories

### Step 2: Import Project

1. Click "+" → "Analyze new project"
2. Select `3asoftwares/E-Storefront-Web`
3. Choose analysis method: "With GitHub Actions"

### Step 3: Generate Token

1. Go to My Account → Security
2. Generate a new token for this project
3. Add to GitHub Secrets as `SONAR_TOKEN`

### Step 4: Add Configuration

Create `sonar-project.properties` in project root with the configuration above.

### Step 5: Run First Analysis

Push to trigger the GitHub Action:

```bash
git add sonar-project.properties
git commit -m "Add SonarCloud configuration"
git push
```

---

## Understanding SonarCloud Metrics

### Key Metrics

| Metric                | Description                              | Our Target |
| --------------------- | ---------------------------------------- | ---------- |
| **Bugs**              | Code that will cause unexpected behavior | 0 new      |
| **Vulnerabilities**   | Security issues that can be exploited    | 0 new      |
| **Code Smells**       | Maintainability issues                   | A rating   |
| **Coverage**          | Percentage of code tested                | ≥ 10%      |
| **Duplications**      | Repeated code blocks                     | < 3%       |
| **Security Hotspots** | Code requiring manual security review    | Review all |

### Ratings

| Rating | Meaning                              |
| ------ | ------------------------------------ |
| **A**  | Excellent (0 issues)                 |
| **B**  | Good (at least 1 minor issue)        |
| **C**  | Fair (at least 1 major issue)        |
| **D**  | Poor (at least 1 critical issue)     |
| **E**  | Very Poor (at least 1 blocker issue) |

### Issue Severities

```
┌─────────────┬────────────────────────────────────────────┐
│  Severity   │  Description                               │
├─────────────┼────────────────────────────────────────────┤
│  Blocker    │  High probability to impact app behavior   │
│  Critical   │  Low probability to impact, or security    │
│  Major      │  Significant impact on productivity        │
│  Minor      │  Minor impact on productivity              │
│  Info       │  Neither bug nor quality flaw              │
└─────────────┴────────────────────────────────────────────┘
```

---

## Common Issues & Fixes

### 1. Unused Variables

```typescript
// ❌ SonarCloud: Remove unused variable
const unusedValue = getData();

// ✅ Fixed: Use or remove
const data = getData();
processData(data);
```

### 2. Cognitive Complexity

```typescript
// ❌ SonarCloud: Reduce cognitive complexity (score: 25)
function processOrder(order) {
  if (order.status === 'new') {
    if (order.items.length > 0) {
      for (const item of order.items) {
        if (item.stock > 0) {
          // nested logic...
        }
      }
    }
  }
}

// ✅ Fixed: Extract functions, reduce nesting
function processOrder(order: Order) {
  if (!isNewOrder(order)) return;
  if (!hasItems(order)) return;

  order.items.filter(hasStock).forEach(processItem);
}

function isNewOrder(order: Order) {
  return order.status === 'new';
}

function hasItems(order: Order) {
  return order.items.length > 0;
}

function hasStock(item: OrderItem) {
  return item.stock > 0;
}
```

### 3. Duplicate Code

```typescript
// ❌ SonarCloud: Duplicated blocks of code
function calculateDiscount(price: number, code: string) {
  if (code === 'SAVE10') return price * 0.1;
  if (code === 'SAVE20') return price * 0.2;
  if (code === 'SAVE30') return price * 0.3;
  return 0;
}

// ✅ Fixed: Use a map
const DISCOUNT_CODES: Record<string, number> = {
  SAVE10: 0.1,
  SAVE20: 0.2,
  SAVE30: 0.3,
};

function calculateDiscount(price: number, code: string) {
  return price * (DISCOUNT_CODES[code] ?? 0);
}
```

### 4. Security Hotspots

```typescript
// ⚠️ SonarCloud: Security hotspot - hardcoded credentials
const API_KEY = 'sk-12345-secret-key';

// ✅ Fixed: Use environment variables
const API_KEY = process.env.API_KEY;
```

### 5. Unhandled Promise

```typescript
// ❌ SonarCloud: Use await or handle promise
async function fetchData() {
  fetch('/api/data'); // Promise not handled
}

// ✅ Fixed: Properly handle
async function fetchData() {
  const response = await fetch('/api/data');
  return response.json();
}
```

---

## Quality Gates

### Default Quality Gate Conditions

```yaml
New Code:
  - Coverage: ≥ 10%
  - Duplicated Lines: < 3%
  - Maintainability Rating: A
  - Reliability Rating: A
  - Security Rating: A
  - Security Hotspots Reviewed: 100%
```

### PR Checks

When a PR is opened, SonarCloud:

1. Analyzes only new/changed code
2. Comments on PR with findings
3. Updates GitHub check status
4. Blocks merge if quality gate fails

```
┌──────────────────────────────────────────────────┐
│  Pull Request #42: Add checkout validation       │
├──────────────────────────────────────────────────┤
│  ✅ SonarCloud Quality Gate passed               │
│                                                  │
│  📊 Analysis Summary:                            │
│  ┌─────────────────────────────────────────┐    │
│  │ Coverage on New Code:     78.5%         │    │
│  │ Duplicated Lines:         0.0%          │    │
│  │ New Issues:               0             │    │
│  │ Security Hotspots:        0             │    │
│  └─────────────────────────────────────────┘    │
└──────────────────────────────────────────────────┘
```

---

## Dashboard Overview

### Main Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│  E-Storefront-Web                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │   Bugs   │  │  Vulns   │  │  Smells  │  │    Coverage      │ │
│  │    A     │  │    A     │  │    A     │  │      17%         │ │
│  │    0     │  │    0     │  │   12     │  │   ▓▓░░░░░░░░    │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Quality Gate: ✅ Passed                                   │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  Recent Activity:                                                │
│  • main - 2h ago - Passed                                       │
│  • PR #45 - 4h ago - Passed                                     │
│  • develop - 1d ago - Passed                                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Viewing Issues

Navigate to: **Issues** → Filter by:

- Severity (Blocker, Critical, Major, Minor)
- Type (Bug, Vulnerability, Code Smell)
- Status (Open, Confirmed, Fixed)
- Assignee
- Tag

---

## Best Practices

### 1. Fix Issues Before Merging

```bash
# Check SonarCloud status before merging
# PRs should not merge with failing quality gate
```

### 2. Review Security Hotspots

```
Security Hotspots ≠ Vulnerabilities
They require human review to determine if they're safe
```

### 3. Maintain Coverage

```typescript
// Add tests for new code
// Target: New code coverage ≥ 80%
```

### 4. Address Technical Debt

```
Regularly review and reduce:
- Code smells
- Duplications
- Complex functions
```

### 5. Use Exclusions Wisely

```properties
# Only exclude generated/third-party code
sonar.exclusions=**/generated/**,**/vendor/**

# Don't exclude your source code to hide issues!
```

---

## Useful Links

| Resource              | URL                                                               |
| --------------------- | ----------------------------------------------------------------- |
| **Project Dashboard** | `sonarcloud.io/dashboard?id=3asoftwares_E-Storefront-Web`         |
| **Issues**            | `sonarcloud.io/project/issues?id=3asoftwares_E-Storefront-Web`    |
| **Security Hotspots** | `sonarcloud.io/security_hotspots?id=3asoftwares_E-Storefront-Web` |
| **Code**              | `sonarcloud.io/code?id=3asoftwares_E-Storefront-Web`              |
| **Activity**          | `sonarcloud.io/project/activity?id=3asoftwares_E-Storefront-Web`  |

---

## Resources

- [SonarCloud Documentation](https://docs.sonarcloud.io/)
- [JavaScript/TypeScript Rules](https://rules.sonarsource.com/javascript/)
- [Quality Gates](https://docs.sonarcloud.io/improving/quality-gates/)
- [GitHub Integration](https://docs.sonarcloud.io/getting-started/github/)
- [Cognitive Complexity](https://www.sonarsource.com/docs/CognitiveComplexity.pdf)
