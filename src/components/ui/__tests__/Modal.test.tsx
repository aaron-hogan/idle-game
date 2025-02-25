import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../Modal';

describe('Modal Component', () => {
  const onCloseMock = jest.fn();
  
  beforeEach(() => {
    // Reset mock function calls before each test
    onCloseMock.mockReset();
  });
  
  test('renders nothing when closed', () => {
    render(
      <Modal isOpen={false} onClose={onCloseMock}>
        <div>Modal content</div>
      </Modal>
    );
    
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });
  
  test('renders content when open', () => {
    render(
      <Modal isOpen={true} onClose={onCloseMock}>
        <div>Modal content</div>
      </Modal>
    );
    
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });
  
  test('renders with title', () => {
    render(
      <Modal isOpen={true} onClose={onCloseMock} title="Modal Title">
        <div>Modal content</div>
      </Modal>
    );
    
    expect(screen.getByText('Modal Title')).toBeInTheDocument();
    expect(document.querySelector('.modal-header')).toBeInTheDocument();
  });
  
  test('renders with footer', () => {
    render(
      <Modal 
        isOpen={true} 
        onClose={onCloseMock} 
        footer={<button>Close</button>}
      >
        <div>Modal content</div>
      </Modal>
    );
    
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    expect(document.querySelector('.modal-footer')).toBeInTheDocument();
  });
  
  test('applies custom class name', () => {
    render(
      <Modal isOpen={true} onClose={onCloseMock} className="custom-modal">
        <div>Modal content</div>
      </Modal>
    );
    
    expect(document.querySelector('.game-modal.custom-modal')).toBeInTheDocument();
  });
  
  test('applies size class', () => {
    render(
      <Modal isOpen={true} onClose={onCloseMock} size="large">
        <div>Modal content</div>
      </Modal>
    );
    
    expect(document.querySelector('.game-modal-large')).toBeInTheDocument();
  });
  
  test('calls onClose when close button is clicked', () => {
    render(
      <Modal isOpen={true} onClose={onCloseMock} title="Modal Title">
        <div>Modal content</div>
      </Modal>
    );
    
    const closeButton = document.querySelector('.modal-close-button');
    fireEvent.click(closeButton!);
    
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
  
  test('calls onClose when escape key is pressed and closeOnEsc is true', () => {
    render(
      <Modal isOpen={true} onClose={onCloseMock} closeOnEsc={true}>
        <div>Modal content</div>
      </Modal>
    );
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
  
  test('does not call onClose when escape key is pressed and closeOnEsc is false', () => {
    render(
      <Modal isOpen={true} onClose={onCloseMock} closeOnEsc={false}>
        <div>Modal content</div>
      </Modal>
    );
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(onCloseMock).not.toHaveBeenCalled();
  });
});