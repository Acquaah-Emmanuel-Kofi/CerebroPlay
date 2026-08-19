import { GameContent } from '@cerebro-play/shared-models';
import { ZipPathData } from '@cerebro-play/game-data';
import { zipPathValidator } from './zip-path-validator';

function content(data: ZipPathData): GameContent {
  return { data, correctAnswer: [] };
}

describe('zipPathValidator', () => {
  // 3x3 grid: 0 1 2 / 3 4 5 / 6 7 8. Checkpoints at 0 (order 1) and 8 (order 3).
  const data: ZipPathData = {
    gridSize: 3,
    checkpoints: [
      { cellIndex: 0, order: 1 },
      { cellIndex: 8, order: 3 },
    ],
  };

  it('accepts a full-coverage adjacent path that hits checkpoints in order, even if it differs from any specific reference path', () => {
    const validPath = [0, 1, 2, 5, 4, 3, 6, 7, 8];
    expect(zipPathValidator.validate(content(data), validPath)).toBe(true);
  });

  it('accepts a different valid path through the same checkpoints', () => {
    const anotherValidPath = [0, 3, 6, 7, 4, 1, 2, 5, 8];
    expect(zipPathValidator.validate(content(data), anotherValidPath)).toBe(true);
  });

  it('rejects a path that skips a cell', () => {
    const incomplete = [0, 1, 2, 5, 4, 3, 6, 7];
    expect(zipPathValidator.validate(content(data), incomplete)).toBe(false);
  });

  it('rejects a path with a non-adjacent jump', () => {
    const jump = [0, 2, 1, 4, 5, 3, 6, 7, 8];
    expect(zipPathValidator.validate(content(data), jump)).toBe(false);
  });

  it('rejects a path that reaches the later checkpoint before the earlier one', () => {
    const reversedOrder = [8, 7, 6, 3, 4, 5, 2, 1, 0];
    expect(zipPathValidator.validate(content(data), reversedOrder)).toBe(false);
  });

  it('rejects a non-array submission', () => {
    expect(zipPathValidator.validate(content(data), 'not-a-path')).toBe(false);
  });
});
