import { GameContent } from '@cerebro-play/shared-models';
import { equalityValidator } from './equality-validator';

const content: GameContent = { prompt: 'What was it?', data: {}, correctAnswer: 42 };

describe('equalityValidator', () => {
  it('returns true when the submitted answer matches correctAnswer', () => {
    expect(equalityValidator.validate(content, 42)).toBe(true);
  });

  it('returns false when the submitted answer does not match', () => {
    expect(equalityValidator.validate(content, 43)).toBe(false);
  });

  it('returns false when no answer was submitted', () => {
    expect(equalityValidator.validate(content, undefined)).toBe(false);
  });
});
