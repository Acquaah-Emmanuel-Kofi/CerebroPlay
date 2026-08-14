import { Difficulty, GameContent } from '@cerebro-play/shared-models';
import { difficultyToCount } from './difficulty/count';

export const MEMORY_GRID_SIZE = 5;

export interface MemoryGridData {
  gridSize: number;
  highlightedPositions: number[];
}

export function generateMemoryGrid(difficulty: Difficulty): GameContent {
  const count = difficultyToCount(difficulty);
  const totalCells = MEMORY_GRID_SIZE * MEMORY_GRID_SIZE;

  const positions = new Set<number>();
  while (positions.size < count) {
    positions.add(Math.floor(Math.random() * totalCells));
  }
  const highlightedPositions = Array.from(positions).sort((a, b) => a - b);

  const data: MemoryGridData = { gridSize: MEMORY_GRID_SIZE, highlightedPositions };

  return {
    prompt: 'Reproduce the highlighted pattern.',
    data,
    correctAnswer: highlightedPositions,
  };
}
