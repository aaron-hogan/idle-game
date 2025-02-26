import { ResourceManager } from '../resourceManager';
import { configureStore } from '@reduxjs/toolkit';
import resourcesReducer, { addResource } from '../../redux/resourcesSlice';
import gameReducer from '../../state/gameSlice';
import { ResourceId } from '../../constants/resources';
import { Resource } from '../../interfaces/Resource';
import { ResourceCategory } from '../../interfaces/Resource';

describe('Oppression System', () => {
  let store: any;
  let resourceManager: ResourceManager;
  
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
    clickPower: 1
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
    category: ResourceCategory.THREAT
  };
  
  beforeEach(() => {
    // Create a fresh store for each test
    store = configureStore({
      reducer: {
        resources: resourcesReducer,
        game: gameReducer
      }
    });
    
    // Reset the ResourceManager singleton
    // @ts-ignore - Accessing private property for testing
    ResourceManager.instance = null;
    
    // Get a fresh instance
    resourceManager = ResourceManager.getInstance();
    resourceManager.initialize(store);
    
    // Add test resources
    store.dispatch(addResource(powerResource));
    store.dispatch(addResource(oppressionResource));
  });
  
  test('oppression resource should generate at the specified rate', () => {
    // Add console log to debug
    console.log('Resources before:', JSON.stringify(store.getState().resources.byId, null, 2));
    
    // Simulate a game tick with 10 seconds elapsed
    const elapsedTime = 10;
    resourceManager.updateResources(elapsedTime);
    
    // Add console log to debug
    console.log('Resources after:', JSON.stringify(store.getState().resources.byId, null, 2));
    
    // Get the current state
    const state = store.getState();
    
    // Check that oppression increased by the correct amount (0.05 * 10 = 0.5)
    expect(state.resources.byId[ResourceId.OPPRESSION].amount).toBeCloseTo(0.5, 6);
    
    // For comparison, check that power also increased correctly (0.1 * 10 = 1.0)
    expect(state.resources.byId[ResourceId.COLLECTIVE_POWER].amount).toBeCloseTo(1.0, 6);
  });
  
  test('oppression should continue to generate in multiple ticks', () => {
    // Simulate 5 game ticks of 2 seconds each
    for (let i = 0; i < 5; i++) {
      resourceManager.updateResources(2);
    }
    
    // Get the current state
    const state = store.getState();
    
    // Check that oppression increased by the correct total amount (0.05 * 10 = 0.5)
    expect(state.resources.byId[ResourceId.OPPRESSION].amount).toBeCloseTo(0.5, 6);
    
    // Power should have increased by (0.1 * 10 = 1.0)
    expect(state.resources.byId[ResourceId.COLLECTIVE_POWER].amount).toBeCloseTo(1.0, 6);
  });
  
  test('oppression should generate even if its perSecond property is modified', () => {
    // Change the oppression generation rate in the store
    const modifiedOppressionResource = {
      ...oppressionResource,
      perSecond: 0 // Set to zero to test special handling
    };
    store.dispatch(addResource(modifiedOppressionResource));
    
    // Simulate a game tick
    resourceManager.updateResources(10);
    
    // Get the current state
    const state = store.getState();
    
    // Even though perSecond is 0, our special handling should still generate at basePerSecond
    // This tests that our special case in resourceManager.updateResources works
    expect(state.resources.byId[ResourceId.OPPRESSION].amount).toBeGreaterThan(0);
  });
  
  test('oppression generation should scale with time delta correctly', () => {
    // Test with different time intervals
    const testIntervals = [1, 5, 10, 60];
    
    for (const interval of testIntervals) {
      // Reset resources for each interval test
      store.dispatch(addResource({...oppressionResource, amount: 0}));
      store.dispatch(addResource({...powerResource, amount: 0}));
      
      // Process the tick
      resourceManager.updateResources(interval);
      
      // Get updated state
      const state = store.getState();
      
      // Check that oppression matches expected amount
      const expectedOppression = 0.05 * interval;
      expect(state.resources.byId[ResourceId.OPPRESSION].amount).toBeCloseTo(expectedOppression, 6);
    }
  });
});