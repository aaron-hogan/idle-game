# File Mapping: Current to Proposed Structure

This document maps current files to their locations in the proposed new structure. This will serve as a guide for the migration process.

## State Management

### Current Location ’ New Location

#### Redux Store and Slices
- `src/redux/` ’ `src/state/slices/`
- `src/state/eventsSlice.ts` ’ `src/state/slices/eventsSlice.ts`
- `src/state/gameSlice.ts` ’ `src/state/slices/gameSlice.ts` 
- `src/state/resourcesSlice.ts` ’ `src/state/slices/resourcesSlice.ts`
- `src/state/structuresSlice.ts` ’ `src/state/slices/structuresSlice.ts`
- `src/state/tasksSlice.ts` ’ `src/state/slices/tasksSlice.ts`
- `src/redux/progressionSlice.ts` ’ `src/state/slices/progressionSlice.ts`
- `src/redux/resourcesSlice.ts` ’ `src/state/slices/resourcesSlice.ts` (merge with existing)

#### Selectors
- `src/state/selectors.ts` ’ Split into domain-specific files:
  - `src/state/selectors/resourceSelectors.ts`
  - `src/state/selectors/gameSelectors.ts`
  - etc.
- `src/redux/utils.ts` ’ `src/state/utils.ts`

#### Actions
- `src/state/actions/` ’ `src/state/actions/` (maintain structure)

#### Middleware
- `src/state/middleware/` ’ `src/state/middleware/` (maintain structure)

#### Hooks
- `src/state/hooks.ts` ’ `src/state/hooks/index.ts`
- Create domain-specific hooks:
  - `src/state/hooks/useResources.ts`
  - `src/state/hooks/useGameState.ts`
  - etc.

## Components

### Current Location ’ New Location

#### UI Components
- `src/components/common/` ’ `src/components/ui/`
- `src/components/ui/` ’ `src/components/ui/` (merge with common)

#### Feature Components
- `src/components/buildings/` ’ `src/components/features/buildings/`
- `src/components/resources/` ’ `src/components/features/resources/`
- `src/components/tasks/` ’ `src/components/features/tasks/`
- `src/components/workers/` ’ `src/components/features/workers/`
- `src/components/events/` ’ `src/components/features/events/`
- `src/components/progression/` ’ `src/components/features/progression/`
- `src/components/save/` ’ `src/components/features/save/`

#### Layout Components
- `src/components/layout/` ’ `src/components/layout/` (maintain structure)
- `src/components/navigation/` ’ `src/components/layout/navigation/`

#### Page Components
- `src/pages/` ’ `src/components/pages/`

#### Root Components
- `src/components/App.tsx` ’ `src/components/App.tsx` (maintain)
- `src/components/GameTimer.tsx` ’ `src/core/engine/components/GameTimer.tsx`
- `src/components/OfflineProgressModal.tsx` ’ `src/components/features/game/OfflineProgressModal.tsx`
- `src/components/EndGameModal.tsx` ’ `src/components/features/game/EndGameModal.tsx`

## Game Engine

### Current Location ’ New Location

#### Core Engine
- `src/core/GameLoop.ts` ’ `src/core/engine/GameLoop.ts`
- `src/core/GameTimer.ts` ’ `src/core/engine/GameTimer.ts`
- `src/systems/gameLoop.ts` ’ Remove (deprecated)

#### Game Manager
- `src/core/GameManager.ts` ’ `src/core/GameManager.ts` (maintain)
- `src/managers/GameLoopManager.ts` ’ Remove (deprecated)

#### Systems
- `src/systems/resourceManager.ts` ’ `src/core/systems/ResourceSystem.ts`
- `src/systems/buildingManager.ts` ’ `src/core/systems/BuildingSystem.ts`
- `src/systems/workerManager.ts` ’ `src/core/systems/WorkerSystem.ts`
- `src/systems/eventManager.ts` ’ `src/core/systems/EventSystem.ts`
- `src/systems/saveManager.ts` ’ `src/core/systems/SaveSystem.ts`
- `src/systems/gameEndConditions.ts` ’ `src/core/systems/GameEndConditions.ts`

#### Managers
- `src/managers/TaskManager.ts` ’ `src/core/managers/TaskManager.ts`
- `src/managers/progression/ProgressionManager.ts` ’ `src/core/managers/ProgressionManager.ts`

## Types and Interfaces

### Current Location ’ New Location

#### Type Definitions
- `src/interfaces/` ’ `src/types/`
- `src/interfaces/Event.ts` ’ `src/types/events.ts`
- `src/interfaces/GameState.ts` ’ `src/types/gameState.ts`
- `src/interfaces/Resource.ts` ’ `src/types/resources.ts`
- `src/interfaces/Structure.ts` ’ `src/types/buildings.ts`
- `src/interfaces/progression/` ’ `src/types/progression.ts`
- `src/models/` ’ `src/types/models/` (move as-is for backward compatibility)
- `src/types/` ’ `src/types/` (maintain structure)

## Data and Configuration

### Current Location ’ New Location

#### Game Data
- `src/data/` ’ `src/data/` (maintain structure)
- `src/config/` ’ `src/config/` (maintain structure)
- `src/constants/` ’ `src/constants/` (maintain structure)

## Utilities

### Current Location ’ New Location

#### Utility Functions
- `src/utils/` ’ `src/utils/` (maintain structure)

## Debug Tools

### Current Location ’ New Location

#### Debug Components
- `src/debug/` ’ `src/debug/` (maintain structure)

## Testing

### Current Location ’ New Location

#### Test Utilities
- `src/utils/test-utils.tsx` ’ `src/tests/utils/test-utils.tsx`
- `src/utils/testHelpers.ts` ’ `src/tests/utils/testHelpers.ts`
- `src/utils/testUtils.ts` ’ `src/tests/utils/testUtils.ts`

#### Integration Tests
- Root integration tests ’ `src/__tests__/integration/`

#### Unit Tests
- Move to be alongside implementation files