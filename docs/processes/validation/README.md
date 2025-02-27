# Validation Processes

This directory contains critical validation processes and standards for ensuring code quality, runtime stability, and effective testing.

## Key Documents

- [Runtime Validation Guide](./runtime-validation-guide.md) - Detailed steps for validating application behavior at runtime
- [REPORT.md](./REPORT.md) - Template for reporting validation issues
- [validate-docs.sh](./validate-docs.sh) - Script for validating documentation quality and completeness

## Process Improvement Documentation

- [Process Failure Analysis](/docs/processes/lessons/process-failure-analysis.md) - Critical learnings from dependency injection implementation

## Validation Standards

Our project follows these validation standards:

1. **Build-Time Validation**
   - All tests must pass
   - TypeScript type checking must pass
   - ESLint checks must pass
   - Build must complete successfully

2. **Runtime Validation**
   - Application must launch without console errors
   - All user flows must function correctly
   - No regression in existing functionality
   - State persistence must work correctly
   - Animations and timers must function as expected

3. **Documentation Validation**
   - Changes must be documented appropriately
   - CHANGELOG.md must be updated
   - Code comments must be accurate and helpful
   - User-facing changes must have user documentation

## Pre-PR Validation

Before submitting a PR, all developers must complete the [Pre-PR Validation Checklist](/docs/processes/safe-workflow-checklist.md#-pre-pr-validation-checklist-required-).

## Reporting Validation Issues

When validation issues are found:

1. Document the exact steps to reproduce
2. Note all error messages (console, UI, logs)
3. Create a detailed report using the [REPORT.md](./REPORT.md) template
4. Fix issues before declaring work complete