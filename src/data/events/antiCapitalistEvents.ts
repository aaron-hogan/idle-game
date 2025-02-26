import { 
  IEvent, 
  EventType, 
  EventCategory, 
  EventStatus 
} from '../../interfaces/Event';

/**
 * Anti-capitalist themed events for the game
 */
export const antiCapitalistEvents: IEvent[] = [
  // Corporate Media Smear Event
  {
    id: 'corporate-media-smear',
    title: 'Corporate Media Smear Campaign',
    description: 'A local corporate media outlet has begun running negative stories about your organization, painting it as dangerous and extreme. Community trust is being affected.',
    type: EventType.STORY,
    category: EventCategory.CRISIS,
    status: EventStatus.PENDING,
    conditions: [
      {
        type: 'resourceAmount',
        target: 'community-trust',
        value: 50,
        operator: '>='
      }
    ],
    consequences: [
      {
        type: 'addResource',
        target: 'community-trust',
        value: -10
      }
    ],
    choices: [
      {
        id: 'ignore',
        text: 'Ignore the stories and focus on our work',
        consequences: [
          {
            type: 'addResource',
            target: 'collective-power',
            value: 5
          }
        ]
      },
      {
        id: 'counter-narrative',
        text: 'Launch a counter-narrative campaign',
        consequences: [
          {
            type: 'addResource',
            target: 'community-trust',
            value: 15
          },
          {
            type: 'addResource',
            target: 'collective-power',
            value: -10
          }
        ]
      },
      {
        id: 'community-meeting',
        text: 'Host community meetings to address concerns directly',
        consequences: [
          {
            type: 'addResource',
            target: 'community-trust',
            value: 25
          },
          {
            type: 'addResource',
            target: 'collective-power',
            value: -5
          }
        ]
      }
    ],
    priority: 80,
    seen: false,
    repeatable: true,
    cooldown: 600,
    tags: ['media', 'crisis', 'community']
  },
  
  // Spontaneous Strike Event
  {
    id: 'spontaneous-strike',
    title: 'Spontaneous Strike',
    description: 'Workers at a local factory have walked out in protest of unsafe conditions. This unexpected action presents an opportunity for solidarity and potential growth.',
    type: EventType.STORY,
    category: EventCategory.OPPORTUNITY,
    status: EventStatus.PENDING,
    conditions: [
      {
        type: 'resourceAmount',
        target: 'organization',
        value: 30,
        operator: '>='
      }
    ],
    consequences: [],
    choices: [
      {
        id: 'join-picket',
        text: 'Join the picket line in solidarity',
        consequences: [
          {
            type: 'addResource',
            target: 'solidarity',
            value: 15
          },
          {
            type: 'addResource',
            target: 'bargaining-power',
            value: 10
          }
        ]
      },
      {
        id: 'provide-resources',
        text: 'Provide food and resources to strikers',
        consequences: [
          {
            type: 'addResource',
            target: 'community-support',
            value: 20
          },
          {
            type: 'addResource',
            target: 'resources',
            value: -15
          }
        ]
      },
      {
        id: 'organize-support',
        text: 'Organize community support campaign',
        consequences: [
          {
            type: 'addResource',
            target: 'solidarity',
            value: 10
          },
          {
            type: 'addResource',
            target: 'community-support',
            value: 15
          },
          {
            type: 'addResource',
            target: 'organization',
            value: -5
          }
        ]
      }
    ],
    priority: 75,
    seen: false,
    repeatable: true,
    cooldown: 900,
    tags: ['labor', 'opportunity', 'solidarity']
  },
  
  // Community Support Rally Event
  {
    id: 'community-support-rally',
    title: 'Community Support Rally',
    description: 'An opportunity has arisen to organize a community rally to build support for your cause and increase solidarity among community members.',
    type: EventType.STORY,
    category: EventCategory.OPPORTUNITY,
    status: EventStatus.PENDING,
    conditions: [
      {
        type: 'resourceAmount',
        target: 'organization',
        value: 20,
        operator: '>='
      }
    ],
    consequences: [],
    choices: [
      {
        id: 'local-park',
        text: 'Hold rally in local park',
        consequences: [
          {
            type: 'addResource',
            target: 'community-support',
            value: 25
          },
          {
            type: 'addResource',
            target: 'organization',
            value: -10
          }
        ]
      },
      {
        id: 'downtown-march',
        text: 'Organize downtown march',
        consequences: [
          {
            type: 'addResource',
            target: 'solidarity',
            value: 20
          },
          {
            type: 'addResource',
            target: 'community-support',
            value: 15
          },
          {
            type: 'addResource',
            target: 'organization',
            value: -15
          }
        ]
      },
      {
        id: 'online-campaign',
        text: 'Run an online awareness campaign instead',
        consequences: [
          {
            type: 'addResource',
            target: 'community-support',
            value: 10
          },
          {
            type: 'addResource',
            target: 'organization',
            value: -5
          }
        ]
      }
    ],
    priority: 70,
    seen: false,
    repeatable: true,
    cooldown: 600,
    tags: ['community', 'opportunity', 'organizing']
  },
  
  // Police Harassment Event
  {
    id: 'police-harassment',
    title: 'Police Harassment',
    description: 'Local authorities have begun increasing surveillance and harassment of your organization. Members report being followed and intimidated.',
    type: EventType.STORY,
    category: EventCategory.CRISIS,
    status: EventStatus.PENDING,
    conditions: [
      {
        type: 'resourceAmount',
        target: 'organization',
        value: 40,
        operator: '>='
      },
      {
        type: 'resourceAmount',
        target: 'community-support',
        value: 60,
        operator: '>='
      }
    ],
    consequences: [
      {
        type: 'addResource',
        target: 'organization',
        value: -5
      }
    ],
    choices: [
      {
        id: 'legal-support',
        text: 'Organize legal support network',
        consequences: [
          {
            type: 'addResource',
            target: 'organization',
            value: 15
          },
          {
            type: 'addResource',
            target: 'resources',
            value: -20
          }
        ]
      },
      {
        id: 'public-documentation',
        text: 'Document and publicize the harassment',
        consequences: [
          {
            type: 'addResource',
            target: 'community-support',
            value: 25
          },
          {
            type: 'addResource',
            target: 'solidarity',
            value: 10
          }
        ]
      },
      {
        id: 'adapt-tactics',
        text: 'Adapt organizational tactics for security',
        consequences: [
          {
            type: 'addResource',
            target: 'organization',
            value: 10
          },
          {
            type: 'addResource',
            target: 'community-support',
            value: -5
          }
        ]
      }
    ],
    priority: 85,
    seen: false,
    repeatable: true,
    cooldown: 1200,
    tags: ['repression', 'crisis', 'security']
  },
  
  // Gentrification Threat Event
  {
    id: 'gentrification-threat',
    title: 'Gentrification Threat',
    description: 'A corporate developer has announced plans to build luxury condos in a working-class neighborhood, threatening to displace local residents.',
    type: EventType.STORY,
    category: EventCategory.CRISIS,
    status: EventStatus.PENDING,
    conditions: [
      {
        type: 'resourceAmount',
        target: 'community-support',
        value: 75,
        operator: '>='
      }
    ],
    consequences: [],
    choices: [
      {
        id: 'organize-tenants',
        text: 'Organize tenants union',
        consequences: [
          {
            type: 'addResource',
            target: 'organization',
            value: 20
          },
          {
            type: 'addResource',
            target: 'solidarity',
            value: 15
          },
          {
            type: 'addResource',
            target: 'resources',
            value: -10
          }
        ]
      },
      {
        id: 'protest-development',
        text: 'Protest at development hearing',
        consequences: [
          {
            type: 'addResource',
            target: 'community-support',
            value: 30
          },
          {
            type: 'addResource',
            target: 'organization',
            value: -5
          }
        ]
      },
      {
        id: 'alternative-plan',
        text: 'Develop community-owned housing alternative',
        consequences: [
          {
            type: 'addResource',
            target: 'community-support',
            value: 20
          },
          {
            type: 'addResource',
            target: 'resources',
            value: -25
          },
          {
            type: 'addResource',
            target: 'solidarity',
            value: 25
          }
        ]
      }
    ],
    priority: 75,
    seen: false,
    repeatable: true,
    cooldown: 900,
    tags: ['housing', 'crisis', 'development']
  }
];