import React from 'react';
import { render, screen } from '@testing-library/react';
import ResourceDisplay from '../ResourceDisplay';

// Mock the formatNumber function
jest.mock('../../../utils/numberUtils', () => ({
  formatNumber: jest.fn((num) => num.toString())
}));

describe('ResourceDisplay Component', () => {
  const mockResource = {
    id: 'resource1',
    name: 'Collective Bargaining Power',
    amount: 100,
    maxAmount: 1000,
    perSecond: 5,
    description: 'Test description',
    unlocked: true,
    category: 'POWER'
  };
  
  test('renders resource display with correct information', () => {
    render(<ResourceDisplay resource={mockResource} />);
    
    // Check if name and amounts are rendered
    expect(screen.getByText('Collective Bargaining Power')).toBeInTheDocument();
    expect(screen.getByText('100 / 1000')).toBeInTheDocument();
    expect(screen.getByText('+5/sec')).toBeInTheDocument();
  });
  
  test('renders progress bar with correct percentage', () => {
    render(<ResourceDisplay resource={mockResource} />);
    
    // Resource is at 10% capacity (100/1000)
    const progressBar = document.querySelector('.resource-progress-bar');
    expect(progressBar).toHaveStyle('width: 10%');
  });
  
  test('handles empty resource gracefully', () => {
    const emptyResource = {
      ...mockResource,
      amount: 0,
      perSecond: 0
    };
    
    render(<ResourceDisplay resource={emptyResource} />);
    
    expect(screen.getByText('0 / 1000')).toBeInTheDocument();
    expect(screen.getByText('0/sec')).toBeInTheDocument();
    
    const progressBar = document.querySelector('.resource-progress-bar');
    expect(progressBar).toHaveStyle('width: 0%');
  });
  
  test('handles max resource correctly', () => {
    const fullResource = {
      ...mockResource,
      amount: 1000
    };
    
    render(<ResourceDisplay resource={fullResource} />);
    
    expect(screen.getByText('1000 / 1000')).toBeInTheDocument();
    
    const progressBar = document.querySelector('.resource-progress-bar');
    expect(progressBar).toHaveStyle('width: 100%');
  });
  
  test('applies custom className', () => {
    render(<ResourceDisplay resource={mockResource} className="custom-class" />);
    
    const resourceDisplay = document.querySelector('.resource-display');
    expect(resourceDisplay).toHaveClass('custom-class');
  });
  
  test('formats resource rates correctly', () => {
    const negativeRateResource = {
      ...mockResource,
      perSecond: -3
    };
    
    render(<ResourceDisplay resource={negativeRateResource} />);
    
    expect(screen.getByText('-3/sec')).toBeInTheDocument();
  });
});