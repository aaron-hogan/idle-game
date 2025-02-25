# Documentation Validation

This directory contains a script to validate the documentation structure and ensure it follows the standards defined in `CLAUDE.md`.

## Validation Script

The `validate-docs.sh` script checks:

1. **Project structure**:
   - Verifies required folders exist (`project`, `archive`)
   - Confirms key project files are present (`README.md`, `docs-template.md`, `status.md`)

2. **Feature folders**:
   - Validates each feature folder is named in kebab-case
   - Checks for the required documentation set:
     - `plan.md` - With implementation prompt section
     - `feature-name.md` - Main documentation 
     - `summary.md` - Implementation summary
     - `todo.md` - Task list

## Usage

Run the script from the docs directory:

```bash
cd docs
./validate-docs.sh
```

The script will:
- Check all feature folders
- Report any issues with documentation structure
- Provide a summary of valid and invalid feature folders
- Exit with code 0 if all checks pass, 1 if any issues are found

## Integration with CI

You can add this script to your CI pipeline to automatically validate documentation on pull requests:

```yaml
- name: Validate Documentation
  run: |
    cd docs
    ./validate-docs.sh
  # Optional: Only fail PR on documentation issues in certain branches
  continue-on-error: ${{ github.ref != 'refs/heads/main' }}
```

This ensures all documentation follows the structure guidelines before merging to main branches.