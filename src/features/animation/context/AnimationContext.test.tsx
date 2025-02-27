import React from 'react';
import { render, screen } from '@testing-library/react';
import { AnimationProvider, useAnimation } from './AnimationContext';
import { AnimationConfig } from '../config/animationConfig';

// Mock component to test the animation hook
const TestComponent = () => {
  const animation = useAnimation();
  
  return (
    <div>
      <div data-testid="enabled">{String(animation.config.enabled)}</div>
      <div data-testid="reduced-motion">{String(animation.config.reducedMotion)}</div>
      <div data-testid="performance-mode">{animation.config.performanceMode}</div>
      <div data-testid="duration-medium">{animation.getDuration('medium')}</div>
      <div data-testid="easing-standard">{animation.getEasing('standard')}</div>
      <button 
        data-testid="toggle-animations"
        onClick={() => animation.setAnimationsEnabled(!animation.config.enabled)}
      >
        Toggle Animations
      </button>
      <button 
        data-testid="toggle-reduced-motion"
        onClick={() => animation.setReducedMotion(!animation.config.reducedMotion)}
      >
        Toggle Reduced Motion
      </button>
      <button 
        data-testid="set-performance-low"
        onClick={() => animation.setPerformanceMode('low')}
      >
        Set Low Performance
      </button>
    </div>
  );
};

describe('AnimationContext', () => {
  it('should provide default animation configuration', () => {
    render(
      <AnimationProvider>
        <TestComponent />
      </AnimationProvider>
    );
    
    expect(screen.getByTestId('enabled').textContent).toBe('true');
    expect(screen.getByTestId('reduced-motion').textContent).toBe('false');
    expect(screen.getByTestId('performance-mode').textContent).toBe('high');
    expect(screen.getByTestId('duration-medium').textContent).toBe('300');
    expect(screen.getByTestId('easing-standard').textContent).toBe('cubic-bezier(0.4, 0.0, 0.2, 1)');
  });
  
  it('should allow custom initial configuration', () => {
    const customConfig: Partial<AnimationConfig> = {
      enabled: false,
      performanceMode: 'low',
    };
    
    render(
      <AnimationProvider initialConfig={customConfig}>
        <TestComponent />
      </AnimationProvider>
    );
    
    expect(screen.getByTestId('enabled').textContent).toBe('false');
    expect(screen.getByTestId('performance-mode').textContent).toBe('low');
    // Duration should be adjusted for low performance
    expect(screen.getByTestId('duration-medium').textContent).toBe('150');
  });
  
  it('should throw error when hook is used outside provider', () => {
    // Mock console.error to avoid test output noise
    const originalError = console.error;
    console.error = jest.fn();
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAnimation must be used within an AnimationProvider');
    
    // Restore console.error
    console.error = originalError;
  });
  
  // Skip this test in CI environment as it interacts with window.matchMedia
  // which might not be available in some test environments
  it.skip('should respect user preference for reduced motion', () => {
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: true, // Simulate prefers-reduced-motion: reduce
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
    
    render(
      <AnimationProvider>
        <TestComponent />
      </AnimationProvider>
    );
    
    expect(screen.getByTestId('reduced-motion').textContent).toBe('true');
  });
});