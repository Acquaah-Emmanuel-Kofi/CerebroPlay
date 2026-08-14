import { GameContent } from '@cerebro-play/shared-models';
import { setEqualityValidator } from './set-equality-validator';

const content: GameContent = { prompt: 'Pick the cells', data: {}, correctAnswer: [3, 7, 12] };

describe('setEqualityValidator', () => {
  it('returns true when the submitted set matches, regardless of order', () => {
    expect(setEqualityValidator.validate(content, [12, 3, 7])).toBe(true);
  });

  it('returns false when a different set of the same length is submitted', () => {
    expect(setEqualityValidator.validate(content, [3, 7, 13])).toBe(false);
  });

  it('returns false when the submitted set has a different length', () => {
    expect(setEqualityValidator.validate(content, [3, 7])).toBe(false);
  });

  it('returns false when nothing was submitted (timer expiry)', () => {
    expect(setEqualityValidator.validate(content, undefined)).toBe(false);
  });

  it('returns false when correctAnswer is not an array', () => {
    const scalarContent: GameContent = { data: {}, correctAnswer: 42 };
    expect(setEqualityValidator.validate(scalarContent, [42])).toBe(false);
  });
});
