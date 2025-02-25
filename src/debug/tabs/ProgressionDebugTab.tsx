import React from 'react';
import { useAppSelector } from '../../state/hooks';

/**
 * Debug tab that displays progression information
 */
const ProgressionDebugTab: React.FC = () => {
  // Get progression state from Redux
  const progression = useAppSelector(state => state.progression);
  const { gameStage, milestones, achievements } = progression || { gameStage: 'LOADING', milestones: {}, achievements: {} };
  
  // Get counts
  const totalMilestones = Object.keys(milestones || {}).length;
  const completedMilestones = Object.values(milestones || {}).filter((m: any) => m.completed).length;
  const totalAchievements = Object.keys(achievements || {}).length;
  const completedAchievements = Object.values(achievements || {}).filter((a: any) => a.completed).length;
  
  return (
    <div className="debug-tab progression-debug-tab">
      <h3>Progression Debug Information</h3>
      
      <div className="debug-section">
        <h4>Game Stage: <span className="highlight">{gameStage}</span></h4>
        <div className="debug-stats">
          <div className="stat-item">
            <div className="stat-label">Milestones</div>
            <div className="stat-value">{completedMilestones}/{totalMilestones}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Achievements</div>
            <div className="stat-value">{completedAchievements}/{totalAchievements}</div>
          </div>
        </div>
      </div>
      
      <div className="debug-section">
        <h4>Milestones</h4>
        <table className="debug-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Stage</th>
              <th>Type</th>
              <th>Completed</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(milestones || {}).map((milestone: any) => (
              <tr key={milestone.id}>
                <td>{milestone.id}</td>
                <td>{milestone.name}</td>
                <td>{milestone.stage}</td>
                <td>{milestone.type}</td>
                <td>{milestone.completed ? '✓' : '✗'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {Object.keys(milestones || {}).length === 0 && (
          <div className="debug-empty-state">No milestones found in state.</div>
        )}
      </div>
      
      <div className="debug-section">
        <h4>Achievements</h4>
        <table className="debug-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Completed</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(achievements || {}).map((achievement: any) => (
              <tr key={achievement.id}>
                <td>{achievement.id}</td>
                <td>{achievement.name}</td>
                <td>{achievement.type}</td>
                <td>{achievement.completed ? '✓' : '✗'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {Object.keys(achievements || {}).length === 0 && (
          <div className="debug-empty-state">No achievements found in state.</div>
        )}
      </div>
    </div>
  );
};

export default ProgressionDebugTab;