import { EventEmitter } from 'events';
import { Task, TaskCategory, TaskStatus } from '../models/task';
import { resetSingleton } from '../utils/testUtils';

// Define types for our mock task manager
interface TaskStore {
  dispatch: (action: any) => void;
  getState: () => any;
  subscribe: (listener: () => void) => void;
}

interface ResourceData {
  id: string;
  name: string;
  amount: number;
  perSecond: number;
  unlocked: boolean;
}

interface TaskData {
  id: string;
  name: string;
  description: string;
  status: TaskStatus;
  progress: number;
  cost?: Record<string, number>;
  rewards?: Record<string, number>;
  requirements?: Array<{type: string, id: string, value: number}>;
  startTime?: number;
  endTime?: number;
  repeatable: boolean;
  completionCount: number;
}

// Create mock action creators
const taskActions = {
  initializeTasks: jest.fn().mockReturnValue({ type: 'tasks/initializeTasks' }),
  startTask: jest.fn().mockImplementation((payload: any) => ({ 
    type: 'tasks/startTask', 
    payload 
  })),
  completeTask: jest.fn().mockImplementation((payload: any) => ({ 
    type: 'tasks/completeTask', 
    payload 
  })),
  unlockTask: jest.fn().mockImplementation((payload: any) => ({ 
    type: 'tasks/unlockTask', 
    payload 
  })),
  cancelTask: jest.fn().mockImplementation((payload: any) => ({ 
    type: 'tasks/cancelTask', 
    payload 
  }))
};

// Mock the store
const mockDispatch = jest.fn();
const mockGetState = jest.fn();
const mockStore: TaskStore = {
  dispatch: mockDispatch,
  getState: mockGetState,
  subscribe: jest.fn()
};

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

// Create a simplified TaskManager for testing
class TaskManager extends EventEmitter {
  private static instance: TaskManager | null = null;
  private store: TaskStore | null = null;
  private actions: typeof taskActions = taskActions;
  
  public static getInstance(): TaskManager {
    if (!TaskManager.instance) {
      TaskManager.instance = new TaskManager();
    }
    return TaskManager.instance;
  }
  
  public initialize(store: TaskStore): void {
    this.store = store;
    if (this.store) {
      this.store.dispatch(this.actions.initializeTasks());
    }
  }
  
  public startTask(taskId: string): boolean {
    if (!this.store) return false;
    
    const state = this.store.getState();
    
    // If there's already an active task
    if (state.tasks.activeTaskId) {
      return false;
    }
    
    const task = state.tasks.tasks[taskId] as TaskData;
    if (!task || task.status !== TaskStatus.AVAILABLE) {
      return false;
    }
    
    // Check if player has enough resources
    if (task.cost) {
      for (const [resourceId, requiredAmount] of Object.entries(task.cost)) {
        const resource = state.resources.resources[resourceId] as ResourceData;
        if (!resource || resource.amount < requiredAmount) {
          return false;
        }
      }
    }
    
    this.store.dispatch(this.actions.startTask({ taskId, timestamp: Date.now() }));
    this.emit('taskStarted', taskId);
    return true;
  }
  
  public unlockTask(taskId: string): boolean {
    if (!this.store) return false;
    
    const state = this.store.getState();
    const task = state.tasks.tasks[taskId] as TaskData;
    
    if (!task || task.status !== TaskStatus.LOCKED) {
      return false;
    }
    
    // Check if all requirements are met
    const requirementsMet = this.checkTaskRequirements(task);
    if (!requirementsMet) {
      return false;
    }
    
    this.store.dispatch(this.actions.unlockTask(taskId));
    return true;
  }
  
  public completeTask(taskId: string): boolean {
    if (!this.store) return false;
    
    const state = this.store.getState();
    const task = state.tasks.tasks[taskId] as TaskData;
    
    if (!task || task.status !== TaskStatus.IN_PROGRESS) {
      return false;
    }
    
    this.store.dispatch(this.actions.completeTask(taskId));
    this.emit('taskCompleted', taskId);
    return true;
  }
  
  public cancelTask(taskId: string): boolean {
    if (!this.store) return false;
    
    const state = this.store.getState();
    const task = state.tasks.tasks[taskId] as TaskData;
    
    if (!task || task.status !== TaskStatus.IN_PROGRESS) {
      return false;
    }
    
    this.store.dispatch(this.actions.cancelTask(taskId));
    this.emit('taskCancelled', taskId);
    return true;
  }
  
  public checkTaskRequirements(task: TaskData): boolean {
    if (!this.store) return false;
    
    const state = this.store.getState();
    
    if (!task.requirements || task.requirements.length === 0) {
      return true;
    }
    
    for (const requirement of task.requirements) {
      if (requirement.type === 'resource') {
        const resource = state.resources.resources[requirement.id] as ResourceData;
        if (!resource || resource.amount < requirement.value) {
          return false;
        }
      }
    }
    
    return true;
  }
  
  public checkAllTaskRequirements(): number {
    if (!this.store) return 0;
    
    const state = this.store.getState();
    let unlockedCount = 0;
    
    Object.values(state.tasks.tasks).forEach((task: any) => {
      if (task.status === TaskStatus.LOCKED && this.checkTaskRequirements(task)) {
        if (this.store) {
          this.store.dispatch(this.actions.unlockTask(task.id));
          unlockedCount++;
        }
      }
    });
    
    return unlockedCount;
  }
  
  public getTaskProgress(taskId: string): any {
    if (!this.store) return null;
    
    const state = this.store.getState();
    const task = state.tasks.tasks[taskId] as TaskData;
    
    if (!task) {
      return null;
    }
    
    const now = Date.now();
    const timeRemaining = task.endTime ? Math.max(0, (task.endTime - now) / 1000) : 0;
    
    return {
      status: task.status,
      progress: task.progress || 0,
      timeRemaining,
      startTime: task.startTime,
      endTime: task.endTime
    };
  }
}

describe('Task System Integration', () => {
  let taskManager: TaskManager;
  let mockState: any;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    mockDispatch.mockClear();
    
    // Reset singleton
    // @ts-ignore - accessing private field for testing
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
    mockGetState.mockReturnValue(mockState);
    
    // Initialize with our mock store
    taskManager.initialize(mockStore);
  });
  
  test('should initialize tasks correctly', () => {
    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'tasks/initializeTasks'
    }));
  });
  
  test('should start a task when requirements are met', () => {
    // Make sure the task is available
    mockState.tasks.tasks['test-task'].status = TaskStatus.AVAILABLE;
    
    const result = taskManager.startTask('test-task');
    
    expect(result).toBe(true);
    expect(mockDispatch).toHaveBeenCalledWith(
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
    // The first call was for initialization in beforeEach
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });
  
  test('should not start a task when resources are insufficient', () => {
    // Make resources insufficient
    mockState.resources.resources.solidarity.amount = 5; // Less than cost
    
    const result = taskManager.startTask('test-task');
    
    expect(result).toBe(false);
    // The first call was for initialization in beforeEach
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });
  
  test('should check if task requirements are met', () => {
    // Set up state with requirements met
    mockState.resources.resources.solidarity.amount = 100; // More than required
    
    const result = taskManager.unlockTask('locked-task');
    
    expect(result).toBe(true);
    expect(mockDispatch).toHaveBeenCalledWith(
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
    // The first call was for initialization in beforeEach
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });
  
  test('should complete an in-progress task', () => {
    // Set up an in-progress task
    mockState.tasks.tasks['test-task'].status = TaskStatus.IN_PROGRESS;
    mockState.tasks.activeTaskId = 'test-task';
    
    const result = taskManager.completeTask('test-task');
    
    expect(result).toBe(true);
    expect(mockDispatch).toHaveBeenCalledWith(
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
    // The first call was for initialization in beforeEach
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });
  
  test('should cancel an in-progress task', () => {
    // Set up an in-progress task
    mockState.tasks.tasks['test-task'].status = TaskStatus.IN_PROGRESS;
    mockState.tasks.activeTaskId = 'test-task';
    
    const result = taskManager.cancelTask('test-task');
    
    expect(result).toBe(true);
    expect(mockDispatch).toHaveBeenCalledWith(
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
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'tasks/unlockTask',
        payload: 'locked-task'
      })
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'tasks/unlockTask',
        payload: 'locked-task-1'
      })
    );
    // We don't have a clean way to check this negation in Jest
    // But we know it shouldn't be called 4 times (init + 2 unlocks + this)
    expect(mockDispatch).toHaveBeenCalledTimes(3);
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