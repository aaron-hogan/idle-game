/**
 * Type declarations for deprecated modules
 * These are only used in deprecated components and won't be used in production code.
 */

// For the debug/deprecated modules
declare module './state/hooks' {
  export function useAppDispatch(): any;
  export function useAppSelector(selector: any): any;
}

declare module './state/selectors' {
  export function selectTotalPlayTime(state: any): number;
  export function selectTickRate(state: any): number;
  export function selectGameTimeScale(state: any): number;
  export function selectIsGameRunning(state: any): boolean;
}

declare module './core/GameLoop' {
  export class GameLoop {
    static getInstance(): any;
    start(): void;
    stop(): void;
    setTickRate(rate: number): void;
    setTimeScale(scale: number): void;
  }
}

declare module './utils/timeUtils' {
  export function getCurrentTime(): number;
  export function formatTimeElapsed(seconds: number): string;
}

declare module './state/gameSlice' {
  export function startGame(): any;
  export function stopGame(): any;
  export function setTickRate(rate: number): any;
  export function setGameTimeScale(scale: number): any;
}
