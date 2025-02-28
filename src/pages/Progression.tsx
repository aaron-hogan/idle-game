import React from 'react';
import { ProgressionTracker } from '../components/progression';
import './PageStyles.css';

/**
 * Progression page for displaying achievements and milestones
 */
const Progression: React.FC = () => {
  return (
    <div className="page-content">
      <div className="page-header">
        <h2>Progression</h2>
        <p className="page-description">
          Track your progress through game stages and unlock new features.
        </p>
      </div>

      <div className="progression-container">
        <div className="page-section">
          <h3>Game Progress</h3>
          <ProgressionTracker />
        </div>

        <div className="achievements-section">
          <h3>Achievements</h3>
          <p className="placeholder-text">
            Achievements will be displayed here as you complete them.
          </p>
        </div>

        <div className="stats-section">
          <h3>Game Statistics</h3>
          <p className="placeholder-text">Detailed stats about your progress will appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default Progression;
