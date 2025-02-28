# Linting Documentation

This directory contains documentation related to our linting standards, processes, and progress.

## Contents

- [Linting Progress](./linting-progress.md) - Tracking our systematic cleanup efforts
- More documentation will be added as needed

## Linting Categories

Our codebase has several categories of linting issues that we're addressing systematically:

1. **Unused Variables** - Removing unused imports, variables, and function parameters
2. **Require-style Imports** - Converting CommonJS require() to ES module imports
3. **TypeScript Comment Directives** - Replacing @ts-ignore with @ts-expect-error + explanations
4. **Explicit Any Types** - Replacing any types with more specific types

## Process

We follow a structured approach to fixing linting issues:

1. Group issues by category and focus on one category at a time
2. Break down fixes into small, manageable batches
3. Create a dedicated branch for each batch
4. Test thoroughly to ensure functionality is preserved
5. Update documentation to track progress
6. Submit a focused PR with clear explanation

## Running Linting Checks

To check for linting issues:

```bash
npm run lint
```

For TypeScript type checks:

```bash
npm run typecheck
```