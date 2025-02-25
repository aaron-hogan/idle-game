import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import resourcesReducer from '../state/resourcesSlice';
import { Resource } from '../models/resource';
import ResourceList from './ResourceList';

describe('ResourceList', () => {
  // Create a test resource
  const testResources: Record<string, Resource> = {
    'test-resource-1': {
      id: 'test-resource-1',
      name: 'Test Resource 1',
      amount: 50,
      maxAmount: 100,
      perSecond: 1.5,
      description: 'First test resource',
      unlocked: true,
      category: 'TEST',
    },
    'test-resource-2': {
      id: 'test-resource-2',
      name: 'Test Resource 2',
      amount: 30,
      maxAmount: 200,
      perSecond: 2,
      description: 'Second test resource',
      unlocked: true,
      category: 'TEST',
    },
    'locked-resource': {
      id: 'locked-resource',
      name: 'Locked Resource',
      amount: 0,
      maxAmount: 50,
      perSecond: 0,
      description: 'This resource is locked',
      unlocked: false,
      category: 'LOCKED',
    },
  };
  
  // Helper function to create a test store with the specified resources
  const createTestStore = (resources: Record<string, Resource>) => {
    return configureStore({
      reducer: {
        resources: resourcesReducer,
      },
      preloadedState: {
        resources,
      },
    });
  };
  
  test('renders the heading', () => {
    const store = createTestStore(testResources);
    
    render(
      <Provider store={store}>
        <ResourceList />
      </Provider>
    );
    
    expect(screen.getByText('Resources')).toBeInTheDocument();
  });
  
  test('renders all unlocked resources', () => {
    const store = createTestStore(testResources);
    
    render(
      <Provider store={store}>
        <ResourceList />
      </Provider>
    );
    
    // Only unlocked resources should be displayed
    expect(screen.getByText('Test Resource 1')).toBeInTheDocument();
    expect(screen.getByText('Test Resource 2')).toBeInTheDocument();
    expect(screen.queryByText('Locked Resource')).not.toBeInTheDocument();
  });
  
  test('displays empty message when no resources are unlocked', () => {
    // Create store with only locked resources
    const store = createTestStore({
      'locked-resource-1': {
        id: 'locked-resource-1',
        name: 'Locked Resource 1',
        amount: 0,
        maxAmount: 50,
        perSecond: 0,
        description: 'This resource is locked',
        unlocked: false,
        category: 'LOCKED',
      },
    });
    
    render(
      <Provider store={store}>
        <ResourceList />
      </Provider>
    );
    
    expect(screen.getByText('No resources available yet.')).toBeInTheDocument();
  });
  
  test('passes showDetails prop to ResourceDisplay components', () => {
    const store = createTestStore(testResources);
    
    // Spy on console.log to check props passed to ResourceDisplay
    const originalError = console.error;
    console.error = jest.fn();
    
    // First render with showDetails=false
    const { unmount } = render(
      <Provider store={store}>
        <ResourceList showDetails={false} />
      </Provider>
    );
    
    // Descriptions should not be visible
    expect(screen.queryByText('First test resource')).not.toBeInTheDocument();
    expect(screen.queryByText('Second test resource')).not.toBeInTheDocument();
    
    unmount();
    
    // Now render with showDetails=true (default)
    render(
      <Provider store={store}>
        <ResourceList />
      </Provider>
    );
    
    // Descriptions should be visible
    expect(screen.getByText('First test resource')).toBeInTheDocument();
    expect(screen.getByText('Second test resource')).toBeInTheDocument();
    
    // Restore console.error
    console.error = originalError;
  });
});