import React, { useMemo } from 'react';
import { useAppSelector } from '../../state/hooks';
import { selectAllResources } from '../../state/selectors';
import { formatNumber } from '../../utils/numberUtils';
import { allMilestones } from '../../data/progression/milestones';

/**
 * Debug tab that displays resource information and progression requirements
 */
const ResourceDebugTab: React.FC = () => {
  const resources = useAppSelector(selectAllResources);
  const progression = useAppSelector(state => state.progression);
  
  // Create resource requirements map
  const resourceRequirements = useMemo(() => {
    const requirementsMap: Record<string, { 
      nextTarget: number | null; 
      milestone: string | null;
      progress: number;
    }> = {};
    
    // Initialize for each resource
    Object.values(resources).forEach(resource => {
      requirementsMap[resource.id] = {
        nextTarget: null,
        milestone: null,
        progress: 0
      };
    });
    
    // Find the next milestone target for each resource
    allMilestones.forEach(milestone => {
      // Skip completed milestones
      if (progression?.milestones?.[milestone.id]?.completed) {
        return;
      }
      
      // Check resource requirements
      milestone.requirements.forEach(req => {
        if (req.type === 'resourceAmount' && typeof req.target === 'string' && resources[req.target]) {
          const currentAmount = resources[req.target].amount;
          const targetAmount = typeof req.value === 'number' ? req.value : parseFloat(req.value.toString());
          
          // Only update if this is the next closest target or no target is set yet
          if (currentAmount < targetAmount && 
              (requirementsMap[req.target].nextTarget === null || 
               targetAmount < requirementsMap[req.target].nextTarget!)) {
            
            requirementsMap[req.target].nextTarget = targetAmount;
            requirementsMap[req.target].milestone = milestone.name;
            requirementsMap[req.target].progress = currentAmount / targetAmount * 100;
          }
        }
      });
    });
    
    return requirementsMap;
  }, [resources, progression]);
  
  return (
    <div className="debug-tab resource-debug-tab">
      <h3>Resources and Progression Tracking</h3>
      <table className="debug-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Amount</th>
            <th>Per Second</th>
            <th>Next Milestone</th>
            <th>Progress</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(resources).map((resource) => {
            const req = resourceRequirements[resource.id];
            return (
              <tr key={resource.id}>
                <td>{resource.id}</td>
                <td>{resource.name}</td>
                <td>{formatNumber(resource.amount)} / {formatNumber(resource.maxAmount)}</td>
                <td>{resource.perSecond > 0 ? '+' : ''}{formatNumber(resource.perSecond)}/s</td>
                <td>
                  {req.nextTarget ? (
                    <>
                      {req.milestone}<br/>
                      <small>({formatNumber(resource.amount)} / {formatNumber(req.nextTarget)})</small>
                    </>
                  ) : <span className="completed">No pending requirement</span>}
                </td>
                <td>
                  {req.nextTarget ? (
                    <div className="progress-bar-container">
                      <div 
                        className="progress-bar" 
                        style={{ width: `${Math.min(100, req.progress)}%` }}
                      />
                      <span className="progress-text">{Math.floor(req.progress)}%</span>
                    </div>
                  ) : '-'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {Object.keys(resources).length === 0 && (
        <div className="debug-empty-state">No resources found in state.</div>
      )}
    </div>
  );
};

export default ResourceDebugTab;