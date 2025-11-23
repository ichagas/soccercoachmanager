#!/bin/bash

# Build script - builds React app and copies to pb_public/app
# Usage: ./scripts/build.sh

set -e

echo "Building React app..."
npm run build

echo "Copying build to pb_public/app..."
rm -rf pb_public/app
mkdir -p pb_public/app
cp -r dist/* pb_public/app/

echo "✓ Build complete!"
echo ""
echo "Files copied to pb_public/app/"
echo "You can now deploy the entire project to your VPS"
