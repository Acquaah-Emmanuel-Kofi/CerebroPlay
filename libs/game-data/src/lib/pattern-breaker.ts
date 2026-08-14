import { Difficulty, GameContent } from '@cerebro-play/shared-models';

type PatternKind = 'arithmetic' | 'geometric' | 'alternating';

const SEQUENCE_LENGTH = 4;

const KIND_POOL_BY_DIFFICULTY: Record<Difficulty, PatternKind[]> = {
  easy: ['arithmetic'],
  medium: ['arithmetic', 'geometric'],
  hard: ['geometric', 'alternating'],
  expert: ['alternating', 'geometric'],
};

const STEP_RANGE_BY_DIFFICULTY: Record<Difficulty, [number, number]> = {
  easy: [1, 5],
  medium: [3, 9],
  hard: [2, 6],
  expert: [2, 8],
};

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFrom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function buildArithmetic(start: number, step: number, length: number): number[] {
  return Array.from({ length }, (_, i) => start + step * i);
}

function buildGeometric(start: number, ratio: number, length: number): number[] {
  return Array.from({ length }, (_, i) => start * Math.pow(ratio, i));
}

function buildAlternating(start: number, stepA: number, stepB: number, length: number): number[] {
  const values = [start];
  for (let i = 1; i < length; i++) {
    values.push(values[i - 1] + (i % 2 === 1 ? stepA : stepB));
  }
  return values;
}

export function generatePatternBreaker(difficulty: Difficulty): GameContent {
  const kind = randomFrom(KIND_POOL_BY_DIFFICULTY[difficulty]);
  const [minStep, maxStep] = STEP_RANGE_BY_DIFFICULTY[difficulty];
  const length = SEQUENCE_LENGTH + 1;

  let full: number[];
  if (kind === 'arithmetic') {
    full = buildArithmetic(randomInt(1, 10), randomInt(minStep, maxStep), length);
  } else if (kind === 'geometric') {
    full = buildGeometric(randomInt(2, 4), randomInt(2, 3), length);
  } else {
    full = buildAlternating(randomInt(1, 10), randomInt(minStep, maxStep), -randomInt(minStep, maxStep), length);
  }

  return {
    prompt: 'What comes next in the sequence?',
    data: full.slice(0, -1),
    correctAnswer: full[full.length - 1],
  };
}
