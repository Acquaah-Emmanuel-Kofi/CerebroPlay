import { AnswerValidator } from '@cerebro-play/shared-models';
import { BinaryGridData } from '@cerebro-play/game-data';

/**
 * Same fairness reasoning as zipPathValidator: a binary grid with clues removed can
 * have more than one valid completion, so this checks the submitted grid structurally
 * (matches every given clue, no 3-in-a-row, equal split per row/column) rather than
 * exact-matching the generator's own reference solution.
 */
export const binaryGridValidator: AnswerValidator = {
  validate(content, submittedAnswer) {
    if (!Array.isArray(submittedAnswer)) return false;
    const grid = submittedAnswer as number[];
    const data = content.data as BinaryGridData;
    const size = data.size;

    if (grid.length !== size * size) return false;
    for (let i = 0; i < grid.length; i++) {
      if (grid[i] !== 0 && grid[i] !== 1) return false;
      if (data.clues[i] !== null && data.clues[i] !== grid[i]) return false;
    }

    const half = size / 2;

    for (let row = 0; row < size; row++) {
      let zeroCount = 0;
      for (let col = 0; col < size; col++) {
        const value = grid[row * size + col];
        if (value === 0) zeroCount++;
        if (col >= 2 && value === grid[row * size + col - 1] && value === grid[row * size + col - 2]) return false;
      }
      if (zeroCount !== half) return false;
    }

    for (let col = 0; col < size; col++) {
      let zeroCount = 0;
      for (let row = 0; row < size; row++) {
        const value = grid[row * size + col];
        if (value === 0) zeroCount++;
        if (row >= 2 && value === grid[(row - 1) * size + col] && value === grid[(row - 2) * size + col]) return false;
      }
      if (zeroCount !== half) return false;
    }

    return true;
  },
};
