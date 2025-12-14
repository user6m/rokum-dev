#!/usr/bin/env bash
set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <branch-name>"
  exit 1
fi

branch=$1

echo "Switching to main and pulling latest..."
git switch main
git pull --ff-only

echo "Creating new branch: $branch"
git checkout -b "$branch"
echo "Branch created: $(git rev-parse --abbrev-ref HEAD)"

echo "Tip: run 'git push -u origin $branch' to push the new branch." 
