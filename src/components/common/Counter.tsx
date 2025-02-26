import React, { useState, useRef } from 'react';
import Dropdown from '../ui/Dropdown';
import './Counter.css';

export interface CounterProps {
  // Basic properties
  icon: string;
  iconType?: 'day' | 'power' | 'knowledge' | 'materials' | 'community' | 'currency' | 'default';
  value: string | number;
  
  // Optional rate/progress properties
  rate?: string | number;
  rateType?: 'positive' | 'negative' | 'neutral';
  progress?: number; // 0 to 1 for fill progress
  
  // Dropdown properties
  hasDropdown?: boolean;
  dropdownTrigger?: string; // If not provided, will use rate
  dropdownItems?: Array<{
    label: string;
    onClick: () => void;
    isActive?: boolean;
  }>;
  dropdownTitle?: string;
  
  // Tooltip properties
  tooltip?: {
    title: string;
    description?: string;
    details?: Array<{
      label: string;
      value: string | number;
    }>;
  };
  
  // Style properties
  className?: string;
  minWidth?: string;
}

/**
 * Unified counter component for consistent display of game metrics
 */
const Counter: React.FC<CounterProps> = ({
  // Basic props
  icon,
  iconType = 'default',
  value,
  
  // Rate and progress
  rate,
  rateType = 'neutral',
  progress = 0,
  
  // Dropdown props
  hasDropdown = false,
  dropdownTrigger,
  dropdownItems = [],
  dropdownTitle = 'Options',
  
  // Tooltip props
  tooltip,
  
  // Style props
  className = '',
  minWidth,
}) => {
  // State for tooltip and dropdown
  const [showTooltip, setShowTooltip] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Refs for positioning
  const counterRef = useRef<HTMLDivElement>(null);
  const rateRef = useRef<HTMLSpanElement>(null);
  const [rateRect, setRateRect] = useState<DOMRect | null>(null);
  
  // Format the progress style
  const progressStyle = {
    width: `${Math.min(Math.max(progress, 0), 1) * 100}%`,
  };
  
  // Custom min-width if specified
  const customStyle = minWidth ? { minWidth } : {};
  
  // Toggle dropdown
  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasDropdown) return;
    
    // Get the dropdown trigger position
    if (rateRef.current) {
      setRateRect(rateRef.current.getBoundingClientRect());
    }
    setShowDropdown(!showDropdown);
  };

  return (
    <div 
      className={`counter ${className}`}
      ref={counterRef}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="counter-container">
        <div 
          className="counter-display" 
          style={customStyle}
        >
          {/* Progress indicator (if specified) */}
          {progress > 0 && (
            <div 
              className="counter-progress" 
              style={progressStyle}
              aria-hidden="true"
            />
          )}
          
          {/* Left icon */}
          <span className={`counter-icon ${iconType}`} title={iconType}>
            {icon}
          </span>
          
          {/* Center value */}
          <span className="counter-value">
            {value}
          </span>
          
          {/* Right rate/dropdown trigger */}
          {(rate || hasDropdown) && (
            <span 
              ref={rateRef}
              className={`counter-rate ${rateType} ${hasDropdown ? 'dropdown-trigger' : ''}`}
              onClick={hasDropdown ? toggleDropdown : undefined}
              title={hasDropdown ? 'Click for options' : undefined}
            >
              {dropdownTrigger || rate}
            </span>
          )}
        </div>
        
        {/* Dropdown (if enabled) */}
        {hasDropdown && (
          <Dropdown
            isOpen={showDropdown}
            onClose={() => setShowDropdown(false)}
            triggerRect={rateRect}
            position="bottom-right"
            className="counter-dropdown"
          >
            <div className="dropdown-header">{dropdownTitle}</div>
            <div className="dropdown-group">
              {dropdownItems.map((item, index) => (
                <button
                  key={index}
                  className={`dropdown-item ${item.isActive ? 'active' : ''}`}
                  onClick={item.onClick}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </Dropdown>
        )}
        
        {/* Tooltip (if specified) */}
        {tooltip && showTooltip && (
          <div className="counter-tooltip">
            <div className="tooltip-title">{tooltip.title}</div>
            {tooltip.description && (
              <div className="tooltip-description">{tooltip.description}</div>
            )}
            {tooltip.details && tooltip.details.length > 0 && (
              <div className="tooltip-details">
                {tooltip.details.map((detail, index) => (
                  <React.Fragment key={index}>
                    <div>{detail.label}:</div>
                    <div>{detail.value}</div>
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Counter;