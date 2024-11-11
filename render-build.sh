#!/usr/bin/env bash
set -e

# Install dependencies
npm install

# Run Prisma generate using full path
NODE_OPTIONS='--no-warnings' $(npm bin)/prisma generate 