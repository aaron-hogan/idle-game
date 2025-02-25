# Browser Timing Challenges

Web browsers introduce unique timing challenges that need special handling in game development. This document outlines those challenges and our approach to addressing them.

## Key Browser Timing Challenges

### 1. Background Tab Throttling

When a browser tab loses focus or is in the background:

- **requestAnimationFrame pauses** completely in most browsers
- **setTimeout/setInterval** are throttled to ~1 second minimum intervals
- **Performance impact** of background tabs is minimized by the browser

**Solution:**
- Use Page Visibility API to detect tab visibility changes
- Properly handle large time jumps when tabs regain focus
- Implement maximum frame time cap to prevent "spiral of death"

```typescript
// Example implementation
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Tab lost focus - pause active animations or switch to low-power mode
    gameTimer.pause();
  } else {
    // Tab gained focus - reset time tracking to prevent large jumps
    gameTimer.resume();
  }
});
```

### 2. Timer Precision Issues

Browser timers have varying levels of precision:

- **Date.now()** - Millisecond precision, but may have system clock adjustments
- **performance.now()** - Microsecond precision, monotonic, but potentially throttled for security
- **requestAnimationFrame** - Tied to display refresh rate, typically 60Hz (16.7ms)

**Solution:**
- Use performance.now() exclusively for game timing
- Calculate elapsed time between frames rather than assuming fixed intervals
- Implement sub-frame interpolation for smooth animations

### 3. Browser Throttling and Power Saving

Modern browsers implement aggressive power-saving measures:

- Mobile devices may reduce performance in low battery conditions
- Browsers may reduce animation frame rates for power saving
- Hardware acceleration may be disabled in certain conditions

**Solution:**
- Design for variable frame rates using delta time
- Implement fixed timestep for gameplay logic
- Decouple visual updates from game state updates

### 4. Timer Drift and System Clock Changes

In long-running games, time tracking can drift:

- System clock adjustments (e.g., daylight saving time)
- NTP synchronization causing clock jumps
- Browser precision limitations causing accumulating errors

**Solution:**
- Use performance.now() which is unaffected by system clock changes
- Periodically synchronize game time with server (for multiplayer)
- Implement drift correction for long-running sessions

```typescript
// Example drift correction
const SYNC_INTERVAL = 60 * 60 * 1000; // 1 hour
let lastSyncTime = performance.now();

function checkTimeDrift() {
  const now = performance.now();
  if (now - lastSyncTime > SYNC_INTERVAL) {
    // Reconcile game time with actual elapsed time
    gameTimer.recalibrate();
    lastSyncTime = now;
  }
}
```

### 5. Device Sleep and Hibernation

When devices sleep or hibernate:

- All JavaScript execution pauses completely
- Large time jumps occur when device wakes up
- Browser may reload or reset page state

**Solution:**
- Track last known timestamp using localStorage
- Implement offline progress calculation on page load
- Cap maximum offline time to reasonable limits

## Implementation Approach

Our timer system addresses these challenges by:

1. **Using High-Resolution Timing**
   - Exclusively using performance.now() for all time measurements
   - Converting to seconds for all game calculations

2. **Handling Tab Focus Changes**
   - Detecting visibility changes with Page Visibility API
   - Properly resuming with adjusted time tracking

3. **Implementing Fixed Timestep**
   - Accumulating time between frames
   - Processing fixed updates consistently regardless of frame rate
   - Capping maximum frame time to prevent spiral of death

4. **Separating Logic from Rendering**
   - Game state updates at fixed intervals
   - Rendering can occur at whatever rate the browser provides

5. **Offline Progression**
   - Storing timestamps in localStorage
   - Calculating elapsed time on page reload
   - Advancing game state appropriately

By addressing these browser-specific challenges, our timer system ensures consistent gameplay across different devices, browsers, and usage patterns.