import React from 'react';
import { useAppSelector } from '../state/hooks';
import { selectUnlockedResources } from '../state/selectors';
import ResourceDisplay from './ResourceDisplay';
import '../styles/ResourceDisplay.css';

interface ResourceListProps {
  showDetails?: boolean;
}

/**
 * Component to display a list of all unlocked resources
 */
const ResourceList: React.FC<ResourceListProps> = ({ showDetails = true }) => {
  // Get unlocked resources from the Redux store
  const unlockedResources = useAppSelector(selectUnlockedResources);

  return (
    <div className="resource-list">
      <h2>Resources</h2>

      {unlockedResources.length === 0 ? (
        <div className="resource-list-empty">No resources available yet.</div>
      ) : (
        unlockedResources.map((resource) => (
          <ResourceDisplay key={resource.id} resource={resource} showDetails={showDetails} />
        ))
      )}
    </div>
  );
};

export default ResourceList;
