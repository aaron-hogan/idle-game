# Features Documentation

This directory contains documentation for all game features, organized by feature area.

## Current Features

### Core Systems

- [**Resource Earning Mechanics**](resource-earning-mechanics/README.md) - Enhanced resource generation system with manual clicking, production thresholds, and multidimensional opposition
  - Implements click-to-earn resource generation
  - Adds production rate thresholds for milestone eligibility
  - Creates strategic opposition dimensions (Oppression, Division, Apathy, Recuperation)
  - Provides automation rewards for progression

- [**Milestone Tracking**](milestone-tracking/README.md) - System for tracking progress toward game milestones
  - Tracks resource accumulation toward milestone goals
  - Displays progress in debug panel
  - Provides feedback on next milestones
  - Triggers rewards when milestones are completed

- [**Task and Activities System**](task-system/README.md) - System for task assignment and resource earning
  - Assign workers to various tasks
  - Earn resources by completing tasks
  - Unlock new tasks through progression
  - Complete repeatable tasks for ongoing resource generation

### Game Components

- [**Core Game Loop**](core-game-loop/README.md) - Main game loop and timing mechanics
- [**Debug Panel**](debug-panel/README.md) - Developer tools for debugging and testing
- [**Timer System**](timer/README.md) - Game timing and simulation speed control

## Implementing New Features

When adding a new feature, please follow these guidelines:

1. Create a folder in `/docs/features/[feature-name]/` using kebab-case
2. Include the following documentation:
   - **plan.md** - Initial design plan created before implementation
   - **[feature-name].md** - Main documentation explaining the feature
   - **summary.md** - Summary of implementation results
   - **todo.md** - List of ongoing and future work

3. Update this README.md to include your new feature

See [Documentation Standards](/docs/processes/documentation/standards.md) for more details.