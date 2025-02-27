/**
 * Configuration file for the animation system.
 * Contains default values and types for animation settings.
 */

export type PerformanceMode = 'high' | 'medium' | 'low';
export type AnimationSpeed = 'veryFast' | 'fast' | 'medium' | 'slow' | 'verySlow';
export type EasingType = 'standard' | 'accelerate' | 'decelerate' | 'sharp';
export type AnimationType = 'resource' | 'notification' | 'progress' | 'achievement' | 'ui';

export interface AnimationConfig {
  // Global settings
  enabled: boolean;
  reducedMotion: boolean;
  performanceMode: PerformanceMode;
  
  // Timing values (in ms)
  durations: {
    veryFast: number;
    fast: number;
    medium: number;
    slow: number;
    verySlow: number;
  };
  
  // Easing functions
  easings: {
    standard: string;
    accelerate: string;
    decelerate: string;
    sharp: string;
  };
}

/**
 * Default animation configuration
 */
export const defaultAnimationConfig: AnimationConfig = {
  enabled: true,
  reducedMotion: false,
  performanceMode: 'high',
  
  durations: {
    veryFast: 100,
    fast: 200,
    medium: 300,
    slow: 500,
    verySlow: 800,
  },
  
  easings: {
    standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
    decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
    sharp: 'cubic-bezier(0.4, 0.0, 0.6, 1)',
  },
};

/**
 * Generates performance-adjusted durations based on the current performance mode
 */
export const getDurationMultiplier = (performanceMode: PerformanceMode): number => {
  switch (performanceMode) {
    case 'high':
      return 1;
    case 'medium':
      return 0.7; // 30% faster animations for medium performance
    case 'low':
      return 0.5; // 50% faster animations for low performance
    default:
      return 1;
  }
};

/**
 * Adjusts animation duration based on performance mode
 */
export const getAdjustedDuration = (
  duration: number,
  performanceMode: PerformanceMode
): number => {
  return Math.round(duration * getDurationMultiplier(performanceMode));
};