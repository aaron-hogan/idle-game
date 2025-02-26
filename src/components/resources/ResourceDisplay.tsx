import React, { useState, useEffect, useRef } from 'react';
import { Resource } from '../../models/resource';
import { formatNumber } from '../../utils/numberUtils';
import Counter from '../common/Counter';
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
  
  // Determine counter icon type based on resource ID or category
  const getIconType = () => {
    if (resource.id.includes('power')) return 'power';
    if (resource.id.includes('knowledge')) return 'knowledge';
    if (resource.id.includes('awareness')) return 'knowledge';
    if (resource.id.includes('connection')) return 'community';
    if (resource.id.includes('community')) return 'community';
    if (resource.id.includes('currency')) return 'currency';
    if (resource.id.includes('material')) return 'materials';
    if (resource.category === 'primary') return 'power';
    return 'default';
  };
  
  // Get appropriate icon for the resource
  const getIcon = () => {
    if (resource.icon) return resource.icon;
    
    // Simple mapping based on type
    const iconMap: Record<string, string> = {
      power: '⚡',
      knowledge: '📚',
      community: '👥',
      materials: '🧱',
      currency: '💰',
      default: '■'
    };
    
    return iconMap[getIconType()] || iconMap.default;
  };
  
  // Create tooltip details
  const tooltipDetails = [
    { label: 'Current', value: resource.amount.toFixed(2) },
    { label: 'Maximum', value: resource.maxAmount.toFixed(2) },
    { label: 'Per Second', value: resource.perSecond.toFixed(2) }
  ];
  
  if (resource.clickPower) {
    tooltipDetails.push({ label: 'Click Value', value: `+${resource.clickPower.toFixed(2)}` });
  }
  
  if (delta !== 0 && (animateGain || animateLoss)) {
    tooltipDetails.push({ 
      label: 'Change', 
      value: `${delta > 0 ? '+' : ''}${delta.toFixed(2)}` 
    });
  }
  
  return (
    <div className={`resource-display ${className} ${animateGain ? 'gain' : ''} ${animateLoss ? 'loss' : ''}`}>
      <Counter
        icon={getIcon()}
        iconType={getIconType()}
        value={`${formatNumber(resource.amount)} / ${formatNumber(resource.maxAmount)}`}
        rate={`${resource.perSecond > 0 ? '+' : ''}${formatNumber(resource.perSecond)}/sec`}
        rateType={resource.perSecond > 0 ? 'positive' : resource.perSecond < 0 ? 'negative' : 'neutral'}
        progress={percentFull / 100} // Convert percentage to 0-1 range
        tooltip={{
          title: resource.name,
          description: resource.description || `${resource.name} resource`,
          details: tooltipDetails
        }}
        className={delta !== 0 ? (delta > 0 ? 'resource-increasing' : 'resource-decreasing') : ''}
      />
    </div>
  );
};

export default ResourceDisplay;