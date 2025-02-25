import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { exportSave, importSave } from '../../utils/saveUtils';
import { useSave } from '../../systems/saveContext';
import './ExportImportModal.css';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal for exporting and importing save data
 */
const ExportImportModal: React.FC<ExportImportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [importText, setImportText] = useState('');
  const [exportText, setExportText] = useState('');
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  
  const { showSuccess, showError, loadGame } = useSave();
  
  // Handler for exporting save data
  const handleExport = () => {
    const saveData = exportSave();
    setExportText(saveData);
    
    // Also copy to clipboard if supported
    if (navigator.clipboard) {
      navigator.clipboard.writeText(saveData)
        .then(() => {
          showSuccess('Save data copied to clipboard');
        })
        .catch(err => {
          console.error('Failed to copy to clipboard:', err);
        });
    }
  };
  
  // Handler for importing save data
  const handleImport = () => {
    if (!importText.trim()) {
      showError('Please enter save data to import');
      return;
    }
    
    try {
      const saveData = importSave(importText);
      
      if (saveData) {
        showSuccess('Save data imported successfully');
        loadGame();
        onClose();
      } else {
        showError('Failed to import save data');
      }
    } catch (error) {
      console.error('Import error:', error);
      showError('Invalid save data format');
    }
  };
  
  // Handler for saving export data to file
  const handleSaveToFile = () => {
    if (!exportText) {
      handleExport();
    }
    
    const blob = new Blob([exportText || exportSave()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'unnamed-idle-game-save.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showSuccess('Save file downloaded');
  };
  
  // Handler for loading file
  const handleFileLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setImportText(content);
    };
    reader.readAsText(file);
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export/Import Save"
      size="medium"
    >
      <div className="export-import-modal">
        <div className="export-import-tabs">
          <button 
            className={`tab ${activeTab === 'export' ? 'active' : ''}`}
            onClick={() => setActiveTab('export')}
          >
            Export
          </button>
          <button 
            className={`tab ${activeTab === 'import' ? 'active' : ''}`}
            onClick={() => setActiveTab('import')}
          >
            Import
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'export' ? (
            <div className="export-section">
              <p>Export your save data to backup or transfer to another device:</p>
              
              <textarea 
                className="export-textarea"
                value={exportText}
                readOnly
                placeholder="Click 'Export Save' to generate save data"
                onClick={(e) => e.currentTarget.select()}
              />
              
              <div className="export-buttons">
                <Button 
                  variant="primary" 
                  onClick={handleExport}
                >
                  Export Save
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={handleSaveToFile}
                >
                  Save to File
                </Button>
              </div>
              
              <p className="export-note">
                Copy this text or save the file to back up your game progress.
              </p>
            </div>
          ) : (
            <div className="import-section">
              <p>Import a previously exported save:</p>
              
              <textarea 
                className="import-textarea"
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Paste your save data here or load from a file"
              />
              
              <div className="import-buttons">
                <Button 
                  variant="primary" 
                  onClick={handleImport}
                  disabled={!importText.trim()}
                >
                  Import Save
                </Button>
                
                <div className="file-input-wrapper">
                  <label className="game-button game-button-secondary">
                    Load from File
                    <input 
                      type="file" 
                      accept=".json"
                      onChange={handleFileLoad}
                      style={{ display: 'none' }} 
                    />
                  </label>
                </div>
              </div>
              
              <p className="import-warning">
                ⚠️ Warning: Importing a save will overwrite your current game progress!
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ExportImportModal;