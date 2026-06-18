#!/bin/bash

echo "🛑 Stopping InspectMyCar..."

pm2 stop inspectmycar
pm2 delete inspectmycar

echo "✅ App stopped"
pm2 status
