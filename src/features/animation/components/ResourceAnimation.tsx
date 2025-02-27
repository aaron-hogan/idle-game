import React, { useState, useEffect, useRef } from 'react';
import { useAnimation } from '../context/AnimationContext';
import '../styles/ResourceAnimation.css';

interface ResourceAnimationProps {
  value: number;
  type: 'gain' | 'loss';
  resourceType: string;
  position?: { x: number, y: number };
  count?: number;
  onComplete?: () => void;
  className?: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  scale: number;
  value: number;
}

// Helper function to generate random number within a range
const random = (min: number, max: number) => Math.random() * (max - min) + min;

const ResourceAnimation: React.FC<ResourceAnimationProps> = ({
  value,
  type,
  resourceType,
  position,
  count = 5,
  onComplete,
  className = '',
}) => {
  const animation = useAnimation();
  const [particles, setParticles] = useState<Particle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const endTimeRef = useRef<number>(0);
  
  // Generate initial particles
  useEffect(() => {
    if (!animation.shouldAnimate('resource')) {
      onComplete?.();
      return;
    }
    
    const duration = animation.getDuration('slow');
    endTimeRef.current = Date.now() + duration;
    
    // Determine initial position
    const initialX = position?.x ?? window.innerWidth / 2;
    const initialY = position?.y ?? window.innerHeight / 2;
    
    // Calculate particles count based on value
    // More particles for larger values, but cap at a reasonable number
    let particleCount = Math.min(count, Math.ceil(Math.abs(value) / 10) + 2);
    particleCount = Math.max(particleCount, 1); // At least one particle
    
    // Create particles
    const newParticles = Array.from({ length: particleCount }).map((_, index) => {
      // Distribute value among particles
      const particleValue = value / particleCount;
      
      return {
        id: Date.now() + index,
        x: initialX,
        y: initialY,
        vx: random(-2, 2), // horizontal velocity
        vy: random(-5, -2), // vertical velocity (always up)
        opacity: 1,
        scale: random(0.8, 1.2),
        value: particleValue
      };
    });
    
    setParticles(newParticles);
    
    // Start animation
    if (animationFrameRef.current === null) {
      animationFrameRef.current = requestAnimationFrame(updateParticles);
    }
    
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [value, type, resourceType, position, count, animation, onComplete]);
  
  // Update particle positions
  const updateParticles = () => {
    const now = Date.now();
    const timeRemaining = endTimeRef.current - now;
    const isAnimationComplete = timeRemaining <= 0;
    
    // If animation is complete, clean up
    if (isAnimationComplete) {
      setParticles([]);
      animationFrameRef.current = null;
      onComplete?.();
      return;
    }
    
    // Update particles
    setParticles(prev => 
      prev.map(particle => {
        // Calculate progress (0 to 1)
        const progress = 1 - (timeRemaining / animation.getDuration('slow'));
        
        // Update position
        const x = particle.x + particle.vx;
        const y = particle.y + particle.vy;
        
        // Apply "gravity" effect - slow down the ascent
        const vy = particle.vy + 0.1;
        
        // Fade out as the animation progresses
        const opacity = 1 - progress;
        
        return {
          ...particle,
          x,
          y,
          vy,
          opacity
        };
      })
    );
    
    // Continue animation
    animationFrameRef.current = requestAnimationFrame(updateParticles);
  };
  
  // Format particle value
  const formatValue = (val: number): string => {
    const absValue = Math.abs(val);
    const prefix = val > 0 ? '+' : '-';
    
    if (absValue >= 1000000) {
      return `${prefix}${(absValue / 1000000).toFixed(1)}M`;
    } else if (absValue >= 1000) {
      return `${prefix}${(absValue / 1000).toFixed(1)}k`;
    } else if (absValue >= 10) {
      return `${prefix}${Math.floor(absValue)}`;
    } else {
      return `${prefix}${absValue.toFixed(1)}`;
    }
  };
  
  if (!animation.shouldAnimate('resource') || particles.length === 0) {
    return null;
  }
  
  // Get resource color based on resource type
  const getResourceColor = () => {
    switch (resourceType) {
      case 'collectivePower': 
        return 'var(--resource-power-color, #4a90e2)';
      case 'solidarity': 
        return 'var(--resource-solidarity-color, #50c878)';
      case 'oppression': 
        return 'var(--resource-threat-color, #e74c3c)';
      case 'communityTrust': 
        return 'var(--resource-social-color, #f39c12)';
      default: 
        return '#ffffff';
    }
  };
  
  return (
    <div 
      ref={containerRef} 
      className={`resource-animation-container ${className}`}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    >
      {particles.map(particle => (
        <div
          key={particle.id}
          className={`resource-particle resource-particle-${type}`}
          style={{
            position: 'absolute',
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            opacity: particle.opacity,
            transform: `scale(${particle.scale})`,
            color: getResourceColor(),
            fontWeight: 'bold',
            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            pointerEvents: 'none',
            zIndex: 9999,
          }}
        >
          {formatValue(particle.value)}
        </div>
      ))}
    </div>
  );
};

export default ResourceAnimation;