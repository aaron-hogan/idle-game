import { TaskManager } from '../managers/TaskManager';
import { GameLoopManager } from '../managers/GameLoopManager';
import { store } from '../state/store';
import { initializeTasks, selectActiveTask, selectTaskById } from '../state/tasksSlice';
import { Task, TaskCategory, TaskStatus } from '../models/task';

// Mock the store
jest.mock('../state/store', () => ({
  store: {
    dispatch: jest.fn(),
    getState: jest.fn().mockReturnValue({
      tasks: {
        tasks: {},
        activeTaskId: null
      },
      resources: {
        resources: {
          'solidarity': {
            id: 'solidarity',
            name: 'Solidarity',
            amount: 100,
            perSecond: 1,
            unlocked: true
          },
          'collective_bargaining_power': {
            id: 'collective_bargaining_power',
            name: 'Collective Bargaining Power',
            amount: 100,
            perSecond: 1,
            unlocked: true
          },
          'community_trust': {
            id: 'community_trust',
            name: 'Community Trust',
            amount: 100,
            perSecond: 1,
            unlocked: true
          }
        }
      }
    }),
    subscribe: jest.fn()
  }
}));

// Mock the GameLoopManager
jest.mock('../managers/GameLoopManager', () => ({
  GameLoopManager: {
    getInstance: jest.fn().mockReturnValue({
      registerTickHandler: jest.fn(),
      startGameLoop: jest.fn(),
      getCurrentTime: jest.fn().mockReturnValue(Date.now())
    })
  }
}));

describe('Task System Integration', () => {
  let taskManager: TaskManager;
  let mockState: any;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Set up a fresh TaskManager instance
    // @ts-ignore - we're testing the singleton
    TaskManager.instance = null;
    taskManager = TaskManager.getInstance();
    
    // Define a test task that will be returned by the mock store
    const testTasks = {
      'test-task': {
        id: 'test-task',
        name: 'Test Task',
        description: 'Task for testing',
        category: TaskCategory.ORGANIZING,
        duration: 60,
        cost: { 'solidarity': 10 },
        rewards: { 'community_trust': 20 },
        status: TaskStatus.AVAILABLE,
        progress: 0,
        requirements: [],
        repeatable: true,
        completionCount: 0
      },
      'locked-task': {
        id: 'locked-task',
        name: 'Locked Task',
        description: 'A locked task',
        category: TaskCategory.EDUCATION,
        duration: 90,
        cost: { 'collective_bargaining_power': 15 },
        rewards: { 'solidarity': 25 },
        status: TaskStatus.LOCKED,
        progress: 0,
        requirements: [
          { type: 'resource', id: 'solidarity', value: 50 }
        ],
        repeatable: false,
        completionCount: 0
      }
    };
    
    // Setup the mock state that will be returned by getState
    mockState = {
      tasks: {
        tasks: testTasks,
        activeTaskId: null
      },
      resources: {
        resources: {
          'solidarity': {
            id: 'solidarity',
            name: 'Solidarity',
            amount: 100,
            perSecond: 1,
            unlocked: true
          },
          'collective_bargaining_power': {
            id: 'collective_bargaining_power',
            name: 'Collective Bargaining Power',
            amount: 100,
            perSecond: 1,
            unlocked: true
          },
          'community_trust': {
            id: 'community_trust',
            name: 'Community Trust',
            amount: 100,
            perSecond: 1,
            unlocked: true
          }
        }
      }
    };
    
    // Set up the mock store to return our test state
    (store.getState as jest.Mock).mockReturnValue(mockState);
  });
  
  test('should initialize tasks correctly', () => {
    taskManager.initialize();
    
    expect(store.dispatch).toHaveBeenCalledWith(initializeTasks());
  });
  
  test('should start a task when requirements are met', () => {
    // Make sure the task is available
    mockState.tasks.tasks['test-task'].status = TaskStatus.AVAILABLE;
    
    const result = taskManager.startTask('test-task');
    
    expect(result).toBe(true);
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'tasks/startTask',
        payload: expect.objectContaining({
          taskId: 'test-task'
        })
      })
    );
  });
  
  test('should not start a task when another task is already active', () => {
    // Set an active task
    mockState.tasks.activeTaskId = 'active-task';
    
    const result = taskManager.startTask('test-task');
    
    expect(result).toBe(false);
    expect(store.dispatch).not.toHaveBeenCalled();
  });
  
  test('should not start a task when resources are insufficient', () => {
    // Make resources insufficient
    mockState.resources.resources.solidarity.amount = 5; // Less than cost
    
    const result = taskManager.startTask('test-task');
    
    expect(result).toBe(false);
    expect(store.dispatch).not.toHaveBeenCalled();
  });
  
  test('should check if task requirements are met', () => {
    // Set up state with requirements met
    mockState.resources.resources.solidarity.amount = 100; // More than required
    
    const result = taskManager.unlockTask('locked-task');
    
    expect(result).toBe(true);
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'tasks/unlockTask',
        payload: 'locked-task'
      })
    );
  });
  
  test('should not unlock a task when requirements are not met', () => {
    // Make requirements not met
    mockState.resources.resources.solidarity.amount = 30; // Less than required
    
    const result = taskManager.unlockTask('locked-task');
    
    expect(result).toBe(false);
    expect(store.dispatch).not.toHaveBeenCalled();
  });
  
  test('should complete an in-progress task', () => {
    // Set up an in-progress task
    mockState.tasks.tasks['test-task'].status = TaskStatus.IN_PROGRESS;
    mockState.tasks.activeTaskId = 'test-task';
    
    const result = taskManager.completeTask('test-task');
    
    expect(result).toBe(true);
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'tasks/completeTask',
        payload: 'test-task'
      })
    );
  });
  
  test('should not complete a task that is not in progress', () => {
    // Make sure task is not in progress
    mockState.tasks.tasks['test-task'].status = TaskStatus.AVAILABLE;
    
    const result = taskManager.completeTask('test-task');
    
    expect(result).toBe(false);
    expect(store.dispatch).not.toHaveBeenCalled();
  });
  
  test('should cancel an in-progress task', () => {
    // Set up an in-progress task
    mockState.tasks.tasks['test-task'].status = TaskStatus.IN_PROGRESS;
    mockState.tasks.activeTaskId = 'test-task';
    
    const result = taskManager.cancelTask('test-task');
    
    expect(result).toBe(true);
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'tasks/cancelTask',
        payload: 'test-task'
      })
    );
  });
  
  test('should check all task requirements and unlock eligible tasks', () => {
    // Set up a state with multiple locked tasks where some requirements are met
    mockState.tasks.tasks['locked-task-1'] = {
      id: 'locked-task-1',
      status: TaskStatus.LOCKED,
      requirements: [
        { type: 'resource', id: 'solidarity', value: 50 }
      ]
    };
    
    mockState.tasks.tasks['locked-task-2'] = {
      id: 'locked-task-2',
      status: TaskStatus.LOCKED,
      requirements: [
        { type: 'resource', id: 'solidarity', value: 200 }
      ]
    };
    
    mockState.resources.resources.solidarity.amount = 100;
    
    const unlocked = taskManager.checkAllTaskRequirements();
    
    expect(unlocked).toBe(2); // Two tasks should be unlocked
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'tasks/unlockTask',
        payload: 'locked-task'
      })
    );
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'tasks/unlockTask',
        payload: 'locked-task-1'
      })
    );
    expect(store.dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'tasks/unlockTask',
        payload: 'locked-task-2'
      })
    );
  });
  
  test('should emit events when task status changes', () => {
    // Set up event listeners
    const startedListener = jest.fn();
    const completedListener = jest.fn();
    
    taskManager.on('taskStarted', startedListener);
    taskManager.on('taskCompleted', completedListener);
    
    // Set up task in available state
    mockState.tasks.tasks['test-task'].status = TaskStatus.AVAILABLE;
    
    // Start the task
    taskManager.startTask('test-task');
    
    // Task is now in progress
    mockState.tasks.tasks['test-task'].status = TaskStatus.IN_PROGRESS;
    mockState.tasks.activeTaskId = 'test-task';
    
    // Complete the task
    taskManager.completeTask('test-task');
    
    // Verify events were emitted
    expect(startedListener).toHaveBeenCalledWith('test-task');
    expect(completedListener).toHaveBeenCalledWith('test-task');
  });
  
  test('should provide progress information for a task', () => {
    // Set up an in-progress task
    const now = Date.now();
    const startTime = now - 30000; // 30 seconds ago
    const endTime = now + 30000; // 30 seconds from now
    
    mockState.tasks.tasks['test-task'] = {
      ...mockState.tasks.tasks['test-task'],
      status: TaskStatus.IN_PROGRESS,
      progress: 50,
      startTime,
      endTime
    };
    
    const progress = taskManager.getTaskProgress('test-task');
    
    expect(progress).not.toBeNull();
    expect(progress?.status).toBe(TaskStatus.IN_PROGRESS);
    expect(progress?.progress).toBe(50);
    expect(progress?.timeRemaining).toBeGreaterThan(0);
    expect(progress?.timeRemaining).toBeLessThanOrEqual(30);
  });
});