#!/bin/bash

# Resume Modifier - Startup Script
# This script starts the Next.js development server

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting Resume Modifier...${NC}"

# Navigate to the project directory
cd "$(dirname "$0")"

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
fi

# Start the development server on port 3001
echo -e "${GREEN}🌐 Starting Next.js development server...${NC}"
echo -e "${GREEN}   Open http://localhost:3001 in your browser${NC}"
echo ""

npm run dev -- -p 3001
