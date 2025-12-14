#!/usr/bin/env bash
set -e

ROOT=$(cd "$(dirname "$0")/.." && pwd)
cd "$ROOT"

if [ ! -d ".githooks" ]; then
  mkdir .githooks
fi

if [ ! -f ".githooks/pre-push" ]; then
  echo "No hooks found in .githooks; ensure .githooks/pre-push exists" >&2
fi

# Configure git to use the .githooks folder for hooks
git config core.hooksPath .githooks

echo "Installed git hooks path to .githooks (git config core.hooksPath .githooks)"
echo "If you want to revert: git config --unset core.hooksPath"
