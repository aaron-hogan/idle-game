# Win/Lose State Implementation

## Overview

This feature adds a clear win and lose condition to the game, making it a complete game experience with progression, challenge, and conclusion. It introduces:

1. A new "Oppression" resource that increases automatically over time
2. Visual indicator showing the balance between Power and Oppression
3. Win condition: Reaching maximum Collective Power
4. Lose condition: Oppression exceeding Collective Power by 50%
5. End game screen with appropriate feedback and restart option

## Implementation Details

### Core Components

1. **Oppression Resource**: 
   - Added to `/constants/resources.ts` with a constant passive generation rate
   - Special handling in the ResourceManager to ensure it's always generated
   - New THREAT category for resource categorization

2. **Game End Conditions**:
   - Added game end state tracking to the game slice
   - Created the `gameEndConditions.ts` system that checks win/lose conditions
   - Connected to the game loop to check conditions regularly

3. **UI Components**:
   - `PowerOppressionIndicator`: Visual comparison of the two competing resources
   - `EndGameModal`: Displays game outcome and allows restart

4. **GameLoop Integration**:
   - Extended with store reference to run end condition checks
   - Stops the game when a win/lose condition is met

### Technical Approach

The implementation follows a reactive pattern where:
1. Resources generate automatically via the game loop
2. Oppression increases at a constant rate (0.05 per second)
3. Players must increase their power generation to exceed oppression
4. The game checks win/lose conditions every 10 ticks
5. When conditions are met, the game dispatches an endGame action
6. The UI reactively shows the end game modal

## User Experience

- **Early Game**: Players focus on building basic power generation
- **Mid Game**: As oppression rises, players must strategize to keep pace
- **Late Game**: 
  - **Win Path**: Successfully outpace oppression and reach maximum power
  - **Lose Path**: Fall behind as oppression overwhelms the movement

## Future Improvements

1. **Dynamic Oppression Scaling**:
   - Increase oppression rate based on player progress
   - Add events that temporarily increase/decrease oppression

2. **Multiple Ending Types**:
   - Different victory types based on play style
   - Tiered endings based on how quickly the player wins

3. **Achievement Integration**:
   - Track wins and losses for achievements
   - Special achievements for close wins or recovering from near losses

## Testing Plan

1. **Basic Functionality**:
   - Verify oppression generates at the correct rate
   - Confirm win condition triggers when power reaches maximum
   - Confirm lose condition triggers when oppression exceeds power by 50%

2. **Edge Cases**:
   - Test behavior when resources are reset
   - Verify proper behavior during save/load cycles
   - Check end game modal appears correctly in all situations

3. **Performance**:
   - Measure impact of regular end condition checks
   - Verify no memory leaks when stopping game loop