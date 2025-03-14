# Dependency Map

This document analyzes key dependency relationships in the current codebase to identify potential issues during reorganization.

## Critical Dependencies

### Store Access Patterns

1. **Direct Store Imports**
   - `src/managers/TaskManager.ts` � imports store directly
   - `src/managers/progression/ProgressionManager.ts` � imports store directly
   - `src/systems/resourceManager.ts` � imports store directly
   - `src/systems/buildingManager.ts` � imports store directly
   - `src/systems/eventManager.ts` � imports store directly

2. **Store Injection (Desired Pattern)**
   - `src/components/App.tsx` � injects store to managers

### Circular Dependencies

1. **Manager-System Circularity**
   - `TaskManager` � `ResourceManager` (mutual dependencies)
   - `ProgressionManager` � `ResourceManager` (mutual dependencies)

2. **State-Interface Circularity**
   - `src/state/resourcesSlice.ts` � `src/interfaces/Resource.ts`
   - `src/state/gameSlice.ts` � `src/interfaces/GameState.ts`

### Component Dependencies

1. **UI Component Duplication**
   - `src/components/common/Button.tsx` and `src/components/ui/Button.tsx`
   - `src/components/common/ProgressBar.tsx` and `src/components/ui/ProgressBar.tsx`
   - `src/components/common/Tooltip.tsx` and `src/components/ui/Tooltip.tsx`

2. **Feature-UI Dependencies**
   - `src/components/resources/ResourceDisplay.tsx` � depends on `src/components/ui/`
   - `src/components/buildings/BuildingList.tsx` � depends on `src/components/common/`

## High-Level Dependency Structure

```
App

    Redux Store
    
        gameSlice
        resourcesSlice
        structuresSlice
        tasksSlice
        eventsSlice

    Core Engine
    
        GameLoop
        GameTimer
        GameManager

    Game Systems
    
        ResourceManager     depends on   
        BuildingManager                  
        WorkerManager                    
        EventManager                     
        SaveManager                      
                                          
    Managers                              
                                         
        TaskManager      depends on     
        ProgressionManager   depends on  

    UI Components
     
         Layout Components
         Feature Components
         Common/UI Components
```

## Dependency Issues and Risks

1. **Store Direct Access**
   - Risk: Changes to store structure affect multiple files
   - Mitigation: Complete dependency injection implementation

2. **Duplicate Component Implementations**
   - Risk: Inconsistent UI, maintenance burden
   - Mitigation: Consolidate to single implementation in UI directory

3. **Multiple Game Loops**
   - Risk: Timing inconsistencies, wasted resources
   - Mitigation: Standardize on single implementation

4. **Circular Type Dependencies**
   - Risk: Compilation issues, unclear boundaries
   - Mitigation: Create interfaces for public API, implementations for details

5. **Selector Pattern Inconsistency**
   - Risk: Inefficient renders, unpredictable behavior
   - Mitigation: Standardize on memoized selector pattern

## Migration Strategy

1. **Break Circular Dependencies First**
   - Create interfaces for system APIs
   - Implement proper dependency injection

2. **Consolidate Redux Store**
   - Merge duplicate slices
   - Standardize selector patterns

3. **Unify Common Components**
   - Create single source of truth for UI components
   - Update all imports to use consolidated components

4. **Standardize Manager Patterns**
   - Apply consistent initialization pattern
   - Convert all to dependency injection

5. **Refactor Type System**
   - Consolidate interfaces and types
   - Resolve circular dependencies