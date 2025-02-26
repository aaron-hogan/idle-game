# GitHub Scripts for AI Pair Programming

## Overview

This feature provides specially designed GitHub automation scripts for use by Claude and other AI assistants. 
The scripts follow project standards and incorporate safety checks to prevent common mistakes.

## Scripts

### 1. `create-branch.sh`

**Purpose:** Safely create properly named feature branches.

**Usage:**
```bash
.github/scripts/create-branch.sh <type> <description>
```

**Features:**
- Validates branch type against allowed values
- Creates kebab-case branch names automatically
- Warns if not creating from main branch
- Enforces project branch naming conventions

### 2. `create-pr.sh`

**Purpose:** Create standardized pull requests from feature branches.

**Usage:**
```bash
.github/scripts/create-pr.sh
```

**Features:**
- Prevents PR creation from main branch
- Validates branch name format
- Automatically generates PR title with proper capitalization
- Includes commit history in PR description
- Adds standardized checklist to PR description

### 3. `check-pr.sh`

**Purpose:** Provides PR status in JSON format for easy parsing by AI assistants.

**Usage:**
```bash
.github/scripts/check-pr.sh [PR_NUMBER]
```

**Features:**
- Checks current branch's PR status if no PR number provided
- Returns structured JSON data with PR details
- Includes review decision and check status information
- Designed for easy parsing by AI assistants

## Security Considerations

- All scripts include input validation
- Branch creation and PR scripts have safety checks
- No credentials are stored in scripts
- Scripts follow least-privilege principles

## Future Improvements

- Add release automation script
- Create changelog generation automation
- Implement local test validation before PR
- Add PR labeling features