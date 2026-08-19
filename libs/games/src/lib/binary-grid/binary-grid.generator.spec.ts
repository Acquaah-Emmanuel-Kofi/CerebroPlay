import { BinaryGridData } from '@cerebro-play/game-data';
import { binaryGridGenerator } from './binary-grid.generator';

describe('binaryGridGenerator', () => {
  it('produces a solution consistent with its own clues', () => {
    const content = binaryGridGenerator.generate({ difficulty: 'medium' });
    const data = content.data as BinaryGridData;
    const solution = content.correctAnswer as number[];

    data.clues.forEach((clue, index) => {
      if (clue !== null) expect(clue).toBe(solution[index]);
    });
  });
});
