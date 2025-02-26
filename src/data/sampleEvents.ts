import { IEvent, EventType, EventCategory, EventStatus } from '../interfaces/Event';

/**
 * Sample events for testing and demonstration
 */
export const sampleEvents: IEvent[] = [
  // Welcome event
  {
    id: 'welcome',
    title: 'Welcome to the Game',
    description: 'Welcome to the Anti-Capitalist Idle Game! This game offers strategic resource management with choices that impact your progression toward building a more just society.',
    type: EventType.STORY,
    category: EventCategory.STORY,
    status: EventStatus.PENDING,
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
    repeatable: false,
    tags: ['introduction', 'tutorial']
  },
  
  // Resource milestone event
  {
    id: 'first-resource-milestone',
    title: 'Resources Accumulated',
    description: 'You\'ve accumulated your first significant amount of resources. These can be used to build structures and develop your community\'s capacity.',
    type: EventType.RESOURCE,
    category: EventCategory.OPPORTUNITY,
    status: EventStatus.PENDING,
    conditions: [
      {
        type: 'resourceAmount',
        target: 'resources',
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
    repeatable: false,
    tags: ['resources', 'milestone']
  },
  
  // Achievement event
  {
    id: 'first-achievement',
    title: 'First Steps',
    description: 'You\'ve made your first steps towards building a sustainable community. Keep exploring the game to discover more features and strategies for positive social change!',
    type: EventType.ACHIEVEMENT,
    category: EventCategory.STORY,
    status: EventStatus.PENDING,
    conditions: [
      {
        type: 'structureCount',
        target: 'community-center',
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
    repeatable: false,
    tags: ['achievement', 'beginning']
  },
  
  // Story event with multiple choices
  {
    id: 'community-decision',
    title: 'Community Decision',
    description: 'Your community needs to decide which development path to prioritize. Each choice will influence your future options and the direction of your movement.',
    type: EventType.STORY,
    category: EventCategory.STORY,
    status: EventStatus.PENDING,
    conditions: [
      {
        type: 'gameStage',
        value: 1,
        operator: '>='
      },
      {
        type: 'resourceAmount',
        target: 'community-support',
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
          },
          {
            type: 'addResource',
            target: 'community-support',
            value: 10
          }
        ]
      },
      {
        id: 'production',
        text: 'Focus on mutual aid production',
        consequences: [
          {
            type: 'addResource',
            target: 'resources',
            value: 30
          },
          {
            type: 'addResource',
            target: 'solidarity',
            value: 15
          }
        ]
      },
      {
        id: 'community',
        text: 'Focus on community building',
        consequences: [
          {
            type: 'addResource',
            target: 'community-support',
            value: 25
          },
          {
            type: 'addResource',
            target: 'organization',
            value: 15
          }
        ]
      }
    ],
    priority: 90,
    seen: false,
    repeatable: false,
    tags: ['decision', 'strategy', 'development']
  },
  
  // Recurring notification
  {
    id: 'resource-tip',
    title: 'Game Tip',
    description: 'Remember to balance your resource production. Mutual aid networks are more resilient when they have diverse capabilities!',
    type: EventType.NOTIFICATION,
    category: EventCategory.RANDOM,
    status: EventStatus.PENDING,
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
    cooldown: 600, // Repeat every 10 minutes
    tags: ['tip', 'notification', 'help']
  }
];