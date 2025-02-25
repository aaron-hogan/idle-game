#!/bin/bash

# Documentation Validation Script
# This script checks if our documentation follows the structure defined in CLAUDE.md

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Set the docs directory 
DOCS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
echo "Checking documentation in: $DOCS_DIR"

# Initialize counters
TOTAL_FEATURES=0
VALID_FEATURES=0
ISSUES_FOUND=0

# Check for project folders
echo -e "\n${YELLOW}Checking for required project folders...${NC}"
REQUIRED_PROJECT_FOLDERS=("project" "archive")
for folder in "${REQUIRED_PROJECT_FOLDERS[@]}"; do
  if [ -d "$DOCS_DIR/$folder" ]; then
    echo -e "${GREEN}✓ Found project folder: $folder${NC}"
  else
    echo -e "${RED}✗ Missing project folder: $folder${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
  fi
done

# Check for project documentation
echo -e "\n${YELLOW}Checking for required project documentation...${NC}"
if [ -f "$DOCS_DIR/README.md" ]; then
  echo -e "${GREEN}✓ Found README.md${NC}"
else
  echo -e "${RED}✗ Missing README.md${NC}"
  ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

if [ -f "$DOCS_DIR/processes/documentation/templates/docs-template.md" ]; then
  echo -e "${GREEN}✓ Found docs template${NC}"
else
  echo -e "${RED}✗ Missing docs-template.md${NC}"
  ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

if [ -f "$DOCS_DIR/project/status.md" ]; then
  echo -e "${GREEN}✓ Found project status document${NC}"
else
  echo -e "${RED}✗ Missing status.md${NC}"
  ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

# Get all feature folders
echo -e "\n${YELLOW}Checking feature documentation...${NC}"
# Check if features directory exists
if [ -d "$DOCS_DIR/features" ]; then
  feature_folders=$(find "$DOCS_DIR/features" -mindepth 1 -maxdepth 1 -type d)
else
  echo -e "${RED}✗ Missing features directory${NC}"
  ISSUES_FOUND=$((ISSUES_FOUND + 1))
  feature_folders=""
fi

for folder in $feature_folders; do
  feature_name=$(basename "$folder")
  TOTAL_FEATURES=$((TOTAL_FEATURES + 1))
  
  echo -e "\n${YELLOW}Checking feature: $feature_name${NC}"
  
  # Check if folder name is in kebab-case
  if [[ ! $feature_name =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
    echo -e "${RED}✗ Folder name is not in kebab-case: $feature_name${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
  else
    echo -e "${GREEN}✓ Folder name is in kebab-case${NC}"
  fi
  
  # Check for required files
  feature_issues=0
  
  # Check for plan.md
  if [ -f "$folder/plan.md" ]; then
    echo -e "${GREEN}✓ Found plan.md${NC}"
    
    # Check if plan.md contains implementation prompt
    if grep -q -i "implementation prompt" "$folder/plan.md"; then
      echo -e "${GREEN}  ✓ plan.md contains implementation prompt${NC}"
    else
      echo -e "${RED}  ✗ plan.md missing implementation prompt${NC}"
      feature_issues=$((feature_issues + 1))
    fi
  else
    echo -e "${RED}✗ Missing plan.md${NC}"
    feature_issues=$((feature_issues + 1))
  fi
  
  # Check for feature-name.md
  if [ -f "$folder/$feature_name.md" ]; then
    echo -e "${GREEN}✓ Found $feature_name.md${NC}"
    
    # Check for required sections
    if grep -q -i "overview" "$folder/$feature_name.md" && grep -q -i "core components" "$folder/$feature_name.md"; then
      echo -e "${GREEN}  ✓ $feature_name.md contains required sections${NC}"
    else
      echo -e "${RED}  ✗ $feature_name.md missing some required sections${NC}"
      feature_issues=$((feature_issues + 1))
    fi
  else
    echo -e "${RED}✗ Missing $feature_name.md${NC}"
    feature_issues=$((feature_issues + 1))
  fi
  
  # Check for summary.md
  if [ -f "$folder/summary.md" ]; then
    echo -e "${GREEN}✓ Found summary.md${NC}"
    
    # Check for required sections
    if grep -q -i "what we've implemented" "$folder/summary.md" && grep -q -i "benefits" "$folder/summary.md"; then
      echo -e "${GREEN}  ✓ summary.md contains required sections${NC}"
    else
      echo -e "${RED}  ✗ summary.md missing some required sections${NC}"
      feature_issues=$((feature_issues + 1))
    fi
  else
    echo -e "${RED}✗ Missing summary.md${NC}"
    feature_issues=$((feature_issues + 1))
  fi
  
  # Check for todo.md
  if [ -f "$folder/todo.md" ]; then
    echo -e "${GREEN}✓ Found todo.md${NC}"
    
    # Basic check that it has task lists
    if grep -q -E "\- \[[ xX]\]" "$folder/todo.md"; then
      echo -e "${GREEN}  ✓ todo.md contains task lists${NC}"
    else
      echo -e "${RED}  ✗ todo.md missing task lists${NC}"
      feature_issues=$((feature_issues + 1))
    fi
  else
    echo -e "${RED}✗ Missing todo.md${NC}"
    feature_issues=$((feature_issues + 1))
  fi
  
  # If no issues found, increment valid features
  if [ $feature_issues -eq 0 ]; then
    VALID_FEATURES=$((VALID_FEATURES + 1))
  else
    ISSUES_FOUND=$((ISSUES_FOUND + feature_issues))
  fi
done

# Print summary
echo -e "\n${YELLOW}Documentation Validation Summary:${NC}"
echo -e "Total feature folders: $TOTAL_FEATURES"
echo -e "Valid feature folders: $VALID_FEATURES"
echo -e "Issues found: $ISSUES_FOUND"

if [ $ISSUES_FOUND -eq 0 ]; then
  echo -e "\n${GREEN}✓ All documentation follows the required structure!${NC}"
  exit 0
else
  echo -e "\n${RED}✗ Documentation has $ISSUES_FOUND issues that need to be fixed.${NC}"
  exit 1
fi