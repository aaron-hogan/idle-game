import { Store, AnyAction, Dispatch } from '@reduxjs/toolkit';
import {
  initializeTasks,
  startTask,
  updateTaskProgress,
  completeTask,
  cancelTask,
  unlockTask,
  resetTask,
} from '../state/tasksSlice';
import { Task, TaskRequirement, TaskStatus } from '../models/task';
import { checkResourceAvailability } from '../utils/resourceUtils';
import { GameLoopManager } from './GameLoopManager';
import { EventEmitter, EventCallback } from '../utils/EventEmitter';
import { getCurrentTime } from '../utils/timeUtils';
import { RootState } from '../state/store';

/**
 * Manages all task-related operations including initialization, validation,
 * progress tracking, and completion handling.
 * Follows singleton pattern for global access but uses dependency injection for the store.
 */
export class TaskManager {
  private static instance: TaskManager | null = null;
  private initialized = false;
  private taskCompletionListeners: Map<string, ((taskId: string) => void)[]> = new Map();
  private events = new EventEmitter();
  private unregisterHandler: (() => void) | null = null;
  private store: Store<RootState> | null = null;
  private dispatch: Dispatch<AnyAction> | null = null;
  private getState: (() => RootState) | null = null;

  /**
   * Private constructor to enforce singleton pattern
   */
  private constructor() {
    // Postpone GameLoop registration until init()
  }

  /**
   * Get the singleton instance of TaskManager
   */
  public static getInstance(): TaskManager {
    if (!TaskManager.instance) {
      TaskManager.instance = new TaskManager();
    }
    return TaskManager.instance;
  }

  /**
   * Initialize the task system with Redux store
   * @param store The Redux store instance
   * @returns True if initialization was successful
   */
  public initialize(store: Store<RootState>): boolean {
    try {
      if (this.initialized) {
        // If already initialized with a store, just return success
        return true;
      }

      // Store the Redux store and its methods
      this.store = store;
      this.dispatch = store.dispatch;
      this.getState = store.getState;

      // Register with GameLoop now that we have the store
      this.registerWithGameLoop();

      // Initialize tasks in the store
      this.dispatch(initializeTasks());
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize task system:', error);
      this.initialized = false;
      return false;
    }
  }

  /**
   * Ensure the manager is properly initialized with a store
   * @throws Error if not initialized
   */
  private ensureInitialized(): void {
    if (!this.store || !this.dispatch || !this.getState) {
      throw new Error('TaskManager not properly initialized with Redux store');
    }
  }

  /**
   * Registers this manager with the GameLoop for regular updates
   */
  private registerWithGameLoop(): void {
    try {
      // Use the new GameLoop implementation with dynamic import to avoid circular references
      const { GameLoop } = require('../core/GameLoop');
      const gameLoop = GameLoop.getInstance();
      const boundTickHandler = this.onGameTick.bind(this);

      // Store unregister function for cleanup if needed
      this.unregisterHandler = gameLoop.registerHandler(boundTickHandler);

      // Simple log message
      console.log('TaskManager: Registered with GameLoop');
    } catch (error) {
      console.error('Failed to register with GameLoop:', error);
    }
  }

  /**
   * Handler for game tick events, updates all in-progress tasks
   * @param realDeltaTime Unscaled time elapsed since last tick in seconds
   * @param gameDeltaTime Scaled time elapsed since last tick in seconds
   */
  private onGameTick(realDeltaTime: number, gameDeltaTime: number): void {
    try {
      this.ensureInitialized();
      const state = this.getState!();
      const currentTime = getCurrentTime();
      const tasks = state.tasks.tasks;

      // For debugging
      if (Math.random() < 0.01) {
        // Log occasionally
        console.log(
          `TaskManager: Updating tasks with realDelta=${realDeltaTime.toFixed(3)}s, gameDelta=${gameDeltaTime.toFixed(3)}s`
        );
      }

      Object.values(tasks).forEach((task) => {
        if (task.status === TaskStatus.IN_PROGRESS && task.endTime) {
          // Calculate progress percentage - tasks use real time, not game time
          // This ensures tasks take the same amount of real time regardless of game speed
          const startTime = task.startTime || 0;
          const endTime = task.endTime;
          const totalDuration = endTime - startTime;

          if (totalDuration <= 0) {
            console.error(`Invalid task duration for task ${task.id}`);
            return;
          }

          const elapsed = currentTime - startTime;
          const progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

          // Update progress in store
          this.dispatch!(
            updateTaskProgress({
              taskId: task.id,
              progress,
            })
          );

          // Complete task if done
          if (progress >= 100) {
            this.completeTask(task.id);
          }
        }
      });
    } catch (error) {
      console.error('Error updating task progress:', error);
      // Continue operation despite errors - self-healing approach
    }
  }

  /**
   * Check if all requirements for a task are met
   * @param task The task to check requirements for
   * @returns True if all requirements are met
   */
  private checkRequirements(task: Task): boolean {
    try {
      this.ensureInitialized();

      if (!task || !task.requirements) {
        return true; // No requirements means always available
      }

      const state = this.getState!();

      return task.requirements.every((req) => {
        return this.validateRequirement(req, state);
      });
    } catch (error) {
      console.error(`Error checking requirements for task ${task?.id}:`, error);
      return false; // Fail safe
    }
  }

  /**
   * Validate a single task requirement against current game state
   * @param requirement The requirement to validate
   * @param state Current game state
   * @returns True if requirement is met
   */
  private validateRequirement(requirement: TaskRequirement, state: RootState): boolean {
    try {
      switch (requirement.type) {
        case 'resource':
          // Use safe access with type assertion for resources
          const resourcesObj = state.resources.resources;
          // First cast to unknown to avoid direct conversion errors
          const resources = resourcesObj as unknown as Record<string, { amount: number }>;
          const resource = resources[requirement.id];
          return resource && resource.amount >= requirement.value;

        case 'structure':
          // Use safe access with type assertion for structures
          const structuresObj = state.structures.structures;
          // First cast to unknown to avoid direct conversion errors
          const structures = structuresObj as unknown as Record<string, { level: number }>;
          const structure = structures[requirement.id];
          return structure && structure.level >= requirement.value;

        case 'gameStage':
          // Use gameStage property from the game state
          return (state.game.gameStage || 0) >= requirement.value;

        case 'taskCompleted':
          const task = state.tasks.tasks[requirement.id];
          return task && task.completionCount >= requirement.value;

        default:
          console.warn(`Unknown requirement type: ${(requirement as any).type}`);
          return false;
      }
    } catch (error) {
      console.error('Error validating requirement:', error);
      return false; // Fail safe
    }
  }

  /**
   * Check if player can afford to start a task
   * @param taskId ID of the task to check
   * @returns True if player has enough resources
   */
  public canAffordTask(taskId: string): boolean {
    try {
      this.ensureInitialized();
      const state = this.getState!();
      const task = state.tasks.tasks[taskId];

      if (!task) {
        console.error(`Task ${taskId} not found`);
        return false;
      }

      return checkResourceAvailability(task.cost);
    } catch (error) {
      console.error(`Error checking affordability for task ${taskId}:`, error);
      return false; // Fail safe
    }
  }

  /**
   * Attempt to start a task
   * @param taskId ID of the task to start
   * @returns True if task was successfully started
   */
  public startTask(taskId: string): boolean {
    try {
      this.ensureInitialized();
      const state = this.getState!();
      const task = state.tasks.tasks[taskId];

      // Validate task exists
      if (!task) {
        console.error(`Task ${taskId} not found`);
        return false;
      }

      // Check if another task is already in progress
      if (state.tasks.activeTaskId !== null) {
        console.warn('Another task is already in progress');
        return false;
      }

      // Check if task is available
      if (task.status !== TaskStatus.AVAILABLE) {
        console.warn(`Task ${taskId} is not available (status: ${task.status})`);
        return false;
      }

      // Check requirements
      if (!this.checkRequirements(task)) {
        console.warn(`Requirements not met for task ${taskId}`);
        return false;
      }

      // Check resources
      if (!this.canAffordTask(taskId)) {
        console.warn(`Cannot afford task ${taskId}`);
        return false;
      }

      // Calculate start and end times
      const startTime = getCurrentTime();
      const endTime = startTime + task.duration * 1000; // Convert seconds to ms

      // Start the task
      this.dispatch!(
        startTask({
          taskId,
          startTime,
          endTime,
        })
      );

      // Trigger an event for task started
      this.events.emit('taskStarted', taskId);

      return true;
    } catch (error) {
      console.error(`Error starting task ${taskId}:`, error);
      return false; // Fail safe
    }
  }

  /**
   * Complete a task and distribute rewards
   * @param taskId ID of the task to complete
   * @returns True if task was successfully completed
   */
  public completeTask(taskId: string): boolean {
    try {
      this.ensureInitialized();
      const state = this.getState!();
      const task = state.tasks.tasks[taskId];

      if (!task) {
        console.error(`Task ${taskId} not found`);
        return false;
      }

      if (task.status !== TaskStatus.IN_PROGRESS) {
        console.warn(`Task ${taskId} is not in progress (status: ${task.status})`);
        return false;
      }

      // Complete the task in store
      this.dispatch!(completeTask(taskId));

      // Distribute rewards
      // Note: Actually distributing the rewards would be handled by middleware
      // that listens for the completeTask action

      // Trigger task completion event
      this.events.emit('taskCompleted', taskId);

      // If task is repeatable and cooldown is present, schedule reset
      if (task.repeatable && task.cooldown) {
        setTimeout(() => {
          try {
            this.ensureInitialized();
            // Only reset if task is still in COMPLETED or AVAILABLE state
            const currentState = this.getState!();
            const currentTask = currentState.tasks.tasks[taskId];

            if (
              currentTask &&
              (currentTask.status === TaskStatus.COMPLETED ||
                currentTask.status === TaskStatus.AVAILABLE)
            ) {
              this.dispatch!(resetTask(taskId));
              this.events.emit('taskReset', taskId);
            }
          } catch (error) {
            console.error(`Error resetting task ${taskId}:`, error);
          }
        }, task.cooldown * 1000); // Convert seconds to ms
      }

      return true;
    } catch (error) {
      console.error(`Error completing task ${taskId}:`, error);
      return false; // Fail safe
    }
  }

  /**
   * Cancel an in-progress task
   * @param taskId ID of the task to cancel
   * @returns True if task was successfully canceled
   */
  public cancelTask(taskId: string): boolean {
    try {
      this.ensureInitialized();
      const state = this.getState!();
      const task = state.tasks.tasks[taskId];

      if (!task) {
        console.error(`Task ${taskId} not found`);
        return false;
      }

      if (task.status !== TaskStatus.IN_PROGRESS) {
        console.warn(`Task ${taskId} is not in progress (status: ${task.status})`);
        return false;
      }

      this.dispatch!(cancelTask(taskId));
      this.events.emit('taskCanceled', taskId);

      return true;
    } catch (error) {
      console.error(`Error canceling task ${taskId}:`, error);
      return false; // Fail safe
    }
  }

  /**
   * Unlock a task if its requirements are met
   * @param taskId ID of the task to unlock
   * @returns True if task was successfully unlocked
   */
  public unlockTask(taskId: string): boolean {
    try {
      this.ensureInitialized();
      const state = this.getState!();
      const task = state.tasks.tasks[taskId];

      if (!task) {
        console.error(`Task ${taskId} not found`);
        return false;
      }

      if (task.status !== TaskStatus.LOCKED) {
        // Task already unlocked, not an error
        return true;
      }

      if (!this.checkRequirements(task)) {
        console.warn(`Requirements not met for task ${taskId}`);
        return false;
      }

      this.dispatch!(unlockTask(taskId));
      this.events.emit('taskUnlocked', taskId);

      return true;
    } catch (error) {
      console.error(`Error unlocking task ${taskId}:`, error);
      return false; // Fail safe
    }
  }

  /**
   * Check all locked tasks and unlock any that meet requirements
   * @returns Number of tasks unlocked
   */
  public checkAllTaskRequirements(): number {
    try {
      this.ensureInitialized();
      const state = this.getState!();
      const tasks = state.tasks.tasks;
      let unlocked = 0;

      Object.values(tasks).forEach((task) => {
        if (task.status === TaskStatus.LOCKED && this.checkRequirements(task)) {
          this.dispatch!(unlockTask(task.id));
          this.events.emit('taskUnlocked', task.id);
          unlocked++;
        }
      });

      return unlocked;
    } catch (error) {
      console.error('Error checking task requirements:', error);
      return 0; // Fail safe
    }
  }

  /**
   * Add a listener for task completion events
   * @param taskId ID of the task to listen for
   * @param callback Function to call when task completes
   */
  public onTaskCompleted(taskId: string, callback: (taskId: string) => void): void {
    try {
      this.events.on('taskCompleted', (completedTaskId: unknown) => {
        if (completedTaskId === taskId) {
          callback(taskId);
        }
      });
    } catch (error) {
      console.error(`Error adding completion listener for task ${taskId}:`, error);
    }
  }

  /**
   * Get progress information for a specific task
   * @param taskId ID of the task to check
   * @returns Progress information object or null if task not found
   */
  public getTaskProgress(taskId: string): {
    progress: number;
    timeRemaining: number;
    status: TaskStatus;
  } | null {
    try {
      this.ensureInitialized();
      const state = this.getState!();
      const task = state.tasks.tasks[taskId];

      if (!task) {
        return null;
      }

      const currentTime = getCurrentTime();
      let timeRemaining = 0;

      if (task.status === TaskStatus.IN_PROGRESS && task.endTime) {
        timeRemaining = Math.max(0, task.endTime - currentTime);
      }

      return {
        progress: task.progress,
        timeRemaining: Math.ceil(timeRemaining / 1000), // Convert to seconds
        status: task.status,
      };
    } catch (error) {
      console.error(`Error getting progress for task ${taskId}:`, error);
      return null; // Fail safe
    }
  }

  /**
   * Subscribe to task events
   * @param eventName Name of the event to listen for
   * @param callback Function to call when event occurs
   */
  public on(
    eventName: 'taskStarted' | 'taskCompleted' | 'taskCanceled' | 'taskUnlocked' | 'taskReset',
    callback: (taskId: string) => void
  ): void {
    // Wrap the callback to ensure type safety with EventCallback
    const wrappedCallback: EventCallback = (arg: unknown) => {
      if (typeof arg === 'string') {
        callback(arg);
      }
    };
    this.events.on(eventName, wrappedCallback);
  }

  /**
   * Remove a subscription to task events
   * @param eventName Name of the event to stop listening for
   * @param callback Function to remove
   */
  public off(
    eventName: 'taskStarted' | 'taskCompleted' | 'taskCanceled' | 'taskUnlocked' | 'taskReset',
    callback: (taskId: string) => void
  ): void {
    // We need to maintain a mapping of original callbacks to wrapped callbacks
    // For now, we'll just unsubscribe from the event entirely as a workaround
    // TODO: Implement proper callback tracking for precise unsubscription
    this.events.off(eventName, callback as unknown as EventCallback);
  }

  /**
   * Factory method to create a task instance
   * @param taskData Data for the task
   * @returns Validated task object
   */
  public static createTask(taskData: Partial<Task>): Task {
    if (!taskData.id) {
      throw new Error('Task must have an ID');
    }

    if (!taskData.name) {
      throw new Error('Task must have a name');
    }

    if (!taskData.category) {
      throw new Error('Task must have a category');
    }

    // Use default values for missing fields
    const task: Task = {
      id: taskData.id,
      name: taskData.name,
      description: taskData.description || '',
      category: taskData.category,
      duration: taskData.duration || 60, // Default 1 minute
      cost: taskData.cost || {},
      rewards: taskData.rewards || {},
      status: taskData.status || TaskStatus.LOCKED,
      progress: taskData.progress || 0,
      requirements: taskData.requirements || [],
      repeatable: taskData.repeatable || false,
      completionCount: taskData.completionCount || 0,
      cooldown: taskData.cooldown,
      startTime: taskData.startTime,
      endTime: taskData.endTime,
      icon: taskData.icon,
    };

    return task;
  }
}
