import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import './Dropdown.css';

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  triggerRect?: DOMRect | null;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  className?: string;
}

/**
 * A portal-based dropdown component that renders outside of parent containers
 * to avoid overflow issues and ensure it's always visible.
 */
const Dropdown: React.FC<DropdownProps> = ({
  isOpen,
  onClose,
  children,
  triggerRect,
  position = 'bottom-right',
  className = '',
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Create portal element if it doesn't exist
  useEffect(() => {
    if (!document.getElementById('dropdown-portal')) {
      const portalElement = document.createElement('div');
      portalElement.id = 'dropdown-portal';
      document.body.appendChild(portalElement);
    }
    
    return () => {
      // Clean up portal on unmount
      const portal = document.getElementById('dropdown-portal');
      if (portal && portal.childNodes.length === 0) {
        document.body.removeChild(portal);
      }
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(e.target as Node) &&
        e.target instanceof Element && 
        !e.target.closest('.dropdown-trigger')
      ) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Calculate dropdown position based on trigger element
  const getDropdownStyle = (): React.CSSProperties => {
    if (!triggerRect) return {};

    const style: React.CSSProperties = {
      position: 'fixed',
      zIndex: 2000,
    };

    // Calculate position
    if (position.includes('bottom')) {
      style.top = `${triggerRect.bottom + 5}px`;
    } else {
      style.bottom = `${window.innerHeight - triggerRect.top + 5}px`;
    }

    // Calculate horizontal position
    if (position.includes('right')) {
      style.right = `${window.innerWidth - triggerRect.right}px`;
    } else {
      style.left = `${triggerRect.left}px`;
    }

    // Check if dropdown would go offscreen and adjust
    // We'll need window dimensions and estimated dropdown dimensions
    // Using the triggerRect and a bit of extra width for safety
    const estimatedWidth = Math.max(triggerRect.width * 3, 130); // Minimum dropdown width
    
    // Check right edge overflow
    if (!position.includes('right') && triggerRect.left + estimatedWidth > window.innerWidth) {
      // Switch to right alignment
      delete style.left;
      style.right = `${window.innerWidth - triggerRect.right}px`;
    }

    // Check left edge overflow
    if (position.includes('right') && window.innerWidth - triggerRect.right < estimatedWidth) {
      // Switch to left alignment
      delete style.right;
      style.left = `${triggerRect.left}px`;
    }

    return style;
  };

  // Don't render if not open
  if (!isOpen) return null;

  // Render dropdown through portal
  // Explicit inline styles to ensure dropdown always has some styling
  const baseStyle = {
    backgroundColor: '#191919',
    border: '1px solid #333',
    borderRadius: '4px',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.5)',
    padding: '8px',
    ...getDropdownStyle()
  };

  return ReactDOM.createPortal(
    <div 
      ref={dropdownRef}
      className={`portal-dropdown ${className}`}
      style={baseStyle}
    >
      {children}
    </div>,
    document.getElementById('dropdown-portal') || document.body
  );
};

export default Dropdown;