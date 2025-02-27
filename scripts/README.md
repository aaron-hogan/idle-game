# Development Scripts

This directory contains utility scripts used for development, building, and maintaining the project.

## Available Scripts

### Documentation Validation

`validate-docs.js` - Validates the structure and completeness of project documentation.

Usage:
```bash
# Run directly
./scripts/validate-docs.js

# Run via npm script
npm run docs:validate
```

The script validates:
- Presence of all required documentation sections
- README.md files in each documentation section
- Required project documentation files
- CHANGELOG.md in the project root

## Adding New Scripts

When adding new scripts to this directory:

1. Make the script executable with `chmod +x scripts/your-script.js`
2. Add an entry to this README.md describing the script's purpose and usage
3. If appropriate, add an npm script to package.json for easy access
4. Include helpful comments in the script itself for future maintainers