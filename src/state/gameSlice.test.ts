import gameReducer, {
  setGameStage,
  updateLastSaveTime,
  addPlayTime,
  setTotalPlayTime,
  resetGame,
} from './gameSlice';

describe('game reducer', () => {
  const initialState = {
    gameStage: 0,
    lastSaveTime: expect.any(Number),
    totalPlayTime: 0,
    isRunning: true,
    tickRate: 1000,
    gameTimeScale: 1,
    startDate: expect.any(Number),
    gameEnded: false,
    gameWon: false,
    endReason: null
  };

  test('should handle initial state', () => {
    const actual = gameReducer(undefined, { type: 'unknown' });
    expect(actual).toMatchObject({
      gameStage: 0,
      lastSaveTime: expect.any(Number),
      totalPlayTime: 0,
      isRunning: true,
      tickRate: 1000,
      gameTimeScale: 1,
      startDate: expect.any(Number),
      gameEnded: false,
      gameWon: false,
      endReason: null
    });
  });

  test('should handle setGameStage', () => {
    const actual = gameReducer(initialState, setGameStage(1));
    expect(actual.gameStage).toEqual(1);
  });

  test('should handle updateLastSaveTime', () => {
    // Mock Date.now for predictable test
    const realDateNow = Date.now;
    const mockNow = 1644700000000; // Specific timestamp for testing
    global.Date.now = jest.fn(() => mockNow);
    
    const actual = gameReducer(initialState, updateLastSaveTime());
    expect(actual.lastSaveTime).toEqual(mockNow);
    
    // Restore original Date.now
    global.Date.now = realDateNow;
  });

  test('should handle addPlayTime', () => {
    const startState = { ...initialState, totalPlayTime: 100 };
    const timeToAdd = 50;
    const actual = gameReducer(startState, addPlayTime(timeToAdd));
    expect(actual.totalPlayTime).toEqual(150);
  });

  test('should handle setTotalPlayTime', () => {
    const newPlayTime = 500;
    const actual = gameReducer(initialState, setTotalPlayTime(newPlayTime));
    expect(actual.totalPlayTime).toEqual(newPlayTime);
  });

  test('should handle resetGame', () => {
    const modifiedState = {
      gameStage: 2,
      lastSaveTime: 1644700000000,
      totalPlayTime: 5000,
      isRunning: false,
      tickRate: 500,
      gameTimeScale: 2,
      startDate: 1644700000000,
      gameEnded: true,
      gameWon: true,
      endReason: "Test"
    };
    const actual = gameReducer(modifiedState, resetGame());
    expect(actual).toMatchObject({
      gameStage: 0,
      lastSaveTime: expect.any(Number),
      totalPlayTime: 0,
      isRunning: true,
      tickRate: 1000,
      gameTimeScale: 1,
      startDate: expect.any(Number),
      gameEnded: false,
      gameWon: false,
      endReason: null
    });
  });
});