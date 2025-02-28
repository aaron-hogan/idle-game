import React, { useState, useEffect } from 'react';
import { Task, TaskStatus } from '../../models/task';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { formatResourceAmount } from '../../utils/resourceUtils';
import { TaskManager } from '../../managers/TaskManager';
import Button from '../common/Button';
import ProgressBar from '../common/ProgressBar';
import Icon from '../common/Icon';
import Tooltip from '../common/Tooltip';
import ErrorBoundary from '../common/ErrorBoundary';

interface TaskItemProps {
  taskId: string;
}

const TaskItem: React.FC<TaskItemProps> = ({ taskId }) => {
  const task = useSelector((state: RootState) => state.tasks.tasks[taskId]);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [canAfford, setCanAfford] = useState<boolean>(false);

  const taskManager = TaskManager.getInstance();

  // Effect to check if player can afford this task
  useEffect(() => {
    if (!task) return;

    setCanAfford(taskManager.canAffordTask(taskId));

    // Set up polling to check affordability (resources might change)
    const intervalId = setInterval(() => {
      setCanAfford(taskManager.canAffordTask(taskId));
    }, 1000); // Check every second

    return () => clearInterval(intervalId);
  }, [task, taskId]);

  // Effect to update time remaining
  useEffect(() => {
    if (!task || task.status !== TaskStatus.IN_PROGRESS) return;

    const intervalId = setInterval(() => {
      const progress = taskManager.getTaskProgress(taskId);
      if (progress) {
        setTimeRemaining(progress.timeRemaining);
      }
    }, 500); // Update twice per second

    return () => clearInterval(intervalId);
  }, [task, taskId]);

  // Handle task button click
  const handleTaskAction = () => {
    if (!task) return;

    if (task.status === TaskStatus.AVAILABLE) {
      taskManager.startTask(taskId);
    } else if (task.status === TaskStatus.IN_PROGRESS) {
      taskManager.cancelTask(taskId);
    }
  };

  // Format time remaining
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // If task doesn't exist, return null
  if (!task) {
    return null;
  }

  // Don't show locked tasks
  if (task.status === TaskStatus.LOCKED) {
    return null;
  }

  return (
    <ErrorBoundary fallback={<div className="task-item task-item--error">Error loading task</div>}>
      <div className={`task-item task-item--${task.status.toLowerCase()}`}>
        <div className="task-item__header">
          <h3 className="task-item__title">
            {task.icon && <Icon name={task.icon} />}
            {task.name}
            <span className="task-item__category">({task.category})</span>
          </h3>
          {task.completionCount > 0 && (
            <Tooltip
              content={`Completed ${task.completionCount} time${task.completionCount !== 1 ? 's' : ''}`}
            >
              <span className="task-item__completion-count">✓{task.completionCount}</span>
            </Tooltip>
          )}
        </div>

        <div className="task-item__description">{task.description}</div>

        <div className="task-item__details">
          <div className="task-item__resources">
            <div className="task-item__costs">
              <h4>Costs:</h4>
              {Object.keys(task.cost).length > 0 ? (
                <ul>
                  {Object.entries(task.cost).map(([resourceId, amount]) => (
                    <li key={resourceId}>
                      {resourceId}: {formatResourceAmount(amount)}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No cost</p>
              )}
            </div>

            <div className="task-item__rewards">
              <h4>Rewards:</h4>
              {Object.keys(task.rewards).length > 0 ? (
                <ul>
                  {Object.entries(task.rewards).map(([resourceId, amount]) => (
                    <li key={resourceId}>
                      {resourceId}: {formatResourceAmount(amount)}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No rewards</p>
              )}
            </div>
          </div>

          <div className="task-item__duration">
            <h4>Duration:</h4>
            <p>
              {Math.floor(task.duration / 60)}:{(task.duration % 60).toString().padStart(2, '0')}
            </p>
          </div>
        </div>

        {task.status === TaskStatus.IN_PROGRESS && (
          <div className="task-item__progress">
            <ProgressBar
              progress={task.progress}
              label={`${timeRemaining > 0 ? formatTime(timeRemaining) : 'Completing...'})`}
            />
          </div>
        )}

        <div className="task-item__actions">
          {task.status === TaskStatus.AVAILABLE && (
            <Button
              onClick={handleTaskAction}
              disabled={!canAfford}
              variant="primary"
              className="task-item__button"
            >
              Start Task
            </Button>
          )}

          {task.status === TaskStatus.IN_PROGRESS && (
            <Button onClick={handleTaskAction} variant="danger" className="task-item__button">
              Cancel Task
            </Button>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default TaskItem;
