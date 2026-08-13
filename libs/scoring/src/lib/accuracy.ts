import { GameAttempt } from '@cerebro-play/shared-models';

export function calculateAccuracy(attempts: GameAttempt[]): number {
  if (attempts.length === 0) {
    return 0;
  }

  const correctCount = attempts.filter((attempt) => attempt.isCorrect).length;
  return Math.round((correctCount / attempts.length) * 100);
}
