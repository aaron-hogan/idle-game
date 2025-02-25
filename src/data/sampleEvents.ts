import { IEvent, EventType } from '../interfaces/Event';

/**
 * Sample events for testing and demonstration
 */
export const sampleEvents: IEvent[] = [
  // Welcome event
  {
    id: 'welcome',
    title: 'Welcome to the Game',
    description: 'Welcome to the Unnamed Idle Game! This game offers strategic resource management with choices that impact your progression.',
    type: EventType.STORY,
    conditions: [
      {
        type: 'gameTime',
        value: 5, // Trigger after 5 seconds of gameplay
        operator: '>'
      }
    ],
    consequences: [],
    choices: [
      {
        id: 'continue',
        text: 'Let\'s begin!'
      }
    ],
    priority: 100,
    seen: false,
    repeatable: false
  },
  
  // Resource milestone event
  {
    id: 'first-resource-milestone',
    title: 'Resources Accumulated',
    description: 'You\'ve accumulated your first significant amount of resources. These can be used to build structures and develop your community.',
    type: EventType.RESOURCE,
    conditions: [
      {
        type: 'resourceAmount',
        target: 'wood',
        value: 10,
        operator: '>='
      }
    ],
    consequences: [
      {
        type: 'addResource',
        target: 'knowledge',
        value: 5
      }
    ],
    choices: [],
    priority: 50,
    seen: false,
    repeatable: false
  },
  
  // Achievement event
  {
    id: 'first-achievement',
    title: 'First Steps',
    description: 'You\'ve made your first steps towards building a sustainable community. Keep exploring the game to discover more features!',
    type: EventType.ACHIEVEMENT,
    conditions: [
      {
        type: 'structureCount',
        target: 'woodcutter',
        value: 1,
        operator: '>='
      }
    ],
    consequences: [],
    choices: [
      {
        id: 'awesome',
        text: 'Awesome!'
      }
    ],
    priority: 75,
    seen: false,
    repeatable: false
  },
  
  // Story event with multiple choices
  {
    id: 'community-decision',
    title: 'Community Decision',
    description: 'Your community needs to decide which development path to prioritize. Each choice will influence your future options.',
    type: EventType.STORY,
    conditions: [
      {
        type: 'gameStage',
        value: 1,
        operator: '>='
      },
      {
        type: 'resourceAmount',
        target: 'food',
        value: 50,
        operator: '>='
      }
    ],
    consequences: [],
    choices: [
      {
        id: 'sustainability',
        text: 'Focus on sustainability',
        consequences: [
          {
            type: 'addResource',
            target: 'knowledge',
            value: 20
          }
        ]
      },
      {
        id: 'production',
        text: 'Focus on production',
        consequences: [
          {
            type: 'addResource',
            target: 'wood',
            value: 30
          }
        ]
      },
      {
        id: 'community',
        text: 'Focus on community building',
        consequences: [
          {
            type: 'addResource',
            target: 'happiness',
            value: 25
          }
        ]
      }
    ],
    priority: 90,
    seen: false,
    repeatable: false
  },
  
  // Recurring notification
  {
    id: 'resource-tip',
    title: 'Game Tip',
    description: 'Remember to balance your resource production. A diverse economy is more resilient!',
    type: EventType.NOTIFICATION,
    conditions: [
      {
        type: 'gameTime',
        value: 300, // 5 minutes of gameplay
        operator: '>'
      }
    ],
    consequences: [],
    choices: [],
    priority: 25,
    seen: false,
    repeatable: true,
    cooldown: 600 // Repeat every 10 minutes
  }
];