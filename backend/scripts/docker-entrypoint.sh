#!/bin/sh
set -eu

echo "Running Prisma generate..."
yarn prisma:generate

echo "Running Prisma db push..."
yarn db:push:deploy

echo "Starting backend server..."
exec node dist/server.js
