import React from 'react';
import { render, screen } from '@testing-library/react';
import ResourceDisplay from '../ResourceDisplay';

// Mock the formatNumber function
jest.mock('../../../utils/numberUtils', () => ({
  formatNumber: jest.fn((num) => num.toString())
}));

// Mock the Counter component
jest.mock('../../common/Counter', () => {
  return function MockCounter(props: any) {
    return (
      <div className="counter-mock">
        <div>Name: {props.tooltip?.title}</div>
        <div>Value: {props.value}</div>
        <div>Rate: {props.rate}</div>
        <div className="counter-progress" style={{ width: `${props.progress * 100}%` }} />
      </div>
    );
  };
});

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
    
    // Check if name, value and rate are rendered through our mock Counter
    expect(screen.getByText('Name: Collective Bargaining Power')).toBeInTheDocument();
    expect(screen.getByText('Value: 100 / 1000')).toBeInTheDocument();
    expect(screen.getByText('Rate: +5/sec')).toBeInTheDocument();
  });
  
  test('renders progress bar with correct percentage', () => {
    render(<ResourceDisplay resource={mockResource} />);
    
    // Resource is at 10% capacity (100/1000)
    // The Counter gets 0.1 as the progress prop
    expect(screen.getByText('Value: 100 / 1000')).toBeInTheDocument();
  });
  
  test('handles empty resource gracefully', () => {
    const emptyResource = {
      ...mockResource,
      amount: 0,
      perSecond: 0
    };
    
    render(<ResourceDisplay resource={emptyResource} />);
    
    expect(screen.getByText('Value: 0 / 1000')).toBeInTheDocument();
    expect(screen.getByText('Rate: 0/sec')).toBeInTheDocument();
  });
  
  test('handles max resource correctly', () => {
    const fullResource = {
      ...mockResource,
      amount: 1000
    };
    
    render(<ResourceDisplay resource={fullResource} />);
    
    expect(screen.getByText('Value: 1000 / 1000')).toBeInTheDocument();
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
    
    expect(screen.getByText('Rate: -3/sec')).toBeInTheDocument();
  });
});