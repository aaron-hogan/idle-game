# Manager Dependency Injection Implementation

## Overview

This document outlines the implementation of dependency injection (DI) for manager classes in our game architecture. The goal of this refactoring is to decouple manager classes from direct Redux store dependencies, making them more testable and allowing for alternative implementations of state management if needed in the future.

## What We've Accomplished

1. **Implemented DI for ResourceManager and BuildingManager**
   - Created clear interfaces for required dependencies
   - Removed direct store imports
   - Replaced direct action creator and store method calls with injected dependencies
   - Updated App.tsx to properly initialize managers with dependencies

2. **Maintained Singleton Pattern with DI**
   - Kept singleton pattern for backwards compatibility
   - Modified getInstance to accept dependencies on first call
   - Ensured proper error handling for initialization

3. **Robust Backward Compatibility**
   - Maintained the original `initialize(store)` API
   - Added automatic action creator discovery for backward compatibility
   - Designed getInstance to handle both store and dependencies
   - Gracefully transitions between old and new patterns

4. **Improved Type Safety**
   - Added type imports instead of value imports for action creators
   - Properly typed all dependencies
   - Removed unnecessary type assertions
   - Added proper type guards for backward compatibility

## Issues and Next Steps

1. **Tests Are Failing**
   - Tests expect the old `initialize(store)` method
   - Need to update all tests to use the new DI pattern
   - Created branch `fix/dependency-injection-tests` for this work

2. **Remaining Managers to Update**
   - EventManager
   - SaveManager
   - GameManager
   - WorkerManager

3. **GameLoop Refactoring**
   - GameLoop is tightly coupled to managers
   - Needs to be updated to work with the new DI pattern

## Implementation Pattern

For each manager, we follow this pattern:

1. **Define Dependencies Interface**
   ```typescript
   export interface ManagerDependencies {
     dispatch: AppDispatch;
     getState: () => RootState;
     actions: {
       // Required action creators
     };
   }
   ```

2. **Update Constructor**
   ```typescript
   constructor(dependencies: ManagerDependencies) {
     this.dispatch = dependencies.dispatch;
     this.getState = dependencies.getState;
     this.actions = dependencies.actions;
   }
   ```

3. **Add Backward Compatible getInstance**
   ```typescript
   public static getInstance(dependenciesOrStore?: ManagerDependencies | any): Manager {
     if (!Manager.instance) {
       if (!dependenciesOrStore) {
         // Create empty instance
         Manager.instance = new Manager({/* empty placeholder dependencies */});
       } else if ('dispatch' in dependenciesOrStore && 'getState' in dependenciesOrStore && 
                 'actions' in dependenciesOrStore) {
         // If full dependencies are provided
         Manager.instance = new Manager(dependenciesOrStore);
       } else {
         // If a store is provided (backward compatibility)
         const instance = new Manager({/* empty placeholder dependencies */});
         instance.initialize(dependenciesOrStore);
         Manager.instance = instance;
       }
     } else if (dependenciesOrStore) {
       // Handle store passed to existing instance
       Manager.instance.initialize(dependenciesOrStore);
     }
     
     return Manager.instance;
   }
   ```

4. **Keep initialize Method for Backward Compatibility**
   ```typescript
   public initialize(store: any): void {
     // If already initialized through constructor, don't reinitialize
     if (this.dispatch && this.getState && this.actions) {
       return;
     }

     // Import necessary action creators
     const someActions = require('../state/someSlice');
     
     // Set up dependencies from store
     this.dispatch = store.dispatch;
     this.getState = store.getState;
     this.actions = {
       action1: someActions.action1,
       action2: someActions.action2,
     };
   }
   ```

5. **Update Methods to Use Dependencies**
   ```typescript
   doSomething(): void {
     const state = this.getState();
     // ...
     this.dispatch(this.actions.someAction({ /* ... */ }));
   }
   ```

6. **Initialize in App.tsx**
   ```typescript
   const manager = Manager.getInstance({
     dispatch: store.dispatch,
     getState: store.getState,
     actions: {
       action1: someActions.action1,
       action2: someActions.action2,
     }
   });
   ```

## Benefits

1. **Testability**
   - Can easily mock dependencies for unit tests
   - No need to create complex Redux store mocks

2. **Decoupling**
   - Managers are no longer tightly coupled to Redux
   - Could be used with different state management solutions

3. **Clearer Dependencies**
   - Dependencies are explicitly declared and injected
   - No hidden dependencies or imports

4. **Type Safety**
   - Better TypeScript type checking for dependencies
   - Prevents errors from incorrect use of store or actions

5. **Backward Compatibility**
   - Existing code continues to work without changes
   - Tests can be updated incrementally