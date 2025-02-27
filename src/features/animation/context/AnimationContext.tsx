import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  AnimationConfig, 
  defaultAnimationConfig,
  AnimationSpeed,
  EasingType,
  AnimationType,
  PerformanceMode,
  getAdjustedDuration
} from '../config/animationConfig';

interface AnimationContextValue {
  config: AnimationConfig;
  shouldAnimate: (type?: AnimationType) => boolean;
  getDuration: (speed: AnimationSpeed) => number;
  getEasing: (type: EasingType) => string;
  setAnimationsEnabled: (enabled: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
  setPerformanceMode: (mode: PerformanceMode) => void;
}

const AnimationContext = createContext<AnimationContextValue | undefined>(undefined);

export const useAnimation = (): AnimationContextValue => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
};

interface AnimationProviderProps {
  children: ReactNode;
  initialConfig?: Partial<AnimationConfig>;
}

export const AnimationProvider: React.FC<AnimationProviderProps> = ({ 
  children,
  initialConfig = {}
}) => {
  const [config, setConfig] = useState<AnimationConfig>({
    ...defaultAnimationConfig,
    ...initialConfig
  });

  // Check for user's reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const updateReducedMotion = () => {
      setConfig(prevConfig => ({
        ...prevConfig,
        reducedMotion: mediaQuery.matches
      }));
    };
    
    // Set initial value
    updateReducedMotion();
    
    // Listen for changes
    mediaQuery.addEventListener('change', updateReducedMotion);
    
    return () => {
      mediaQuery.removeEventListener('change', updateReducedMotion);
    };
  }, []);

  // Create context value with performance optimization using useMemo
  const contextValue = useMemo(() => {
    return {
      config,
      
      shouldAnimate: (type?: AnimationType): boolean => {
        // Don't animate if animations are disabled globally
        if (!config.enabled) return false;
        
        // Don't animate if reduced motion is preferred
        if (config.reducedMotion) return false;
        
        // If a specific type is provided, we could add more granular control here
        return true;
      },
      
      getDuration: (speed: AnimationSpeed): number => {
        const baseDuration = config.durations[speed];
        return getAdjustedDuration(baseDuration, config.performanceMode);
      },
      
      getEasing: (type: EasingType): string => {
        return config.easings[type];
      },
      
      setAnimationsEnabled: (enabled: boolean): void => {
        setConfig(prevConfig => ({
          ...prevConfig,
          enabled
        }));
      },
      
      setReducedMotion: (reduced: boolean): void => {
        setConfig(prevConfig => ({
          ...prevConfig,
          reducedMotion: reduced
        }));
      },
      
      setPerformanceMode: (mode: PerformanceMode): void => {
        setConfig(prevConfig => ({
          ...prevConfig,
          performanceMode: mode
        }));
      }
    };
  }, [config]);

  return (
    <AnimationContext.Provider value={contextValue}>
      {children}
    </AnimationContext.Provider>
  );
};