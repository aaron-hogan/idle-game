/**
 * Interfaces for the game's progression system
 */

/**
 * Game stages, from early to end game
 */
export enum GameStage {
  EARLY = 'EARLY',
  MID = 'MID',
  LATE = 'LATE',
  END_GAME = 'END_GAME'
}

/**
 * Milestone types to categorize different kinds of milestones
 */
export enum MilestoneType {
  RESOURCE = 'RESOURCE',
  ORGANIZATION = 'ORGANIZATION',
  MOVEMENT = 'MOVEMENT',
  AWARENESS = 'AWARENESS',
  RESISTANCE = 'RESISTANCE',
  TRANSFORMATION = 'TRANSFORMATION',
  SPECIAL = 'SPECIAL'
}

/**
 * Achievement types to categorize different kinds of achievements
 */
export enum AchievementType {
  RESOURCE = 'RESOURCE',
  STRATEGIC = 'STRATEGIC',
  ETHICAL = 'ETHICAL',
  COMMUNITY = 'COMMUNITY',
  RESISTANCE = 'RESISTANCE',
  TIMED = 'TIMED',
  SPECIAL = 'SPECIAL'
}

/**
 * Requirement types for progression items
 */
export type RequirementType = 
  | 'resourceAmount'
  | 'resourceRate' 
  | 'milestonesCompleted'
  | 'achievementsUnlocked'
  | 'gameStage'
  | 'gameTime';

/**
 * Comparison operators for requirements
 */
export type ComparisonOperator = '>=' | '>' | '=' | '<' | '<=';

/**
 * Requirement for milestone or achievement completion
 */
export interface StageRequirement {
  type: RequirementType;
  target?: string;
  value: number | string | boolean;
  operator?: ComparisonOperator;
  /** Maintenance requirement - must be maintained for progress to continue */
  maintenance?: boolean;
}

/**
 * Reward types for achievements
 */
export type RewardType = 'resource' | 'boost' | 'multiplier' | 'unlockFeature';

/**
 * Reward for completing an achievement
 */
export interface AchievementReward {
  type: RewardType;
  target?: string;
  value: number | string | boolean;
}

/**
 * Milestone reward for completing a milestone
 */
export interface MilestoneReward {
  type: RewardType;
  target?: string;
  value: number | string | boolean;
  description: string;
}

/**
 * Milestone definition
 */
export interface Milestone {
  id: string;
  name: string;
  description: string;
  stage: GameStage;
  type: MilestoneType;
  completed: boolean;
  completedAt?: number;
  requirements: StageRequirement[];
  unlocks: string[];
  rewards?: MilestoneReward[];
  order: number;
  visible: boolean;
}

/**
 * Achievement definition
 */
export interface Achievement {
  id: string;
  name: string;
  description: string;
  type: AchievementType;
  unlocked: boolean;
  unlockedAt?: number;
  requirements: StageRequirement[];
  rewards?: AchievementReward[];
  hidden?: boolean;
  hint?: string;
}

/**
 * Normalized state structure for progression data
 */
export interface ProgressionState {
  currentStage: GameStage;
  milestones: Record<string, Milestone>;
  achievements: Record<string, Achievement>;
  milestoneIds: string[];
  achievementIds: string[];
  milestonesByStage: Record<GameStage, string[]>;
  milestonesByType: Record<MilestoneType, string[]>;
  achievementsByType: Record<AchievementType, string[]>;
  stageReachedAt: Record<GameStage, number | null>;
}