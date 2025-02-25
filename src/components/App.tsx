import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { 
  selectAllResources, 
  selectLastSaveTime,
  selectIsGameRunning
} from '../state/selectors';
import { ResourceManager } from '../systems/resourceManager';
import { store } from '../state/store';
import { SaveProvider } from '../systems/saveContext';
import GameTimer from './GameTimer';
import { initializeBuildings } from '../state/actions/buildingActions';
import ErrorBoundary from './error/ErrorBoundary';
import { addPlayTime } from '../state/gameSlice';
import { GameManager } from '../core/GameManager';
import GameDebugger from '../debug/GameDebugger';
import ProgressionTracker from './progression/ProgressionTracker';
import { ResourceList } from './resources';
import { SaveControls } from './save';
import { TaskManager } from '../managers/TaskManager';
import './App.css';

// Simple menu button component that shows save controls when clicked
const MenuButton: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isMenuOpen && !(e.target as Element).closest('.menu-button') && 
          !(e.target as Element).closest('.game-menu')) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);
  
  return (
    <div className="menu-container">
      <button 
        className="menu-button"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        MENU
      </button>
      
      <div className={`game-menu ${isMenuOpen ? 'active' : ''}`}>
        <div className="game-menu-item save-controls">
          <SaveControls />
        </div>
        <div className="game-menu-item" onClick={() => setIsMenuOpen(false)}>
          Close
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const resources = useAppSelector(selectAllResources);
  const lastSaveTime = useAppSelector(selectLastSaveTime);
  const isGameRunning = useAppSelector(selectIsGameRunning);
  
  // Track game manager instance
  const gameManagerRef = useRef<GameManager | null>(null);
  
  // Debug panel state
  const [isDebugExpanded, setIsDebugExpanded] = useState(false);
  
  // Initialize resources and game loop when the app first loads
  useEffect(() => {
    // Get singleton instances
    const resourceManager = ResourceManager.getInstance();
    
    // Initialize resource manager with store
    resourceManager.initialize(store);
    
    // Initialize task manager
    const taskManager = TaskManager.getInstance();
    taskManager.initialize();
    
    // Reset game time if it's suspiciously large (over 1 hour)
    const state = store.getState();
    if (state.game.totalPlayTime > 3600) {
      dispatch({ type: 'game/resetGame' });
    }
    
    // Initialize resources (only if they don't exist yet)
    if (Object.keys(resources).length === 0) {
      resourceManager.initializeResources();
      
      // Initialize buildings after resources
      const buildingAction = initializeBuildings();
      buildingAction(dispatch, () => store.getState());
    }
    
    // Initialize and start the game manager (which controls the game loop)
    gameManagerRef.current = GameManager.getInstance(store, { 
      debugMode: true, 
      processOfflineProgress: true 
    });
    
    // Initialize and start the game
    gameManagerRef.current.initialize();
    gameManagerRef.current.start();
    
    // Add a small initial time to kickstart the display
    dispatch(addPlayTime(0.1));
    
    // Clean up the game when component unmounts
    return () => {
      if (gameManagerRef.current) {
        gameManagerRef.current.stop(true);
      }
    };
  }, [dispatch, lastSaveTime, resources]);
  
  // Handle game running state changes
  useEffect(() => {
    if (gameManagerRef.current) {
      const gameLoop = gameManagerRef.current.getGameLoop();
      
      if (isGameRunning && !gameLoop.isRunning()) {
        gameLoop.start();
      } else if (!isGameRunning && gameLoop.isRunning()) {
        gameLoop.stop();
      }
    }
  }, [isGameRunning]);
  
  return (
    <ErrorBoundary>
      <SaveProvider>
        <div className="bare-layout">
          {/* Minimal top controls */}
          <div className="controls-bar">
            <div className="game-timer">
              <GameTimer />
            </div>
            <MenuButton />
          </div>
          
          {/* Core content area with resources and progression */}
          <div className="core-content">
            <div className="resource-display">
              <ResourceList />
            </div>
            <div className="progression-display">
              <ProgressionTracker />
            </div>
          </div>
          
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
        </div>
      </SaveProvider>
    </ErrorBoundary>
  );
};

export default App;