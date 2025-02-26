# Anti-Capitalist Idle Game - Developer Guidelines

This file serves as a quick reference and process enforcer for all development work. Before proceeding with any development task, you MUST follow the mandatory processes outlined below.

## MANDATORY WORKFLOW INSTRUCTIONS

### Starting Any Work

1. **ALWAYS create a properly named branch before beginning any work**
   - For features: `feature/feature-name`
   - For bugs: `fix/bug-description`
   - For documentation: `docs/doc-description`
   - For refactoring: `refactor/description`

2. **ALWAYS begin with a planning phase**
   - Document your approach before implementing
   - For features, create documentation in `/docs/features/feature-name/`
   - Include a clear implementation plan with tasks and timeline

3. **ALWAYS follow TDD principles**
   - Write tests before implementing functionality
   - Ensure comprehensive test coverage
   - Run tests regularly during development

4. **ALWAYS make focused, descriptive commits**
   - Commit messages should clearly explain the "why" not just the "what"
   - Format: `type: concise description of changes` (e.g., `fix: resolve race condition in timer`)
   - Include reference to issue/ticket number when applicable

### Required Checks Before Submitting PRs

- [ ] All tests pass (`npm test`)
- [ ] Code passes linting (`npm run lint`)
- [ ] Type checking succeeds (`npm run typecheck`)
- [ ] Documentation is complete and follows standards
- [ ] No debug code or console logs remain in production code
- [ ] Branch is up to date with the main branch

## Documentation Resources

### Main Documentation

All project documentation is maintained in the [Instruction Library](/docs/processes/instruction-library-index.md). This is your primary resource for all development guidelines, processes, and standards.

### Getting Started

- [Development Setup](/docs/guides/development-setup.md) - Setup instructions and common commands
- [Getting Started Guide](/docs/guides/getting-started.md) - Guide for new developers
- [Contributing Guidelines](/docs/guides/contributing.md) - How to contribute to the project

### Key Process Documentation

- [Code Style Guide](/docs/processes/code-quality/code-style-guide.md) - Coding standards
- [Architecture Guidelines](/docs/processes/code-quality/architecture-guidelines.md) - System design principles
- [Testing Standards](/docs/processes/code-quality/testing-standards.md) - Testing requirements
- [Documentation Standards](/docs/processes/documentation/documentation-standards.md) - Documentation guidelines
- [Git Workflow](/docs/processes/git/git-workflow.md) - Git processes and branch strategy
- [PR Workflow](/docs/processes/pr-workflow.md) - Pull request creation and review
- [Feature Development Process](/docs/processes/feature-development-process.md) - Feature development lifecycle
- [CI/CD Pipeline](/docs/processes/ci-cd-pipeline.md) - Automated build and test processes

### Project Status

- [Critical Fixes Log](/docs/project/critical-fixes.md) - Log of critical fixes and lessons learned
- [Project Overview](/docs/project/overview.md) - Project vision and goals
- [Project Status](/docs/project/status.md) - Current development status

## Common Commands

```bash
# Setup and development
npm install         # Install dependencies
npm start           # Start development server
npm run build       # Create production build

# Testing
npm test            # Run all tests
npm run test:watch  # Run tests in watch mode
npm run test:coverage # Run tests with coverage report

# Quality checks
npm run lint        # Run code linting
npm run typecheck   # Run type checking
npm run validate    # Run all validation (tests, lint, typecheck)

# Documentation
npm run docs:validate # Validate documentation links and structure
```

## Developer Process Enforcement

IMPORTANT: These process requirements are not optional. They are mandatory for all development work to ensure consistency, quality, and maintainability of the codebase.

Before making any changes:
1. Read the [Safe Workflow Checklist](/docs/processes/safe-workflow-checklist.md)
2. Ensure you understand our [Git Workflow](/docs/processes/git/git-workflow.md)
3. Follow our [Documentation Standards](/docs/processes/documentation/documentation-standards.md)
4. Review our [Feature Development Process](/docs/processes/feature-development-process.md)

For any questions or clarifications, please reach out to the project maintainers.