# rokum.dev

Monorepo for rokum.dev application with frontend and backend.

## Structure

```
.
├── frontend/     # Next.js frontend application
├── backend/      # Backend API server
└── package.json  # Root workspace configuration
```

## Prerequisites

- Node.js 18+
- pnpm 8+

## Getting Started

### Install dependencies

```bash
pnpm install
```

### Development

Run frontend and backend in development mode:

```bash
# Run both frontend and backend
pnpm dev

# Or run individually
pnpm dev:frontend
pnpm dev:backend
```

### Build

```bash
# Build all packages
pnpm build

# Or build individually
pnpm build:frontend
pnpm build:backend
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests in CI mode
pnpm test:ci
```

## Workspace Packages

- `@rokum-dev/frontend` - Next.js frontend application
- `@rokum-dev/backend` - Backend API server
