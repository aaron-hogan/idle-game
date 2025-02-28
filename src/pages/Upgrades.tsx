import React from 'react';
import { ResourceId } from '../constants/resources';
import { UpgradePanel, PassiveUpgradePanel } from '../components/resources';
import './PageStyles.css';

/**
 * Upgrades page for displaying and purchasing upgrades
 */
const Upgrades: React.FC = () => {
  return (
    <div className="page-content">
      <div className="page-header">
        <h2>Upgrades</h2>
        <p className="page-description">
          Purchase upgrades to improve your resource generation capabilities.
        </p>
      </div>

      <div className="page-section">
        <h3>Collective Power Upgrades</h3>
        <div className="upgrade-grid">
          <div className="upgrade-card">
            <h4>Click Power</h4>
            <p className="upgrade-description">Increase the amount of power generated per click.</p>
            <UpgradePanel resourceId={ResourceId.COLLECTIVE_POWER} />
          </div>

          <div className="upgrade-card">
            <h4>Passive Generation</h4>
            <p className="upgrade-description">
              Increase the amount of power generated automatically over time.
            </p>
            <PassiveUpgradePanel resourceId={ResourceId.COLLECTIVE_POWER} />
          </div>
        </div>
      </div>

      {/* Additional resource upgrade sections can be added here */}
    </div>
  );
};

export default Upgrades;
