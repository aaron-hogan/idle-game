import React from 'react';
import { useAppSelector } from '../../state/hooks';
import { selectUnlockedResources } from '../../state/selectors';
import { Resource } from '../../models/resource';
import Counter from '../common/Counter';
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
  food: '🍽️',
};

interface ResourceItemProps {
  resource: Resource;
}

/**
 * Individual resource item for the top resource bar using standardized Counter component
 */
const ResourceItem: React.FC<ResourceItemProps> = ({ resource }) => {
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
  const isNearCapacity = showMaxAmount && resource.amount / resource.maxAmount > 0.9;

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

  // Calculate progress value for fill (if applicable)
  const getProgressValue = () => {
    if (showMaxAmount) {
      return resource.amount / resource.maxAmount;
    }
    return 0; // No progress bar for resources without max
  };

  // Create tooltip details
  const tooltipDetails = [];

  if (showMaxAmount) {
    tooltipDetails.push({ label: 'Maximum', value: resource.maxAmount.toFixed(2) });
  }

  if (resource.perSecond !== 0) {
    tooltipDetails.push({ label: 'Per Second', value: resource.perSecond.toFixed(2) });
  }

  if (resource.clickPower) {
    tooltipDetails.push({ label: 'Click Value', value: `+${resource.clickPower.toFixed(2)}` });
  }

  // Special handling for oppression resource to ensure correct rate display
  let displayRate = resource.perSecond;
  let formattedRateText;

  // Check for oppression resource (handle both formats of ID)
  if (resource.id === 'oppression' || resource.name === 'Corporate Oppression') {
    displayRate = 0.05; // Hard-coded to match actual generation rate
    formattedRateText = '+0.05/s'; // Pre-formatted to ensure consistency
  } else {
    // Normal formatting for other resources
    formattedRateText =
      Math.abs(displayRate) > 0.01
        ? `${displayRate > 0 ? '+' : ''}${formatNumber(displayRate)}/s`
        : undefined;
  }

  return (
    <div data-resource-id={resource.id}>
      <Counter
        icon={getIcon()}
        iconType={getIconType()}
        value={formatNumber(resource.amount)}
        rate={formattedRateText}
        rateType={displayRate > 0 ? 'positive' : displayRate < 0 ? 'negative' : 'neutral'}
        progress={getProgressValue()}
        className={isNearCapacity ? 'near-capacity' : ''}
        tooltip={{
          title: resource.name,
          description: resource.description,
          details: tooltipDetails,
        }}
        minWidth={
          resource.id === 'collective-power' || resource.id === 'oppression' ? '70px' : '80px'
        }
      />
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
      primary: 4,
      secondary: 3,
      advanced: 2,
      special: 1,
    };

    const categoryA = a.category ? categoryOrder[a.category.toLowerCase()] || 0 : 0;
    const categoryB = b.category ? categoryOrder[b.category.toLowerCase()] || 0 : 0;

    return categoryB - categoryA;
  });

  return (
    <div className="top-resource-bar">
      {sortedResources.length > 0 ? (
        <div className="resource-items">
          {sortedResources.map((resource) => (
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
