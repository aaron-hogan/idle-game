import {
  TutorialCategory,
  TutorialContent,
  TutorialContextHelp,
  TutorialStep,
} from '../types/tutorial';

/**
 * Tutorial content data
 */
export const tutorialContent: Record<TutorialStep, TutorialContent> = {
  [TutorialStep.WELCOME]: {
    id: 'welcome',
    title: 'Welcome to Anti-Capitalist Idle Game',
    content:
      "Welcome to the revolution! This game simulates building a community-based alternative to capitalism. Let's get started with the basics.",
    category: TutorialCategory.BASICS,
    step: TutorialStep.WELCOME,
    nextStep: TutorialStep.RESOURCES,
    showOnce: true,
    required: true,
  },
  [TutorialStep.RESOURCES]: {
    id: 'resources',
    title: 'Resources',
    content:
      "Resources are the foundation of your community. You'll collect Food, Materials, Knowledge, and Community Power. Each resource enables different actions and buildings.",
    category: TutorialCategory.BASICS,
    step: TutorialStep.RESOURCES,
    nextStep: TutorialStep.BUILDINGS,
    previousStep: TutorialStep.WELCOME,
    required: true,
  },
  [TutorialStep.BUILDINGS]: {
    id: 'buildings',
    title: 'Buildings',
    content:
      "Buildings improve your community's capacity. They cost resources to build but provide ongoing benefits like resource production or worker capacity.",
    category: TutorialCategory.BASICS,
    step: TutorialStep.BUILDINGS,
    nextStep: TutorialStep.WORKERS,
    previousStep: TutorialStep.RESOURCES,
    required: true,
  },
  [TutorialStep.WORKERS]: {
    id: 'workers',
    title: 'Workers',
    content:
      'Workers represent community members who can be assigned to different tasks. Unlike capitalist exploitation, your workers volunteer based on community needs and personal interest.',
    category: TutorialCategory.BASICS,
    step: TutorialStep.WORKERS,
    nextStep: TutorialStep.EVENTS,
    previousStep: TutorialStep.BUILDINGS,
    required: true,
  },
  [TutorialStep.EVENTS]: {
    id: 'events',
    title: 'Events',
    content:
      "Events occur randomly during gameplay, representing challenges and opportunities. Your choices during events impact your community's development and can unlock new options.",
    category: TutorialCategory.INTERMEDIATE,
    step: TutorialStep.EVENTS,
    nextStep: TutorialStep.MILESTONES,
    previousStep: TutorialStep.WORKERS,
  },
  [TutorialStep.MILESTONES]: {
    id: 'milestones',
    title: 'Milestones',
    content:
      "Milestones represent significant achievements in your community's development. Reaching milestones unlocks new buildings, workers, and game mechanics.",
    category: TutorialCategory.INTERMEDIATE,
    step: TutorialStep.MILESTONES,
    nextStep: TutorialStep.SETTINGS,
    previousStep: TutorialStep.EVENTS,
  },
  [TutorialStep.SETTINGS]: {
    id: 'settings',
    title: 'Game Settings',
    content:
      'Access the settings panel to adjust game speed, toggle tutorials, and manage your save files. You can also restart the game if you want to try a different approach.',
    category: TutorialCategory.BASICS,
    step: TutorialStep.SETTINGS,
    previousStep: TutorialStep.MILESTONES,
  },
};

/**
 * Contextual help content
 */
export const contextualHelpContent: TutorialContextHelp[] = [
  {
    id: 'resource_food',
    title: 'Food',
    content:
      "Food sustains your community. It's produced by farms and gardens, and is consumed by workers. Without enough food, worker productivity will decrease.",
    relatedTutorials: ['resources'],
  },
  {
    id: 'resource_materials',
    title: 'Materials',
    content:
      "Materials represent physical resources like wood, stone, and metal. They're used to construct buildings and craft tools.",
    relatedTutorials: ['resources'],
  },
  {
    id: 'resource_knowledge',
    title: 'Knowledge',
    content:
      "Knowledge represents your community's collective learning and technical expertise. It unlocks new buildings and technologies.",
    relatedTutorials: ['resources'],
  },
  {
    id: 'resource_community_power',
    title: 'Community Power',
    content:
      'Community Power represents social cohesion and organizational capacity. It helps resist external pressures and enables collective action.',
    relatedTutorials: ['resources'],
  },
  {
    id: 'building_basics',
    title: 'Buildings',
    content:
      'Buildings cost resources to create but provide long-term benefits. Plan your construction to balance immediate needs with future growth.',
    relatedTutorials: ['buildings'],
  },
  {
    id: 'worker_assignment',
    title: 'Worker Assignment',
    content:
      'Assign workers by clicking on job categories. Workers contribute based on their skills and interests, not through coercion.',
    relatedTutorials: ['workers'],
  },
];
