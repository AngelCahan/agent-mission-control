#!/bin/bash

# Deployment Script for Agent Mission Control v1.1
# Run this to deploy the updated application

echo "🚀 Agent Mission Control v1.1 - Deployment Script"
echo "=================================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are you in the project root?"
    exit 1
fi

echo "📦 Step 1: Installing dependencies..."
npm install

echo ""
echo "🔨 Step 2: Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo ""
echo "📤 Step 3: Deploying to Vercel..."
echo "   You'll need to authenticate with Vercel if not already logged in."
echo ""

# Deploy to Vercel
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Summary of v1.1 Changes:"
echo "   • Analytics Dashboard with Recharts visualizations"
echo "   • Live Activity Feed with real-time updates"
echo "   • Interactive Workflow Builder with execution"
echo "   • Streaming Live Terminal with colored logs"
echo "   • Mobile-responsive design polish"
echo ""
echo "🎥 Demo Tips:"
echo "   1. Start on Analytics tab - show the charts"
echo "   2. Switch to Dashboard - show agents animating"
echo "   3. Open Activity Feed - show live updates"
echo "   4. Create & execute a workflow"
echo "   5. Show Team Chat interactions"
echo "   6. End with Terminal streaming logs"
