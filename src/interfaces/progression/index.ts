/**
 * Interfaces and types for the Progression System
 */

/**
 * Represents the different game stages
 */
export enum GameStage {
  EARLY = 'early',
  MID = 'mid',
  LATE = 'late',
  END_GAME = 'endGame',
}

/**
 * Milestone types categorize different kinds of milestones
 */
export enum MilestoneType {
  RESOURCE = 'resource',
  ORGANIZATION = 'organization',
  MOVEMENT = 'movement',
  AWARENESS = 'awareness',
  RESISTANCE = 'resistance',
  TRANSFORMATION = 'transformation',
  SPECIAL = 'special',
}

/**
 * Achievement types categorize different kinds of achievements
 */
export enum AchievementType {
  RESOURCE = 'resource',
  STRATEGIC = 'strategic',
  ETHICAL = 'ethical',
  COMMUNITY = 'community',
  RESISTANCE = 'resistance',
  TIMED = 'timed',
  SPECIAL = 'special',
}

/**
 * Represents a milestone in the game progression
 */
export interface Milestone {
  /** Unique identifier for the milestone */
  id: string;

  /** Display name of the milestone */
  name: string;

  /** Detailed description of the milestone */
  description: string;

  /** The game stage this milestone belongs to */
  stage: GameStage;

  /** Type of milestone */
  type: MilestoneType;

  /** Whether this milestone has been completed */
  completed: boolean;

  /** When this milestone was completed (timestamp) */
  completedAt?: number;

  /** Requirements that must be met to complete this milestone */
  requirements: StageRequirement[];

  /** Content or features unlocked by completing this milestone */
  unlocks?: string[];

  /** Sort order for display (lower values displayed first) */
  order: number;

  /** Whether this milestone should be visible to the player */
  visible: boolean;
}

/**
 * Represents an achievement in the game
 */
export interface Achievement {
  /** Unique identifier for the achievement */
  id: string;

  /** Display name of the achievement */
  name: string;

  /** Detailed description of the achievement */
  description: string;

  /** Type of achievement */
  type: AchievementType;

  /** Whether this achievement has been unlocked */
  unlocked: boolean;

  /** When this achievement was unlocked (timestamp) */
  unlockedAt?: number;

  /** Requirements that must be met to unlock this achievement */
  requirements: StageRequirement[];

  /** Rewards given for unlocking this achievement */
  rewards?: AchievementReward[];

  /** Whether this achievement should be visible before unlocking */
  hidden: boolean;

  /** Optional hint to show for hidden achievements */
  hint?: string;
}

/**
 * Reward for unlocking an achievement
 */
export interface AchievementReward {
  /** Type of reward (e.g., 'resource', 'boost', 'feature') */
  type: string;

  /** Target of the reward (e.g., resource ID) */
  target?: string;

  /** Value of the reward */
  value: number | boolean | string;
}

/**
 * Requirements for progressing to a new stage or unlocking content
 */
export interface StageRequirement {
  /** Type of requirement (e.g., 'resourceAmount', 'milestonesCompleted') */
  type: string;

  /** Target of the requirement (e.g., resource ID, milestone category) */
  target?: string;

  /** Value to compare against */
  value: number | boolean | string;

  /** Optional comparison operator (default: '>=' ) */
  operator?: '>=' | '>' | '=' | '<' | '<=';
}

/**
 * Overall progression state stored in Redux
 */
export interface ProgressionState {
  /** Current game stage */
  currentStage: GameStage;

  /** All milestones indexed by ID */
  milestones: Record<string, Milestone>;

  /** All achievements indexed by ID */
  achievements: Record<string, Achievement>;

  /** IDs of all milestones */
  milestoneIds: string[];

  /** IDs of all achievements */
  achievementIds: string[];

  /** Milestones grouped by stage */
  milestonesByStage: {
    [key in GameStage]?: string[];
  };

  /** Milestones grouped by type */
  milestonesByType: {
    [key in MilestoneType]?: string[];
  };

  /** Achievements grouped by type */
  achievementsByType: {
    [key in AchievementType]?: string[];
  };

  /** Date when the current stage was reached */
  stageReachedAt: Record<GameStage, number | null>;
}
