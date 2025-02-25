import { taskMiddleware } from './taskMiddleware';
import { startTask, completeTask } from '../tasksSlice';
import { addResourceAmount, deductResources } from '../resourcesSlice';
import { TaskCategory, TaskStatus } from '../../models/task';

describe('taskMiddleware', () => {
  // Mock store, next and action
  let mockStore: any;
  let nextMock: jest.Mock;
  let mockAction: any;
  
  beforeEach(() => {
    // Setup basic mocks
    mockStore = {
      getState: jest.fn(),
      dispatch: jest.fn()
    };
    
    nextMock = jest.fn();
  });
  
  test('should apply resource costs when starting a task', () => {
    // Setup mock state with a task that has costs
    mockStore.getState.mockReturnValue({
      tasks: {
        tasks: {
          'test-task': {
            id: 'test-task',
            name: 'Test Task',
            cost: {
              'solidarity': 10,
              'collective_bargaining_power': 20
            }
          }
        }
      }
    });
    
    // Create a startTask action
    mockAction = startTask({
      taskId: 'test-task',
      startTime: Date.now(),
      endTime: Date.now() + 60000
    });
    
    // Execute the middleware
    taskMiddleware(mockStore)(nextMock)(mockAction);
    
    // Verify costs were subtracted
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      deductResources({
        'solidarity': 10,
        'collective_bargaining_power': 20
      })
    );
    
    // Verify next was called with the original action
    expect(nextMock).toHaveBeenCalledWith(mockAction);
  });
  
  test('should not apply costs if task not found', () => {
    // Setup mock state without the requested task
    mockStore.getState.mockReturnValue({
      tasks: {
        tasks: {}
      }
    });
    
    // Create a startTask action for a non-existent task
    mockAction = startTask({
      taskId: 'non-existent-task',
      startTime: Date.now(),
      endTime: Date.now() + 60000
    });
    
    // Mock console.error to silence the expected error
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    // Execute the middleware
    taskMiddleware(mockStore)(nextMock)(mockAction);
    
    // Verify costs were not subtracted
    expect(mockStore.dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: deductResources.type
      })
    );
    
    // Verify next was still called with the original action
    expect(nextMock).toHaveBeenCalledWith(mockAction);
    
    // Verify error was logged
    expect(console.error).toHaveBeenCalled();
    
    // Restore console.error
    console.error = originalConsoleError;
  });
  
  test('should apply resource rewards when completing a task', () => {
    // Setup mock state with a task that has rewards
    mockStore.getState.mockReturnValue({
      tasks: {
        tasks: {
          'test-task': {
            id: 'test-task',
            name: 'Test Task',
            rewards: {
              'solidarity': 30,
              'community_trust': 15
            }
          }
        }
      }
    });
    
    // Create a completeTask action
    mockAction = completeTask('test-task');
    
    // Execute the middleware
    taskMiddleware(mockStore)(nextMock)(mockAction);
    
    // Verify the action was passed to next first
    expect(nextMock).toHaveBeenCalledWith(mockAction);
    
    // Verify rewards were added
    // Check if each resource was incremented
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'resources/addResourceAmount',
        payload: {
          id: 'solidarity', 
          amount: 30
        }
      })
    );
    
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'resources/addResourceAmount',
        payload: {
          id: 'community_trust', 
          amount: 15
        }
      })
    );
  });
  
  test('should not apply rewards if task not found after completion', () => {
    // Setup mock state without the task, simulating an error
    mockStore.getState.mockReturnValue({
      tasks: {
        tasks: {}
      }
    });
    
    // Create a completeTask action
    mockAction = completeTask('test-task');
    
    // Mock console.error to silence the expected error
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    // Execute the middleware
    taskMiddleware(mockStore)(nextMock)(mockAction);
    
    // Verify next was called
    expect(nextMock).toHaveBeenCalledWith(mockAction);
    
    // Verify rewards were not added
    expect(mockStore.dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'resources/addResourceAmount'
      })
    );
    
    // Verify error was logged
    expect(console.error).toHaveBeenCalled();
    
    // Restore console.error
    console.error = originalConsoleError;
  });
  
  test('should handle zero costs gracefully', () => {
    // Setup mock state with a task that has empty costs
    mockStore.getState.mockReturnValue({
      tasks: {
        tasks: {
          'test-task': {
            id: 'test-task',
            name: 'Test Task',
            cost: {}
          }
        }
      }
    });
    
    // Create a startTask action
    mockAction = startTask({
      taskId: 'test-task',
      startTime: Date.now(),
      endTime: Date.now() + 60000
    });
    
    // Execute the middleware
    taskMiddleware(mockStore)(nextMock)(mockAction);
    
    // Verify subtractResources was not called
    expect(mockStore.dispatch).not.toHaveBeenCalled();
    
    // Verify next was called
    expect(nextMock).toHaveBeenCalledWith(mockAction);
  });
  
  test('should handle zero rewards gracefully', () => {
    // Setup mock state with a task that has empty rewards
    mockStore.getState.mockReturnValue({
      tasks: {
        tasks: {
          'test-task': {
            id: 'test-task',
            name: 'Test Task',
            rewards: {}
          }
        }
      }
    });
    
    // Create a completeTask action
    mockAction = completeTask('test-task');
    
    // Execute the middleware
    taskMiddleware(mockStore)(nextMock)(mockAction);
    
    // Verify next was called
    expect(nextMock).toHaveBeenCalledWith(mockAction);
    
    // Verify addResources was not called
    expect(mockStore.dispatch).not.toHaveBeenCalled();
  });
  
  test('should pass through unrelated actions', () => {
    // Create an unrelated action
    mockAction = { type: 'UNRELATED_ACTION' };
    
    // Execute the middleware
    taskMiddleware(mockStore)(nextMock)(mockAction);
    
    // Verify the action was passed through
    expect(nextMock).toHaveBeenCalledWith(mockAction);
    
    // Verify no dispatches occurred
    expect(mockStore.dispatch).not.toHaveBeenCalled();
  });
  
  test('should handle errors when applying costs', () => {
    // Setup mock state with a task
    mockStore.getState.mockReturnValue({
      tasks: {
        tasks: {
          'test-task': {
            id: 'test-task',
            name: 'Test Task',
            cost: {
              'solidarity': 10
            }
          }
        }
      }
    });
    
    // Make dispatch throw an error
    mockStore.dispatch.mockImplementation(() => {
      throw new Error('Test error');
    });
    
    // Mock console.error to silence the expected error
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    // Create a startTask action
    mockAction = startTask({
      taskId: 'test-task',
      startTime: Date.now(),
      endTime: Date.now() + 60000
    });
    
    // Execute the middleware - should not throw
    taskMiddleware(mockStore)(nextMock)(mockAction);
    
    // Verify next was still called
    expect(nextMock).toHaveBeenCalledWith(mockAction);
    
    // Verify error was logged
    expect(console.error).toHaveBeenCalled();
    
    // Restore console.error
    console.error = originalConsoleError;
  });
});