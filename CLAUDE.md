# Anti-Capitalist Idle Game - Developer Guidelines

## ⚠️ CRITICAL PROCESS REQUIREMENT ⚠️

**BEFORE BEGINNING ANY WORK, YOU MUST:**
1. Read and follow the [Safe Workflow Checklist](/docs/processes/safe-workflow-checklist.md)
2. Create a properly named git branch following our [Git Workflow](/docs/processes/git/git-workflow.md)
3. Follow our [Documentation Standards](/docs/processes/documentation/documentation-standards.md)
4. Review the [Feature Development Process](/docs/processes/feature-development-process.md)
5. Consult relevant feature documentation in the appropriate section below

**THESE ARE NOT OPTIONAL GUIDELINES. Failure to follow these processes will result in rejected PRs.**

## Instruction Library

This project maintains a comprehensive [Instruction Library](/docs/processes/instruction-library-index.md) with detailed process documentation and standards. Always refer to these documents for the most up-to-date guidelines.

## Recent Recovery Work (2025-02-26)

We recently recovered from major issues including console spam and missing files. See the [Critical Fixes Log](/docs/project/critical-fixes.md) for details.

To prevent similar issues, we've created the following process documentation:
- [Safe Workflow Checklist](/docs/processes/safe-workflow-checklist.md) - Steps to verify before making changes
- [Pull Request Workflow](/docs/processes/pr-workflow.md) - Comprehensive PR creation and merge process

Key lessons from recent fixes:

1. Keep UI changes separate from system changes
2. Make small, focused commits with proper testing
3. Be cautious when modifying core game loop or resource systems
4. Document changes thoroughly
5. When updating type definitions, ensure all imports are updated across files
6. Always verify referenced files exist when modifying components
7. Use proper verification checks before and after making changes

IMPORTANT: All recovery-related documentation must follow this structure:
- Recovery overview: `/docs/features/ui-improvements/recovery-process.md`
- Specific fixes must have their own dedicated documentation files with clear names
  - Example: `/docs/features/ui-improvements/resource-upgrade-fix.md`
- Each fix document must include:
  - Issue description
  - Root cause
  - Fix implementation details
  - Testing verification
  - Lessons learned
  - Links to related files

Stable work is now in the `ui-improvements-recovery` branch.

### UI Improvements Added:

- 3-column grid layout for better organization
- Resource generator cards with efficiency indicators
- Horizontal milestone progress tracking
- Tab-based navigation system - see `/docs/features/ui-improvements/navigation-system.md`
- Dedicated pages for main gameplay, upgrades, progression, and settings

## Build Commands
- `npm install` - Install dependencies
- `npm start` - Start development server
- `npm run build` - Create production build
- `npm test` - Run all tests
- `npm test -- -t "testName"` - Run specific test
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Code Style

We follow strict coding standards to ensure consistency across the project. For detailed guidelines, refer to our [Code Style Guide](/docs/processes/code-quality/code-style-guide.md).

Key points:
- Use TypeScript with strict typing and interfaces
- Functional React components with hooks
- Redux with Redux Toolkit for state management
- Group imports by source (React, libraries, local)
- Use consistent naming conventions (camelCase, PascalCase)
- Proper error handling with boundaries and try/catch

## Architecture

Our application follows a component-based architecture with clean separation of concerns. For detailed architectural guidelines, see our [Architecture Guidelines](/docs/processes/code-quality/architecture-guidelines.md).

Key principles:
- Component-based architecture with clear responsibilities
- Data-driven design for game entities and events
- Modular codebase structure for easy extension
- Observer pattern for event handling and UI updates

## Testing

Testing is a critical part of our development process to ensure code quality and prevent regressions. For comprehensive testing standards, refer to our [Testing Standards](/docs/processes/code-quality/testing-standards.md).

Key testing requirements:
- Write tests early and often during development
- Include unit, integration, and end-to-end tests
- Test both happy paths and edge cases
- Follow TDD approach when possible
- Run tests frequently during development
- Document test scenarios in feature documentation

## Documentation

Documentation is crucial for project maintainability and knowledge sharing. For comprehensive documentation standards, refer to our [Documentation Standards](/docs/processes/documentation/documentation-standards.md).

### Documentation Structure

The documentation is organized into the following directories:

- **Features** (`/docs/features/`): Feature-specific documentation
- **Guides** (`/docs/guides/`): Developer guides and onboarding
- **Processes** (`/docs/processes/`): Development processes and standards
- **Project** (`/docs/project/`): Project-level information
- **Specifications** (`/docs/specifications/`): Game specifications
- **Archive** (`/docs/archive/`): Archived documentation
- **Wiki** (`idle-game.wiki/`): Public-facing finalized feature documentation

### Documentation Style
- **Location**: All documentation files for a feature should be in kebab-case and placed in `/docs/features/[feature-name]/`
- **Format**: Markdown files with proper heading hierarchy (# for title, ## for sections)
- **Feature Documentation Set**:
  - `feature-name.md`: Main documentation of the feature
  - `plan.md`: Initial implementation plan
  - `summary.md`: Summary of implementation results
  - `todo.md`: Ongoing todo list for the feature
- **Content Structure**:
  - Overview section with brief feature description
  - Core Components section explaining key parts
  - Usage Guide with code examples
  - Integration section explaining connections to other systems
  - Best Practices section with recommendations
- **Code Examples**: Include well-commented TypeScript examples for implementation reference

### Documentation Management
- **ALWAYS** place new documentation in the appropriate feature folder
- For **EVERY** new feature implementation, create a folder and the complete documentation set:
  
  **Folder naming:**
  - Create folder at: `/docs/features/feature-name/` (use kebab-case)
  - Example: `/docs/features/event-system/`, `/docs/features/resources/`, `/docs/features/game-loop/`
  
  **Required documents and naming:**
  1. `/docs/features/feature-name/plan.md` - Create **BEFORE** starting development
     - Purpose: Details implementation approach, architecture, and tasks
     - Content: Goals, approach, timeline, and the **implementation prompt**
     - Must include a specific implementation prompt that will be used to create the feature
     - Use the template in `/docs/processes/documentation/templates/docs-template.md` to generate this
  
  2. `/docs/features/feature-name/feature-name.md` - Create during/after implementation
     - Purpose: Main documentation explaining how the feature works
     - Content: Overview, architecture, usage guide, API reference, integration details
     - Example: `/docs/features/event-system/event-system.md`
     - Follow the structure in `/docs/processes/documentation/templates/docs-template.md`
  
  3. `/docs/features/feature-name/summary.md` - Create when feature is complete
     - Purpose: Summarizes what was actually implemented vs. what was planned
     - Content: What was implemented, benefits added, challenges overcome, next steps
     - Follow the template in `/docs/processes/documentation/templates/docs-template.md`
  
  4. `/docs/features/feature-name/todo.md` - Create and maintain throughout development
     - Purpose: Tracks ongoing and future work for the feature
     - Content: Checklist of completed and remaining tasks, organized by category
     - Use the format from `/docs/processes/documentation/templates/docs-template.md`

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