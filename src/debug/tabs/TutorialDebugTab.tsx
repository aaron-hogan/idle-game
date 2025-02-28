import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../state/store';
import { TutorialManager } from '../../managers/TutorialManager';
import { TutorialStep } from '../../types/tutorial';
import {
  resetTutorials,
  setTutorialsEnabled,
  setShowContextualHelp,
} from '../../state/tutorialSlice';
import '../../styles/debug.css';

/**
 * Tutorial Debug Tab Component
 * Displays tutorial state and provides controls for testing
 */
const TutorialDebugTab: React.FC = () => {
  const dispatch = useDispatch();
  const tutorialState = useSelector((state: RootState) => state.tutorial);
  const tutorialManager = TutorialManager.getInstance();

  const handleLaunchTutorial = (step: TutorialStep) => {
    tutorialManager.startTutorial(step);
  };

  const handleReset = () => {
    dispatch(resetTutorials());
  };

  const handleToggleTutorials = () => {
    dispatch(setTutorialsEnabled(!tutorialState.tutorialsEnabled));
  };

  const handleToggleContextHelp = () => {
    dispatch(setShowContextualHelp(!tutorialState.showContextualHelp));
  };

  return (
    <div className="debug-tab-content">
      <h3>Tutorial Debug</h3>

      <div className="debug-section">
        <h4>Tutorial State</h4>
        <div className="debug-row">
          <span className="debug-label">Active:</span>
          <span className="debug-value">{tutorialState.active ? 'Yes' : 'No'}</span>
        </div>
        <div className="debug-row">
          <span className="debug-label">Current Step:</span>
          <span className="debug-value">{tutorialState.currentStep || 'None'}</span>
        </div>
        <div className="debug-row">
          <span className="debug-label">Tutorials Enabled:</span>
          <span className="debug-value">{tutorialState.tutorialsEnabled ? 'Yes' : 'No'}</span>
        </div>
        <div className="debug-row">
          <span className="debug-label">First Time User:</span>
          <span className="debug-value">{tutorialState.firstTimeUser ? 'Yes' : 'No'}</span>
        </div>
        <div className="debug-row">
          <span className="debug-label">Show Contextual Help:</span>
          <span className="debug-value">{tutorialState.showContextualHelp ? 'Yes' : 'No'}</span>
        </div>
      </div>

      <div className="debug-section">
        <h4>Completed Tutorials</h4>
        <div className="debug-completions">
          {tutorialState.completedTutorials.length === 0 ? (
            <span className="debug-empty">None completed</span>
          ) : (
            <ul className="debug-list">
              {tutorialState.completedTutorials.map((tutorialId) => (
                <li key={tutorialId}>{tutorialId}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="debug-section">
        <h4>Tutorial Controls</h4>
        <div className="debug-buttons">
          <button onClick={() => handleLaunchTutorial(TutorialStep.WELCOME)}>Launch Welcome</button>
          <button onClick={() => handleLaunchTutorial(TutorialStep.RESOURCES)}>
            Launch Resources
          </button>
          <button onClick={() => handleLaunchTutorial(TutorialStep.BUILDINGS)}>
            Launch Buildings
          </button>
          <button onClick={() => handleLaunchTutorial(TutorialStep.WORKERS)}>Launch Workers</button>
          <button onClick={() => handleLaunchTutorial(TutorialStep.EVENTS)}>Launch Events</button>
          <button onClick={() => handleLaunchTutorial(TutorialStep.MILESTONES)}>
            Launch Milestones
          </button>
          <button onClick={() => handleLaunchTutorial(TutorialStep.SETTINGS)}>
            Launch Settings
          </button>
        </div>
        <div className="debug-toggles">
          <button onClick={handleToggleTutorials}>
            {tutorialState.tutorialsEnabled ? 'Disable Tutorials' : 'Enable Tutorials'}
          </button>
          <button onClick={handleToggleContextHelp}>
            {tutorialState.showContextualHelp ? 'Disable Context Help' : 'Enable Context Help'}
          </button>
          <button onClick={handleReset} className="debug-reset-button">
            Reset All Tutorial Progress
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialDebugTab;
