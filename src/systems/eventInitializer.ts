import { store } from '../state/store';
import { EventManager } from './eventManager';
import { addEvents } from '../state/eventsSlice';
import { sampleEvents } from '../data/sampleEvents';
import { antiCapitalistEvents } from '../data/events/antiCapitalistEvents';
import { ErrorLogger } from '../utils/errorUtils';

// Track initialization to prevent duplicate setup
let initialized = false;

/**
 * Initialize the event system with default events
 */
export function initializeEventSystem() {
  // Prevent multiple initializations which could cause update loops
  if (initialized) {
    // Always log this message but keep it minimal
    console.log('Event system already initialized, skipping');
    return EventManager.getInstance();
  }
  
  // Minimal initialization log
  console.log('Initializing event system...');
  
  try {
    // Register events in the store
    // First ensure the event structure is initialized in the state
    store.dispatch({ type: 'events/init' });
    
    // Then add sample demo events
    store.dispatch(addEvents(sampleEvents));
    
    // And finally the anti-capitalist themed events
    store.dispatch(addEvents(antiCapitalistEvents));
    
    // Import necessary action creators
    const eventActions = require('../state/eventsSlice');
    
    // Initialize the EventManager with dependencies
    const eventManager = EventManager.getInstance({
      dispatch: store.dispatch,
      getState: store.getState,
      actions: {
        addEvent: eventActions.addEvent,
        addEvents: eventActions.addEvents,
        triggerEvent: eventActions.triggerEvent,
        resolveEvent: eventActions.resolveEvent,
        updateEvent: eventActions.updateEvent
      }
    });
    
    // Register with GameLoop for periodic event checks
    const gameLoop = require('../core/GameLoop').GameLoop.getInstance();
    gameLoop.registerCallback('eventManager', () => eventManager.processEvents());
    
    const totalEvents = sampleEvents.length + antiCapitalistEvents.length;
    // Simple log message with event counts
    console.log(`Initialized event system with ${totalEvents} events (${sampleEvents.length} sample, ${antiCapitalistEvents.length} themed)`);
    
    // Mark as initialized
    initialized = true;
    
    return eventManager;
  } catch (error) {
    const logger = ErrorLogger.getInstance();
    logger.logError(
      error instanceof Error ? error : new Error(String(error)),
      'initializeEventSystem'
    );
    console.error('Failed to initialize event system:', error);
    return EventManager.getInstance();
  }
}