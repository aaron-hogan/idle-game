import resourcesReducer, {
  addResource,
  updateResourceAmount,
  addResourceAmount,
  updateResourcePerSecond,
  toggleResourceUnlocked,
  resetResources,
} from './resourcesSlice';
import { Resource } from '../models/resource';

describe('resources reducer', () => {
  const initialState = {};

  const mockResource: Resource = {
    id: 'collective-power',
    name: 'Collective Bargaining Power',
    amount: 0,
    maxAmount: 100,
    perSecond: 1,
    description: "The primary resource representing the movement's strength",
    unlocked: true,
    category: 'POWER',
  };

  test('should handle initial state', () => {
    expect(resourcesReducer(undefined, { type: 'unknown' })).toEqual({});
  });

  test('should handle addResource', () => {
    const actual = resourcesReducer(initialState, addResource(mockResource));
    expect(actual[mockResource.id]).toEqual(mockResource);
  });

  test('should handle updateResourceAmount', () => {
    const startState = { [mockResource.id]: { ...mockResource } };
    const newAmount = 50;
    const actual = resourcesReducer(
      startState,
      updateResourceAmount({ id: mockResource.id, amount: newAmount })
    );
    expect(actual[mockResource.id].amount).toEqual(newAmount);
  });

  test('should handle updateResourceAmount with capping', () => {
    const startState = { [mockResource.id]: { ...mockResource } };
    const tooLarge = mockResource.maxAmount + 50;
    const actual = resourcesReducer(
      startState,
      updateResourceAmount({ id: mockResource.id, amount: tooLarge })
    );
    expect(actual[mockResource.id].amount).toEqual(mockResource.maxAmount);
  });

  test('should handle addResourceAmount', () => {
    const startAmount = 25;
    const startState = {
      [mockResource.id]: { ...mockResource, amount: startAmount },
    };
    const addAmount = 10;
    const actual = resourcesReducer(
      startState,
      addResourceAmount({ id: mockResource.id, amount: addAmount })
    );
    expect(actual[mockResource.id].amount).toEqual(startAmount + addAmount);
  });

  test('should handle updateResourcePerSecond', () => {
    const startState = { [mockResource.id]: { ...mockResource } };
    const newPerSecond = 5;
    const actual = resourcesReducer(
      startState,
      updateResourcePerSecond({ id: mockResource.id, perSecond: newPerSecond })
    );
    expect(actual[mockResource.id].perSecond).toEqual(newPerSecond);
  });

  test('should handle toggleResourceUnlocked', () => {
    const startState = {
      [mockResource.id]: { ...mockResource, unlocked: false },
    };
    const actual = resourcesReducer(
      startState,
      toggleResourceUnlocked({ id: mockResource.id, unlocked: true })
    );
    expect(actual[mockResource.id].unlocked).toBe(true);
  });

  test('should handle resetResources', () => {
    const startState = { [mockResource.id]: mockResource };
    const actual = resourcesReducer(startState, resetResources());
    expect(actual).toEqual({});
  });
});
