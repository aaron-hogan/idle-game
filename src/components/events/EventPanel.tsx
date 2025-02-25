import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { IEvent } from '../../interfaces/Event';
import EventCard from './EventCard';
import { EventManager } from '../../systems/eventManager';
import './EventPanel.css';

/**
 * Panel to display active events
 */
const EventPanel: React.FC = () => {
  // Use memoized selector to prevent unnecessary rerenders
  const activeEvents = useSelector((state: RootState) => {
    // Get active event IDs from state
    const activeEventIds = state.events.activeEvents;
    
    // Map IDs to actual event objects
    return activeEventIds
      .map(id => state.events.availableEvents[id])
      .filter(Boolean)
      .sort((a, b) => b.priority - a.priority); // Sort by priority
  });
  
  // Get event manager instance once
  const eventManager = EventManager.getInstance();
  
  // Memoize handlers to prevent unnecessary rerenders
  const handleChoiceSelected = useCallback((eventId: string, choiceId: string) => {
    eventManager.resolveEvent(eventId, choiceId);
  }, [eventManager]);
  
  const handleEventDismiss = useCallback((eventId: string) => {
    // Use empty string as choice ID for auto-dismissal
    eventManager.resolveEvent(eventId, '');
  }, [eventManager]);
  
  // If no active events, don't render the panel
  if (activeEvents.length === 0) {
    return null;
  }
  
  return (
    <div className="event-panel">
      <div className="event-panel__content">
        {activeEvents.map((event: IEvent) => (
          <EventCard
            key={event.id}
            event={event}
            onChoiceSelected={handleChoiceSelected}
            onClose={handleEventDismiss}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(EventPanel);