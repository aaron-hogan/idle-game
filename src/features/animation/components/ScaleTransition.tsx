import React, { useRef, useState, useEffect } from 'react';
import { useAnimation } from '../context/AnimationContext';

interface ScaleTransitionProps {
  in: boolean;
  duration?: number;
  easing?: string;
  from?: number;
  to?: number;
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

const ScaleTransition: React.FC<ScaleTransitionProps> = ({
  in: inProp,
  duration,
  easing,
  from = 0.8,
  to = 1,
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
    transform: `scale(${isVisible ? to : from})`,
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

export default ScaleTransition;