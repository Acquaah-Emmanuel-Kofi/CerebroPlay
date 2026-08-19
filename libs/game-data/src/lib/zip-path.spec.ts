import { generateZipPath, ZipPathData } from './zip-path';

function isAdjacent(a: number, b: number, gridSize: number): boolean {
  const rowA = Math.floor(a / gridSize);
  const colA = a % gridSize;
  const rowB = Math.floor(b / gridSize);
  const colB = b % gridSize;
  return Math.abs(rowA - rowB) + Math.abs(colA - colB) === 1;
}

describe('generateZipPath', () => {
  it('produces a correctAnswer path that visits every cell of the grid exactly once', () => {
    for (const difficulty of ['easy', 'medium', 'hard', 'expert'] as const) {
      const content = generateZipPath(difficulty);
      const data = content.data as ZipPathData;
      const path = content.correctAnswer as number[];
      const totalCells = data.gridSize * data.gridSize;

      expect(path).toHaveLength(totalCells);
      expect(new Set(path).size).toBe(totalCells);
    }
  });

  it('every consecutive pair in the path is grid-adjacent', () => {
    const content = generateZipPath('hard');
    const data = content.data as ZipPathData;
    const path = content.correctAnswer as number[];

    for (let i = 1; i < path.length; i++) {
      expect(isAdjacent(path[i - 1], path[i], data.gridSize)).toBe(true);
    }
  });

  it('checkpoints sit on the path and appear in increasing order along it', () => {
    const content = generateZipPath('medium');
    const data = content.data as ZipPathData;
    const path = content.correctAnswer as number[];

    const sorted = [...data.checkpoints].sort((a, b) => a.order - b.order);
    let lastPosition = -1;
    for (const checkpoint of sorted) {
      const position = path.indexOf(checkpoint.cellIndex);
      expect(position).toBeGreaterThan(lastPosition);
      lastPosition = position;
    }
  });

  it('scales grid size up with difficulty', () => {
    const sizeAt = (difficulty: 'easy' | 'medium' | 'hard') =>
      (generateZipPath(difficulty).data as ZipPathData).gridSize;

    expect(sizeAt('easy')).toBeLessThan(sizeAt('medium'));
    expect(sizeAt('medium')).toBeLessThan(sizeAt('hard'));
  });
});
