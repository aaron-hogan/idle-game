import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import MilestoneProgress from '../MilestoneProgress';

// Mock the modules
jest.mock('../../../data/progression/milestones', () => ({
  allMilestones: [
    {
      id: 'milestone1',
      name: 'First Milestone',
      description: 'This is the first milestone description',
      requirements: [
        {
          type: 'resourceAmount',
          target: 'resource1',
          value: 100
        }
      ]
    },
    {
      id: 'milestone2',
      name: 'Second Milestone',
      description: 'This is the second milestone description',
      requirements: [
        {
          type: 'resourceAmount',
          target: 'resource1',
          value: 200
        },
        {
          type: 'resourceAmount',
          target: 'resource2',
          value: 50
        }
      ]
    },
    {
      id: 'milestone3',
      name: 'Completed Milestone',
      description: 'This milestone is already completed',
      requirements: [
        {
          type: 'resourceAmount',
          target: 'resource1',
          value: 10
        }
      ]
    }
  ]
}));

// Create mock store
const mockStore = configureStore([]);

describe('MilestoneProgress Component', () => {
  let store: any;
  
  beforeEach(() => {
    // Create a mock store with resource and progression state
    store = mockStore({
      resources: {
        resource1: {
          id: 'resource1',
          name: 'Resource One',
          amount: 50,
          perSecond: 1,
          unlocked: true
        },
        resource2: {
          id: 'resource2',
          name: 'Resource Two',
          amount: 25,
          perSecond: 0.5,
          unlocked: true
        }
      },
      progression: {
        milestones: {
          milestone1: {
            id: 'milestone1',
            completed: false
          },
          milestone2: {
            id: 'milestone2',
            completed: false
          },
          milestone3: {
            id: 'milestone3',
            completed: true
          }
        }
      }
    });
  });
  
  test('renders milestone cards with correct progress information', () => {
    render(
      <Provider store={store}>
        <MilestoneProgress />
      </Provider>
    );
    
    // Check if title is rendered
    expect(screen.getByText('Next Milestones')).toBeInTheDocument();
    
    // Check if milestone names are rendered
    expect(screen.getByText('First Milestone')).toBeInTheDocument();
    expect(screen.getByText('Second Milestone')).toBeInTheDocument();
    
    // Check if descriptions are rendered
    expect(screen.getByText('This is the first milestone description')).toBeInTheDocument();
    expect(screen.getByText('This is the second milestone description')).toBeInTheDocument();
    
    // Check if resource requirements are displayed
    expect(screen.getAllByText('Resource One')[0]).toBeInTheDocument();
    expect(screen.getByText('Resource Two')).toBeInTheDocument();
    
    // Check if amounts are displayed correctly (50/100 for resource1)
    expect(screen.getByText('50.0 / 100.0')).toBeInTheDocument();
    
    // Check if rates are displayed
    expect(screen.getAllByText('+1.00/sec')[0]).toBeInTheDocument();
    expect(screen.getByText('+0.50/sec')).toBeInTheDocument();
  });
  
  test('does not display completed milestones', () => {
    render(
      <Provider store={store}>
        <MilestoneProgress />
      </Provider>
    );
    
    // Check that completed milestone is not shown in active milestones
    // (It appears in the notification instead, which is fine)
    expect(screen.queryByText('Completed Milestone', { selector: '.milestone-name' })).not.toBeInTheDocument();
  });
  
  test('shows "No available milestones" when all milestones are completed', () => {
    // Create store with all milestones completed
    const completedStore = mockStore({
      resources: {
        resource1: {
          id: 'resource1',
          name: 'Resource One',
          amount: 50,
          perSecond: 1,
          unlocked: true
        }
      },
      progression: {
        milestones: {
          milestone1: {
            id: 'milestone1',
            completed: true
          },
          milestone2: {
            id: 'milestone2',
            completed: true
          },
          milestone3: {
            id: 'milestone3',
            completed: true
          }
        }
      }
    });
    
    render(
      <Provider store={completedStore}>
        <MilestoneProgress />
      </Provider>
    );
    
    expect(screen.getByText('No available milestones')).toBeInTheDocument();
  });
  
  test('displays ETA for milestone completion', () => {
    render(
      <Provider store={store}>
        <MilestoneProgress />
      </Provider>
    );
    
    // Resource1 has 50/100 with rate of 1/sec, so ETA should be around 50 seconds
    expect(screen.getAllByText(/ETA:/)[0]).toBeInTheDocument();
  });
  
  test('respects the limit prop for number of milestones shown', () => {
    render(
      <Provider store={store}>
        <MilestoneProgress limit={1} />
      </Provider>
    );
    
    // Only one milestone should be shown (the one with highest progress)
    expect(screen.getByText('First Milestone')).toBeInTheDocument();
    expect(screen.queryByText('Second Milestone')).not.toBeInTheDocument();
  });
});