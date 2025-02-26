# CLAUDE.md Update Plan

## Overview

This document outlines the plan to update CLAUDE.md to reference the newly extracted instruction library documents instead of containing all the detailed process information directly.

## Sections to Update

The following sections in CLAUDE.md need to be updated with references to their corresponding instruction library documents:

1. **Code Style Section**
   - Replace with reference to `/docs/processes/code-quality/code-style-guide.md`
   
2. **Architecture Section**
   - Replace with reference to `/docs/processes/code-quality/architecture-guidelines.md`
   
3. **Testing Section**
   - Replace with reference to `/docs/processes/code-quality/testing-standards.md`
   
4. **Documentation Section**
   - Replace with reference to `/docs/processes/documentation/documentation-standards.md`
   
5. **Git Workflow Section**
   - Replace with reference to `/docs/processes/git/git-workflow.md`
   
6. **Feature Development Process Section**
   - Replace with reference to relevant documents

## Implementation Approach

For each section:
1. Keep a brief summary (2-3 sentences) of the key points
2. Add a clear reference to the detailed document
3. Maintain the overall structure of CLAUDE.md as a high-level guide
4. Ensure all links are correct and working

## Example Format

```markdown
## Code Style

We follow strict coding standards to ensure consistency across the project. For detailed guidelines, refer to our [Code Style Guide](/docs/processes/code-quality/code-style-guide.md).

Key points:
- Use TypeScript with strict typing
- Functional React components with hooks
- Redux with Redux Toolkit for state management
```

## Instruction Library Reference

Add a new section at the beginning of CLAUDE.md to introduce the instruction library:

```markdown
## Instruction Library

This project maintains a comprehensive [Instruction Library](/docs/processes/instruction-library-index.md) with detailed process documentation and standards. Always refer to these documents for the most up-to-date guidelines.
```

## Verification

After updating CLAUDE.md:
1. Verify all links work correctly
2. Ensure the document still provides a good high-level overview
3. Check that no critical information is lost in the transition

## Impact Assessment

This change will:
- Reduce duplication between CLAUDE.md and the instruction library
- Make it easier to maintain and update processes
- Keep CLAUDE.md more focused and concise
- Provide better organization of our documentation