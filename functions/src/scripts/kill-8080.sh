#!/usr/bin/env bash
PORT=8080

echo "Checking port $PORT..."

netstat -ano | findstr :8080;
taskkill //PID 6240 //F