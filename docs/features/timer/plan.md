# Anti-Capitalist Idle Game: Timer System Plan

## Overview
This document outlines the plan for implementing an improved timer system in our anti-capitalist idle game. The timer system is the foundation for all time-based game mechanics, ensuring consistent gameplay regardless of performance conditions or browser throttling.

## Goals
- Create a single, authoritative source of game time
- Ensure consistent timing across all game systems
- Handle browser throttling and performance issues gracefully
- Provide flexible time scaling for game speed control
- Support reliable time-based calculations for all game systems
- Enable accurate offline progress calculation

## Approach
We'll implement a new architecture with GameTimer as the single source of truth for time calculations. The GameLoop will drive animation frames and distribute time updates through the GameManager. All systems will receive standardized time deltas in seconds, with proper scaling applied consistently.

## Timeline
- Core Architecture and GameTimer: 1 day
- GameLoop and GameManager Updates: 1 day
- Redux Integration and System Updates: 1 day
- Testing, Debugging, and Documentation: 1 day

## Future Enhancements
- More sophisticated offline progress algorithm
- Time rewind capability for debugging
- Per-system time scaling
- Time-based event scheduling system
- Performance auto-scaling of time frequency
- Advanced timing metrics for performance optimization

## Implementation Prompt

```markdown
# Anti-Capitalist Idle Game: Timer System Improvements

Let's implement an improved timer system for our anti-capitalist idle game, following our defensive programming patterns and singleton architecture. Please create:

1. Define core timer interfaces and models:
   - TimeData interface with proper typing for timestamps and durations
   - GameLoopStats interface for performance metrics
   - TickHandler type for time update callbacks
   - TimeScale type with validation
   - TimerState interface for tracking timer status

2. Implement GameTimer singleton with:
   - Single authoritative source of truth for all time measurements
   - Precise time tracking using performance.now() with fallbacks
   - Robust time scale implementation with bounds validation
   - Pause/resume functionality with proper state management
   - Methods to access elapsed real time and game time
   - Self-healing for handling time anomalies
   - Error recovery for browser throttling
   - Exposed getInstance() static method with proper initialization checks

3. Refactor GameLoop to use the GameTimer:
   - Fixed timestep implementation with error handling
   - RequestAnimationFrame driver with defensive programming
   - Handler registration with proper memory management
   - Statistics tracking with validation
   - Performance optimization with proper frame limiting
   - Browser throttling detection and compensation
   - Error isolation to prevent timing failures from affecting the whole game

4. Update GameManager for time distribution:
   - Centralized time update distribution
   - Consistent time units (seconds) throughout the system
   - Offline progress calculation with validation
   - Error recovery for time jumps
   - Redux state updates with type safety
   - System synchronization with proper error handling

5. Implement Redux integration:
   - Update gameSlice with proper time tracking
   - Add actions for time updates with validation
   - Create time scale actions with bounds checking
   - Implement pause/resume functionality with state validation
   - Add selectors with memoization for optimal performance

6. Update system integration:
   - Modify ResourceManager to use standardized time deltas
   - Update BuildingManager for consistent time-based production
   - Adjust WorkerManager for time-based efficiency calculations
   - Ensure all calculations use seconds as standard units
   - Add validation for time inputs across all systems

7. Implement testing and debugging tools:
   - Time visualization with proper formatting
   - Performance metrics display with thresholds
   - Throttling simulation for testing
   - Time scale adjustment controls
   - Detailed time logging for debugging

8. Create documentation and examples:
   - Clear documentation of timer architecture
   - Usage guidelines for all systems
   - Best practices for time-based calculations
   - Example patterns for different types of time-based features
   - Migration guide for existing time-dependent systems
```