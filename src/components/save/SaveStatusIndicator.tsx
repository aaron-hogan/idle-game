import React, { useEffect, useState } from 'react';
import { useSave } from '../../systems/saveContext';
import './SaveStatusIndicator.css';

/**
 * Displays the last save time and auto-save status with visual indicators
 */
const SaveStatusIndicator: React.FC = () => {
  const { timeSinceLastSave, autosaveEnabled, messageVisible, message, messageType, saveManager } =
    useSave();

  const [showSaveActivity, setShowSaveActivity] = useState(false);
  const [previousSaveTime, setPreviousSaveTime] = useState('');

  // Monitor save time to trigger animation when it changes
  useEffect(() => {
    if (timeSinceLastSave !== previousSaveTime && previousSaveTime !== '') {
      // Trigger the save activity animation
      setShowSaveActivity(true);

      // Reset the animation after it completes
      const timeout = setTimeout(() => {
        setShowSaveActivity(false);
      }, 1500); // Match the animation duration

      return () => clearTimeout(timeout);
    }

    setPreviousSaveTime(timeSinceLastSave);
  }, [timeSinceLastSave, previousSaveTime]);

  return (
    <div className="save-status-indicator">
      {/* Visual indicator that activates when a save occurs */}
      <div className={`save-activity-indicator ${showSaveActivity ? 'active' : ''}`} />

      <div className="save-status-time">Last saved: {timeSinceLastSave} ago</div>

      <div className="save-status-autosave">
        Autosave:{' '}
        <span className={autosaveEnabled ? 'enabled' : 'disabled'}>
          {autosaveEnabled ? 'Enabled' : 'Disabled'}
        </span>
      </div>

      {messageVisible && <div className={`save-status-message ${messageType}`}>{message}</div>}
    </div>
  );
};

export default SaveStatusIndicator;
