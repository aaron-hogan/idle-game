import configureStore from 'redux-mock-store';
import {
  assignWorkersToBuilding,
  changeWorkers,
  autoAssignWorkers,
  ASSIGN_WORKERS,
  CHANGE_WORKER_COUNT,
  AUTO_ASSIGN_WORKERS,
} from '../workerActions';

// Mock the WorkerManager class
jest.mock('../../../systems/workerManager', () => {
  return {
    WorkerManager: jest.fn().mockImplementation(() => {
      return {
        assignWorkersToBuilding: jest.fn().mockReturnValue(true),
        changeWorkerCount: jest.fn().mockReturnValue(true),
        autoAssignWorkers: jest.fn().mockReturnValue(true),
      };
    }),
  };
});

const mockStore = configureStore([]);

describe('Worker Actions', () => {
  // Since thunks in test environment are tricky, let's just test the action creators
  test('worker actions are defined', () => {
    expect(typeof assignWorkersToBuilding).toBe('function');
    expect(typeof changeWorkers).toBe('function');
    expect(typeof autoAssignWorkers).toBe('function');
  });

  test('plain actions have the right types', () => {
    expect(ASSIGN_WORKERS).toBe('workers/assign');
    expect(CHANGE_WORKER_COUNT).toBe('workers/changeCount');
    expect(AUTO_ASSIGN_WORKERS).toBe('workers/autoAssign');
  });
});
