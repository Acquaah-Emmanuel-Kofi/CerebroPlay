import { GameAttempt } from '@cerebro-play/shared-models';
import { calculateScore } from './score';

function attempt(isCorrect: boolean, responseTimeMs: number): GameAttempt {
  return {
    sessionId: 'session-1',
    content: { data: {}, correctAnswer: 1 },
    submittedAnswer: isCorrect ? 1 : 2,
    isCorrect,
    presentedAt: new Date().toISOString(),
    responseTimeMs,
  };
}

describe('calculateScore', () => {
  it('returns 0 when every attempt is incorrect', () => {
    expect(calculateScore([attempt(false, 1000), attempt(false, 1000)], 'easy')).toBe(0);
  });

  it('gives more points for a faster correct attempt than a slower one, at the same difficulty', () => {
    const fast = calculateScore([attempt(true, 1000)], 'easy');
    const slow = calculateScore([attempt(true, 16000)], 'easy');
    expect(fast).toBeGreaterThan(slow);
  });

  it('gives more points at a higher difficulty for the same attempt shape', () => {
    const easy = calculateScore([attempt(true, 1000)], 'easy');
    const hard = calculateScore([attempt(true, 1000)], 'hard');
    expect(hard).toBeGreaterThan(easy);
  });
});
