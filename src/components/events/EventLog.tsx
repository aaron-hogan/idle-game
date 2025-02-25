import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { EventType } from '../../interfaces/Event';
import { formatDate } from '../../utils/formatters';
import './EventLog.css';

interface EventLogProps {
  maxEntries?: number;
}

/**
 * Component to display the history of past events
 */
const EventLog: React.FC<EventLogProps> = ({ maxEntries = 50 }) => {
  const [filter, setFilter] = useState<EventType | 'all'>('all');
  
  // Get event history from state
  const eventHistory = useSelector((state: RootState) => {
    return state.events.eventHistory
      .slice(-maxEntries) // Limit to max entries
      .reverse(); // Show newest first
  });
  
  // Get actual event objects from the state
  const events = useSelector((state: RootState) => state.events.availableEvents);
  
  // Filter event history based on selected type
  const filteredHistory = filter === 'all'
    ? eventHistory
    : eventHistory.filter(entry => 
        events[entry.eventId]?.type === filter
      );
  
  // If no events, show empty state
  if (eventHistory.length === 0) {
    return (
      <div className="event-log event-log--empty">
        <p className="event-log__empty-message">No events recorded yet.</p>
      </div>
    );
  }
  
  return (
    <div className="event-log">
      <div className="event-log__header">
        <h3 className="event-log__title">Event History</h3>
        <div className="event-log__filters">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value as EventType | 'all')}
            className="event-log__filter-select"
          >
            <option value="all">All Events</option>
            <option value={EventType.STORY}>Story</option>
            <option value={EventType.RESOURCE}>Resources</option>
            <option value={EventType.ACHIEVEMENT}>Achievements</option>
            <option value={EventType.TASK}>Tasks</option>
            <option value={EventType.NOTIFICATION}>Notifications</option>
          </select>
        </div>
      </div>
      
      <div className="event-log__entries">
        {filteredHistory.map((entry, index) => {
          const event = events[entry.eventId];
          
          // Skip if event doesn't exist anymore
          if (!event) return null;
          
          // Get choice text if available
          const choiceText = entry.choiceId
            ? event.choices?.find(c => c.id === entry.choiceId)?.text
            : null;
          
          return (
            <div 
              key={`${entry.eventId}-${index}`}
              className={`event-log__entry event-log__entry--${event.type.toLowerCase()}`}
            >
              <div className="event-log__entry-header">
                <h4 className="event-log__entry-title">{event.title}</h4>
                <span className="event-log__entry-time">
                  {formatDate(entry.timestamp)}
                </span>
              </div>
              
              <p className="event-log__entry-description">
                {event.description}
              </p>
              
              {choiceText && (
                <div className="event-log__entry-choice">
                  <span className="event-log__choice-label">Choice:</span>
                  <span className="event-log__choice-text">{choiceText}</span>
                </div>
              )}
            </div>
          );
        })}
        
        {filteredHistory.length === 0 && (
          <p className="event-log__empty-filtered-message">
            No {filter} events found in history.
          </p>
        )}
      </div>
    </div>
  );
};

export default EventLog;