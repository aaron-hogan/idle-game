/**
 * Types of events in the game
 */
export enum EventType {
  STORY = 'story',
  RESOURCE = 'resource',
  ACHIEVEMENT = 'achievement',
  TASK = 'task',
  NOTIFICATION = 'notification',
}

/**
 * Represents a condition for triggering an event
 */
export interface EventCondition {
  /** Type of condition (e.g., 'resourceAmount', 'structureCount', 'gameTime') */
  type: string;
  
  /** Target of the condition (e.g., resource ID, structure ID) */
  target?: string;
  
  /** Value to compare against */
  value: number;
  
  /** Optional comparison operator (default: '>=' ) */
  operator?: '>=' | '>' | '=' | '<' | '<=';
}

/**
 * Represents a consequence of an event
 */
export interface EventConsequence {
  /** Type of consequence (e.g., 'addResource', 'unlockStructure') */
  type: string;
  
  /** Target of the consequence (e.g., resource ID, structure ID) */
  target: string;
  
  /** Value to apply */
  value: number | boolean | string;
}

/**
 * Represents a choice in an event
 */
export interface EventChoice {
  /** Unique identifier for the choice */
  id: string;
  
  /** Text to display for the choice */
  text: string;
  
  /** Optional consequences for selecting this choice */
  consequences?: EventConsequence[];
  
  /** Optional next event to trigger after this choice */
  nextEventId?: string;
}

/**
 * Core event interface
 */
export interface IEvent {
  /** Unique identifier for the event */
  id: string;
  
  /** Event title */
  title: string;
  
  /** Event description - can contain markdown formatting */
  description: string;
  
  /** Type of event */
  type: EventType;
  
  /** Conditions that must be met for this event to trigger */
  conditions: EventCondition[];
  
  /** Effects to apply when the event is triggered */
  consequences?: EventConsequence[];
  
  /** Player choices for this event */
  choices?: EventChoice[];
  
  /** Optional image URL to display with the event */
  imageUrl?: string;
  
  /** Priority for display order (higher numbers = higher priority) */
  priority: number;
  
  /** Whether this event has been seen by the player */
  seen: boolean;
  
  /** Whether this event should repeat after being seen */
  repeatable: boolean;
  
  /** Delay in seconds before this event can trigger again (only used if repeatable) */
  cooldown?: number;
  
  /** When this event was last triggered (timestamp) */
  lastTriggered?: number;
}