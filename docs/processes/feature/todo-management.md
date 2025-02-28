# Todo Management Process

This document outlines our approach to managing todo lists across the project to ensure consistency and better task tracking.

## Goals

- Maintain a single source of truth for project status
- Ensure consistency between project-level and feature-level todos
- Facilitate clear progress tracking for all team members
- Reduce confusion and duplicate/conflicting task lists

## Todo Structure

### 1. Project Todo (`/docs/project/todo.md`)

- **Purpose**: Main source of truth for overall project status
- **Content**:
  - High-level task categories (Core Systems, Features, Technical Debt, etc.)
  - Links to relevant implementation plans or feature todos
  - Clear indication of task status and progress
- **Format**:
  - Markdown checkboxes (`- [ ]` / `- [x]`)
  - Hierarchical organization (main tasks and subtasks)
  - Includes "Last synchronized" timestamp

### 2. Feature Todos (`/docs/features/feature-name/todo.md`)

- **Purpose**: Detailed task list for specific feature implementation
- **Content**:
  - Specific implementation tasks
  - Testing tasks
  - Documentation tasks
  - Reference to project todo status
- **Format**:
  - Markdown checkboxes
  - Categorized sections (Implementation, Testing, Documentation)
  - Includes "Last synchronized" timestamp
  - References the corresponding entry in the project todo

### 3. Implementation Plans (`/docs/features/feature-name/implementation-plan.md`)

- **Purpose**: Detailed, phase-based plans for complex features
- **Content**:
  - Phases of implementation
  - Detailed tasks within each phase
  - Success criteria and verification steps
- **Format**:
  - Markdown checkboxes for tasks
  - Phase-based organization
  - Includes "Last synchronized" timestamp
  - References relevant entries in the project todo

## Synchronization Process

### When to Synchronize

1. **After Merging PRs**: Update relevant todos to reflect completed work
2. **Before Starting New Work**: Verify todos are up-to-date
3. **During Weekly Reviews**: Full synchronization of all todo lists

### How to Synchronize

1. Start with the most detailed/specific todo list
2. Update more general todo lists to match
3. Ensure consistent status between all related lists
4. Update the "Last synchronized" timestamp

### Example Workflow

1. Complete a task in a feature
2. Update the feature-specific todo.md
3. Update any relevant implementation plans
4. Update the project todo.md to reflect the feature progress
5. Update all "Last synchronized" timestamps

## PR Requirements

When submitting PRs that affect tasks:

1. Update relevant todo lists
2. Include todo updates in the PR description
3. Reference which todos were completed
4. Ensure timestamps are updated

## Automation Support

A simple `sync-todo.sh` script is planned to:
- Check for todo files that need updates
- Verify synchronization timestamps
- Generate a report of todo statuses

## Best Practices

1. **Be Specific**: Todo items should be clear and actionable
2. **Update Regularly**: Don't let todos get out of date
3. **Maintain Hierarchy**: Use proper nesting of tasks and subtasks
4. **Link Related Lists**: Reference other todo lists when appropriate
5. **Stay Synchronized**: Keep timestamps updated to show current status

## Template Examples

### Project Todo Entry

```markdown
- [ ] Feature X (see [Feature X Todo](/docs/features/feature-x/todo.md))
  - [x] Phase 1: Planning
  - [ ] Phase 2: Implementation
  - [ ] Phase 3: Testing
  
> Last synchronized: YYYY-MM-DD
```

### Feature Todo Entry

```markdown
# Feature X Todo

> **Status in Project Todo**: In Progress, Phase 2
> Last synchronized: YYYY-MM-DD

## Implementation
- [x] Task 1
- [ ] Task 2
```

## Resources

- [Feature Development Process](/docs/processes/feature-development-process.md)
- [Documentation Standards](/docs/processes/documentation/documentation-standards.md)
- [PR Workflow](/docs/processes/pr-workflow.md)