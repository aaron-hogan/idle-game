import {
  selectAllResources,
  selectResourceById,
  selectUnlockedResources,
  selectTotalResourceGeneration,
  selectAllStructures,
  selectStructureById,
  selectUnlockedStructures,
  selectTotalWorkers,
  selectGameStage,
  selectLastSaveTime,
  selectTotalPlayTime,
} from './selectors';
import { RootState } from './store';
import { Resource } from '../models/resource';
import { Structure } from '../models/structure';

describe('Redux selectors', () => {
  const resource1: Resource = {
    id: 'collective-power',
    name: 'Collective Bargaining Power',
    amount: 50,
    maxAmount: 100,
    perSecond: 2,
    description: 'Primary resource',
    unlocked: true,
    category: 'POWER',
  };
  
  const resource2: Resource = {
    id: 'solidarity',
    name: 'Solidarity',
    amount: 30,
    maxAmount: 100,
    perSecond: 1,
    description: 'Secondary resource',
    unlocked: true,
    category: 'SOCIAL',
  };
  
  const resource3: Resource = {
    id: 'community-trust',
    name: 'Community Trust',
    amount: 10,
    maxAmount: 100,
    perSecond: 0.5,
    description: 'Secondary resource',
    unlocked: false,  // This one is locked
    category: 'SOCIAL',
  };
  
  const structure1: Structure = {
    id: 'union-office',
    name: 'Union Office',
    description: 'Generates collective power',
    level: 1,
    maxLevel: 5,
    cost: { 'collective-power': 50 },
    production: { 'collective-power': 2 },
    unlocked: true,
    workers: 2,
    maxWorkers: 5,
    category: 'ORGANIZING',
  };
  
  const structure2: Structure = {
    id: 'community-center',
    name: 'Community Center',
    description: 'Generates solidarity',
    level: 1,
    maxLevel: 3,
    cost: { 'collective-power': 30, 'solidarity': 10 },
    production: { 'solidarity': 1 },
    unlocked: true,
    workers: 1,
    maxWorkers: 3,
    category: 'COMMUNITY',
  };
  
  const structure3: Structure = {
    id: 'alternative-media',
    name: 'Alternative Media Outlet',
    description: 'Counters corporate propaganda',
    level: 1,
    maxLevel: 3,
    cost: { 'collective-power': 60, 'solidarity': 20 },
    production: { 'community-trust': 1 },
    unlocked: false,  // This one is locked
    workers: 0,
    maxWorkers: 3,
    category: 'MEDIA',
  };
  
  const mockState: RootState = {
    resources: {
      'collective-power': resource1,
      'solidarity': resource2,
      'community-trust': resource3,
    },
    structures: {
      'union-office': structure1,
      'community-center': structure2,
      'alternative-media': structure3,
    },
    game: {
      gameStage: 1,
      lastSaveTime: 1644700000000,
      totalPlayTime: 3600,
      isRunning: true,
      tickRate: 1000,
      gameTimeScale: 1
    },
  } as RootState;

  // Resource selectors
  test('selectAllResources returns all resources', () => {
    const result = selectAllResources(mockState);
    expect(result).toEqual(mockState.resources);
  });
  
  test('selectResourceById returns a specific resource', () => {
    const result = selectResourceById('solidarity')(mockState);
    expect(result).toEqual(resource2);
  });
  
  test('selectUnlockedResources returns only unlocked resources', () => {
    const result = selectUnlockedResources(mockState);
    expect(result).toHaveLength(2);
    expect(result).toContainEqual(resource1);
    expect(result).toContainEqual(resource2);
    expect(result).not.toContainEqual(resource3);
  });
  
  test('selectTotalResourceGeneration returns sum of all generation rates', () => {
    const result = selectTotalResourceGeneration(mockState);
    // 2 + 1 + 0.5 = 3.5
    expect(result).toEqual(3.5);
  });
  
  // Structure selectors
  test('selectAllStructures returns all structures', () => {
    const result = selectAllStructures(mockState);
    expect(result).toEqual(mockState.structures);
  });
  
  test('selectStructureById returns a specific structure', () => {
    const result = selectStructureById('union-office')(mockState);
    expect(result).toEqual(structure1);
  });
  
  test('selectUnlockedStructures returns only unlocked structures', () => {
    const result = selectUnlockedStructures(mockState);
    expect(result).toHaveLength(2);
    expect(result).toContainEqual(structure1);
    expect(result).toContainEqual(structure2);
    expect(result).not.toContainEqual(structure3);
  });
  
  test('selectTotalWorkers returns sum of all assigned workers', () => {
    const result = selectTotalWorkers(mockState);
    // 2 + 1 + 0 = 3
    expect(result).toEqual(3);
  });
  
  // Game selectors
  test('selectGameStage returns current game stage', () => {
    const result = selectGameStage(mockState);
    expect(result).toEqual(1);
  });
  
  test('selectLastSaveTime returns last save timestamp', () => {
    const result = selectLastSaveTime(mockState);
    expect(result).toEqual(1644700000000);
  });
  
  test('selectTotalPlayTime returns total play time', () => {
    const result = selectTotalPlayTime(mockState);
    expect(result).toEqual(3600);
  });
});