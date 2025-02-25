/**
 * Game Loop Diagnostic Test
 * This file contains diagnostic utilities to test game loop functionality
 */

import { store } from '../state/store';
import { GameLoop } from '../systems/gameLoop';
import { ResourceManager } from '../systems/resourceManager';
import { GameLoopManager } from '../managers/GameLoopManager';
import { TaskManager } from '../managers/TaskManager';
import { addResourceAmount } from '../state/resourcesSlice';

/**
 * Run a diagnostic test of the game loop system
 */
export function runGameLoopDiagnostics() {
  console.group('===== GAME LOOP DIAGNOSTICS =====');
  
  // 1. Check if GameLoop instance exists and is running
  const gameLoop = GameLoop.getInstance();
  const gameLoopStatus = gameLoop.getStatus();
  console.log('GameLoop status:', {
    isRunning: gameLoopStatus.isRunning,
    isPaused: gameLoopStatus.isPaused,
    tickInterval: gameLoopStatus.tickInterval,
    tickCount: gameLoopStatus.tickCount,
    elapsedSinceLastTick: gameLoopStatus.elapsedSinceLastTick
  });

  // 2. Check if GameLoopManager instance exists and is running
  const gameLoopManager = GameLoopManager.getInstance();
  console.log('GameLoopManager status:', {
    isRunning: gameLoopManager.isGameLoopRunning(),
    timeSinceLastTick: gameLoopManager.getTimeSinceLastTick()
  });

  // 3. Get store state
  const state = store.getState();
  console.log('Game status from store:', {
    isRunning: state.game.isRunning,
    tickRate: state.game.tickRate,
    gameTimeScale: state.game.gameTimeScale,
    totalPlayTime: state.game.totalPlayTime
  });

  // 4. Check resources
  const resourceCount = Object.keys(state.resources).length;
  console.log(`Resources (${resourceCount} total):`);
  Object.values(state.resources).forEach((resource: any) => {
    if (resource && resource.name) {
      console.log(`- ${resource.name}: amount=${resource.amount.toFixed(2)}, perSecond=${resource.perSecond.toFixed(2)}`);
    }
  });

  // 5. Manual resource update test
  console.log('\nRunning manual resource update test...');
  try {
    const resourceManager = ResourceManager.getInstance();
    const testTickAmount = 1; // 1 second
    
    // Store starting values
    const startingValues = Object.values(state.resources).map((resource: any) => ({
      id: resource.id,
      name: resource.name, 
      startAmount: resource.amount
    }));
    
    // Apply a manual update
    resourceManager.updateResources(testTickAmount);
    
    // Store ending values and compute differences
    setTimeout(() => {
      const endState = store.getState();
      
      startingValues.forEach(startResource => {
        const endResource = endState.resources[startResource.id];
        if (endResource) {
          const diff = endResource.amount - startResource.startAmount;
          const expected = endResource.perSecond * testTickAmount;
          
          console.log(`- ${startResource.name}: changed by ${diff.toFixed(2)} (expected ${expected.toFixed(2)})`);
          
          // Check for issues
          if (Math.abs(diff - expected) > 0.01 && expected > 0) {
            console.error(`  ⚠️ Mismatch for ${startResource.name}!`);
          }
        }
      });
      
      // 6. Force a manual update if needed
      const shouldForceUpdate = startingValues.every(r => {
        const endResource = endState.resources[r.id];
        return endResource.amount === r.startAmount;
      });
      
      if (shouldForceUpdate) {
        console.warn('\n⚠️ No resources updated automatically. Forcing a manual update...');
        
        // Get the first resource with a positive perSecond value
        const testResource = Object.values(endState.resources).find((r: any) => r.perSecond > 0);
        
        if (testResource) {
          // Add 1.0 unit to this resource manually
          console.log(`Adding 1.0 to ${testResource.name} manually...`);
          store.dispatch(addResourceAmount({
            id: testResource.id,
            amount: 1.0
          }));
          
          // Log result
          setTimeout(() => {
            const finalState = store.getState();
            const finalResource = finalState.resources[testResource.id];
            console.log(`${testResource.name} after manual update: ${finalResource.amount.toFixed(2)}`);
          }, 500);
        }
      }
    }, 500);
    
  } catch (error) {
    console.error('Error during manual resource update test:', error);
  }

  // 7. Diagnostics for task system
  console.log('\nTask system diagnostics:');
  try {
    const taskManager = TaskManager.getInstance();
    // Register a test tick handler to verify GameLoopManager
    const testTickHandler = (deltaTime: number) => {
      console.log(`TaskManager test tick received: deltaTime=${deltaTime}ms`);
    };
    
    // Register and then immediately unregister to avoid affecting real gameplay
    gameLoopManager.registerTickHandler(testTickHandler);
    setTimeout(() => {
      gameLoopManager.unregisterTickHandler(testTickHandler);
      console.log('TaskManager test tick handler unregistered');
    }, 2000);
    
  } catch (error) {
    console.error('Error during task system diagnostics:', error);
  }

  console.log('\nDiagnostics complete. Check console logs for issues.');
  console.groupEnd();
}

/**
 * Inject a button into the UI to run diagnostics
 */
export function injectDiagnosticsButton() {
  // Create the button
  const button = document.createElement('button');
  button.innerText = '🔍 Run Diagnostics';
  button.style.position = 'fixed';
  button.style.bottom = '10px';
  button.style.right = '10px';
  button.style.zIndex = '9999';
  button.style.padding = '8px 16px';
  button.style.backgroundColor = '#b195d8';
  button.style.color = '#15131A';
  button.style.border = 'none';
  button.style.borderRadius = '4px';
  button.style.cursor = 'pointer';
  
  // Add click handler
  button.addEventListener('click', () => {
    runGameLoopDiagnostics();
  });
  
  // Add to document
  document.body.appendChild(button);
  
  console.log('Diagnostics button injected. Click to run tests.');
}