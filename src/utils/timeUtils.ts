/**
 * Time utility functions for the game
 */

// Constants for offline progression
export const OFFLINE_EFFICIENCY = 0.7; // 70% efficiency while away
export const MAX_OFFLINE_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
export const REASONABLE_MAX_OFFLINE_TIME = 5 * 60 * 1000; // 5 minutes max for regular play

// Constants for day-based time system
export const SECONDS_PER_DAY = 60; // Each game day is 60 seconds of real time
export const MAX_DAYS = 999; // Maximum number of days to display

/**
 * Centralized function to get the current time in milliseconds
 * This ensures all parts of the app use the same time source
 */
export function getCurrentTime(): number {
  return Date.now();
}

/**
 * Get high precision timestamp in seconds
 * Use this for game logic that needs precise timing
 */
export function getCurrentTimeSeconds(): number {
  return performance.now() / 1000;
}

/**
 * Calculate the elapsed time in seconds between two timestamps
 */
export function calculateElapsedSeconds(currentTime: number, previousTime: number): number {
  return (currentTime - previousTime) / 1000;
}

/**
 * Calculate elapsed time in seconds from a previous time until now
 */
export function calculateElapsedSecondsFromNow(previousTime: number): number {
  return calculateElapsedSeconds(getCurrentTime(), previousTime);
}

/**
 * Calculate the offline progression time, applying efficiency and cap
 * Returns reasonable values for offline progression
 */
export function calculateOfflineTime(
  currentTime: number,
  lastSaveTime: number,
  options: { useSafeLimit?: boolean; applyEfficiency?: boolean } = {}
): number {
  // Default options
  const { useSafeLimit = true, applyEfficiency = true } = options;

  // If lastSaveTime is in the future or zero, return 0
  if (lastSaveTime <= 0 || lastSaveTime > currentTime) {
    console.log('timeUtils: Invalid lastSaveTime, skipping offline calculation');
    return 0;
  }

  // Calculate elapsed time
  const elapsedMilliseconds = currentTime - lastSaveTime;

  // Cap to maximum offline time (either the reasonable or absolute max)
  const maxTime = useSafeLimit ? REASONABLE_MAX_OFFLINE_TIME : MAX_OFFLINE_TIME;
  const cappedTime = Math.min(elapsedMilliseconds, maxTime);

  // Apply offline efficiency if requested
  const effectiveTime = applyEfficiency ? cappedTime * OFFLINE_EFFICIENCY : cappedTime;

  // Convert to seconds
  return effectiveTime / 1000;
}

/**
 * Format time display in readable format
 * Examples: "2h 30m", "45m 20s", "10s"
 */
export function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${Math.floor(seconds)}s`;
  }

  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

/**
 * Format time since a given timestamp
 */
export function formatTimeSince(timestamp: number): string {
  const elapsedSeconds = calculateElapsedSeconds(Date.now(), timestamp);
  return formatTime(elapsedSeconds);
}

/**
 * Convert game time to real time (can be used for accelerated game time)
 */
export function gameToRealTime(gameSeconds: number, timeScale: number = 1): number {
  return gameSeconds / timeScale;
}

/**
 * Convert real time to game time (can be used for accelerated game time)
 */
export function realToGameTime(realSeconds: number, timeScale: number = 1): number {
  return realSeconds * timeScale;
}

/**
 * Calculate game day from total seconds
 * Day 1 is the first day (not day 0)
 */
export function getDayFromSeconds(totalSeconds: number): number {
  // Ensure we have positive seconds (handle edge cases)
  if (totalSeconds < 0) {
    console.warn('timeUtils: Negative time value in getDayFromSeconds, using 1');
    return 1;
  }

  // Calculate day number (starting from 1)
  // e.g., 0-59 seconds = day 1, 60-119 seconds = day 2, etc.
  const day = Math.floor(totalSeconds / SECONDS_PER_DAY) + 1;

  // DEBUG: Log day calculation details
  console.log(
    `getDayFromSeconds: seconds=${totalSeconds.toFixed(2)}, SECONDS_PER_DAY=${SECONDS_PER_DAY}, calculation=${Math.floor(totalSeconds / SECONDS_PER_DAY)}, day=${day}`
  );

  // Log if we have an abnormal day value (for debugging)
  if (day > 9999) {
    console.warn(`timeUtils: Unusually high day value: ${day}, from ${totalSeconds} seconds`);
  }

  return day;
}

/**
 * Calculate progress within the current day (0 to 1)
 */
export function getDayProgress(totalSeconds: number): number {
  // Ensure we have positive seconds (handle edge cases)
  if (totalSeconds < 0) {
    console.warn('timeUtils: Negative time value in getDayProgress, using 0');
    return 0;
  }

  // Calculate progress within the day (0 to 1)
  const dayProgress = (totalSeconds % SECONDS_PER_DAY) / SECONDS_PER_DAY;

  // Ensure it's in the valid range [0, 1]
  return Math.min(Math.max(dayProgress, 0), 1);
}

/**
 * Format time as day display (e.g., "Day 42")
 */
export function formatTimeAsDays(seconds: number): string {
  const day = getDayFromSeconds(seconds);

  // DEBUG: Log the day calculation details
  console.log(
    `formatTimeAsDays: seconds=${seconds.toFixed(2)}, day=${day}, SECONDS_PER_DAY=${SECONDS_PER_DAY}`
  );

  // Cap at max days
  return `Day ${Math.min(day, MAX_DAYS)}`;
}

/**
 * Format day with leading zeros to ensure consistent width
 * Used to prevent layout shifts in UI
 */
export function formatDayWithPadding(seconds: number): string {
  const day = getDayFromSeconds(seconds);
  const cappedDay = Math.min(day, MAX_DAYS);
  // Pad with spaces to ensure consistent width (3 digits)
  return cappedDay.toString().padStart(3, ' ');
}
