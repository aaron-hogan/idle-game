#!/bin/bash

# Script to add documentation file exceptions to git tracking
# Usage: ./scripts/add-doc-exception.sh path/to/file.md "Reason for exception"

if [ "$#" -lt 2 ]; then
  echo "Usage: ./scripts/add-doc-exception.sh path/to/file.md \"Reason for exception\""
  exit 1
fi

FILE_PATH="$1"
REASON="$2"

# Check if file exists
if [ ! -f "$FILE_PATH" ]; then
  echo "Error: File $FILE_PATH does not exist"
  exit 1
fi

# Check if file is in a normally ignored path
if [[ "$FILE_PATH" != *"docs/"* && "$FILE_PATH" != *"CLAUDE"* && "$FILE_PATH" != *".log" && "$FILE_PATH" != "logs/"* ]]; then
  echo "Warning: $FILE_PATH doesn't appear to be in a normally ignored path."
  echo "Are you sure this is a documentation file that needs an exception?"
  read -p "Continue? (y/n): " CONTINUE
  if [[ "$CONTINUE" != "y" && "$CONTINUE" != "Y" ]]; then
    echo "Operation cancelled"
    exit 0
  fi
fi

# Add the file to git with force flag
git add -f "$FILE_PATH"

# Add the exception to the documentation log
EXCEPTION_LOG="docs/git_exceptions.md"

# Create the exception log if it doesn't exist
if [ ! -f "$EXCEPTION_LOG" ]; then
  mkdir -p "$(dirname "$EXCEPTION_LOG")"
  echo "# Git Exception Log" > "$EXCEPTION_LOG"
  echo "" >> "$EXCEPTION_LOG"
  echo "This file tracks documentation files that have been explicitly added to git despite being in normally ignored paths." >> "$EXCEPTION_LOG"
  echo "" >> "$EXCEPTION_LOG"
  echo "| File | Date Added | Reason | Added By |" >> "$EXCEPTION_LOG"
  echo "|------|------------|--------|----------|" >> "$EXCEPTION_LOG"
fi

# Add the exception entry
CURRENT_DATE=$(date +"%Y-%m-%d")
CURRENT_USER=$(git config user.name || echo "Unknown")
echo "| \`$FILE_PATH\` | $CURRENT_DATE | $REASON | $CURRENT_USER |" >> "$EXCEPTION_LOG"

# Also add the exception log to git
git add -f "$EXCEPTION_LOG"

echo "Success! $FILE_PATH has been added to git and recorded in $EXCEPTION_LOG"
echo "Please include this explanation in your commit message:"
echo "  \"docs(exception): add $FILE_PATH to git tracking"
echo "  "
echo "  Reason: $REASON\""