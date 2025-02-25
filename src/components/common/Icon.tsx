import React from 'react';

// List of available icons (placeholder - would be replaced with actual icons)
type IconType = 
  | 'people' 
  | 'building' 
  | 'resource' 
  | 'power' 
  | 'solidarity' 
  | 'community' 
  | 'money'
  | 'time'
  | 'info'
  | 'warning'
  | 'error'
  | 'success';

interface IconProps {
  type?: IconType;
  name?: string; // Allow name prop for compatability
  size?: number;
  color?: string;
  className?: string;
}

const Icon: React.FC<IconProps> = ({
  type,
  name,
  size = 24,
  color = 'currentColor',
  className = '',
}) => {
  // This would be replaced with actual icon rendering logic
  // For now, we'll just render a placeholder
  const iconType = type || (name as IconType) || 'info';
  
  return (
    <span 
      className={`icon icon-${iconType} ${className}`}
      style={{ 
        display: 'inline-block',
        width: `${size}px`,
        height: `${size}px`,
        color,
        backgroundColor: 'transparent',
        textAlign: 'center',
        lineHeight: `${size}px`,
        fontSize: `${size * 0.75}px`,
      }}
    >
      {/* Placeholder representation */}
      {iconType.charAt(0).toUpperCase()}
    </span>
  );
};

export default Icon;