# Win/Lose State - Feature Summary

## Purpose
Add a clear win and lose condition to the game to create a complete gameplay loop and increase player engagement.

## Core Functionality
- **Win Condition**: Player reaches maximum Collective Power (1000)
- **Lose Condition**: Oppression exceeds Collective Power by 50%
- **Constant Challenge**: Oppression increases automatically at a steady rate
- **Visual Indicator**: Power vs. Oppression balance display
- **End Game Modal**: Displays outcome and allows restarting

## Technical Implementation
The feature uses:
- Redux state management for tracking game end conditions
- GameLoop integration for regular win/lose condition checks
- React components for visual representation
- Special resource handling for the Oppression resource

## User Experience Impact
- Adds meaningful strategic challenge to resource management
- Creates tension between building power and racing against oppression
- Provides closure to the gameplay experience
- Encourages replaying to improve strategy

## Known Limitations
- Oppression growth rate is currently static, not dynamic
- Only one victory and one defeat condition
- No persistent achievement tracking between game sessions

## Next Steps
- Add dynamic oppression scaling based on player progress
- Create multiple victory types and endings
- Integrate with achievement system