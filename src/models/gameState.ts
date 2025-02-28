import { Resource } from './resource';
import { Structure } from './structure';

/**
 * Represents the complete game state
 */
export interface GameState {
  /** Collection of all resources indexed by their id */
  resources: Record<string, Resource>;

  /** Collection of all structures indexed by their id */
  structures: Record<string, Structure>;

  /** Current game stage (0: early game, 1: mid game, 2: late game) */
  gameStage: number;

  /** Timestamp of the last save in milliseconds since epoch */
  lastSaveTime: number;

  /** Total time played in seconds */
  totalPlayTime: number;
}

/**
 * Initial state for a new game
 */
export const initialGameState: GameState = {
  resources: {},
  structures: {},
  gameStage: 0,
  lastSaveTime: Date.now(),
  totalPlayTime: 0,
};
