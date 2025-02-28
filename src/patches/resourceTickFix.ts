/**
 * Resource Tick Fix
 *
 * !!! DEPRECATED !!!
 *
 * DO NOT USE - This patch has been superseded by the fixed GameLoop and GameTimer implementations.
 * This direct ticking approach bypasses the proper time handling and causes time ratio issues.
 *
 * The code is kept for reference only and will log a warning if used.
 */

import { store } from '../state/store';
import { ResourceManager } from '../systems/resourceManager';
import { addPlayTime } from '../state/gameSlice';

// Keep track of our interval
let tickIntervalId: number | undefined = undefined;

/**
 * Start a direct resource tick interval
 * Bypasses the game loop completely for testing
 * @deprecated This function is deprecated and should not be used. It causes timing issues.
 */
export function startDirectResourceTick() {
  // Print a big warning
  console.warn(
    '!!! DEPRECATED !!!\n' +
      'Direct resource tick is deprecated and should not be used.\n' +
      'Use GameLoop and GameTimer instead for proper timing.\n' +
      'This function will not do anything to avoid causing timing issues.'
  );
  return; // Early return to prevent running this code

  /* DEPRECATED CODE BELOW - NOT EXECUTED */
  if (tickIntervalId !== undefined) {
    console.log('Direct resource tick already running');
    return;
  }

  console.log('Starting direct resource tick (bypassing game loop)...');

  // Get the resource manager
  const resourceManager = ResourceManager.getInstance();

  // Set up a tick every second
  let lastTickTime = Date.now();

  tickIntervalId = window.setInterval(() => {
    const currentTime = Date.now();
    const elapsed = (currentTime - lastTickTime) / 1000; // Convert to seconds

    console.log(`Direct tick: updating resources for ${elapsed.toFixed(3)}s`);

    // Update resources directly
    resourceManager.updateResources(elapsed);

    // Update game time
    store.dispatch(addPlayTime(elapsed));

    // Update last tick time
    lastTickTime = currentTime;
  }, 1000);

  console.log('Direct resource tick started');
}

/**
 * Stop the direct resource tick
 * @deprecated This function is deprecated and should not be used. It doesn't do anything anymore.
 */
export function stopDirectResourceTick() {
  // Print a warning
  console.warn(
    '!!! DEPRECATED !!!\n' +
      'stopDirectResourceTick is deprecated and should not be used.\n' +
      'Use GameLoop and GameTimer instead for proper timing.\n' +
      'This function will not do anything.'
  );
  return; // Early return to prevent running this code

  /* DEPRECATED CODE BELOW - NOT EXECUTED */
  if (tickIntervalId === undefined) {
    console.log('Direct resource tick not running');
    return;
  }

  window.clearInterval(tickIntervalId);
  tickIntervalId = undefined;

  console.log('Direct resource tick stopped');
}

/**
 * Inject a button to control direct resource ticking
 * @deprecated This function is deprecated and should not be used. It doesn't do anything anymore.
 */
export function injectDirectTickButton() {
  // Print a warning
  console.warn(
    '!!! DEPRECATED !!!\n' +
      'injectDirectTickButton is deprecated and should not be used.\n' +
      'Use GameLoop and GameTimer instead for proper timing.\n' +
      'This function will not do anything.'
  );
  return; // Early return to prevent running this code

  /* DEPRECATED CODE BELOW - NOT EXECUTED */
  // Create button
  const button = document.createElement('button');
  button.innerText = '⚙️ Start Direct Tick';
  button.style.position = 'fixed';
  button.style.bottom = '130px';
  button.style.right = '10px';
  button.style.zIndex = '9999';
  button.style.padding = '8px 16px';
  button.style.backgroundColor = '#B195D8';
  button.style.color = '#15131A';
  button.style.border = 'none';
  button.style.borderRadius = '4px';
  button.style.cursor = 'pointer';

  // Add click handler
  button.addEventListener('click', () => {
    if (tickIntervalId === null) {
      startDirectResourceTick();
      button.innerText = '⚙️ Stop Direct Tick';
    } else {
      stopDirectResourceTick();
      button.innerText = '⚙️ Start Direct Tick';
    }
  });

  // Add to document
  document.body.appendChild(button);

  console.log('Direct tick button injected');
}
