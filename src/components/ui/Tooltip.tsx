import React, { useState, useRef, useEffect } from 'react';
import './Tooltip.css';

interface TooltipProps {
  content: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  delay?: number;
  children: React.ReactElement;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = 'top',
  delay = 300,
  children,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };
  
  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  };
  
  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  // Clone the child element to attach event handlers
  const childProps = {
    onMouseEnter: () => showTooltip(),
    onMouseLeave: () => hideTooltip(),
    onFocus: () => showTooltip(),
    onBlur: () => hideTooltip(),
  };
  
  const child = React.cloneElement(children, childProps);
  
  const tooltipClasses = [
    'tooltip-container',
    isVisible ? 'tooltip-visible' : '',
    `tooltip-${position}`,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className="tooltip-wrapper">
      {child}
      <div 
        ref={tooltipRef}
        className={tooltipClasses}
        role="tooltip"
        aria-hidden={!isVisible}
      >
        <div className="tooltip-content">
          {content}
        </div>
        <div className="tooltip-arrow"></div>
      </div>
    </div>
  );
};

export default Tooltip;