import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../state/store';
import { TutorialManager } from '../../managers/TutorialManager';
import {
  setTutorialsEnabled,
  setShowContextualHelp,
  resetTutorials,
} from '../../state/tutorialSlice';
import { TutorialStep } from '../../types/tutorial';

import '../../styles/tutorial/TutorialSettings.css';

/**
 * TutorialSettings component for toggling tutorial features
 * and resetting tutorial progress
 */
const TutorialSettings: React.FC = () => {
  const dispatch = useDispatch();
  const { tutorialsEnabled, showContextualHelp, completedTutorials } = useSelector(
    (state: RootState) => state.tutorial
  );

  const tutorialManager = TutorialManager.getInstance();

  const handleToggleTutorials = () => {
    dispatch(setTutorialsEnabled(!tutorialsEnabled));
  };

  const handleToggleContextualHelp = () => {
    dispatch(setShowContextualHelp(!showContextualHelp));
  };

  const handleResetTutorials = () => {
    if (
      window.confirm(
        'Are you sure you want to reset all tutorial progress? You will see all tutorials again.'
      )
    ) {
      dispatch(resetTutorials());
    }
  };

  const handleRestartTutorial = (step: TutorialStep) => {
    tutorialManager.startTutorial(step);
  };

  return (
    <div className="tutorial-settings">
      <h3>Tutorial Settings</h3>

      <div className="settings-options">
        <div className="setting-item">
          <label htmlFor="enable-tutorials">
            <input
              type="checkbox"
              id="enable-tutorials"
              checked={tutorialsEnabled}
              onChange={handleToggleTutorials}
            />
            <span>Enable Tutorials</span>
          </label>
          <p className="setting-description">Show guided tutorials for game mechanics</p>
        </div>

        <div className="setting-item">
          <label htmlFor="enable-contextual-help">
            <input
              type="checkbox"
              id="enable-contextual-help"
              checked={showContextualHelp}
              onChange={handleToggleContextualHelp}
              disabled={!tutorialsEnabled}
            />
            <span>Show Contextual Help</span>
          </label>
          <p className="setting-description">Display help icons near game elements</p>
        </div>
      </div>

      <div className="tutorial-management">
        <h4>Tutorial Management</h4>
        <p>Restart specific tutorials:</p>

        <div className="tutorial-buttons">
          <button
            onClick={() => handleRestartTutorial(TutorialStep.WELCOME)}
            disabled={!tutorialsEnabled}
            className="restart-tutorial-button"
          >
            Intro Tutorial
          </button>
          <button
            onClick={() => handleRestartTutorial(TutorialStep.RESOURCES)}
            disabled={!tutorialsEnabled}
            className="restart-tutorial-button"
          >
            Resources Tutorial
          </button>
          <button
            onClick={() => handleRestartTutorial(TutorialStep.BUILDINGS)}
            disabled={!tutorialsEnabled}
            className="restart-tutorial-button"
          >
            Buildings Tutorial
          </button>
          <button
            onClick={() => handleRestartTutorial(TutorialStep.WORKERS)}
            disabled={!tutorialsEnabled}
            className="restart-tutorial-button"
          >
            Workers Tutorial
          </button>
        </div>

        <button
          onClick={handleResetTutorials}
          disabled={!tutorialsEnabled || completedTutorials.length === 0}
          className="reset-tutorials-button"
        >
          Reset All Tutorial Progress
        </button>
      </div>
    </div>
  );
};

export default TutorialSettings;
