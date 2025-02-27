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

### Documentation Git Management

`add-doc-exception.sh` - Adds a documentation file to git tracking despite being in an ignored path.

Usage:
```bash
./scripts/add-doc-exception.sh path/to/file.md "Reason for exception"
```

The script:
- Force-adds a specific documentation file to git
- Records the exception with a reason in `docs/git_exceptions.md` 
- Documents your reasoning for including the file

Example:
```bash
./scripts/add-doc-exception.sh docs/features/important-feature/critical-info.md "Contains essential API information needed for development"
```

**When to use**: Only use for documentation that is essential for other developers to have in the repository itself, rather than accessing it through other means. See [DOCS_MANAGEMENT.md](/DOCS_MANAGEMENT.md) for details.

## Adding New Scripts

When adding new scripts to this directory:

1. Make the script executable with `chmod +x scripts/your-script.js`
2. Add an entry to this README.md describing the script's purpose and usage
3. If appropriate, add an npm script to package.json for easy access
4. Include helpful comments in the script itself for future maintainers