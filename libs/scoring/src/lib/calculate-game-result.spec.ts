import { GameAttempt } from '@cerebro-play/shared-models';
import { calculateGameResult } from './calculate-game-result';

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

describe('calculateGameResult', () => {
  it('populates every GameResult field consistently with the unit-level functions', () => {
    const attempts = [attempt(true, 1000), attempt(false, 2000)];
    const result = calculateGameResult({
      sessionId: 'session-1',
      skill: 'memory',
      difficulty: 'easy',
      attempts,
    });

    expect(result.sessionId).toBe('session-1');
    expect(result.skill).toBe('memory');
    expect(result.difficulty).toBe('easy');
    expect(result.accuracy).toBe(50);
    expect(result.score).toBeGreaterThan(0);
    expect(result.completed).toBe(true);
  });

  it('always reports completed: true', () => {
    const result = calculateGameResult({
      sessionId: 'session-1',
      skill: 'memory',
      difficulty: 'easy',
      attempts: [],
    });
    expect(result.completed).toBe(true);
  });
});
