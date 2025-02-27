// Mock the resource interface for tests
jest.mock('../../interfaces/Resource', () => require('./__mocks__/Resource'));

// Mock the store
jest.mock('../../state/store', () => {
  const mockStore = {
    getState: jest.fn(),
    dispatch: jest.fn(),
    subscribe: jest.fn().mockImplementation(() => jest.fn())
  };
  
  return {
    store: mockStore
  };
});

// Mock the progression slice
jest.mock('../../redux/progressionSlice', () => ({
  completeMilestone: jest.fn(),
  unlockAchievement: jest.fn(),
  advanceGameStage: jest.fn(),
  selectMilestoneById: jest.fn(),
  selectAchievementById: jest.fn(),
  selectCurrentStage: jest.fn(),
  selectCompletedMilestones: jest.fn(),
  selectUnlockedAchievements: jest.fn(),
  selectVisibleMilestones: jest.fn(),
  selectVisibleAchievements: jest.fn()
}));

// Mock the time utils
jest.mock('../../utils/timeUtils', () => ({
  getCurrentTime: jest.fn().mockReturnValue(1000)
}));