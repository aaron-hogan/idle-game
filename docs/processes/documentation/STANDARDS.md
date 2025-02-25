# Documentation Standards

This document defines the standards for all documentation in the Anti-Capitalist Idle Game project. Following these standards ensures consistency, quality, and accessibility of project documentation.

## Directory Structure

- **Feature Documentation**: `/docs/[feature-name]/`
  - All documentation for a specific feature must be in its own kebab-case folder
  - Example: `/docs/event-system/`, `/docs/timer/`, `/docs/debug-panel/`

- **Project Documentation**: `/docs/project/`
  - Contains project-level documentation, templates, and standards
  - Example: `/docs/project/docs-template.md`, `/docs/project/status.md`

- **Archived Documentation**: `/docs/archive/`
  - Contains outdated documentation that is kept for historical reference
  - Should be moved here rather than deleted when superseded

## Required Documentation Files

Every feature must include these four documents:

1. **`plan.md`** - Initial implementation plan
   - Created **BEFORE** starting development
   - Must include goals, approach, timeline
   - **MUST** include the implementation prompt used to create the feature

2. **`feature-name.md`** - Main feature documentation
   - Named to match the feature folder (e.g., `/docs/event-system/event-system.md`)
   - Contains comprehensive documentation about the feature
   - Created during or after implementation

3. **`summary.md`** - Implementation summary
   - Created when the feature is complete
   - Summarizes what was implemented vs what was planned
   - Includes benefits, challenges, and next steps

4. **`todo.md`** - Ongoing todo list
   - Created and maintained throughout development
   - Uses GitHub-style task lists (`- [ ]` and `- [x]` format)
   - Organized by category

## Naming Conventions

- **Folders**: Use kebab-case (e.g., `event-system`, `game-loop`)
- **Files**: Use kebab-case for markdown files (e.g., `event-system.md`, `plan.md`)
- **Headers**: Use title case for headers (e.g., "## Implementation Approach")

## Validation Process

Always validate documentation using the validation script:

```bash
cd docs
./project/validation/validate-docs.sh
```

This script checks:
- Correct folder structure and naming
- Presence of all required files
- Required sections in each document
- Proper formatting of todo lists
- Implementation prompts in plan documents

## Best Practices

1. **Keep Documentation Updated**
   - Update documentation alongside code changes
   - Review documentation when making significant changes

2. **Cross-Reference**
   - Link to related documentation using relative paths
   - Maintain a consistent navigation structure

3. **Use Templates**
   - Always start from the templates in `/docs/project/docs-template.md`
   - Follow the section structure provided

4. **Implementation Prompts**
   - All plan documents must include specific implementation prompts
   - These prompts should be self-contained and detailed enough to implement from

5. **Include Code Examples**
   - Add well-commented code examples in TypeScript
   - Use proper markdown code blocks with language specification

## Continuous Integration

The documentation validation can be integrated into CI pipelines:

```yaml
- name: Validate Documentation
  run: |
    cd docs
    ./project/validation/validate-docs.sh
  continue-on-error: ${{ github.ref != 'refs/heads/main' }}
```

This ensures documentation standards are maintained throughout the project lifecycle.