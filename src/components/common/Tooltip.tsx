import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  delay?: number;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 300,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  
  // Show the tooltip after the specified delay
  const showTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };
  
  // Hide the tooltip immediately
  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    setIsVisible(false);
  };
  
  // Clean up the timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  // Calculate the position classes
  const positionClass = `tooltip-${position}`;
  
  return (
    <div 
      className={`tooltip-container ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      {children}
      
      {isVisible && (
        <div 
          ref={tooltipRef}
          className={`tooltip ${positionClass}`}
          style={{
            position: 'absolute',
            zIndex: 1000,
            padding: '8px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            borderRadius: '4px',
            fontSize: '0.875rem',
            maxWidth: '250px',
            wordBreak: 'break-word'
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;