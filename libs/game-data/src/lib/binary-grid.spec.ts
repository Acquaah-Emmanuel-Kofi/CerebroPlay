import { generateBinaryGrid, BinaryGridData } from './binary-grid';

function hasNoThreeInARow(grid: number[], size: number): boolean {
  for (let row = 0; row < size; row++) {
    for (let col = 2; col < size; col++) {
      const a = grid[row * size + col - 2];
      const b = grid[row * size + col - 1];
      const c = grid[row * size + col];
      if (a === b && b === c) return false;
    }
  }
  for (let col = 0; col < size; col++) {
    for (let row = 2; row < size; row++) {
      const a = grid[(row - 2) * size + col];
      const b = grid[(row - 1) * size + col];
      const c = grid[row * size + col];
      if (a === b && b === c) return false;
    }
  }
  return true;
}

function hasEqualSplit(grid: number[], size: number): boolean {
  for (let row = 0; row < size; row++) {
    const line = grid.slice(row * size, row * size + size);
    if (line.filter((v) => v === 0).length !== size / 2) return false;
  }
  for (let col = 0; col < size; col++) {
    const line = Array.from({ length: size }, (_, row) => grid[row * size + col]);
    if (line.filter((v) => v === 0).length !== size / 2) return false;
  }
  return true;
}

describe('generateBinaryGrid', () => {
  it('produces a complete, rule-satisfying solution as correctAnswer', () => {
    for (const difficulty of ['easy', 'medium', 'hard', 'expert'] as const) {
      const content = generateBinaryGrid(difficulty);
      const data = content.data as BinaryGridData;
      const solution = content.correctAnswer as number[];

      expect(solution).toHaveLength(data.size * data.size);
      expect(hasNoThreeInARow(solution, data.size)).toBe(true);
      expect(hasEqualSplit(solution, data.size)).toBe(true);
    }
  });

  it('every given clue matches the solution at the same position', () => {
    const content = generateBinaryGrid('medium');
    const data = content.data as BinaryGridData;
    const solution = content.correctAnswer as number[];

    data.clues.forEach((clue, index) => {
      if (clue !== null) expect(clue).toBe(solution[index]);
    });
  });

  it('leaves a lower clue fraction (a harder puzzle) as difficulty increases', () => {
    const clueFractionAt = (difficulty: 'easy' | 'hard') => {
      const data = generateBinaryGrid(difficulty).data as BinaryGridData;
      return data.clues.filter((c) => c !== null).length / data.clues.length;
    };

    expect(clueFractionAt('hard')).toBeLessThan(clueFractionAt('easy'));
  });
});
