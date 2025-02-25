import React, { useState, useCallback, useEffect } from 'react';
import { useAppDispatch } from '../../state/hooks';
import { ResourceManager } from '../../systems/resourceManager';
import { ResourceId } from '../../constants/resources';
import { ProgressionManager } from '../../managers/progression/ProgressionManager';
import './ClickableResource.css';

interface ClickableResourceProps {
  resourceId: string;
  onClick?: () => void;
}

interface ClickParticle {
  id: number;
  x: number;
  y: number;
  value: number;
  opacity: number;
}

/**
 * Clickable area that generates resources when clicked
 */
const ClickableResource: React.FC<ClickableResourceProps> = ({ 
  resourceId = ResourceId.COLLECTIVE_POWER,
  onClick
}) => {
  const dispatch = useAppDispatch();
  const [particles, setParticles] = useState<ClickParticle[]>([]);
  const [nextParticleId, setNextParticleId] = useState(0);
  const [isClicking, setIsClicking] = useState(false);
  
  // Get resource manager - but don't use it directly here
  // It will be accessed in the callback when it's properly initialized

  // Handle resource click
  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    try {
      // Get click position relative to the element
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Get manager instances here, where they should be initialized
      const resourceManager = ResourceManager.getInstance();
      
      // Generate the resource - safely handle errors if not initialized
      let amountAdded = 1;
      try {
        amountAdded = resourceManager.handleResourceClick(resourceId);
      } catch (error) {
        console.error("Error handling resource click:", error);
        // Default to 1 if there's an error
      }
      
      // Create a new particle at the click position
      const newParticle = {
        id: nextParticleId,
        x,
        y,
        value: amountAdded,
        opacity: 1,
      };
      
      // Add the new particle to the list
      setParticles(prevParticles => [...prevParticles, newParticle]);
      setNextParticleId(id => id + 1);
      
      // Set clicking state for button animation
      setIsClicking(true);
      setTimeout(() => setIsClicking(false), 100);
      
      // Try to check milestone progress after resource is added
      try {
        const progressionManager = ProgressionManager.getInstance();
        progressionManager.checkMilestoneProgress();
      } catch (error) {
        console.error("Error checking milestone progress:", error);
      }
      
      // Call the optional onClick callback
      if (onClick) {
        onClick();
      }
    } catch (error) {
      console.error("Error in click handler:", error);
    }
  }, [resourceId, nextParticleId, onClick]);

  // Remove particles after they fade out
  useEffect(() => {
    if (particles.length === 0) return;
    
    const timer = setTimeout(() => {
      setParticles(prevParticles => 
        prevParticles.filter(particle => particle.opacity > 0.1)
          .map(particle => ({
            ...particle,
            y: particle.y - 2, // Move up
            opacity: particle.opacity - 0.02 // Fade out
          }))
      );
    }, 50);
    
    return () => clearTimeout(timer);
  }, [particles]);

  return (
    <div className="clickable-resource-container">
      <div 
        className={`clickable-resource ${isClicking ? 'clicking' : ''}`}
        onClick={handleClick}
      >
        <div className="click-icon">💪</div>
        <div className="click-text">Click to generate Collective Power!</div>
      </div>
      
      {/* Particles that appear on click */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="click-particle"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            opacity: particle.opacity,
          }}
        >
          +{particle.value.toFixed(1)}
        </div>
      ))}
    </div>
  );
};

export default ClickableResource;