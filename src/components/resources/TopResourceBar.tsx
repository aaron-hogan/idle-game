import React, { useState } from 'react';
import { useAppSelector } from '../../state/hooks';
import { selectUnlockedResources } from '../../state/selectors';
import { Resource } from '../../models/resource';
import './TopResourceBar.css';

// Unicode icons for different resource types - minimalist design
const RESOURCE_ICONS: Record<string, string> = {
  default: '■',
  power: '⚡',
  knowledge: '📚',
  community: '👥',
  materials: '🧱',
  tools: '🔧',
  currency: '💰',
  energy: '⚡',
  food: '🍽️'
};

interface ResourceItemProps {
  resource: Resource;
}

/**
 * Individual resource item for the top resource bar
 */
const ResourceItem: React.FC<ResourceItemProps> = ({ resource }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Get icon from resource or use default based on category/id
  const getIcon = () => {
    if (resource.icon) return resource.icon;
    
    // Try to match by id
    if (resource.id.includes('currency')) return RESOURCE_ICONS.currency;
    if (resource.id.includes('power')) return RESOURCE_ICONS.power;
    if (resource.id.includes('knowledge')) return RESOURCE_ICONS.knowledge;
    if (resource.id.includes('tool')) return RESOURCE_ICONS.tools;
    if (resource.id.includes('material')) return RESOURCE_ICONS.materials;
    if (resource.id.includes('energy')) return RESOURCE_ICONS.energy;
    if (resource.id.includes('food')) return RESOURCE_ICONS.food;
    
    // Fallback based on category
    if (resource.category === 'primary') return RESOURCE_ICONS.community;
    
    return RESOURCE_ICONS.default;
  };
  
  // Format number for display (short form for large numbers)
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toFixed(1);
  };
  
  // Determine if we should show current/max format
  const showMaxAmount = resource.maxAmount > 0 && resource.maxAmount !== Infinity;
  
  // Determine if resource is near capacity
  const isNearCapacity = showMaxAmount && (resource.amount / resource.maxAmount) > 0.9;
  
  return (
    <div 
      className={`resource-item ${isNearCapacity ? 'near-capacity' : ''}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span className="resource-icon">{getIcon()}</span>
      <span className="resource-amount">
        {formatNumber(resource.amount)}
      </span>
      
      {/* Rate indicator - only show if significant */}
      {Math.abs(resource.perSecond) > 0.01 && (
        <span className={`resource-rate ${resource.perSecond >= 0 ? 'positive' : 'negative'}`}>
          {resource.perSecond > 0 ? '+' : ''}{formatNumber(resource.perSecond)}/s
        </span>
      )}
      
      {/* Tooltip */}
      {showTooltip && (
        <div className="resource-tooltip">
          <div className="tooltip-title">{resource.name}</div>
          <div className="tooltip-description">{resource.description}</div>
          <div className="tooltip-details">
            <div>Amount: {resource.amount.toFixed(2)}</div>
            {showMaxAmount && <div>Max: {resource.maxAmount.toFixed(2)}</div>}
            <div>Rate: {resource.perSecond.toFixed(2)}/sec</div>
            {resource.clickPower && <div>Click: +{resource.clickPower.toFixed(2)}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Top resource bar displaying all unlocked resources in a compact form
 */
const TopResourceBar: React.FC = () => {
  const unlockedResources = useAppSelector(selectUnlockedResources);
  
  // Sort resources by category for display
  const sortedResources = [...unlockedResources].sort((a, b) => {
    // Sort by category
    const categoryOrder: Record<string, number> = {
      'primary': 4,
      'secondary': 3,
      'advanced': 2,
      'special': 1
    };
    
    const categoryA = a.category ? categoryOrder[a.category.toLowerCase()] || 0 : 0;
    const categoryB = b.category ? categoryOrder[b.category.toLowerCase()] || 0 : 0;
    
    return categoryB - categoryA;
  });
  
  return (
    <div className="top-resource-bar">
      {sortedResources.length > 0 ? (
        <div className="resource-items">
          {sortedResources.map(resource => (
            <ResourceItem key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        <div className="no-resources">No resources available yet</div>
      )}
    </div>
  );
};

export default TopResourceBar;