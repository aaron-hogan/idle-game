# Win/Lose State - To-Do List

## High Priority
- [ ] Add automated tests for win/lose conditions
- [ ] Fix any edge cases with oppression generation during pause/resume
- [ ] Ensure proper cleanup when game is reset after win/loss

## Medium Priority
- [ ] Balance oppression growth rate for proper difficulty curve
- [ ] Add counter-measures that can temporarily reduce oppression
- [ ] Create special events that trigger near win/loss conditions
- [ ] Implement analytics to track win/loss rates

## Low Priority
- [ ] Add multiple ending variants based on how quickly the player wins
- [ ] Create special achievements for different win/loss scenarios
- [ ] Add visual effects for win/loss screens
- [ ] Implement a difficulty setting for oppression growth rate

## Completed
- [x] Create oppression resource with constant generation
- [x] Implement win condition (max collective power)
- [x] Implement lose condition (oppression exceeding power)
- [x] Add visual power vs. oppression indicator
- [x] Create end game modal for win/lose states
- [x] Connect game end check to the game loop
- [x] Document implementation details