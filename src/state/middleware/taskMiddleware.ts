import { Middleware } from 'redux';
import { completeTask, startTask } from '../tasksSlice';
import { RootState } from '../store';
import { addResourceAmount, deductResources } from '../resourcesSlice';

/**
 * Middleware to handle task effects
 * - Applies resource costs when tasks are started
 * - Applies resource rewards when tasks are completed
 */
export const taskMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  // For task start, apply costs before the action
  if (startTask.match(action)) {
    try {
      const taskId = action.payload.taskId;
      const state = store.getState();
      const task = state.tasks.tasks[taskId];

      if (!task) {
        console.error(`Task cost processing failed: Task ${taskId} not found`);
        return next(action); // Continue with the action
      }

      // Apply resource costs
      if (task.cost && Object.keys(task.cost).length > 0) {
        store.dispatch(deductResources(task.cost));
      }
    } catch (error) {
      console.error('Error processing task costs:', error);
      // Continue with the action despite errors
    }
  }

  // Let the action pass through to update state
  const result = next(action);

  // For task completion, apply rewards after the action
  if (completeTask.match(action)) {
    try {
      const taskId = action.payload;
      const state = store.getState();
      const task = state.tasks.tasks[taskId];

      if (!task) {
        console.error(`Task reward processing failed: Task ${taskId} not found`);
        return result;
      }

      // Apply resource rewards
      if (task.rewards && Object.keys(task.rewards).length > 0) {
        // Convert the rewards object into individual resource updates
        Object.entries(task.rewards).forEach(([resourceId, amount]) => {
          store.dispatch(addResourceAmount({ id: resourceId, amount }));
        });
      }

      // Future enhancement: handle other types of rewards like unlocking buildings,
      // triggering events, etc.
    } catch (error) {
      console.error('Error processing task rewards:', error);
      // Even if reward processing fails, we don't want to revert the task completion
    }
  }

  return result;
};
