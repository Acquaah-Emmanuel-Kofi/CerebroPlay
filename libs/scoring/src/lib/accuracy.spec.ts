import { GameAttempt } from '@cerebro-play/shared-models';
import { calculateAccuracy } from './accuracy';

function attempt(isCorrect: boolean): GameAttempt {
  return {
    sessionId: 'session-1',
    content: { data: {}, correctAnswer: 1 },
    submittedAnswer: isCorrect ? 1 : 2,
    isCorrect,
    presentedAt: new Date().toISOString(),
  };
}

describe('calculateAccuracy', () => {
  it('returns 0 for an empty attempts list', () => {
    expect(calculateAccuracy([])).toBe(0);
  });

  it('returns 100 when every attempt is correct', () => {
    expect(calculateAccuracy([attempt(true), attempt(true)])).toBe(100);
  });

  it('returns 0 when every attempt is incorrect', () => {
    expect(calculateAccuracy([attempt(false), attempt(false)])).toBe(0);
  });

  it('rounds the correct percentage for a mixed set', () => {
    expect(calculateAccuracy([attempt(true), attempt(false), attempt(true)])).toBe(67);
  });
});
