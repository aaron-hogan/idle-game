# Anti-Capitalist Idle Game - Developer Guidelines

## ⚠️ CRITICAL PROCESS REQUIREMENT ⚠️

**BEFORE BEGINNING ANY WORK, YOU MUST:**
1. Read and follow the [Safe Workflow Checklist](/docs/processes/safe-workflow-checklist.md)
2. Create a properly named git branch following our [Git Workflow](/docs/processes/git/git-workflow.md)
3. Follow our [Documentation Standards](/docs/processes/documentation/documentation-standards.md)
4. Review the [Feature Development Process](/docs/processes/feature-development-process.md)
5. Consult relevant feature documentation in the appropriate section below

**THESE ARE NOT OPTIONAL GUIDELINES. Failure to follow these processes will result in rejected PRs.**

## <AI-CRITICAL> GIT PROCESS

1. ALWAYS create branch before any work:
   - features: `feature/name`
   - fixes: `fix/name`
   - docs: `docs/name`
   - refactor: `refactor/name`

2. NEVER work directly on main branch

3. Follow [Git Workflow](/docs/processes/git/git-workflow.md) for details

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

## <AI-CRITICAL> PR CHECKLIST

- All tests pass (`npm test`)
- Linting passes (`npm run lint`)
- Type checking passes (`npm run typecheck`)
- Documentation complete and follows standards
- No debug/console logs in production code
- Branch updated with main
