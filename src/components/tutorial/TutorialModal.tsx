import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../state/store';
import { TutorialManager } from '../../managers/TutorialManager';
import { TutorialContent } from '../../types/tutorial';
import { setTutorialsEnabled } from '../../state/tutorialSlice';

import '../../styles/tutorial/TutorialModal.css';

/**
 * TutorialModal component displays step-by-step tutorials
 * for guiding players through game mechanics
 */
const TutorialModal: React.FC = () => {
  const dispatch = useDispatch();
  const { active, currentStep, tutorialsEnabled } = useSelector(
    (state: RootState) => state.tutorial
  );

  const tutorialManager = TutorialManager.getInstance();
  const currentContent = tutorialManager.getCurrentTutorialContent();

  if (!active || !currentContent) {
    return null;
  }

  const handleNext = () => {
    tutorialManager.completeCurrentStep();
  };

  const handlePrevious = () => {
    tutorialManager.goToPreviousStep();
  };

  const handleSkip = () => {
    tutorialManager.skipTutorial();
  };

  const handleDisableTutorials = () => {
    if (
      window.confirm(
        'Are you sure you want to disable tutorials? You can re-enable them in Settings.'
      )
    ) {
      dispatch(setTutorialsEnabled(false));
    }
  };

  return (
    <div className="tutorial-modal-overlay">
      <div className="tutorial-modal">
        <div className="tutorial-modal-header">
          <h2>{currentContent.title}</h2>
          <button
            className="tutorial-close-button"
            onClick={handleSkip}
            aria-label="Close tutorial"
          >
            ✕
          </button>
        </div>

        <div className="tutorial-modal-content">
          <p>{currentContent.content}</p>
          {currentContent.image && (
            <img src={currentContent.image} alt={currentContent.title} className="tutorial-image" />
          )}
        </div>

        <div className="tutorial-modal-footer">
          <div className="tutorial-navigation">
            {currentContent.previousStep && (
              <button className="tutorial-button secondary" onClick={handlePrevious}>
                Previous
              </button>
            )}

            {currentContent.nextStep ? (
              <button className="tutorial-button primary" onClick={handleNext}>
                Next
              </button>
            ) : (
              <button className="tutorial-button primary" onClick={handleNext}>
                Finish
              </button>
            )}
          </div>

          <div className="tutorial-options">
            <button className="tutorial-button text" onClick={handleSkip}>
              Skip Tutorial
            </button>
            <button className="tutorial-button text" onClick={handleDisableTutorials}>
              Disable All Tutorials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialModal;
