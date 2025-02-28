import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import PassiveUpgradePanel from '../PassiveUpgradePanel';
import { ResourceManager } from '../../../systems/resourceManager';

// Mock the ResourceManager
jest.mock('../../../systems/resourceManager', () => {
  return {
    ResourceManager: {
      getInstance: jest.fn().mockReturnValue({
        getPassiveUpgradeCost: jest.fn().mockReturnValue(20),
        upgradePassiveGeneration: jest.fn().mockReturnValue(true),
      }),
    },
  };
});

describe('PassiveUpgradePanel', () => {
  const mockStore = configureStore([]);

  // Mock initial store state
  const initialState = {
    resources: {
      'collective-power': {
        id: 'collective-power',
        name: 'Collective Power',
        amount: 30, // Enough to afford upgrade
        perSecond: 0.1,
        unlocked: true,
        clickPower: 1,
      },
    },
  };

  let store: any;

  beforeEach(() => {
    store = mockStore(initialState);
  });

  it('renders the passive upgrade panel', () => {
    render(
      <Provider store={store}>
        <PassiveUpgradePanel resourceId="collective-power" />
      </Provider>
    );

    // Check that key elements are rendered
    expect(screen.getByText('POWER PER SECOND')).toBeInTheDocument();
    expect(screen.getByText('0.1')).toBeInTheDocument();
    expect(screen.getByText('UPGRADE')).toBeInTheDocument();
    expect(screen.getByText('+0.1 power per second')).toBeInTheDocument();
  });

  it('handles upgrade click when affordable', () => {
    render(
      <Provider store={store}>
        <PassiveUpgradePanel resourceId="collective-power" />
      </Provider>
    );

    // Get the upgrade button and click it
    const upgradeButton = screen.getByText('UPGRADE').closest('button');
    fireEvent.click(upgradeButton!);

    // Check that the upgrade method was called
    expect(ResourceManager.getInstance().upgradePassiveGeneration).toHaveBeenCalledWith(
      'collective-power'
    );
  });

  it('disables upgrade button when not affordable', () => {
    // Create a store with not enough resources
    const poorState = {
      resources: {
        'collective-power': {
          id: 'collective-power',
          name: 'Collective Power',
          amount: 5, // Not enough to afford upgrade
          perSecond: 0.1,
          unlocked: true,
          clickPower: 1,
        },
      },
    };

    const poorStore = mockStore(poorState);

    // Mock that upgrade is not affordable
    (ResourceManager.getInstance() as any).getPassiveUpgradeCost.mockReturnValueOnce(20);

    render(
      <Provider store={poorStore}>
        <PassiveUpgradePanel resourceId="collective-power" />
      </Provider>
    );

    // Get the upgrade button and check it's disabled
    const upgradeButton = screen.getByText('UPGRADE').closest('button');
    expect(upgradeButton).toBeDisabled();
  });
});
