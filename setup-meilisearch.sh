<?php
#!/bin/bash

# MeiliSearch Setup Script
# This script can be used during deployment to ensure consistent configuration

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting MeiliSearch setup script...${NC}"

# Check if running on server or development environment
if [ -f ".env" ]; then
  source .env
fi

# Get MeiliSearch host and key from environment
MEILISEARCH_HOST=${MEILISEARCH_HOST:-http://localhost:7700}
MEILISEARCH_KEY=${MEILISEARCH_KEY:-}

echo -e "Using MeiliSearch host: ${MEILISEARCH_HOST}"
if [ -n "$MEILISEARCH_KEY" ]; then
  echo -e "MeiliSearch key is set"
else
  echo -e "${YELLOW}Warning: MeiliSearch key is not set${NC}"
fi

# Check if MeiliSearch is running
echo -e "Checking MeiliSearch health..."
if [ -n "$MEILISEARCH_KEY" ]; then
  HEALTH_RESPONSE=$(curl -s -H "Authorization: Bearer ${MEILISEARCH_KEY}" "${MEILISEARCH_HOST}/health")
else
  HEALTH_RESPONSE=$(curl -s "${MEILISEARCH_HOST}/health")
fi

if [[ $HEALTH_RESPONSE == *"available"* ]]; then
  echo -e "${GREEN}MeiliSearch is available!${NC}"
else
  echo -e "${RED}MeiliSearch is not available. Please check your configuration.${NC}"
  echo -e "Response: $HEALTH_RESPONSE"

  if [[ -z "$HEALTH_RESPONSE" ]]; then
    echo -e "${YELLOW}No response from MeiliSearch. Make sure it's running at ${MEILISEARCH_HOST}${NC}"
  fi

  echo -e "${YELLOW}Continuing with the setup anyway...${NC}"
fi

# Run Laravel Artisan commands to set up MeiliSearch
echo -e "Configuring Laravel Scout for MeiliSearch..."
php artisan config:clear

# Configure MeiliSearch
echo -e "Configuring MeiliSearch indexes..."
php artisan meilisearch:configure --reset

# Import products into MeiliSearch
echo -e "Importing products into MeiliSearch..."
php artisan scout:import "App\\Models\\Product"

echo -e "${GREEN}MeiliSearch setup complete!${NC}"
echo -e "You can verify the configuration with: php artisan meilisearch:health --verbose"
