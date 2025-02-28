# Project Documentation

Welcome to the Anti-Capitalist Idle Game documentation. This repository contains comprehensive documentation for all aspects of the project.

## Documentation Structure

### Feature Documentation
- [Architecture](/docs/features/architecture/) - Project architecture and organization
- [Core Game Loop](/docs/features/core-game-loop/) - Game loop and timing system
- [Debug Panel](/docs/features/debug-panel/) - Developer debugging tools
- [Dependency Injection](/docs/features/dependency-injection/) - Dependency injection pattern implementation
- [Event System](/docs/features/event-system/) - Game event handling system
- [Game Balance](/docs/features/game-balance/) - Game mechanics and balance documentation
- [Milestone Tracking](/docs/features/milestone-tracking/) - Player progression milestones
- [Progression System](/docs/features/progression-system/) - Game progression mechanics
- [Resource Earning](/docs/features/resource-earning-mechanics/) - Resource generation systems
- [Testing](/docs/features/testing/) - Testing documentation and results
- [Timer](/docs/features/timer/) - Game timer implementation
- [UI Improvements](/docs/features/ui-improvements/) - UI enhancement documentation
- [Visual Design](/docs/features/visual-design/) - Game visual design guidelines
- [Win/Lose States](/docs/features/win-lose-state/) - Game end conditions

### Process Documentation
- [Code Quality](/docs/processes/code-quality/) - Code standards and quality processes
- [Documentation](/docs/processes/documentation/) - Documentation standards and processes
- [Git](/docs/processes/git/) - Git workflow and practices
- [Release Process](/docs/processes/releases/release-process-guide.md) - Versioning and release processes
- [Testing](/docs/processes/testing/testing-guide.md) - Testing standards and practices

### Project Information
- [Project Status](/docs/project/status.md) - Current project status
- [Project Todo](/docs/project/todo.md) - Pending tasks and completions
- [Critical Fixes](/docs/project/critical-fixes.md) - Log of critical fixes applied

### Guides and Specifications
- [Game Specification](/docs/specifications/game-specification.md) - Comprehensive game design specification
- [Game Implementation Plan](/docs/specifications/implementation-plan.md) - Game technical implementation plan
- [Getting Started](/docs/guides/getting-started.md) - New developer onboarding
- [Development Setup](/docs/guides/development-setup.md) - Environment setup guide
- [Contributing](/docs/guides/contributing.md) - Guidelines for contributors

## Using This Documentation

- **New developers** should start with the [Getting Started](/docs/guides/getting-started.md) guide
- **Current developers** should refer to the [Project Status](/docs/project/status.md) and [Todo](/docs/project/todo.md) documents
- **Feature implementation** should follow the patterns in [Feature Documentation](/docs/features/)
- **Process questions** can be answered in the [Process Documentation](/docs/processes/)

## Documentation Standards

All documentation follows the standards outlined in the [Documentation Standards](/docs/processes/documentation/documentation-standards.md) document. When creating new documentation, please adhere to these standards and use the appropriate templates.

## Contributing to Documentation

Documentation is a critical part of our development process. When implementing new features or making significant changes:

1. Update or create feature documentation
2. Follow the established templates and patterns
3. Ensure README files exist in each directory
4. Update the project status and todo lists as appropriate
5. Submit documentation changes as part of your feature PR

For more information, see the [Documentation Processes](/docs/processes/documentation/) section.

## Documentation and Git

**Important**: Most documentation files are excluded from git by default. See [DOCS_MANAGEMENT.md](/docs/processes/DOCS_MANAGEMENT.md) for our documentation management approach.

- Only README files and specifically exempted documentation are tracked in git
- For critical documentation that should be tracked in git, use our exception script:
  ```bash
  ./scripts/add-doc-exception.sh path/to/doc.md "Reason for exception"
  ```
- See [git_exceptions.md](./git_exceptions.md) for a list of files that are explicitly tracked despite being in excluded paths
