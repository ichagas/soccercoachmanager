#!/bin/bash

# Development script - starts both PocketBase and Vite dev server
# Usage: ./scripts/dev.sh

set -e

echo "Starting development environment..."
echo ""

# Check if PocketBase binary exists
if [ ! -f "./pocketbase" ]; then
    echo "❌ PocketBase binary not found!"
    echo "Please download PocketBase first:"
    echo "  ./scripts/download-pocketbase.sh"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "./node_modules" ]; then
    echo "❌ node_modules not found!"
    echo "Please install dependencies first:"
    echo "  npm install"
    exit 1
fi

# Start PocketBase in the background
echo "Starting PocketBase..."
./pocketbase serve &
PB_PID=$!

# Wait a bit for PocketBase to start
sleep 2

# Start Vite dev server
echo "Starting Vite dev server..."
npm run dev

# Cleanup on exit
trap "kill $PB_PID 2>/dev/null || true" EXIT
