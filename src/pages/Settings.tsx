import React from 'react';
import { SaveControls } from '../components/save';
import { TutorialSettings } from '../components/tutorial';
import './PageStyles.css';

/**
 * Settings page for game configuration and save management
 */
const Settings: React.FC = () => {
  return (
    <div className="page-content">
      <div className="page-header">
        <h2>Settings</h2>
        <p className="page-description">
          Configure game settings and manage your save data.
        </p>
      </div>
      
      <div className="settings-container">
        <div className="settings-section">
          <h3>Game Settings</h3>
          
          <div className="setting-option">
            <input 
              type="checkbox" 
              id="offline-progress" 
              defaultChecked={true} 
              onChange={() => {
                // TODO: Connect to real setting
                console.log('Offline progress toggled');
              }}
            />
            <label htmlFor="offline-progress">Enable offline progress</label>
            <span className="setting-note">Resources will accumulate while you're away</span>
          </div>
          
          <div className="setting-option">
            <input 
              type="checkbox" 
              id="sound-effects" 
              defaultChecked={false} 
              onChange={() => {
                // TODO: Connect to real setting
                console.log('Sound effects toggled');
              }}
            />
            <label htmlFor="sound-effects">Sound effects</label>
            <span className="setting-note">Coming soon</span>
          </div>
          
          <div className="setting-option">
            <input 
              type="checkbox" 
              id="reduced-animations" 
              defaultChecked={false} 
              onChange={() => {
                // TODO: Connect to real setting
                console.log('Reduced animations toggled');
              }}
            />
            <label htmlFor="reduced-animations">Reduced animations</label>
            <span className="setting-note">For accessibility</span>
          </div>
        </div>
        
        <div className="settings-section">
          <h3>Save Management</h3>
          <div className="save-controls-container">
            <SaveControls />
          </div>
        </div>
        
        <div className="settings-section">
          <TutorialSettings />
        </div>
        
        <div className="settings-section">
          <h3>About</h3>
          <p>Anti-Capitalist Idle Game v0.5.0</p>
          <p>Built with React, Redux, and TypeScript</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;