# Dependency Injection Implementation

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

3. **Improved Type Safety**
   - Added type imports instead of value imports for action creators
   - Properly typed all dependencies
   - Removed unnecessary type assertions

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

2. **Update Constructor and getInstance**
   ```typescript
   constructor(dependencies: ManagerDependencies) {
     this.dispatch = dependencies.dispatch;
     this.getState = dependencies.getState;
     this.actions = dependencies.actions;
   }
   
   public static getInstance(dependencies?: ManagerDependencies): Manager {
     if (!Manager.instance) {
       if (!dependencies) {
         throw new Error('Manager.getInstance requires dependencies on first call');
       }
       Manager.instance = new Manager(dependencies);
     }
     return Manager.instance;
   }
   ```

3. **Update Methods to Use Dependencies**
   ```typescript
   doSomething(): void {
     const state = this.getState();
     // ...
     this.dispatch(this.actions.someAction({ /* ... */ }));
   }
   ```

4. **Initialize in App.tsx**
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