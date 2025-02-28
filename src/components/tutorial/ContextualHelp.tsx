import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { TutorialManager } from '../../managers/TutorialManager';
import { TutorialStep } from '../../types/tutorial';
import { tutorialContent } from '../../data/tutorialContent';

import '../../styles/tutorial/ContextualHelp.css';

interface ContextualHelpProps {
  id: string;
  children: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
}

/**
 * ContextualHelp component provides help tooltips for UI elements
 */
const ContextualHelp: React.FC<ContextualHelpProps> = ({ id, children, position = 'top' }) => {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const { showContextualHelp, tutorialsEnabled } = useSelector(
    (state: RootState) => state.tutorial
  );

  const tutorialManager = TutorialManager.getInstance();
  const helpContent = tutorialManager.getContextualHelp(id);

  if (!showContextualHelp || !tutorialsEnabled || !helpContent) {
    return <>{children}</>;
  }

  const handleToggleTooltip = () => {
    setShowTooltip(!showTooltip);
  };

  const handleStartRelatedTutorial = (tutorialId: string) => {
    // Find the step that matches this tutorial ID
    const step = Object.values(TutorialStep).find(
      (step) => tutorialContent[step]?.id === tutorialId
    );

    if (step) {
      tutorialManager.startTutorial(step);
      setShowTooltip(false);
    }
  };

  return (
    <div className="contextual-help-container">
      <div className="contextual-help-content">
        {children}
        <button className="help-button" onClick={handleToggleTooltip} aria-label="Help">
          ?
        </button>
      </div>

      {showTooltip && (
        <div className={`help-tooltip ${position}`}>
          <div className="tooltip-header">
            <h3>{helpContent.title}</h3>
            <button
              className="close-tooltip"
              onClick={() => setShowTooltip(false)}
              aria-label="Close help"
            >
              ✕
            </button>
          </div>
          <div className="tooltip-content">
            <p>{helpContent.content}</p>

            {helpContent.relatedTutorials && helpContent.relatedTutorials.length > 0 && (
              <div className="related-tutorials">
                <h4>Related Tutorials:</h4>
                <ul>
                  {helpContent.relatedTutorials.map((tutorialId) => (
                    <li key={tutorialId}>
                      <button
                        className="tutorial-link"
                        onClick={() => handleStartRelatedTutorial(tutorialId)}
                      >
                        {tutorialId}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContextualHelp;
