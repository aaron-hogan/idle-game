// Export animation components and hooks
import { AnimationProvider, useAnimation } from './context/AnimationContext';
import FadeTransition from './components/FadeTransition';
import ScaleTransition from './components/ScaleTransition';
import SlideTransition from './components/SlideTransition';
import AnimatedNumber from './components/AnimatedNumber';
import ResourceAnimation from './components/ResourceAnimation';

// Export animation configuration types
import {
  AnimationConfig,
  defaultAnimationConfig,
  AnimationSpeed,
  EasingType,
  AnimationType,
  PerformanceMode
} from './config/animationConfig';

export {
  // Context and hook
  AnimationProvider,
  useAnimation,
  
  // Components
  FadeTransition,
  ScaleTransition,
  SlideTransition,
  AnimatedNumber,
  ResourceAnimation,
  
  // Types
  AnimationConfig,
  defaultAnimationConfig,
  AnimationSpeed,
  EasingType,
  AnimationType,
  PerformanceMode
};