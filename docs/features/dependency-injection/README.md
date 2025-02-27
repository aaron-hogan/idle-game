# Dependency Injection

This directory contains documentation for the dependency injection pattern implementation in our codebase.

## Key Files

- [Dependency Injection](dependency-injection.md) - Comprehensive documentation on our dependency injection approach and implementation

## Overview

Dependency injection is a design pattern we're implementing to reduce tight coupling between game components. The goal is to improve testability, maintainability, and flexibility by explicitly providing dependencies rather than having components fetch their own dependencies.

## Implementation Status

We've successfully implemented dependency injection in the following components:

- TaskManager
- ProgressionManager

Upcoming implementations:
- ResourceManager
- BuildingManager
- EventManager
- Other singleton managers

For implementation details, see the [Dependency Injection](dependency-injection.md) document.
