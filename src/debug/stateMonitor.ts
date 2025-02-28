/**
 * State Monitor
 * Monitors game state and detects changes to help debug the game loop
 */

import { store } from '../state/store';

// Track state changes over time
interface StateSnapshot {
  timestamp: number;
  resources: Record<
    string,
    {
      amount: number;
      perSecond: number;
    }
  >;
  gameTime: number;
  isRunning: boolean;
}

const snapshots: StateSnapshot[] = [];
let monitorInterval: number | null = null;
let lastSnapshotTime = 0;

/**
 * Start monitoring state changes
 * @param intervalMs How often to take snapshots (default: 1000ms)
 */
export function startStateMonitor(intervalMs = 1000) {
  if (monitorInterval !== null) {
    console.log('State monitor already running');
    return;
  }

  console.log('Starting state monitor...');
  lastSnapshotTime = Date.now();

  // Take snapshots at regular intervals
  monitorInterval = window.setInterval(() => {
    takeSnapshot();
  }, intervalMs);

  // Take initial snapshot
  takeSnapshot();
}

/**
 * Stop monitoring state changes
 */
export function stopStateMonitor() {
  if (monitorInterval === null) {
    console.log('State monitor not running');
    return;
  }

  window.clearInterval(monitorInterval);
  monitorInterval = null;
  console.log('State monitor stopped');
}

/**
 * Take a snapshot of the current state
 */
function takeSnapshot() {
  const state = store.getState();
  const now = Date.now();

  // Create resource snapshots
  const resourceSnapshots: Record<string, { amount: number; perSecond: number }> = {};

  Object.entries(state.resources).forEach(([id, resource]) => {
    if (
      resource &&
      typeof resource === 'object' &&
      'amount' in resource &&
      'perSecond' in resource
    ) {
      resourceSnapshots[id] = {
        amount: typeof resource.amount === 'number' ? resource.amount : 0,
        perSecond: typeof resource.perSecond === 'number' ? resource.perSecond : 0,
      };
    }
  });

  // Create snapshot
  const snapshot: StateSnapshot = {
    timestamp: now,
    resources: resourceSnapshots,
    gameTime: state.game.totalPlayTime,
    isRunning: state.game.isRunning,
  };

  // Add to history
  snapshots.push(snapshot);

  // Limit history to last 100 snapshots
  if (snapshots.length > 100) {
    snapshots.shift();
  }

  // Don't log changes to reduce console spam
  const changes = detectChanges(snapshot);

  lastSnapshotTime = now;
}

/**
 * Detect changes between the latest snapshot and previous snapshots
 * @param latest Latest snapshot
 * @returns Array of change descriptions
 */
function detectChanges(latest: StateSnapshot): string[] {
  const changes: string[] = [];

  // Need at least 2 snapshots to compare
  if (snapshots.length < 2) {
    return changes;
  }

  // Get previous snapshot
  const previous = snapshots[snapshots.length - 2];

  // Check game time
  if (latest.gameTime !== previous.gameTime) {
    changes.push(
      `Game time changed: ${previous.gameTime.toFixed(1)}s → ${latest.gameTime.toFixed(1)}s`
    );
  }

  // Check game running state
  if (latest.isRunning !== previous.isRunning) {
    changes.push(`Game running state changed: ${previous.isRunning} → ${latest.isRunning}`);
  }

  // Check resource amounts
  Object.entries(latest.resources).forEach(([id, resource]) => {
    const prevResource = previous.resources[id];

    if (prevResource) {
      // Check for amount changes
      if (Math.abs(resource.amount - prevResource.amount) > 0.01) {
        changes.push(
          `Resource ${id} amount changed: ${prevResource.amount.toFixed(2)} → ${resource.amount.toFixed(2)}`
        );
      }

      // Check for rate changes
      if (Math.abs(resource.perSecond - prevResource.perSecond) > 0.01) {
        changes.push(
          `Resource ${id} rate changed: ${prevResource.perSecond.toFixed(2)}/s → ${resource.perSecond.toFixed(2)}/s`
        );
      }
    }
  });

  return changes;
}

/**
 * Generate a report of state changes over time
 */
export function generateStateReport() {
  if (snapshots.length === 0) {
    console.log('No state data available. Start monitoring first.');
    return;
  }

  console.group('===== GAME STATE REPORT =====');

  // Calculate monitoring duration
  const startTime = snapshots[0].timestamp;
  const endTime = snapshots[snapshots.length - 1].timestamp;
  const duration = (endTime - startTime) / 1000;

  // Debug only
  // console.log(`Monitoring period: ${duration.toFixed(1)} seconds (${snapshots.length} snapshots)`);

  // Check if resources are changing
  const firstSnapshot = snapshots[0];
  const lastSnapshot = snapshots[snapshots.length - 1];

  let resourcesChanging = false;
  const resourceChanges: Record<string, { total: number; expected: number }> = {};

  Object.entries(lastSnapshot.resources).forEach(([id, resource]) => {
    const firstResource = firstSnapshot.resources[id];

    if (firstResource) {
      const change = resource.amount - firstResource.amount;
      const timeElapsed = (lastSnapshot.timestamp - firstSnapshot.timestamp) / 1000;
      const expectedChange = firstResource.perSecond * timeElapsed;

      resourceChanges[id] = {
        total: change,
        expected: expectedChange,
      };

      if (Math.abs(change) > 0.01) {
        resourcesChanging = true;
      }
    }
  });

  // Disable logs to reduce console spam
  if (resourcesChanging) {
    // Resources are changing correctly
  } else {
    console.warn('⚠️ NO RESOURCES ARE CHANGING OVER TIME!');
  }

  // Check for game time progress
  const gameTimeChange = lastSnapshot.gameTime - firstSnapshot.gameTime;

  if (gameTimeChange > 0) {
    console.log(`Game time progressed: +${gameTimeChange.toFixed(1)} seconds`);
  } else {
    console.warn('⚠️ GAME TIME IS NOT PROGRESSING!');
  }

  // Check for running state changes
  const runningStateChanges = snapshots.reduce((count, snapshot, index) => {
    if (index > 0 && snapshot.isRunning !== snapshots[index - 1].isRunning) {
      return count + 1;
    }
    return count;
  }, 0);

  console.log(`Running state changes: ${runningStateChanges}`);
  console.log(`Current running state: ${lastSnapshot.isRunning ? 'RUNNING' : 'PAUSED'}`);

  console.groupEnd();
}

/**
 * Inject a button to control state monitoring
 */
export function injectStateMonitorButtons() {
  // Create container
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.bottom = '50px';
  container.style.right = '10px';
  container.style.zIndex = '9999';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '5px';

  // Start button
  const startButton = document.createElement('button');
  startButton.innerText = '▶️ Start Monitoring';
  startButton.style.padding = '6px 12px';
  startButton.style.backgroundColor = '#64A79F';
  startButton.style.color = '#15131A';
  startButton.style.border = 'none';
  startButton.style.borderRadius = '4px';
  startButton.style.cursor = 'pointer';

  startButton.addEventListener('click', () => {
    startStateMonitor();
    startButton.disabled = true;
    stopButton.disabled = false;
  });

  // Stop button
  const stopButton = document.createElement('button');
  stopButton.innerText = '⏹️ Stop & Report';
  stopButton.style.padding = '6px 12px';
  stopButton.style.backgroundColor = '#B09E9E';
  stopButton.style.color = '#15131A';
  stopButton.style.border = 'none';
  stopButton.style.borderRadius = '4px';
  stopButton.style.cursor = 'pointer';
  stopButton.disabled = true;

  stopButton.addEventListener('click', () => {
    stopStateMonitor();
    generateStateReport();
    startButton.disabled = false;
    stopButton.disabled = true;
  });

  // Add buttons to container
  container.appendChild(startButton);
  container.appendChild(stopButton);

  // Add container to document
  document.body.appendChild(container);

  console.log('State monitor buttons injected');
}
