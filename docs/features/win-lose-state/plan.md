# Win/Lose State Implementation Plan

## Requirements

Create a complete gameplay loop with clear win and lose conditions:

1. **Win Condition**: Player reaches maximum Collective Power
2. **Lose Condition**: Oppression exceeds Collective Power by 50%
3. **Visual Feedback**: Progress indicators and end game screens
4. **Game Loop Integration**: Check conditions during normal gameplay
5. **Documentation**: Complete feature documentation

## Implementation Plan

### Phase 1: Core Mechanics
- [x] Add Oppression resource to constants
- [x] Create THREAT resource category
- [x] Add game end condition tracking to game state
- [x] Implement game end condition checker
- [x] Connect checker to game loop

### Phase 2: UI Components
- [x] Create Power vs. Oppression indicator
- [x] Build EndGameModal component for win/lose states
- [x] Add styling for new components
- [x] Integrate components into main App layout

### Phase 3: Resource Generation
- [x] Modify ResourceManager to ensure Oppression always generates
- [x] Set appropriate generation rate for game balance
- [x] Ensure proper handling with other game systems

### Phase 4: Testing & Documentation
- [x] Document implementation details
- [x] Create feature summary
- [x] Update CHANGELOG.md
- [x] Create todo list for future improvements
- [ ] Manual testing of win/lose conditions
- [ ] Create automated tests

## Architecture

### Data Flow
1. Game loop updates resources each tick
2. Oppression resource increases steadily
3. Every 10 ticks, end conditions are checked
4. When conditions are met, game state is updated
5. UI reacts to state changes, showing appropriate modal

### Component Hierarchy
```
App
├── PowerOppressionIndicator
│   ├── ProgressBar (Power)
│   └── ProgressBar (Oppression)
└── EndGameModal (conditional)
```

### State Changes
```
1. Game running normally
   ↓
2. Condition check passes
   ↓
3. endGame action dispatched
   ↓
4. game.gameEnded = true
   game.gameWon = true/false
   game.endReason = "..."
   ↓
5. EndGameModal appears
   ↓
6. User clicks restart
   ↓
7. resetGame action dispatched
```