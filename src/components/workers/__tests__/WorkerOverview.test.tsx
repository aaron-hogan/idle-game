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
    expect(screen.getByText('8')).toBeInTheDocument();
    
    // Check for assigned workers (2 + 3 = 5)
    expect(screen.getByText('5')).toBeInTheDocument();
    
    // Check for available workers (8 - 5 = 3)
    expect(screen.getByText('3')).toBeInTheDocument();
  });
  
  it('renders strategy buttons', () => {
    render(
      <Provider store={store}>
        <WorkerOverview />
      </Provider>
    );
    
    expect(screen.getByText(/Balanced/i)).toBeInTheDocument();
    expect(screen.getByText(/Focused/i)).toBeInTheDocument();
    expect(screen.getByText(/Efficiency/i)).toBeInTheDocument();
  });
  
  it('dispatches actions when buttons are clicked', () => {
    render(
      <Provider store={store}>
        <WorkerOverview />
      </Provider>
    );
    
    // Click all buttons and see if dispatch is called
    fireEvent.click(screen.getByText(/Balanced/i));
    expect(store.dispatch).toHaveBeenCalled();
    
    // Reset mock
    (store.dispatch as jest.Mock).mockClear();
    
    fireEvent.click(screen.getByText(/Focused/i));
    expect(store.dispatch).toHaveBeenCalled();
    
    // Reset mock
    (store.dispatch as jest.Mock).mockClear();
    
    fireEvent.click(screen.getByText(/Efficiency/i));
    expect(store.dispatch).toHaveBeenCalled();
  });
});