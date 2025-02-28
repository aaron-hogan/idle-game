import React from 'react';
import './Badge.css';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  size?: 'small' | 'medium' | 'large';
  pill?: boolean;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  pill = false,
  className = '',
}) => {
  const badgeClasses = [
    'game-badge',
    `game-badge-${variant}`,
    `game-badge-${size}`,
    pill ? 'game-badge-pill' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <span className={badgeClasses}>{children}</span>;
};

export default Badge;
