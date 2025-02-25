/**
 * Tests for the ProgressionTracker component
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ProgressionTracker from '../ProgressionTracker';
import { GameStage, MilestoneType, AchievementType } from '../../../interfaces/progression';

// Create mock store
const mockStore = configureStore([]);

describe('ProgressionTracker', () => {
  let store: any;
  
  beforeEach(() => {
    // Create a mock store with test data
    store = mockStore({
      progression: {
        currentStage: GameStage.EARLY,
        milestones: {
          'test-milestone-1': {
            id: 'test-milestone-1',
            name: 'Test Milestone 1',
            description: 'Test milestone description',
            stage: GameStage.EARLY,
            type: MilestoneType.RESOURCE,
            completed: false,
            requirements: [],
            order: 1,
            visible: true
          },
          'test-milestone-2': {
            id: 'test-milestone-2',
            name: 'Test Milestone 2',
            description: 'Another test milestone',
            stage: GameStage.EARLY,
            type: MilestoneType.AWARENESS,
            completed: true,
            completedAt: 1000,
            requirements: [],
            order: 2,
            visible: true
          }
        },
        achievements: {
          'test-achievement-1': {
            id: 'test-achievement-1',
            name: 'Test Achievement',
            description: 'Test achievement description',
            type: AchievementType.RESOURCE,
            unlocked: false,
            requirements: [],
            hidden: false,
            hint: 'Test hint'
          },
          'test-achievement-2': {
            id: 'test-achievement-2',
            name: 'Test Achievement 2',
            description: 'Another test achievement',
            type: AchievementType.STRATEGIC,
            unlocked: true,
            unlockedAt: 2000,
            requirements: [],
            hidden: false
          }
        },
        milestoneIds: ['test-milestone-1', 'test-milestone-2'],
        achievementIds: ['test-achievement-1', 'test-achievement-2'],
        milestonesByStage: {
          [GameStage.EARLY]: ['test-milestone-1', 'test-milestone-2'],
          [GameStage.MID]: [],
          [GameStage.LATE]: [],
          [GameStage.END_GAME]: []
        },
        milestonesByType: {
          [MilestoneType.RESOURCE]: ['test-milestone-1'],
          [MilestoneType.AWARENESS]: ['test-milestone-2'],
          [MilestoneType.ORGANIZATION]: [],
          [MilestoneType.MOVEMENT]: [],
          [MilestoneType.RESISTANCE]: [],
          [MilestoneType.TRANSFORMATION]: [],
          [MilestoneType.SPECIAL]: []
        },
        achievementsByType: {
          [AchievementType.RESOURCE]: ['test-achievement-1'],
          [AchievementType.STRATEGIC]: ['test-achievement-2'],
          [AchievementType.ETHICAL]: [],
          [AchievementType.COMMUNITY]: [],
          [AchievementType.RESISTANCE]: [],
          [AchievementType.TIMED]: [],
          [AchievementType.SPECIAL]: []
        },
        stageReachedAt: {
          [GameStage.EARLY]: 1000,
          [GameStage.MID]: null,
          [GameStage.LATE]: null,
          [GameStage.END_GAME]: null
        }
      }
    });
    
    // Mock the ProgressionManager instance
    jest.mock('../../../managers/progression/ProgressionManager', () => ({
      ProgressionManager: {
        getInstance: () => ({
          checkAllProgressionItems: jest.fn().mockReturnValue(0),
          getCurrentStageCompletionPercentage: jest.fn().mockReturnValue(50),
          getOverallCompletionPercentage: jest.fn().mockReturnValue(25)
        })
      }
    }));
  });
  
  it('should render the progression tracker with stage and milestone information', () => {
    render(
      <Provider store={store}>
        <ProgressionTracker />
      </Provider>
    );
    
    // Check that the component renders
    expect(screen.getByText('Movement Progress')).toBeInTheDocument();
    
    // Check that stage indicator shows correct stage
    expect(screen.getByText(/Early Organizing/i)).toBeInTheDocument();
    
    // Check that milestones are displayed
    expect(screen.getByText('Test Milestone 1')).toBeInTheDocument();
    expect(screen.getByText('Test Milestone 2')).toBeInTheDocument();
    
    // Check that completed status is shown
    const completedBadge = screen.getByText('Completed');
    expect(completedBadge).toBeInTheDocument();
    
    // Check that achievements are displayed
    expect(screen.getByText('Test Achievement')).toBeInTheDocument();
    expect(screen.getByText('Test Achievement 2')).toBeInTheDocument();
  });
});