import { Difficulty, GameContent } from '@cerebro-play/shared-models';

type Rule = 'parity' | 'size' | 'divisibility';

const RULES: Rule[] = ['parity', 'size', 'divisibility'];

const RULE_DESCRIPTIONS: Record<Rule, string> = {
  parity: 'Sort by parity',
  size: 'Sort by size',
  divisibility: 'Sort by divisibility by 3',
};

const RULE_CATEGORIES: Record<Rule, [string, string]> = {
  parity: ['Even', 'Odd'],
  size: ['Small (< 10)', 'Large (>= 10)'],
  divisibility: ['Divisible by 3', 'Not divisible by 3'],
};

const RANGE_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: 10,
  medium: 20,
  hard: 50,
  expert: 100,
};

export interface SortItData {
  value: number;
  rule: string;
  categories: [string, string];
}

function categorize(rule: Rule, value: number): string {
  const [first, second] = RULE_CATEGORIES[rule];
  if (rule === 'parity') return value % 2 === 0 ? first : second;
  if (rule === 'size') return value < 10 ? first : second;
  return value % 3 === 0 ? first : second;
}

function randomFrom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function generateSortIt(difficulty: Difficulty): GameContent {
  const rule = randomFrom(RULES);
  const max = RANGE_BY_DIFFICULTY[difficulty];
  const value = Math.floor(Math.random() * max) + 1;
  const categories = RULE_CATEGORIES[rule];

  const data: SortItData = { value, rule: RULE_DESCRIPTIONS[rule], categories };

  return {
    prompt: `${RULE_DESCRIPTIONS[rule]}. Which category does ${value} belong to?`,
    data,
    correctAnswer: categorize(rule, value),
  };
}
