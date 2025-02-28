# Documentation and Logging Management

## Overview

This project maintains extensive documentation and logging files for development purposes. However, these files are **not included in the git repository** by default. This document explains our approach to managing documentation and logs.

## Excluded File Categories

The following types of files are excluded from git:

1. **Documentation Files**
   - All files in the `/docs` directory
   - AI assistant-related files (CLAUDE.md, etc.)
   - Prompt templates and planning documents

2. **Log Files**
   - All `.log` files
   - Test result logs
   - Files in the `/logs` directory
   - Debug output files

## Why We Exclude These Files

1. **Documentation Privacy**
   - Documentation may contain internal processes
   - Planning documents may contain sensitive roadmap details
   - AI assistance logs contain working conversations not suitable for public sharing

2. **Repository Cleanliness**
   - Keeps the repository size manageable
   - Prevents frequent conflicts on regularly updated files
   - Maintains focus on code rather than supporting materials

3. **Performance**
   - Improves git performance by reducing repository size
   - Speeds up cloning and pulling operations

## Working with Documentation

When you need to:

1. **Create documentation**:
   - Add files to the appropriate subdirectory under `/docs`
   - Follow the documentation templates
   - Don't worry about committing these files to git

2. **Share documentation**:
   - Use other channels (wiki, shared drives, etc.)
   - Consider extracting only the essential parts for README files
   - Critical documentation should be converted to README files that are tracked

3. **Collaborate on documentation**:
   - Use local sharing or external documentation tools
   - Consider separate document repositories if needed

## Rules for Documentation Git Exceptions

In rare cases, specific documentation files may need to be committed. Use these guidelines:

1. Only commit documentation files that are:
   - Essential for new developers to understand the codebase
   - Required for the application to function
   - Critical configuration examples
   - Core process documentation (like CLAUDE.md)

2. To add an exception for a file, use the provided script:
   ```bash
   ./scripts/add-doc-exception.sh path/to/file.md "Reason for exception"
   ```
   This script will update the .gitignore file with the exception.

3. To commit an excluded file manually, use the force flag:
   ```bash
   git add -f docs/critical-file.md
   ```

4. Document any exceptions in pull requests and explain why the file needs to be tracked.

5. **CRITICAL FILES THAT MUST ALWAYS BE TRACKED**:
   - CLAUDE.md - Core AI assistant instructions
   - Safe workflow documentation
   - Git workflow documentation

## Document Migration

As documentation matures, consider these transition paths:

1. Documentation → README files
2. Planning docs → Architecture documentation
3. AI assistance logs → Refined developer guidelines

By following these guidelines, we maintain a clean repository while still benefiting from comprehensive documentation for development purposes.