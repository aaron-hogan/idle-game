import tasksReducer, {
  initializeTasks,
  unlockTask,
  startTask,
  updateTaskProgress,
  completeTask,
  cancelTask,
  resetTask,
  selectAllTasks,
  selectTaskById,
  selectTasksByCategory,
  selectAvailableTasks,
  selectActiveTask,
  selectCompletedTasks
} from './tasksSlice';
import { TaskCategory, TaskStatus } from '../models/task';

describe('tasksSlice', () => {
  // Initial empty state for testing
  const initialState = {
    tasks: {},
    activeTaskId: null
  };

  test('should handle initial state', () => {
    expect(tasksReducer(undefined, { type: 'unknown' })).toEqual({
      tasks: {},
      activeTaskId: null
    });
  });

  test('should handle initializeTasks', () => {
    const action = initializeTasks();
    const state = tasksReducer(initialState, action);
    
    // Check that the state contains task objects
    expect(Object.keys(state.tasks).length).toBeGreaterThan(0);
    
    // Check that all tasks are initialized with correct default values
    Object.values(state.tasks).forEach(task => {
      expect(task.status).toBe(TaskStatus.LOCKED);
      expect(task.progress).toBe(0);
      expect(task.completionCount).toBe(0);
    });
  });

  test('should handle unlockTask', () => {
    // First initialize tasks
    let state = tasksReducer(initialState, initializeTasks());
    
    // Get the first task ID
    const taskId = Object.keys(state.tasks)[0];
    
    // Unlock the task
    state = tasksReducer(state, unlockTask(taskId));
    
    // Check that the task is now available
    expect(state.tasks[taskId].status).toBe(TaskStatus.AVAILABLE);
  });

  test('should handle startTask', () => {
    // Setup: initialize and unlock a task
    let state = tasksReducer(initialState, initializeTasks());
    const taskId = Object.keys(state.tasks)[0];
    state = tasksReducer(state, unlockTask(taskId));
    
    // Start the task
    const startTime = Date.now();
    const endTime = startTime + 60000; // 1 minute later
    
    state = tasksReducer(state, startTask({
      taskId,
      startTime,
      endTime
    }));
    
    // Check that the task is now in progress
    expect(state.tasks[taskId].status).toBe(TaskStatus.IN_PROGRESS);
    expect(state.tasks[taskId].progress).toBe(0);
    expect(state.tasks[taskId].startTime).toBe(startTime);
    expect(state.tasks[taskId].endTime).toBe(endTime);
    expect(state.activeTaskId).toBe(taskId);
  });

  test('should handle updateTaskProgress', () => {
    // Setup: initialize, unlock, and start a task
    let state = tasksReducer(initialState, initializeTasks());
    const taskId = Object.keys(state.tasks)[0];
    state = tasksReducer(state, unlockTask(taskId));
    state = tasksReducer(state, startTask({
      taskId,
      startTime: Date.now(),
      endTime: Date.now() + 60000
    }));
    
    // Update progress
    state = tasksReducer(state, updateTaskProgress({
      taskId,
      progress: 50
    }));
    
    // Check that progress is updated
    expect(state.tasks[taskId].progress).toBe(50);
  });

  test('should handle completeTask for non-repeatable task', () => {
    // Setup: initialize, unlock, and start a task
    let state = tasksReducer(initialState, initializeTasks());
    
    // Find a non-repeatable task
    const nonRepeatableTaskId = Object.keys(state.tasks).find(
      id => !state.tasks[id].repeatable
    ) || Object.keys(state.tasks)[0];

    // Create new task state with non-repeatable property
    const updatedTasks = {
      ...state.tasks,
      [nonRepeatableTaskId]: {
        ...state.tasks[nonRepeatableTaskId],
        repeatable: false // Set repeatable to false without modifying original
      }
    };
    
    // Create updated state without directly modifying the readonly property
    state = {
      ...state,
      tasks: updatedTasks
    };
    
    state = tasksReducer(state, unlockTask(nonRepeatableTaskId));
    state = tasksReducer(state, startTask({
      taskId: nonRepeatableTaskId,
      startTime: Date.now(),
      endTime: Date.now() + 60000
    }));
    
    // Complete the task
    state = tasksReducer(state, completeTask(nonRepeatableTaskId));
    
    // Check that task is completed and active task is cleared
    expect(state.tasks[nonRepeatableTaskId].status).toBe(TaskStatus.COMPLETED);
    expect(state.tasks[nonRepeatableTaskId].progress).toBe(100);
    expect(state.tasks[nonRepeatableTaskId].completionCount).toBe(1);
    expect(state.activeTaskId).toBeNull();
  });

  test('should handle completeTask for repeatable task', () => {
    // Setup: initialize, unlock, and start a task
    let state = tasksReducer(initialState, initializeTasks());
    
    // Find a repeatable task
    const repeatableTaskId = Object.keys(state.tasks).find(
      id => state.tasks[id].repeatable
    ) || Object.keys(state.tasks)[0];
    
    // Create new task state with repeatable property
    const updatedTasks = {
      ...state.tasks,
      [repeatableTaskId]: {
        ...state.tasks[repeatableTaskId],
        repeatable: true // Set repeatable to true without modifying original
      }
    };
    
    // Create updated state without directly modifying the readonly property
    state = {
      ...state,
      tasks: updatedTasks
    };
    
    state = tasksReducer(state, unlockTask(repeatableTaskId));
    state = tasksReducer(state, startTask({
      taskId: repeatableTaskId,
      startTime: Date.now(),
      endTime: Date.now() + 60000
    }));
    
    // Complete the task
    state = tasksReducer(state, completeTask(repeatableTaskId));
    
    // Check that task is available again and active task is cleared
    expect(state.tasks[repeatableTaskId].status).toBe(TaskStatus.AVAILABLE);
    expect(state.tasks[repeatableTaskId].progress).toBe(100);
    expect(state.tasks[repeatableTaskId].completionCount).toBe(1);
    expect(state.activeTaskId).toBeNull();
  });

  test('should handle cancelTask', () => {
    // Setup: initialize, unlock, and start a task
    let state = tasksReducer(initialState, initializeTasks());
    const taskId = Object.keys(state.tasks)[0];
    state = tasksReducer(state, unlockTask(taskId));
    state = tasksReducer(state, startTask({
      taskId,
      startTime: Date.now(),
      endTime: Date.now() + 60000
    }));
    
    // Cancel the task
    state = tasksReducer(state, cancelTask(taskId));
    
    // Check that task is available again and active task is cleared
    expect(state.tasks[taskId].status).toBe(TaskStatus.AVAILABLE);
    expect(state.tasks[taskId].progress).toBe(0);
    expect(state.tasks[taskId].startTime).toBeUndefined();
    expect(state.tasks[taskId].endTime).toBeUndefined();
    expect(state.activeTaskId).toBeNull();
  });

  test('should handle resetTask', () => {
    // Setup: initialize, unlock, start, and complete a task
    let state = tasksReducer(initialState, initializeTasks());
    const taskId = Object.keys(state.tasks)[0];
    
    // Create new task state with repeatable property
    const updatedTasks = {
      ...state.tasks,
      [taskId]: {
        ...state.tasks[taskId],
        repeatable: true // Set repeatable to true without modifying original
      }
    };
    
    // Create updated state without directly modifying the readonly property
    state = {
      ...state,
      tasks: updatedTasks
    };
    
    state = tasksReducer(state, unlockTask(taskId));
    state = tasksReducer(state, startTask({
      taskId,
      startTime: Date.now(),
      endTime: Date.now() + 60000
    }));
    state = tasksReducer(state, completeTask(taskId));
    
    // Reset the task
    state = tasksReducer(state, resetTask(taskId));
    
    // Check that task is available and progress is reset
    expect(state.tasks[taskId].status).toBe(TaskStatus.AVAILABLE);
    expect(state.tasks[taskId].progress).toBe(0);
    expect(state.tasks[taskId].startTime).toBeUndefined();
    expect(state.tasks[taskId].endTime).toBeUndefined();
  });

  describe('selectors', () => {
    // Create a mock root state for testing selectors
    const mockState = {
      tasks: {
        tasks: {
          'task1': {
            id: 'task1',
            name: 'Task 1',
            category: TaskCategory.ORGANIZING,
            status: TaskStatus.AVAILABLE,
            progress: 0,
            completionCount: 0,
            repeatable: true
          },
          'task2': {
            id: 'task2',
            name: 'Task 2',
            category: TaskCategory.EDUCATION,
            status: TaskStatus.LOCKED,
            progress: 0,
            completionCount: 0,
            repeatable: false
          },
          'task3': {
            id: 'task3',
            name: 'Task 3',
            category: TaskCategory.ORGANIZING,
            status: TaskStatus.IN_PROGRESS,
            progress: 50,
            completionCount: 0,
            repeatable: true
          },
          'task4': {
            id: 'task4',
            name: 'Task 4',
            category: TaskCategory.COMMUNITY,
            status: TaskStatus.COMPLETED,
            progress: 100,
            completionCount: 1,
            repeatable: false
          },
          'task5': {
            id: 'task5',
            name: 'Task 5',
            category: TaskCategory.COMMUNITY,
            status: TaskStatus.AVAILABLE,
            progress: 0,
            completionCount: 2,
            repeatable: true
          }
        },
        activeTaskId: 'task3'
      }
    } as any; // Type cast to avoid full type definition

    test('selectAllTasks should return all tasks', () => {
      const tasks = selectAllTasks(mockState);
      expect(tasks).toBe(mockState.tasks.tasks);
    });

    test('selectTaskById should return specific task', () => {
      const task = selectTaskById(mockState, 'task1');
      expect(task).toBe(mockState.tasks.tasks.task1);
    });

    test('selectTasksByCategory should filter tasks by category', () => {
      const organizingTasks = selectTasksByCategory(mockState, TaskCategory.ORGANIZING);
      expect(organizingTasks).toEqual([
        mockState.tasks.tasks.task1,
        mockState.tasks.tasks.task3
      ]);
    });

    test('selectAvailableTasks should return only available tasks', () => {
      const availableTasks = selectAvailableTasks(mockState);
      expect(availableTasks).toEqual([
        mockState.tasks.tasks.task1,
        mockState.tasks.tasks.task5
      ]);
    });

    test('selectActiveTask should return the active task', () => {
      const activeTask = selectActiveTask(mockState);
      expect(activeTask).toBe(mockState.tasks.tasks.task3);
    });

    test('selectCompletedTasks should return completed or repeatable tasks with completions', () => {
      const completedTasks = selectCompletedTasks(mockState);
      expect(completedTasks).toEqual([
        mockState.tasks.tasks.task4,
        mockState.tasks.tasks.task5
      ]);
    });
  });
});