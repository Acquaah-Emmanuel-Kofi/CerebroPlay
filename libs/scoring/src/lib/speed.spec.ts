import { GameAttempt } from '@cerebro-play/shared-models';
import { calculateAverageSpeed, calculateSpeed } from './speed';

function attempt(responseTimeMs?: number): GameAttempt {
  return {
    sessionId: 'session-1',
    content: { data: {}, correctAnswer: 1 },
    submittedAnswer: 1,
    isCorrect: true,
    presentedAt: new Date().toISOString(),
    responseTimeMs,
  };
}

describe('calculateSpeed', () => {
  it('clamps to 100 when faster than the target', () => {
    expect(calculateSpeed(attempt(1000), 'easy')).toBe(100);
  });

  it('returns 100 when exactly at the target', () => {
    expect(calculateSpeed(attempt(8000), 'easy')).toBe(100);
  });

  it('scales down proportionally when slower than the target', () => {
    expect(calculateSpeed(attempt(16000), 'easy')).toBe(50);
  });

  it('returns 0 when there is no responseTimeMs (timer expired with no answer)', () => {
    expect(calculateSpeed(attempt(undefined), 'easy')).toBe(0);
  });
});

describe('calculateAverageSpeed', () => {
  it('returns 0 for an empty attempts list', () => {
    expect(calculateAverageSpeed([], 'easy')).toBe(0);
  });

  it('averages speed across attempts', () => {
    expect(calculateAverageSpeed([attempt(8000), attempt(16000)], 'easy')).toBe(75);
  });
});
