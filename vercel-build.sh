#!/usr/bin/env bash
set -euo pipefail

# Install dependencies and build packages needed by services
yarn install --frozen-lockfile

echo "Building shared packages..."
yarn build:packages

echo "Building category service..."
yarn build:category

echo "Vercel build script completed."