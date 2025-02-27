#!/bin/bash

# This script helps manage stale PRs by listing them and providing options to close them

# Get the list of open PRs
echo "Fetching open PRs..."
open_prs=$(gh pr list --state open --limit 100 --json number,title,headRefName,updatedAt,author)

# Display the PRs in a nicer format using jq (if available)
if command -v jq &> /dev/null; then
    echo "$open_prs" | jq -r '.[] | "#\(.number) | \(.title) | branch: \(.headRefName) | updated: \(.updatedAt) | author: \(.author.login)"'
else
    # Fallback if jq is not available
    echo "$open_prs"
fi

echo ""
echo "Do you want to check for stale PRs? (PRs not updated in over 30 days) (y/n)"
read -r check_stale
if [ "$check_stale" != "y" ]; then
    echo "Exiting PR cleanup."
    exit 0
fi

# Calculate a date 30 days ago
thirty_days_ago=$(date -v-30d +%s)

# Check for stale PRs
echo "Checking for stale PRs (not updated in 30+ days)..."
stale_prs=()

while read -r pr; do
    pr_number=$(echo "$pr" | jq -r '.number')
    pr_title=$(echo "$pr" | jq -r '.title')
    pr_updated=$(echo "$pr" | jq -r '.updatedAt')
    
    # Convert the updated date to seconds since epoch
    pr_updated_seconds=$(date -j -f "%Y-%m-%dT%H:%M:%SZ" "$pr_updated" +%s)
    
    # Check if the PR hasn't been updated in 30 days
    if [ "$pr_updated_seconds" -lt "$thirty_days_ago" ]; then
        echo "Stale PR found: #$pr_number - $pr_title (Last updated: $pr_updated)"
        stale_prs+=("$pr_number")
    fi
done < <(echo "$open_prs" | jq -c '.[]')

if [ ${#stale_prs[@]} -eq 0 ]; then
    echo "No stale PRs found!"
    exit 0
fi

echo ""
echo "Do you want to close these stale PRs? (y/n)"
read -r close_stale
if [ "$close_stale" != "y" ]; then
    echo "Exiting PR cleanup."
    exit 0
fi

# Close the stale PRs
for pr in "${stale_prs[@]}"; do
    echo "Closing PR #$pr..."
    gh pr close "$pr" --comment "Closing this stale PR that hasn't been updated in over 30 days. Feel free to reopen if development continues."
done

echo "Stale PR cleanup complete!"