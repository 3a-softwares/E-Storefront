╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║              PACKAGE RESOLUTION - LOCAL vs PRODUCTION SETUP                  ║
║                                                                              ║
║              Separate environments for source and pre-built packages         ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝

📋 OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your E-Commerce platform now has SEPARATE package resolution for local and
production environments:

┌─────────────────────────────────────────────────────────────────────────────┐
│ LOCAL DEVELOPMENT                       │ PRODUCTION                        │
├─────────────────────────────────────────┼───────────────────────────────────┤
│ Package Source:                         │ Package Source:                   │
│   /packages/*/src (Source files)        │   node_modules (Pre-built)        │
│                                         │                                   │
│ Mode:                                   │ Mode:                             │
│   RESOLVE_FROM_SOURCE=true              │   RESOLVE_FROM_SOURCE=false       │
│   PACKAGE_MODE=local                    │   PACKAGE_MODE=production         │
│                                         │                                   │
│ Env File:                               │ Env File:                         │
│   .env.docker / .env.local              │   .env.production / .env          │
│                                         │                                   │
│ Features:                               │ Features:                         │
│   ✓ Hot reload enabled                  │   ✓ Optimized bundles            │
│   ✓ Direct source debugging             │   ✓ Fast startup                 │
│   ✓ No build step needed                │   ✓ Pre-compiled                 │
│   ✓ Immediate feedback                  │   ✓ Production-ready             │
└─────────────────────────────────────────┴───────────────────────────────────┘


🎯 KEY BENEFITS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. SAME CODE IN BOTH MODES
   - Your import statements are IDENTICAL
   - No conditional imports needed
   - Build tools handle resolution automatically

2. OPTIMAL PERFORMANCE
   - Local: Fast feedback loop with hot reload
   - Production: Optimized, pre-built packages

3. CLEAN SEPARATION
   - Development environment uses source
   - Production environment uses builds
   - No mixing of concerns


📁 FILES CREATED / UPDATED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Configuration Files:
  ✓ config/package-resolution.js
    - Centralized resolution configuration
    - Used by build tools (webpack, vite, etc.)
    - Handles alias and path mappings

Environment Files:
  ✓ .env.docker (updated)
    - LOCAL mode variables
    - RESOLVE_FROM_SOURCE=true
    - PACKAGE_MODE=local

  ✓ .env.production (updated)
    - PRODUCTION mode variables
    - RESOLVE_FROM_SOURCE=false
    - PACKAGE_MODE=production

Documentation:
  ✓ PACKAGE_RESOLUTION.md
    - Comprehensive guide (400+ lines)
    - Build tool integration
    - Troubleshooting

  ✓ PACKAGE_RESOLUTION_EXAMPLES.ts
    - Practical examples
    - Shows how imports work in both modes
    - No changes needed in actual code

Tools:
  ✓ switch-package-mode.sh
    - Easy mode switching
    - Automated setup
    - Status checking


🚀 QUICK START
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LOCAL DEVELOPMENT (Source Packages)
───────────────────────────────────

# Option 1: Use the switcher script
./switch-package-mode.sh local

# Option 2: Manual setup
cp .env.docker .env.local
docker-compose down
docker-compose -f docker-compose.yml up -d

Result:
  - Imports from: /packages/*/src
  - Hot reload: Enabled
  - Build step: Not needed


PRODUCTION (Pre-built Packages)
───────────────────────────────

# Option 1: Use the switcher script
./switch-package-mode.sh production

# Option 2: Manual setup
yarn build:package      # Build all packages first
cp .env.production .env
docker-compose down
docker-compose -f docker-compose.production.yml up -d

Result:
  - Imports from: node_modules
  - Hot reload: Disabled
  - Pre-built: Ready for production


🔄 IMPORT EXAMPLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

These imports work IDENTICALLY in both local and production:

// Utilities
import { logger, formatDate, validateEmail } from '@3asoftwares/utils';

// Types
import type { User, Product, Order } from '@3asoftwares/types';

// UI Components
import { Button, Card, Modal } from '@3asoftwares/ui';

// Server Utilities
import { hashPassword, comparePassword } from '@3asoftwares/utils/server';


LOCAL RESOLUTION:
  @3asoftwares/utils       → ./packages/utils/src/index.ts
  @3asoftwares/types       → ./packages/types/src/index.ts
  @3asoftwares/ui          → ./packages/ui-library/src/index.ts
  @3asoftwares/utils/server → ./packages/utils/src/server.ts

PRODUCTION RESOLUTION:
  @3asoftwares/utils       → node_modules/@3asoftwares/utils/dist/index.js
  @3asoftwares/types       → node_modules/@3asoftwares/types/dist/index.d.ts
  @3asoftwares/ui          → node_modules/@3asoftwares/ui/dist/index.js
  @3asoftwares/utils/server → node_modules/@3asoftwares/utils/dist/server.js


🛠️ TOOLS & SCRIPTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

switch-package-mode.sh - Mode Switcher

# Show current status
./switch-package-mode.sh status

# Switch to local (source) mode
./switch-package-mode.sh local

# Switch to production (pre-built) mode
./switch-package-mode.sh production

# Show environment variables
./switch-package-mode.sh env

# Show help
./switch-package-mode.sh help


📊 ENVIRONMENT VARIABLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LOCAL (.env.docker):
  NODE_ENV=development
  PACKAGE_MODE=local
  RESOLVE_FROM_SOURCE=true
  NODE_PATH=./packages:./services

PRODUCTION (.env.production):
  NODE_ENV=production
  PACKAGE_MODE=production
  RESOLVE_FROM_SOURCE=false


🔧 BUILD TOOL INTEGRATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Webpack:
  const { aliasConfig } = require('./config/package-resolution.js');
  
  module.exports = {
    resolve: {
      alias: aliasConfig,
    }
  };

Vite:
  import { aliasConfig } from './config/package-resolution.js';
  
  export default {
    resolve: {
      alias: aliasConfig,
    }
  };

TypeScript (tsconfig.json):
  - Automatically uses correct paths based on NODE_ENV
  - Configure in your tsconfig.json baseUrl and paths


📦 PACKAGE BUILD COMMANDS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# For production, build packages first:
yarn build:package      # Build all packages
yarn build:utils        # Build utils only
yarn build:types        # Build types only
yarn build:storybook    # Build UI library

# For development, use watch mode:
yarn dev:package        # Watch packages (auto-rebuild)


🔐 BEST PRACTICES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. LOCAL DEVELOPMENT
   ✓ Use .env.docker or .env.local
   ✓ RESOLVE_FROM_SOURCE=true
   ✓ No build step needed
   ✓ Hot reload enabled

2. PRODUCTION
   ✓ Build packages: yarn build:package
   ✓ Use .env.production
   ✓ RESOLVE_FROM_SOURCE=false
   ✓ Pre-built and optimized

3. CODE PRACTICES
   ✓ Use standard imports - same in both modes
   ✓ Don't use conditional imports
   ✓ Build tools handle resolution
   ✓ Write once, works everywhere

4. CI/CD PIPELINE
   ✓ Build packages before deployment
   ✓ Test both modes locally
   ✓ Use production config for builds
   ✓ Never commit built files (dist/)


⚡ WORKFLOW COMPARISON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LOCAL WORKFLOW:
  1. Edit source files
  2. Changes auto-reload
  3. Test immediately
  4. No build step

PRODUCTION WORKFLOW:
  1. Edit source files
  2. yarn build:package
  3. docker-compose build
  4. Deploy

Both use the SAME source code - only import locations change!


🆘 TROUBLESHOOTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Local: Cannot find module '@3asoftwares/utils'
→ Check: RESOLVE_FROM_SOURCE=true in .env
→ Check: ls -la packages/utils/src exists
→ Restart: docker-compose down && up -d

Production: Cannot find module '@3asoftwares/utils'
→ Step 1: yarn build:package
→ Step 2: Check: ls -la packages/utils/dist exists
→ Step 3: Check: RESOLVE_FROM_SOURCE=false in .env
→ Step 4: docker-compose build --no-cache

Wrong Mode Detected
→ Run: ./switch-package-mode.sh status
→ Check environment variables
→ Run switcher to fix: ./switch-package-mode.sh [local|production]


📚 DOCUMENTATION FILES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PACKAGE_RESOLUTION.md
  → Complete guide (400+ lines)
  → Build tool integration
  → Workflow examples
  → Troubleshooting

PACKAGE_RESOLUTION_EXAMPLES.ts
  → Practical code examples
  → Shows same imports in both modes
  → Real service examples

.env.example
  → Environment variable reference
  → Shows local vs production

config/package-resolution.js
  → Centralized configuration
  → Used by build tools


🎯 SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ LOCAL mode: Source packages (/packages/*/src)
✓ PRODUCTION mode: Pre-built packages (node_modules)
✓ SAME import statements work in both
✓ Automatic resolution based on environment
✓ Hot reload in local, optimized in production
✓ Easy switching with included script
✓ No code changes needed between modes


╔══════════════════════════════════════════════════════════════════════════════╗
║                    ✅ Setup Complete & Ready to Use!                        ║
║                                                                              ║
║   Switch modes with: ./switch-package-mode.sh [local|production]            ║
║   Check status with: ./switch-package-mode.sh status                        ║
║   Read docs: PACKAGE_RESOLUTION.md                                          ║
╚══════════════════════════════════════════════════════════════════════════════╝

Last Updated: January 10, 2026
Version: 1.0.0
