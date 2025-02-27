import { 
  defaultAnimationConfig, 
  getDurationMultiplier,
  getAdjustedDuration
} from './animationConfig';

describe('Animation Configuration', () => {
  describe('defaultAnimationConfig', () => {
    it('should have the correct default values', () => {
      expect(defaultAnimationConfig.enabled).toBe(true);
      expect(defaultAnimationConfig.reducedMotion).toBe(false);
      expect(defaultAnimationConfig.performanceMode).toBe('high');
      
      // Check durations
      expect(defaultAnimationConfig.durations.veryFast).toBe(100);
      expect(defaultAnimationConfig.durations.fast).toBe(200);
      expect(defaultAnimationConfig.durations.medium).toBe(300);
      expect(defaultAnimationConfig.durations.slow).toBe(500);
      expect(defaultAnimationConfig.durations.verySlow).toBe(800);
      
      // Check easings
      expect(defaultAnimationConfig.easings.standard).toBe('cubic-bezier(0.4, 0.0, 0.2, 1)');
      expect(defaultAnimationConfig.easings.accelerate).toBe('cubic-bezier(0.4, 0.0, 1, 1)');
      expect(defaultAnimationConfig.easings.decelerate).toBe('cubic-bezier(0.0, 0.0, 0.2, 1)');
      expect(defaultAnimationConfig.easings.sharp).toBe('cubic-bezier(0.4, 0.0, 0.6, 1)');
    });
  });
  
  describe('getDurationMultiplier', () => {
    it('should return 1 for high performance mode', () => {
      expect(getDurationMultiplier('high')).toBe(1);
    });
    
    it('should return 0.7 for medium performance mode', () => {
      expect(getDurationMultiplier('medium')).toBe(0.7);
    });
    
    it('should return 0.5 for low performance mode', () => {
      expect(getDurationMultiplier('low')).toBe(0.5);
    });
    
    it('should return 1 for unknown performance mode', () => {
      // @ts-ignore - Testing invalid input
      expect(getDurationMultiplier('invalid')).toBe(1);
    });
  });
  
  describe('getAdjustedDuration', () => {
    it('should not adjust duration in high performance mode', () => {
      expect(getAdjustedDuration(300, 'high')).toBe(300);
    });
    
    it('should reduce duration by 30% in medium performance mode', () => {
      expect(getAdjustedDuration(300, 'medium')).toBe(210);
    });
    
    it('should reduce duration by 50% in low performance mode', () => {
      expect(getAdjustedDuration(300, 'low')).toBe(150);
    });
    
    it('should round the result to whole numbers', () => {
      expect(getAdjustedDuration(301, 'medium')).toBe(211);
    });
  });
});