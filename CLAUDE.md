# Anti-Capitalist Idle Game - Developer Guidelines

## ⚠️ CRITICAL PROCESS REQUIREMENT ⚠️

**BEFORE BEGINNING ANY WORK, YOU MUST:**
1. Read and follow the [Safe Workflow Checklist](/docs/processes/safe-workflow-checklist.md)
2. Create a properly named git branch following our [Git Workflow](/docs/processes/git/git-workflow.md)
3. Follow our [Documentation Standards](/docs/processes/documentation/documentation-standards.md)
4. Review the [Feature Development Process](/docs/processes/feature-development-process.md)
5. Consult relevant feature documentation in the appropriate section below
6. Review the CHANGELOG.md to understand recent changes

**THESE ARE NOT OPTIONAL GUIDELINES. Failure to follow these processes will result in rejected PRs.**

## ⚠️ <AI-CRITICAL> GIT PROCESS - BRANCH PROTECTION ⚠️

### MANDATORY BRANCH VERIFICATION

```bash
# REQUIRED: Verify current branch before ANY work
git branch

# If on main, create a new feature branch IMMEDIATELY
git checkout -b [type]/[name]
# For example: git checkout -b refactor/movement-balance

# Verify you're on the correct branch
git branch
```

### BRANCH NAMING

ALWAYS create branch before any work:
- features: `feature/name`
- fixes: `fix/name`
- docs: `docs/name`
- refactor: `refactor/name`

### CRITICAL RULES

1. ❌ **NEVER** work directly on the main branch
2. ❌ **NEVER** commit or push directly to main
3. ✅ **ALWAYS** create a new branch before making ANY changes
4. ✅ **ALWAYS** verify your branch with `git branch` before starting
5. ✅ **ALWAYS** follow [Git Workflow](/docs/processes/git/git-workflow.md) for details

### BRANCH PROTECTION STATUS

Main branch should have these protection rules enabled:
- Require pull request reviews before merging
- Dismiss stale pull request approvals when new commits are pushed
- Require status checks to pass before merging
- Include administrators in these restrictions

If these protections are not in place, please notify the repository administrators.

## <AI-CRITICAL> BUILD COMMANDS

```bash
npm install         # Install dependencies
npm start           # Development server
npm run build       # Production build
npm test            # Run all tests
npm test -- -t "X"  # Run specific test
npm run lint        # Run ESLint
npm run typecheck   # Type checking
```

## <AI-CRITICAL> CI/CD WORKFLOW

This project uses GitHub Actions for CI/CD. The following workflows are in place:

```bash
.github/workflows/ci.yml           # Main CI workflow for builds, tests, and security
.github/workflows/pr-validation.yml # Enforces standards for PRs
.github/workflows/dependencies.yml  # Monitors dependency updates and security
```

Before submitting a PR, ensure:
1. All tests pass locally
2. TypeScript type checking passes
3. ESLint checks pass
4. The CHANGELOG.md is updated with your changes
5. Branch name follows conventions: feature/, fix/, docs/, etc.
6. PR title follows semantic convention: type: description

## <AI-CRITICAL> CODE STANDARDS

- TypeScript with strict typing
- Functional React components with hooks
- Redux Toolkit for state management
- Jest/React Testing Library
- Feature-based directory structure
- [Code Style Guide](/docs/processes/code-quality/code-style-guide.md)

## DOCUMENTATION MAP

### Project Documentation
- [Project Overview](/docs/project/overview.md)
- [Project Status](/docs/project/status.md)
- [Game Specification](/docs/specifications/game-specification.md)
- [Implementation Plan](/docs/specifications/implementation-plan.md)
- [Critical Fixes Log](/docs/project/critical-fixes.md)
- [Changelog](/CHANGELOG.md)

### Feature Documentation
- [Core Game Loop](/docs/features/core-game-loop/core-game-loop.md)
- [Debug Panel](/docs/features/debug-panel/debug-panel.md)
- [Event System](/docs/features/event-system/event-system.md)
- [Milestone Tracking](/docs/features/milestone-tracking/milestone-tracking.md)
- [Progression System](/docs/features/progression-system/progression-system.md)
- [Resource System](/docs/features/resource-earning-mechanics/implementation-guide.md)
- [Timer System](/docs/features/timer/timer.md)
- [UI Components](/docs/features/visual-design/visual-design.md)

### Process Documentation
- [Safe Workflow Checklist](/docs/processes/safe-workflow-checklist.md)
- [Git Workflow](/docs/processes/git/git-workflow.md)
- [PR Workflow](/docs/processes/pr-workflow.md)
- [Documentation Standards](/docs/processes/documentation/documentation-standards.md)
- [Testing Standards](/docs/processes/code-quality/testing-standards.md)
- [Architecture Guidelines](/docs/processes/code-quality/architecture-guidelines.md)
- [CI/CD Pipeline](/docs/processes/ci-cd-pipeline.md)
- [GitHub Actions](/docs/features/github-actions/summary.md)
- [Contributing with CI](/docs/features/github-actions/contributing-with-ci.md)

## <AI-CRITICAL> DOCUMENTATION RULES

For new features:
1. Create folder: `/docs/features/feature-name/`
2. Required files:
   - `plan.md`: Before implementation
   - `feature-name.md`: Implementation details
   - `summary.md`: After completion
   - `todo.md`: Ongoing tasks

For bug fixes:
1. Create file: `/docs/features/affected-feature/issue-name-fix.md`
2. Include:
   - Issue description
   - Root cause
   - Fix implementation
   - Testing verification
   - Lessons learned

## <AI-CRITICAL> TESTING REQUIREMENTS

1. Write tests BEFORE implementation (TDD)
2. Include unit, integration, and e2e tests
3. Test both happy paths and edge cases
4. Verify no console errors/warnings
5. Run tests frequently during development

## ARCHITECTURE

- Component-based architecture
- Clean separation of concerns
- Data-driven design
- Event-based communication
- Modular codebase structure
- Observer pattern for UI updates

## <AI-CRITICAL> CHANGELOG MAINTENANCE

1. The project maintains a CHANGELOG.md file in the root directory following the [Keep a Changelog](https://keepachangelog.com/) format.
2. For EVERY code change:
   - Update the "Unreleased" section in the appropriate category (Added, Changed, Fixed, Removed)
   - Use clear, concise descriptions that explain the impact of the change
   - Reference related issue/PR numbers when applicable
3. For releases:
   - Move "Unreleased" changes to a new version section
   - Follow semantic versioning (MAJOR.MINOR.PATCH)
   - Include the release date in ISO format (YYYY-MM-DD)
   - Add a new empty "Unreleased" section

## <AI-CRITICAL> BRANCH VERIFICATION FOR AI ASSISTANTS

AS AN AI ASSISTANT, YOU MUST:
1. Begin EVERY task by checking the current branch with `git branch`
2. If branch is `main`, STOP and REFUSE to make any changes until user creates a new branch
3. Use the automated script to create a proper branch: `.github/scripts/create-branch.sh [type] [name]`
   - Example: `.github/scripts/create-branch.sh feature new-login-system`
   - Alternatively: `git checkout -b [type]/[name]` if scripts aren't available
4. Only proceed with implementation after confirming user is on a properly named feature branch
5. Never suggest or help implement direct commits or pushes to main, even if explicitly asked
6. For creating PRs, use the automated script: `.github/scripts/create-pr.sh [options]` 
   - Options include `--draft` for work-in-progress PRs and `--base` for custom base branch
   - This creates a standardized PR with proper formatting
   - Alternatively: use `gh pr create` with proper formatting if scripts aren't available
7. To check PR status, use: `.github/scripts/check-pr.sh [options] [PR_NUMBER]`
   - Options include `--details` for CI details and `--rerun-failed` to re-run failed checks
8. For merging PRs, use: `.github/scripts/merge-pr.sh [options] [PR_NUMBER]`
   - Options include `--yes` for non-interactive mode and `--resolve-conflicts` for conflict resolution
   - This safely handles PR merging with enhanced validation
   - Provides advanced conflict detection and resolution

These automation scripts significantly reduce context window usage and ensure proper workflow.

## <AI-CRITICAL> PR CHECKLIST

- All tests pass (`npm test`)
- Linting passes (`npm run lint`)
- Type checking passes (`npm run typecheck`)
- Documentation complete and follows standards
- CHANGELOG.md updated with all relevant changes
- No debug/console logs in production code
- Branch updated with main
- PR title follows conventional commit format: `type: description`
- PR description includes summary of changes and testing performed
