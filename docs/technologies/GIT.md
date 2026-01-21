# Git & Version Control

## Overview

**Tools:** Git, GitHub, GitLab  
**Category:** Version Control  
**Workflow:** Git Flow / Trunk-Based

Git is a distributed version control system that tracks changes in source code during software development.

---

## Why Git?

### Benefits

| Benefit             | Description                       |
| ------------------- | --------------------------------- |
| **Version History** | Complete history of all changes   |
| **Branching**       | Parallel development streams      |
| **Collaboration**   | Multiple developers work together |
| **Backup**          | Distributed copies of repository  |
| **Traceability**    | Know who changed what and when    |

### Why We Use Git

1. **Team Collaboration** - Multiple developers, one codebase
2. **Code Review** - PR-based workflow
3. **CI/CD** - Automated pipelines
4. **Rollback** - Revert to any previous state
5. **Feature Isolation** - Feature branches

---

## Branching Strategy

### Git Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Git Flow Strategy                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  main ─────●─────────────────●──────────────────●──────▶    │
│             ╲                ╱                  ╱             │
│              ╲              ╱                  ╱              │
│  release ─────●────────────●                  ╱               │
│               ╲            ╱                 ╱                │
│                ╲          ╱                 ╱                 │
│  develop ───────●────●───●────●────●──────●─────────────▶   │
│                 ╲   ╱    ╲   ╱                               │
│                  ╲ ╱      ╲ ╱                                │
│  feature/xxx ─────●        ●                                 │
│                                                              │
│  Branch Types:                                               │
│  ├── main      - Production-ready code                       │
│  ├── develop   - Integration branch                          │
│  ├── feature/* - New features                                │
│  ├── release/* - Release preparation                         │
│  ├── hotfix/*  - Production fixes                            │
│  └── bugfix/*  - Bug fixes for develop                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Branch Naming

```bash
# Features
feature/user-authentication
feature/add-payment-gateway
feature/JIRA-123-cart-functionality

# Bug fixes
bugfix/cart-total-calculation
bugfix/JIRA-456-login-redirect

# Hotfixes
hotfix/critical-security-patch
hotfix/payment-timeout-fix

# Releases
release/v1.2.0
release/2024-01
```

---

## Common Git Commands

### Daily Workflow

```bash
# Start new feature
git checkout develop
git pull origin develop
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add user authentication"

# Push and create PR
git push -u origin feature/new-feature

# Update from develop
git fetch origin
git rebase origin/develop

# After PR is merged
git checkout develop
git pull origin develop
git branch -d feature/new-feature
```

### Useful Commands

```bash
# View status
git status
git log --oneline -10
git diff

# Stash changes
git stash
git stash pop
git stash list

# Undo changes
git checkout -- <file>          # Discard file changes
git reset HEAD <file>           # Unstage file
git reset --soft HEAD~1         # Undo last commit (keep changes)
git reset --hard HEAD~1         # Undo last commit (discard changes)

# Interactive rebase
git rebase -i HEAD~3            # Squash/edit last 3 commits

# Cherry-pick
git cherry-pick <commit-hash>   # Apply specific commit

# View branches
git branch -a                   # All branches
git branch -vv                  # With tracking info
```

---

## Commit Messages

### Conventional Commits

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type       | Purpose                     |
| ---------- | --------------------------- |
| `feat`     | New feature                 |
| `fix`      | Bug fix                     |
| `docs`     | Documentation changes       |
| `style`    | Formatting (no code change) |
| `refactor` | Code refactoring            |
| `test`     | Adding/updating tests       |
| `chore`    | Maintenance tasks           |
| `perf`     | Performance improvements    |
| `ci`       | CI/CD changes               |

### Examples

```bash
# Features
git commit -m "feat(auth): add Google OAuth login"
git commit -m "feat(cart): implement quantity update"

# Bug fixes
git commit -m "fix(checkout): resolve payment timeout issue"
git commit -m "fix(product): correct price calculation"

# Documentation
git commit -m "docs: update API documentation"

# Breaking changes
git commit -m "feat(api)!: change response format

BREAKING CHANGE: API response now wraps data in 'data' field"
```

---

## GitHub Workflow

### Pull Request Process

```
┌─────────────────────────────────────────────────────────────┐
│                    Pull Request Flow                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Create Branch                                            │
│     git checkout -b feature/xyz                              │
│                                                              │
│  2. Make Changes & Commit                                    │
│     git add . && git commit -m "feat: ..."                   │
│                                                              │
│  3. Push to Remote                                           │
│     git push -u origin feature/xyz                           │
│                                                              │
│  4. Create Pull Request                                      │
│     - Fill PR template                                       │
│     - Add reviewers                                          │
│     - Link issues                                            │
│                                                              │
│  5. Automated Checks                                         │
│     - CI/CD pipeline                                         │
│     - Linting                                                │
│     - Tests                                                  │
│     - SonarCloud                                             │
│                                                              │
│  6. Code Review                                              │
│     - Review comments                                        │
│     - Request changes                                        │
│     - Approve                                                │
│                                                              │
│  7. Merge                                                    │
│     - Squash and merge                                       │
│     - Delete branch                                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### PR Template

```markdown
<!-- .github/pull_request_template.md -->

## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues

Closes #123

## Checklist

- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No console.log statements
- [ ] Self-reviewed

## Screenshots (if applicable)
```

---

## .gitignore

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Build outputs
dist/
build/
.next/
out/

# Environment
.env
.env.local
.env.*.local

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Testing
coverage/
.nyc_output/

# Logs
logs/
*.log
npm-debug.log*

# Cache
.cache/
.turbo/
.eslintcache
```

---

## Git Hooks (Husky)

```json
// package.json
{
  "scripts": {
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
  }
}
```

```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged

# .husky/commit-msg
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx --no-install commitlint --edit $1
```

---

## Best Practices

1. **Commit Often** - Small, focused commits
2. **Write Good Messages** - Follow conventional commits
3. **Pull Before Push** - Stay up to date
4. **Review Before Merge** - Always get reviews
5. **Don't Commit Secrets** - Use .gitignore and env files
6. **Clean History** - Squash/rebase when appropriate

---

## Related Documentation

- [CI_CD.md](CI_CD.md) - GitHub Actions
- [CODE_REVIEWS.md](CODE_REVIEWS.md) - Review process
- [AGILE_SCRUM.md](AGILE_SCRUM.md) - Development process
