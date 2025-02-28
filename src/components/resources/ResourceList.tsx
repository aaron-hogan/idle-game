import React from 'react';
import { useAppSelector } from '../../state/hooks';
import { selectUnlockedResources } from '../../state/selectors';
import { Resource } from '../../models/resource';
import './ResourceList.css';

/**
 * Bare-bones resource display component
 */

const BareResourceDisplay: React.FC<{ resource: Resource }> = ({ resource }) => {
  const percentFull = Math.min(100, (resource.amount / resource.maxAmount) * 100);

  return (
    <div className="bare-resource">
      <div className="resource-info">
        <div className="resource-name">{resource.name}</div>
        <div className="resource-amount">
          {resource.amount.toFixed(1)} / {resource.maxAmount.toFixed(1)}
        </div>
      </div>

      <div className="resource-progress-container">
        <div className="resource-progress-bar" style={{ width: `${percentFull}%` }}></div>
      </div>

      <div className="resource-rate">
        {resource.perSecond > 0 ? '+' : ''}
        {resource.perSecond.toFixed(2)}/sec
      </div>
    </div>
  );
};

/**
 * Stripped down resource list component
 */
const ResourceList: React.FC = () => {
  const unlockedResources = useAppSelector(selectUnlockedResources);

  return (
    <div className="bare-resource-list">
      <h2>Resources</h2>
      <div className="resource-grid">
        {unlockedResources.length > 0 ? (
          unlockedResources.map((resource) => (
            <BareResourceDisplay key={resource.id} resource={resource} />
          ))
        ) : (
          <div className="no-resources">No resources available yet</div>
        )}
      </div>
    </div>
  );
};

export default ResourceList;
