import React from 'react';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'info';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  children,
  className = '',
  disabled = false,
  ...props
}) => {
  const buttonClasses = [
    'game-button',
    `game-button-${variant}`,
    `game-button-${size}`,
    fullWidth ? 'game-button-full-width' : '',
    disabled ? 'game-button-disabled' : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <button 
      className={buttonClasses}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;