import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  isFullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  isFullWidth = false,
  className = '',
  disabled = false,
  ...props
}) => {
  // Base classes
  let buttonClasses = 'button';

  // Add variant classes
  buttonClasses += ` button-${variant}`;

  // Add size classes
  buttonClasses += ` button-${size}`;

  // Add full width class if needed
  if (isFullWidth) {
    buttonClasses += ' button-full-width';
  }

  // Add custom classes
  if (className) {
    buttonClasses += ` ${className}`;
  }

  // Add disabled class
  if (disabled) {
    buttonClasses += ' button-disabled';
  }

  return (
    <button className={buttonClasses} disabled={disabled} {...props}>
      {children}
    </button>
  );
};

export default Button;
