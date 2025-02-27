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
    // Suppress log message in production
    if (process.env.NODE_ENV === 'development' && process.env.DEBUG_LOGS === 'true') {
      console.log('Event system already initialized, skipping');
    }
    return EventManager.getInstance();
  }
  
  // Only log in development when debugging
  if (process.env.NODE_ENV === 'development' && process.env.DEBUG_LOGS === 'true') {
    console.log('Initializing event system...');
  }
  
  try {
    // Register events in the store
    // First the sample demo events
    store.dispatch(addEvents(sampleEvents));
    
    // Then the anti-capitalist themed events
    store.dispatch(addEvents(antiCapitalistEvents));
    
    // Initialize the EventManager
    const eventManager = EventManager.getInstance();
    eventManager.initialize(store);
    
    const totalEvents = sampleEvents.length + antiCapitalistEvents.length;
    // Only log in development when debugging
    if (process.env.NODE_ENV === 'development' && process.env.DEBUG_LOGS === 'true') {
      console.log(`Initialized event system with ${totalEvents} events (${sampleEvents.length} sample, ${antiCapitalistEvents.length} themed)`);
    }
    
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