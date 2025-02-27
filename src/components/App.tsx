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
import EndGameModal from './EndGameModal';
import { TabNavigation, DEFAULT_TABS } from './navigation';

// Import pages
import MainGame from '../pages/MainGame';
import Upgrades from '../pages/Upgrades';
import Progression from '../pages/Progression';
import Settings from '../pages/Settings';

import { SaveControls } from './save';
import EventPanel from './events/EventPanel';
//import { initializeEventSystem } from '../systems/eventInitializer';
import { TaskManager } from '../managers/TaskManager';
import { ProgressionManager } from '../managers/progression/ProgressionManager';
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
    // Import required action creators for dependency injection
    const resourceActions = require('../state/resourcesSlice');
    const structureActions = require('../state/structuresSlice');
    
    // Initialize resource manager with dependencies
    const resourceManager = ResourceManager.getInstance({
      dispatch: store.dispatch,
      getState: store.getState,
      actions: {
        addResource: resourceActions.addResource,
        updateResourceAmount: resourceActions.updateResourceAmount,
        addResourceAmount: resourceActions.addResourceAmount,
        updateResourcePerSecond: resourceActions.updateResourcePerSecond,
        toggleResourceUnlocked: resourceActions.toggleResourceUnlocked,
        updateClickPower: resourceActions.updateClickPower,
        updateUpgradeLevel: resourceActions.updateUpgradeLevel,
        updateBaseResourcePerSecond: resourceActions.updateBaseResourcePerSecond,
      }
    });
    
    // Initialize building manager with dependencies
    const buildingManager = require('../systems/buildingManager').BuildingManager.getInstance({
      dispatch: store.dispatch,
      getState: store.getState,
      actions: {
        addStructure: structureActions.addStructure,
        upgradeStructure: structureActions.upgradeStructure,
        updateProduction: structureActions.updateProduction,
        deductResources: resourceActions.deductResources,
      }
    });
    
    // Initialize task manager with store - using dependency injection
    // This will be updated in a future PR to use the new pattern
    const taskManager = TaskManager.getInstance();
    taskManager.initialize(store);
    
    // Initialize progression manager with store - using dependency injection
    // This will be updated in a future PR to use the new pattern
    const progressionManager = ProgressionManager.getInstance();
    progressionManager.initialize(store);
    
    // Import required action creators for event manager
    const eventActions = require('../state/eventsSlice');
    
    // Initialize event manager with dependencies
    const eventManager = require('../systems/eventManager').EventManager.getInstance({
      dispatch: store.dispatch,
      getState: store.getState,
      actions: {
        addEvent: eventActions.addEvent,
        addEvents: eventActions.addEvents,
        triggerEvent: eventActions.triggerEvent,
        resolveEvent: eventActions.resolveEvent,
        updateEvent: eventActions.updateEvent
      }
    });
    
    // Register with GameLoop for periodic event checks
    const gameLoop = GameLoop.getInstance();
    gameLoop.registerCallback('eventManager', () => eventManager.processEvents());

    // Import required action creators for save manager
    const gameActions = require('../state/gameSlice');
    const resourcesActions = require('../state/resourcesSlice');
    const structuresActions = require('../state/structuresSlice');
    
    // Initialize save manager with dependencies
    const saveManager = require('../systems/saveManager').SaveManager.getInstance({
      dispatch: store.dispatch,
      getState: store.getState,
      actions: {
        resetGame: gameActions.resetGame,
        resetResources: resourcesActions.resetResources,
        resetStructures: structuresActions.resetStructures
      },
      config: {
        autosaveInterval: 60000, // 1 minute
        autosaveEnabled: true,
        maxBackups: 5
      }
    });
    
    // Import required action creators for worker manager
    const structureActions = require('../state/structuresSlice');
    
    // Initialize worker manager with dependencies
    const workerManager = require('../systems/workerManager').WorkerManager.getInstance({
      dispatch: store.dispatch,
      getState: store.getState,
      actions: {
        assignWorkers: structureActions.assignWorkers,
        changeWorkerCount: structureActions.changeWorkerCount
      }
    });
    
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
      // Note: GameManager will be updated in a future PR to use the new DI pattern
      // For now, we continue using the existing initialization method
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
      
      // Add initial time to ensure game state is properly started
      dispatch(addPlayTime(30)); // Add 30 seconds
      
      // Set up a minimal debug timer (only for development)
      let debugTick = 0;
      const debugInterval = setInterval(() => {
        debugTick++;
        const beforeTime = store.getState().game.totalPlayTime;
        
        // Force a larger increment (5 seconds)
        dispatch(addPlayTime(5));
        
        // Only log occasionally to reduce noise
        if (debugTick % 10 === 0) {
          const afterTime = store.getState().game.totalPlayTime;
          console.log(`DEBUG TICK ${debugTick}: time=${afterTime.toFixed(2)}`);
        }
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