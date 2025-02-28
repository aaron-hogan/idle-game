/**
 * Enumerates the possible categories for tasks
 */
export enum TaskCategory {
  ORGANIZING = 'organizing',
  COMMUNITY = 'community',
  EDUCATION = 'education',
  DIRECT_ACTION = 'direct_action',
  MUTUAL_AID = 'mutual_aid',
}

/**
 * Enumerates the possible statuses for a task
 */
export enum TaskStatus {
  AVAILABLE = 'available',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  LOCKED = 'locked',
}

/**
 * Represents a requirement that must be met to unlock a task
 */
export interface TaskRequirement {
  /** The type of requirement (resource amount, structure level, etc.) */
  type: 'resource' | 'structure' | 'gameStage' | 'taskCompleted';

  /** The ID of the entity this requirement is checking */
  id: string;

  /** The required value to meet this requirement */
  value: number;
}

/**
 * Represents a task or activity that the player can initiate
 */
export interface Task {
  /** Unique identifier for the task */
  id: string;

  /** Display name of the task */
  name: string;

  /** Description of the task and its purpose */
  description: string;

  /** Category the task belongs to */
  category: TaskCategory;

  /** Duration of the task in seconds */
  duration: number;

  /** Resources required to start the task */
  cost: Record<string, number>;

  /** Resources rewarded when the task completes */
  rewards: Record<string, number>;

  /** Current status of the task */
  status: TaskStatus;

  /** Current progress of the task (0-100) */
  progress: number;

  /** Requirements that must be met to unlock this task */
  requirements: TaskRequirement[];

  /** Whether this task can be repeated after completion */
  repeatable: boolean;

  /** Cooldown time in seconds before a repeatable task can be started again */
  cooldown?: number;

  /** Time when the task was started (used for progress calculation) */
  startTime?: number;

  /** Time when the task will complete (used for progress calculation) */
  endTime?: number;

  /** Number of times this task has been completed */
  completionCount: number;

  /** Optional icon for the task */
  icon?: string;
}

/**
 * Initial task data
 */
export const initialTasks: Omit<
  Task,
  'status' | 'progress' | 'startTime' | 'endTime' | 'completionCount'
>[] = [
  {
    id: 'distribute_flyers',
    name: 'Distribute Flyers',
    description: 'Spread awareness by distributing informational flyers in the community.',
    category: TaskCategory.ORGANIZING,
    duration: 60, // 1 minute
    cost: {
      collective_bargaining_power: 5,
    },
    rewards: {
      solidarity: 10,
      community_trust: 5,
    },
    requirements: [],
    repeatable: true,
    cooldown: 120, // 2 minutes
    icon: 'flyer',
  },
  {
    id: 'community_meeting',
    name: 'Host Community Meeting',
    description: 'Organize a meeting to discuss community needs and build solidarity.',
    category: TaskCategory.COMMUNITY,
    duration: 300, // 5 minutes
    cost: {
      collective_bargaining_power: 15,
      solidarity: 10,
    },
    rewards: {
      solidarity: 30,
      community_trust: 20,
      collective_bargaining_power: 5,
    },
    requirements: [
      {
        type: 'resource',
        id: 'solidarity',
        value: 20,
      },
    ],
    repeatable: true,
    cooldown: 600, // 10 minutes
    icon: 'meeting',
  },
  {
    id: 'workplace_organizing',
    name: 'Workplace Organizing',
    description: 'Organize within workplaces to build worker power and identify issues.',
    category: TaskCategory.ORGANIZING,
    duration: 600, // 10 minutes
    cost: {
      collective_bargaining_power: 25,
      solidarity: 15,
    },
    rewards: {
      collective_bargaining_power: 40,
      solidarity: 20,
    },
    requirements: [
      {
        type: 'structure',
        id: 'union_office',
        value: 1,
      },
    ],
    repeatable: true,
    cooldown: 900, // 15 minutes
    icon: 'workplace',
  },
  {
    id: 'mutual_aid_project',
    name: 'Mutual Aid Project',
    description: 'Organize direct assistance to meet community needs and build community trust.',
    category: TaskCategory.MUTUAL_AID,
    duration: 450, // 7.5 minutes
    cost: {
      collective_bargaining_power: 20,
      solidarity: 20,
    },
    rewards: {
      community_trust: 40,
      solidarity: 15,
    },
    requirements: [
      {
        type: 'resource',
        id: 'community_trust',
        value: 10,
      },
    ],
    repeatable: true,
    cooldown: 300, // 5 minutes
    icon: 'mutual_aid',
  },
  {
    id: 'educational_workshop',
    name: 'Educational Workshop',
    description: 'Host a workshop to educate community members on important issues.',
    category: TaskCategory.EDUCATION,
    duration: 360, // 6 minutes
    cost: {
      collective_bargaining_power: 15,
      solidarity: 10,
    },
    rewards: {
      collective_bargaining_power: 20,
      solidarity: 25,
      community_trust: 10,
    },
    requirements: [
      {
        type: 'resource',
        id: 'collective_bargaining_power',
        value: 30,
      },
    ],
    repeatable: true,
    cooldown: 720, // 12 minutes
    icon: 'education',
  },
];
