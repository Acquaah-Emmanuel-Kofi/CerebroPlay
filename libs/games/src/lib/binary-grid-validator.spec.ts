import { GameContent } from '@cerebro-play/shared-models';
import { BinaryGridData } from '@cerebro-play/game-data';
import { binaryGridValidator } from './binary-grid-validator';

function content(data: BinaryGridData): GameContent {
  return { data, correctAnswer: [] };
}

describe('binaryGridValidator', () => {
  // A valid 4x4 solution:
  // 0 1 0 1
  // 1 0 1 0
  // 1 0 0 1
  // 0 1 1 0
  const validSolution = [0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0];
  const data: BinaryGridData = {
    size: 4,
    clues: [0, null, null, 1, null, 0, null, null, null, null, 0, null, 0, null, null, null],
  };

  it('accepts the reference solution', () => {
    expect(binaryGridValidator.validate(content(data), validSolution)).toBe(true);
  });

  it('accepts a different valid completion of the same clues, not just the reference one', () => {
    // Same clues (idx 0,3,5,10,12), a genuinely different Takuzu solution:
    // 0 0 1 1
    // 1 0 1 0
    // 1 1 0 0
    // 0 1 0 1
    const alternateSolution = [0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 1];
    expect(binaryGridValidator.validate(content(data), alternateSolution)).toBe(true);
  });

  it('rejects a grid that contradicts a given clue', () => {
    const wrongClue = [1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0]; // cell 0 flipped from clue's 0
    expect(binaryGridValidator.validate(content(data), wrongClue)).toBe(false);
  });

  it('rejects a grid with 3 in a row', () => {
    const threeInARow = [0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0];
    expect(binaryGridValidator.validate(content(data), threeInARow)).toBe(false);
  });

  it('rejects a grid with an unequal row split', () => {
    const unequalRow = [0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0];
    expect(binaryGridValidator.validate(content(data), unequalRow)).toBe(false);
  });
});
