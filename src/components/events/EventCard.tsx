import React, { useCallback } from 'react';
import { IEvent, EventChoice } from '../../interfaces/Event';
import { Card, Button } from '../ui';
import './EventCard.css';

interface EventCardProps {
  event: IEvent;
  onChoiceSelected: (eventId: string, choiceId: string) => void;
  onClose?: (eventId: string) => void;
}

/**
 * Component to display a single event card with choices
 */
const EventCard: React.FC<EventCardProps> = ({ event, onChoiceSelected, onClose }) => {
  // Memoize handlers to prevent unnecessary rerenders
  const handleChoiceClick = useCallback((choiceId: string) => {
    onChoiceSelected(event.id, choiceId);
  }, [event.id, onChoiceSelected]);
  
  // Handle close button click for events without choices
  const handleCloseClick = useCallback(() => {
    if (onClose) {
      onClose(event.id);
    }
  }, [event.id, onClose]);
  
  // Show event information
  return (
    <Card className={`event-card event-card--${event.type.toLowerCase()} event-card--${event.category?.toLowerCase() || ''}`}>
      <div className="event-card__header">
        <h3 className="event-card__title">{event.title}</h3>
        {!event.choices && onClose && (
          <button 
            className="event-card__close-button" 
            onClick={handleCloseClick}
            aria-label="Close event"
          >
            &times;
          </button>
        )}
      </div>
      
      {/* Show event image if available */}
      {event.imageUrl && (
        <div className="event-card__image-container">
          <img 
            src={event.imageUrl} 
            alt={event.title} 
            className="event-card__image" 
          />
        </div>
      )}
      
      <div className="event-card__description">
        {event.description}
      </div>
      
      {/* Show choices if available */}
      {event.choices && event.choices.length > 0 && (
        <div className="event-card__choices">
          {event.choices.map((choice: EventChoice) => (
            <Button
              key={choice.id}
              onClick={() => handleChoiceClick(choice.id)}
              className="event-card__choice-button"
            >
              {choice.text}
            </Button>
          ))}
        </div>
      )}
      
      {/* Show a close button for events without choices */}
      {(!event.choices || event.choices.length === 0) && onClose && (
        <div className="event-card__footer">
          <Button 
            onClick={handleCloseClick}
            className="event-card__dismiss-button"
          >
            Dismiss
          </Button>
        </div>
      )}
    </Card>
  );
};

// Use React.memo to prevent unnecessary rerenders
export default React.memo(EventCard);