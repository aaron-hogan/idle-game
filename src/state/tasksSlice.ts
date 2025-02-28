import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task, TaskStatus, initialTasks } from '../models/task';
import { RootState } from './store';

export interface TasksState {
  tasks: Record<string, Task>;
  activeTaskId: string | null;
}

const initialState: TasksState = {
  tasks: {},
  activeTaskId: null
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    /**
     * Initialize all tasks
     */
    initializeTasks: (state) => {
      // Convert initial tasks array to a record and set default values
      initialTasks.forEach(taskData => {
        state.tasks[taskData.id] = {
          ...taskData,
          status: TaskStatus.LOCKED,
          progress: 0,
          completionCount: 0
        };
      });
    },

    /**
     * Unlock a task
     */
    unlockTask: (state, action: PayloadAction<string>) => {
      const taskId = action.payload;
      if (state.tasks[taskId]) {
        state.tasks[taskId].status = TaskStatus.AVAILABLE;
      }
    },

    /**
     * Start a task
     */
    startTask: (state, action: PayloadAction<{
      taskId: string;
      startTime: number;
      endTime: number;
    }>) => {
      const { taskId, startTime, endTime } = action.payload;
      if (state.tasks[taskId]) {
        state.tasks[taskId].status = TaskStatus.IN_PROGRESS;
        state.tasks[taskId].progress = 0;
        state.tasks[taskId].startTime = startTime;
        state.tasks[taskId].endTime = endTime;
        state.activeTaskId = taskId;
      }
    },

    /**
     * Update task progress
     */
    updateTaskProgress: (state, action: PayloadAction<{
      taskId: string;
      progress: number;
    }>) => {
      const { taskId, progress } = action.payload;
      if (state.tasks[taskId] && state.tasks[taskId].status === TaskStatus.IN_PROGRESS) {
        state.tasks[taskId].progress = progress;
      }
    },

    /**
     * Complete a task
     */
    completeTask: (state, action: PayloadAction<string>) => {
      const taskId = action.payload;
      if (state.tasks[taskId]) {
        state.tasks[taskId].status = TaskStatus.COMPLETED;
        state.tasks[taskId].progress = 100;
        state.tasks[taskId].completionCount += 1;
        
        // If task is repeatable, set it back to available after completion
        if (state.tasks[taskId].repeatable) {
          state.tasks[taskId].status = TaskStatus.AVAILABLE;
        }
        
        state.activeTaskId = null;
      }
    },

    /**
     * Cancel an in-progress task
     */
    cancelTask: (state, action: PayloadAction<string>) => {
      const taskId = action.payload;
      if (state.tasks[taskId] && state.tasks[taskId].status === TaskStatus.IN_PROGRESS) {
        state.tasks[taskId].status = TaskStatus.AVAILABLE;
        state.tasks[taskId].progress = 0;
        state.tasks[taskId].startTime = undefined;
        state.tasks[taskId].endTime = undefined;
        state.activeTaskId = null;
      }
    },

    /**
     * Reset a completed task back to available (for repeatable tasks)
     */
    resetTask: (state, action: PayloadAction<string>) => {
      const taskId = action.payload;
      if (state.tasks[taskId] && state.tasks[taskId].repeatable) {
        state.tasks[taskId].status = TaskStatus.AVAILABLE;
        state.tasks[taskId].progress = 0;
        state.tasks[taskId].startTime = undefined;
        state.tasks[taskId].endTime = undefined;
      }
    }
  },
  extraReducers: (builder) => {
    // When a saved game is loaded, replace the tasks state
    builder.addCase('game/gameLoaded' as any, (state, action: PayloadAction<any>) => {
      if (action.payload && action.payload.tasks) {
        return action.payload.tasks as TasksState;
      }
      return state;
    });
  }
});

// Action creators
export const {
  initializeTasks,
  unlockTask,
  startTask,
  updateTaskProgress,
  completeTask,
  cancelTask,
  resetTask
} = tasksSlice.actions;

// Selectors
export const selectAllTasks = (state: RootState) => state.tasks.tasks;
export const selectTaskById = (state: RootState, taskId: string) => state.tasks.tasks[taskId];
export const selectTasksByCategory = (state: RootState, category: string) => 
  Object.values(state.tasks.tasks).filter(task => task.category === category);
export const selectAvailableTasks = (state: RootState) =>
  Object.values(state.tasks.tasks).filter(task => task.status === TaskStatus.AVAILABLE);
export const selectActiveTask = (state: RootState) => 
  state.tasks.activeTaskId ? state.tasks.tasks[state.tasks.activeTaskId] : null;
export const selectCompletedTasks = (state: RootState) =>
  Object.values(state.tasks.tasks).filter(task => 
    task.status === TaskStatus.COMPLETED || 
    (task.status === TaskStatus.AVAILABLE && task.completionCount > 0)
  );

export default tasksSlice.reducer;