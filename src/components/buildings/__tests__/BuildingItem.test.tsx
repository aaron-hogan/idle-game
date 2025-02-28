import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import BuildingItem from '../BuildingItem';
import { Structure } from '../../../models/structure';

// Create a mock store
const mockStore = configureStore([]);

describe('BuildingItem', () => {
  let store: ReturnType<typeof mockStore>;
  let testBuilding: Structure;
  let handlePurchase: jest.Mock;
  let handleWorkerChange: jest.Mock;

  beforeEach(() => {
    // Create a mock store with test resources
    store = mockStore({
      resources: {
        collective_bargaining_power: {
          id: 'collective_bargaining_power',
          name: 'Collective Bargaining Power',
          amount: 100,
          maxAmount: 1000,
          perSecond: 1,
          description: 'Power of the workers',
          unlocked: true,
        },
        solidarity: {
          id: 'solidarity',
          name: 'Solidarity',
          amount: 50,
          maxAmount: 1000,
          perSecond: 0.5,
          description: 'Worker unity',
          unlocked: true,
        },
      },
    });

    // Create test building
    testBuilding = {
      id: 'test_building',
      name: 'Test Building',
      description: 'A test building for workers',
      level: 1,
      maxLevel: 5,
      cost: {
        collective_bargaining_power: 50,
        solidarity: 25,
      },
      production: {
        solidarity: 0.5,
        community_trust: 0.2,
      },
      unlocked: true,
      workers: 2,
      maxWorkers: 5,
      category: 'ORGANIZING',
    };

    // Create mock handlers
    handlePurchase = jest.fn();
    handleWorkerChange = jest.fn();
  });

  it('should render the building details correctly', () => {
    render(
      <Provider store={store}>
        <BuildingItem
          building={testBuilding}
          onPurchase={handlePurchase}
          onWorkerChange={handleWorkerChange}
          canAfford={true}
        />
      </Provider>
    );

    // Check if name, level, and description render correctly
    expect(screen.getByText('Test Building')).toBeInTheDocument();
    expect(screen.getByText('Level 1/5')).toBeInTheDocument();
    expect(screen.getByText('A test building for workers')).toBeInTheDocument();

    // Check if worker count renders correctly (renamed from Workers to Organizers)
    expect(screen.getByText('Organizers: 2/5')).toBeInTheDocument();

    // Check if production values render
    expect(screen.getByText(/\+0.50 Solidarity\/s/)).toBeInTheDocument();
  });

  it('should call onPurchase when the upgrade button is clicked', () => {
    render(
      <Provider store={store}>
        <BuildingItem
          building={testBuilding}
          onPurchase={handlePurchase}
          onWorkerChange={handleWorkerChange}
          canAfford={true}
        />
      </Provider>
    );

    // Find and click the upgrade button
    const upgradeButton = screen.getByText('Upgrade');
    fireEvent.click(upgradeButton);

    // Check if purchase handler was called
    expect(handlePurchase).toHaveBeenCalled();
  });

  it('should call onWorkerChange when worker buttons are clicked', () => {
    render(
      <Provider store={store}>
        <BuildingItem
          building={testBuilding}
          onPurchase={handlePurchase}
          onWorkerChange={handleWorkerChange}
          canAfford={true}
        />
      </Provider>
    );

    // Find and click the + worker button
    const addButton = screen.getByText('+');
    fireEvent.click(addButton);

    // Check if worker change handler was called with +1
    expect(handleWorkerChange).toHaveBeenCalledWith(1);

    // Find and click the - worker button
    const removeButton = screen.getByText('-');
    fireEvent.click(removeButton);

    // Check if worker change handler was called with -1
    expect(handleWorkerChange).toHaveBeenCalledWith(-1);
  });

  it('should disable buttons when appropriate', () => {
    // Create a building with max workers
    const maxWorkersBuilding = {
      ...testBuilding,
      workers: 5,
    };

    render(
      <Provider store={store}>
        <BuildingItem
          building={maxWorkersBuilding}
          onPurchase={handlePurchase}
          onWorkerChange={handleWorkerChange}
          canAfford={false}
        />
      </Provider>
    );

    // Upgrade button should be disabled when can't afford
    const upgradeButton = screen.getByText('Upgrade');
    expect(upgradeButton).toBeDisabled();

    // Add worker button should be disabled at max workers
    const addButton = screen.getByText('+');
    expect(addButton).toBeDisabled();
  });
});
