import React from 'react';
import { Resource } from '../models/resource';

interface ResourceDisplayProps {
  resource: Resource;
  showDetails?: boolean;
}

/**
 * Component to display a resource with its amount and generation rate
 */
const ResourceDisplay: React.FC<ResourceDisplayProps> = ({ 
  resource,
  showDetails = true,
}) => {
  const { name, amount, maxAmount, perSecond, description } = resource;
  
  // Format the amount with 1 decimal place if not a whole number
  const formattedAmount = Math.floor(amount) === amount 
    ? Math.floor(amount).toString() 
    : amount.toFixed(1);
  
  // Format the per second rate with appropriate precision
  const formattedRate = perSecond === 0 
    ? '0' 
    : perSecond < 0.1 
      ? perSecond.toFixed(2) 
      : perSecond.toFixed(1);
  
  // Calculate percentage of capacity
  const capacityPercentage = (amount / maxAmount) * 100;
  
  return (
    <div className="resource-display">
      <div className="resource-name">
        {name}
        <div className="resource-amount">
          {formattedAmount} / {maxAmount}
        </div>
      </div>
      
      <div className="resource-progress" title={`${capacityPercentage.toFixed(0)}% full`}>
        <div 
          className="resource-progress-bar" 
          style={{ width: `${capacityPercentage}%` }}
        />
      </div>
      
      {showDetails && (
        <>
          <div className="resource-rate">
            {perSecond >= 0 ? '+' : ''}{formattedRate}/s
          </div>
          
          <div className="resource-description">
            {description}
          </div>
        </>
      )}
    </div>
  );
};

export default ResourceDisplay;