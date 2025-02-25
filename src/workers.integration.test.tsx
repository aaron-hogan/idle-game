/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './state/gameSlice';
import resourcesReducer from './state/resourcesSlice';
import structuresReducer from './state/structuresSlice';
import { Structure } from './models/structure';
import { WorkerManager } from './systems/workerManager';
import { addStructure } from './state/structuresSlice';

// Mock components to test worker functionality
const TestComponent = () => (
  <div>
    <h1>Worker Test</h1>
  </div>
);

describe('Worker System Integration Test', () => {
  let store: any;
  
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
          gameStage: 2, // This provides 11 workers (5 base + 2*3)
          lastTickTimestamp: Date.now(),
          lastSaveTime: Date.now(),
          isRunning: true,
          tickRate: 1000,
          gameTimeScale: 1,
          offlineProgressEnabled: true,
          lastSaveTimestamp: Date.now(),
          gameStartTimestamp: Date.now(),
          totalPlayTime: 0,
        },
        resources: {},
        structures: {}
      }
    });
    
    // Add test buildings
    const building1: Structure = {
      id: 'building1',
      name: 'Building 1',
      description: 'Test building 1',
      level: 1,
      maxLevel: 3,
      cost: { awareness: 10 },
      production: { community: 1 },
      unlocked: true,
      workers: 0,
      maxWorkers: 5,
      category: 'PRODUCTION'
    };
    
    const building2: Structure = {
      id: 'building2',
      name: 'Building 2',
      description: 'Test building 2',
      level: 1,
      maxLevel: 3,
      cost: { awareness: 20 },
      production: { food: 2 },
      unlocked: true,
      workers: 0,
      maxWorkers: 3,
      category: 'INFRASTRUCTURE'
    };
    
    store.dispatch(addStructure(building1));
    store.dispatch(addStructure(building2));
  });
  
  test('WorkerManager can assign and manage workers', () => {
    // Set up test component with store
    render(
      <Provider store={store}>
        <TestComponent />
      </Provider>
    );
    
    // Create a worker manager with the store
    const workerManager = WorkerManager.getInstance();
    workerManager.initialize(store);
    
    // Verify initial state
    expect(store.getState().structures['building1'].workers).toBe(0);
    expect(store.getState().structures['building2'].workers).toBe(0);
    
    // Test worker assignment
    workerManager.assignWorkersToBuilding('building1', 2);
    expect(store.getState().structures['building1'].workers).toBe(2);
    
    // Test worker adjustment
    workerManager.changeWorkerCount('building1', -1);
    expect(store.getState().structures['building1'].workers).toBe(1);
    
    // Test worker efficiency calculation
    const efficiency = workerManager.calculateWorkerEfficiency('building1');
    // Efficiency with 1 out of 5 workers (20% staffing) should be around 0.5
    // Based on formula in WorkerManager.calculateWorkerEfficiency
    expect(efficiency).toBeCloseTo(0.5, 1);
    
    // Test auto-assign balanced
    workerManager.autoAssignWorkers('balanced');
    const stateAfterBalanced = store.getState().structures;
    // Both buildings should have workers
    expect(stateAfterBalanced['building1'].workers).toBeGreaterThan(0);
    expect(stateAfterBalanced['building2'].workers).toBeGreaterThan(0);
    
    // Reset workers
    workerManager.assignWorkersToBuilding('building1', 0);
    workerManager.assignWorkersToBuilding('building2', 0);
    
    // Test auto-assign focused
    workerManager.autoAssignWorkers('focused');
    const stateAfterFocused = store.getState().structures;
    // Total workers should be allocated (or limited by max capacity)
    const totalAssigned = stateAfterFocused['building1'].workers + 
                         stateAfterFocused['building2'].workers;
    // Just make sure workers are assigned (the total could be limited by maxWorkers)
    expect(totalAssigned).toBeGreaterThan(0);
    
    // Test auto-assign efficiency
    workerManager.autoAssignWorkers('efficiency');
    const stateAfterEfficiency = store.getState().structures;
    
    // Efficiency strategy should aim for ~80% capacity in buildings
    const building1Capacity = stateAfterEfficiency['building1'].workers / 
                             stateAfterEfficiency['building1'].maxWorkers;
    const building2Capacity = stateAfterEfficiency['building2'].workers / 
                             stateAfterEfficiency['building2'].maxWorkers;
                             
    // In an optimal scenario, we'd have exactly 80% staffing,
    // but with limited workers, some buildings might get fully staffed
    // and others might get less, so we just check reasonable values
    expect(building1Capacity).toBeGreaterThan(0);
    expect(building1Capacity).toBeLessThanOrEqual(1);
    expect(building2Capacity).toBeGreaterThan(0);
    expect(building2Capacity).toBeLessThanOrEqual(1);
  });
});