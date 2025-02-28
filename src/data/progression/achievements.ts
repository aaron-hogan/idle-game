/**
 * Initial achievements data for the game's progression system
 */
import { Achievement, AchievementType } from '../../interfaces/progression';

/**
 * Resource-based achievements
 */
export const resourceAchievements: Achievement[] = [
  {
    id: 'first-collective-power',
    name: 'Power in Numbers',
    description: 'Begin your journey by accumulating initial community influence.',
    type: AchievementType.RESOURCE,
    unlocked: false,
    requirements: [
      {
        type: 'resourceAmount',
        target: 'collective-power',
        value: 5,
      },
    ],
    rewards: [
      {
        type: 'resource',
        target: 'collective-power',
        value: 5,
      },
    ],
    hidden: false,
    hint: 'Start gathering community influence resources',
  },
  {
    id: 'resource-gatherer',
    name: 'Resource Gatherer',
    description: 'Accumulate a substantial amount of basic resources.',
    type: AchievementType.RESOURCE,
    unlocked: false,
    requirements: [
      {
        type: 'resourceAmount',
        target: 'materials',
        value: 50,
      },
    ],
    rewards: [
      {
        type: 'boost',
        target: 'materials',
        value: 0.1, // 10% boost to materials generation
      },
    ],
    hidden: false,
    hint: 'Keep gathering materials',
  },
  {
    id: 'connection-network',
    name: 'Connection Network',
    description: 'Build an extensive network of community connections.',
    type: AchievementType.RESOURCE,
    unlocked: false,
    requirements: [
      {
        type: 'resourceAmount',
        target: 'connections',
        value: 100,
      },
    ],
    rewards: [
      {
        type: 'boost',
        target: 'connections',
        value: 0.15, // 15% boost to connections generation
      },
    ],
    hidden: false,
    hint: 'Expand your community connections',
  },
  {
    id: 'organized-movement',
    name: 'Community Organization',
    description: 'Develop substantial organizational capacity for your community.',
    type: AchievementType.RESOURCE,
    unlocked: false,
    requirements: [
      {
        type: 'resourceAmount',
        target: 'organization',
        value: 100,
      },
    ],
    rewards: [
      {
        type: 'boost',
        target: 'organization',
        value: 0.15, // 15% boost to organization generation
      },
    ],
    hidden: false,
    hint: 'Build organizational capacity',
  },
];

/**
 * Strategic achievements
 */
export const strategicAchievements: Achievement[] = [
  {
    id: 'strategic-planning',
    name: 'Strategic Vision',
    description: 'Complete 3 milestones demonstrating strategic planning ability.',
    type: AchievementType.STRATEGIC,
    unlocked: false,
    requirements: [
      {
        type: 'milestonesCompleted',
        value: 3,
      },
    ],
    rewards: [
      {
        type: 'boost',
        target: 'organization',
        value: 0.2, // 20% boost to organization generation
      },
    ],
    hidden: false,
    hint: 'Complete your first milestones',
  },
  {
    id: 'movement-builder',
    name: 'Community Builder',
    description: 'Complete community-related milestones to strengthen collective bonds.',
    type: AchievementType.STRATEGIC,
    unlocked: false,
    requirements: [
      {
        type: 'milestonesCompleted',
        target: 'MOVEMENT',
        value: 2,
      },
    ],
    rewards: [
      {
        type: 'resource',
        target: 'connections',
        value: 30,
      },
    ],
    hidden: false,
    hint: 'Focus on building community milestones',
  },
  {
    id: 'resource-strategist',
    name: 'Resource Strategist',
    description: 'Efficiently manage resources by completing resource milestones.',
    type: AchievementType.STRATEGIC,
    unlocked: false,
    requirements: [
      {
        type: 'milestonesCompleted',
        target: 'RESOURCE',
        value: 2,
      },
    ],
    rewards: [
      {
        type: 'resource',
        target: 'materials',
        value: 50,
      },
    ],
    hidden: false,
    hint: 'Complete resource-focused milestones',
  },
];

/**
 * Ethical achievements
 */
export const ethicalAchievements: Achievement[] = [
  {
    id: 'solidarity-principles',
    name: 'Community Principles',
    description: 'Maintain consistently ethical choices in community building.',
    type: AchievementType.ETHICAL,
    unlocked: false,
    requirements: [
      {
        type: 'gameTime',
        value: 3600, // 1 hour of gameplay
      },
      {
        type: 'milestonesCompleted',
        value: 5,
      },
    ],
    rewards: [
      {
        type: 'resource',
        target: 'connections',
        value: 25,
      },
      {
        type: 'resource',
        target: 'awareness',
        value: 25,
      },
    ],
    hidden: true,
    hint: 'Continue playing and making progress ethically',
  },
  {
    id: 'community-care',
    name: 'Community Care',
    description: 'Demonstrate principles of mutual support and community assistance.',
    type: AchievementType.ETHICAL,
    unlocked: false,
    requirements: [
      {
        type: 'resourceAmount',
        target: 'connections',
        value: 150,
      },
      {
        type: 'milestonesCompleted',
        target: 'ORGANIZATION',
        value: 2,
      },
    ],
    rewards: [
      {
        type: 'boost',
        target: 'awareness',
        value: 0.2, // 20% boost to awareness generation
      },
    ],
    hidden: true,
    hint: 'Focus on connections and organization',
  },
];

/**
 * Community achievements
 */
export const communityAchievements: Achievement[] = [
  {
    id: 'community-organizer',
    name: 'Community Organizer',
    description: 'Build strong community ties and leadership structures.',
    type: AchievementType.COMMUNITY,
    unlocked: false,
    requirements: [
      {
        type: 'resourceAmount',
        target: 'connections',
        value: 200,
      },
      {
        type: 'resourceAmount',
        target: 'organization',
        value: 100,
      },
    ],
    rewards: [
      {
        type: 'resource',
        target: 'awareness',
        value: 50,
      },
    ],
    hidden: false,
    hint: 'Build connections and organization together',
  },
  {
    id: 'solidarity-network',
    name: 'Support Network',
    description: 'Create a powerful network of interconnected community support.',
    type: AchievementType.COMMUNITY,
    unlocked: false,
    requirements: [
      {
        type: 'milestonesCompleted',
        target: 'ORGANIZATION',
        value: 3,
      },
      {
        type: 'resourceAmount',
        target: 'connections',
        value: 250,
      },
    ],
    rewards: [
      {
        type: 'boost',
        target: 'connections',
        value: 0.25, // 25% boost to connections generation
      },
    ],
    hidden: false,
    hint: 'Continue building community organizations',
  },
];

/**
 * Resistance achievements
 */
export const resistanceAchievements: Achievement[] = [
  {
    id: 'first-resistance',
    name: 'First Challenge',
    description: 'Begin building strategies to overcome social challenges.',
    type: AchievementType.RESISTANCE,
    unlocked: false,
    requirements: [
      {
        type: 'milestonesCompleted',
        target: 'RESISTANCE',
        value: 1,
      },
    ],
    rewards: [
      {
        type: 'resource',
        target: 'organization',
        value: 25,
      },
    ],
    hidden: false,
    hint: 'Complete challenge-focused milestones',
  },
  {
    id: 'solidarity-forever',
    name: 'Community Forever',
    description: 'Build enduring community structures that overcome challenges.',
    type: AchievementType.RESISTANCE,
    unlocked: false,
    requirements: [
      {
        type: 'milestonesCompleted',
        target: 'ORGANIZATION',
        value: 4,
      },
      {
        type: 'milestonesCompleted',
        target: 'RESISTANCE',
        value: 2,
      },
    ],
    rewards: [
      {
        type: 'boost',
        target: 'organization',
        value: 0.25, // 25% boost to organization generation
      },
    ],
    hidden: true,
    hint: 'Focus on both organization and challenges',
  },
];

/**
 * Timed achievements
 */
export const timedAchievements: Achievement[] = [
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Make quick progress in the early stages of your community.',
    type: AchievementType.TIMED,
    unlocked: false,
    requirements: [
      {
        type: 'milestonesCompleted',
        value: 3,
      },
      {
        type: 'gameTime',
        value: 1800, // Within 30 minutes of gameplay
        operator: '<=',
      },
    ],
    rewards: [
      {
        type: 'resource',
        target: 'awareness',
        value: 30,
      },
      {
        type: 'resource',
        target: 'connections',
        value: 30,
      },
    ],
    hidden: true,
    hint: 'Try to complete milestones quickly',
  },
  {
    id: 'persistent-organizer',
    name: 'Persistent Builder',
    description: 'Demonstrate long-term commitment to community building.',
    type: AchievementType.TIMED,
    unlocked: false,
    requirements: [
      {
        type: 'gameTime',
        value: 10800, // 3 hours of gameplay
      },
    ],
    rewards: [
      {
        type: 'boost',
        target: 'awareness',
        value: 0.2,
      },
      {
        type: 'boost',
        target: 'connections',
        value: 0.2,
      },
      {
        type: 'boost',
        target: 'organization',
        value: 0.2,
      },
    ],
    hidden: false,
    hint: 'Continue playing over time',
  },
];

/**
 * Special achievements
 */
export const specialAchievements: Achievement[] = [
  {
    id: 'new-world-vision',
    name: 'New Community Vision',
    description: 'See new possibilities for community development by reaching mid-game.',
    type: AchievementType.SPECIAL,
    unlocked: false,
    requirements: [
      {
        type: 'gameStage',
        value: 'MID',
      },
    ],
    rewards: [
      {
        type: 'boost',
        target: 'awareness',
        value: 0.3, // 30% boost to awareness generation
      },
    ],
    hidden: false,
    hint: 'Advance to the mid-game stage',
  },
  {
    id: 'revolutionary-potential',
    name: 'Innovation Potential',
    description: 'Develop the capacity for fundamental social innovation.',
    type: AchievementType.SPECIAL,
    unlocked: false,
    requirements: [
      {
        type: 'gameStage',
        value: 'LATE',
      },
    ],
    rewards: [
      {
        type: 'boost',
        target: 'organization',
        value: 0.3, // 30% boost to organization generation
      },
    ],
    hidden: false,
    hint: 'Advance to the late-game stage',
  },
  {
    id: 'another-world-is-possible',
    name: 'A Better Future Is Possible',
    description:
      'Demonstrate that communities can thrive through cooperation and collaborative effort.',
    type: AchievementType.SPECIAL,
    unlocked: false,
    requirements: [
      {
        type: 'gameStage',
        value: 'END_GAME',
      },
    ],
    rewards: [
      {
        type: 'boost',
        target: 'connections',
        value: 0.4, // 40% boost to connections generation
      },
      {
        type: 'boost',
        target: 'awareness',
        value: 0.4, // 40% boost to awareness generation
      },
      {
        type: 'boost',
        target: 'organization',
        value: 0.4, // 40% boost to organization generation
      },
    ],
    hidden: false,
    hint: 'Reach the final stage of the game',
  },
];

/**
 * Combined collection of all achievements
 */
export const allAchievements: Achievement[] = [
  ...resourceAchievements,
  ...strategicAchievements,
  ...ethicalAchievements,
  ...communityAchievements,
  ...resistanceAchievements,
  ...timedAchievements,
  ...specialAchievements,
];
