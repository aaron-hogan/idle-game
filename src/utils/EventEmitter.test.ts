import { EventEmitter } from './EventEmitter';

describe('EventEmitter', () => {
  let emitter: EventEmitter;

  beforeEach(() => {
    emitter = new EventEmitter();
  });

  test('should register and trigger event listeners', () => {
    const mockCallback = jest.fn();

    emitter.on('testEvent', mockCallback);
    emitter.emit('testEvent', 'param1', 'param2');

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith('param1', 'param2');
  });
});
