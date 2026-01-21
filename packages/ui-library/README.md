# @3asoftwares/ui

[![npm version](https://img.shields.io/npm/v/@3asoftwares/ui.svg)](https://www.npmjs.com/package/@3asoftwares/ui)
[![React](https://img.shields.io/badge/React-18.2-blue?logo=react)](https://reactjs.org/)
[![Storybook](https://img.shields.io/badge/Storybook-8.0-pink?logo=storybook)](https://storybook.js.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

React UI component library for E-Storefront platform with Storybook documentation.

## 🛠️ Tech Stack

| Technology      | Purpose              |
| --------------- | -------------------- |
| React 18.2      | UI framework         |
| TypeScript 5.0+ | Type-safe components |
| Tailwind CSS    | Styling              |
| Storybook 8     | Component docs       |
| Vite            | Build tool           |
| Vitest          | Testing              |

## 📦 Installation

```bash
# npm
npm install @3asoftwares/ui

# yarn
yarn add @3asoftwares/ui
```

### Import Styles

```tsx
import '@3asoftwares/ui/styles.css';
```

## 📁 Project Structure

```
packages/ui-library/
├── src/
│   ├── index.ts              # Main exports
│   ├── components/
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Modal/
│   │   ├── Input/
│   │   └── ...
│   └── styles/
├── .storybook/               # Storybook config
├── dist/                     # Build output
└── package.json
```

## 📋 Available Components

### Buttons

```tsx
import { Button, IconButton } from '@3asoftwares/ui';

<Button variant="primary" size="md">
  Click Me
</Button>;
```

### Form Elements

```tsx
import { Input, Select, Checkbox, TextArea } from '@3asoftwares/ui';

<Input label="Email" type="email" placeholder="Enter email" />;
```

### Layout

```tsx
import { Card, Modal, Container, Grid } from '@3asoftwares/ui';

<Card title="Product">
  <p>Card content</p>
</Card>;
```

### Feedback

```tsx
import { Alert, Toast, Spinner, Badge } from '@3asoftwares/ui';

<Alert variant="success">Operation successful!</Alert>;
```

## 🎨 Storybook

Interactive component documentation and visual testing.

### Quick Start

```bash
# Start Storybook dev server
yarn storybook

# Build static Storybook
yarn build-storybook
```

View at: `http://localhost:6006`

### Writing Stories

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
      options: ['primary', 'secondary', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
  },
};
```

### Storybook Structure

```
.storybook/
├── main.ts          # Storybook configuration
├── preview.ts       # Global decorators & parameters
└── vitest.setup.ts  # Test setup
```

### Storybook Configuration

```typescript
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-interactions', '@storybook/addon-a11y'],
  framework: '@storybook/react-vite',
  docs: { autodocs: true },
};

export default config;
```

### Best Practices

| Practice       | Description                              |
| -------------- | ---------------------------------------- |
| Use `autodocs` | Auto-generate documentation from props   |
| Add controls   | Enable interactive prop editing          |
| Test states    | Create stories for all component states  |
| Accessibility  | Use a11y addon for accessibility testing |
| Visual tests   | Capture snapshots for regression testing |

## 💻 Scripts

| Command                | Description     |
| ---------------------- | --------------- |
| `yarn dev`             | Start Vite dev  |
| `yarn build`           | Build library   |
| `yarn build:lib`       | Build with tsup |
| `yarn storybook`       | Start Storybook |
| `yarn build-storybook` | Build Storybook |
| `yarn test`            | Run tests       |
| `yarn test:ui`         | Run with UI     |

## 📤 Publishing

```bash
# Bump version
npm version patch|minor|major

# Publish to npm
npm publish --access public
```

## 🔄 PR Workflow

### Before Creating a PR

```bash
# 1. Navigate to package
cd packages/ui-library

# 2. Build library
yarn build

# 3. Run tests
yarn test

# 4. Check Storybook builds
yarn build-storybook
```

### From Monorepo Root

```bash
# Build all packages
yarn build:packages

# Run all tests
yarn test:all

# One-liner validation
yarn build:packages && yarn test:all && echo "✅ Ready for PR!"
```

### PR Checklist

- [ ] Components render correctly
- [ ] Storybook stories added/updated
- [ ] All tests pass
- [ ] Styles exported properly
- [ ] Version bumped if needed
- [ ] CHANGELOG updated

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/ui-new-component`
3. Add component with tests and Storybook story
4. Run validation: `yarn build && yarn test`
5. Commit with conventional format: `git commit -m "feat(ui): add Button component"`
6. Push and create PR

See [CONTRIBUTING.md](../../docs/project/CONTRIBUTING.md) for full guidelines.

---

Part of the [E-Storefront Monorepo](../../README.md)
