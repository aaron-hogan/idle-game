import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import UpgradePanel from '../UpgradePanel';
import { ResourceId } from '../../../constants/resources';

// Mock the resource manager
jest.mock('../../../systems/resourceManager', () => ({
  ResourceManager: {
    getInstance: jest.fn().mockReturnValue({
      getClickUpgradeCost: jest.fn().mockReturnValue(10),
      upgradeClickPower: jest.fn()
    })
  }
}));

// Create mock store
const mockStore = configureStore([]);

describe('UpgradePanel Component', () => {
  let store: any;

  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders upgrade panel with correct elements when resource is affordable', () => {
    // Create a mock store with sufficient resources
    store = mockStore({
      resources: {
        [ResourceId.COLLECTIVE_POWER]: {
          id: ResourceId.COLLECTIVE_POWER,
          name: 'Collective Bargaining Power',
          amount: 100, // More than upgrade cost
          perSecond: 1,
          unlocked: true,
          clickPower: 1
        }
      }
    });
    
    render(
      <Provider store={store}>
        <UpgradePanel resourceId={ResourceId.COLLECTIVE_POWER} />
      </Provider>
    );
    
    // Check if core elements exist
    expect(screen.getByText('POWER PER CLICK')).toBeInTheDocument();
    expect(screen.getByText('1.0')).toBeInTheDocument(); // Current power
    expect(screen.getByText('UPGRADE')).toBeInTheDocument();
    expect(screen.getByText('10 CBP')).toBeInTheDocument(); // Cost
    expect(screen.getByText('+1.0 power per click')).toBeInTheDocument();
    
    // Button should be enabled and have 'affordable' class
    const upgradeButton = screen.getByText('UPGRADE').closest('button');
    expect(upgradeButton).not.toBeDisabled();
    expect(upgradeButton).toHaveClass('affordable');
  });
  
  test('disables button when resource is not affordable', () => {
    // Create a mock store with insufficient resources
    store = mockStore({
      resources: {
        [ResourceId.COLLECTIVE_POWER]: {
          id: ResourceId.COLLECTIVE_POWER,
          name: 'Collective Bargaining Power',
          amount: 5, // Less than upgrade cost
          perSecond: 1,
          unlocked: true,
          clickPower: 1
        }
      }
    });
    
    render(
      <Provider store={store}>
        <UpgradePanel resourceId={ResourceId.COLLECTIVE_POWER} />
      </Provider>
    );
    
    // Button should be disabled and have 'expensive' class
    const upgradeButton = screen.getByText('UPGRADE').closest('button');
    expect(upgradeButton).toBeDisabled();
    expect(upgradeButton).toHaveClass('expensive');
  });
  
  test('handles upgrade click and calls resource manager', () => {
    // Set up mock store with sufficient resources
    store = mockStore({
      resources: {
        [ResourceId.COLLECTIVE_POWER]: {
          id: ResourceId.COLLECTIVE_POWER,
          name: 'Collective Bargaining Power',
          amount: 100,
          perSecond: 1,
          unlocked: true,
          clickPower: 1
        }
      }
    });
    
    const { ResourceManager } = require('../../../systems/resourceManager');
    
    render(
      <Provider store={store}>
        <UpgradePanel resourceId={ResourceId.COLLECTIVE_POWER} />
      </Provider>
    );
    
    // Click the upgrade button
    const upgradeButton = screen.getByText('UPGRADE').closest('button');
    if (upgradeButton) {
      fireEvent.click(upgradeButton);
    }
    
    // Check if resource manager was called
    expect(ResourceManager.getInstance().upgradeClickPower).toHaveBeenCalledWith(ResourceId.COLLECTIVE_POWER);
  });
  
  test('displays higher click power correctly', () => {
    // Create a mock store with higher click power
    store = mockStore({
      resources: {
        [ResourceId.COLLECTIVE_POWER]: {
          id: ResourceId.COLLECTIVE_POWER,
          name: 'Collective Bargaining Power',
          amount: 100,
          perSecond: 1,
          unlocked: true,
          clickPower: 5.5
        }
      }
    });
    
    render(
      <Provider store={store}>
        <UpgradePanel resourceId={ResourceId.COLLECTIVE_POWER} />
      </Provider>
    );
    
    // Check if the correct click power is displayed
    expect(screen.getByText('5.5')).toBeInTheDocument();
  });
  
  test('does not render if resource does not exist', () => {
    // Create a mock store without the required resource
    store = mockStore({
      resources: {}
    });
    
    const { container } = render(
      <Provider store={store}>
        <UpgradePanel resourceId={ResourceId.COLLECTIVE_POWER} />
      </Provider>
    );
    
    // Component should render nothing
    expect(container.firstChild).toBeNull();
  });
});