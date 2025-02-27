import React, { useState, useEffect, useRef } from 'react';
import { useAnimation } from '../context/AnimationContext';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  easing?: string;
  formatter?: (value: number) => string;
  className?: string;
  style?: React.CSSProperties;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration,
  easing,
  formatter = (val) => val.toFixed(0),
  className = '',
  style = {},
}) => {
  const animation = useAnimation();
  const [displayValue, setDisplayValue] = useState(value);
  const previousValueRef = useRef(value);
  const frameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  
  const actualDuration = duration ?? animation.getDuration('medium');
  const actualEasing = easing ?? animation.getEasing('standard');
  
  // Easing function map (cubic-bezier values converted to JavaScript functions)
  const easingFunctions = {
    'cubic-bezier(0.4, 0.0, 0.2, 1)': (t: number) => {
      // Standard easing (approximation of cubic-bezier)
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    'cubic-bezier(0.4, 0.0, 1, 1)': (t: number) => {
      // Accelerate easing (approximation of cubic-bezier)
      return t * (2 - t);
    },
    'cubic-bezier(0.0, 0.0, 0.2, 1)': (t: number) => {
      // Decelerate easing (approximation of cubic-bezier)
      return t * t;
    },
    'cubic-bezier(0.4, 0.0, 0.6, 1)': (t: number) => {
      // Sharp easing (approximation of cubic-bezier)
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    },
  };
  
  // Get the appropriate easing function
  const getEasingFunction = (easingValue: string) => {
    // If it's a predefined easing, use it
    if (easingValue in easingFunctions) {
      return easingFunctions[easingValue as keyof typeof easingFunctions];
    }
    
    // Default to linear easing
    return (t: number) => t;
  };
  
  // Reset animation when value changes
  useEffect(() => {
    // If animations are disabled, just set the value directly
    if (!animation.shouldAnimate('ui')) {
      setDisplayValue(value);
      previousValueRef.current = value;
      return;
    }
    
    const startValue = previousValueRef.current;
    const endValue = value;
    const easingFunction = getEasingFunction(actualEasing);
    
    // Skip animation if the difference is too small (performance optimization)
    const minAnimatableDifference = Math.max(Math.abs(endValue) * 0.01, 0.1);
    if (Math.abs(endValue - startValue) < minAnimatableDifference) {
      setDisplayValue(endValue);
      previousValueRef.current = endValue;
      return;
    }
    
    // Cancel any existing animation
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
    }
    
    // Animation function
    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }
      
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / actualDuration, 1);
      const easedProgress = easingFunction(progress);
      
      // Calculate current value
      const newValue = startValue + (endValue - startValue) * easedProgress;
      setDisplayValue(newValue);
      
      // Continue animation if not complete
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete
        setDisplayValue(endValue);
        previousValueRef.current = endValue;
        frameRef.current = null;
        startTimeRef.current = null;
      }
    };
    
    // Start animation
    frameRef.current = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [value, actualDuration, actualEasing, animation]);
  
  return (
    <span className={className} style={style}>
      {formatter(displayValue)}
    </span>
  );
};

export default AnimatedNumber;