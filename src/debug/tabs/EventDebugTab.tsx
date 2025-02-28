import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../state/store';
import { IEvent, EventStatus, EventCategory, EventType } from '../../interfaces/Event';
import { EventManager } from '../../systems/eventManager';
import MetricsPanel from '../components/MetricsPanel';
import './DebugTab.css';

/**
 * Debug tab for managing and testing events
 */
const EventDebugTab: React.FC = () => {
  const dispatch = useDispatch();
  const eventManager = EventManager.getInstance();

  // Get events from state
  const events = useSelector((state: RootState) => state.events.availableEvents);
  const activeEvents = useSelector((state: RootState) => state.events.activeEvents);
  const eventHistory = useSelector((state: RootState) => state.events.eventHistory);

  // Local state for filters
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Metrics for the MetricsPanel
  const eventMetrics = useMemo(() => {
    const allEvents = Object.values(events);
    return [
      { name: 'Total Events', value: allEvents.length.toString() },
      { name: 'Active Events', value: activeEvents.length.toString() },
      {
        name: 'Pending Events',
        value: allEvents.filter((e) => e.status === EventStatus.PENDING).length.toString(),
      },
      { name: 'Resolved Events', value: eventHistory.length.toString() },
      {
        name: 'Story Events',
        value: allEvents.filter((e) => e.type === EventType.STORY).length.toString(),
      },
      {
        name: 'Opportunity Events',
        value: allEvents.filter((e) => e.category === EventCategory.OPPORTUNITY).length.toString(),
      },
      {
        name: 'Crisis Events',
        value: allEvents.filter((e) => e.category === EventCategory.CRISIS).length.toString(),
      },
    ];
  }, [events, activeEvents, eventHistory]);

  // Filter events based on selected filters and search term
  const filteredEvents = useMemo(() => {
    return Object.values(events).filter((event) => {
      // Apply category filter
      if (categoryFilter !== 'all' && event.category !== categoryFilter) {
        return false;
      }

      // Apply status filter
      if (statusFilter !== 'all') {
        if (statusFilter === 'active' && !activeEvents.includes(event.id)) {
          return false;
        } else if (statusFilter === 'pending' && event.status !== EventStatus.PENDING) {
          return false;
        } else if (statusFilter === 'resolved' && event.status !== EventStatus.RESOLVED) {
          return false;
        } else if (statusFilter === 'expired' && event.status !== EventStatus.EXPIRED) {
          return false;
        }
      }

      // Apply search term
      if (
        searchTerm &&
        !event.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !event.id.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [events, activeEvents, categoryFilter, statusFilter, searchTerm]);

  // Handle triggering an event manually
  const handleTriggerEvent = (eventId: string) => {
    eventManager.triggerEvent(eventId);
  };

  // Expire an active event
  const handleExpireEvent = (eventId: string) => {
    eventManager.expireEvent(eventId);
  };

  // Force event processing
  const handleProcessEvents = () => {
    eventManager.processEvents();
  };

  return (
    <div className="debug-tab event-debug-tab">
      <h3>Event System Debug</h3>

      {/* Metrics Panel */}
      <div className="debug-section">
        <h4>Event Metrics</h4>
        <MetricsPanel title="Event System Stats" metrics={eventMetrics} />
        <button className="debug-button" onClick={handleProcessEvents}>
          Force Process Events
        </button>
      </div>

      {/* Filters */}
      <div className="debug-section">
        <h4>Event Filters</h4>

        <div className="filter-controls">
          <div className="filter-group">
            <label>Category:</label>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="all">All Categories</option>
              <option value={EventCategory.OPPORTUNITY}>Opportunity</option>
              <option value={EventCategory.CRISIS}>Crisis</option>
              <option value={EventCategory.RANDOM}>Random</option>
              <option value={EventCategory.STORY}>Story</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Status:</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Search:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search events..."
            />
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="debug-section">
        <h4>Events ({filteredEvents.length})</h4>

        <div className="debug-table-container">
          <table className="debug-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Type</th>
                <th>Category</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Seen</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => {
                // Check if event is active
                const isActive = activeEvents.includes(event.id);

                return (
                  <tr key={event.id} className={isActive ? 'active-event' : ''}>
                    <td>{event.id}</td>
                    <td>{event.title}</td>
                    <td>{event.type}</td>
                    <td>{event.category}</td>
                    <td>{event.status || 'pending'}</td>
                    <td>{event.priority}</td>
                    <td>{event.seen ? 'Yes' : 'No'}</td>
                    <td>
                      {!isActive && (
                        <button
                          className="debug-button-small"
                          onClick={() => handleTriggerEvent(event.id)}
                          disabled={isActive}
                        >
                          Trigger
                        </button>
                      )}

                      {isActive && (
                        <button
                          className="debug-button-small"
                          onClick={() => handleExpireEvent(event.id)}
                        >
                          Expire
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredEvents.length === 0 && (
                <tr>
                  <td colSpan={8} className="no-events">
                    No events match the current filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Event History */}
      <div className="debug-section">
        <h4>
          Event History (Recent {Math.min(eventHistory.length, 10)} of {eventHistory.length})
        </h4>

        <div className="debug-table-container">
          <table className="debug-table">
            <thead>
              <tr>
                <th>Event ID</th>
                <th>Choice ID</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {eventHistory
                .slice(-10)
                .reverse()
                .map((entry, index) => {
                  const eventName = events[entry.eventId]
                    ? events[entry.eventId].title
                    : entry.eventId;
                  return (
                    <tr key={`history-${index}`}>
                      <td>{eventName}</td>
                      <td>{entry.choiceId || 'N/A'}</td>
                      <td>{new Date(entry.timestamp).toLocaleString()}</td>
                    </tr>
                  );
                })}

              {eventHistory.length === 0 && (
                <tr>
                  <td colSpan={3} className="no-events">
                    No event history yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EventDebugTab;
