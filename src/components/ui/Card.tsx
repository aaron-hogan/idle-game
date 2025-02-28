import React from 'react';
import './Card.css';

interface CardProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  footer,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
}) => {
  return (
    <div className={`game-card ${className}`}>
      {(title || subtitle) && (
        <div className={`game-card-header ${headerClassName}`}>
          {title && <div className="game-card-title">{title}</div>}
          {subtitle && <div className="game-card-subtitle">{subtitle}</div>}
        </div>
      )}

      <div className={`game-card-body ${bodyClassName}`}>{children}</div>

      {footer && <div className={`game-card-footer ${footerClassName}`}>{footer}</div>}
    </div>
  );
};

export default Card;
