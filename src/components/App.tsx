import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import TopResourceBar from './resources/TopResourceBar';
// Removed the unused CompactMovementBalance import
import EndGameModal from './EndGameModal';
import { TabNavigation, DEFAULT_TABS } from './navigation';

// Import pages
import MainGame from '../pages/MainGame';
import Upgrades from '../pages/Upgrades';
import Progression from '../pages/Progression';
import Settings from '../pages/Settings';

import { SaveControls } from './save';
import EventPanel from './events/EventPanel';
import { initializeEventSystem } from '../systems/eventInitializer';
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
  
  // Initialize resources and game loop when the app first loads - only once on mount
  useEffect(() => {
    // Get singleton instances
    const resourceManager = ResourceManager.getInstance();
    
    // Initialize resource manager with store
    resourceManager.initialize(store);
    
    // Initialize task manager
    const taskManager = TaskManager.getInstance();
    taskManager.initialize();
    
    // Initialize event system
    initializeEventSystem();
    
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
    // Only initialize if not already initialized
    if (!gameManagerRef.current) {
      gameManagerRef.current = GameManager.getInstance(store, { 
        debugMode: true, 
        processOfflineProgress: true 
      });
      
      // Set the Redux store for the GameLoop to enable win/lose checks
      const gameLoop = GameManager.getInstance().getGameLoop();
      gameLoop.setStore(store);
      
      // Initialize and start the game
      gameManagerRef.current.initialize();
      gameManagerRef.current.start();
      
      // CRITICAL DEBUG: Forcibly add significant time and verify in console
      console.log("App: BEFORE adding initial time, state.game.totalPlayTime =", store.getState().game.totalPlayTime);
      dispatch(addPlayTime(30)); // Try to add 30 seconds
      console.log("App: AFTER adding initial time, state.game.totalPlayTime =", store.getState().game.totalPlayTime);
      
      // Set up a stronger debug timer to force time updates and verify they're happening
      let debugTick = 0;
      const debugInterval = setInterval(() => {
        debugTick++;
        const beforeTime = store.getState().game.totalPlayTime;
        console.log(`DEBUG TICK ${debugTick}: Before adding time, totalPlayTime=${beforeTime.toFixed(2)}`);
        
        // Force a larger increment (5 seconds)
        dispatch(addPlayTime(5));
        
        // Verify after dispatch
        const afterTime = store.getState().game.totalPlayTime;
        console.log(`DEBUG TICK ${debugTick}: After adding time, totalPlayTime=${afterTime.toFixed(2)}, delta=${(afterTime-beforeTime).toFixed(2)}`);
      }, 1000); // Every 1 second
      
      // Clean up the interval on component unmount
      return () => {
        clearInterval(debugInterval);
        if (gameManagerRef.current) {
          gameManagerRef.current.stop(true);
        }
      };
    }
    
    // Return statement is now part of the previous code block
  // Empty dependency array ensures this only runs once at mount
  }, []);
  
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
        <Router>
          <div className="game-layout">
            {/* Top bar with timer and resources */}
            <div className="top-bar">
              <div className="game-timer">
                <GameTimer />
              </div>
              <TopResourceBar />
              <MenuButton />
            </div>
            
            {/* Main content area with routes */}
            <div className="main-content-container">
              <Routes>
                <Route path="/" element={<MainGame />} />
                <Route path="/upgrades" element={<Upgrades />} />
                <Route path="/progression" element={<Progression />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </div>
            
            {/* Bottom navigation */}
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
            
            {/* Event panel for displaying events */}
            <EventPanel />
            
            {/* Game end modal */}
            <EndGameModal />
          </div>
        </Router>
      </SaveProvider>
    </ErrorBoundary>
  );
};

export default App;