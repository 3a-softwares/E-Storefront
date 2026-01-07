# UI Library

## Overview

Shared React component library providing reusable UI components, design tokens, and styling utilities for all frontend applications.

## Tech Stack

### Framework

- **React 18** - UI library
- **TypeScript** - Type-safe components

### Build

- **Vite 5** - Build tool

### Styling

- **Tailwind CSS 3.4** - Utility-first CSS
- **DaisyUI 4** - Component library
- **@tailwindcss/forms** - Form styling

### Icons

- **FontAwesome** - Icon library

### Documentation

- **Storybook 8** - Component documentation and playground

### Testing

- **Vitest** - Test runner
- **React Testing Library** - Component testing
- **jsdom** - DOM simulation

## Components

### Form Components

- `Button` - Primary, secondary, ghost variants
- `Input` - Text input with validation
- `Select` - Dropdown selection
- `Checkbox` - Checkbox input
- `TextArea` - Multi-line input

### Layout Components

- `Card` - Content container
- `Modal` - Dialog/popup
- `Spinner` - Loading indicator
- `Badge` - Status badges

### Data Display

- `Table` - Data tables
- `Pagination` - Page navigation
- `EmptyState` - No data placeholder

### Feedback

- `Alert` - Notifications
- `Toast` - Temporary messages

## Usage

```typescript
import { Button, Input, Card, Spinner } from '3a-ecommerce-ui-library';

function MyComponent() {
  return (
    <Card>
      <Input label="Email" type="email" />
      <Button variant="primary">Submit</Button>
    </Card>
  );
}
```

## Project Structure

```
src/
├── components/
│   ├── Button/
│   ├── Input/
│   ├── Card/
│   ├── Modal/
│   └── ...
├── hooks/        # Custom hooks
├── utils/        # Utility functions
└── index.ts      # Main exports
```

## Scripts

```bash
yarn dev         # Start Vite dev server
yarn build       # Build library
yarn storybook   # Start Storybook (port 6006)
yarn build-storybook # Build static Storybook
yarn test        # Run tests
yarn test:ui     # Run tests with UI
yarn test:coverage # Run tests with coverage
```

## Storybook

Component documentation and playground available at:
`http://localhost:6006`

## Tailwind Configuration

Components use shared Tailwind config with:

- Custom color palette
- Dark mode support
- DaisyUI themes
- Form plugin
