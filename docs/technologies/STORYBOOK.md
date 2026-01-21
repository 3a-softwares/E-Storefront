# Storybook

## Overview

**Version:** 8.6  
**Website:** [https://storybook.js.org](https://storybook.js.org)  
**Category:** Component Development & Documentation

Storybook is a frontend workshop for building UI components and pages in isolation, enabling better component development, testing, and documentation.

---

## Why Storybook?

### Benefits

| Benefit                   | Description                                     |
| ------------------------- | ----------------------------------------------- |
| **Isolated Development**  | Build components without running the entire app |
| **Interactive Docs**      | Auto-generated documentation from components    |
| **Visual Testing**        | Catch UI regressions with visual snapshots      |
| **Accessibility Testing** | Built-in a11y addon for accessibility checks    |
| **Component Library**     | Centralized component catalog for the team      |
| **Hot Reloading**         | Instant feedback during development             |

### Why We Chose Storybook

1. **Component-Driven Development** - Build and test components in isolation
2. **Documentation** - Auto-generate docs for our UI library
3. **Visual Testing** - Catch visual regressions before production
4. **Collaboration** - Designers and developers share a common reference
5. **Ecosystem** - Rich addon ecosystem for testing and documentation

---

## How to Use Storybook

### Installation

```bash
# Initialize Storybook in existing project
npx storybook@latest init

# Or install manually
npm install @storybook/react-vite storybook -D
```

### Project Structure

```
packages/ui-library/
├── .storybook/
│   ├── main.ts           # Storybook configuration
│   ├── preview.ts        # Global decorators & parameters
│   └── vitest.setup.ts   # Test setup
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.stories.tsx
│   │   │   └── Button.test.tsx
│   │   └── ...
│   └── index.ts
└── package.json
```

### Configuration

```typescript
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-links',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: true,
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
};

export default config;
```

### Preview Configuration

```typescript
// .storybook/preview.ts
import type { Preview } from '@storybook/react';
import '../src/styles/globals.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
  },
};

export default preview;
```

---

## Writing Stories

### Basic Story

```tsx
// src/components/Button/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'ghost'],
      description: 'Button style variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Button size',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable button',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// Primary button
export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
    size: 'md',
  },
};

// Secondary button
export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
  },
};

// All sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

// Disabled state
export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
};
```

### Story with Interactions

```tsx
import { within, userEvent, expect } from '@storybook/test';

export const WithInteraction: Story = {
  args: {
    children: 'Click me',
    onClick: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalled();
  },
};
```

---

## How Storybook Helps Our Project

### UI Library Development

```
┌─────────────────────────────────────────────────────────────┐
│                  @3asoftwares/ui Library                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Storybook (localhost:6006)                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                                                         │ │
│  │  ├── Components                                         │ │
│  │  │   ├── Button                                         │ │
│  │  │   │   ├── Primary                                    │ │
│  │  │   │   ├── Secondary                                  │ │
│  │  │   │   └── Sizes                                      │ │
│  │  │   ├── Input                                          │ │
│  │  │   ├── Card                                           │ │
│  │  │   └── Modal                                          │ │
│  │  │                                                       │ │
│  │  ├── Forms                                              │ │
│  │  │   ├── TextField                                      │ │
│  │  │   └── Select                                         │ │
│  │  │                                                       │ │
│  │  └── Feedback                                           │ │
│  │      ├── Alert                                          │ │
│  │      └── Toast                                          │ │
│  │                                                         │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Key Use Cases

| Use Case              | Implementation                       |
| --------------------- | ------------------------------------ |
| Component Development | Build in isolation with live preview |
| Documentation         | Auto-generated docs from props       |
| Visual Testing        | Chromatic for visual regression      |
| Accessibility         | a11y addon checks WCAG compliance    |
| Design Review         | Share stories with designers         |
| Component Showcase    | Browse all available components      |

### Scripts

```json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build -o storybook-static"
  }
}
```

---

## Addons We Use

| Addon        | Purpose                           |
| ------------ | --------------------------------- |
| essentials   | Controls, actions, docs, viewport |
| interactions | Component interaction testing     |
| a11y         | Accessibility testing             |
| links        | Link between stories              |
| chromatic    | Visual regression testing         |

---

## Best Practices

### Story Organization

```tsx
// Use consistent naming
const meta: Meta<typeof Button> = {
  title: 'Components/Button', // Category/Component
  component: Button,
  tags: ['autodocs'], // Enable auto-documentation
};
```

### Document All States

```tsx
// Cover all component states
export const Default: Story = { args: { children: 'Default' } };
export const Hover: Story = { parameters: { pseudo: { hover: true } } };
export const Focus: Story = { parameters: { pseudo: { focus: true } } };
export const Disabled: Story = { args: { disabled: true } };
export const Loading: Story = { args: { loading: true } };
```

### Use Decorators

```tsx
// .storybook/preview.ts
const preview: Preview = {
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
};
```

---

## Related Documentation

- [REACT.md](REACT.md) - React component patterns
- [VITE.md](VITE.md) - Build tool configuration
- [STYLING.md](STYLING.md) - Tailwind CSS styling
