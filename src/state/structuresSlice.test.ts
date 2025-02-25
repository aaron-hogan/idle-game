import structuresReducer, {
  addStructure,
  upgradeStructure,
  assignWorkers,
  changeWorkerCount,
  toggleStructureUnlocked,
  updateProduction,
  resetStructures,
} from './structuresSlice';
import { Structure } from '../models/structure';

describe('structures reducer', () => {
  const initialState = {};
  
  const mockStructure: Structure = {
    id: 'union-office',
    name: 'Union Office',
    description: 'A space for workers to organize and coordinate',
    level: 1,
    maxLevel: 5,
    cost: { 'collective-power': 50 },
    production: { 'collective-power': 2, 'solidarity': 1 },
    unlocked: true,
    workers: 0,
    maxWorkers: 5,
    category: 'ORGANIZING',
  };

  test('should handle initial state', () => {
    expect(structuresReducer(undefined, { type: 'unknown' })).toEqual({});
  });

  test('should handle addStructure', () => {
    const actual = structuresReducer(initialState, addStructure(mockStructure));
    expect(actual[mockStructure.id]).toEqual(mockStructure);
  });

  test('should handle upgradeStructure', () => {
    const startState = { [mockStructure.id]: { ...mockStructure } };
    const startLevel = mockStructure.level;
    const actual = structuresReducer(
      startState, 
      upgradeStructure({ id: mockStructure.id })
    );
    expect(actual[mockStructure.id].level).toEqual(startLevel + 1);
  });

  test('should not upgrade beyond maxLevel', () => {
    const startState = { 
      [mockStructure.id]: { 
        ...mockStructure, 
        level: mockStructure.maxLevel 
      } 
    };
    const actual = structuresReducer(
      startState, 
      upgradeStructure({ id: mockStructure.id })
    );
    expect(actual[mockStructure.id].level).toEqual(mockStructure.maxLevel);
  });

  test('should handle assignWorkers', () => {
    const startState = { [mockStructure.id]: { ...mockStructure } };
    const newWorkers = 3;
    const actual = structuresReducer(
      startState,
      assignWorkers({ id: mockStructure.id, workers: newWorkers })
    );
    expect(actual[mockStructure.id].workers).toEqual(newWorkers);
  });

  test('should handle changeWorkerCount', () => {
    const startWorkers = 2;
    const startState = { 
      [mockStructure.id]: { ...mockStructure, workers: startWorkers } 
    };
    const delta = 1;
    const actual = structuresReducer(
      startState,
      changeWorkerCount({ id: mockStructure.id, delta })
    );
    expect(actual[mockStructure.id].workers).toEqual(startWorkers + delta);
  });

  test('should respect worker limits when changing', () => {
    const startState = { 
      [mockStructure.id]: { ...mockStructure, workers: 0 } 
    };
    // Try to go below 0
    const negative = structuresReducer(
      startState,
      changeWorkerCount({ id: mockStructure.id, delta: -1 })
    );
    expect(negative[mockStructure.id].workers).toEqual(0);
    
    // Try to exceed max
    const tooHigh = structuresReducer(
      startState,
      changeWorkerCount({ 
        id: mockStructure.id, 
        delta: mockStructure.maxWorkers + 5 
      })
    );
    expect(tooHigh[mockStructure.id].workers).toEqual(mockStructure.maxWorkers);
  });

  test('should handle toggleStructureUnlocked', () => {
    const startState = { 
      [mockStructure.id]: { ...mockStructure, unlocked: false } 
    };
    const actual = structuresReducer(
      startState,
      toggleStructureUnlocked({ id: mockStructure.id, unlocked: true })
    );
    expect(actual[mockStructure.id].unlocked).toBe(true);
  });

  test('should handle updateProduction', () => {
    const startState = { [mockStructure.id]: { ...mockStructure } };
    const newProduction = { 'collective-power': 5, 'solidarity': 3 };
    const actual = structuresReducer(
      startState,
      updateProduction({ 
        id: mockStructure.id, 
        production: newProduction 
      })
    );
    expect(actual[mockStructure.id].production).toEqual(newProduction);
  });

  test('should handle resetStructures', () => {
    const startState = { [mockStructure.id]: mockStructure };
    const actual = structuresReducer(startState, resetStructures());
    expect(actual).toEqual({});
  });
});