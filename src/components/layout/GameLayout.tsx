import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import GameTimer from '../GameTimer';
import TabNavigation, { DEFAULT_TABS } from '../navigation/TabNavigation';
import ProgressBar from '../progression/ProgressBar';
import TopResourceBar from '../resources/TopResourceBar';
import GameDebugger from '../../debug/GameDebugger';
import { EventPanel } from '../events';
import MilestoneProgress from '../progression/MilestoneProgress';
import './GameLayout.css';

/**
 * Main layout component with consistent UI elements across all pages
 */
const GameLayout: React.FC = () => {
  // Debug panel state
  const [isDebugExpanded, setIsDebugExpanded] = useState(false);
  
  // Menu button component with simplified handling
  const MenuButton: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Define the menu actions as state to prevent them from being recreated
    const menuActions = React.useMemo(() => [
      { label: 'Settings', action: () => console.log('Settings clicked') },
      { label: 'Save Game', action: () => console.log('Save Game clicked') },
      { label: 'Load Game', action: () => console.log('Load Game clicked') },
      { label: 'Reset Progress', action: () => console.log('Reset Progress clicked') },
      { label: 'About', action: () => console.log('About clicked') },
      { label: 'Help', action: () => console.log('Help clicked') },
    ], []);
    
    // Explicit method to open and close menu
    const openMenu = () => setIsMenuOpen(true);
    const closeMenu = () => setIsMenuOpen(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    
    // Handle menu item click
    const handleMenuItemClick = (action: () => void) => {
      // Execute the action without closing the menu immediately
      action();
      // Optional: close menu after action
      // setTimeout(closeMenu, 100);
    };
    
    // Close menu when clicking outside
    React.useEffect(() => {
      if (!isMenuOpen) return;
      
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as Element;
        if (!target.closest('.menu-container')) {
          closeMenu();
        }
      };
      
      // Add with a slight delay to prevent immediate closing
      const timerId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 10);
      
      return () => {
        clearTimeout(timerId);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isMenuOpen]);
    
    return (
      <div className="menu-container">
        <button 
          className="menu-button"
          onClick={toggleMenu}
        >
          ≡
        </button>
        
        {isMenuOpen && (
          <div className="game-menu active">
            {menuActions.map((item, index) => (
              <div 
                key={index}
                className="game-menu-item" 
                onClick={() => handleMenuItemClick(item.action)}
              >
                {item.label}
              </div>
            ))}
            <div className="game-menu-item" onClick={closeMenu}>
              Close Menu
            </div>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="game-layout">
      {/* Unified header strip with all controls */}
      <div className="header-strip">
        <div className="game-timer">
          <GameTimer />
        </div>
        <TopResourceBar />
        <MenuButton />
      </div>
      
      {/* Progress bars section */}
      <div className="progress-bars-container">
        <div className="progress-bars-group">
          <div className="progress-bar-wrapper">
            <ProgressBar />
          </div>
          <div className="progress-bar-wrapper oppression-bar">
            <ProgressBar isNegative={true} />
          </div>
        </div>
      </div>
      
      {/* Main content area - renders the current route */}
      <main className="main-content">
        <Outlet />
      </main>
      
      {/* Navigation tabs */}
      <TabNavigation tabs={DEFAULT_TABS} />
      
      {/* Debug panel toggle */}
      <button 
        className="debug-toggle-btn"
        onClick={() => setIsDebugExpanded(!isDebugExpanded)}
      >
        {isDebugExpanded ? "HIDE DEBUG DATA" : "SHOW DEBUG DATA"}
      </button>
      
      {/* Collapsible debug panel with resize handle */}
      <div className={`debug-panel ${isDebugExpanded ? 'expanded' : 'collapsed'}`}>
        {isDebugExpanded && <div className="debug-resize-handle" />}
        <GameDebugger />
      </div>
      
      {/* Event panel for notifications and alerts */}
      <EventPanel />
    </div>
  );
};

export default GameLayout;