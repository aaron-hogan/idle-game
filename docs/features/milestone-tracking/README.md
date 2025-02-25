# Milestone Tracking System

## Overview

The milestone tracking system monitors player progress through the game by tracking resource accumulation and other achievements. This system connects resources like "collective-power" to game progression milestones.

## Documentation

- [**Milestone Tracking**](milestone-tracking.md) - Main documentation of the system
  - Core components explanation
  - Integration with resource system
  - Debug panel display details
  - Implementation specifics

- [**Implementation Plan**](plan.md) - Initial approach for milestone tracking
  - Objectives and requirements
  - Implementation approach
  - Testing strategy

- [**Implementation Summary**](summary.md) - Results of the implementation
  - Changes made to track collective-power
  - Debug panel improvements
  - Testing results

- [**Todo List**](todo.md) - Future improvements
  - Pending enhancements
  - Bug fixes needed
  - Future feature ideas

## Key Components

- **ProgressionManager** - Core system that checks milestone requirements
- **ResourceDebugTab** - Displays resource progress toward milestones
- **ProgressionDebugTab** - Shows all milestones and their completion status
- **Milestone Definitions** - Configuration of resource thresholds and rewards

## Recent Changes

- Updated milestone definitions to track "collective-power" resource
- Created "First Collective Power" milestone requiring 10 collective power
- Added "Growing Power" milestone requiring 50 collective power
- Updated achievements to properly match milestone design