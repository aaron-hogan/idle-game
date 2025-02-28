/**
 * Initialization for the progression system
 */
import { store } from '../../state/store';
import { allMilestones } from './milestones';
import { allAchievements } from './achievements';
import { addMilestone, addAchievement } from '../../redux/progressionSlice';
import { GameStage } from '../../interfaces/progression';
import { getCurrentTime } from '../../utils/timeUtils';

/**
 * Initializes the progression system by loading milestones and achievements
 * into the Redux store
 */
export const initializeProgression = (): void => {
  try {
    console.log('Initializing progression system...');

    // Set initial game stage
    store.dispatch({
      type: 'progression/advanceGameStage',
      payload: {
        stage: GameStage.EARLY,
        reachedAt: getCurrentTime(),
      },
    });

    // Load all milestones
    console.log(`Loading ${allMilestones.length} milestones...`);
    for (const milestone of allMilestones) {
      store.dispatch(addMilestone(milestone));
    }

    // Load all achievements
    console.log(`Loading ${allAchievements.length} achievements...`);
    for (const achievement of allAchievements) {
      store.dispatch(addAchievement(achievement));
    }

    console.log('Progression system initialized successfully.');
  } catch (error) {
    console.error('Error initializing progression system:', error);
  }
};

/**
 * Reset the progression system (for testing or new game)
 */
export const resetProgression = (): void => {
  try {
    console.log('Resetting progression system...');

    // Reset progression state
    store.dispatch({
      type: 'progression/resetProgression',
    });

    // Reinitialize with default values
    initializeProgression();

    console.log('Progression system reset successfully.');
  } catch (error) {
    console.error('Error resetting progression system:', error);
  }
};
