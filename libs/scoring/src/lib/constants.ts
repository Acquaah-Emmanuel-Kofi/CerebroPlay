import { Difficulty } from '@cerebro-play/shared-models';

export const DIFFICULTY_MULTIPLIER: Record<Difficulty, number> = {
  easy: 1.0,
  medium: 1.25,
  hard: 1.5,
  expert: 2.0,
};

export const TARGET_RESPONSE_MS: Record<Difficulty, number> = {
  easy: 8000,
  medium: 6000,
  hard: 4500,
  expert: 3500,
};

export const BASE_POINTS_PER_CORRECT_ATTEMPT = 1000;
