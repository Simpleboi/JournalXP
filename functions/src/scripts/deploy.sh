#!/bin/bash
# Deployment script for JournalXP
# Builds frontend and functions, then deploys to Firebase

set -e  # Exit on error

echo "🚀 Starting JournalXP Deployment..."
echo ""

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Build Frontend
echo -e "${BLUE}📦 Step 1/3: Building Frontend...${NC}"
cd frontend
npm run build
cd ..
echo -e "${GREEN}✅ Frontend built successfully${NC}"
echo ""

# Build Functions
echo -e "${BLUE}📦 Step 2/3: Building Functions...${NC}"
cd functions
npm run build
cd ..
echo -e "${GREEN}✅ Functions built successfully${NC}"
echo ""

# Deploy to Firebase
echo -e "${BLUE}🚀 Step 3/3: Deploying to Firebase...${NC}"
if [ "$1" == "--hosting-only" ]; then
  echo -e "${YELLOW}Deploying hosting only...${NC}"
  firebase deploy --only hosting
elif [ "$1" == "--functions-only" ]; then
  echo -e "${YELLOW}Deploying functions only...${NC}"
  firebase deploy --only functions
else
  echo -e "${YELLOW}Deploying hosting and functions...${NC}"
  firebase deploy
fi

echo ""
echo -e "${GREEN}✨ Deployment complete!${NC}"
echo ""
echo -e "${BLUE}📱 Your app is live at:${NC}"
echo "   https://journalxp-4ea0f.web.app"
echo ""
echo -e "${BLUE}💡 Tip:${NC}"
echo "   - Deploy hosting only: ./deploy.sh --hosting-only"
echo "   - Deploy functions only: ./deploy.sh --functions-only"
echo ""
