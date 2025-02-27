#!/bin/bash

# Check if we are on the main branch
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    echo "Please checkout the main branch before running this script"
    echo "Run: git checkout main"
    exit 1
fi

# Make sure we have the latest main
echo "Updating local main branch..."
git fetch origin
git pull origin main

# Create array of branches that have been merged into main
# Exclude main itself and release branches
merged_branches=$(git branch --merged main | grep -v '\* main' | grep -v 'release/')

# Create a list of branches to delete
to_delete=()

echo "The following local branches have been merged into main and are safe to delete:"
echo "=============================================================================="
for branch in $merged_branches; do
    # Trim whitespace
    branch=$(echo $branch | xargs)
    echo "$branch"
    to_delete+=("$branch")
done

# Ask for confirmation before continuing
echo ""
echo "Do you want to delete these local branches? (y/n)"
read -r confirm
if [ "$confirm" != "y" ]; then
    echo "Aborting branch cleanup."
    exit 0
fi

# Delete local branches
echo "Deleting local branches..."
for branch in "${to_delete[@]}"; do
    echo "Deleting local branch: $branch"
    git branch -d "$branch"
done

# Now handle remote branches
echo ""
echo "Do you want to delete the corresponding remote branches too? (y/n)"
read -r confirm_remote
if [ "$confirm_remote" != "y" ]; then
    echo "Skipping remote branch cleanup. Local cleanup is complete."
    exit 0
fi

# Delete remote branches
echo "Deleting remote branches..."
for branch in "${to_delete[@]}"; do
    echo "Deleting remote branch: $branch"
    git push origin --delete "$branch"
done

echo "Branch cleanup complete!"
echo "Remember to also delete the cleanup/workflow-tests branch which is now obsolete after PR #83"