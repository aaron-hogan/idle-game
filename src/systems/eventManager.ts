import { Store } from '@reduxjs/toolkit';
import { RootState } from '../state/store';
import { 
  IEvent, 
  EventCondition, 
  EventConsequence, 
  EventChoice 
} from '../interfaces/Event';
import { getCurrentTime } from '../utils/timeUtils';
import { ErrorLogger, invariant } from '../utils/errorUtils';
import { 
  addEvent, 
  triggerEvent as triggerEventAction, 
  resolveEvent as resolveEventAction 
} from '../state/eventsSlice';

/**
 * Manages game events and conditions
 */
export class EventManager {
  private static instance: EventManager | null = null;
  private store: Store<RootState> | null = null;
  private logger = ErrorLogger.getInstance();
  private initialized = false;

  /**
   * Private constructor for singleton pattern
   */
  private constructor() {}

  /**
   * Get the singleton instance of EventManager
   */
  public static getInstance(): EventManager {
    if (!EventManager.instance) {
      EventManager.instance = new EventManager();
    }
    return EventManager.instance;
  }

  /**
   * Initialize the event manager with a store
   * @param store The Redux store
   */
  public initialize(store: Store<RootState>): void {
    this.store = store;
    this.initialized = true;
  }

  /**
   * Ensure the manager is properly initialized
   * @throws Error if not initialized
   */
  private ensureInitialized(): void {
    invariant(
      this.initialized && this.store !== null,
      'EventManager not properly initialized with Redux store',
      'EventManager'
    );
  }

  /**
   * Register a new event with the system
   * @param event The event to register
   */
  public registerEvent(event: IEvent): void {
    try {
      this.ensureInitialized();
      this.store!.dispatch(addEvent(event));
    } catch (error) {
      this.logger.logError(
        error instanceof Error ? error : new Error(String(error)),
        'EventManager.registerEvent'
      );
    }
  }

  /**
   * Check which events can be triggered based on current game state
   * @returns Array of event IDs that can be triggered
   */
  public checkEventConditions(): string[] {
    try {
      this.ensureInitialized();
      const state = this.store!.getState();
      const events = state.events.availableEvents;
      const currentTime = getCurrentTime();
      
      const triggerable: string[] = [];
      
      // Check each event's conditions
      Object.values(events).forEach(event => {
        // Skip events that are already active
        if (state.events.activeEvents.some(activeId => activeId === event.id)) {
          return;
        }
        
        // Skip non-repeatable events that have been seen
        if (!event.repeatable && event.seen) {
          return;
        }
        
        // Check cooldown for repeatable events
        if (event.repeatable && event.lastTriggered && event.cooldown) {
          const timeSinceLastTrigger = (currentTime - event.lastTriggered) / 1000;
          if (timeSinceLastTrigger < event.cooldown) {
            return;
          }
        }
        
        // Check if all conditions are met
        const conditionsMet = this.evaluateConditions(event.conditions);
        if (conditionsMet) {
          triggerable.push(event.id);
        }
      });
      
      return triggerable;
    } catch (error) {
      this.logger.logError(
        error instanceof Error ? error : new Error(String(error)),
        'EventManager.checkEventConditions'
      );
      return [];
    }
  }

  /**
   * Evaluate a list of conditions against the current game state
   * @param conditions The conditions to evaluate
   * @returns Whether all conditions are met
   */
  private evaluateConditions(conditions: EventCondition[]): boolean {
    try {
      this.ensureInitialized();
      const state = this.store!.getState();
      
      // If no conditions, event is always triggerable
      if (!conditions || conditions.length === 0) {
        return true;
      }
      
      // Check all conditions - all must be true
      return conditions.every(condition => {
        const operator = condition.operator || '>=';
        
        switch (condition.type) {
          case 'resourceAmount': {
            const resourceId = condition.target;
            if (!resourceId) return false;
            
            const resource = state.resources[resourceId];
            if (!resource) return false;
            
            const amount = resource.amount;
            return this.compareValues(amount, condition.value, operator);
          }
          
          case 'structureCount': {
            const structureId = condition.target;
            if (!structureId) return false;
            
            const structure = state.structures[structureId];
            if (!structure) return false;
            
            // Use level instead of count for structures
            const level = structure.level;
            return this.compareValues(level, condition.value, operator);
          }
          
          case 'gameTime': {
            const gameTime = state.game.totalPlayTime;
            return this.compareValues(gameTime, condition.value, operator);
          }
          
          case 'gameStage': {
            const gameStage = state.game.gameStage;
            return this.compareValues(gameStage, condition.value, operator);
          }
          
          default:
            return false;
        }
      });
    } catch (error) {
      this.logger.logError(
        error instanceof Error ? error : new Error(String(error)),
        'EventManager.evaluateConditions'
      );
      return false;
    }
  }

  /**
   * Compare two values using the specified operator
   * @param a First value
   * @param b Second value
   * @param operator Comparison operator
   * @returns Result of the comparison
   */
  private compareValues(a: number, b: number, operator: string): boolean {
    switch (operator) {
      case '>=': return a >= b;
      case '>': return a > b;
      case '=': return a === b;
      case '<': return a < b;
      case '<=': return a <= b;
      default: return false;
    }
  }

  /**
   * Trigger a specific event
   * @param eventId The ID of the event to trigger
   * @returns Whether the event was triggered successfully
   */
  public triggerEvent(eventId: string): boolean {
    try {
      this.ensureInitialized();
      const state = this.store!.getState();
      const event = state.events.availableEvents[eventId];
      
      // Validate event exists
      if (!event) {
        console.warn(`Event with ID ${eventId} not found`);
        return false;
      }
      
      // Check if event is already active
      if (state.events.activeEvents.includes(eventId)) {
        console.warn(`Event with ID ${eventId} is already active`);
        return false;
      }
      
      // Trigger the event
      this.store!.dispatch(triggerEventAction(eventId));
      
      // If the event has no choices, apply consequences immediately
      if (!event.choices || event.choices.length === 0) {
        this.applyConsequences(event.consequences || []);
      }
      
      return true;
    } catch (error) {
      this.logger.logError(
        error instanceof Error ? error : new Error(String(error)),
        'EventManager.triggerEvent'
      );
      return false;
    }
  }

  /**
   * Resolve an event with a player choice
   * @param eventId The ID of the event to resolve
   * @param choiceId The ID of the choice made
   * @returns Whether the event was resolved successfully
   */
  public resolveEvent(eventId: string, choiceId: string): boolean {
    try {
      this.ensureInitialized();
      const state = this.store!.getState();
      const event = state.events.availableEvents[eventId];
      
      // Validate event exists and is active
      if (!event) {
        console.warn(`Event with ID ${eventId} not found`);
        return false;
      }
      
      if (!state.events.activeEvents.includes(eventId)) {
        console.warn(`Event with ID ${eventId} is not active`);
        return false;
      }
      
      // Find the selected choice
      const choice = event.choices?.find(c => c.id === choiceId);
      if (!choice) {
        console.warn(`Choice with ID ${choiceId} not found in event ${eventId}`);
        return false;
      }
      
      // Apply choice consequences
      if (choice.consequences && choice.consequences.length > 0) {
        this.applyConsequences(choice.consequences);
      }
      
      // Resolve the event
      this.store!.dispatch(resolveEventAction({ eventId, choiceId }));
      
      // Trigger next event if specified
      if (choice.nextEventId) {
        setTimeout(() => {
          this.triggerEvent(choice.nextEventId!);
        }, 500); // Short delay for better UX
      }
      
      return true;
    } catch (error) {
      this.logger.logError(
        error instanceof Error ? error : new Error(String(error)),
        'EventManager.resolveEvent'
      );
      return false;
    }
  }

  /**
   * Apply a set of consequences to the game state
   * @param consequences The consequences to apply
   */
  private applyConsequences(consequences: EventConsequence[]): void {
    try {
      this.ensureInitialized();
      const state = this.store!.getState();
      
      consequences.forEach(consequence => {
        switch (consequence.type) {
          case 'addResource': {
            // Import action creator directly from resourcesSlice
            const { addResourceAmount } = require('../state/resourcesSlice');
            this.store!.dispatch(addResourceAmount({
              id: consequence.target,
              amount: consequence.value as number
            }));
            break;
          }
          
          case 'unlockStructure': {
            // Import action creator from structuresSlice
            const { toggleStructureUnlocked } = require('../state/structuresSlice');
            this.store!.dispatch(toggleStructureUnlocked({
              id: consequence.target,
              unlocked: true
            }));
            break;
          }
          
          case 'setGameStage': {
            // Import action creator from gameSlice
            const { setGameStage } = require('../state/gameSlice');
            this.store!.dispatch(setGameStage(consequence.value as number));
            break;
          }
          
          default:
            console.warn(`Unknown consequence type: ${consequence.type}`);
        }
      });
    } catch (error) {
      this.logger.logError(
        error instanceof Error ? error : new Error(String(error)),
        'EventManager.applyConsequences'
      );
    }
  }

  /**
   * Get active events, sorted by priority
   * @returns Array of active events sorted by priority
   */
  public getActiveEvents(): IEvent[] {
    try {
      this.ensureInitialized();
      const state = this.store!.getState();
      
      return state.events.activeEvents
        .map(id => state.events.availableEvents[id])
        .filter(Boolean)
        .sort((a, b) => b.priority - a.priority);
    } catch (error) {
      this.logger.logError(
        error instanceof Error ? error : new Error(String(error)),
        'EventManager.getActiveEvents'
      );
      return [];
    }
  }

  /**
   * Get all available events
   * @returns Object containing all registered events
   */
  public getAllEvents(): Record<string, IEvent> {
    try {
      this.ensureInitialized();
      const state = this.store!.getState();
      return state.events.availableEvents;
    } catch (error) {
      this.logger.logError(
        error instanceof Error ? error : new Error(String(error)),
        'EventManager.getAllEvents'
      );
      return {};
    }
  }

  // Track last process time to prevent too frequent checks
  private lastProcessTime: number = 0;
  
  /**
   * Check for events that can be triggered and do so if appropriate
   * This should be called regularly by the game loop
   */
  public processEvents(): void {
    try {
      this.ensureInitialized();
      
      // Throttle event processing to prevent excessive updates
      const currentTime = Date.now();
      const timeSinceLastProcess = currentTime - this.lastProcessTime;
      
      // Only process events every 2 seconds (2000ms) at most
      if (timeSinceLastProcess < 2000) {
        return;
      }
      
      // Update last process time
      this.lastProcessTime = currentTime;
      
      const state = this.store!.getState();
      
      // If there are already active events that require player input, don't trigger new ones
      const activeEvents = this.getActiveEvents();
      const hasChoiceEvents = activeEvents.some(event => event.choices && event.choices.length > 0);
      
      if (hasChoiceEvents) {
        return;
      }
      
      // Check for triggerable events
      const triggerableEvents = this.checkEventConditions();
      
      // Sort by priority and trigger one event at a time
      if (triggerableEvents.length > 0) {
        // Get the events and sort by priority
        const events = triggerableEvents
          .map(id => state.events.availableEvents[id])
          .filter(Boolean)
          .sort((a, b) => b.priority - a.priority);
        
        // Trigger the highest priority event
        if (events.length > 0) {
          this.triggerEvent(events[0].id);
        }
      }
    } catch (error) {
      this.logger.logError(
        error instanceof Error ? error : new Error(String(error)),
        'EventManager.processEvents'
      );
    }
  }
}