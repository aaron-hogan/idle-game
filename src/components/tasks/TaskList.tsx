import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { TaskCategory, TaskStatus } from '../../models/task';
import {
  selectAvailableTasks,
  selectTasksByCategory,
  selectActiveTask,
} from '../../state/tasksSlice';
import TaskItem from './TaskItem';
import Tab from '../common/Tab';
import TabGroup from '../common/TabGroup';
import ErrorBoundary from '../common/ErrorBoundary';

const TaskList: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const availableTasks = useSelector(selectAvailableTasks);
  const activeTask = useSelector(selectActiveTask);

  // Determine which tabs to show based on available tasks
  const categories = Object.values(TaskCategory);
  const hasTasksInCategory = categories.map((category) => {
    const tasksInCategory = useSelector((state: RootState) =>
      selectTasksByCategory(state, category)
    );
    return tasksInCategory.length > 0;
  });

  const visibleCategories = categories.filter((_, index) => hasTasksInCategory[index]);

  // Set initial active category to the first category with tasks
  useEffect(() => {
    if (!activeCategory && visibleCategories.length > 0) {
      setActiveCategory(visibleCategories[0]);
    }
  }, [visibleCategories, activeCategory]);

  // Get tasks for the current category
  const currentTasks = useSelector((state: RootState) =>
    activeCategory ? selectTasksByCategory(state, activeCategory) : availableTasks
  );

  // Handle tab change
  const handleTabChange = (category: string) => {
    setActiveCategory(category);
  };

  // Show message if no tasks are available
  if (visibleCategories.length === 0) {
    return (
      <div className="task-list task-list--empty">
        <p>No tasks available yet. Progress further to unlock tasks.</p>
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={<div className="task-list task-list--error">Error loading tasks</div>}>
      <div className="task-list">
        <div className="task-list__header">
          <h2>Tasks</h2>
          {activeTask && (
            <div className="task-list__active-task-info">Active task: {activeTask.name}</div>
          )}
        </div>

        <TabGroup>
          {visibleCategories.map((category) => (
            <Tab
              key={category}
              id={category}
              label={category.charAt(0).toUpperCase() + category.slice(1)}
              isActive={activeCategory === category}
              onClick={() => handleTabChange(category)}
            />
          ))}
        </TabGroup>

        <div className="task-list__content">
          {currentTasks.length > 0 ? (
            currentTasks.map((task) => <TaskItem key={task.id} taskId={task.id} />)
          ) : (
            <p className="task-list__empty-category">No {activeCategory} tasks available yet.</p>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default TaskList;
