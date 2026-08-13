import { Difficulty, GameAttempt } from '@cerebro-play/shared-models';
import { BASE_POINTS_PER_CORRECT_ATTEMPT, DIFFICULTY_MULTIPLIER } from './constants';
import { calculateSpeed } from './speed';

export function calculateScore(attempts: GameAttempt[], difficulty: Difficulty): number {
  const multiplier = DIFFICULTY_MULTIPLIER[difficulty];

  const total = attempts.reduce((sum, attempt) => {
    if (!attempt.isCorrect) {
      return sum;
    }
    const speed = calculateSpeed(attempt, difficulty);
    return sum + BASE_POINTS_PER_CORRECT_ATTEMPT * (speed / 100) * multiplier;
  }, 0);

  return Math.round(total);
}
