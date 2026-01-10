===============================================
🚀 QUICK COMMAND REFERENCE - 3A Softwares
===============================================

📦 INSTALLATION
---------------
yarn install                   # Install all dependencies (frontend + backend)
npm install -g yarn            # Install yarn globally (if needed)

🎯 RUN EVERYTHING FROM ROOT
----------------------------
yarn dev:all                   # Start EVERYTHING (frontend + backend) ⭐ RECOMMENDED
yarn dev:frontend              # Start only frontend apps (4 apps)
yarn dev:backend               # Start only backend services (6 services)

🎨 RUN INDIVIDUAL FRONTEND APPS
-------------------------------
yarn dev:admin                 # Admin App (Port 3001)
yarn dev:shell                 # Shell App (Port 3000)
yarn dev:seller                # Seller App (Port 3002)
yarn dev:storefront            # Storefront App (Port 3003)

🔧 RUN INDIVIDUAL BACKEND SERVICES
----------------------------------
yarn dev:auth              # Auth Service (Port 3011)
yarn dev:gateway           # GraphQL Gateway (Port 4000)
yarn dev:order             # Order Service (Port 3012)
yarn dev:product           # Product Service (Port 3011)
yarn dev:category          # Category Service (Port 3013)
yarn dev:coupon            # Coupon Service (Port 3014)

🎨 RUN STORYBOOK
----------------------------------
yarn workspace @3asoftwares/ui run storybook  # Storybook (Port 6006)

🏗️ BUILD FOR PRODUCTION
------------------------
yarn build:admin               # Build Admin app only - done
yarn build:shell               # Build Shell app only - done
yarn build:seller              # Build Seller app only - done
yarn build:storefront          # Build Storefront app only
yarn build:frontend            # Build all frontend apps
yarn build:auth                # Build Auth Services
yarn build:gateway             # Build GraphQL Services
yarn build:order               # Build Orders Services
yarn build:product             # Build Product Services
yarn build:category            # Build Category Services
yarn build:coupon              # Build Coupon Services
yarn build:backend             # Build all backend services
yarn build:storybook           # Build storybook app only
yarn build:types               # Build types app only
yarn build:utils               # Build utils app only
yarn build:all                 # Build all frontend apps

🔍 ACCESS APPLICATIONS
----------------------
Admin:       http://localhost:3001
Shell:       http://localhost:3000
Seller:      http://localhost:3002
Storefront:  http://localhost:3003
GraphQL:     http://localhost:4000/graphql

🔍 ACCESS BACKEND SERVICES
--------------------------
Auth:        http://localhost:3011
Product:     http://localhost:3011
Order:       http://localhost:3012
Category:    http://localhost:3013
Coupon:      http://localhost:3014

# Clean install
rm -rf node_modules
rm yarn.lock
yarn install

🌍 ENVIRONMENT SETUP
--------------------
# Windows PowerShell:
.\setup-env.ps1 -Environment local       # Setup for local development
.\setup-env.ps1 -Environment staging     # Setup for staging
.\setup-env.ps1 -Environment production  # Setup for production

# Linux/Mac Bash:
./setup-env.sh local                     # Setup for local development
./setup-env.sh staging                   # Setup for staging
./setup-env.sh production                # Setup for production

🐳 DOCKER COMMANDS
------------------
# Local Development
docker-compose up -d                     # Start all services (dev)
docker-compose down                      # Stop all services
docker-compose logs -f                   # View logs

# Staging
docker-compose -f docker-compose.staging.yml up -d
docker-compose -f docker-compose.staging.yml down

# Production
docker-compose -f docker-compose.production.yml up -d
docker-compose -f docker-compose.production.yml down

📁 ENVIRONMENT FILES
--------------------
Each service/app has 3 environment files:
- .env.local       # Local development
- .env.staging     # Staging environment
- .env.production  # Production environment

The setup scripts copy the appropriate file to .env
