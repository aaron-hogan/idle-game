import { configureStore } from '@reduxjs/toolkit';
import resourcesReducer from '../../../state/resourcesSlice';
import gameReducer from '../../../state/gameSlice';
import eventsReducer from '../../../state/eventsSlice';
import progressionReducer from '../../../redux/progressionSlice';
import { EventProgressionBridge } from '../EventProgressionBridge';
import { EventManager } from '../../eventManager';
import { ProgressionManager } from '../../../managers/progression/ProgressionManager';
import { GameStage } from '../../../interfaces/progression';

// Mock the dependencies
jest.mock('../../eventManager');
jest.mock('../../../managers/progression/ProgressionManager');

describe('EventProgressionBridge', () => {
  // Create test store
  const createTestStore = () => 
    configureStore({
      reducer: {
        resources: resourcesReducer,
        game: gameReducer,
        events: eventsReducer,
        progression: progressionReducer
      },
      preloadedState: {
        progression: {
          currentStage: GameStage.EARLY,
          milestones: {},
          achievements: {},
          milestoneIds: [],
          achievementIds: [],
          milestonesByStage: { [GameStage.EARLY]: [] },
          milestonesByType: {},
          achievementsByType: {},
          stageReachedAt: {}
        },
        resources: {
          'collective-power': {
            id: 'collective-power',
            amount: 50,
            maxAmount: 1000,
            perSecond: 1
          },
          'oppression': {
            id: 'oppression',
            amount: 20,
            maxAmount: 1000,
            perSecond: 0.5
          }
        }
      }
    });

  // Reset singleton between tests
  beforeEach(() => {
    jest.clearAllMocks();
    // @ts-ignore - accessing private property for testing
    EventProgressionBridge.instance = null;
    
    // Mock initialization methods
    (EventManager.getInstance as jest.Mock).mockImplementation(() => ({
      initialize: jest.fn(),
      registerEvent: jest.fn(),
      triggerEvent: jest.fn()
    }));
    
    (ProgressionManager.getInstance as jest.Mock).mockImplementation(() => ({
      initialize: jest.fn(),
      checkAllProgressionItems: jest.fn()
    }));
  });

  test('should initialize with store', () => {
    const store = createTestStore();
    const bridge = EventProgressionBridge.getInstance();
    
    expect(bridge.initialize(store)).toBe(true);
    expect(EventManager.getInstance).toHaveBeenCalled();
    expect(ProgressionManager.getInstance).toHaveBeenCalled();
  });

  test('should handle game stage changes', () => {
    const store = createTestStore();
    const bridge = EventProgressionBridge.getInstance();
    bridge.initialize(store);
    
    // @ts-ignore - accessing private method for testing
    bridge.handleGameStageChange(GameStage.MID);
    
    // Event should be registered and triggered
    const eventManager = EventManager.getInstance();
    expect(eventManager.registerEvent).toHaveBeenCalled();
    expect(eventManager.triggerEvent).toHaveBeenCalled();
  });

  test('should check win/lose proximity', () => {
    const store = createTestStore();
    const bridge = EventProgressionBridge.getInstance();
    bridge.initialize(store);
    
    // @ts-ignore - mock for testing
    bridge.triggerApproachingVictoryEvent = jest.fn();
    // @ts-ignore - mock for testing
    bridge.triggerApproachingDefeatEvent = jest.fn();
    
    bridge.checkWinLoseProximity();
    
    // With default test values, neither should be triggered
    // @ts-ignore - accessing mocked functions
    expect(bridge.triggerApproachingVictoryEvent).not.toHaveBeenCalled();
    // @ts-ignore - accessing mocked functions
    expect(bridge.triggerApproachingDefeatEvent).not.toHaveBeenCalled();
  });

  test('should update periodically', () => {
    const store = createTestStore();
    const bridge = EventProgressionBridge.getInstance();
    bridge.initialize(store);
    
    // @ts-ignore - mock for testing
    bridge.checkMilestoneEvents = jest.fn();
    
    const progressionManager = ProgressionManager.getInstance();
    
    bridge.update();
    
    // Should call check milestone events
    // @ts-ignore - accessing mocked function
    expect(bridge.checkMilestoneEvents).toHaveBeenCalled();
    // Should call progression manager
    expect(progressionManager.checkAllProgressionItems).toHaveBeenCalled();
  });
});