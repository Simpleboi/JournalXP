#!/bin/bash

echo "Setting up JournalXP..."

# Check Node Version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)

if [ "$NODE_VERSION" -lt 22]; then
    echo "Error: Node 22+ required. Current: $(node -v)"
    exit 1
    fi

# Install Dependencies
npm install
cd frontend && npm install
cd ../functions && npm install
cd ../

# Copy environment templates
cp .env.example .env 2>/dev/null || true
cp functions/.env.example functions/.env 2>/dev/null || true

echo "Setup complete. Run 'npm run emulators' to start."