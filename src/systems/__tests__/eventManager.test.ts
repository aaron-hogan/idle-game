import { configureStore } from '@reduxjs/toolkit';
import resourcesReducer, { addResource, addResourceAmount } from '../../state/resourcesSlice';
import structuresReducer from '../../state/structuresSlice';
import gameReducer from '../../state/gameSlice';
import tasksReducer from '../../state/tasksSlice';
import eventsReducer, { 
  addEvent, 
  addEvents, 
  triggerEvent, 
  resolveEvent, 
  clearEventHistory,
  updateEvent 
} from '../../state/eventsSlice';
import progressionReducer from '../../redux/progressionSlice';
import tutorialReducer from '../../state/tutorialSlice';
import { EventManager } from '../eventManager';
import { EventType, IEvent, EventCategory, EventStatus } from '../../interfaces/Event';
import { Resource } from '../../models/resource';
import { GameStage } from '../../interfaces/progression';

describe('EventManager', () => {
  // Mock store for testing
  const createTestStore = () => configureStore({
    reducer: {
      resources: resourcesReducer,
      structures: structuresReducer,
      game: gameReducer,
      tasks: tasksReducer,
      events: eventsReducer,
      progression: progressionReducer,
      tutorial: tutorialReducer
    },
    preloadedState: {
      events: {
        availableEvents: {},
        activeEvents: [],
        eventHistory: []
      },
      resources: {}
    }
  });
  
  // Create test event
  const createTestEvent = (overrides = {}): IEvent => ({
    id: 'test-event',
    title: 'Test Event',
    description: 'Event for testing',
    type: EventType.NOTIFICATION,
    category: EventCategory.RANDOM,
    status: EventStatus.PENDING,
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
  
  // Helper function to create properly initialized EventManager
  const createEventManager = (store: ReturnType<typeof createTestStore>) => {
    const eventActions = require('../../state/eventsSlice');
    
    // Reset the singleton instance
    // @ts-ignore - accessing private property for testing
    EventManager.instance = null;
    
    // Create with proper dependencies
    return EventManager.getInstance({
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
  };

  // Reset singleton before each test
  beforeEach(() => {
    // Reset the EventManager instance to get a clean state
    // @ts-ignore - accessing private property for testing
    EventManager.instance = null;
    
    jest.clearAllMocks();
  });
  
  // Test initialization with dependencies
  test('should initialize with dependencies', () => {
    const store = createTestStore();
    const eventActions = require('../../state/eventsSlice');
    const eventManager = createEventManager(store);
    
    // Check that it was properly initialized
    expect((eventManager as any).actions).toBeDefined();
    expect((eventManager as any).actions.addEvent).toBe(eventActions.addEvent);
    expect((eventManager as any).actions.triggerEvent).toBe(eventActions.triggerEvent);
    expect((eventManager as any).actions.resolveEvent).toBe(eventActions.resolveEvent);
    expect((eventManager as any).initialized).toBe(true);
  });
  
  // Test registering an event
  test('should register an event', () => {
    const store = createTestStore();
    const eventManager = createEventManager(store);
    
    // Create a test event
    const testEvent = createTestEvent();
    
    // Register the event
    eventManager.registerEvent(testEvent);
    
    // Verify the event was added to the state
    const state = store.getState();
    expect(state.events.availableEvents[testEvent.id]).toEqual(testEvent);
  });
  
  // Test event factory method
  test('should create an event with factory method', () => {
    const store = createTestStore();
    const eventManager = createEventManager(store);
    
    // Create a partial event
    const partialEvent = {
      title: 'Factory Event',
      description: 'Created with factory method',
      type: EventType.NOTIFICATION,
      category: EventCategory.RANDOM,
    };
    
    // Use factory method to create full event
    const createdEvent = eventManager.createEvent(partialEvent);
    
    // Check that it has all required fields
    expect(createdEvent.id).toBeDefined();
    expect(createdEvent.title).toBe(partialEvent.title);
    expect(createdEvent.type).toBe(partialEvent.type);
    expect(createdEvent.category).toBe(partialEvent.category);
    expect(createdEvent.status).toBe(EventStatus.PENDING);
    expect(createdEvent.priority).toBeDefined();
    expect(createdEvent.seen).toBe(false);
    expect(createdEvent.repeatable).toBeDefined();
  });
  
  // Test triggering an event
  test('should trigger an event', () => {
    const store = createTestStore();
    const eventManager = createEventManager(store);
    
    const testEvent = createTestEvent();
    store.dispatch(addEvent(testEvent));
    
    const result = eventManager.triggerEvent(testEvent.id);
    expect(result).toBe(true);
    
    const state = store.getState();
    expect(state.events.activeEvents).toContain(testEvent.id);
    expect(state.events.availableEvents[testEvent.id].seen).toBe(true);
    expect(state.events.availableEvents[testEvent.id].status).toBe(EventStatus.ACTIVE);
  });
  
  // Test resolving an event
  test('should resolve an event with a choice', () => {
    const store = createTestStore();
    const eventManager = createEventManager(store);
    
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
    expect(state.events.availableEvents[testEvent.id].status).toBe(EventStatus.RESOLVED);
    
    // Find the event in the history
    const historyEntry = state.events.eventHistory.find(
      entry => entry.eventId === testEvent.id && entry.choiceId === 'test-choice'
    );
    expect(historyEntry).toBeDefined();
    expect(historyEntry?.eventId).toBe(testEvent.id);
    expect(historyEntry?.choiceId).toBe('test-choice');
  });
  
  // Test expiring an event
  test('should expire an event', () => {
    const store = createTestStore();
    const eventManager = createEventManager(store);
    
    const testEvent = createTestEvent();
    store.dispatch(addEvent(testEvent));
    eventManager.triggerEvent(testEvent.id);
    
    // Expire the event
    const result = eventManager.expireEvent(testEvent.id);
    expect(result).toBe(true);
    
    // Check that it's expired
    const state = store.getState();
    expect(state.events.activeEvents).not.toContain(testEvent.id);
    expect(state.events.availableEvents[testEvent.id].status).toBe(EventStatus.EXPIRED);
  });
  
  // Test evaluating conditions
  test('should evaluate event conditions correctly', () => {
    const store = createTestStore();
    const eventManager = createEventManager(store);
    
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
    store.dispatch(addResourceAmount({
      id: 'test-resource',
      amount: 10
    }));
    
    // Check conditions again - should be true now
    triggerable = eventManager.checkEventConditions();
    expect(triggerable).toContain(testEvent.id);
  });
  
  // Test applying consequences
  test('should apply event consequences correctly', () => {
    const store = createTestStore();
    const eventManager = createEventManager(store);
    
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
  
  // Test that events with choices don't auto-resolve
  test('should not auto-resolve events with choices', () => {
    jest.useFakeTimers();
    
    const store = createTestStore();
    const eventManager = createEventManager(store);
    
    const testEvent = createTestEvent({
      choices: [
        { id: 'choice1', text: 'Choice 1' },
        { id: 'choice2', text: 'Choice 2' }
      ]
    });
    
    store.dispatch(addEvent(testEvent));
    eventManager.triggerEvent(testEvent.id);
    
    // Fast-forward time
    jest.advanceTimersByTime(10000);
    
    // Event should still be active
    const state = store.getState();
    expect(state.events.activeEvents).toContain(testEvent.id);
    
    jest.useRealTimers();
  });
  
  // Test healing inconsistencies
  test('should heal event state inconsistencies', () => {
    const store = createTestStore();
    const eventManager = createEventManager(store);
    
    // Create an inconsistent state with manual dispatch
    // Event with ACTIVE status but not in active list
    const inconsistentEvent = createTestEvent({
      id: 'inconsistent-event',
      status: EventStatus.ACTIVE
    });
    
    store.dispatch(addEvent(inconsistentEvent));
    
    // Run the heal method
    // @ts-ignore - accessing private method for testing
    eventManager.healEventInconsistencies();
    
    // Check if inconsistencies were fixed
    const state = store.getState();
    
    // Either the event should be in active list, or its status should be PENDING
    const fixedEvent = state.events.availableEvents['inconsistent-event'];
    const isFixed = (
      (state.events.activeEvents.includes('inconsistent-event') && fixedEvent.status === EventStatus.ACTIVE) ||
      (!state.events.activeEvents.includes('inconsistent-event') && fixedEvent.status === EventStatus.PENDING)
    );
    expect(isFixed).toBe(true);
  });
});