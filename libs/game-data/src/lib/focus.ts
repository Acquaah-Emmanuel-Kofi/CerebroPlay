import { Difficulty, GameContent } from '@cerebro-play/shared-models';

const SYMBOL_POOL_BY_DIFFICULTY: Record<Difficulty, string[]> = {
  easy: ['🔴', '🔵', '🟢', '🟡'],
  medium: ['🔴', '🔵', '🟢', '🟡', '🟣', '⬛'],
  hard: ['🔴', '🔵', '🟢', '🟡', '🟣', '⬛', '⬜', '🟠'],
  expert: ['🔴', '🔵', '🟢', '🟡', '🟣', '⬛', '⬜', '🟠', '🟤', '🔶'],
};

export interface FocusData {
  symbol: string;
  target: string;
}

function randomFrom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function generateFocus(difficulty: Difficulty): GameContent {
  const pool = SYMBOL_POOL_BY_DIFFICULTY[difficulty];
  const target = randomFrom(pool);
  const showTarget = Math.random() < 0.5;
  const symbol = showTarget ? target : randomFrom(pool.filter((s) => s !== target));

  const data: FocusData = { symbol, target };

  return {
    prompt: `Tap TARGET if you see ${target}, otherwise tap SKIP.`,
    data,
    correctAnswer: symbol === target ? 'target' : 'skip',
  };
}
