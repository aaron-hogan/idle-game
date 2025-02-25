import { configureStore } from '@reduxjs/toolkit';
import resourcesReducer, { addResource } from '../../state/resourcesSlice';
import structuresReducer from '../../state/structuresSlice';
import gameReducer from '../../state/gameSlice';
import tasksReducer from '../../state/tasksSlice';
import eventsReducer, { addEvent, triggerEvent, resolveEvent, clearEventHistory } from '../../state/eventsSlice';
import { EventManager } from '../eventManager';
import { EventType, IEvent } from '../../interfaces/Event';
import { Resource } from '../../models/resource';

describe('EventManager', () => {
  // Mock store for testing
  const createTestStore = () => configureStore({
    reducer: {
      resources: resourcesReducer,
      structures: structuresReducer,
      game: gameReducer,
      tasks: tasksReducer,
      events: eventsReducer,
    }
  });
  
  // Create test event
  const createTestEvent = (overrides = {}): IEvent => ({
    id: 'test-event',
    title: 'Test Event',
    description: 'Event for testing',
    type: EventType.NOTIFICATION,
    conditions: [],
    priority: 10,
    seen: false,
    repeatable: false,
    ...overrides
  });
  
  // Test resource
  const testResource: Resource = {
    id: 'test-resource',
    name: 'Test Resource',
    description: 'A test resource',
    amount: 5,
    maxAmount: 100,
    unlocked: true,
    perSecond: 1,
    category: 'test'
  };
  
  // Test the EventManager initialization
  test('should initialize with a store', () => {
    const store = createTestStore();
    const eventManager = EventManager.getInstance();
    
    expect(() => eventManager.initialize(store)).not.toThrow();
  });
  
  // Test registering an event
  test('should register an event', () => {
    const store = createTestStore();
    const eventManager = EventManager.getInstance();
    eventManager.initialize(store);
    
    const testEvent = createTestEvent();
    eventManager.registerEvent(testEvent);
    
    const state = store.getState();
    expect(state.events.availableEvents[testEvent.id]).toEqual(testEvent);
  });
  
  // Test triggering an event
  test('should trigger an event', () => {
    const store = createTestStore();
    const eventManager = EventManager.getInstance();
    eventManager.initialize(store);
    
    const testEvent = createTestEvent();
    store.dispatch(addEvent(testEvent));
    
    const result = eventManager.triggerEvent(testEvent.id);
    expect(result).toBe(true);
    
    const state = store.getState();
    expect(state.events.activeEvents).toContain(testEvent.id);
    expect(state.events.availableEvents[testEvent.id].seen).toBe(true);
  });
  
  // Test resolving an event
  test('should resolve an event with a choice', () => {
    const store = createTestStore();
    const eventManager = EventManager.getInstance();
    eventManager.initialize(store);
    
    // Start with a clean event history
    store.dispatch(clearEventHistory());
    
    const testEvent = createTestEvent({
      choices: [
        { id: 'test-choice', text: 'Test Choice' }
      ]
    });
    
    store.dispatch(addEvent(testEvent));
    store.dispatch(triggerEvent(testEvent.id));
    
    const result = eventManager.resolveEvent(testEvent.id, 'test-choice');
    expect(result).toBe(true);
    
    const state = store.getState();
    expect(state.events.activeEvents).not.toContain(testEvent.id);
    
    // Find the event in the history
    const historyEntry = state.events.eventHistory.find(
      entry => entry.eventId === testEvent.id && entry.choiceId === 'test-choice'
    );
    expect(historyEntry).toBeDefined();
    expect(historyEntry?.eventId).toBe(testEvent.id);
    expect(historyEntry?.choiceId).toBe('test-choice');
  });
  
  // Test evaluating conditions
  test('should evaluate event conditions correctly', () => {
    const store = createTestStore();
    const eventManager = EventManager.getInstance();
    eventManager.initialize(store);
    
    // Add a test resource
    store.dispatch(addResource(testResource));
    
    // Create event with condition
    const testEvent = createTestEvent({
      conditions: [
        {
          type: 'resourceAmount',
          target: 'test-resource',
          value: 10,
          operator: '>='
        }
      ]
    });
    
    store.dispatch(addEvent(testEvent));
    
    // Check conditions - should be false initially
    let triggerable = eventManager.checkEventConditions();
    expect(triggerable).not.toContain(testEvent.id);
    
    // Update resource to meet condition
    store.dispatch({
      type: 'resources/updateResourceAmount',
      payload: {
        id: 'test-resource',
        amount: 15
      }
    });
    
    // Check conditions again - should be true now
    triggerable = eventManager.checkEventConditions();
    expect(triggerable).toContain(testEvent.id);
  });
  
  // Test applying consequences
  test('should apply event consequences correctly', () => {
    const store = createTestStore();
    const eventManager = EventManager.getInstance();
    eventManager.initialize(store);
    
    // Add a test resource
    store.dispatch(addResource(testResource));
    
    // Create event with consequence
    const testEvent = createTestEvent({
      consequences: [
        {
          type: 'addResource',
          target: 'test-resource',
          value: 10
        }
      ]
    });
    
    store.dispatch(addEvent(testEvent));
    
    // Trigger event to apply consequences
    eventManager.triggerEvent(testEvent.id);
    
    // Check if resource was increased
    const state = store.getState();
    expect(state.resources['test-resource'].amount).toBe(15);
  });
});