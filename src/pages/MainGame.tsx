import React from 'react';
import { ResourceGenerators } from '../components/resources';
import { MilestoneProgressStrip } from '../components/progression';
import './PageStyles.css';

/**
 * Main game page with resource generators
 */
const MainGame: React.FC = () => {
  return (
    <div className="page-content">
      {/* Horizontal milestone strip above generators */}
      <div className="horizontal-milestone-strip">
        <MilestoneProgressStrip sideCount={2} />
      </div>

      {/* Unified resource generators area - populated dynamically as game progresses */}
      <ResourceGenerators />
    </div>
  );
};

export default MainGame;
