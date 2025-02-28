import React from 'react';

interface ProgressBarProps {
  current?: number;
  max?: number;
  progress?: number; // Alternative way to specify progress (0-100)
  label?: string; // Allow direct label specification
  className?: string;
  height?: number;
  color?: string;
  backgroundColor?: string;
  showLabel?: boolean;
  labelFormat?: (current: number, max: number) => string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  current = 0,
  max = 100,
  progress: directProgress,
  label: directLabel,
  className = '',
  height = 10,
  color = '#4caf50',
  backgroundColor = '#e0e0e0',
  showLabel = false,
  labelFormat = (current, max) => `${Math.round((current / max) * 100)}%`,
}) => {
  // Ensure the progress is between 0 and 100%
  const progress =
    directProgress !== undefined
      ? Math.min(100, Math.max(0, directProgress))
      : Math.min(100, Math.max(0, (current / max) * 100));

  // Create the styles for the progress bar
  const containerStyle = {
    height: `${height}px`,
    backgroundColor,
    borderRadius: `${height / 2}px`,
    overflow: 'hidden',
    position: 'relative' as const,
  };

  const fillStyle = {
    height: '100%',
    width: `${progress}%`,
    backgroundColor: color,
    transition: 'width 0.3s ease-in-out',
  };

  const labelStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: '#ffffff',
    fontSize: `${height * 0.7}px`,
    fontWeight: 'bold' as const,
    textShadow: '1px 1px 1px rgba(0,0,0,0.5)',
  };

  return (
    <div className={`progress-bar ${className}`} style={containerStyle}>
      <div className="progress-bar-fill" style={fillStyle}></div>
      {showLabel && (
        <div className="progress-bar-label" style={labelStyle}>
          {directLabel || labelFormat(current, max)}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
