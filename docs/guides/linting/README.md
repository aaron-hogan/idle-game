# Linting Guidelines

This directory contains documentation related to linting standards and processes for the idle-game project.

## Contents

- [Linting Cleanup Process](./linting-cleanup-process.md) - Systematic approach to cleaning up linting issues
- [Linting Issue Inventory](./linting-issue-inventory.md) - Inventory of files with linting issues by category

## Overview

The project follows ESLint rules with TypeScript-specific configurations. We aim to maintain high code quality by enforcing linting standards and systematically addressing linting issues.

## Key Linting Principles

1. **Focus on categories** - Address linting issues by category (unused variables, `any` types, etc.) rather than by file
2. **Batch processing** - Fix issues in manageable batches to keep PRs focused and reviewable
3. **Documented progress** - Track progress and document completed fixes
4. **Consistency** - Follow a consistent approach to fixing similar issues

## Running Linting Checks

To run linting checks on the project:

```bash
# Run all linting checks
npm run lint

# Run linting with auto-fix for formatting issues
npm run lint -- --fix

# Focus on specific rule
npm run lint -- --quiet --rule '@typescript-eslint/no-unused-vars: error'
```

## Linting Standards

The project enforces the following key linting standards:

1. **No unused variables or imports** - All declared variables and imports should be used
2. **Avoid `any` types** - Use specific TypeScript types instead of `any`
3. **Use ES Module imports** - Prefer ES Module imports over `require()` style imports
4. **Proper TypeScript comments** - Use `@ts-expect-error` with explanations instead of `@ts-ignore`
5. **Specific function types** - Use specific function types instead of the generic `Function` type