# Anti-Capitalist Idle Game - Developer Guidelines

## ⚠️ CRITICAL PROCESS REQUIREMENT ⚠️

**BEFORE BEGINNING ANY WORK, YOU MUST:**
1. Read and follow the [Safe Workflow Checklist](/docs/processes/safe-workflow-checklist.md)
2. Create a properly named git branch following our [Git Workflow](/docs/processes/git/git-workflow.md)
3. Follow our [Documentation Standards](/docs/processes/documentation/documentation-standards.md)
4. Review the [Feature Development Process](/docs/processes/feature-development-process.md)
5. Consult relevant feature documentation in the appropriate section below

**THESE ARE NOT OPTIONAL GUIDELINES. Failure to follow these processes will result in rejected PRs.**

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

### Main Documentation Index

All project documentation is categorized below. The complete index is maintained in the [Instruction Library](/docs/processes/instruction-library-index.md).

### Getting Started

- [Development Setup](/docs/guides/development-setup.md) - Setup instructions and common commands
- [Getting Started Guide](/docs/guides/getting-started.md) - Guide for new developers
- [Contributing Guidelines](/docs/guides/contributing.md) - How to contribute to the project

### Feature Documentation

- [Core Game Loop](/docs/features/core-game-loop/core-game-loop.md) - Main game mechanics
- [Debug Panel](/docs/features/debug-panel/debug-panel.md) - Game debugging tools
- [Event System](/docs/features/event-system/event-system.md) - Event handling architecture
- [Milestone Tracking](/docs/features/milestone-tracking/milestone-tracking.md) - Player progression tracking
- [Progression System](/docs/features/progression-system/progression-system.md) - Player advancement mechanics
- [Resource Earning](/docs/features/resource-earning-mechanics/implementation-guide.md) - Resource acquisition systems
- [Timer System](/docs/features/timer/timer.md) - Game timing implementation
- [Visual Design](/docs/features/visual-design/visual-design.md) - Game aesthetics and UI principles

### Process Documentation

- [Code Style Guide](/docs/processes/code-quality/code-style-guide.md) - Coding standards
- [Architecture Guidelines](/docs/processes/code-quality/architecture-guidelines.md) - System design principles
- [Testing Standards](/docs/processes/code-quality/testing-standards.md) - Testing requirements
- [Documentation Standards](/docs/processes/documentation/documentation-standards.md) - Documentation guidelines
- [Git Workflow](/docs/processes/git/git-workflow.md) - Git processes and branch strategy
- [PR Workflow](/docs/processes/pr-workflow.md) - Pull request creation and review
- [Feature Development Process](/docs/processes/feature-development-process.md) - Feature development lifecycle
- [CI/CD Pipeline](/docs/processes/ci-cd-pipeline.md) - Automated build and test processes
- [Safe Workflow Checklist](/docs/processes/safe-workflow-checklist.md) - Important safety procedures

### Project Status & Specifications

- [Game Specification](/docs/specifications/game-specification.md) - Complete game design specification
- [Implementation Plan](/docs/specifications/implementation-plan.md) - Overall development roadmap
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
5. Consult relevant feature documentation in the appropriate section above

<<<<<<< HEAD
For any questions or clarifications, please reach out to the project maintainers.
=======
### Bug Fix Documentation
- **ALWAYS** document significant bug fixes with a dedicated markdown file
- File naming convention: `/docs/features/affected-feature/[issue-name]-fix.md`
- Example: `/docs/features/resources/passive-generation-fix.md`

**Required sections for bug fix documentation:**
1. **Issue Description**
   - Clear description of the bug/issue
   - Error messages, stack traces, or screenshots if applicable
   - Steps to reproduce (if known)

2. **Root Cause Analysis**
   - Technical explanation of what caused the issue
   - Code examples showing the problematic code
   - Explanation of why the issue occurred

3. **Fix Implementation**
   - Code changes made to fix the issue
   - Explanation of why this approach was chosen
   - Any alternative approaches considered

4. **Testing Verification**
   - How the fix was tested
   - Confirmation that the issue is resolved
   - Any regression testing performed

5. **Lessons Learned**
   - What can be done to prevent similar issues
   - Changes to development practices, if any
   - Links to related PRs or commits

6. **Related Documentation**
   - Links to other relevant documentation
   - Any documentation that was updated as a result

### Documentation Validation
- **ALWAYS validate documentation** using the script:
  ```bash
  cd docs
  ./processes/documentation/validation/validate-docs.sh
  ```
- After creating or updating any documentation, run the validation script
- Fix any issues identified by the validation script before committing changes
- Refer to `/docs/processes/documentation/standards.md` for comprehensive documentation standards
- Refer to `/docs/processes/documentation/validation/README.md` for validation process details

### Documentation Maintenance
- **ALWAYS** use the templates provided in `/docs/processes/documentation/templates/docs-template.md`
- **ALWAYS** include the specific implementation prompt in the plan document
- If any documents already exist in a non-standard location, move them to the proper feature folder
- Update `/docs/README.md` when adding new documentation sections
- Update `/docs/project/status.md` when making significant documentation changes
- Maintain documentation alongside code changes to ensure it stays current
- Review existing documentation when making changes to ensure consistency

### Wiki Documentation
- **IMPORTANT**: ALWAYS get explicit approval before creating or updating any wiki documentation
- **NEVER** create wiki pages without first getting confirmation that the feature is ready for final documentation
- Before starting wiki documentation, verify:
  - Feature is complete and thoroughly tested
  - All internal docs are complete and validated
  - Feature has been approved for public documentation
  - Feature has been merged to develop branch

- Wiki pages should be created for each completed feature using the following convention:
  - Page name: `Feature-Name` (in PascalCase)
  - Example: `Event-System.md`, `Resource-Management.md`

- Wiki documentation should focus on:
  - Complete feature overview for users and developers
  - Architecture and integration details
  - Public APIs and usage examples
  - Best practices and anti-patterns
  - Links to relevant source code and internal docs

- The wiki serves as the source of truth for finalized feature documentation
- ALWAYS update the wiki Home page to link to new feature documentation
- When making significant updates to a feature, also update its wiki page

- **After wiki documentation is complete**:
  - Request review from a team member
  - Get approval before considering the documentation finalized
  - Notify the team that documentation has been published

## Git Workflow

⚠️ **MANDATORY REQUIREMENT**: We follow a structured Git workflow to maintain a clean and organized repository. This workflow is NOT optional and MUST be followed for all work.

**The FIRST step for ANY work is to create a properly named branch from main.**

For comprehensive Git guidelines, refer to our [Git Workflow](/docs/processes/git/git-workflow.md) documentation and [PR Workflow](/docs/processes/pr-workflow.md) guide.

### IMPORTANT: Safety Guidelines
- **NEVER** proceed with any work without first creating a properly named branch
- **NEVER** force push to `main` or `develop` branches
- **NEVER** make changes directly on the main branch
- **ALWAYS** create a new branch before beginning any work
- **ALWAYS** get explicit permission before merging to protected branches
- **ALWAYS** create a backup branch before performing destructive operations
- **ALWAYS** double-check branch names before executing commands
- When in doubt, **ASK** before proceeding with any git operation that might affect others

### Branch Strategy
Our branching strategy is based on GitFlow:
- `main` - Production-ready code, protected branch
- `develop` - Integration branch for features, protected branch
- `feature/*` - Feature branches (from develop)
- `bugfix/*` - Bug fix branches (from develop)
- `hotfix/*` - Critical fixes for production (from main)
- `docs/*` - Documentation updates

See the full [Git Workflow](/docs/processes/git/git-workflow.md) for details on branch naming, commit messages, and merge strategies.


## CI/CD Pipeline

We use automated CI/CD pipelines to ensure code quality and consistency. For details on our pipeline configuration, refer to the [Git Workflow](/docs/processes/git/git-workflow.md#ci-integration) documentation.

Key points:
- GitHub Actions runs on all PRs and pushes to main branches
- Checks include linting, type checking, tests, and build validation
- PRs cannot be merged if any check fails
- Get explicit permission before modifying CI workflows
- Never disable security checks or code quality validations

## Feature Development Process

We follow a structured process for feature development to ensure quality and consistency. For detailed guidelines, refer to our [Documentation Standards](/docs/processes/documentation/documentation-standards.md) for documentation requirements and [Git Workflow](/docs/processes/git/git-workflow.md) for development processes.

The feature development process includes:

1. **Planning**: Create documentation folder and plan document before development
2. **Implementation**: Follow TDD approach and make regular, focused commits
3. **Testing**: Ensure comprehensive test coverage for all functionality
4. **Pull Request**: Follow our [PR Workflow](/docs/processes/pr-workflow.md) guidelines
5. **Documentation**: Complete all required documentation and validate it
6. **Finalization**: Update project status and wiki documentation as needed

For each feature, create comprehensive documentation in a dedicated folder at `/docs/features/feature-name/` with all required documents as specified in the [Documentation Standards](/docs/processes/documentation/documentation-standards.md).
>>>>>>> docs/critical-git-process-emphasis
