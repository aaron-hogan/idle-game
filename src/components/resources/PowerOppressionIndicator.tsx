import React from 'react';
import { ResourceId } from '../../constants/resources';
import ProgressBar from '../ui/ProgressBar';
import './PowerOppressionIndicator.css';

/**
 * Displays a visual comparison of collective power vs oppression
 * This serves as a win/lose indicator for the game
 */
interface PowerOppressionIndicatorProps {
  resources: Record<string, any>;
}

const PowerOppressionIndicator: React.FC<PowerOppressionIndicatorProps> = ({ resources }) => {
  // Get the core resources
  const power = resources[ResourceId.COLLECTIVE_POWER];
  const oppression = resources[ResourceId.OPPRESSION];
  
  // If resources aren't loaded yet, don't render
  if (!power || !oppression) {
    return null;
  }
  
  // Calculate the percentage values for the progress bars
  const powerPercentage = Math.min(1, power.amount / power.maxAmount);
  const oppressionPercentage = Math.min(1, oppression.amount / oppression.maxAmount);
  
  // Calculate status message
  let statusMessage = 'Balanced struggle';
  let statusClass = 'balanced';
  
  if (power.amount >= oppression.amount * 1.5) {
    statusMessage = 'Movement is gaining significant ground';
    statusClass = 'winning';
  } else if (power.amount > oppression.amount) {
    statusMessage = 'Movement has the advantage';
    statusClass = 'advantage';
  } else if (oppression.amount > power.amount * 1.4) {
    statusMessage = 'Corporate resistance is overwhelming';
    statusClass = 'losing';
  } else if (oppression.amount > power.amount) {
    statusMessage = 'Corporate resistance is strengthening';
    statusClass = 'disadvantage';
  }
  
  return (
    <div className="power-oppression-indicator">
      <h3>Movement Balance</h3>
      
      <div className="power-bar">
        <div className="resource-label">Collective Power</div>
        <ProgressBar 
          value={powerPercentage} 
          color="#4CAF50" 
          showLabel 
          labelPosition="inside"
          label={`${(power.amount).toFixed(0)}/${power.maxAmount}`}
        />
      </div>
      
      <div className="oppression-bar">
        <div className="resource-label">Corporate Oppression</div>
        <ProgressBar 
          value={oppressionPercentage}
          color="#F44336"
          showLabel
          labelPosition="inside"
          label={`${(oppression.amount).toFixed(0)}/${oppression.maxAmount}`}
        />
      </div>
      
      <div className={`balance-status ${statusClass}`}>
        Status: {statusMessage}
      </div>
      
      <div className="balance-info">
        <p>
          Win by reaching maximum collective power.
          Lose if oppression exceeds your power by 50%.
        </p>
      </div>
    </div>
  );
};

export default PowerOppressionIndicator;