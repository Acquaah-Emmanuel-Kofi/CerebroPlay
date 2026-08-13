import { Difficulty, GameContent } from '@cerebro-play/shared-models';
import { difficultyToCount } from '../../difficulty/count';
import { ordinal } from '../../ordinal';

const COLOR_POOL = ['Crimson', 'Amber', 'Emerald', 'Sapphire', 'Violet', 'Coral', 'Teal', 'Gold', 'Slate', 'Rose'];

function shuffledColors(count: number): string[] {
  return [...COLOR_POOL].sort(() => Math.random() - 0.5).slice(0, count);
}

export function generateDesignRapidRecall(difficulty: Difficulty): GameContent {
  const count = Math.min(difficultyToCount(difficulty), COLOR_POOL.length);
  const palette = shuffledColors(count);
  const askedIndex = Math.floor(Math.random() * count);

  return {
    prompt: `Which color was ${ordinal(askedIndex + 1)}?`,
    data: palette,
    correctAnswer: palette[askedIndex],
  };
}
