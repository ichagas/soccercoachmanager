#!/bin/bash

# Deployment script template
# Usage: ./scripts/deploy.sh

# CONFIGURE THESE VARIABLES
VPS_USER="your_username"
VPS_HOST="your_vps_ip_or_domain"
VPS_PATH="/var/www/apexcarousel"

set -e

echo "Deploying to VPS..."
echo ""

# Build the app
echo "1. Building React app..."
./scripts/build.sh

# Create deployment package
echo "2. Creating deployment package..."
tar -czf deploy.tar.gz \
    pocketbase \
    pb_public/ \
    pb_migrations/ \
    pb_hooks/ \
    .env

# Upload to VPS
echo "3. Uploading to VPS..."
scp deploy.tar.gz "$VPS_USER@$VPS_HOST:/tmp/"

# Extract and restart on VPS
echo "4. Extracting and restarting service..."
ssh "$VPS_USER@$VPS_HOST" << 'EOF'
    cd /tmp
    sudo mkdir -p /var/www/apexcarousel
    sudo tar -xzf deploy.tar.gz -C /var/www/apexcarousel
    sudo chown -R $USER:$USER /var/www/apexcarousel
    sudo systemctl restart pocketbase
    rm deploy.tar.gz
EOF

# Cleanup
rm deploy.tar.gz

echo ""
echo "✓ Deployment complete!"
echo ""
echo "Your app should now be running on the VPS"
