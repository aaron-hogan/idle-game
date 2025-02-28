/**
 * Game End Events
 * 
 * Special narrative events for when the player wins or loses the game
 */

import { IEvent, EventType, EventCategory, EventStatus } from '../../interfaces/Event';

/**
 * Victory event triggered when the player wins the game
 */
export const victoryEvent: IEvent = {
  id: 'victory-event',
  title: 'Victory: A New Beginning',
  description: `Your movement has achieved critical mass! The collective power you've built has successfully challenged the existing power structures and created lasting change.

The corporate powers that once seemed invincible are now being dismantled, replaced by community-controlled alternatives that prioritize people and planet over profit.

This victory isn't the end—it's a new beginning. The work of building a more just and equitable society continues, but now with stronger foundations and broader participation.

Congratulations on your successful campaign for change!`,
  type: EventType.STORY,
  category: EventCategory.STORY,
  status: EventStatus.PENDING,
  conditions: [],
  priority: 100, // Highest priority
  seen: false,
  repeatable: false,
  choices: [
    {
      id: 'celebrate',
      text: 'Celebrate this victory',
    },
    {
      id: 'reflect',
      text: 'Reflect on the journey',
    },
    {
      id: 'restart',
      text: 'Start a new movement',
    }
  ],
};

/**
 * Defeat event triggered when the player loses the game
 */
export const defeatEvent: IEvent = {
  id: 'defeat-event',
  title: 'Defeat: The Struggle Continues',
  description: `Corporate oppression has overwhelmed your movement. Key organizers have been targeted, community spaces shut down, and public support has dwindled under the weight of coordinated opposition.

But while this chapter of resistance has ended, the struggle for justice continues. Already, new groups are forming, learning from both your successes and setbacks. The seeds you've planted will grow in unexpected places.

Remember that throughout history, movements have faced setbacks before achieving breakthrough. Your work was not in vain—it was part of a longer arc toward justice.

The fight will continue, with new tactics, new leaders, and renewed determination.`,
  type: EventType.STORY,
  category: EventCategory.CRISIS,
  status: EventStatus.PENDING,
  conditions: [],
  priority: 100, // Highest priority
  seen: false,
  repeatable: false,
  choices: [
    {
      id: 'accept',
      text: 'Accept this outcome',
    },
    {
      id: 'reflect',
      text: 'Reflect on what went wrong',
    },
    {
      id: 'restart',
      text: 'Start a new movement',
    }
  ],
};