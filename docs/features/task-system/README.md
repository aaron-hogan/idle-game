# Task and Activities System

This directory contains documentation for the Task and Activities System, a core gameplay component that allows players to assign workers to tasks and earn resources.

## Key Documents

- [Task System Test Plan](task-system-test-plan.md) - Comprehensive test plan for the task system

## System Overview

The Task and Activities System allows players to:

- Assign workers to various tasks
- Earn resources by completing tasks
- Unlock new tasks through progression
- Complete repeatable tasks for ongoing resource generation

## System Components

The system is composed of:

1. **TaskManager** - Core manager class for task handling
2. **TaskSlice** - Redux state for tasks
3. **TaskMiddleware** - Middleware for handling resource costs and rewards
4. **Task UI Components** - Visual representation of tasks
5. **EventEmitter Integration** - Event system for task state changes

## Implementation Details

Tasks include various attributes:
- ID and name
- Duration
- Resource costs and rewards
- Requirements for unlocking
- Repeat settings

For the full testing approach and implementation details, see the [Task System Test Plan](task-system-test-plan.md).

## Related Systems

- [Resource Earning Mechanics](/docs/features/resource-earning-mechanics/README.md)
- [Event System](/docs/features/event-system/README.md)
- [Game Loop](/docs/features/core-game-loop/README.md)