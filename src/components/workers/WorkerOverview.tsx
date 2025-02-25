import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import withErrorBoundary from '../error/withErrorBoundary';

/**
 * Displays worker overview - simplified for debugging
 */
const WorkerOverview: React.FC = () => {
  // Safely get the game stage
  const gameStage = useSelector((state: RootState) => {
    if (!state || typeof state !== 'object') return 0;
    if (!('game' in state)) return 0;
    const game = state.game;
    if (typeof game !== 'object' || game === null) return 0;
    return 'gameStage' in game ? game.gameStage : 0;
  });
  
  // Calculate worker stats
  const totalWorkers = 5 + (gameStage * 3); // Base workers + 3 per game stage
  
  return (
    <div style={{ 
      margin: '1rem 0',
      padding: '1rem',
      backgroundColor: '#f8f9fa',
      borderRadius: '4px',
      border: '1px solid #dee2e6'
    }}>
      <h3>Worker Overview</h3>
      <div>
        <p>Total Workers Available: {totalWorkers}</p>
        <p>Game Stage: {gameStage}</p>
        <p>This is a simplified worker overview for debugging.</p>
      </div>
    </div>
  );
};

export default withErrorBoundary(WorkerOverview, {
  componentName: 'WorkerOverview',
  onError: (error, errorInfo) => {
    console.error('Error in WorkerOverview component:', error, errorInfo);
  }
});