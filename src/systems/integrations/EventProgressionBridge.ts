/**
 * EventProgressionBridge
 * 
 * Bridge component that coordinates interaction between the EventManager and ProgressionManager
 * Ensures that game events trigger progression updates and progression changes create appropriate events
 */

import { Store } from '@reduxjs/toolkit';
import { RootState } from '../../state/store';
import { EventManager } from '../eventManager';
import { ProgressionManager } from '../../managers/progression/ProgressionManager';
import { IEvent, EventType, EventCategory, EventStatus } from '../../interfaces/Event';
import { GameStage, Milestone } from '../../interfaces/progression';
import { ErrorLogger } from '../../utils/errorUtils';
import { getCurrentTime } from '../../utils/timeUtils';

/**
 * Bridge between Event and Progression systems
 */
export class EventProgressionBridge {
  private static instance: EventProgressionBridge | null = null;
  private store: Store<RootState> | null = null;
  private eventManager: EventManager | null = null;
  private progressionManager: ProgressionManager | null = null;
  private logger = ErrorLogger.getInstance();
  private initialized = false;
  private previousGameStage: GameStage | null = null;
  private lastProgressionCheck = 0;

  /**
   * Private constructor to enforce singleton pattern
   */
  private constructor() {}

  /**
   * Get or create the singleton instance
   */
  public static getInstance(): EventProgressionBridge {
    if (!EventProgressionBridge.instance) {
      EventProgressionBridge.instance = new EventProgressionBridge();
    }
    return EventProgressionBridge.instance;
  }

  /**
   * Initialize the bridge with the store and managers
   * @param store Redux store
   * @returns Whether initialization was successful
   */
  public initialize(store: Store<RootState>): boolean {
    try {
      this.store = store;
      this.eventManager = EventManager.getInstance();
      this.progressionManager = ProgressionManager.getInstance();

      // Initialize progression manager if needed
      if (this.progressionManager) {
        this.progressionManager.initialize(store);
      }

      // Initialize event manager if needed
      const eventActions = require('../../state/eventsSlice');
      this.eventManager = EventManager.getInstance({
        dispatch: store.dispatch,
        getState: store.getState,
        actions: {
          addEvent: eventActions.addEvent,
          addEvents: eventActions.addEvents,
          triggerEvent: eventActions.triggerEvent,
          resolveEvent: eventActions.resolveEvent,
          updateEvent: eventActions.updateEvent,
        },
      });

      // Get the current game stage
      const state = store.getState();
      this.previousGameStage = state.progression.currentStage;
      
      // Register with game loop to periodically check for progression updates
      this.registerWithGameLoop();
      
      this.initialized = true;
      
      console.log('EventProgressionBridge initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize EventProgressionBridge:', error);
      return false;
    }
  }

  /**
   * Ensure the bridge is properly initialized
   * @throws Error if not initialized
   */
  private ensureInitialized(): void {
    if (!this.initialized || !this.store || !this.eventManager || !this.progressionManager) {
      throw new Error('EventProgressionBridge not properly initialized');
    }
  }

  /**
   * Register with game loop to periodically check progression
   */
  private registerWithGameLoop(): void {
    try {
      const gameLoop = require('../../core/GameLoop').GameLoop.getInstance();
      gameLoop.registerCallback('eventProgressionBridge', () => this.update());
    } catch (error) {
      this.logger.logError(
        error instanceof Error ? error : new Error(String(error)),
        'EventProgressionBridge.registerWithGameLoop'
      );
    }
  }

  /**
   * Update method called by game loop
   * Checks for progression changes and triggers appropriate events
   */
  public update(): void {
    try {
      this.ensureInitialized();
      
      const currentTime = Date.now();
      
      // Throttle checks to avoid excessive processing
      if (currentTime - this.lastProgressionCheck < 2000) {
        return;
      }
      
      this.lastProgressionCheck = currentTime;
      
      // Get current game state
      const state = this.store!.getState();
      const currentGameStage = state.progression.currentStage;
      
      // Check if game stage changed
      if (currentGameStage !== this.previousGameStage) {
        this.handleGameStageChange(currentGameStage);
        this.previousGameStage = currentGameStage;
      }
      
      // Check all progression items
      this.progressionManager!.checkAllProgressionItems();
      
      // Check for milestone-related events
      this.checkMilestoneEvents();
    } catch (error) {
      this.logger.logError(
        error instanceof Error ? error : new Error(String(error)),
        'EventProgressionBridge.update'
      );
    }
  }

  /**
   * Handle game stage change by triggering appropriate events
   * @param newStage The new game stage
   */
  private handleGameStageChange(newStage: GameStage): void {
    try {
      this.ensureInitialized();
      
      // Create and trigger a stage change event
      const stageChangeEvent = this.createStageChangeEvent(newStage);
      this.eventManager!.registerEvent(stageChangeEvent);
      this.eventManager!.triggerEvent(stageChangeEvent.id);
      
      console.log(`Game stage changed to ${newStage}, triggered event ${stageChangeEvent.id}`);
    } catch (error) {
      this.logger.logError(
        error instanceof Error ? error : new Error(String(error)),
        'EventProgressionBridge.handleGameStageChange'
      );
    }
  }

  /**
   * Create an event for a stage change
   * @param stage The new game stage
   * @returns Stage change event
   */
  private createStageChangeEvent(stage: GameStage): IEvent {
    const eventId = `stage-change-${stage.toLowerCase()}-${Date.now()}`;
    
    let title: string;
    let description: string;
    
    switch (stage) {
      case GameStage.MID:
        title = 'Movement Growing';
        description = 'Your movement is gaining momentum! More people are joining your cause, and corporate powers are starting to take notice.';
        break;
      case GameStage.LATE:
        title = 'Movement in Full Force';
        description = 'Your movement has become a significant force for change. Corporate resistance is intensifying, but so is community support.';
        break;
      case GameStage.END_GAME:
        title = 'Final Confrontation';
        description = 'The final confrontation approaches. Your movement stands at a crossroads - will you succeed in creating lasting change or be overwhelmed by corporate oppression?';
        break;
      default:
        title = 'Movement Evolving';
        description = 'Your movement is evolving to a new stage. Keep organizing and building collective power!';
    }
    
    return {
      id: eventId,
      title,
      description,
      type: EventType.STORY,
      category: EventCategory.STORY,
      status: EventStatus.PENDING,
      conditions: [],
      priority: 100, // High priority
      seen: false,
      repeatable: false,
      choices: [
        {
          id: 'continue',
          text: 'Continue the struggle',
        }
      ],
    };
  }

  /**
   * Check for milestone-related events
   */
  private checkMilestoneEvents(): void {
    try {
      this.ensureInitialized();
      
      const state = this.store!.getState();
      const recentlyCompletedMilestones = this.getRecentlyCompletedMilestones(state);
      
      // Trigger events for recently completed milestones
      for (const milestone of recentlyCompletedMilestones) {
        this.triggerMilestoneEvent(milestone);
      }
    } catch (error) {
      this.logger.logError(
        error instanceof Error ? error : new Error(String(error)),
        'EventProgressionBridge.checkMilestoneEvents'
      );
    }
  }

  /**
   * Get milestones that were recently completed
   * @param state Current Redux state
   * @returns Array of recently completed milestones
   */
  private getRecentlyCompletedMilestones(state: RootState): Milestone[] {
    // Define "recent" as completed in the last 10 seconds
    const recentThreshold = Date.now() - 10000;
    
    return Object.values(state.progression.milestones).filter(
      (milestone) => 
        milestone.completed && 
        milestone.completedAt && 
        milestone.completedAt > recentThreshold
    );
  }

  /**
   * Trigger an event for a completed milestone
   * @param milestone The completed milestone
   */
  private triggerMilestoneEvent(milestone: Milestone): void {
    try {
      this.ensureInitialized();
      
      // Check if an event already exists for this milestone
      const eventId = `milestone-${milestone.id}`;
      const state = this.store!.getState();
      
      if (state.events.availableEvents[eventId]) {
        // Event exists, trigger it if not already triggered
        if (!state.events.availableEvents[eventId].seen) {
          this.eventManager!.triggerEvent(eventId);
        }
        return;
      }
      
      // Create and register new milestone event
      const milestoneEvent = this.createMilestoneEvent(milestone);
      this.eventManager!.registerEvent(milestoneEvent);
      this.eventManager!.triggerEvent(milestoneEvent.id);
      
      console.log(`Triggered event for milestone: ${milestone.name}`);
    } catch (error) {
      this.logger.logError(
        error instanceof Error ? error : new Error(String(error)),
        'EventProgressionBridge.triggerMilestoneEvent'
      );
    }
  }

  /**
   * Create an event for a completed milestone
   * @param milestone The completed milestone
   * @returns Milestone completion event
   */
  private createMilestoneEvent(milestone: Milestone): IEvent {
    return {
      id: `milestone-${milestone.id}`,
      title: `Milestone: ${milestone.name}`,
      description: `${milestone.description}\n\n${this.formatMilestoneRewards(milestone)}`,
      type: EventType.ACHIEVEMENT,
      category: EventCategory.OPPORTUNITY,
      status: EventStatus.PENDING,
      conditions: [],
      priority: 90, // High priority but below stage changes
      seen: false,
      repeatable: false,
      choices: [
        {
          id: 'acknowledge',
          text: 'Acknowledge',
        }
      ],
    };
  }

  /**
   * Format milestone rewards for display in event description
   * @param milestone The milestone with rewards
   * @returns Formatted rewards text
   */
  private formatMilestoneRewards(milestone: Milestone): string {
    if (!milestone.rewards || milestone.rewards.length === 0) {
      return '';
    }
    
    let rewardsText = 'Rewards:\n';
    
    milestone.rewards.forEach(reward => {
      rewardsText += `• ${reward.description}\n`;
    });
    
    return rewardsText;
  }

  /**
   * Create and trigger a special event for approaching win condition
   * Should be called when player reaches 80% of win threshold
   */
  public triggerApproachingVictoryEvent(): void {
    try {
      this.ensureInitialized();
      
      const eventId = 'approaching-victory';
      const state = this.store!.getState();
      
      // Don't trigger if already seen
      if (state.events.availableEvents[eventId]?.seen) {
        return;
      }
      
      const approachingVictoryEvent: IEvent = {
        id: eventId,
        title: 'Victory Within Reach',
        description: 
          'Your movement has reached a critical mass. Corporate resistance is fierce, but your collective power grows stronger every day. Victory is within reach - stay focused and continue building solidarity!',
        type: EventType.STORY,
        category: EventCategory.OPPORTUNITY,
        status: EventStatus.PENDING,
        conditions: [],
        priority: 95,
        seen: false,
        repeatable: false,
        choices: [
          {
            id: 'push-forward',
            text: 'Push forward to victory',
          }
        ],
      };
      
      this.eventManager!.registerEvent(approachingVictoryEvent);
      this.eventManager!.triggerEvent(eventId);
    } catch (error) {
      this.logger.logError(
        error instanceof Error ? error : new Error(String(error)),
        'EventProgressionBridge.triggerApproachingVictoryEvent'
      );
    }
  }

  /**
   * Create and trigger a special event for approaching lose condition
   * Should be called when oppression reaches dangerous levels
   */
  public triggerApproachingDefeatEvent(): void {
    try {
      this.ensureInitialized();
      
      const eventId = 'approaching-defeat';
      const state = this.store!.getState();
      
      // Don't trigger if already seen recently
      const recentThreshold = Date.now() - 300000; // 5 minutes
      const event = state.events.availableEvents[eventId];
      
      if (event?.seen && event.lastTriggered && event.lastTriggered > recentThreshold) {
        return;
      }
      
      const approachingDefeatEvent: IEvent = {
        id: eventId,
        title: 'Movement Under Threat',
        description: 
          'Corporate oppression is intensifying against your movement. Key organizers are being targeted, and community support is wavering under pressure. You must act quickly to rebuild solidarity and collective power!',
        type: EventType.STORY,
        category: EventCategory.CRISIS,
        status: EventStatus.PENDING,
        conditions: [],
        priority: 99, // Very high priority
        seen: false,
        repeatable: true, // Can repeat if player continues to approach defeat
        cooldown: 300, // 5 minute cooldown
        choices: [
          {
            id: 'regroup',
            text: 'Regroup and organize',
            consequences: [
              {
                type: 'addResource',
                target: 'collective-power',
                value: 20,
              },
              {
                type: 'addResource',
                target: 'oppression',
                value: -10,
              }
            ]
          }
        ],
      };
      
      this.eventManager!.registerEvent(approachingDefeatEvent);
      this.eventManager!.triggerEvent(eventId);
    } catch (error) {
      this.logger.logError(
        error instanceof Error ? error : new Error(String(error)),
        'EventProgressionBridge.triggerApproachingDefeatEvent'
      );
    }
  }

  /**
   * Check resource levels and trigger appropriate events
   * This should be called regularly to monitor win/lose proximity
   */
  public checkWinLoseProximity(): void {
    try {
      this.ensureInitialized();
      
      const state = this.store!.getState();
      const resources = state.resources;
      
      // Handle both old (byId) and new (flat) resource structure
      const power = resources.byId
        ? resources.byId['collective-power']
        : resources['collective-power'];
      
      const oppression = resources.byId
        ? resources.byId['oppression']
        : resources['oppression'];
      
      if (!power || !oppression) {
        return;
      }
      
      // Get game balance settings
      const gameEndConditions = require('../../config/gameBalance').GameEndConditions;
      const powerThreshold = gameEndConditions.WIN.POWER_THRESHOLD;
      const oppressionRatio = gameEndConditions.LOSE.OPPRESSION_POWER_RATIO;
      
      // Check for approaching victory
      if (power.amount >= powerThreshold * 0.8) {
        this.triggerApproachingVictoryEvent();
      }
      
      // Check for approaching defeat
      if (oppression.amount >= power.amount * (oppressionRatio * 0.8)) {
        this.triggerApproachingDefeatEvent();
      }
    } catch (error) {
      this.logger.logError(
        error instanceof Error ? error : new Error(String(error)),
        'EventProgressionBridge.checkWinLoseProximity'
      );
    }
  }
}