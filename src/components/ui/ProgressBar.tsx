import React from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  value: number; // Value between 0 and 1
  showLabel?: boolean;
  labelPosition?: 'inside' | 'outside';
  size?: 'small' | 'medium' | 'large';
  color?: string;
  backgroundColor?: string;
  className?: string;
  label?: string;
  precision?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  showLabel = true,
  labelPosition = 'inside',
  size = 'medium',
  color,
  backgroundColor,
  className = '',
  label,
  precision = 0,
}) => {
  // Ensure value is between 0 and 1
  const clampedValue = Math.max(0, Math.min(1, value));

  // Convert to percentage
  const percentage = (clampedValue * 100).toFixed(precision);

  const progressBarClasses = [
    'progress-bar',
    `progress-bar-${size}`,
    labelPosition === 'inside' ? 'progress-bar-label-inside' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const progressStyle = {
    width: `${percentage}%`,
    backgroundColor: color,
  };

  const containerStyle = {
    backgroundColor,
  };

  const displayLabel = label || `${percentage}%`;

  return (
    <div className="progress-bar-container">
      <div className={progressBarClasses} style={containerStyle}>
        <div className="progress-bar-fill" style={progressStyle}>
          {showLabel && labelPosition === 'inside' && (
            <span className="progress-bar-label">{displayLabel}</span>
          )}
        </div>
      </div>

      {showLabel && labelPosition === 'outside' && (
        <span className="progress-bar-label progress-bar-label-outside">{displayLabel}</span>
      )}
    </div>
  );
};

export default ProgressBar;
