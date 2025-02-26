import { configureStore } from '@reduxjs/toolkit';
import { ResourceManager } from '../resourceManager';
import resourcesReducer from '../../state/resourcesSlice';
import gameReducer from '../../state/gameSlice';
import structuresReducer from '../../state/structuresSlice';
import { Resource } from '../../models/resource';

// Create a test configuration for the ResourceManager
describe('ResourceManager - Passive Income', () => {
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
    perSecond: number
  ): Resource => {
    return {
      id,
      name,
      amount,
      maxAmount: 1000,
      perSecond,
      clickPower: 0,
      category: 'test',
      description: 'test resource',
      unlocked: true,
      icon: '📊',
    };
  };

  // Test basic resource update
  it('should update resources based on perSecond rate', () => {
    // Setup
    const store = setupTestStore();
    const resourceManager = setupResourceManager(store);

    // Add a test resource with perSecond > 0
    const testResource = createTestResource('test-resource', 'Test Resource', 100, 10); // 10 per second
    store.dispatch({
      type: 'resources/addResource',
      payload: testResource,
    });

    // Initial state check
    let state = store.getState();
    expect(state.resources['test-resource'].amount).toBe(100);

    // Update resources with 1 second elapsed time
    resourceManager.updateResources(1);

    // Check if resource amount increased by perSecond value
    state = store.getState();
    expect(state.resources['test-resource'].amount).toBe(110); // 100 + 10

    // Update again for 0.5 seconds
    resourceManager.updateResources(0.5);

    // Check if resource amount increased by half of perSecond value
    state = store.getState();
    expect(state.resources['test-resource'].amount).toBe(115); // 110 + (10 * 0.5)
  });

  // Test multiple resources update
  it('should update multiple resources correctly', () => {
    // Setup
    const store = setupTestStore();
    const resourceManager = setupResourceManager(store);

    // Add multiple test resources
    const testResource1 = createTestResource('resource-1', 'Resource 1', 50, 5); // 5 per second
    const testResource2 = createTestResource('resource-2', 'Resource 2', 100, 10); // 10 per second
    const testResource3 = createTestResource('resource-3', 'Resource 3', 200, 0); // 0 per second (should not change)

    store.dispatch({ type: 'resources/addResource', payload: testResource1 });
    store.dispatch({ type: 'resources/addResource', payload: testResource2 });
    store.dispatch({ type: 'resources/addResource', payload: testResource3 });

    // Initial state check
    let state = store.getState();
    expect(state.resources['resource-1'].amount).toBe(50);
    expect(state.resources['resource-2'].amount).toBe(100);
    expect(state.resources['resource-3'].amount).toBe(200);

    // Update resources with 2 seconds elapsed time
    resourceManager.updateResources(2);

    // Check if resource amounts increased correctly
    state = store.getState();
    expect(state.resources['resource-1'].amount).toBe(60); // 50 + (5 * 2)
    expect(state.resources['resource-2'].amount).toBe(120); // 100 + (10 * 2)
    expect(state.resources['resource-3'].amount).toBe(200); // Unchanged since perSecond is 0
  });

  // Test resource update with negative time (should not update)
  it('should not update resources with negative time', () => {
    // Setup
    const store = setupTestStore();
    const resourceManager = setupResourceManager(store);

    // Add a test resource
    const testResource = createTestResource('test-resource', 'Test Resource', 100, 10);
    store.dispatch({ type: 'resources/addResource', payload: testResource });

    // Initial state check
    let state = store.getState();
    expect(state.resources['test-resource'].amount).toBe(100);

    // Try to update with negative time
    resourceManager.updateResources(-1);

    // Check if resource amount remains unchanged
    state = store.getState();
    expect(state.resources['test-resource'].amount).toBe(100); // Should not change
  });

  // Test unlocked state checking
  it('should only update unlocked resources', () => {
    // Setup
    const store = setupTestStore();
    const resourceManager = setupResourceManager(store);

    // Add a locked and unlocked resource
    const unlockedResource = createTestResource('unlocked', 'Unlocked', 50, 5);
    const lockedResource = {
      ...createTestResource('locked', 'Locked', 50, 5),
      unlocked: false,
    };

    store.dispatch({ type: 'resources/addResource', payload: unlockedResource });
    store.dispatch({ type: 'resources/addResource', payload: lockedResource });

    // Update resources
    resourceManager.updateResources(1);

    // Check if only unlocked resource was updated
    const state = store.getState();
    expect(state.resources['unlocked'].amount).toBe(55); // 50 + 5
    expect(state.resources['locked'].amount).toBe(50); // Unchanged
  });

  // Test very small time updates
  it('should handle very small time updates correctly', () => {
    // Setup
    const store = setupTestStore();
    const resourceManager = setupResourceManager(store);

    // Add a test resource with high perSecond value
    const testResource = createTestResource('test-resource', 'Test Resource', 100, 100); // 100 per second
    store.dispatch({ type: 'resources/addResource', payload: testResource });

    // Update with a very small time value (0.01 seconds = 10ms)
    resourceManager.updateResources(0.01);

    // Check if resource amount increased correctly
    const state = store.getState();
    expect(state.resources['test-resource'].amount).toBe(101); // 100 + (100 * 0.01)
  });
});