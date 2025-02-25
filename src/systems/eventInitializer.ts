import { store } from '../state/store';
import { EventManager } from './eventManager';
import { addEvents } from '../state/eventsSlice';
import { sampleEvents } from '../data/sampleEvents';

// Track initialization to prevent duplicate setup
let initialized = false;

/**
 * Initialize the event system with default events
 */
export function initializeEventSystem() {
  // Prevent multiple initializations which could cause update loops
  if (initialized) {
    console.log('Event system already initialized, skipping');
    return EventManager.getInstance();
  }
  
  console.log('Initializing event system...');
  
  // Register events in the store
  store.dispatch(addEvents(sampleEvents));
  
  // Initialize the EventManager
  const eventManager = EventManager.getInstance();
  eventManager.initialize(store);
  
  console.log(`Initialized event system with ${sampleEvents.length} events`);
  
  // Mark as initialized
  initialized = true;
  
  return eventManager;
}