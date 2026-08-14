import { Difficulty, GameContent } from '@cerebro-play/shared-models';

const GRID_SIZE_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: 4,
  medium: 5,
  hard: 6,
  expert: 7,
};

const COLOR_PALETTE = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#1abc9c', '#e67e22', '#34495e'];

export interface SpotTheDifferenceData {
  gridSize: number;
  stateA: string[];
  stateB: string[];
}

function randomFrom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function generateSpotTheDifference(difficulty: Difficulty): GameContent {
  const gridSize = GRID_SIZE_BY_DIFFICULTY[difficulty];
  const totalCells = gridSize * gridSize;

  const stateA = Array.from({ length: totalCells }, () => randomFrom(COLOR_PALETTE));
  const stateB = [...stateA];

  const changedIndex = Math.floor(Math.random() * totalCells);
  let newColor = randomFrom(COLOR_PALETTE);
  while (newColor === stateA[changedIndex]) {
    newColor = randomFrom(COLOR_PALETTE);
  }
  stateB[changedIndex] = newColor;

  const data: SpotTheDifferenceData = { gridSize, stateA, stateB };

  return {
    prompt: 'Which cell changed?',
    data,
    correctAnswer: changedIndex,
  };
}
