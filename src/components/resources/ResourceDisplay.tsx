import React, { useState, useEffect, useRef } from 'react';
import { Resource } from '../../models/resource';
import { formatNumber } from '../../utils/numberUtils';
import './ResourceDisplay.css';

interface ResourceDisplayProps {
  resource: Resource;
  className?: string;
}

const ResourceDisplay: React.FC<ResourceDisplayProps> = ({ resource, className = '' }) => {
  const [previousAmount, setPreviousAmount] = useState(resource.amount);
  const [animateGain, setAnimateGain] = useState(false);
  const [animateLoss, setAnimateLoss] = useState(false);
  const [delta, setDelta] = useState(0);
  
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Calculate the change in resource amount
    const difference = resource.amount - previousAmount;
    
    // Only animate if there's a non-zero difference
    if (difference !== 0) {
      setDelta(difference);
      
      if (difference > 0) {
        setAnimateGain(true);
      } else {
        setAnimateLoss(true);
      }
      
      // Clear any existing timeout
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      
      // Set a timeout to remove the animation class
      animationTimeoutRef.current = setTimeout(() => {
        setAnimateGain(false);
        setAnimateLoss(false);
        animationTimeoutRef.current = null;
      }, 1500);
    }
    
    // Update previous amount for next comparison
    setPreviousAmount(resource.amount);
    
    // Clean up timeout on unmount
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [resource.amount, previousAmount]);
  
  const percentFull = Math.min(100, (resource.amount / resource.maxAmount) * 100);
  
  return (
    <div className={`resource-display ${className}`}>
      <div className="resource-header">
        <div className="resource-name">{resource.name}</div>
        <div className={`resource-amount ${animateGain ? 'gain' : ''} ${animateLoss ? 'loss' : ''}`}>
          {formatNumber(resource.amount)} / {formatNumber(resource.maxAmount)}
          
          {delta !== 0 && (animateGain || animateLoss) && (
            <span className={`resource-delta ${delta > 0 ? 'positive' : 'negative'}`}>
              {delta > 0 ? '+' : ''}{formatNumber(delta)}
            </span>
          )}
        </div>
      </div>
      
      <div className="resource-progress-container">
        <div 
          className="resource-progress-bar"
          style={{ width: `${percentFull}%` }}
        ></div>
      </div>
      
      <div className="resource-rate">
        {resource.perSecond > 0 ? '+' : ''}{formatNumber(resource.perSecond)}/sec
      </div>
    </div>
  );
};

export default ResourceDisplay;