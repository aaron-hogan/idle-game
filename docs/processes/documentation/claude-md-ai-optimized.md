# Anti-Capitalist Idle Game - AI-Optimized Guidelines

## <AI-CRITICAL> GIT PROCESS

1. ALWAYS create branch before any work
   - features: `feature/name`
   - fixes: `fix/name`
   - docs: `docs/name`
   - refactor: `refactor/name`

2. NEVER work directly on main branch

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
- Functional React components
- Redux Toolkit for state
- Jest/React Testing Library
- Feature-based directory structure

## DOCUMENTATION MAP

### Project Documentation
- Project overview: `/docs/project/overview.md`
- Current status: `/docs/project/status.md`
- Specifications: `/docs/specifications/game-specification.md`

### Feature Documentation
- Core Game Loop: `/docs/features/core-game-loop/core-game-loop.md`
- Debug Panel: `/docs/features/debug-panel/debug-panel.md`
- Event System: `/docs/features/event-system/event-system.md`
- Milestone Tracking: `/docs/features/milestone-tracking/milestone-tracking.md`
- Progression System: `/docs/features/progression-system/progression-system.md`
- Resource System: `/docs/features/resource-earning-mechanics/implementation-guide.md`
- Timer System: `/docs/features/timer/timer.md`
- UI Components: `/docs/features/visual-design/visual-design.md`

### Process Documentation
- Workflow: `/docs/processes/safe-workflow-checklist.md`
- Git process: `/docs/processes/git/git-workflow.md`
- PR process: `/docs/processes/pr-workflow.md`
- Documentation standards: `/docs/processes/documentation/documentation-standards.md`
- Testing standards: `/docs/processes/code-quality/testing-standards.md`

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

1. Write tests BEFORE implementation
2. Include unit, integration, and e2e tests
3. Test both happy paths and edge cases
4. Verify no console errors/warnings
5. Check browser compatibility

## ARCHITECTURE

- Component-based architecture
- Clean separation of concerns
- Data-driven design
- Event-based communication
- Modular structure
- Observer pattern for updates

## RECENT FIXES

Most recent work in `ui-improvements-recovery` branch:
- Grid layout
- Resource cards
- Milestone tracking
- Tab navigation
- Page organization

## <AI-CRITICAL> PR CHECKLIST

- All tests pass
- Linting passes
- Type checking passes
- Documentation complete
- No debug/console code
- Branch updated with main