# Code Reviews

## Overview

**Process:** Pull Request Reviews  
**Tools:** GitHub, GitLab  
**Category:** Quality Assurance

Code review is the systematic examination of source code by team members to improve code quality and share knowledge.

---

## Why Code Reviews?

### Benefits

| Benefit               | Description                      |
| --------------------- | -------------------------------- |
| **Quality**           | Catch bugs before production     |
| **Knowledge Sharing** | Spread understanding across team |
| **Consistency**       | Maintain coding standards        |
| **Learning**          | Learn from each other            |
| **Security**          | Identify vulnerabilities early   |

### Why We Do Code Reviews

1. **Quality Gate** - All code is reviewed before merge
2. **Mentoring** - Senior devs guide juniors
3. **Standards** - Enforce coding conventions
4. **Bus Factor** - Multiple people understand code
5. **Documentation** - PRs serve as change history

---

## Review Process

```
┌─────────────────────────────────────────────────────────────┐
│                    Code Review Process                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. CREATE PR                                                │
│     ├── Write descriptive title                              │
│     ├── Fill PR template                                     │
│     ├── Self-review changes                                  │
│     ├── Add reviewers                                        │
│     └── Link related issues                                  │
│                                                              │
│  2. AUTOMATED CHECKS                                         │
│     ├── CI/CD pipeline                                       │
│     ├── Linting (ESLint, Prettier)                           │
│     ├── Tests (Jest, Cypress)                                │
│     └── SonarCloud analysis                                  │
│                                                              │
│  3. REVIEW                                                   │
│     ├── Read PR description                                  │
│     ├── Review code changes                                  │
│     ├── Check test coverage                                  │
│     ├── Leave comments                                       │
│     └── Approve or request changes                           │
│                                                              │
│  4. ADDRESS FEEDBACK                                         │
│     ├── Respond to comments                                  │
│     ├── Make requested changes                               │
│     ├── Push new commits                                     │
│     └── Re-request review                                    │
│                                                              │
│  5. MERGE                                                    │
│     ├── Get required approvals                               │
│     ├── Ensure all checks pass                               │
│     ├── Squash and merge                                     │
│     └── Delete branch                                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## PR Template

```markdown
<!-- .github/pull_request_template.md -->

## Description

<!-- What changes are you making and why? -->

## Type of Change

- [ ] 🐛 Bug fix (non-breaking change fixing an issue)
- [ ] ✨ New feature (non-breaking change adding functionality)
- [ ] 💥 Breaking change (fix or feature causing existing functionality to change)
- [ ] 📚 Documentation update
- [ ] 🔧 Refactoring (no functional changes)

## Related Issues

<!-- Link to related issues: Fixes #123 -->

## How Has This Been Tested?

<!-- Describe the tests you ran -->

- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual testing

## Screenshots (if applicable)

<!-- Add screenshots for UI changes -->

## Checklist

- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing unit tests pass locally
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
```

---

## Review Guidelines

### For Authors

```markdown
## Before Requesting Review

✅ Self-review your code first
✅ Ensure all tests pass
✅ Write clear PR description
✅ Keep PRs small (<400 lines ideal)
✅ One logical change per PR
✅ Respond to feedback promptly
✅ Don't take feedback personally
```

### For Reviewers

```markdown
## Review Checklist

### Code Quality

- [ ] Code is readable and maintainable
- [ ] No unnecessary complexity
- [ ] No code duplication
- [ ] Follows project conventions
- [ ] Proper error handling

### Logic

- [ ] Business logic is correct
- [ ] Edge cases handled
- [ ] No security vulnerabilities
- [ ] Performance is acceptable

### Testing

- [ ] Tests are comprehensive
- [ ] Tests are readable
- [ ] Edge cases covered

### Documentation

- [ ] Code is self-documenting
- [ ] Complex logic is commented
- [ ] API docs updated if needed
```

---

## Comment Types

### Comment Prefixes

| Prefix        | Meaning                        |
| ------------- | ------------------------------ |
| `nit:`        | Minor suggestion, optional     |
| `suggestion:` | Recommendation for improvement |
| `question:`   | Asking for clarification       |
| `blocker:`    | Must be addressed before merge |
| `praise:`     | Positive feedback              |

### Examples

```markdown
// nit: Consider using const instead of let here since the value doesn't change

// suggestion: This could be simplified using optional chaining
// Before: user && user.address && user.address.city
// After: user?.address?.city

// question: Why are we fetching this data here instead of in the parent?

// blocker: This SQL query is vulnerable to injection. Please use parameterized queries.

// praise: Great abstraction! This makes the code much more reusable.
```

---

## Review Response

### Addressing Comments

```typescript
// Original comment:
// suggestion: Consider using a Map for O(1) lookup

// Author response:
// Good point! I've updated to use Map. See commit abc123.

// Or if disagreeing:
// I considered Map, but we need to maintain insertion order
// and the array is always small (<10 items), so the O(n) lookup
// is acceptable. Let me know if you still think Map is better.
```

### Resolving Conversations

```markdown
## Conversation Resolution

✅ Author resolves when change is made
✅ Reviewer resolves when satisfied
✅ Don't resolve without addressing
✅ Use "Request changes" for blockers
```

---

## Approval Requirements

```yaml
# .github/CODEOWNERS
# Default owners
* @team-leads

# Specific paths
/services/auth-service/ @security-team
/packages/ui-library/ @frontend-team
/devops/ @devops-team

# Branch protection rules
main:
  required_approvals: 2
  require_code_owners: true
  dismiss_stale_reviews: true
  require_status_checks:
    - ci/test
    - ci/lint
    - sonarcloud
```

---

## Review Etiquette

### Do's

```markdown
✅ Be respectful and constructive
✅ Explain the "why" behind suggestions
✅ Offer solutions, not just criticism
✅ Acknowledge good work
✅ Be timely with reviews
✅ Ask questions if unclear
```

### Don'ts

```markdown
❌ Don't be condescending
❌ Don't nitpick excessively
❌ Don't approve without reviewing
❌ Don't block for personal preference
❌ Don't take feedback personally
❌ Don't merge without addressing feedback
```

---

## Knowledge Sharing

### Through Reviews

```markdown
## Mentoring Opportunities

1. Explain concepts when suggesting changes
2. Share links to documentation
3. Pair on complex changes
4. Discuss architectural decisions
5. Review together for complex PRs
```

### Documentation

```markdown
## Learning from Reviews

- Create wiki articles from common feedback
- Add to coding guidelines
- Share in team meetings
- Update linting rules
```

---

## Best Practices

1. **Review within 24 hours** - Don't block teammates
2. **Small PRs** - Easier to review thoroughly
3. **Use suggestions** - GitHub's suggestion feature
4. **Batch comments** - Submit all at once
5. **Follow up** - Ensure feedback is addressed
6. **Celebrate** - Acknowledge good work

---

## Related Documentation

- [GIT.md](GIT.md) - Git workflow
- [CI_CD.md](CI_CD.md) - Automated checks
- [AGILE_SCRUM.md](AGILE_SCRUM.md) - Development process
