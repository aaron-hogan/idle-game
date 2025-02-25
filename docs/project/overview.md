# Unnamed Idle Game - Project Overview

## Project Description

"Unnamed Idle Game" is a browser-based idle/incremental game that aims to provide an engaging gameplay experience with strategic depth. The game features resource management, progression systems, and community building mechanics through a clean, minimal interface.

## Core Philosophies

- **Engaging**: Creating entertaining mechanics that keep players interested
- **Strategic**: Offering meaningful choices and tradeoffs
- **Rewarding**: Providing satisfying progression and achievements
- **Accessible**: Designing for a wide audience with varying familiarity with idle games
- **Progressive**: Scaling complexity that introduces new mechanics gradually

## Technical Architecture

The game is built using:
- **Frontend**: React with TypeScript
- **State Management**: Redux with Redux Toolkit
- **Build System**: Webpack
- **Testing**: Jest with React Testing Library

The codebase follows a component-based architecture with:
- Singleton manager services for game systems
- React components for UI
- Redux for state management
- Strong typing throughout

## Project Organization

The project is organized into several key areas:

1. **Core Game Systems**
   - Resource management
   - Building and production
   - Worker assignment
   - Time and progression
   - Events and storytelling

2. **User Interface**
   - Main game layout
   - Resource displays
   - Building management
   - Event notifications
   - Settings and help

3. **Game Content**
   - Story events and educational content
   - Building types and progression
   - Resource chains and dependencies
   - Achievement tracking

4. **Documentation**
   - System documentation
   - Implementation plans
   - Code guidelines
   - Content design

## Development Approach

The project follows these development principles:

- **Incremental Development**: Each step builds on previous work
- **Test-Driven Development**: Tests are written before implementation
- **Component-Based Architecture**: Modular design for maintainability
- **Progressive Enhancement**: Start with core mechanics, then add complexity
- **Regular Integration**: Ensure components work together at each step
- **Defensive Programming**: Prevent issues through robust validation and error handling
- **Self-Healing Systems**: Design systems to recover from inconsistent states

## Current Status

See the following documentation for detailed status information:
- [Project Status](/docs/project/status.md): Current development progress
- [Project Todo](/docs/project/todo.md): Ongoing and upcoming tasks
- [Game Specifications](/docs/game-specs/final-game-specification.md): Detailed game design

## Documentation Standards

All project documentation follows a standardized format described in:
- [Documentation Template](/docs/project/documentation-template.md)
- The "Documentation Style" section in `CLAUDE.md`

## Getting Started

To start contributing to the project:
1. Review the documentation in `/docs/`
2. Set up the development environment with `npm install`
3. Run the development server with `npm start`
4. Run tests with `npm test`

## Visual Style

The game adopts a clean, minimal aesthetic with a light color scheme:

- **Color Palette**: Light backgrounds with blue accent colors
- **Typography**: 
  - Roboto (sans-serif font for all text elements)
- **UI Elements**: Simple card-based interface with clean headers
- **Accent Effects**: Subtle shadows and highlights for depth

This minimalist approach creates a modern, accessible interface while maintaining an engaging user experience.

Last Updated: February 25, 2025