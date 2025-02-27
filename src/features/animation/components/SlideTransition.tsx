import React, { useRef, useState, useEffect } from 'react';
import { useAnimation } from '../context/AnimationContext';

interface SlideTransitionProps {
  in: boolean;
  direction: 'up' | 'down' | 'left' | 'right';
  distance?: string | number;
  duration?: number;
  easing?: string;
  unmountOnExit?: boolean;
  mountOnEnter?: boolean;
  onEnter?: () => void;
  onEntered?: () => void;
  onExit?: () => void;
  onExited?: () => void;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

const SlideTransition: React.FC<SlideTransitionProps> = ({
  in: inProp,
  direction,
  distance = '20px',
  duration,
  easing,
  unmountOnExit = false,
  mountOnEnter = false,
  onEnter,
  onEntered,
  onExit,
  onExited,
  className = '',
  style = {},
  children,
}) => {
  const animation = useAnimation();
  const [shouldRender, setShouldRender] = useState(inProp || !mountOnEnter);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isVisible, setIsVisible] = useState(inProp);
  const nodeRef = useRef<HTMLDivElement>(null);
  
  const actualDuration = duration ?? animation.getDuration('medium');
  const actualEasing = easing ?? animation.getEasing('standard');
  
  // Calculate transform based on direction
  const getTransform = (visible: boolean) => {
    if (visible) return 'translate(0, 0)';
    
    // Convert distance to string with px if it's a number
    const dist = typeof distance === 'number' ? `${distance}px` : distance;
    
    switch (direction) {
      case 'up':
        return `translateY(${dist})`;
      case 'down':
        return `translateY(-${dist})`;
      case 'left':
        return `translateX(${dist})`;
      case 'right':
        return `translateX(-${dist})`;
      default:
        return 'translate(0, 0)';
    }
  };
  
  // Handle mounting and unmounting based on inProp changes
  useEffect(() => {
    if (inProp) {
      // Element should enter
      if (mountOnEnter && !shouldRender) {
        setShouldRender(true);
      }
    } else if (unmountOnExit && shouldRender && !isTransitioning) {
      // Schedule unmount after exit transition completes
      const timeout = setTimeout(() => {
        setShouldRender(false);
      }, actualDuration);
      
      return () => clearTimeout(timeout);
    }
  }, [inProp, mountOnEnter, unmountOnExit, shouldRender, isTransitioning, actualDuration]);
  
  // Handle visibility and transition state
  useEffect(() => {
    if (!shouldRender) return;
    
    if (inProp && !isVisible) {
      // Entering
      setIsTransitioning(true);
      onEnter?.();
      
      // Need a small delay to ensure CSS transition applies
      const enterTimeout = setTimeout(() => {
        setIsVisible(true);
      }, 10);
      
      // Schedule onEntered callback
      const enteredTimeout = setTimeout(() => {
        setIsTransitioning(false);
        onEntered?.();
      }, actualDuration + 10);
      
      return () => {
        clearTimeout(enterTimeout);
        clearTimeout(enteredTimeout);
      };
    } else if (!inProp && isVisible) {
      // Exiting
      setIsTransitioning(true);
      onExit?.();
      setIsVisible(false);
      
      // Schedule onExited callback
      const exitedTimeout = setTimeout(() => {
        setIsTransitioning(false);
        onExited?.();
      }, actualDuration);
      
      return () => clearTimeout(exitedTimeout);
    }
  }, [inProp, isVisible, shouldRender, actualDuration, onEnter, onEntered, onExit, onExited]);
  
  if (!shouldRender) {
    return null;
  }
  
  // Combine styles
  const transitionStyle: React.CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: getTransform(isVisible),
    transition: animation.shouldAnimate('ui') 
      ? `opacity ${actualDuration}ms ${actualEasing}, transform ${actualDuration}ms ${actualEasing}` 
      : 'none',
    ...style
  };
  
  return (
    <div 
      ref={nodeRef}
      className={className} 
      style={transitionStyle}
    >
      {children}
    </div>
  );
};

export default SlideTransition;