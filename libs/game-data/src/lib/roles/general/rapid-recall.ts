import { Difficulty, GameContent } from '@cerebro-play/shared-models';
import { difficultyToCount } from '../../difficulty/count';
import { ordinal } from '../../ordinal';

function randomTwoDigitNumber(): number {
  return Math.floor(Math.random() * 90) + 10;
}

export function generateGeneralRapidRecall(difficulty: Difficulty): GameContent {
  const count = difficultyToCount(difficulty);
  const numbers = Array.from({ length: count }, randomTwoDigitNumber);
  const askedIndex = Math.floor(Math.random() * count);

  return {
    prompt: `What was the ${ordinal(askedIndex + 1)} number?`,
    data: numbers,
    correctAnswer: numbers[askedIndex],
  };
}
