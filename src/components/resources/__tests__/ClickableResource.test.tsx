import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ClickableResource from '../ClickableResource';
import { ResourceId } from '../../../constants/resources';

// Mock the resource manager
jest.mock('../../../systems/resourceManager', () => ({
  ResourceManager: {
    getInstance: jest.fn().mockReturnValue({
      handleResourceClick: jest.fn().mockReturnValue(1)
    })
  }
}));

// Mock the progression manager
jest.mock('../../../managers/progression/ProgressionManager', () => ({
  ProgressionManager: {
    getInstance: jest.fn().mockReturnValue({
      checkMilestoneProgress: jest.fn()
    })
  }
}));

// Create mock store
const mockStore = configureStore([]);

describe('ClickableResource Component', () => {
  let store: any;
  
  beforeEach(() => {
    // Create a mock store
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
    
    // Reset mocks
    jest.clearAllMocks();
  });
  
  test('renders clickable resource with correct elements', () => {
    render(
      <Provider store={store}>
        <ClickableResource resourceId={ResourceId.COLLECTIVE_POWER} />
      </Provider>
    );
    
    // Check if core elements exist
    expect(screen.getByText('CLICK TO GENERATE COLLECTIVE POWER')).toBeInTheDocument();
    expect(screen.getByText('[ + ]')).toBeInTheDocument();
  });
  
  test('handles click event and generates resource', () => {
    const { ResourceManager } = require('../../../systems/resourceManager');
    const { ProgressionManager } = require('../../../managers/progression/ProgressionManager');
    
    render(
      <Provider store={store}>
        <ClickableResource resourceId={ResourceId.COLLECTIVE_POWER} />
      </Provider>
    );
    
    // Click the resource element
    const clickableElement = screen.getByText('[ + ]').closest('div.clickable-resource');
    if (clickableElement) {
      fireEvent.click(clickableElement);
    }
    
    // Check if resource manager was called
    expect(ResourceManager.getInstance().handleResourceClick).toHaveBeenCalledWith(ResourceId.COLLECTIVE_POWER);
    
    // Check if progression manager was called
    expect(ProgressionManager.getInstance().checkMilestoneProgress).toHaveBeenCalled();
  });
  
  test('calls optional onClick callback when provided', () => {
    const onClickMock = jest.fn();
    
    render(
      <Provider store={store}>
        <ClickableResource resourceId={ResourceId.COLLECTIVE_POWER} onClick={onClickMock} />
      </Provider>
    );
    
    // Click the resource element
    const clickableElement = screen.getByText('[ + ]').closest('div.clickable-resource');
    if (clickableElement) {
      fireEvent.click(clickableElement);
    }
    
    // Check if callback was called
    expect(onClickMock).toHaveBeenCalled();
  });
  
  test('shows clicking animation on click', () => {
    render(
      <Provider store={store}>
        <ClickableResource resourceId={ResourceId.COLLECTIVE_POWER} />
      </Provider>
    );
    
    // Get clickable element
    const clickableElement = screen.getByText('[ + ]').closest('div.clickable-resource');
    expect(clickableElement).not.toHaveClass('clicking');
    
    // Click the resource element
    if (clickableElement) {
      fireEvent.click(clickableElement);
    }
    
    // Check if clicking class is applied
    expect(clickableElement).toHaveClass('clicking');
  });
});