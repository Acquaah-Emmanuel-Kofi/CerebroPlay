import { GameContent } from '@cerebro-play/shared-models';
import { arrayEqualityValidator } from './array-equality-validator';

function content(correctAnswer: unknown): GameContent {
  return { data: {}, correctAnswer };
}

describe('arrayEqualityValidator', () => {
  it('accepts an array matching both values and positions', () => {
    expect(arrayEqualityValidator.validate(content([0, 1, 2]), [0, 1, 2])).toBe(true);
  });

  it('rejects the same values in a different order (order matters here, unlike setEqualityValidator)', () => {
    expect(arrayEqualityValidator.validate(content([0, 1, 2]), [1, 0, 2])).toBe(false);
  });

  it('rejects a different length', () => {
    expect(arrayEqualityValidator.validate(content([0, 1, 2]), [0, 1])).toBe(false);
  });

  it('rejects non-array submissions', () => {
    expect(arrayEqualityValidator.validate(content([0, 1, 2]), 'not-an-array')).toBe(false);
  });
});
