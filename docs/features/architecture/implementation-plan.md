# Project Structure Reorganization: Implementation Plan

This document outlines the step-by-step implementation plan for reorganizing the project structure according to the proposed structure in [structure-reorganization.md](structure-reorganization.md).

## Phase 0: Preparation (Current PR)

**Goal**: Establish documentation and plan for restructuring.

- [x] Create comprehensive documentation of proposed structure
- [x] Create file mapping for migration
- [x] Document key dependencies and potential issues
- [x] Create detailed implementation plan (this document)
- [x] Create branch for documentation

## Phase 1: Dependency Injection (Mostly Complete)

**Goal**: Break direct store dependencies to enable safe refactoring.

- [x] Implement dependency injection for TaskManager
- [x] Implement dependency injection for ProgressionManager
- [x] Implement dependency injection for ResourceManager with backward compatibility
- [x] Implement dependency injection for BuildingManager with backward compatibility
- [ ] Implement dependency injection for EventManager
- [ ] Implement dependency injection for SaveManager
- [x] Update App.tsx to inject store to managers
- [ ] Fix tests for updated manager classes

**PR**: `refactor/complete-dependency-injection`

## Phase 2: State Management Consolidation

**Goal**: Unify and standardize Redux state management.

- [ ] Create `src/state/slices` directory
- [ ] Move Redux slices from `src/redux` to `src/state/slices`
- [ ] Move slices from `src/state` root to `src/state/slices`
- [ ] Merge overlapping slice implementations
- [ ] Create domain-specific selector files in `src/state/selectors/`
- [ ] Implement consistent selector pattern with memoization
- [ ] Create domain-specific hooks in `src/state/hooks/`
- [ ] Update imports throughout codebase

**PR**: `refactor/state-management-consolidation`

## Phase 3: Type System Reorganization

**Goal**: Create consistent and non-circular type definitions.

- [ ] Create consolidated `src/types` structure
- [ ] Move interfaces from `src/interfaces` to appropriate files in `src/types`
- [ ] Move models from `src/models` to `src/types/models` (for backward compatibility)
- [ ] Resolve circular dependencies in type definitions
- [ ] Standardize naming conventions (remove I prefixes, etc.)
- [ ] Update imports throughout codebase

**PR**: `refactor/type-system-reorganization`

## Phase 4: Game Engine Reorganization

**Goal**: Create clear separation between engine components.

- [ ] Create `src/core/engine` directory for core engine components
- [ ] Move GameLoop and GameTimer to engine directory
- [ ] Create `src/core/systems` directory for game systems
- [ ] Move managers to appropriate locations in core structure
- [ ] Remove deprecated/legacy implementations
- [ ] Implement clear interfaces between systems
- [ ] Update imports throughout codebase

**PR**: `refactor/game-engine-reorganization`

## Phase 5: Component Restructuring

**Goal**: Create consistent component organization.

- [ ] Create `src/components/features` directory
- [ ] Move domain-specific components to feature directories
- [ ] Consolidate UI components in `src/components/ui`
- [ ] Move pages to `src/components/pages`
- [ ] Reorganize layout components
- [ ] Update imports throughout codebase

**PR**: `refactor/component-restructuring`

## Phase 6: Testing Reorganization

**Goal**: Create consistent testing structure.

- [ ] Move integration tests to `src/__tests__/integration`
- [ ] Move test utilities to `src/tests/utils`
- [ ] Update imports in test files
- [ ] Run all tests and fix any failures

**PR**: `refactor/testing-reorganization`

## Phase 7: Clean-up and Documentation

**Goal**: Ensure consistency and proper documentation.

- [ ] Run linting on entire codebase
- [ ] Fix any TypeScript errors
- [ ] Ensure all tests pass
- [ ] Update documentation to reflect new structure
- [ ] Create architecture diagram of new structure
- [ ] Update README with new structure information

**PR**: `docs/update-for-new-structure`

## Implementation Guidelines

### For Each Phase:

1. **Create Feature Branch**
   - Create a new branch from main for each phase
   - Follow naming convention: `refactor/phase-name`

2. **Small, Incremental Changes**
   - Make changes in small, logical groupings
   - Test frequently to catch issues early
   - Commit often with clear messages

3. **Testing**
   - Run tests after each significant change
   - Fix tests as needed for new structure
   - Ensure no regressions are introduced

4. **PR Review**
   - Provide clear documentation of changes in PR
   - Include before/after structure comparison
   - Highlight any deviations from the plan

### Critical Success Factors

1. **Backward Compatibility**
   - Maintain existing functionality throughout changes
   - Ensure game features continue to work

2. **Test Coverage**
   - Keep or improve test coverage through migration
   - Update tests to reflect new structure

3. **Documentation**
   - Update documentation in sync with code changes
   - Provide clear guidance for future development

4. **Performance**
   - Monitor for any performance impacts
   - Address any performance regressions immediately

## Rollback Plan

If issues arise during implementation:

1. **Isolated Rollback**
   - If a specific change causes problems, revert that change while keeping others
   - Fix the issue and re-implement the change

2. **Phase Rollback**
   - If an entire phase causes significant problems, revert the phase
   - Re-evaluate approach before attempting again

3. **Emergency Rollback**
   - In case of critical issues, revert to main branch
   - Document lessons learned before attempting again with a revised plan