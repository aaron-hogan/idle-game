# Animation System

A comprehensive animation system for the Anti-Capitalist Idle Game that provides consistent, performant, and accessible animations.

## Overview

The animation system provides:

1. A centralized configuration for animation settings
2. Transition components for common UI animations
3. Specialized animation components for game-specific features
4. Performance optimizations and accessibility support

## Usage

### Setting Up the Provider

Wrap your application with the `AnimationProvider`:

```tsx
import { AnimationProvider } from 'features/animation';

const App = () => {
  return (
    <AnimationProvider>
      <YourApp />
    </AnimationProvider>
  );
};
```

### Using Animation Hooks

Access animation settings and functions using the `useAnimation` hook:

```tsx
import { useAnimation } from 'features/animation';

const YourComponent = () => {
  const animation = useAnimation();
  
  return (
    <div
      style={{
        transition: `all ${animation.getDuration('medium')}ms ${animation.getEasing('standard')}`,
      }}
    >
      Animated content
    </div>
  );
};
```

### Using Transition Components

Use pre-built transition components for common animations:

```tsx
import { FadeTransition, SlideTransition, ScaleTransition } from 'features/animation';

// Fade in/out
<FadeTransition in={isVisible}>
  <YourContent />
</FadeTransition>

// Slide from a direction
<SlideTransition in={isVisible} direction="up">
  <YourContent />
</SlideTransition>

// Scale in/out
<ScaleTransition in={isVisible} from={0.8} to={1}>
  <YourContent />
</ScaleTransition>
```

### Using Resource Animations

Animate resource changes:

```tsx
import { ResourceAnimation } from 'features/animation';

// Show resource gain
<ResourceAnimation
  value={100}
  type="gain"
  resourceType="collectivePower"
  position={{ x: event.clientX, y: event.clientY }}
/>
```

### Animated Numbers

Smoothly transition between number values:

```tsx
import { AnimatedNumber } from 'features/animation';

<AnimatedNumber
  value={resource.amount}
  formatter={(val) => `${val.toFixed(0)}`}
/>
```

## Performance Considerations

The animation system includes several performance optimizations:

1. **Performance Modes**: Three performance levels (high, medium, low) that adjust animation complexity
2. **Reduced Motion Support**: Respects user's prefers-reduced-motion setting
3. **Animation Toggling**: Global toggle to enable/disable all animations
4. **Efficient Rendering**: Only animates when necessary and uses requestAnimationFrame

### Setting Performance Mode

```tsx
const { setPerformanceMode } = useAnimation();

// Set performance mode based on device capability
setPerformanceMode('medium');
```

## Accessibility

The animation system respects accessibility preferences:

1. Automatically detects and respects `prefers-reduced-motion` setting
2. Provides manual control over reduced motion settings
3. Ensures animations don't interfere with content visibility

```tsx
const { setReducedMotion } = useAnimation();

// Manually enable reduced motion
setReducedMotion(true);
```

## API Reference

See [Animation System Plan](/docs/features/visual-design/animation-system-plan.md) for complete API reference.