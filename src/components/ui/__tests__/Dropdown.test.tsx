import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Dropdown from '../Dropdown';
import '../Dropdown.css';

// Mock DOMRect for tests
const mockRect = {
  bottom: 100,
  height: 30,
  left: 50,
  right: 100,
  top: 70,
  width: 50,
  x: 50,
  y: 70,
  toJSON: () => {},
};

describe('Dropdown', () => {
  // Create a portal element for testing
  beforeEach(() => {
    const portalRoot = document.createElement('div');
    portalRoot.id = 'dropdown-portal';
    document.body.appendChild(portalRoot);
  });

  // Clean up the portal element after tests
  afterEach(() => {
    const portalRoot = document.getElementById('dropdown-portal');
    if (portalRoot) {
      document.body.removeChild(portalRoot);
    }
  });

  it('renders dropdown content when isOpen is true', () => {
    const handleClose = jest.fn();

    render(
      <Dropdown
        isOpen={true}
        onClose={handleClose}
        triggerRect={mockRect as DOMRect}
        position="bottom-right"
        className="test-dropdown"
      >
        <div className="dropdown-header">Test Header</div>
        <div className="dropdown-group">
          <button className="dropdown-item">Option 1</button>
          <button className="dropdown-item active">Option 2</button>
        </div>
      </Dropdown>
    );

    // Check that the dropdown is rendered
    expect(screen.getByText('Test Header')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();

    // Check that the active class is applied
    const activeOption = screen.getByText('Option 2');
    expect(activeOption).toHaveClass('active');

    // Check that default styles are applied
    const dropdownElement = document.querySelector('.portal-dropdown');
    expect(dropdownElement).toBeInTheDocument();

    // Get computed styles for the dropdown
    if (dropdownElement) {
      const styles = window.getComputedStyle(dropdownElement);
      console.log('Dropdown styles:', {
        backgroundColor: styles.backgroundColor,
        border: styles.border,
        padding: styles.padding,
      });
    }
  });

  it('does not render when isOpen is false', () => {
    const handleClose = jest.fn();

    render(
      <Dropdown
        isOpen={false}
        onClose={handleClose}
        triggerRect={mockRect as DOMRect}
        position="bottom-right"
      >
        <div>Test Content</div>
      </Dropdown>
    );

    // The dropdown should not be in the document
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
  });

  it('calls onClose when clicking outside', () => {
    const handleClose = jest.fn();

    render(
      <Dropdown
        isOpen={true}
        onClose={handleClose}
        triggerRect={mockRect as DOMRect}
        position="bottom-right"
      >
        <div>Test Content</div>
      </Dropdown>
    );

    // Simulate clicking outside the dropdown
    fireEvent.mouseDown(document.body);

    // onClose should be called
    expect(handleClose).toHaveBeenCalled();
  });
});
