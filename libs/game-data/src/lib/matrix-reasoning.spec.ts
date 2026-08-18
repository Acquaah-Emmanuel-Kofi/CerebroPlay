import { generateMatrixReasoning, MatrixReasoningData } from './matrix-reasoning';

describe('generateMatrixReasoning', () => {
  it('produces 8 visible cells and a correctAnswer following the row-shape/column-count rule', () => {
    for (let i = 0; i < 50; i++) {
      const content = generateMatrixReasoning();
      const data = content.data as MatrixReasoningData;
      expect(data.grid).toHaveLength(8);
      // Row 2's visible cells are grid[6] (col 0, count 1) and grid[7] (col 1, count 2);
      // the missing cell (col 2) should be that same shape repeated 3 times.
      const row2Shape = data.grid[6];
      expect(content.correctAnswer).toBe(row2Shape.repeat(3));
    }
  });

  it('always offers exactly 4 unique options containing the correct answer', () => {
    for (let i = 0; i < 50; i++) {
      const content = generateMatrixReasoning();
      const data = content.data as MatrixReasoningData;
      expect(data.options).toHaveLength(4);
      expect(new Set(data.options).size).toBe(4);
      expect(data.options).toContain(content.correctAnswer);
    }
  });
});
