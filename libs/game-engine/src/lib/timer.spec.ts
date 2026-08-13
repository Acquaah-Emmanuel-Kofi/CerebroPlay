import { GameTimer } from './timer.js';

describe('GameTimer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('calls onExpire once the duration elapses', () => {
    const timer = new GameTimer();
    const onExpire = jest.fn();

    timer.start(5000, { onExpire });
    expect(onExpire).not.toHaveBeenCalled();

    jest.advanceTimersByTime(5000);
    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it('calls onTick every second with the remaining time', () => {
    const timer = new GameTimer();
    const onExpire = jest.fn();
    const onTick = jest.fn();

    timer.start(3000, { onExpire, onTick });

    jest.advanceTimersByTime(1000);
    expect(onTick).toHaveBeenNthCalledWith(1, 2000);

    jest.advanceTimersByTime(1000);
    expect(onTick).toHaveBeenNthCalledWith(2, 1000);
  });

  it('does not call onExpire after stop() is called', () => {
    const timer = new GameTimer();
    const onExpire = jest.fn();

    timer.start(5000, { onExpire });
    timer.stop();

    jest.advanceTimersByTime(5000);
    expect(onExpire).not.toHaveBeenCalled();
  });

  it('reports the remaining time via getRemainingMs()', () => {
    const timer = new GameTimer();
    timer.start(4000, { onExpire: jest.fn() });

    expect(timer.getRemainingMs()).toBe(4000);
    jest.advanceTimersByTime(1000);
    expect(timer.getRemainingMs()).toBe(3000);
  });
});
