import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ResourceGenerators from '../ResourceGenerators';
import resourcesReducer, { addResource } from '../../../state/resourcesSlice';
import { ResourceManager } from '../../../systems/resourceManager';
import { resetSingleton } from '../../../utils/testUtils';

// Mock the ResourceManager
jest.mock('../../../systems/resourceManager', () => {
  const original = jest.requireActual('../../../systems/resourceManager');
  return {
    ...original,
    ResourceManager: {
      getInstance: jest.fn(),
      handleResourceClick: jest.fn()
    }
  };
});

describe('ResourceGenerators', () => {
  let mockStore: any;
  let mockHandleResourceClick: jest.Mock;
  
  beforeEach(() => {
    // Reset singleton instance before each test
    resetSingleton(ResourceManager);
    
    // Create test store
    mockStore = configureStore({
      reducer: {
        resources: resourcesReducer
      }
    });
    
    // Mock ResourceManager.handleResourceClick
    mockHandleResourceClick = jest.fn().mockReturnValue(5);
    
    // Set up ResourceManager mock
    const mockResourceManager = {
      handleResourceClick: mockHandleResourceClick,
      initialize: jest.fn()
    };
    
    (ResourceManager.getInstance as jest.Mock).mockReturnValue(mockResourceManager);
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders placeholder when no generators are available', () => {
    render(
      <Provider store={mockStore}>
        <ResourceGenerators />
      </Provider>
    );
    
    // Should show the placeholder for the main generator
    expect(screen.getByText('Collective Power')).toBeInTheDocument();
    expect(screen.getByText('Click to generate your first resource')).toBeInTheDocument();
    expect(screen.getByText('Start Generating')).toBeInTheDocument();
    
    // Should also show the locked generators
    expect(screen.getByText('Knowledge Network')).toBeInTheDocument();
    expect(screen.getByText('Community Support')).toBeInTheDocument();
    expect(screen.getByText('Resources Center')).toBeInTheDocument();
    expect(screen.getByText('Material Production')).toBeInTheDocument();
    expect(screen.getByText('Solidarity Network')).toBeInTheDocument();
  });
  
  test('renders active generators when available', () => {
    // Add a resource to the store
    mockStore.dispatch(addResource({
      id: 'test-resource',
      name: 'Test Resource',
      amount: 50,
      maxAmount: 100,
      perSecond: 2,
      clickPower: 5,
      description: 'A test resource',
      unlocked: true,
      category: 'basic',
      icon: '🔨'
    }));
    
    render(
      <Provider store={mockStore}>
        <ResourceGenerators />
      </Provider>
    );
    
    // Should show the active generator for the test resource
    expect(screen.getByText('Test Resource')).toBeInTheDocument();
    expect(screen.getByText(/Produces: \+2.0\/sec/)).toBeInTheDocument();
    expect(screen.getByText(/Click: \+5.0/)).toBeInTheDocument();
    
    // Should show the correct efficiency
    const efficiency = Math.min(100, (2 / 5) * 10); // perSecond / clickPower * 10
    expect(screen.getByText(`${Math.floor(efficiency)}%`)).toBeInTheDocument();
  });
  
  test('generators have correct layout in the grid', () => {
    // Add a resource to the store
    mockStore.dispatch(addResource({
      id: 'test-resource',
      name: 'Test Resource',
      amount: 50,
      maxAmount: 100,
      perSecond: 2,
      clickPower: 5,
      description: 'A test resource',
      unlocked: true,
      category: 'basic',
      icon: '🔨'
    }));
    
    const { container } = render(
      <Provider store={mockStore}>
        <ResourceGenerators />
      </Provider>
    );
    
    // Check that all generators are in the grid container
    const gridContainer = container.querySelector('.generators-grid');
    expect(gridContainer).not.toBeNull();
    
    // All generators should have the same base classes
    const activeGenerator = container.querySelector('.resource-generator');
    const lockedGenerator = container.querySelector('.generator-coming-soon');
    
    // Check that these elements exist
    expect(activeGenerator).not.toBeNull();
    expect(lockedGenerator).not.toBeNull();
    
    // Check CSS classes are applied correctly
    expect(activeGenerator).toHaveClass('resource-generator');
    expect(lockedGenerator).toHaveClass('generator-coming-soon');
    
    // Check that the active generator contains expected elements
    expect(activeGenerator?.querySelector('.progress-indicator')).not.toBeNull();
    expect(activeGenerator?.querySelector('.generator-icon')).not.toBeNull();
    expect(activeGenerator?.querySelector('.generator-name')).not.toBeNull();
    expect(activeGenerator?.querySelector('.generator-desc')).not.toBeNull();
    
    // Check that both elements are present in the correct container
    const gridItems = container.querySelectorAll('.generators-grid > div');
    expect(gridItems.length).toBeGreaterThan(1);
    
    // Check that both types of cards have the proper structure
    expect(activeGenerator?.querySelector('.generator-name')).toHaveTextContent('Test Resource');
    expect(lockedGenerator?.querySelector('.generator-name')).toBeTruthy();
    
    // Check both have the progress indicator
    expect(activeGenerator?.querySelector('.progress-indicator')).toBeTruthy();
    expect(lockedGenerator?.querySelector('.progress-indicator')).toBeTruthy();
  });
  
  test('clicking a generator calls handleResourceClick and animates', async () => {
    // Add a resource to the store
    mockStore.dispatch(addResource({
      id: 'test-resource',
      name: 'Test Resource',
      amount: 50,
      maxAmount: 100,
      perSecond: 2,
      clickPower: 5,
      description: 'A test resource',
      unlocked: true,
      category: 'basic',
      icon: '🔨'
    }));
    
    const { container, rerender } = render(
      <Provider store={mockStore}>
        <ResourceGenerators />
      </Provider>
    );
    
    // Find the generator element
    const generator = screen.getByText('Test Resource').closest('.resource-generator');
    expect(generator).not.toBeNull();
    
    // Get the initial progress style
    const initialStyle = generator?.getAttribute('style');
    expect(initialStyle).toContain('--progress-height');
    
    // Click the generator
    fireEvent.click(generator!);
    
    // ResourceManager.handleResourceClick should be called with the resource id
    expect(mockHandleResourceClick).toHaveBeenCalledWith('test-resource');
    
    // The generator should have the clicking class
    expect(generator).toHaveClass('clicking');
    
    // After the animation duration, the clicking class should be removed
    await waitFor(() => {
      expect(generator).not.toHaveClass('clicking');
    }, { timeout: 200 });
  });
  
  test('progress bar height changes when perSecond value updates', async () => {
    // Simulate a resource with changing production rate
    act(() => {
      mockStore.dispatch(addResource({
        id: 'progressing-resource',
        name: 'Progressing Resource',
        amount: 100,
        maxAmount: 1000,
        perSecond: 1, // Initially low production rate
        clickPower: 10,
        description: 'Resource with changing production',
        unlocked: true,
        category: 'test'
      }));
    });
    
    const { container, rerender } = render(
      <Provider store={mockStore}>
        <ResourceGenerators />
      </Provider>
    );
    
    // Find the generator and verify initial progress
    const generator = screen.getByText('Progressing Resource').closest('.resource-generator');
    
    // Get the initial style
    const initialStyle = generator?.getAttribute('style');
    expect(initialStyle).toContain('--progress-height: 1%');
    
    // Check that progress indicator shows the correct value
    expect(screen.getByText('1%')).toBeInTheDocument();
    
    // Now update the resource with a higher production rate
    act(() => {
      mockStore.dispatch(addResource({
        id: 'progressing-resource',
        name: 'Progressing Resource',
        amount: 100,
        maxAmount: 1000,
        perSecond: 8, // Higher production rate
        clickPower: 10,
        description: 'Resource with changing production',
        unlocked: true,
        category: 'test'
      }));
    });
    
    // Re-render with the new state
    act(() => {
      rerender(
        <Provider store={mockStore}>
          <ResourceGenerators />
        </Provider>
      );
    });
    
    // Verify progress has increased
    const updatedStyle = generator?.getAttribute('style');
    expect(updatedStyle).toContain('--progress-height: 8%');
    
    // Progress indicator should update with the new value
    expect(screen.getByText('8%')).toBeInTheDocument();
    
    // Check CSS class has changed to reflect efficiency level
    expect(generator).toHaveClass('efficiency-25');
  });
  
  test('progress bar fill updates when resource values change', () => {
    // Initial resource with low efficiency
    mockStore.dispatch(addResource({
      id: 'progress-test',
      name: 'Progress Test',
      amount: 50,
      maxAmount: 100,
      perSecond: 2, // This will give 2/10*10 = 20% progress
      clickPower: 10,
      description: 'Test resource',
      unlocked: true,
      category: 'basic'
    }));
    
    const { container, rerender } = render(
      <Provider store={mockStore}>
        <ResourceGenerators />
      </Provider>
    );
    
    // Find the generator and check initial progress
    let generator = screen.getByText('Progress Test').closest('.resource-generator');
    let progressStyle = generator?.getAttribute('style');
    expect(progressStyle).toContain('--progress-height: 2%');
    
    // Progress indicator text should show the floor of the percentage
    expect(screen.getByText('2%')).toBeInTheDocument();
    
    // Now update the resource to increase efficiency
    act(() => {
      mockStore.dispatch(addResource({
        id: 'progress-test',
        name: 'Progress Test',
        amount: 60, // Increased amount
        maxAmount: 100,
        perSecond: 6, // Increased perSecond (6/10*10 = 60% progress)
        clickPower: 10,
        description: 'Test resource',
        unlocked: true,
        category: 'basic'
      }));
    });
    
    // Re-render with updated state
    act(() => {
      rerender(
        <Provider store={mockStore}>
          <ResourceGenerators />
        </Provider>
      );
    });
    
    // After update, the progress should be higher
    generator = screen.getByText('Progress Test').closest('.resource-generator');
    progressStyle = generator?.getAttribute('style');
    expect(progressStyle).toContain('--progress-height: 6%');
    
    // Progress indicator text should also be updated
    expect(screen.getByText('6%')).toBeInTheDocument();
  });
  
  test('efficiency calculation is applied correctly', () => {
    // Add resources with different efficiency levels
    act(() => {
      mockStore.dispatch(addResource({
        id: 'low-efficiency',
        name: 'Low Efficiency',
        amount: 50,
        maxAmount: 100,
        perSecond: 0.5,
        clickPower: 10,
        description: 'Low efficiency resource',
        unlocked: true,
        category: 'basic',
        icon: '🐌'
      }));
      
      mockStore.dispatch(addResource({
        id: 'high-efficiency',
        name: 'High Efficiency',
        amount: 50,
        maxAmount: 100,
        perSecond: 8,
        clickPower: 10,
        description: 'High efficiency resource',
        unlocked: true,
        category: 'basic',
        icon: '🚀'
      }));
    });
    
    const { container } = render(
      <Provider store={mockStore}>
        <ResourceGenerators />
      </Provider>
    );
    
    // Find the generator elements
    const lowEfficiencyGenerator = screen.getByText('Low Efficiency').closest('.resource-generator');
    const highEfficiencyGenerator = screen.getByText('High Efficiency').closest('.resource-generator');
    
    // Check that these elements exist
    expect(lowEfficiencyGenerator).not.toBeNull();
    expect(highEfficiencyGenerator).not.toBeNull();
    
    // Verify that percentage indicators are shown
    expect(screen.getByText('0%')).toBeInTheDocument(); // Low efficiency with Math.floor()
    expect(screen.getByText('8%')).toBeInTheDocument(); // High efficiency with Math.floor()
    
    // Check CSS classes applied based on efficiency ranges
    expect(lowEfficiencyGenerator).toHaveClass('efficiency-25');
    
    // Verify style properties for progress bar height
    expect(lowEfficiencyGenerator).toHaveAttribute('style', expect.stringContaining('--progress-height: 0.5%'));
    expect(highEfficiencyGenerator).toHaveAttribute('style', expect.stringContaining('--progress-height: 8%'));
  });
  
  test('placeholder button starts generation', () => {
    // Set up fake timers
    jest.useFakeTimers();
    
    // Mock window.location.reload
    const mockReload = jest.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: mockReload },
      writable: true
    });
    
    render(
      <Provider store={mockStore}>
        <ResourceGenerators />
      </Provider>
    );
    
    // Find the placeholder button
    const startButton = screen.getByText('Start Generating');
    expect(startButton).toBeInTheDocument();
    
    // Click the button
    fireEvent.click(startButton);
    
    // ResourceManager.handleResourceClick should be called with the main resource id
    expect(mockHandleResourceClick).toHaveBeenCalledWith('collective-power');
    
    // Advance timers to trigger the reload
    jest.advanceTimersByTime(500);
    expect(mockReload).toHaveBeenCalled();
    
    // Restore real timers
    jest.useRealTimers();
  });
});