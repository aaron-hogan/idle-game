# Anti-Capitalist Idle Game - Developer Guidelines

## Recent Recovery Work (2025-02-26)

We recently recovered from a major issue where UI improvements broke passive resource generation. Key lessons:

1. Keep UI changes separate from system changes
2. Make small, focused commits with proper testing
3. Be cautious when modifying core game loop or resource systems
4. Document changes thoroughly

Recovery process documented in: `/docs/features/ui-improvements/recovery-process.md`

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
- **TypeScript**: Use strict typing and interfaces for all data structures
- **Components**: Functional React components with hooks
- **State Management**: Redux with Redux Toolkit for actions/reducers
- **Imports**: Group imports (React, libraries, local)
- **Naming**: camelCase for variables/functions, PascalCase for components/classes
- **Error Handling**: Use error boundaries for React components, try/catch for async operations

## Architecture
- Follow component-based architecture with clear separation of concerns
- Use data-driven design for game entities and events
- Maintain modular codebase to allow easy addition of new content
- Implement observer pattern for event handling and UI updates

## Testing

- Write tests **early and often** during feature development
- Every feature must have comprehensive test coverage:
  - Unit tests for isolated functionality
  - Integration tests for feature interactions
  - End-to-end tests for user workflows where appropriate
- Test both happy paths and edge cases
- Use TDD (Test-Driven Development) approach when possible
- Run relevant tests after every significant change
- Run full test suite before submitting for review
- Document test scenarios in the feature documentation

## Documentation

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

### IMPORTANT: Safety Guidelines
- **NEVER** force push to `main` or `develop` branches
- **ALWAYS** get explicit permission before:
  - Merging to `develop` or `main`
  - Rebasing shared branches
  - Deleting any branch
  - Creating a release tag
  - Modifying CI/CD configurations
- **ALWAYS** create a backup branch before destructive operations
- **ALWAYS** double-check branch names before destructive operations
- **NEVER** manually edit commit history of shared branches
- When in doubt, **ASK** before proceeding with any git operation that might affect others

### Branch Strategy
- `main` - Production-ready code, protected branch
- `develop` - Integration branch for features, protected branch
- `feature/*` - Feature branches (e.g., `feature/event-system`)
- `bugfix/*` - Bug fix branches
- `hotfix/*` - Critical fixes for production
- `docs/*` - Documentation updates

### Development Workflow
1. **Branch Creation**:
   - Create branch from `develop` using naming convention above
   - Example: `git checkout -b feature/resource-system develop`

2. **Commit Guidelines**:
   - Use descriptive commit messages with prefix:
     - `feat:` - New features
     - `fix:` - Bug fixes
     - `docs:` - Documentation changes
     - `test:` - Adding or modifying tests
     - `refactor:` - Code changes that neither fix bugs nor add features
   - Example: `feat: implement resource accumulation algorithm`
   - Keep commits atomic and focused on single changes

3. **Pull Requests**:
   - Create PR against `develop` when feature is complete
   - PR title should match commit message style
   - Include detailed description with:
     - What changes were made
     - Why changes were made
     - Testing verification
     - Screenshots if UI changes present
   - Request review from at least one team member
   - All CI checks must pass before merging
   - **ALWAYS** get explicit approval before merging

4. **Code Review**:
   - Reviewers should check for:
     - Code quality and standards adherence
     - Test coverage
     - Documentation completeness
     - Performance considerations
   - Address all review comments before merge
   - Squash and merge to keep history clean

5. **Release Process**:
   - **ALWAYS** get explicit permission before releasing
   - Create a release branch from `develop` named `release/vX.Y.Z`
   - Verify all tests pass on the release branch
   - Create a PR from release branch to `main`
   - After approval, merge to `main`
   - Tag releases with semantic versioning (`v1.0.0`)
   - Include release notes in PR description
   - Merge `main` back to `develop` to sync version changes

## CI/CD Pipeline
- GitHub Actions runs on all PRs and pushes to main branches
- Pipeline includes:
  - Linting
  - Type checking
  - Unit tests
  - Integration tests
  - Build validation
- PR cannot be merged if any check fails
- **IMPORTANT**: Get explicit permission before:
  - Modifying CI/CD workflows
  - Bypassing CI checks (even temporarily)
  - Changing branch protection rules
  - Adding or removing required checks
- **ALWAYS** test workflow changes in a feature branch first
- **NEVER** disable security checks or code quality validations

## Feature Development Process
1. **Planning**:
   - Create feature folder in `/docs/features/feature-name/`
   - Write detailed `plan.md` including implementation prompt
   - Plan test coverage and create test stubs
   - Create feature branch with `feature/feature-name` naming

2. **Implementation**:
   - Follow TDD approach when possible
   - Implement core functionality with tests
   - Document as you go in `feature-name.md`
   - Track TODOs in `todo.md`
   - Make regular, atomic commits with descriptive messages

3. **Testing**:
   - Ensure comprehensive test coverage
   - Test edge cases and integration points
   - Document test scenarios in the feature documentation
   - Verify all tests pass locally before creating PR

4. **Pull Request**:
   - Create PR against `develop` branch
   - Ensure CI pipeline passes
   - Address review feedback
   - Update documentation as needed

5. **Documentation**:
   - Complete internal documentation in `/docs/features/`
   - Write implementation `summary.md`
   - Validate documentation using validation script

6. **Finalization**:
   - Merge PR into `develop` branch
   - Update project status in `/docs/project/status.md`
   - Request approval to create final wiki documentation
   - ONLY after explicit approval:
     - Create final documentation in the wiki
     - Update wiki Home page with links to new documentation
     - Request review of wiki documentation