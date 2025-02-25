import React from 'react';
import { render, screen } from '@testing-library/react';
import ResourceDisplay from './ResourceDisplay';
import { Resource } from '../models/resource';

describe('ResourceDisplay', () => {
  const mockResource: Resource = {
    id: 'test-resource',
    name: 'Test Resource',
    amount: 50,
    maxAmount: 100,
    perSecond: 1.5,
    description: 'A test resource for testing',
    unlocked: true,
    category: 'TEST',
  };

  test('renders resource name', () => {
    render(<ResourceDisplay resource={mockResource} />);
    expect(screen.getByText('Test Resource')).toBeInTheDocument();
  });

  test('renders resource amount and max amount', () => {
    render(<ResourceDisplay resource={mockResource} />);
    expect(screen.getByText('50 / 100')).toBeInTheDocument();
  });

  test('renders resource generation rate with + sign for positive values', () => {
    render(<ResourceDisplay resource={mockResource} />);
    expect(screen.getByText('+1.5/s')).toBeInTheDocument();
  });

  test('renders resource description when showDetails is true', () => {
    render(<ResourceDisplay resource={mockResource} showDetails={true} />);
    expect(screen.getByText('A test resource for testing')).toBeInTheDocument();
  });

  test('does not render description when showDetails is false', () => {
    render(<ResourceDisplay resource={mockResource} showDetails={false} />);
    expect(screen.queryByText('A test resource for testing')).not.toBeInTheDocument();
  });

  test('formats decimal amounts correctly', () => {
    const resourceWithDecimal: Resource = {
      ...mockResource,
      amount: 42.5,
    };
    render(<ResourceDisplay resource={resourceWithDecimal} />);
    expect(screen.getByText('42.5 / 100')).toBeInTheDocument();
  });

  test('formats integer amounts without decimals', () => {
    const resourceWithInteger: Resource = {
      ...mockResource,
      amount: 42,
    };
    render(<ResourceDisplay resource={resourceWithInteger} />);
    expect(screen.getByText('42 / 100')).toBeInTheDocument();
  });

  test('formats very low generation rates with more decimal places', () => {
    const resourceWithLowGeneration: Resource = {
      ...mockResource,
      perSecond: 0.05,
    };
    render(<ResourceDisplay resource={resourceWithLowGeneration} />);
    expect(screen.getByText('+0.05/s')).toBeInTheDocument();
  });

  test('shows negative generation rates with minus sign', () => {
    const resourceWithNegativeGeneration: Resource = {
      ...mockResource,
      perSecond: -2.5,
    };
    render(<ResourceDisplay resource={resourceWithNegativeGeneration} />);
    const rateElement = screen.getByText(/s$/);  // Find text ending with '/s'
    expect(rateElement.textContent).toBe('-2.50/s');
  });

  test('shows zero generation rate correctly', () => {
    const resourceWithZeroGeneration: Resource = {
      ...mockResource,
      perSecond: 0,
    };
    render(<ResourceDisplay resource={resourceWithZeroGeneration} />);
    const rateElement = screen.getByText(/s$/);  // Find text ending with '/s'
    expect(rateElement.textContent).toBe('+0/s');
  });

  test('progress bar has correct width percentage', () => {
    render(<ResourceDisplay resource={mockResource} />);
    const progressBar = document.querySelector('.resource-progress-bar');
    expect(progressBar).toHaveStyle('width: 50%');
  });
});