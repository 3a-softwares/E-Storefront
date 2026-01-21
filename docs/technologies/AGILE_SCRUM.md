# Agile & Scrum

## Overview

**Methodology:** Agile / Scrum  
**Category:** Project Management  
**Tools:** Jira, GitHub Projects

Agile is an iterative approach to project management that enables teams to deliver value faster with higher quality.

---

## Why Agile?

### Benefits

| Benefit             | Description                         |
| ------------------- | ----------------------------------- |
| **Flexibility**     | Adapt to changing requirements      |
| **Faster Delivery** | Deliver working software frequently |
| **Quality**         | Continuous testing and feedback     |
| **Collaboration**   | Close team communication            |
| **Transparency**    | Clear visibility into progress      |

### Why We Use Agile

1. **E-commerce Changes** - Market needs evolve quickly
2. **Customer Feedback** - Incorporate feedback early
3. **Risk Reduction** - Catch issues early
4. **Team Morale** - Regular achievements
5. **Predictability** - Better estimates over time

---

## Scrum Framework

```
┌─────────────────────────────────────────────────────────────┐
│                      Scrum Framework                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐                                           │
│  │   Product    │  Prioritized list of features             │
│  │   Backlog    │  and requirements                         │
│  └──────┬───────┘                                           │
│         │                                                    │
│         │  Sprint Planning                                   │
│         ▼                                                    │
│  ┌──────────────┐                                           │
│  │   Sprint     │  Selected items for                       │
│  │   Backlog    │  this sprint                              │
│  └──────┬───────┘                                           │
│         │                                                    │
│         ▼                                                    │
│  ┌────────────────────────────────────────────────────┐     │
│  │                    Sprint (2 weeks)                 │     │
│  │                                                     │     │
│  │   Daily Standup → Development → Testing → Review   │     │
│  │                                                     │     │
│  │   ┌───────┐  ┌───────┐  ┌───────┐  ┌───────┐      │     │
│  │   │To Do  │→ │In Prog│→ │Review │→ │ Done  │      │     │
│  │   └───────┘  └───────┘  └───────┘  └───────┘      │     │
│  │                                                     │     │
│  └─────────────────────────────────────────────────────┘     │
│         │                                                    │
│         ▼                                                    │
│  ┌──────────────┐                                           │
│  │  Increment   │  Potentially shippable                    │
│  │  (Demo)      │  product                                  │
│  └──────────────┘                                           │
│         │                                                    │
│         ▼                                                    │
│  ┌──────────────┐                                           │
│  │ Retrospective│  What went well?                          │
│  │              │  What to improve?                         │
│  └──────────────┘                                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Scrum Roles

### Product Owner

- Defines product vision
- Prioritizes backlog
- Accepts/rejects work
- Represents stakeholders

### Scrum Master

- Facilitates ceremonies
- Removes blockers
- Coaches team
- Protects team from distractions

### Development Team

- Self-organizing
- Cross-functional
- Delivers increments
- Estimates work

---

## Scrum Ceremonies

### Sprint Planning

**When:** Start of sprint  
**Duration:** 2-4 hours  
**Purpose:** Plan sprint work

```markdown
## Sprint Planning Agenda

1. Review sprint goal
2. Review product backlog
3. Team capacity check
4. Select user stories
5. Break into tasks
6. Commit to sprint backlog
```

### Daily Standup

**When:** Every day  
**Duration:** 15 minutes  
**Purpose:** Sync and unblock

```markdown
## Standup Format

Each team member answers:

1. What did I do yesterday?
2. What will I do today?
3. Any blockers?

Keep it short! Details offline.
```

### Sprint Review (Demo)

**When:** End of sprint  
**Duration:** 1-2 hours  
**Purpose:** Show completed work

```markdown
## Sprint Review Agenda

1. Sprint goal recap
2. Demo completed features
3. Stakeholder feedback
4. Update product backlog
5. Celebrate achievements!
```

### Sprint Retrospective

**When:** After sprint review  
**Duration:** 1-2 hours  
**Purpose:** Continuous improvement

```markdown
## Retrospective Format

### What went well? 🎉

- CI/CD improvements
- Good collaboration

### What could improve? 🔧

- Flaky tests
- Unclear requirements

### Action items 📋

- Fix test stability (John)
- Add acceptance criteria template (Sarah)
```

---

## User Stories

### Format

```markdown
As a [type of user]
I want [goal/desire]
So that [benefit/value]
```

### Examples

```markdown
## User Story: Add to Cart

As a **customer**
I want to **add products to my cart**
So that **I can purchase multiple items at once**

### Acceptance Criteria

- [ ] Add button visible on product card
- [ ] Cart count updates immediately
- [ ] Toast notification confirms addition
- [ ] Handle out-of-stock products

### Story Points: 3

### Priority: High

### Sprint: Sprint 12
```

### INVEST Criteria

| Criteria    | Description                    |
| ----------- | ------------------------------ |
| Independent | Can be developed independently |
| Negotiable  | Details can be discussed       |
| Valuable    | Delivers value to user         |
| Estimable   | Team can estimate effort       |
| Small       | Fits in a sprint               |
| Testable    | Clear acceptance criteria      |

---

## Story Points

### Fibonacci Scale

| Points | Complexity        | Example                       |
| ------ | ----------------- | ----------------------------- |
| 1      | Trivial           | Update button text            |
| 2      | Simple            | Add form validation           |
| 3      | Moderate          | Create product card component |
| 5      | Complex           | Implement search with filters |
| 8      | Very complex      | Build checkout flow           |
| 13     | Epic (break down) | Payment gateway integration   |

### Planning Poker

1. PO describes story
2. Team asks questions
3. Everyone votes secretly
4. Reveal votes simultaneously
5. Discuss outliers
6. Re-vote if needed
7. Reach consensus

---

## Sprint Metrics

### Velocity

```
Sprint 10: 34 points
Sprint 11: 38 points
Sprint 12: 36 points
───────────────────
Average:   36 points/sprint
```

### Burndown Chart

```
Story Points Remaining
    40│  ╲
    35│    ╲
    30│      ╲─╲
    25│          ╲
    20│            ╲──
    15│                ╲
    10│                  ╲──
     5│                      ╲
     0│________________________╲___
       Day 1  3   5   7   9   11
```

---

## Definition of Done

```markdown
## Definition of Done (DoD)

A story is DONE when:

### Code

- [ ] Code written and reviewed
- [ ] Unit tests pass (>80% coverage)
- [ ] No linting errors
- [ ] TypeScript types complete

### Quality

- [ ] Integration tests pass
- [ ] E2E tests pass (if applicable)
- [ ] No security vulnerabilities
- [ ] Performance acceptable

### Documentation

- [ ] Code comments added
- [ ] API docs updated
- [ ] README updated (if needed)

### Deployment

- [ ] Merged to develop
- [ ] Deployed to staging
- [ ] Verified in staging
- [ ] PO accepted
```

---

## Best Practices

1. **Time-box ceremonies** - Respect time limits
2. **Protect the sprint** - Minimize scope changes
3. **Embrace change** - But manage it properly
4. **Communicate early** - Surface blockers quickly
5. **Celebrate wins** - Recognize achievements
6. **Continuous improvement** - Act on retro items

---

## Related Documentation

- [PROJECT_MANAGEMENT.md](PROJECT_MANAGEMENT.md) - Planning tools
- [CODE_REVIEWS.md](CODE_REVIEWS.md) - PR process
- [GIT.md](GIT.md) - Version control workflow
