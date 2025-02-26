import { configureStore } from '@reduxjs/toolkit';
import { ResourceManager } from '../resourceManager';
import resourcesReducer from '../../state/resourcesSlice';
import gameReducer from '../../state/gameSlice';
import structuresReducer from '../../state/structuresSlice';
import { Resource } from '../../models/resource';

describe('ResourceManager - Click Generation', () => {
  // Setup store with resource slice
  const setupTestStore = () => {
    return configureStore({
      reducer: {
        resources: resourcesReducer,
        game: gameReducer,
        structures: structuresReducer,
      },
    });
  };

  // Setup ResourceManager with the test store
  const setupResourceManager = (store: any) => {
    const resourceManager = ResourceManager.getInstance();
    resourceManager.initialize(store);
    return resourceManager;
  };

  // Test function to create a test resource
  const createTestResource = (
    id: string,
    name: string,
    amount: number,
    clickPower: number
  ): Resource => {
    return {
      id,
      name,
      amount,
      maxAmount: 1000,
      perSecond: 0,
      clickPower,
      category: 'test',
      description: 'test resource',
      unlocked: true,
      icon: '📊',
    };
  };

  // Test basic click generation
  it('should add resources when clicked', () => {
    // Setup
    const store = setupTestStore();
    const resourceManager = setupResourceManager(store);

    // Add a test resource with clickPower > 0
    const testResource = createTestResource('test-resource', 'Test Resource', 100, 5); // 5 per click
    store.dispatch({
      type: 'resources/addResource',
      payload: testResource,
    });

    // Initial state check
    let state = store.getState();
    expect(state.resources['test-resource'].amount).toBe(100);

    // Simulate a click
    const amountAdded = resourceManager.handleResourceClick('test-resource');

    // Check if resource amount increased by clickPower value
    state = store.getState();
    expect(state.resources['test-resource'].amount).toBe(105); // 100 + 5
    expect(amountAdded).toBe(5); // handleResourceClick should return the amount added
  });

  // Test clicking on locked resources
  it('should not add resources when clicking locked resources', () => {
    // Setup
    const store = setupTestStore();
    const resourceManager = setupResourceManager(store);

    // Add a locked resource
    const lockedResource = {
      ...createTestResource('locked-resource', 'Locked Resource', 100, 5),
      unlocked: false,
    };
    store.dispatch({
      type: 'resources/addResource',
      payload: lockedResource,
    });

    // Try to click on the locked resource
    const amountAdded = resourceManager.handleResourceClick('locked-resource');

    // Check if resource amount remains unchanged
    const state = store.getState();
    expect(state.resources['locked-resource'].amount).toBe(100); // Should not change
    expect(amountAdded).toBe(0); // Should return 0 for locked resources
  });

  // Test clicking on nonexistent resources
  it('should handle clicks on nonexistent resources gracefully', () => {
    // Setup
    const store = setupTestStore();
    const resourceManager = setupResourceManager(store);

    // Try to click on a resource that doesn't exist
    const amountAdded = resourceManager.handleResourceClick('nonexistent-resource');

    // Should return 0 and not throw an error
    expect(amountAdded).toBe(0);
  });

  // Test default clickPower value
  it('should use default clickPower if not specified', () => {
    // Setup
    const store = setupTestStore();
    const resourceManager = setupResourceManager(store);

    // Add a resource without explicit clickPower
    const resourceWithoutClickPower = {
      ...createTestResource('default-click', 'Default Click', 100, 0),
      clickPower: undefined // Remove clickPower
    };
    store.dispatch({
      type: 'resources/addResource',
      payload: resourceWithoutClickPower,
    });

    // Simulate a click
    const amountAdded = resourceManager.handleResourceClick('default-click');

    // Check if resource amount increased by default clickPower (1)
    const state = store.getState();
    expect(state.resources['default-click'].amount).toBe(101); // 100 + 1
    expect(amountAdded).toBe(1); // Default value should be 1
  });
});