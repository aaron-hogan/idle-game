import {
  calculateElapsedSeconds,
  calculateOfflineTime,
  formatTime,
  formatTimeSince,
  gameToRealTime,
  realToGameTime,
  OFFLINE_EFFICIENCY,
  MAX_OFFLINE_TIME,
} from '../timeUtils';

describe('timeUtils', () => {
  describe('calculateElapsedSeconds', () => {
    it('should calculate correct seconds between timestamps', () => {
      const previousTime = 1000; // 1000ms
      const currentTime = 3500; // 3500ms

      const result = calculateElapsedSeconds(currentTime, previousTime);

      expect(result).toBe(2.5); // (3500 - 1000) / 1000 = 2.5 seconds
    });

    it('should return 0 when timestamps are equal', () => {
      const time = 1000;

      const result = calculateElapsedSeconds(time, time);

      expect(result).toBe(0);
    });

    it('should handle negative time difference', () => {
      const previousTime = 5000;
      const currentTime = 2000;

      const result = calculateElapsedSeconds(currentTime, previousTime);

      expect(result).toBe(-3); // (2000 - 5000) / 1000 = -3 seconds
    });
  });

  describe('calculateOfflineTime', () => {
    it('should apply efficiency to elapsed time', () => {
      const lastSaveTime = 1000;
      const currentTime = 11000; // 10 seconds later

      const result = calculateOfflineTime(currentTime, lastSaveTime);

      // 10 seconds * 0.7 efficiency = 7 seconds
      expect(result).toBe(7);
    });

    it('should cap offline time at maximum with default safe limit', () => {
      const lastSaveTime = 1000;
      // Set current time to far in the future (over any reasonable limits)
      const currentTime = lastSaveTime + 2 * 24 * 60 * 60 * 1000;

      const result = calculateOfflineTime(currentTime, lastSaveTime);

      // By default, it uses the REASONABLE_MAX_OFFLINE_TIME (5 minutes)
      // REASONABLE_MAX_OFFLINE_TIME * 0.7 efficiency / 1000 = 210 seconds
      expect(result).toBe(210);
    });

    it('should cap offline time at absolute maximum when safe limit is disabled', () => {
      const lastSaveTime = 1000;
      // Set current time to 2 days later (over the max of 24 hours)
      const currentTime = lastSaveTime + 2 * 24 * 60 * 60 * 1000;

      const result = calculateOfflineTime(currentTime, lastSaveTime, { useSafeLimit: false });

      // MAX_OFFLINE_TIME (24 hours in ms) * 0.7 efficiency / 1000 = 60480 seconds
      const expectedSeconds = (MAX_OFFLINE_TIME * OFFLINE_EFFICIENCY) / 1000;
      expect(result).toBe(expectedSeconds);
    });
  });

  describe('formatTime', () => {
    it('should format seconds', () => {
      expect(formatTime(42)).toBe('42s');
    });

    it('should format minutes and seconds', () => {
      expect(formatTime(125)).toBe('2m 5s');
    });

    it('should format hours and minutes', () => {
      expect(formatTime(3725)).toBe('1h 2m');
    });

    it('should handle zero', () => {
      expect(formatTime(0)).toBe('0s');
    });

    it('should handle fractional seconds', () => {
      expect(formatTime(42.75)).toBe('42s');
    });
  });

  describe('formatTimeSince', () => {
    it('should format time since a timestamp', () => {
      const now = Date.now();
      const tenSecondsAgo = now - 10000;

      // Mock Date.now
      const realDateNow = Date.now;
      Date.now = jest.fn(() => now);

      expect(formatTimeSince(tenSecondsAgo)).toBe('10s');

      // Clean up
      Date.now = realDateNow;
    });
  });

  describe('gameToRealTime and realToGameTime', () => {
    it('should convert game time to real time with default scale', () => {
      expect(gameToRealTime(100)).toBe(100);
    });

    it('should convert game time to real time with custom scale', () => {
      expect(gameToRealTime(100, 2)).toBe(50);
    });

    it('should convert real time to game time with default scale', () => {
      expect(realToGameTime(100)).toBe(100);
    });

    it('should convert real time to game time with custom scale', () => {
      expect(realToGameTime(50, 2)).toBe(100);
    });

    it('should be inverse operations', () => {
      const gameTime = 200;
      const timeScale = 3;

      const realTime = gameToRealTime(gameTime, timeScale);
      const backToGameTime = realToGameTime(realTime, timeScale);

      expect(backToGameTime).toBe(gameTime);
    });
  });
});
