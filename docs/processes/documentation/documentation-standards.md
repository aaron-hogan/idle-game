# Documentation Standards

This document outlines our documentation standards and best practices to ensure clear, consistent, and useful documentation across the project.

## Documentation Structure

The documentation is organized into the following directories:

- **Features** (`/docs/features/`): Feature-specific documentation
- **Guides** (`/docs/guides/`): Developer guides and onboarding
- **Processes** (`/docs/processes/`): Development processes and standards
- **Project** (`/docs/project/`): Project-level information
- **Specifications** (`/docs/specifications/`): Game specifications
- **Archive** (`/docs/archive/`): Archived documentation
- **Wiki** (`idle-game.wiki/`): Public-facing finalized feature documentation

## Documentation Style

### File Naming and Location

- All documentation files should use **kebab-case** naming
- Feature documentation should be placed in `/docs/features/[feature-name]/`
- Process documentation should be placed in `/docs/processes/[process-category]/`
- Use meaningful, descriptive file names

### Formatting Conventions

- Use Markdown format for all documentation
- Follow proper heading hierarchy:
  - `#` for document title (only one per document)
  - `##` for major sections
  - `###` for subsections
  - `####` for deeper levels
- Use bullet points for lists of items
- Use numbered lists for sequential steps
- Use code blocks with language specification for code examples
- Include diagrams when they help clarify complex concepts

Example:
```markdown
# Feature Title

## Overview
Brief description of the feature.

## Components
- Component 1: Description
- Component 2: Description

## Code Example
```typescript
// Example code with comments
function exampleCode() {
  return "This is an example";
}
\```
```

### Feature Documentation Set

Every feature must have a complete documentation set consisting of:

1. **Plan Document** (`plan.md`):
   - Created **before** development starts
   - Details the implementation approach, architecture, and tasks
   - Includes goals, timeline, and the implementation prompt
   - Serves as a blueprint for development

2. **Main Documentation** (`feature-name.md`):
   - Created during/after implementation
   - Explains how the feature works
   - Includes overview, architecture, usage guide, API reference

3. **Summary Document** (`summary.md`):
   - Created when the feature is complete
   - Summarizes what was implemented vs. what was planned
   - Includes benefits, challenges, and next steps

4. **Todo List** (`todo.md`):
   - Maintained throughout development
   - Tracks ongoing and future work for the feature
   - Organized by priority and category

### Content Structure

Each main feature documentation should include:

1. **Overview** section:
   - Brief description of the feature
   - Purpose and goals
   - Key concepts and terminology

2. **Core Components** section:
   - Explanation of key parts
   - Component relationships
   - Technical design decisions

3. **Usage Guide**:
   - How to use the feature
   - Code examples with comments
   - Common use cases

4. **Integration** section:
   - How the feature connects to other systems
   - Dependencies and requirements
   - Extension points

5. **Best Practices** section:
   - Recommendations for working with the feature
   - Patterns to follow
   - Anti-patterns to avoid

### Code Examples

Include well-commented TypeScript examples to demonstrate implementation:

- Keep examples concise but complete
- Include type annotations
- Add explanatory comments for complex parts
- Show both common and edge cases
- Test code examples to ensure they work

## Documentation Management

### Creating New Documentation

For **every** new feature implementation:

1. Create a dedicated folder at `/docs/features/feature-name/` using kebab-case
   - Example: `/docs/features/event-system/`, `/docs/features/resources/`

2. Create the complete documentation set in this folder:
   
   a. `plan.md` - **BEFORE** starting development
      - Details implementation approach, architecture, and tasks
      - Includes goals, timeline, and the implementation prompt
      - Use the template in `/docs/processes/documentation/templates/docs-template.md`
   
   b. `feature-name.md` - During/after implementation
      - Main documentation explaining how the feature works
      - Includes overview, architecture, usage guide, API reference
      - Example: `/docs/features/event-system/event-system.md`
   
   c. `summary.md` - When feature is complete
      - Summarizes what was implemented vs. what was planned
      - Includes benefits, challenges, and next steps
   
   d. `todo.md` - Throughout development
      - Tracks ongoing and future work
      - Organized by priority and category

### Bug Fix Documentation

For significant bug fixes:

1. Create a dedicated markdown file:
   - File path: `/docs/features/affected-feature/[issue-name]-fix.md`
   - Example: `/docs/features/resources/passive-generation-fix.md`

2. Include these sections:
   - **Issue Description**: Clear description of the bug/issue
   - **Root Cause Analysis**: Technical explanation of what caused the issue
   - **Fix Implementation**: Code changes made to fix the issue
   - **Testing Verification**: How the fix was tested
   - **Lessons Learned**: What can be done to prevent similar issues
   - **Related Documentation**: Links to other relevant documentation

### Documentation Validation

- Validate documentation using the validation script:
  ```bash
  cd docs
  ./processes/documentation/validation/validate-docs.sh
  ```
- Run validation after creating or updating documentation
- Fix any issues identified before committing changes

### Documentation Maintenance

- Use the templates provided in `/docs/processes/documentation/templates/`
- Keep documentation up-to-date as code changes
- Review existing documentation periodically for accuracy
- Update `/docs/README.md` when adding new documentation sections
- Update `/docs/project/status.md` when making significant documentation changes

## Wiki Documentation

The wiki serves as the source of truth for finalized feature documentation:

- **IMPORTANT**: ALWAYS get explicit approval before creating or updating wiki documentation
- **NEVER** create wiki pages without confirmation that the feature is ready for final documentation
- Before starting wiki documentation, verify:
  - Feature is complete and thoroughly tested
  - All internal docs are complete and validated
  - Feature has been approved for public documentation
  - Feature has been merged to develop branch

### Wiki Page Standards

- Page name: `Feature-Name` (in PascalCase)
- Example: `Event-System.md`, `Resource-Management.md`
- Content focus:
  - Complete feature overview for users and developers
  - Architecture and integration details
  - Public APIs and usage examples
  - Best practices and anti-patterns
  - Links to relevant source code and internal docs

### Wiki Publication Process

- ALWAYS update the wiki Home page to link to new feature documentation
- After wiki documentation is complete:
  - Request review from a team member
  - Get approval before considering the documentation finalized
  - Notify the team that documentation has been published

## Related Documentation

- [Code Style Guide](/docs/processes/code-quality/code-style-guide.md)
- [Safe Workflow Checklist](/docs/processes/git/safe-workflow-checklist.md)
- [PR Workflow](/docs/processes/git/pr-workflow.md)

By following these documentation standards, we ensure that our project has clear, consistent, and useful documentation that helps both current and future team members understand and contribute to the codebase.