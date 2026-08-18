import { Difficulty, DifficultyContext, DifficultyEngine } from '@cerebro-play/shared-models';

export const DIFFICULTY_ORDER: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];

const RECENT_RESULTS_WINDOW = 3;
const STEP_UP_ACCURACY_THRESHOLD = 90;
const STEP_DOWN_ACCURACY_THRESHOLD = 50;

/**
 * Recommends a starting difficulty across sessions, from the player's recent accuracy
 * at their current difficulty for this skill. Used to default (not force) a difficulty
 * picker's initial selection for single-attempt games.
 */
export const difficultyEngine: DifficultyEngine = {
  recommend({ skill, recentResults }: DifficultyContext): Difficulty {
    const skillResults = recentResults.filter((result) => result.skill === skill).slice(-RECENT_RESULTS_WINDOW);
    if (skillResults.length === 0) {
      return 'easy';
    }

    const current = skillResults[skillResults.length - 1].difficulty;
    const averageAccuracy = skillResults.reduce((sum, result) => sum + result.accuracy, 0) / skillResults.length;
    const currentIndex = DIFFICULTY_ORDER.indexOf(current);

    if (averageAccuracy >= STEP_UP_ACCURACY_THRESHOLD && currentIndex < DIFFICULTY_ORDER.length - 1) {
      return DIFFICULTY_ORDER[currentIndex + 1];
    }
    if (averageAccuracy < STEP_DOWN_ACCURACY_THRESHOLD && currentIndex > 0) {
      return DIFFICULTY_ORDER[currentIndex - 1];
    }
    return current;
  },
};

const CONSECUTIVE_CORRECT_TO_STEP_UP = 3;
const CONSECUTIVE_INCORRECT_TO_STEP_DOWN = 2;

export interface StepDifficultyInput {
  current: Difficulty;
  consecutiveCorrect: number;
  consecutiveIncorrect: number;
}

/**
 * Adjusts difficulty mid-session for multi-round games: steps up after a streak of
 * correct answers, down after a shorter streak of misses. Callers reset whichever
 * counter didn't cause the step so streaks don't carry across a difficulty change.
 */
export function stepDifficultyWithinSession({
  current,
  consecutiveCorrect,
  consecutiveIncorrect,
}: StepDifficultyInput): Difficulty {
  const currentIndex = DIFFICULTY_ORDER.indexOf(current);

  if (consecutiveCorrect >= CONSECUTIVE_CORRECT_TO_STEP_UP && currentIndex < DIFFICULTY_ORDER.length - 1) {
    return DIFFICULTY_ORDER[currentIndex + 1];
  }
  if (consecutiveIncorrect >= CONSECUTIVE_INCORRECT_TO_STEP_DOWN && currentIndex > 0) {
    return DIFFICULTY_ORDER[currentIndex - 1];
  }
  return current;
}
