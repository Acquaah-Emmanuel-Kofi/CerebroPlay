import { Difficulty, GameContent } from '@cerebro-play/shared-models';

type Operation = 'add' | 'subtract' | 'multiply' | 'divide';

const OPERATIONS_BY_DIFFICULTY: Record<Difficulty, Operation[]> = {
  easy: ['add'],
  medium: ['add', 'subtract'],
  hard: ['add', 'subtract', 'multiply'],
  expert: ['multiply', 'divide'],
};

const OPERAND_RANGE_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: 10,
  medium: 25,
  hard: 12,
  expert: 12,
};

export interface MentalMathData {
  expression: string;
  options: number[];
}

function randomInt(max: number, min = 1): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFrom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function generateMentalMathSprint(difficulty: Difficulty): GameContent {
  const operation = randomFrom(OPERATIONS_BY_DIFFICULTY[difficulty]);
  const range = OPERAND_RANGE_BY_DIFFICULTY[difficulty];

  let a: number;
  let b: number;
  let answer: number;
  let expression: string;

  if (operation === 'add') {
    a = randomInt(range);
    b = randomInt(range);
    answer = a + b;
    expression = `${a} + ${b}`;
  } else if (operation === 'subtract') {
    a = randomInt(range);
    b = randomInt(range);
    if (b > a) [a, b] = [b, a];
    answer = a - b;
    expression = `${a} - ${b}`;
  } else if (operation === 'multiply') {
    a = randomInt(range);
    b = randomInt(12);
    answer = a * b;
    expression = `${a} × ${b}`;
  } else {
    b = randomInt(12, 2);
    answer = randomInt(range);
    a = answer * b;
    expression = `${a} ÷ ${b}`;
  }

  const options = new Set<number>([answer]);
  while (options.size < 4) {
    const offset = randomInt(Math.max(3, Math.round(Math.abs(answer) * 0.2)));
    const distractor = Math.random() < 0.5 ? answer + offset : answer - offset;
    options.add(distractor);
  }
  const shuffledOptions = [...options].sort(() => Math.random() - 0.5);

  const data: MentalMathData = { expression, options: shuffledOptions };

  return {
    prompt: `${expression} = ?`,
    data,
    correctAnswer: answer,
  };
}
