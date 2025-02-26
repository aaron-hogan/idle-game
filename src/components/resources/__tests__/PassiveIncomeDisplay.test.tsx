import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import PassiveIncomeDisplay from '../PassiveIncomeDisplay';
import { ResourceId } from '../../../constants/resources';

// Mock the formatNumber utility
jest.mock('../../../utils/numberUtils', () => ({
  formatNumber: jest.fn(num => num.toString())
}));

// Create mock store
const mockStore = configureStore([]);

describe('PassiveIncomeDisplay Component', () => {
  let store: any;
  
  beforeEach(() => {
    // Create a mock store with resources and structures
    store = mockStore({
      resources: {
        [ResourceId.COLLECTIVE_POWER]: {
          id: ResourceId.COLLECTIVE_POWER,
          name: 'Collective Power',
          amount: 100,
          maxAmount: 1000,
          perSecond: 5,
          clickPower: 3,
          unlocked: true,
          category: 'POWER',
          description: 'Test resource'
        },
        'resource2': {
          id: 'resource2',
          name: 'Resource Two',
          amount: 50,
          maxAmount: 500,
          perSecond: 0, // No passive generation
          unlocked: true,
          category: 'MATERIAL',
          description: 'Test resource with no passive generation'
        }
      },
      structures: {
        'structure1': {
          id: 'structure1',
          name: 'Structure One',
          level: 2,
          unlocked: true,
          workers: 4,
          maxWorkers: 5,
          production: {
            [ResourceId.COLLECTIVE_POWER]: 2
          }
        },
        'structure2': {
          id: 'structure2',
          name: 'Structure Two',
          level: 1,
          unlocked: true,
          workers: 1,
          maxWorkers: 3,
          production: {
            [ResourceId.COLLECTIVE_POWER]: 1
          }
        }
      }
    });
  });
  
  test('renders generation summary with correct resource information', () => {
    render(
      <Provider store={store}>
        <PassiveIncomeDisplay />
      </Provider>
    );
    
    // Check if title is rendered
    expect(screen.getByText('GENERATION SUMMARY')).toBeInTheDocument();
    
    // Check if resource with passive income is displayed
    expect(screen.getByText('Collective Power')).toBeInTheDocument();
    expect(screen.getByText('+5/sec')).toBeInTheDocument();
    
    // Check if per click is displayed
    expect(screen.getByText('Per Click')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    
    // Resource without passive income should not be displayed
    expect(screen.queryByText('Resource Two')).not.toBeInTheDocument();
  });
  
  test('shows "no passive income" message when no resources have passive generation', () => {
    // Create a store with no passive generation
    const noIncomeStore = mockStore({
      resources: {
        [ResourceId.COLLECTIVE_POWER]: {
          id: ResourceId.COLLECTIVE_POWER,
          name: 'Collective Power',
          amount: 100,
          maxAmount: 1000,
          perSecond: 0, // No passive generation
          clickPower: 1,
          unlocked: true,
          category: 'POWER',
          description: 'Test resource'
        }
      },
      structures: {}
    });
    
    render(
      <Provider store={noIncomeStore}>
        <PassiveIncomeDisplay />
      </Provider>
    );
    
    expect(screen.getByText("You don't have any passive income yet")).toBeInTheDocument();
  });
  
  test('expands display to show sources when clicked', () => {
    render(
      <Provider store={store}>
        <PassiveIncomeDisplay />
      </Provider>
    );
    
    // Initially, the details should not be visible
    expect(screen.queryByText('Sources')).not.toBeInTheDocument();
    
    // Click to expand
    fireEvent.click(screen.getByText('GENERATION SUMMARY'));
    
    // Now details should be visible
    expect(screen.getByText('Collective Power Sources')).toBeInTheDocument();
    expect(screen.getByText('Structure One')).toBeInTheDocument();
    expect(screen.getByText('Structure Two')).toBeInTheDocument();
    
    // Should show structure details
    expect(screen.getByText('Lv.2 • 4/5 workers')).toBeInTheDocument();
    expect(screen.getByText('Lv.1 • 1/3 workers')).toBeInTheDocument();
  });
  
  test('collapses details when clicked again', () => {
    render(
      <Provider store={store}>
        <PassiveIncomeDisplay />
      </Provider>
    );
    
    // Click to expand
    fireEvent.click(screen.getByText('GENERATION SUMMARY'));
    
    // Should be visible
    expect(screen.getByText('Collective Power Sources')).toBeInTheDocument();
    
    // Click again to collapse
    fireEvent.click(screen.getByText('GENERATION SUMMARY'));
    
    // Should be hidden again
    expect(screen.queryByText('Collective Power Sources')).not.toBeInTheDocument();
  });
});