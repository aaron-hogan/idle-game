/**
 * Simple test to check progression slice functionality
 */
import { store } from '../state/store';
import { addMilestone, addAchievement, advanceGameStage } from './progressionSlice';
import { GameStage, MilestoneType, AchievementType } from '../interfaces/progression';

// Log the initial progression state
console.log('Initial progression state:', store.getState().progression);

// Test if we can dispatch actions to the progression slice
try {
  // Create a test milestone
  store.dispatch(addMilestone({
    id: 'test-milestone',
    name: 'Test Milestone',
    description: 'This is a test milestone',
    stage: GameStage.EARLY,
    type: MilestoneType.RESOURCE,
    completed: false,
    requirements: [],
    order: 0,
    visible: true
  }));
  
  // Create a test achievement
  store.dispatch(addAchievement({
    id: 'test-achievement',
    name: 'Test Achievement',
    description: 'This is a test achievement',
    type: AchievementType.RESOURCE,
    unlocked: false,
    requirements: [],
    hidden: false
  }));
  
  // Advance game stage
  store.dispatch(advanceGameStage({
    stage: GameStage.EARLY,
    reachedAt: Date.now()
  }));
  
  // Log the updated progression state
  console.log('Updated progression state:', store.getState().progression);
  console.log('Progression test successful!');
} catch (error) {
  console.error('Progression test failed:', error);
}