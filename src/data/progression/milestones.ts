/**
 * Initial milestones data for the game's progression system
 */
import { GameStage, Milestone, MilestoneType } from '../../interfaces/progression';

/**
 * Early game milestones
 */
export const earlyGameMilestones: Milestone[] = [
  {
    id: 'first-collective-power',
    name: 'First Community Power',
    description: 'Begin your journey by gathering initial community influence.',
    stage: GameStage.EARLY,
    type: MilestoneType.AWARENESS,
    completed: false,
    requirements: [
      {
        type: 'resourceAmount',
        target: 'collective-power',
        value: 10
      }
    ],
    unlocks: ['basic-resources'],
    order: 1,
    visible: true
  },
  {
    id: 'growing-power',
    name: 'Growing Influence',
    description: 'Build up your community influence to increase your impact.',
    stage: GameStage.EARLY,
    type: MilestoneType.ORGANIZATION,
    completed: false,
    requirements: [
      {
        type: 'resourceAmount',
        target: 'collective-power',
        value: 50
      }
    ],
    unlocks: ['community-events'],
    order: 2,
    visible: true
  },
  {
    id: 'resource-sharing',
    name: 'Resource Network',
    description: 'Create a small network for efficiently sharing resources and knowledge.',
    stage: GameStage.EARLY,
    type: MilestoneType.RESOURCE,
    completed: false,
    requirements: [
      {
        type: 'resourceAmount',
        target: 'connections',
        value: 30
      },
      {
        type: 'resourceAmount',
        target: 'materials',
        value: 25
      }
    ],
    unlocks: ['sharing-economy'],
    order: 3,
    visible: true
  },
  {
    id: 'study-circle',
    name: 'Study Group Formation',
    description: 'Form a group to study and develop new ideas together.',
    stage: GameStage.EARLY,
    type: MilestoneType.AWARENESS,
    completed: false,
    requirements: [
      {
        type: 'resourceAmount',
        target: 'awareness',
        value: 40
      },
      {
        type: 'resourceAmount',
        target: 'connections',
        value: 15
      }
    ],
    unlocks: ['theory-development'],
    order: 4,
    visible: true
  },
  {
    id: 'first-protest',
    name: 'First Community Action',
    description: 'Organize your first small community project or event.',
    stage: GameStage.EARLY,
    type: MilestoneType.MOVEMENT,
    completed: false,
    requirements: [
      {
        type: 'resourceAmount',
        target: 'connections',
        value: 50
      },
      {
        type: 'resourceAmount',
        target: 'awareness',
        value: 30
      },
      {
        type: 'resourceAmount',
        target: 'organization',
        value: 10
      }
    ],
    unlocks: ['organizing-skills'],
    order: 5,
    visible: true
  }
];

/**
 * Mid game milestones
 */
export const midGameMilestones: Milestone[] = [
  {
    id: 'cooperative-formation',
    name: 'Community Business Formation',
    description: 'Establish a community-based business model.',
    stage: GameStage.MID,
    type: MilestoneType.ORGANIZATION,
    completed: false,
    requirements: [
      {
        type: 'resourceAmount',
        target: 'materials',
        value: 100
      },
      {
        type: 'resourceAmount',
        target: 'connections',
        value: 80
      },
      {
        type: 'resourceAmount',
        target: 'organization',
        value: 50
      }
    ],
    unlocks: ['cooperative-economy'],
    order: 6,
    visible: false
  },
  {
    id: 'community-garden',
    name: 'Community Garden Network',
    description: 'Create a network of community gardens for local food production.',
    stage: GameStage.MID,
    type: MilestoneType.RESOURCE,
    completed: false,
    requirements: [
      {
        type: 'resourceAmount',
        target: 'materials',
        value: 120
      },
      {
        type: 'resourceAmount',
        target: 'land',
        value: 30
      }
    ],
    unlocks: ['food-sovereignty'],
    order: 7,
    visible: false
  },
  {
    id: 'mutual-aid-network',
    name: 'Community Support Network',
    description: 'Establish a robust support network to address community needs.',
    stage: GameStage.MID,
    type: MilestoneType.MOVEMENT,
    completed: false,
    requirements: [
      {
        type: 'resourceAmount',
        target: 'connections',
        value: 150
      },
      {
        type: 'resourceAmount',
        target: 'awareness',
        value: 100
      },
      {
        type: 'resourceAmount',
        target: 'organization',
        value: 80
      }
    ],
    unlocks: ['community-support'],
    order: 8,
    visible: false
  },
  {
    id: 'alternative-education',
    name: 'Community Education Program',
    description: 'Create supplementary education programs for community members.',
    stage: GameStage.MID,
    type: MilestoneType.AWARENESS,
    completed: false,
    requirements: [
      {
        type: 'resourceAmount',
        target: 'awareness',
        value: 200
      },
      {
        type: 'resourceAmount',
        target: 'organization',
        value: 100
      }
    ],
    unlocks: ['knowledge-sharing'],
    order: 9,
    visible: false
  },
  {
    id: 'legal-defense-fund',
    name: 'Community Legal Resources',
    description: 'Establish resources to provide legal assistance to community members.',
    stage: GameStage.MID,
    type: MilestoneType.RESISTANCE,
    completed: false,
    requirements: [
      {
        type: 'resourceAmount',
        target: 'materials',
        value: 250
      },
      {
        type: 'resourceAmount',
        target: 'connections',
        value: 200
      }
    ],
    unlocks: ['legal-protection'],
    order: 10,
    visible: false
  }
];

/**
 * Late game milestones
 */
export const lateGameMilestones: Milestone[] = [
  {
    id: 'community-currency',
    name: 'Community Rewards System',
    description: 'Implement a community rewards system that supports local trading and exchange.',
    stage: GameStage.LATE,
    type: MilestoneType.TRANSFORMATION,
    completed: false,
    requirements: [
      {
        type: 'resourceAmount',
        target: 'organization',
        value: 300
      },
      {
        type: 'resourceAmount',
        target: 'connections',
        value: 400
      },
      {
        type: 'resourceAmount',
        target: 'awareness',
        value: 350
      }
    ],
    unlocks: ['economic-autonomy'],
    order: 11,
    visible: false
  },
  {
    id: 'housing-collective',
    name: 'Community Housing Initiative',
    description: 'Create community-focused housing solutions and support systems.',
    stage: GameStage.LATE,
    type: MilestoneType.MOVEMENT,
    completed: false,
    requirements: [
      {
        type: 'resourceAmount',
        target: 'land',
        value: 100
      },
      {
        type: 'resourceAmount',
        target: 'materials',
        value: 500
      },
      {
        type: 'resourceAmount',
        target: 'organization',
        value: 350
      }
    ],
    unlocks: ['housing-security'],
    order: 12,
    visible: false
  },
  {
    id: 'regional-network',
    name: 'Regional Community Network',
    description: 'Connect multiple communities in a regional cooperation network.',
    stage: GameStage.LATE,
    type: MilestoneType.ORGANIZATION,
    completed: false,
    requirements: [
      {
        type: 'resourceAmount',
        target: 'connections',
        value: 600
      },
      {
        type: 'resourceAmount',
        target: 'organization',
        value: 400
      }
    ],
    unlocks: ['regional-coordination'],
    order: 13,
    visible: false
  },
  {
    id: 'democratic-workplaces',
    name: 'Collaborative Workplace Initiative',
    description: 'Create more inclusive and collaborative workplaces.',
    stage: GameStage.LATE,
    type: MilestoneType.TRANSFORMATION,
    completed: false,
    requirements: [
      {
        type: 'resourceAmount',
        target: 'awareness',
        value: 500
      },
      {
        type: 'resourceAmount',
        target: 'connections',
        value: 500
      },
      {
        type: 'resourceAmount',
        target: 'organization',
        value: 450
      }
    ],
    unlocks: ['workplace-democracy'],
    order: 14,
    visible: false
  },
  {
    id: 'popular-assembly',
    name: 'Community Assembly Formation',
    description: 'Create inclusive decision-making structures for community governance.',
    stage: GameStage.LATE,
    type: MilestoneType.TRANSFORMATION,
    completed: false,
    requirements: [
      {
        type: 'resourceAmount',
        target: 'connections',
        value: 700
      },
      {
        type: 'resourceAmount',
        target: 'awareness',
        value: 600
      },
      {
        type: 'resourceAmount',
        target: 'organization',
        value: 500
      }
    ],
    unlocks: ['direct-democracy'],
    order: 15,
    visible: false
  }
];

/**
 * End game milestones
 */
export const endGameMilestones: Milestone[] = [
  {
    id: 'autonomous-zone',
    name: 'Integrated Community Zone',
    description: 'Establish a self-sustaining community zone with innovative social structures.',
    stage: GameStage.END_GAME,
    type: MilestoneType.TRANSFORMATION,
    completed: false,
    requirements: [
      {
        type: 'resourceAmount',
        target: 'land',
        value: 200
      },
      {
        type: 'resourceAmount',
        target: 'materials',
        value: 1000
      },
      {
        type: 'resourceAmount',
        target: 'organization',
        value: 800
      },
      {
        type: 'resourceAmount',
        target: 'connections',
        value: 1000
      }
    ],
    unlocks: ['territorial-autonomy'],
    order: 16,
    visible: false
  },
  {
    id: 'systemic-alternative',
    name: 'Community Innovation Network',
    description: 'Implement a comprehensive community-based social innovation system.',
    stage: GameStage.END_GAME,
    type: MilestoneType.TRANSFORMATION,
    completed: false,
    requirements: [
      {
        type: 'resourceAmount',
        target: 'awareness',
        value: 1000
      },
      {
        type: 'resourceAmount',
        target: 'organization',
        value: 900
      },
      {
        type: 'resourceAmount',
        target: 'connections',
        value: 1200
      }
    ],
    unlocks: ['new-society'],
    order: 17,
    visible: false
  }
];

/**
 * Combined collection of all milestones
 */
export const allMilestones: Milestone[] = [
  ...earlyGameMilestones,
  ...midGameMilestones,
  ...lateGameMilestones,
  ...endGameMilestones
];