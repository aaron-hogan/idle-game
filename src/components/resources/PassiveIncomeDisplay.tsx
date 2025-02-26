import React, { useState } from 'react';
import { useAppSelector } from '../../state/hooks';
import { selectAllResources, selectAllStructures } from '../../state/selectors';
import { formatNumber } from '../../utils/numberUtils';
import { Resource } from '../../models/resource';
import { Structure } from '../../models/structure';
import './PassiveIncomeDisplay.css';

/**
 * Component that displays passive income information
 */
const PassiveIncomeDisplay: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const resources = useAppSelector(selectAllResources);
  const structures = useAppSelector(selectAllStructures);
  
  // Get resources that have passive generation
  const resourcesWithPassiveIncome = Object.values(resources).filter(
    resource => resource.perSecond > 0
  );
  
  // Function to toggle expanded state
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  
  // Function to get structures that produce a specific resource
  const getSourcesForResource = (resourceId: string): Structure[] => {
    return Object.values(structures).filter(structure => 
      structure.production && 
      structure.production[resourceId] && 
      structure.production[resourceId] > 0
    );
  };
  
  return (
    <div className={`passive-income-display ${isExpanded ? 'expanded' : ''}`}>
      <div className="passive-header" onClick={toggleExpanded}>
        <h3>GENERATION SUMMARY</h3>
      </div>
      
      <div className="passive-content">
        {resourcesWithPassiveIncome.length > 0 ? (
          <>
            {/* Show summary of resources with passive income */}
            {resourcesWithPassiveIncome.map((resource: Resource) => (
              <div key={resource.id} className="resource-summary">
                <div className="resource-name">{resource.name}</div>
                <div className="generation-rate">+{formatNumber(resource.perSecond)}/sec</div>
                
                {/* Show per click value */}
                <div className="per-click-container">
                  <div className="per-click-label">Per Click</div>
                  <div className="per-click-value">{formatNumber(resource.clickPower || 0)}</div>
                </div>
                
                {/* Show sources when expanded */}
                {isExpanded && (
                  <div className="resource-sources">
                    <h4>{resource.name} Sources</h4>
                    <div className="sources-list">
                      {getSourcesForResource(resource.id).map(structure => (
                        <div key={structure.id} className="source-item">
                          <div className="source-name">{structure.name}</div>
                          <div className="source-details">
                            Lv.{structure.level} • {structure.workers}/{structure.maxWorkers} workers
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        ) : (
          <div className="no-income-message">
            You don't have any passive income yet
          </div>
        )}
      </div>
    </div>
  );
};

export default PassiveIncomeDisplay;