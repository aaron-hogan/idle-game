# Animation System Plan

## Overview

This document outlines the implementation plan for a comprehensive animation system in our idle game. The goal is to create visually appealing animations that enhance user experience while maintaining performance across devices.

## 1. Overall Approach and Architecture

### Design Philosophy
- Minimal, purpose-driven animations that enhance user experience
- Performance-optimized animations that work well on all devices
- Consistent animation language that aligns with the game's clean, minimal visual design
- Accessibility considerations including reduced motion support

### Architecture Overview
- **Component-based animation system**: Self-contained animations within React components
- **Centralized animation configuration**: Global animation settings and parameters
- **Performance monitoring**: Analytics for animation performance impact
- **Fallback mechanisms**: Graceful degradation for low-end devices
- **Event-driven triggering**: Animations respond to game state changes and user interactions

### Technical Approach
- CSS transitions and animations for simple UI elements
- React-based animation libraries for complex transitions
- Optimized animation scheduling aligned with browser rendering cycles
- Isolation of animations from game logic for separation of concerns
- Configuration-driven implementation for easy tuning and adjustments

## 2. Component Structure

### Core Animation Components

1. **AnimationProvider**
   - Context provider that supplies animation settings
   - Handles global animation toggling and reduced motion preferences
   - Manages animation performance thresholds

2. **Transition Components**
   - `FadeTransition`: Opacity-based transitions for elements appearing/disappearing
   - `SlideTransition`: Position-based transitions for elements entering/exiting
   - `ScaleTransition`: Size-based transitions for emphasizing elements
   - `ColorTransition`: Color change animations for state changes

3. **Animation Components**
   - `ResourceAnimation`: Visualizes resource gains/losses
   - `NotificationAnimation`: Attention-grabbing notifications
   - `ProgressAnimation`: Visual feedback for progress updates
   - `AchievementAnimation`: Celebratory animations for milestones

4. **Utility Components**
   - `AnimatedNumber`: Smoothly transitions between numeric values
   - `AnimatedIcon`: Applies animations to icons based on state
   - `AnimatedBackground`: Subtle background animations
   - `LoadingAnimation`: Visual feedback during processing/loading

### Integration Components

1. **ResourceFlowAnimation**
   - Visualizes resource transfers between game entities
   - Shows cause-and-effect relationship in resource generation

2. **BuildingAnimation**
   - Provides visual feedback when buildings are purchased or upgraded
   - Shows construction and improvement processes

3. **ActionAnimation**
   - Visualizes the effects of player actions
   - Provides immediate feedback for task completion

4. **EventAnimation**
   - Highlights important game events
   - Creates visual impact for story moments

## 3. Implementation Phases

### Phase 1: Foundation (2 weeks)
- Create animation configuration system with CSS variables
- Implement AnimationProvider with global settings
- Develop basic transition components (Fade, Slide, Scale)
- Set up reduced motion support
- Create animation utilities (timing functions, durations)
- Add performance monitoring for animations

### Phase 2: Core UI Animations (3 weeks)
- Implement AnimatedNumber for resource counters
- Create notification system animations
- Add hover and interactive state animations to buttons and controls
- Implement card and panel transition animations
- Add loading and progress animations
- Develop modal and dialog animations

### Phase 3: Game-Specific Animations (3 weeks)
- Create resource flow visualizations
- Implement building purchase/upgrade animations
- Add task completion animations
- Develop milestone and achievement animations
- Create event announcement animations
- Implement stage transition effects

### Phase 4: Polish and Optimization (2 weeks)
- Optimize animations for performance
- Add fine-tuning controls for animation timing
- Implement animation sequencing for complex interactions
- Create special event animations
- Add subtle background animations
- Implement final touches and consistency pass

## 4. API Design

### Animation Configuration API

```typescript
interface AnimationConfig {
  // Global settings
  enabled: boolean;               // Master toggle for all animations
  reducedMotion: boolean;         // Respect user's reduced motion preference
  performanceMode: 'high' | 'medium' | 'low'; // Adjusts animation complexity based on device capability
  
  // Timing values (in ms)
  durations: {
    veryFast: number;            // 100ms - For tiny UI responses
    fast: number;                // 200ms - For common interactions
    medium: number;              // 300ms - For standard transitions
    slow: number;                // 500ms - For emphasis
    verySlow: number;            // 800ms - For dramatic effect
  };
  
  // Easing functions
  easings: {
    standard: string;            // 'cubic-bezier(0.4, 0.0, 0.2, 1)' - Default easing
    accelerate: string;          // 'cubic-bezier(0.4, 0.0, 1, 1)' - Elements entering screen
    decelerate: string;          // 'cubic-bezier(0.0, 0.0, 0.2, 1)' - Elements leaving screen
    sharp: string;               // 'cubic-bezier(0.4, 0.0, 0.6, 1)' - For emphasis
  };
}
```

### AnimationProvider API

```typescript
// Context Provider
const AnimationContext = React.createContext<AnimationContextValue>(defaultValue);

// Hook for consuming animations
function useAnimation(): AnimationAPI {
  const context = useContext(AnimationContext);
  return {
    // Check if animations should run
    shouldAnimate(type?: AnimationType): boolean,
    
    // Get appropriate duration based on type and performance mode
    getDuration(speed: 'veryFast' | 'fast' | 'medium' | 'slow' | 'verySlow'): number,
    
    // Get appropriate easing function
    getEasing(type: 'standard' | 'accelerate' | 'decelerate' | 'sharp'): string,
    
    // Toggle animations globally
    setAnimationsEnabled(enabled: boolean): void,
    
    // Force reduced motion mode
    setReducedMotion(reduced: boolean): void,
    
    // Set performance mode
    setPerformanceMode(mode: 'high' | 'medium' | 'low'): void
  };
}
```

### Transition Component APIs

```typescript
// FadeTransition Props
interface FadeTransitionProps {
  in: boolean;                    // Whether element should be visible
  duration?: number;              // Override default duration
  easing?: string;                // Override default easing
  unmountOnExit?: boolean;        // Remove from DOM when not visible
  mountOnEnter?: boolean;         // Only add to DOM when visible
  onEnter?: () => void;           // Callback when enter begins
  onEntered?: () => void;         // Callback when enter completes
  onExit?: () => void;            // Callback when exit begins
  onExited?: () => void;          // Callback when exit completes
  children: React.ReactNode;
}

// SlideTransition Props
interface SlideTransitionProps extends FadeTransitionProps {
  direction: 'up' | 'down' | 'left' | 'right'; // Direction to slide from/to
  distance?: string | number;     // How far to slide (default: '20px')
}

// ScaleTransition Props
interface ScaleTransitionProps extends FadeTransitionProps {
  from?: number;                  // Starting scale (default: 0.8)
  to?: number;                    // Ending scale (default: 1)
}
```

### Animation Component APIs

```typescript
// Resource Animation
interface ResourceAnimationProps {
  value: number;                  // Value to animate
  type: 'gain' | 'loss';          // Whether gaining or losing resources
  resourceType: string;           // Type of resource (for styling)
  position?: { x: number, y: number }; // Starting position
  onComplete?: () => void;        // Callback when animation completes
}

// Notification Animation
interface NotificationAnimationProps {
  message: string;                // Message to display
  type: 'info' | 'success' | 'warning' | 'error'; // Type of notification
  duration?: number;              // How long to show notification
  onClose?: () => void;           // Callback when notification closes
}

// Progress Animation
interface ProgressAnimationProps {
  value: number;                  // Current progress value (0-100)
  previousValue?: number;         // Previous value for animation
  color?: string;                 // Color of progress indicator
  duration?: number;              // Duration of transition
}
```

## Animation Usage Examples

```tsx
// Using FadeTransition
<FadeTransition in={isVisible} duration={300}>
  <div className="notification">New content available!</div>
</FadeTransition>

// Using AnimatedNumber
<AnimatedNumber 
  value={resources.collectivePower} 
  formatter={(value) => formatNumber(value, 1)}
/>

// Using ResourceAnimation
{resourceGain && (
  <ResourceAnimation 
    value={resourceGain}
    type="gain"
    resourceType="collectivePower"
    position={{ x: event.clientX, y: event.clientY }}
  />
)}

// Using the animation hook
function BuildingItem({ building }) {
  const animation = useAnimation();
  
  return (
    <div 
      className="building-item"
      style={{
        transition: `all ${animation.getDuration('medium')}ms ${animation.getEasing('standard')}`,
        opacity: building.available ? 1 : 0.5
      }}
    >
      {building.name}
    </div>
  );
}
```

## Next Steps

1. Review this plan with the team
2. Create tasks for Phase 1 implementation
3. Develop a proof-of-concept for resource animations
4. Establish performance benchmarks