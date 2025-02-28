import React, { useState } from 'react';
import Button from '../ui/Button';
import { useSave } from '../../systems/saveContext';
import './SaveControls.css';
import SaveStatusIndicator from './SaveStatusIndicator';
import ResetConfirmationModal from './ResetConfirmationModal';
import ExportImportModal from './ExportImportModal';

/**
 * Save controls component with save, load, and reset functionality
 */
const SaveControls: React.FC = () => {
  const { saveGame, loadGame, hasSave, autosaveEnabled, setAutosaveEnabled } = useSave();

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isExportImportModalOpen, setIsExportImportModalOpen] = useState(false);

  // Handler for save button
  const handleSave = () => {
    saveGame();
  };

  // Handler for load button
  const handleLoad = () => {
    loadGame();
  };

  // Handler for reset button
  const handleReset = () => {
    setIsResetModalOpen(true);
  };

  // Handler for autosave toggle
  const handleAutosaveToggle = () => {
    setAutosaveEnabled(!autosaveEnabled);
  };

  // Handler for export/import button
  const handleExportImport = () => {
    setIsExportImportModalOpen(true);
  };

  return (
    <div className="save-controls">
      <div className="save-controls-status">
        <SaveStatusIndicator />
      </div>

      <div className="save-controls-buttons">
        <Button variant="primary" onClick={handleSave} aria-label="Save game">
          Save
        </Button>

        <Button variant="info" onClick={handleLoad} disabled={!hasSave} aria-label="Load game">
          Load
        </Button>

        <Button variant="danger" onClick={handleReset} aria-label="Reset game">
          Reset
        </Button>

        <Button variant="secondary" onClick={handleExportImport} aria-label="Export or import save">
          Export/Import
        </Button>

        <Button
          variant={autosaveEnabled ? 'success' : 'secondary'}
          onClick={handleAutosaveToggle}
          aria-label={autosaveEnabled ? 'Disable autosave' : 'Enable autosave'}
        >
          Autosave: {autosaveEnabled ? 'ON' : 'OFF'}
        </Button>
      </div>

      {/* Reset confirmation modal */}
      <ResetConfirmationModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
      />

      {/* Export/Import modal */}
      <ExportImportModal
        isOpen={isExportImportModalOpen}
        onClose={() => setIsExportImportModalOpen(false)}
      />
    </div>
  );
};

export default SaveControls;
