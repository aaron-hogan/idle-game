/**
 * Interface for the main game state
 */
export interface GameState {
  /** Current game stage */
  gameStage: number;

  /** Timestamp of the last tick */
  lastTickTimestamp: number;

  /** Last time the game was saved */
  lastSaveTime: number;

  /** Whether the game is currently running */
  isRunning: boolean;

  /** Tick rate in updates per second */
  tickRate: number;

  /** Game time scale multiplier */
  gameTimeScale: number;

  /** Whether offline progress is enabled */
  offlineProgressEnabled: boolean;

  /** Last save timestamp */
  lastSaveTimestamp: number;

  /** When the game was first started */
  startDate: number;

  /** Timestamp of when the game started */
  gameStartTimestamp: number;

  /** Total play time in seconds */
  totalPlayTime: number;

  /** Game version */
  version?: string;

  /** Whether development mode is enabled */
  developmentMode?: boolean;

  /** Whether the game is in offline mode */
  offline?: boolean;

  /** Legacy: Timestamp of the last game tick (for backward compatibility) */
  lastTick?: number;
}
