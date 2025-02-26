/**
 * Tests for the MilestoneProgressStrip component
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MilestoneProgressStrip } from '../';
import { GameStage, MilestoneType } from '../../../interfaces/progression';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  Link: ({ children, to, className }: any) => (
    <a href={to} className={className}>
      {children}
    </a>
  )
}));

// Create mock store
const mockStore = configureStore([]);

describe('MilestoneProgressStrip Component', () => {
  // Mock initial state
  const initialState = {
    resources: {
      'collective-power': {
        id: 'collective-power',
        name: 'Collective Power',
        amount: 5,
        perSecond: 0.5,
        baseClickValue: 1
      },
      'connections': {
        id: 'connections',
        name: 'Connections',
        amount: 15,
        perSecond: 0.2,
        baseClickValue: 1
      }
    },
    progression: {
      milestones: {
        'first-collective-power': {
          completed: false,
          timestamp: null
        },
        'growing-power': {
          completed: false,
          timestamp: null
        },
        'resource-sharing': {
          completed: false,
          timestamp: null
        }
      },
      currentStage: GameStage.EARLY
    }
  };

  // Set up store with mock data
  const store = mockStore(initialState);

  // Helper function to render with providers
  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <Provider store={store}>
        {ui}
      </Provider>
    );
  };

  it('renders the milestone progress strip', () => {
    renderWithProviders(<MilestoneProgressStrip />);
    
    // Check for component title
    expect(screen.getByText('Community Progress')).toBeInTheDocument();
    
    // Check for View All link
    expect(screen.getByText('View All')).toBeInTheDocument();
    expect(screen.getByText('View All').closest('a')).toHaveAttribute('href', '/progression');
  });

  it('renders a completed milestone correctly', () => {
    // Create a store with a completed milestone
    const completedState = {
      ...initialState,
      progression: {
        ...initialState.progression,
        milestones: {
          ...initialState.progression.milestones,
          'first-collective-power': {
            completed: true,
            timestamp: Date.now()
          }
        }
      }
    };
    
    const completedStore = mockStore(completedState);
    
    render(
      <Provider store={completedStore}>
        <MilestoneProgressStrip />
      </Provider>
    );
    
    // Check for completed badge
    expect(screen.getByText('✓ Completed')).toBeInTheDocument();
  });

  it('handles empty milestone state gracefully', () => {
    // Create a store with no milestones
    const emptyState = {
      ...initialState,
      progression: {
        ...initialState.progression,
        milestones: {}
      }
    };
    
    const emptyStore = mockStore(emptyState);
    
    render(
      <Provider store={emptyStore}>
        <MilestoneProgressStrip />
      </Provider>
    );
    
    // Should still render the container
    expect(screen.getByText('Community Progress')).toBeInTheDocument();
  });

  it('respects the sideCount prop', () => {
    renderWithProviders(<MilestoneProgressStrip sideCount={1} />);
    
    // Component should render with reduced side count
    // This is more of a visual test, but we can check that the component
    // renders without errors when changing this prop
    expect(screen.getByText('Community Progress')).toBeInTheDocument();
  });
});