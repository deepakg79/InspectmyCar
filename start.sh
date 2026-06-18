#!/bin/bash

echo "🚀 Deploying InspectMyCar (zero downtime)..."

cd /home/gcppractice86/inspectmycar || exit 1

# Optional: pull latest code
# git pull origin main

echo "📦 Installing dependencies..."
npm install

echo "🏗️ Building Next.js app..."
npm run build

# Check if PM2 process exists
pm2 describe inspectmycar > /dev/null 2>&1

if [ $? -eq 0 ]; then
  echo "🔁 Reloading existing app (zero downtime)..."
  pm2 reload inspectmycar --update-env
else
  echo "🆕 Starting new app..."
  pm2 start ecosystem.config.js
fi

# Save PM2 process list
pm2 save

echo "✅ Deployment complete!"
pm2 status
