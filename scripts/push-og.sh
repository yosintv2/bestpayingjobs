#!/bin/bash
set -e

git config http.postBuffer 524288000
git config http.lowSpeedLimit 0
git config http.lowSpeedTime 999999

batch=2
count=0
for f in public/og/*.webp; do
  [ -f "$f" ] || continue
  name=$(basename "$f" .webp)
  if git ls-files "public/og/$name.webp" --error-unmatch >/dev/null 2>&1; then
    continue
  fi
  echo "=== Adding $name ==="
  git add -f "public/og/$name.webp"
  if [ -d "public/og/$name" ]; then
    git add -f "public/og/$name/"
  fi
  count=$((count + 1))
  if [ $count -ge 5 ]; then
    batch=$((batch + 1))
    echo "=== Pushing batch $batch ($count countries) ==="
    git commit -m "OG batch $batch"
    git push
    count=0
  fi
done

if [ $count -gt 0 ]; then
  batch=$((batch + 1))
  echo "=== Pushing final batch $batch ($count countries) ==="
  git commit -m "OG batch $batch"
  git push
fi

echo "=== Pushing calculators ==="
git add -f public/og/calculators/
git commit -m "OG: calculators"
git push
echo "=== Done all ==="
