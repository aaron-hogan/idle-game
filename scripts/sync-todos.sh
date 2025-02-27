#!/bin/bash
# Todo Synchronization Script
# Helps identify inconsistencies in todo lists

echo "====== Todo Synchronization Check ======"
echo "Checking for todo files that need updates..."

# Find all todo.md files and implementation plans
TODO_FILES=$(find ./docs -name "todo.md" -o -name "implementation-plan.md" | sort)

# Current date
CURRENT_DATE=$(date +%Y-%m-%d)

# Function to check synchronization status
check_sync_status() {
  local file=$1
  local sync_date=""
  
  # Extract synchronization date if it exists
  if grep -q "Last synchronized:" "$file"; then
    sync_date=$(grep "Last synchronized:" "$file" | head -1 | sed 's/.*Last synchronized: \([0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}\).*/\1/')
    
    # Compare dates
    if [ "$sync_date" != "$CURRENT_DATE" ]; then
      echo "⚠️  $file - Last sync: $sync_date (out of date)"
      return 1
    else
      echo "✅ $file - Up to date"
      return 0
    fi
  else
    echo "❌ $file - No sync date found"
    return 2
  fi
}

# Function to check todo consistency
check_todo_consistency() {
  local file=$1
  local project_todo="./docs/project/todo.md"
  
  # Skip project todo itself
  if [ "$file" == "$project_todo" ]; then
    return 0
  fi
  
  # Get feature name from path
  local feature_name=$(echo "$file" | grep -o 'features/[^/]*' | cut -d'/' -f2)
  
  # If this is a feature todo, check if it's referenced in project todo
  if [ -n "$feature_name" ]; then
    if ! grep -q "$feature_name" "$project_todo"; then
      echo "⚠️  $file - Feature not referenced in project todo"
      return 1
    fi
  fi
  
  return 0
}

# Count statistics
total_files=0
outdated_files=0
missing_sync_files=0
inconsistent_files=0

echo -e "\n== Checking synchronization dates =="

# Check each file
for file in $TODO_FILES; do
  total_files=$((total_files + 1))
  
  # Check sync status
  check_sync_status "$file"
  status=$?
  
  if [ $status -eq 1 ]; then
    outdated_files=$((outdated_files + 1))
  elif [ $status -eq 2 ]; then
    missing_sync_files=$((missing_sync_files + 1))
  fi
  
  # Check consistency
  check_todo_consistency "$file"
  if [ $? -eq 1 ]; then
    inconsistent_files=$((inconsistent_files + 1))
  fi
done

echo -e "\n== Summary =="
echo "Total todo files: $total_files"
echo "Outdated files: $outdated_files"
echo "Files missing sync date: $missing_sync_files"
echo "Files with potential inconsistencies: $inconsistent_files"

if [ $outdated_files -eq 0 ] && [ $missing_sync_files -eq 0 ] && [ $inconsistent_files -eq 0 ]; then
  echo -e "\n✅ All todo files are synchronized and consistent!"
else
  echo -e "\n⚠️  Some todo files need attention. Please update them according to the todo management process."
  echo "See: docs/processes/todo-management.md for details"
fi