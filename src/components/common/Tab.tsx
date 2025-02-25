import React from 'react';
import './Tab.css';

interface TabProps {
  id: string;
  label: string;
  isActive?: boolean;
  onClick?: (id: string) => void;
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

const Tab: React.FC<TabProps> = ({
  id,
  label,
  isActive = false,
  onClick,
  className = '',
  disabled = false,
  icon,
}) => {
  // Handle tab click
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick(id);
    }
  };
  
  // Combine the classes
  const tabClasses = [
    'tab',
    isActive ? 'tab-active' : '',
    disabled ? 'tab-disabled' : '',
    className,
  ].filter(Boolean).join(' ');
  
  return (
    <div 
      className={tabClasses}
      onClick={handleClick}
      role="tab"
      aria-selected={isActive}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      id={`tab-${id}`}
    >
      {icon && <span className="tab-icon">{icon}</span>}
      <span className="tab-label">{label}</span>
    </div>
  );
};

export default Tab;