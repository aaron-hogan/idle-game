import React, { useCallback, useState, useEffect } from 'react';
import { useAppSelector } from '../../state/hooks';
import { ResourceManager } from '../../systems/resourceManager';
import { ResourceId } from '../../constants/resources';
import { UpgradeType } from '../../models/resource';
import './UpgradePanel.css';

interface UpgradePanelProps {
  resourceId: string;
}

/**
 * Panel for upgrading resource click power
 */
const UpgradePanel: React.FC<UpgradePanelProps> = ({
  resourceId = ResourceId.COLLECTIVE_POWER,
}) => {
  // Get the resource from the store
  const resource = useAppSelector((state) => state.resources[resourceId]);

  // Get cost and affordability with error handling
  const [upgradeCost, setUpgradeCost] = useState(10);
  const [canAfford, setCanAfford] = useState(false);

  // Effect to calculate costs safely
  useEffect(() => {
    try {
      const resourceManager = ResourceManager.getInstance();
      const cost = resourceManager.getClickUpgradeCost(resourceId);
      setUpgradeCost(cost > 0 ? cost : 10);
      setCanAfford(resource && resource.amount >= cost);
    } catch (error) {
      console.error('Error calculating upgrade cost:', error);
      setUpgradeCost(10);
      setCanAfford(false);
    }
  }, [resourceId, resource]);

  // Handle upgrade click
  const handleUpgrade = useCallback(() => {
    if (canAfford) {
      try {
        const resourceManager = ResourceManager.getInstance();
        resourceManager.upgradeClickPower(resourceId);
      } catch (error) {
        console.error('Error upgrading click power:', error);
      }
    }
  }, [resourceId, canAfford]);

  // If the resource doesn't exist, don't render
  if (!resource) {
    return null;
  }

  // Get current click power and upgrade level
  const clickPower = resource.clickPower || 1;
  const upgradeLevel = resource.upgrades?.[UpgradeType.CLICK_POWER] || 0;

  return (
    <div className="upgrade-panel">
      <div className="upgrade-info">
        <div className="upgrade-title">POWER PER CLICK</div>
        <div className="current-power">
          {clickPower.toFixed(1)}
          <span className="upgrade-level">Level {upgradeLevel}</span>
        </div>
        <div className="upgrade-details">
          <span className="upgrade-detail">Base: 1.0</span>
          <span className="upgrade-detail">Bonus: +{upgradeLevel.toFixed(1)}</span>
        </div>
      </div>

      <button
        className={`upgrade-button ${canAfford ? 'affordable' : 'expensive'}`}
        onClick={handleUpgrade}
        disabled={!canAfford}
      >
        <div className="upgrade-button-content">
          <span className="upgrade-icon">[+]</span>
          <span className="upgrade-label">UPGRADE</span>
          <span className="upgrade-cost">{upgradeCost} CBP</span>
        </div>
        <div className="upgrade-effect">+1.0 power per click</div>
      </button>
    </div>
  );
};

export default UpgradePanel;
