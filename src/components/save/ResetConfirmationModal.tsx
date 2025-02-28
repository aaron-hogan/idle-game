import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { useSave } from '../../systems/saveContext';
import './ResetConfirmationModal.css';

interface ResetConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal for confirming game reset
 */
const ResetConfirmationModal: React.FC<ResetConfirmationModalProps> = ({ isOpen, onClose }) => {
  const { deleteSaveAndReset } = useSave();

  // Handler for confirming reset
  const handleConfirmReset = () => {
    deleteSaveAndReset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reset Game"
      size="small"
      closeOnEsc={true}
      closeOnOutsideClick={true}
    >
      <div className="reset-confirmation-content">
        <p className="reset-warning">⚠️ Warning: This action cannot be undone!</p>
        <p>
          Are you sure you want to reset the game? This will delete your save file and start a new
          game.
        </p>

        <div className="reset-confirmation-buttons">
          <Button variant="danger" onClick={handleConfirmReset}>
            Yes, Reset Game
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ResetConfirmationModal;
