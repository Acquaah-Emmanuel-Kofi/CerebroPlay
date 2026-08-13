import { Difficulty, GameAttempt } from '@cerebro-play/shared-models';
import { TARGET_RESPONSE_MS } from './constants';

export function calculateSpeed(attempt: GameAttempt, difficulty: Difficulty): number {
  if (attempt.responseTimeMs === undefined) {
    return 0;
  }

  const targetMs = TARGET_RESPONSE_MS[difficulty];
  const ratio = (targetMs / attempt.responseTimeMs) * 100;
  return Math.min(100, Math.max(0, Math.round(ratio)));
}

export function calculateAverageSpeed(attempts: GameAttempt[], difficulty: Difficulty): number {
  if (attempts.length === 0) {
    return 0;
  }

  const total = attempts.reduce((sum, attempt) => sum + calculateSpeed(attempt, difficulty), 0);
  return Math.round(total / attempts.length);
}
