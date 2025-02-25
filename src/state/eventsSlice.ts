import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IEvent } from '../interfaces/Event';
import { getCurrentTime } from '../utils/timeUtils';

/**
 * State interface for the events slice
 */
interface EventsState {
  /** All registered events, indexed by ID */
  availableEvents: Record<string, IEvent>;
  
  /** IDs of currently active events */
  activeEvents: string[];
  
  /** History of past events */
  eventHistory: {
    eventId: string;
    timestamp: number;
    choiceId?: string;
  }[];
}

/**
 * Initial state for the events slice
 */
const initialState: EventsState = {
  availableEvents: {},
  activeEvents: [],
  eventHistory: [],
};

/**
 * Redux slice for events
 */
const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    /**
     * Add a new event to the available events
     */
    addEvent: (state, action: PayloadAction<IEvent>) => {
      const event = action.payload;
      
      // Ensure unique ID
      if (state.availableEvents[event.id]) {
        console.warn(`Event with ID ${event.id} already exists, will be overwritten`);
      }
      
      // Add to available events
      state.availableEvents[event.id] = event;
    },
    
    /**
     * Add multiple events at once
     */
    addEvents: (state, action: PayloadAction<IEvent[]>) => {
      const events = action.payload;
      
      events.forEach(event => {
        state.availableEvents[event.id] = event;
      });
    },
    
    /**
     * Trigger an event
     */
    triggerEvent: (state, action: PayloadAction<string>) => {
      const eventId = action.payload;
      
      // Ensure event exists
      if (!state.availableEvents[eventId]) {
        console.warn(`Cannot trigger event ${eventId} - not found`);
        return;
      }
      
      // Add to active events if not already there
      if (!state.activeEvents.includes(eventId)) {
        state.activeEvents.push(eventId);
      }
      
      // Mark as seen and update last triggered time
      state.availableEvents[eventId] = {
        ...state.availableEvents[eventId],
        seen: true,
        lastTriggered: getCurrentTime(),
      };
      
      // Add to history for non-repeatable notifications
      if (state.availableEvents[eventId].type === 'notification' && 
          !state.availableEvents[eventId].repeatable) {
        state.eventHistory.push({
          eventId,
          timestamp: getCurrentTime(),
        });
      }
    },
    
    /**
     * Resolve an event with a player choice
     */
    resolveEvent: (state, action: PayloadAction<{ eventId: string, choiceId?: string }>) => {
      const { eventId, choiceId } = action.payload;
      
      // Ensure event exists and is active
      if (!state.availableEvents[eventId]) {
        console.warn(`Cannot resolve event ${eventId} - not found`);
        return;
      }
      
      if (!state.activeEvents.includes(eventId)) {
        console.warn(`Cannot resolve event ${eventId} - not active`);
        return;
      }
      
      // Remove from active events
      state.activeEvents = state.activeEvents.filter(id => id !== eventId);
      
      // Add to history
      state.eventHistory.push({
        eventId,
        timestamp: getCurrentTime(),
        choiceId,
      });
    },
    
    /**
     * Clear all active events
     */
    clearActiveEvents: (state) => {
      // For each active event, add to history
      state.activeEvents.forEach(eventId => {
        state.eventHistory.push({
          eventId,
          timestamp: getCurrentTime(),
        });
      });
      
      // Clear active events
      state.activeEvents = [];
    },
    
    /**
     * Update an existing event
     */
    updateEvent: (state, action: PayloadAction<{ id: string, changes: Partial<IEvent> }>) => {
      const { id, changes } = action.payload;
      
      if (!state.availableEvents[id]) {
        console.warn(`Cannot update event ${id} - not found`);
        return;
      }
      
      state.availableEvents[id] = {
        ...state.availableEvents[id],
        ...changes,
      };
    },
    
    /**
     * Remove an event from the available events
     */
    removeEvent: (state, action: PayloadAction<string>) => {
      const eventId = action.payload;
      
      // If event is active, remove it
      if (state.activeEvents.includes(eventId)) {
        state.activeEvents = state.activeEvents.filter(id => id !== eventId);
      }
      
      // Remove from available events
      delete state.availableEvents[eventId];
    },
    
    /**
     * Clear all event history
     */
    clearEventHistory: (state) => {
      state.eventHistory = [];
    },
    
    /**
     * Reset the state to initial values
     */
    resetEvents: () => initialState,
  },
});

export const {
  addEvent,
  addEvents,
  triggerEvent,
  resolveEvent,
  clearActiveEvents,
  updateEvent,
  removeEvent,
  clearEventHistory,
  resetEvents,
} = eventsSlice.actions;

export default eventsSlice.reducer;