import React, { useState } from 'react';
import { formatTime } from '../utils/timeUtils';
import '../styles/OfflineProgressModal.css';

interface ResourceGain {
  id: string;
  name: string;
  amount: number;
}

interface OfflineProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  offlineTime: number;
  resourceGains: ResourceGain[];
}

const OfflineProgressModal: React.FC<OfflineProgressModalProps> = ({
  isOpen,
  onClose,
  offlineTime,
  resourceGains,
}) => {
  const [isClosing, setIsClosing] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    // Set isClosing to true to start the animation
    setIsClosing(true);

    // Call onClose after a short delay to ensure the animation plays
    setTimeout(() => {
      onClose();
      // Reset closing state after the animation completes
      setTimeout(() => {
        setIsClosing(false);
      }, 100);
    }, 300); // Animation duration
  };

  return (
    <div className={`offline-progress-modal ${isClosing ? 'closing' : ''}`}>
      <div className="modal-backdrop" onClick={handleClose} />
      <div className="modal-content">
        <h2>While You Were Away</h2>
        <p className="time-away">
          You were gone for <strong>{formatTime(offlineTime)}</strong>
        </p>

        <div className="resource-gains">
          <h3>Resources Generated:</h3>
          {resourceGains.length > 0 ? (
            <ul>
              {resourceGains.map((gain) => (
                <li key={gain.id}>
                  <span className="resource-name">{gain.name}</span>
                  <span className="resource-amount">+{gain.amount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No resources were generated during your absence.</p>
          )}
        </div>

        <button className="close-button" onClick={handleClose}>
          Continue Revolution
        </button>
      </div>
    </div>
  );
};

export default OfflineProgressModal;
