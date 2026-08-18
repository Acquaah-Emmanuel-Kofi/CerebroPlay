import { GameContent } from '@cerebro-play/shared-models';

const SHAPE_POOL = ['●', '■', '▲', '◆', '★', '⬢'];

export interface MatrixReasoningData {
  grid: string[];
  options: string[];
}

function randomFrom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function sampleThree(pool: string[]): string[] {
  return [...pool].sort(() => Math.random() - 0.5).slice(0, 3);
}

/**
 * A 3x3 matrix where cell(row, col) is shapes[row] repeated (col + 1) times -- the shape
 * is constant per row, the count increases across each column. The bottom-right cell is
 * omitted; the player picks what completes it from 4 options.
 */
export function generateMatrixReasoning(): GameContent {
  const shapes = sampleThree(SHAPE_POOL);
  const grid: string[] = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (row === 2 && col === 2) continue;
      grid.push(shapes[row].repeat(col + 1));
    }
  }

  const correctAnswer = shapes[2].repeat(3);
  const otherShapes = SHAPE_POOL.filter((shape) => !shapes.includes(shape));

  const options = Array.from(
    new Set([
      correctAnswer,
      randomFrom(otherShapes).repeat(3), // wrong shape, right count
      shapes[2].repeat(2), // right shape, wrong count
      randomFrom(otherShapes).repeat(2), // wrong shape, wrong count
    ]),
  ).sort(() => Math.random() - 0.5);

  const data: MatrixReasoningData = { grid, options };

  return {
    prompt: 'Which piece completes the pattern?',
    data,
    correctAnswer,
  };
}
