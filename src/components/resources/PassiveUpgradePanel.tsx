import React, { useCallback, useState, useEffect } from 'react';
import { useAppSelector } from '../../state/hooks';
import { ResourceManager } from '../../systems/resourceManager';
import { ResourceId } from '../../constants/resources';
import { UpgradeType } from '../../models/resource';
import './UpgradePanel.css'; // Reuse the same styling

interface PassiveUpgradePanelProps {
  resourceId: string;
}

/**
 * Panel for upgrading resource passive generation rate
 */
const PassiveUpgradePanel: React.FC<PassiveUpgradePanelProps> = ({
  resourceId = ResourceId.COLLECTIVE_POWER,
}) => {
  // Get the resource from the store
  const resource = useAppSelector((state) => state.resources[resourceId]);

  // Get cost and affordability with error handling
  const [upgradeCost, setUpgradeCost] = useState(20);
  const [canAfford, setCanAfford] = useState(false);

  // Effect to calculate costs safely
  useEffect(() => {
    try {
      const resourceManager = ResourceManager.getInstance();
      const cost = resourceManager.getPassiveUpgradeCost(resourceId);
      setUpgradeCost(cost > 0 ? cost : 20);
      setCanAfford(resource && resource.amount >= cost);
    } catch (error) {
      console.error('Error calculating passive upgrade cost:', error);
      setUpgradeCost(20);
      setCanAfford(false);
    }
  }, [resourceId, resource]);

  // Handle upgrade click
  const handleUpgrade = useCallback(() => {
    if (canAfford) {
      try {
        const resourceManager = ResourceManager.getInstance();
        resourceManager.upgradePassiveGeneration(resourceId);
      } catch (error) {
        console.error('Error upgrading passive generation:', error);
      }
    }
  }, [resourceId, canAfford]);

  // If the resource doesn't exist, don't render
  if (!resource) {
    return null;
  }

  // Get current generation rate and upgrade level
  const generationRate = resource.perSecond || 0;
  const upgradeLevel = resource.upgrades?.[UpgradeType.PASSIVE_GENERATION] || 0;
  const baseRate = resource.basePerSecond || 0;
  const upgradeBonus = upgradeLevel * 0.1;

  return (
    <div className="upgrade-panel">
      <div className="upgrade-info">
        <div className="upgrade-title">POWER PER SECOND</div>
        <div className="current-power">
          {generationRate.toFixed(1)}
          <span className="upgrade-level">Level {upgradeLevel}</span>
        </div>
        <div className="upgrade-details">
          <span className="upgrade-detail">Base: {baseRate.toFixed(1)}</span>
          <span className="upgrade-detail">Bonus: +{upgradeBonus.toFixed(1)}</span>
        </div>
      </div>

      <button
        className={`upgrade-button ${canAfford ? 'affordable' : 'expensive'}`}
        onClick={handleUpgrade}
        disabled={!canAfford}
      >
        <div className="upgrade-button-content">
          <span className="upgrade-icon">[⟲]</span>
          <span className="upgrade-label">UPGRADE</span>
          <span className="upgrade-cost">{upgradeCost} CBP</span>
        </div>
        <div className="upgrade-effect">+0.1 power per second</div>
      </button>
    </div>
  );
};

export default PassiveUpgradePanel;
