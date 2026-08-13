export interface GameTimerCallbacks {
  onTick?: (remainingMs: number) => void;
  onExpire: () => void;
}

const TICK_INTERVAL_MS = 1000;

export class GameTimer {
  private intervalId?: ReturnType<typeof setInterval>;
  private expireTimeoutId?: ReturnType<typeof setTimeout>;
  private durationMs = 0;
  private startedAt = 0;

  start(durationMs: number, callbacks: GameTimerCallbacks): void {
    this.stop();
    this.durationMs = durationMs;
    this.startedAt = Date.now();

    this.expireTimeoutId = setTimeout(() => {
      this.stop();
      callbacks.onExpire();
    }, durationMs);

    if (callbacks.onTick) {
      this.intervalId = setInterval(() => {
        callbacks.onTick?.(this.getRemainingMs());
      }, TICK_INTERVAL_MS);
    }
  }

  stop(): void {
    if (this.expireTimeoutId) {
      clearTimeout(this.expireTimeoutId);
      this.expireTimeoutId = undefined;
    }
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  getRemainingMs(): number {
    return Math.max(0, this.durationMs - (Date.now() - this.startedAt));
  }
}
