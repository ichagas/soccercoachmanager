#!/bin/bash

# Download PocketBase for the current platform
# Usage: ./scripts/download-pocketbase.sh

set -e

VERSION="0.33.0"
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)

# Map architecture names
case "$ARCH" in
    x86_64)
        ARCH="amd64"
        ;;
    aarch64|arm64)
        ARCH="arm64"
        ;;
    *)
        echo "Unsupported architecture: $ARCH"
        exit 1
        ;;
esac

# Map OS names
case "$OS" in
    linux)
        OS="linux"
        ;;
    darwin)
        OS="darwin"
        ;;
    *)
        echo "Unsupported OS: $OS"
        exit 1
        ;;
esac

FILENAME="pocketbase_${VERSION}_${OS}_${ARCH}.zip"
URL="https://github.com/pocketbase/pocketbase/releases/download/v${VERSION}/${FILENAME}"

echo "Downloading PocketBase ${VERSION} for ${OS}/${ARCH}..."
curl -L "$URL" -o pocketbase.zip

echo "Extracting..."
unzip -o pocketbase.zip
rm pocketbase.zip

echo "Making executable..."
chmod +x pocketbase

echo "✓ PocketBase downloaded successfully!"
echo ""
echo "To start PocketBase, run:"
echo "  ./pocketbase serve"
echo ""
echo "Admin dashboard will be available at:"
echo "  http://localhost:8090/_/"
