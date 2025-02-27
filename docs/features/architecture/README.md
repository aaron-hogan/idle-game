# Architecture Documentation

This directory contains documentation related to the codebase architecture, organization, and design patterns.

## Key Documents

- [Structure Reorganization Plan](structure-reorganization.md) - Comprehensive plan for reorganizing the project structure
- [Dependency Injection](../dependency-injection/dependency-injection.md) - Documentation on our dependency injection approach

## Architecture Overview

The Anti-Capitalist Idle Game follows a component-based architecture with several key layers:

1. **User Interface Layer** - React components that render the game
2. **State Management Layer** - Redux for central state management
3. **Game Systems Layer** - Core game mechanics and logic
4. **Data Layer** - Game data and configuration

## Current Architecture Patterns

- **Singleton Pattern** - Used for manager classes that need global access
- **Observer Pattern** - Events and reactions throughout the game systems
- **Redux Toolkit** - State management with slice pattern
- **Functional Components** - React components with hooks

## Planned Architecture Improvements

The codebase is currently undergoing architectural improvements to enhance maintainability, performance, and developer experience:

1. **Dependency Injection** - Reducing tight coupling between components
2. **Consistent State Access** - Standardizing how components access state
3. **Clear System Boundaries** - Better separation between game systems
4. **Type Consolidation** - More consistent type definitions and usage

Refer to the [Structure Reorganization Plan](structure-reorganization.md) for detailed information on planned improvements.