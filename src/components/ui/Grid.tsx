import React from 'react';
import './Grid.css';

interface GridProps {
  children: React.ReactNode;
  columns?: number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  gap?: string;
  autoFit?: boolean;
  minColumnWidth?: string;
  className?: string;
}

const Grid: React.FC<GridProps> = ({
  children,
  columns = 3,
  gap = '1rem',
  autoFit = false,
  minColumnWidth = '250px',
  className = '',
}) => {
  let gridStyle = {};
  
  if (typeof columns === 'number') {
    // Use a fixed number of columns
    gridStyle = {
      display: 'grid',
      gridTemplateColumns: autoFit 
        ? `repeat(auto-fit, minmax(${minColumnWidth}, 1fr))` 
        : `repeat(${columns}, 1fr)`,
      gap,
    };
  } else {
    // Use responsive columns
    gridStyle = {
      display: 'grid',
      gap,
    };
  }
  
  const gridClasses = [
    'game-grid',
    typeof columns !== 'number' && 'game-grid-responsive',
    className
  ].filter(Boolean).join(' ');
  
  // Create data attributes for responsive columns
  const dataAttributes: Record<string, number> = {};
  if (typeof columns !== 'number') {
    if (columns.xs) dataAttributes['data-grid-xs'] = columns.xs;
    if (columns.sm) dataAttributes['data-grid-sm'] = columns.sm;
    if (columns.md) dataAttributes['data-grid-md'] = columns.md;
    if (columns.lg) dataAttributes['data-grid-lg'] = columns.lg;
    if (columns.xl) dataAttributes['data-grid-xl'] = columns.xl;
  }
  
  return (
    <div 
      className={gridClasses} 
      style={gridStyle}
      {...dataAttributes}
    >
      {children}
    </div>
  );
};

export default Grid;