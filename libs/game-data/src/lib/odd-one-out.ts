import { Difficulty, GameContent } from '@cerebro-play/shared-models';

type Rule = 'even' | 'multipleOfThree' | 'multipleOfFive' | 'singleDigit';

const RULES: Rule[] = ['even', 'multipleOfThree', 'multipleOfFive', 'singleDigit'];

const RULE_LABELS: Record<Rule, string> = {
  even: 'even numbers',
  multipleOfThree: 'multiples of 3',
  multipleOfFive: 'multiples of 5',
  singleDigit: 'single-digit numbers',
};

const RANGE_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: 20,
  medium: 40,
  hard: 80,
  expert: 150,
};

const ITEM_COUNT_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: 4,
  medium: 5,
  hard: 5,
  expert: 6,
};

export interface OddOneOutData {
  items: number[];
  ruleLabel: string;
}

function matchesRule(rule: Rule, value: number): boolean {
  if (rule === 'even') return value % 2 === 0;
  if (rule === 'multipleOfThree') return value % 3 === 0;
  if (rule === 'multipleOfFive') return value % 5 === 0;
  return value < 10;
}

function randomInt(max: number, min = 1): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateOddOneOut(difficulty: Difficulty): GameContent {
  const rule = RULES[Math.floor(Math.random() * RULES.length)];
  const range = RANGE_BY_DIFFICULTY[difficulty];
  const count = ITEM_COUNT_BY_DIFFICULTY[difficulty];

  const matching: number[] = [];
  while (matching.length < count - 1) {
    const candidate = randomInt(range);
    if (matchesRule(rule, candidate) && !matching.includes(candidate)) {
      matching.push(candidate);
    }
  }

  let oddOne = randomInt(range);
  while (matchesRule(rule, oddOne) || matching.includes(oddOne)) {
    oddOne = randomInt(range);
  }

  const oddIndex = Math.floor(Math.random() * count);
  const items = [...matching];
  items.splice(oddIndex, 0, oddOne);

  const data: OddOneOutData = { items, ruleLabel: RULE_LABELS[rule] };

  return {
    prompt: `Which number doesn't belong? (the rest are ${RULE_LABELS[rule]})`,
    data,
    correctAnswer: oddOne,
  };
}
