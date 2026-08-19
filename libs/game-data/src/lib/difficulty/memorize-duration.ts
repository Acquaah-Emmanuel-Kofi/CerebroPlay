import { Difficulty } from '@cerebro-play/shared-models';

const MEMORIZE_DURATION_MS_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: 5000,
  medium: 4000,
  hard: 3000,
  expert: 2000,
};

export function difficultyToMemorizeDurationMs(difficulty: Difficulty): number {
  return MEMORIZE_DURATION_MS_BY_DIFFICULTY[difficulty];
}
