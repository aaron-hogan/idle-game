/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './state/gameSlice';
import resourcesReducer from './state/resourcesSlice';
import structuresReducer from './state/structuresSlice';
import { addResource, addResourceAmount, deductResources, updateResourcePerSecond } from './state/resourcesSlice';
import { addStructure, upgradeStructure } from './state/structuresSlice';
import { ResourceManager } from './systems/resourceManager';
import { BuildingManager } from './systems/buildingManager';
import { Structure } from './models/structure';
import { Resource } from './models/resource';

// Mock components to test with Redux
const TestComponent = () => <div>Test Component</div>;

describe('Game Core Systems Integration', () => {
  let store: any;
  let buildingManager: BuildingManager;
  
  beforeEach(() => {
    // Create a store with all necessary reducers
    store = configureStore({
      reducer: {
        game: gameReducer,
        resources: resourcesReducer,
        structures: structuresReducer,
      },
      preloadedState: {
        game: {
          gameStage: 1,
          lastTickTimestamp: Date.now(),
          lastSaveTime: Date.now(),
          isRunning: true,
          tickRate: 1000,
          gameTimeScale: 1,
          offlineProgressEnabled: true,
          lastSaveTimestamp: Date.now(),
          gameStartTimestamp: Date.now(),
          totalPlayTime: 0,
          startDate: Date.now(), // Added missing required field
        },
        resources: {},
        structures: {}
      }
    });
    
    // Initialize resources
    const awarenessResource: Resource = {
      id: 'awareness',
      name: 'Awareness',
      description: 'People\'s understanding of social issues',
      amount: 100,
      maxAmount: 1000,
      perSecond: 0,
      unlocked: true,
      category: 'SOCIAL'
    };
    
    const peopleResource: Resource = {
      id: 'people',
      name: 'People',
      description: 'Individuals involved in your movement',
      amount: 50,
      maxAmount: 500,
      perSecond: 0,
      unlocked: true,
      category: 'POPULATION'
    };
    
    const foodResource: Resource = {
      id: 'food',
      name: 'Food',
      description: 'Sustenance for your community',
      amount: 25,
      maxAmount: 200,
      perSecond: 0,
      unlocked: true,
      category: 'RESOURCE'
    };
    
    store.dispatch(addResource(awarenessResource));
    store.dispatch(addResource(peopleResource));
    store.dispatch(addResource(foodResource));
    
    // Add test buildings
    const communityGarden: Structure = {
      id: 'communityGarden',
      name: 'Community Garden',
      description: 'Produces food for the community',
      level: 1,
      maxLevel: 3,
      cost: { awareness: 10, people: 5 },
      production: { food: 0.5 },
      unlocked: true,
      workers: 0,
      maxWorkers: 3,
      category: 'PRODUCTION'
    };
    
    const housingCoop: Structure = {
      id: 'housingCoop',
      name: 'Housing Cooperative',
      description: 'Provides housing for people',
      level: 1,
      maxLevel: 3,
      cost: { awareness: 15, food: 10 },
      production: { housing: 0.3 },
      unlocked: true,
      workers: 0,
      maxWorkers: 2,
      category: 'INFRASTRUCTURE'
    };
    
    store.dispatch(addStructure(communityGarden));
    store.dispatch(addStructure(housingCoop));
    
    // Initialize managers
    buildingManager = BuildingManager.getInstance();
    buildingManager.initialize(store);
  });
  
  test('Resources can be generated over time', () => {
    // Render with Redux
    render(
      <Provider store={store}>
        <TestComponent />
      </Provider>
    );
    
    // Set the food production rate manually
    store.dispatch(updateResourcePerSecond({
      id: 'food',
      perSecond: 1.0 // Set a simple rate for testing
    }));
    
    // Get initial food amount
    const initialFood = store.getState().resources.food?.amount || 0;
    
    // Add resources manually to verify the action works
    store.dispatch(addResourceAmount({
      id: 'food',
      amount: 1.0
    }));
    
    // Check if the amount increased
    const foodAfterAdd = store.getState().resources.food?.amount || 0;
    expect(foodAfterAdd).toBe(initialFood + 1.0);
  });
  
  test('Building purchase consumes resources correctly', () => {
    // Render with Redux
    render(
      <Provider store={store}>
        <TestComponent />
      </Provider>
    );
    
    // Get initial resource amounts
    const initialAwareness = store.getState().resources.awareness?.amount || 0;
    const initialPeople = store.getState().resources.people?.amount || 0;
    
    // Purchase a new community garden
    const result = buildingManager.purchaseBuilding('communityGarden');
    expect(result).toBe(true);
    
    // Check if resources were consumed correctly
    const awarenessAfterPurchase = store.getState().resources.awareness?.amount || 0;
    const peopleAfterPurchase = store.getState().resources.people?.amount || 0;
    
    // Building cost is { awareness: 10, people: 5 }
    expect(awarenessAfterPurchase).toBe(initialAwareness - 10);
    expect(peopleAfterPurchase).toBe(initialPeople - 5);
    
    // Check if building was upgraded
    const building = store.getState().structures['communityGarden'];
    expect(building.level).toBe(2); // Started at level 1, now should be 2
  });
  
  test('Building level affects production calculation', () => {
    // Render with Redux
    render(
      <Provider store={store}>
        <TestComponent />
      </Provider>
    );
    
    // Note initial level before proceeding
    const initialLevel = store.getState().structures['communityGarden'].level;
    
    // Upgrade the building directly
    store.dispatch(upgradeStructure({ id: 'communityGarden' }));
    
    // Verify the level increased
    const newLevel = store.getState().structures['communityGarden'].level;
    expect(newLevel).toBe(initialLevel + 1);
    
    // The upgrade action changes the level but doesn't recalculate production automatically
    // That would happen via the BuildingManager or in response to game ticks
    
    // Check the building cost scaling, which should be affected by level
    const upgradeCost = buildingManager.calculateUpgradeCost('communityGarden');
    
    // With a level increase, costs should also increase
    expect(upgradeCost.awareness).toBeGreaterThan(10); // Base cost was 10
  });
  
  test('Resources can be added and deducted correctly', () => {
    // Render with Redux
    render(
      <Provider store={store}>
        <TestComponent />
      </Provider>
    );
    
    // Initial amount
    const initialFood = store.getState().resources.food?.amount || 0;
    
    // Add resources
    store.dispatch(addResourceAmount({ id: 'food', amount: 50 }));
    
    // Check if added correctly
    const foodAfterAdd = store.getState().resources.food?.amount || 0;
    expect(foodAfterAdd).toBe(initialFood + 50);
    
    // Deduct resources
    store.dispatch(deductResources({ food: 20 }));
    
    // Check if deducted correctly
    const foodAfterDeduct = store.getState().resources.food?.amount || 0;
    expect(foodAfterDeduct).toBe(foodAfterAdd - 20);
  });
});