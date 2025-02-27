import React, { useState, useMemo } from 'react';
import { useAppSelector } from '../../state/hooks';
import { useSelector } from 'react-redux';
import { 
  selectUnlockedResources, 
  selectAllResources
} from '../../state/selectors';
import { Resource } from '../../models/resource';
import { ResourceManager } from '../../systems/resourceManager';
import { allMilestones } from '../../data/progression/milestones';
import './ResourceGenerators.css';

interface ResourceGeneratorProps {
  resource: Resource;
  onClick: (resourceId: string) => void;
}

/**
 * Individual resource generator component
 */
const ResourceGenerator: React.FC<ResourceGeneratorProps> = ({ resource, onClick }) => {
  // Track click animation
  const [isClicking, setIsClicking] = useState(false);
  // Track click cooldown
  const [onCooldown, setOnCooldown] = useState(false);
  // Click result feedback
  const [lastClickAmount, setLastClickAmount] = useState<number | null>(null);
  
  // Get resources to find next milestone
  const resources = useAppSelector(selectAllResources);
  
  // Handle click with animation and cooldown
  const handleClick = () => {
    // If on cooldown, don't do anything
    if (onCooldown) return;
    
    // Apply the click
    const result = onClick(resource.id);
    
    // Start cooldown (250ms minimum delay between clicks)
    setOnCooldown(true);
    setTimeout(() => setOnCooldown(false), 250);
    
    // Show animation
    setIsClicking(true);
    setTimeout(() => setIsClicking(false), 150);
    
    // Save amount for feedback
    // The result is the amount generated, but dispatch doesn't return a value
    // so we'll just use the expected amount directly from the resource
    const clickAmount = resource.clickPower || 0;
    if (clickAmount > 0) {
      setLastClickAmount(clickAmount);
      
      // Clear feedback after 1 second
      setTimeout(() => setLastClickAmount(null), 1000);
    }
  };
  
  // Get appropriate ASCII icon
  const getIcon = () => {
    if (resource.icon) return resource.icon;
    return '⟳'; // Default generator icon (circular arrow)
  };
  
  // Calculate milestone progress for this resource
  const { milestoneProgress, nextMilestoneName } = useMemo(() => {
    // Default values
    let progress = 0;
    let milestoneName = "Efficiency";
    
    try {
      // Find the next milestone that requires this resource
      const nextMilestone = allMilestones.find(milestone => {
        // Check if any requirement uses this resource
        return milestone.requirements.some(req => 
          req.type === 'resourceAmount' && 
          req.target === resource.id
        );
      });
      
      if (nextMilestone) {
        // Find the specific requirement for this resource
        const requirement = nextMilestone.requirements.find(
          req => req.type === 'resourceAmount' && req.target === resource.id
        );
        
        if (requirement) {
          // Calculate progress percentage
          const requiredAmount = typeof requirement.value === 'number' ? 
            requirement.value : 
            parseFloat(requirement.value.toString());
            
          progress = Math.min(100, (resource.amount / requiredAmount) * 100);
          milestoneName = nextMilestone.name;
        }
      }
    } catch (error) {
      console.error("Error calculating milestone progress:", error);
    }
    
    if (progress === 0 || isNaN(progress)) {
      // If no progress from milestones, use efficiency calculation
      const clickPower = resource.clickPower || 1;
      progress = resource.perSecond > 0 
        ? Math.min(100, (resource.perSecond / clickPower) * 10)
        : 0;
    }
    
    return { milestoneProgress: progress, nextMilestoneName: milestoneName };
  }, [resource, resources]);
  
  // Format numbers for display
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toFixed(1);
  };
  
  // Calculate efficiency class for CSS background color
  const getEfficiencyClass = () => {
    if (milestoneProgress <= 25) return 'efficiency-25';
    if (milestoneProgress <= 50) return 'efficiency-50';
    if (milestoneProgress <= 75) return 'efficiency-75';
    return 'efficiency-100';
  };

  // Create a custom style for the progress fill
  // This sets the CSS variable that controls the height of the progress bar
  const progressStyle = {
    '--progress-height': `${milestoneProgress}%` 
  } as React.CSSProperties;
  
  // Milestone progress logging removed to prevent console spam

  return (
    <div 
      className={`resource-generator ${isClicking ? 'clicking' : ''} ${onCooldown ? 'cooldown' : ''} ${getEfficiencyClass()}`}
      onClick={handleClick}
      style={progressStyle}
    >
      <div className="progress-indicator" title={nextMilestoneName}>{Math.floor(milestoneProgress)}%</div>
      
      {/* Create a horizontal flex layout for top row */}
      <div style={{ display: 'flex', width: '100%', alignItems: 'center', marginBottom: '10px' }}>
        <div className="generator-left">
          <div className="generator-icon">{getIcon()}</div>
        </div>
        
        <div className="generator-right">
          <div className="generator-name">{resource.name}</div>
          <div className="generator-desc">
            +{formatNumber(resource.perSecond)}/s | 
            Click: +{formatNumber(resource.clickPower || 0)}
          </div>
        </div>
      </div>
      
      {/* Click feedback animation */}
      {lastClickAmount !== null && (
        <div className="click-feedback">
          +{lastClickAmount.toFixed(1)}
        </div>
      )}
    </div>
  );
};

/**
 * Container for all resource generators
 */
const ResourceGenerators: React.FC = () => {
  const unlockedResources = useAppSelector(selectUnlockedResources);
  
  // Get resources that can be generated (those with clickPower > 0)
  const generatableResources = useMemo(() => {
    return Object.values(unlockedResources).filter(resource => 
      resource.clickPower && resource.clickPower > 0
    );
  }, [unlockedResources]);
  
  // Handle click on generator
  const handleGeneratorClick = (resourceId: string) => {
    try {
      // Get resource manager instance and handle the click
      const resourceManager = ResourceManager.getInstance();
      const amountAdded = resourceManager.handleResourceClick(resourceId);
      
      // Debugging log removed to prevent console spam
      
      return amountAdded;
    } catch (error) {
      console.error(`Error generating resource ${resourceId}:`, error);
      return 0;
    }
  };
  
  // Always show at least a placeholder for the main generator
  const hasGenerators = generatableResources.length > 0;
  
  return (
    <div className="resource-generators-container">
      <div className="generators-grid">
        {/* Main generator is always visible, even if locked */}
        {hasGenerators ? (
          // Show actual generators
          generatableResources.map(resource => (
            <ResourceGenerator 
              key={resource.id}
              resource={resource}
              onClick={handleGeneratorClick}
            />
          ))
        ) : (
          // Show the main generator placeholder
          <div className="main-generator-placeholder">
            <div className="progress-indicator" title="First Community Power">5%</div>
            
            {/* Create a horizontal flex layout for top row - same as other generators */}
            <div style={{ display: 'flex', width: '100%', alignItems: 'center', marginBottom: '10px' }}>
              <div className="generator-left">
                <div className="generator-icon">☼</div>
              </div>
              <div className="generator-right">
                <div className="generator-name">Collective Power</div>
                <div className="generator-desc">Click to generate your first resource</div>
              </div>
            </div>
            
            {/* Button outside of the flex layout */}
            <button 
              className="placeholder-button"
              onClick={() => {
                try {
                  // Try to get resource manager and generate the main resource
                  const resourceManager = ResourceManager.getInstance();
                  const amountAdded = resourceManager.handleResourceClick('collective-power');
                  
                  // Debugging log removed to prevent console spam
                  
                  // Force refresh to reflect new state
                  setTimeout(() => window.location.reload(), 500);
                } catch (error) {
                  console.error("Failed to start generating:", error);
                }
              }}
            >
              Start Generating
            </button>
          </div>
        )}
        
        {/* Locked generator placeholders - with standardized structure */}
        <LockedGenerator 
          name="Knowledge Network" 
          description="Unlock by gaining 50 Collective Power" 
        />
        
        <LockedGenerator 
          name="Community Support" 
          description="Unlock by reaching 100 Collective Power" 
        />
        
        <LockedGenerator 
          name="Resources Center" 
          description="Unlock by completing first milestone" 
        />
        
        <LockedGenerator 
          name="Material Production" 
          description="Unlock by reaching 250 Collective Power" 
        />
        
        <LockedGenerator 
          name="Solidarity Network" 
          description="Unlock advanced community support" 
        />
      </div>
    </div>
  );
};

/**
 * Component for locked generator placeholders
 */
interface LockedGeneratorProps {
  name: string;
  description: string;
  icon?: string;
}

const LockedGenerator: React.FC<LockedGeneratorProps> = ({ 
  name, 
  description, 
  icon = '|-|' 
}) => {
  return (
    <div className="generator-coming-soon">
      <div className="progress-indicator locked" title={name}>--</div>
      
      {/* Create a horizontal flex layout for top row - same as active generators */}
      <div style={{ display: 'flex', width: '100%', alignItems: 'center', marginBottom: '10px' }}>
        <div className="generator-left">
          <div className="generator-icon">{icon}</div>
        </div>
        <div className="generator-right">
          <div className="generator-name">{name}</div>
          <div className="generator-desc">{description}</div>
        </div>
      </div>
    </div>
  );
};

export default ResourceGenerators;