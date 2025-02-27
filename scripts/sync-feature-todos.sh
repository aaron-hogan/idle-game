#!/bin/bash
# sync-feature-todos.sh - Synchronize feature todo files with project todo
# 
# This script helps automate the process of synchronizing feature-specific todo files
# with the main project todo, updating timestamps and ensuring consistency

set -e # Exit on any error

# Terminal colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null)"
TODAY=$(date +%Y-%m-%d)

# Feature directory
FEATURE_DIR=""

# Parse options
DRY_RUN=false
FORCE=false

# Display help
show_help() {
  echo -e "Usage: ./scripts/sync-feature-todos.sh [options] feature-name"
  echo
  echo -e "Options:"
  echo -e "  --dry-run    Show what would be done without making changes"
  echo -e "  --force      Skip confirmation prompts"
  echo -e "  --all        Update all feature todos (dangerous, use with caution)"
  echo -e "  --help       Show this help message"
  echo
  echo -e "Examples:"
  echo -e "  ./scripts/sync-feature-todos.sh architecture     # Sync architecture todos"
  echo -e "  ./scripts/sync-feature-todos.sh --dry-run ui     # Dry run for UI feature"
  exit 0
}

ALL_FEATURES=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --help|-h)
      show_help
      ;;
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --force)
      FORCE=true
      shift
      ;;
    --all)
      ALL_FEATURES=true
      shift
      ;;
    *)
      FEATURE_DIR=$1
      shift
      ;;
  esac
done

# Function to safely execute commands in dry run mode
safe_execute() {
  if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}Would execute: ${BLUE}$@${NC}"
  else
    echo -e "${BLUE}Executing: $@${NC}"
    "$@"
  fi
}

# Ensure we're in a git repository
if [ -z "$REPO_ROOT" ]; then
  echo -e "${RED}Error: Not in a git repository${NC}"
  exit 1
fi

# Check if the script is run from the correct location
if [ ! -f "$REPO_ROOT/docs/project/todo.md" ]; then
  echo -e "${RED}Error: docs/project/todo.md not found. Make sure you're in the project root.${NC}"
  exit 1
fi

PROJECT_TODO="$REPO_ROOT/docs/project/todo.md"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Feature Todo Synchronization${NC}"
echo -e "${BLUE}========================================${NC}"
echo

if [ "$DRY_RUN" = true ]; then
  echo -e "${YELLOW}DRY RUN MODE: No changes will be made${NC}"
  echo
fi

# Check for the feature directory
synchronize_feature() {
  local feature_name=$1
  local feature_path="$REPO_ROOT/docs/features/$feature_name"
  
  echo -e "Processing feature: ${YELLOW}$feature_name${NC}"
  
  if [ ! -d "$feature_path" ]; then
    echo -e "${RED}Error: Feature directory not found: $feature_path${NC}"
    return 1
  fi
  
  # Check for todo.md
  local todo_file="$feature_path/todo.md"
  if [ ! -f "$todo_file" ]; then
    echo -e "${YELLOW}Warning: Todo file not found: $todo_file${NC}"
    
    if [ "$FORCE" != true ]; then
      read -p "Create a new todo file? (y/N) " -n 1 -r
      echo
      if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Skipping feature: $feature_name${NC}"
        return 0
      fi
    fi
    
    # Create a new todo file
    if [ "$DRY_RUN" != true ]; then
      echo -e "# $feature_name Todo\n\n> **Status in Project Todo**: \n> Last synchronized: $TODAY\n\n## Implementation\n- [ ] Task 1\n" > "$todo_file"
      echo -e "${GREEN}Created new todo file: $todo_file${NC}"
    else
      echo -e "${YELLOW}Would create new todo file: $todo_file${NC}"
    fi
  else
    # Check if the todo file has a sync date
    if grep -q "Last synchronized:" "$todo_file"; then
      # Update the sync date
      if [ "$DRY_RUN" != true ]; then
        sed -i'.bak' "s/Last synchronized: .*/Last synchronized: $TODAY/" "$todo_file"
        rm -f "$todo_file.bak"
        echo -e "${GREEN}Updated sync date in: $todo_file${NC}"
      else
        echo -e "${YELLOW}Would update sync date in: $todo_file${NC}"
      fi
    else
      # Add a sync date after the first h1 or h2 header
      if [ "$DRY_RUN" != true ]; then
        if grep -q "^# " "$todo_file"; then
          sed -i'.bak' "0,/^# /{s/^# \(.*\)/# \1\n\n> **Status in Project Todo**: \n> Last synchronized: $TODAY/}" "$todo_file"
        elif grep -q "^## " "$todo_file"; then
          sed -i'.bak' "0,/^## /{s/^## \(.*\)/## \1\n\n> **Status in Project Todo**: \n> Last synchronized: $TODAY/}" "$todo_file"
        else
          # If no headers found, add at the top
          sed -i'.bak' "1i\\\n> **Status in Project Todo**: \n> Last synchronized: $TODAY\n" "$todo_file"
        fi
        rm -f "$todo_file.bak"
        echo -e "${GREEN}Added sync date to: $todo_file${NC}"
      else
        echo -e "${YELLOW}Would add sync date to: $todo_file${NC}"
      fi
    fi
    
    # Check if the feature is referenced in the project todo
    if [ "$DRY_RUN" != true ]; then
      if ! grep -q "$feature_name" "$PROJECT_TODO"; then
        echo -e "${YELLOW}Feature not referenced in project todo!${NC}"
        
        if [ "$FORCE" != true ]; then
          read -p "Add to project todo? (y/N) " -n 1 -r
          echo
          if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo -e "${YELLOW}Please manually update the project todo to reference this feature.${NC}"
          fi
        fi
      else
        echo -e "${GREEN}Feature is properly referenced in project todo.${NC}"
      fi
    fi
  fi
  
  # Check for implementation-plan.md
  local plan_file="$feature_path/implementation-plan.md"
  if [ -f "$plan_file" ]; then
    # Check if the plan file has a sync date
    if grep -q "Last synchronized:" "$plan_file"; then
      # Update the sync date
      if [ "$DRY_RUN" != true ]; then
        sed -i'.bak' "s/Last synchronized: .*/Last synchronized: $TODAY/" "$plan_file"
        rm -f "$plan_file.bak"
        echo -e "${GREEN}Updated sync date in: $plan_file${NC}"
      else
        echo -e "${YELLOW}Would update sync date in: $plan_file${NC}"
      fi
    else
      # Add a sync date after a phase header
      if [ "$DRY_RUN" != true ]; then
        if grep -q "^## Phase" "$plan_file"; then
          # Add after the first phase that's completed
          if grep -q "\- \[x\]" "$plan_file"; then
            sed -i'.bak' "/\- \[x\]/,/^$/{/^$/s/$/\n> Last synchronized: $TODAY/; :a; n; ba}" "$plan_file"
          else
            # If no completed items found, add after the phase header
            sed -i'.bak' "0,/^## Phase/{s/^## Phase \(.*\)/## Phase \1\n\n> Last synchronized: $TODAY/}" "$plan_file"
          fi
          rm -f "$plan_file.bak"
          echo -e "${GREEN}Added sync date to: $plan_file${NC}"
        else
          echo -e "${YELLOW}No Phase headers found in: $plan_file${NC}"
        fi
      else
        echo -e "${YELLOW}Would add sync date to: $plan_file${NC}"
      fi
    fi
  fi
  
  echo -e "${GREEN}Synchronized feature: $feature_name${NC}"
  echo
}

# Main logic
if [ "$ALL_FEATURES" = true ]; then
  if [ "$FORCE" != true ]; then
    echo -e "${YELLOW}Warning: You are about to update ALL feature todos.${NC}"
    read -p "Are you sure? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      echo -e "${YELLOW}Operation cancelled.${NC}"
      exit 0
    fi
  fi
  
  # Find all feature directories
  for feature_dir in "$REPO_ROOT/docs/features/"*/; do
    feature_name=$(basename "$feature_dir")
    synchronize_feature "$feature_name" || true
  done
elif [ -n "$FEATURE_DIR" ]; then
  synchronize_feature "$FEATURE_DIR"
else
  echo -e "${RED}Error: No feature specified.${NC}"
  show_help
  exit 1
fi

# Update project todo sync date
if [ "$DRY_RUN" != true ]; then
  if grep -q "Last synchronized:" "$PROJECT_TODO"; then
    sed -i'.bak' "s/Last synchronized: .*/Last synchronized: $TODAY/" "$PROJECT_TODO"
    rm -f "$PROJECT_TODO.bak"
    echo -e "${GREEN}Updated sync date in project todo.${NC}"
  else
    # Add a sync date at the bottom of the technical debt section
    if grep -q "^## Technical Debt" "$PROJECT_TODO"; then
      sed -i'.bak' "/^## Technical Debt/,/^## /{/^## [^T]/i\\n> Last synchronized: $TODAY\\n\\n}" "$PROJECT_TODO"
      rm -f "$PROJECT_TODO.bak"
      echo -e "${GREEN}Added sync date to project todo.${NC}"
    else
      echo -e "${YELLOW}Could not find Technical Debt section in project todo.${NC}"
    fi
  fi
else
  echo -e "${YELLOW}Would update sync date in project todo.${NC}"
fi

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Synchronization complete!${NC}"
echo -e "${BLUE}========================================${NC}"
echo

exit 0