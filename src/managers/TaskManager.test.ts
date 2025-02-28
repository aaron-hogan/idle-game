import { TaskManager } from './TaskManager';
import { store } from '../state/store';
import {
  initializeTasks,
  startTask,
  completeTask,
  resetTask,
  unlockTask,
} from '../state/tasksSlice';
import { Task, TaskCategory, TaskStatus } from '../models/task';

// Mock the dependencies
jest.mock('../state/store', () => {
  // Create a mock function we can manipulate for different test cases
  const mockGetState = jest.fn().mockReturnValue({
    tasks: {
      tasks: {
        'test-task': {
          id: 'test-task',
          name: 'Test Task',
          description: 'A test task',
          category: 'organizing',
          duration: 60,
          cost: { collective_bargaining_power: 10 },
          rewards: { solidarity: 20 },
          status: 'available',
          progress: 0,
          requirements: [],
          repeatable: true,
          completionCount: 0,
        },
        'in-progress-task': {
          id: 'in-progress-task',
          name: 'In Progress Task',
          description: 'A task in progress',
          category: 'organizing',
          duration: 60,
          cost: { collective_bargaining_power: 10 },
          rewards: { solidarity: 20 },
          status: 'in_progress',
          progress: 50,
          requirements: [],
          repeatable: true,
          completionCount: 0,
          startTime: Date.now() - 30000, // Started 30 seconds ago
          endTime: Date.now() + 30000, // Ends in 30 seconds
        },
        'locked-task': {
          id: 'locked-task',
          name: 'Locked Task',
          description: 'A locked task',
          category: 'education',
          duration: 60,
          cost: { collective_bargaining_power: 10 },
          rewards: { community_trust: 20 },
          status: 'locked',
          progress: 0,
          requirements: [{ type: 'resource', id: 'solidarity', value: 50 }],
          repeatable: false,
          completionCount: 0,
        },
      },
      activeTaskId: null, // Important: setting to null initially for the test to pass
    },
    resources: {
      resources: {
        collective_bargaining_power: {
          id: 'collective_bargaining_power',
          name: 'Collective Bargaining Power',
          amount: 100,
          maxAmount: 1000,
          perSecond: 1,
          unlocked: true,
          description: "Represents your power to negotiate",
        },
        solidarity: {
          id: 'solidarity',
          name: 'Solidarity',
          amount: 30,
          maxAmount: 500,
          perSecond: 0.5,
          unlocked: true,
          description: "Represents unity among workers",
        },
      },
    },
  });

  return {
    store: {
      dispatch: jest.fn(),
      getState: mockGetState,
    },
  };
});

jest.mock('./GameLoopManager', () => ({
  GameLoopManager: {
    getInstance: jest.fn().mockReturnValue({
      registerTickHandler: jest.fn(),
    }),
  },
}));

jest.mock('../core/GameLoop', () => ({
  GameLoop: {
    getInstance: jest.fn().mockReturnValue({
      registerHandler: jest.fn().mockReturnValue(() => {}),
      setDebugMode: jest.fn(),
    }),
  },
}));

describe('TaskManager', () => {
  let taskManager: TaskManager;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Get a fresh instance for each test
    // @ts-ignore - we're testing the singleton
    TaskManager.instance = null;
    taskManager = TaskManager.getInstance();

    // Initialize with the mock store
    taskManager.initialize(store as any);
  });

  test('getInstance returns the same instance', () => {
    const instance1 = TaskManager.getInstance();
    const instance2 = TaskManager.getInstance();

    expect(instance1).toBe(instance2);
  });

  test('initialize dispatches the initializeTasks action', () => {
    // We already called initialize in beforeEach
    expect(store.dispatch).toHaveBeenCalledWith(initializeTasks());
  });

  test('startTask checks if task exists and is available', () => {
    // Should succeed for available task
    const result = taskManager.startTask('test-task');
    expect(result).toBe(true);
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: startTask.type,
        payload: expect.objectContaining({
          taskId: 'test-task',
        }),
      })
    );

    // Should fail for non-existent task
    const nonExistentResult = taskManager.startTask('non-existent-task');
    expect(nonExistentResult).toBe(false);

    // Should fail for task in progress
    const inProgressResult = taskManager.startTask('in-progress-task');
    expect(inProgressResult).toBe(false);

    // Should fail for locked task
    const lockedResult = taskManager.startTask('locked-task');
    expect(lockedResult).toBe(false);
  });

  test('canAffordTask checks if player has enough resources', () => {
    // Can afford this task
    const canAfford = taskManager.canAffordTask('test-task');
    expect(canAfford).toBe(true);

    // Mock resources to be insufficient
    (store.getState as jest.Mock).mockReturnValueOnce({
      tasks: {
        tasks: {
          'test-task': {
            id: 'test-task',
            cost: { collective_bargaining_power: 200 },
          },
        },
      },
      resources: {
        resources: {
          collective_bargaining_power: {
            id: 'collective_bargaining_power',
            amount: 100,
          },
        },
      },
    });

    // Cannot afford this task now
    const cannotAfford = taskManager.canAffordTask('test-task');
    expect(cannotAfford).toBe(false);
  });

  test('completeTask finishes a task and dispatches action', () => {
    const result = taskManager.completeTask('in-progress-task');

    expect(result).toBe(true);
    expect(store.dispatch).toHaveBeenCalledWith(completeTask('in-progress-task'));
  });

  test('unlockTask unlocks a task if requirements are met', () => {
    // Mock state with requirements met
    (store.getState as jest.Mock).mockReturnValueOnce({
      tasks: {
        tasks: {
          'locked-task': {
            id: 'locked-task',
            status: 'locked',
            requirements: [{ type: 'resource', id: 'solidarity', value: 20 }],
          },
        },
      },
      resources: {
        resources: {
          solidarity: { id: 'solidarity', amount: 50 },
        },
      },
    });

    const result = taskManager.unlockTask('locked-task');

    expect(result).toBe(true);
    expect(store.dispatch).toHaveBeenCalledWith(unlockTask('locked-task'));
  });

  test('createTask factory method validates and creates tasks', () => {
    const taskData = {
      id: 'new-task',
      name: 'New Task',
      category: TaskCategory.COMMUNITY,
    };

    const task = TaskManager.createTask(taskData);

    expect(task.id).toBe('new-task');
    expect(task.name).toBe('New Task');
    expect(task.category).toBe(TaskCategory.COMMUNITY);
    expect(task.status).toBe(TaskStatus.LOCKED);
    expect(task.repeatable).toBe(false);
    expect(task.progress).toBe(0);
    expect(task.completionCount).toBe(0);
  });

  test('createTask throws error for invalid task data', () => {
    expect(() => TaskManager.createTask({} as any)).toThrow('Task must have an ID');
    expect(() => TaskManager.createTask({ id: 'test' } as any)).toThrow('Task must have a name');
    expect(() => TaskManager.createTask({ id: 'test', name: 'Test' } as any)).toThrow(
      'Task must have a category'
    );
  });

  test('getTaskProgress returns progress info', () => {
    // First, make sure we mock getState to include an in-progress task for this specific test
    (store.getState as jest.Mock).mockReturnValueOnce({
      tasks: {
        tasks: {
          'in-progress-task': {
            id: 'in-progress-task',
            status: 'in_progress',
            progress: 50,
            endTime: Date.now() + 30000, // Ends in 30 seconds
          },
        },
      },
    });

    const progress = taskManager.getTaskProgress('in-progress-task');

    expect(progress).not.toBeNull();
    expect(progress?.status).toBe('in_progress');
    expect(progress?.progress).toBe(50);
    expect(typeof progress?.timeRemaining).toBe('number');
  });

  test('checkAllTaskRequirements unlocks all eligible tasks', () => {
    // Mock state with multiple locked tasks
    (store.getState as jest.Mock).mockReturnValueOnce({
      tasks: {
        tasks: {
          'locked-task-1': {
            id: 'locked-task-1',
            status: 'locked',
            requirements: [{ type: 'resource', id: 'solidarity', value: 20 }],
          },
          'locked-task-2': {
            id: 'locked-task-2',
            status: 'locked',
            requirements: [{ type: 'resource', id: 'solidarity', value: 100 }],
          },
        },
      },
      resources: {
        resources: {
          solidarity: { id: 'solidarity', amount: 50 },
        },
      },
    });

    const unlocked = taskManager.checkAllTaskRequirements();

    expect(unlocked).toBe(1); // Only one task should be unlocked
    expect(store.dispatch).toHaveBeenCalledWith(unlockTask('locked-task-1'));
    expect(store.dispatch).not.toHaveBeenCalledWith(unlockTask('locked-task-2'));
  });
});
