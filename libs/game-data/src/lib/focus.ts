import { GameContent } from '@cerebro-play/shared-models';

const SYMBOL_POOL = ['🔴', '🔵', '🟢', '🟡', '🟣', '⬛'];

export interface FocusData {
  symbol: string;
  target: string;
}

function randomFrom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function generateFocus(): GameContent {
  const target = randomFrom(SYMBOL_POOL);
  const showTarget = Math.random() < 0.5;
  const symbol = showTarget ? target : randomFrom(SYMBOL_POOL.filter((s) => s !== target));

  const data: FocusData = { symbol, target };

  return {
    prompt: `Tap TARGET if you see ${target}, otherwise tap SKIP.`,
    data,
    correctAnswer: symbol === target ? 'target' : 'skip',
  };
}
