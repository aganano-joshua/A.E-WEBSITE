#!/bin/sh
set -eu

TARGET_REPO_URL="${BACKEND_MIRROR_REPO_URL:-}"
TARGET_BRANCH="${BACKEND_MIRROR_BRANCH:-main}"

if [ -z "$TARGET_REPO_URL" ]; then
  echo "BACKEND_MIRROR_REPO_URL is required."
  echo "Example: export BACKEND_MIRROR_REPO_URL=git@github.com:your-org/backend-only.git"
  exit 1
fi

WORKDIR=$(mktemp -d)
cleanup() {
  rm -rf "$WORKDIR"
}
trap cleanup EXIT

echo "Cloning target repo..."
git clone --depth 1 --branch "$TARGET_BRANCH" "$TARGET_REPO_URL" "$WORKDIR"

echo "Syncing backend files..."
rsync -a --delete \
  --exclude '.git' \
  --exclude 'node_modules' \
  --exclude '.env' \
  --exclude '.env.*' \
  --exclude 'dist' \
  /Users/apple/Downloads/A.E-WEBSITE/backend/ "$WORKDIR"/

cd "$WORKDIR"

if [ -n "$(git status --porcelain)" ]; then
  git add -A
  git commit -m "sync: backend mirror from monorepo"
  git push origin "$TARGET_BRANCH"
  echo "Backend mirror pushed."
else
  echo "No backend changes to sync."
fi
