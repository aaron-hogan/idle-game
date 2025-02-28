import { configureStore } from '@reduxjs/toolkit';
import resourcesReducer, { addResource } from '../../redux/resourcesSlice';
import gameReducer, { endGame } from '../../state/gameSlice';
import { ResourceId, INITIAL_RESOURCES } from '../../constants/resources';
import { Resource, ResourceCategory } from '../../interfaces/Resource';
import { checkGameEndConditions } from '../gameEndConditions';

describe('Game End Conditions', () => {
  let store: any;

  // Sample resources for testing
  const powerResource: Resource = {
    id: ResourceId.COLLECTIVE_POWER,
    name: 'Collective Power',
    amount: 0,
    maxAmount: 1000,
    perSecond: 0.1,
    basePerSecond: 0.1,
    description: 'Test power resource',
    unlocked: true,
    category: ResourceCategory.PRIMARY,
    clickPower: 1,
  };

  const oppressionResource: Resource = {
    id: ResourceId.OPPRESSION,
    name: 'Corporate Oppression',
    amount: 0,
    maxAmount: 1000,
    perSecond: 0.05,
    basePerSecond: 0.05,
    description: 'Test oppression resource',
    unlocked: true,
    category: ResourceCategory.THREAT,
  };

  beforeEach(() => {
    // Mock endGame action
    jest.spyOn(require('../../state/gameSlice'), 'endGame');

    // Create a fresh store for each test
    store = configureStore({
      reducer: {
        resources: resourcesReducer,
        game: gameReducer,
      },
    });

    // Add test resources
    store.dispatch(addResource(powerResource));
    store.dispatch(addResource(oppressionResource));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should not end game when conditions are not met', () => {
    // Initial state with normal values
    const result = checkGameEndConditions(store);

    // Game should not have ended
    expect(result).toBe(false);
    expect(endGame).not.toHaveBeenCalled();
  });

  test('should win when collective power reaches maximum', () => {
    // Set power to max
    store.dispatch(
      addResource({
        ...powerResource,
        amount: powerResource.maxAmount,
      })
    );

    // Check end conditions
    const result = checkGameEndConditions(store);

    // Game should have ended with win condition
    expect(result).toBe(true);
    expect(endGame).toHaveBeenCalledWith({
      won: true,
      reason: expect.any(String),
    });
  });

  test('should lose when oppression exceeds power by 50%', () => {
    // Set power and oppression to create lose condition
    store.dispatch(
      addResource({
        ...powerResource,
        amount: 100,
      })
    );

    store.dispatch(
      addResource({
        ...oppressionResource,
        amount: 160, // More than 150% of power (100 * 1.5 = 150)
      })
    );

    // Check end conditions
    const result = checkGameEndConditions(store);

    // Game should have ended with lose condition
    expect(result).toBe(true);
    expect(endGame).toHaveBeenCalledWith({
      won: false,
      reason: expect.any(String),
    });
  });

  test('should not end game when oppression is high but not 50% higher than power', () => {
    // Set power and oppression to be close but not trigger
    store.dispatch(
      addResource({
        ...powerResource,
        amount: 100,
      })
    );

    store.dispatch(
      addResource({
        ...oppressionResource,
        amount: 149, // Just under the 150% threshold
      })
    );

    // Check end conditions
    const result = checkGameEndConditions(store);

    // Game should not have ended
    expect(result).toBe(false);
    expect(endGame).not.toHaveBeenCalled();
  });

  test('should respect existing game ended state', () => {
    // Manually set game as already ended
    store.dispatch(
      endGame({
        won: true,
        reason: 'Already ended game',
      })
    );

    // Reset the mock to check if it gets called again
    jest.clearAllMocks();

    // Check end conditions
    const result = checkGameEndConditions(store);

    // Should return true (game is ended) but not call endGame again
    expect(result).toBe(true);
    expect(endGame).not.toHaveBeenCalled();
  });

  test('should handle missing resources gracefully', () => {
    // Create a store without resources
    const emptyStore = configureStore({
      reducer: {
        resources: resourcesReducer,
        game: gameReducer,
      },
    });

    // Should not throw errors
    const result = checkGameEndConditions(emptyStore);

    // Game should not have ended
    expect(result).toBe(false);
    expect(endGame).not.toHaveBeenCalled();
  });
});
