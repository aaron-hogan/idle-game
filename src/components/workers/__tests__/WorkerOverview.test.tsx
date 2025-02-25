import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import WorkerOverview from '../WorkerOverview';
// import { autoAssignWorkers } from '../../../state/actions/workerActions';

// Let's not mock the actions, instead test the component rendering
import { changeWorkerCount } from '../../../state/structuresSlice';

const mockStore = configureStore([]);

describe('WorkerOverview', () => {
  let store: any;
  
  beforeEach(() => {
    store = mockStore({
      structures: {
        building1: { 
          id: 'building1',
          workers: 2, 
          maxWorkers: 5,
          unlocked: true,
          level: 1,
          name: 'Building 1',
          description: 'Test building',
          production: {},
          cost: {}
        },
        building2: { 
          id: 'building2',
          workers: 3, 
          maxWorkers: 8,
          unlocked: true,
          level: 1,
          name: 'Building 2',
          description: 'Test building 2',
          production: {},
          cost: {}
        }
      },
      game: {
        gameStage: 1 // Stage 1 = 5 base + 3 workers = 8 total
      }
    });
    
    store.dispatch = jest.fn();
  });
  
  it('renders worker information correctly', () => {
    render(
      <Provider store={store}>
        <WorkerOverview />
      </Provider>
    );
    
    // Check for total workers (5 base + 3 from stage 1 = 8)
    expect(screen.getByText(/Total Workers Available/)).toHaveTextContent('8');
    
    // Check for game stage
    expect(screen.getByText(/Game Stage/)).toHaveTextContent('1');
    
    // Check for debug message
    expect(screen.getByText(/This is a simplified worker overview/)).toBeInTheDocument();
  });
  
  // These tests have been removed because the component no longer has strategy buttons
  // The component has been simplified to only show basic worker information
  // If strategy buttons are added back in the future, these tests should be updated
});